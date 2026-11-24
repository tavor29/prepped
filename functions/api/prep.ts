// POST /api/prep: a Cloudflare Pages Function between the page and the
// Make.com scenario that runs the AI. It keeps the webhook URL secret, checks
// the Turnstile token, enforces daily limits, builds the prompt, and checks the
// reply's shape before it reaches the page. It stores and logs nothing from the
// résumé or the job post.
//
// Settings (Cloudflare Pages > Settings > Variables and secrets):
//   MAKE_WEBHOOK_URL   secret  the scenario's custom webhook URL
//   MAKE_WEBHOOK_KEY   secret  sent as `key` in the body; the scenario's filter checks it
//   TURNSTILE_SECRET   secret  Turnstile secret key (the page needs PUBLIC_TURNSTILE_SITE_KEY)
//   RATE               KV namespace binding for the daily limits (optional)
//   LIMIT_PER_VISITOR  preps per visitor per day (default 3)
//   LIMIT_TOTAL        preps per day across the site (default 100)
// Without MAKE_WEBHOOK_URL it returns the example prep, marked `demo: true`.
import { isPrep, extractJson, LIMITS, type PrepRequest, type Stage } from '../../src/lib/prep';
import { system, user } from '../../src/lib/prompt';
import { example } from '../../src/data/example';

interface KV {
	get(key: string): Promise<string | null>;
	put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
interface Env {
	MAKE_WEBHOOK_URL?: string;
	MAKE_WEBHOOK_KEY?: string;
	TURNSTILE_SECRET?: string;
	RATE?: KV;
	LIMIT_PER_VISITOR?: string;
	LIMIT_TOTAL?: string;
}
type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (status: number, error: string) => json({ error }, status);

const STAGES: Stage[] = ['recruiter', 'hiring-manager', 'panel', 'unknown'];

async function verifyTurnstile(secret: string, token: string | undefined, ip: string) {
	if (!token) return false;
	const form = new FormData();
	form.append('secret', secret);
	form.append('response', token);
	if (ip) form.append('remoteip', ip);
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
	const data = (await res.json()) as { success?: boolean };
	return data.success === true;
}

async function sha256(text: string) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

/** Counts a prep against today's limits. Returns an error message when over. */
async function overLimit(env: Env, ip: string) {
	if (!env.RATE) return null;
	const day = new Date().toISOString().slice(0, 10);
	const visitorKey = `v:${day}:${await sha256(ip || 'unknown')}`;
	const totalKey = `t:${day}`;
	const perVisitor = Number(env.LIMIT_PER_VISITOR ?? 3);
	const total = Number(env.LIMIT_TOTAL ?? 100);
	const [v, t] = await Promise.all([env.RATE.get(visitorKey), env.RATE.get(totalKey)]);
	if (Number(t ?? 0) >= total) return 'Prepped has hit its limit for today. Please try again tomorrow.';
	if (Number(v ?? 0) >= perVisitor) return `You’ve made ${perVisitor} preps today, the daily limit. Please come back tomorrow.`;
	const ttl = 60 * 60 * 26;
	await Promise.all([
		env.RATE.put(visitorKey, String(Number(v ?? 0) + 1), { expirationTtl: ttl }),
		env.RATE.put(totalKey, String(Number(t ?? 0) + 1), { expirationTtl: ttl }),
	]);
	return null;
}

export const onRequestPost = async ({ request, env }: Ctx) => {
	let body: PrepRequest;
	try {
		body = (await request.json()) as PrepRequest;
	} catch {
		return fail(400, 'The request wasn’t valid JSON.');
	}

	const company = String(body.company ?? '').trim();
	const jobDescription = String(body.jobDescription ?? '').trim();
	const resume = String(body.resume ?? '').trim();
	const stage: Stage = STAGES.includes(body.stage) ? body.stage : 'unknown';
	if (!company || !jobDescription || !resume) return fail(400, 'Add the company, the job description and your résumé.');
	if (company.length > LIMITS.company) return fail(400, 'The company name is too long.');
	if (jobDescription.length > LIMITS.jobDescription) return fail(400, `The job description is over ${LIMITS.jobDescription.toLocaleString()} characters.`);
	if (resume.length > LIMITS.resume) return fail(400, `The résumé is over ${LIMITS.resume.toLocaleString()} characters.`);
	if (jobDescription.length < 200) return fail(400, 'The job description looks too short. Paste the whole post.');
	if (resume.length < 300) return fail(400, 'The résumé looks too short. If it’s a scanned PDF, paste the text instead.');

	const ip = request.headers.get('cf-connecting-ip') ?? '';
	if (env.TURNSTILE_SECRET && !(await verifyTurnstile(env.TURNSTILE_SECRET, body.turnstileToken, ip))) {
		return fail(403, 'The bot check didn’t pass. Refresh the page and try again.');
	}

	// Not connected yet: show the example so the page can be tried end to end.
	if (!env.MAKE_WEBHOOK_URL) return json({ prep: example, demo: true });

	const limited = await overLimit(env, ip);
	if (limited) return fail(429, limited);

	const req: PrepRequest = { company, jobDescription, resume, stage };
	let reply: Response;
	try {
		reply = await fetch(env.MAKE_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ key: env.MAKE_WEBHOOK_KEY ?? '', system, user: user(req) }),
		});
	} catch {
		return fail(502, 'Couldn’t reach the AI service. Please try again in a minute.');
	}
	if (!reply.ok) return fail(502, 'The AI service had a problem. Please try again in a minute.');

	const text = await reply.text();
	let prep: unknown;
	try {
		// Make may return the model's text, or JSON with the text inside it.
		const outer = extractJson(text) as Record<string, unknown>;
		prep = isPrep(outer) ? outer : typeof outer.result === 'string' ? extractJson(outer.result) : outer;
	} catch {
		return fail(502, 'The AI’s reply couldn’t be read. Please try again.');
	}
	if (!isPrep(prep)) return fail(502, 'The AI’s reply was incomplete. Please try again.');
	return json({ prep });
};
