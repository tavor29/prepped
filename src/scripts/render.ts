// Turns a Prep into HTML. It's used at build time for the example page
// (set:html) and in the browser for a fresh prep, so the markup is one string
// and every value from the AI is escaped. `wirePrep` adds the interactive bits
// afterwards: the practice situations, copy as text and print.
import type { Prep, Strength } from '../lib/prep';

const esc = (s: string) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const shapes = {
	half: 'M0 0A24 12 0 0 1 0 24Z',
	quarter: 'M0 0A24 24 0 0 1 24 24H0Z',
	circle: 'M12 0a12 12 0 1 1 0 24a12 12 0 1 1 0-24Z',
	leaf: 'M0 0H12A12 12 0 0 1 24 12V24H12A12 12 0 0 1 0 12Z',
} as const;
type Shape = keyof typeof shapes;
/** Same shapes and colours as components/Icon.astro, for HTML built as a string. */
const mark = (name: Shape, size = 14) =>
	`<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" style="flex-shrink:0;fill:var(--mark-${name})"><path d="${shapes[name]}"/></svg>`;

const strengthMark: Record<Strength, [Shape, string]> = {
	strong: ['leaf', 'Strong'],
	partial: ['circle', 'Partial'],
	gap: ['quarter', 'Gap'],
};
const stageName: Record<string, string> = {
	recruiter: 'Recruiter screen',
	'hiring-manager': 'Hiring manager interview',
	panel: 'Panel or final round',
	unknown: 'Interview',
};
const typeName: Record<string, string> = { behavioral: 'Behavioral', role: 'Role', technical: 'Technical', motivation: 'Motivation' };
const letters = ['A', 'B', 'C', 'D'];

const label = (text: string, extra = '') => `<p class="font-label text-xs uppercase tracking-label text-ink-muted ${extra}">${text}</p>`;
const list = (items: string[]) => `<ul class="prep-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

function section(n: number, id: string, title: string, body: string, shape: Shape) {
	const num = String(n).padStart(2, '0');
	return `<section id="${id}" class="prep-section">
		<div class="flex items-baseline justify-between gap-gutter">
			<h2 class="font-display text-2xl leading-title tracking-display">${title}</h2>
			<span class="flex items-center gap-tight text-sm text-ink-muted">${mark(shape)}(${num})</span>
		</div>
		${body}
	</section>`;
}

export function renderPrep(p: Prep, opts: { stage?: string; note?: string } = {}) {
	const words = p.pitch.trim().split(/\s+/).length;
	const seconds = Math.round((words / 150) * 60);
	const nav = [
		['hiring', 'What they want'],
		['fit', 'Your fit'],
		['gaps', 'Gaps'],
		['pitch', 'About you'],
		['questions', 'Questions'],
		['stories', 'Stories'],
		['ask', 'Ask them'],
		['practice', 'Practice'],
	];

	return `<article class="prep flex flex-col gap-title" data-prep>
	<header class="flex flex-col gap-gutter">
		${label('Interview prep')}
		<h1 class="font-display text-3xl leading-display tracking-display">${esc(p.role)}</h1>
		<p class="text-lg text-ink-muted">${esc(p.company)}${opts.stage ? ` · ${esc(stageName[opts.stage] ?? 'Interview')}` : ''}</p>
		${opts.note ? `<p class="prep-note">${opts.note}</p>` : ''}
		<div class="prep-actions flex flex-wrap items-center gap-gutter">
			<button type="button" data-print class="btn">Print or save as PDF</button>
			<button type="button" data-copy class="link text-sm">Copy as text</button>
			<span data-copied class="text-sm text-ink-muted" hidden>Copied.</span>
		</div>
		<nav aria-label="Sections" class="prep-nav flex flex-wrap gap-tight">
			${nav.map(([id, name]) => `<a href="#${id}" class="pill">${name}</a>`).join('')}
		</nav>
	</header>

	${section(
		1,
		'hiring',
		'What they’re really hiring for',
		`<p class="max-w-3xl text-lg">${esc(p.summary.hiringFor)}</p>
		<div class="grid gap-stack md:grid-cols-3">
			<div class="flex flex-col gap-tight">${label('Must-haves')}${list(p.summary.mustHaves)}</div>
			<div class="flex flex-col gap-tight">${label('Nice-to-haves')}${list(p.summary.niceToHaves)}</div>
			<div class="flex flex-col gap-tight">${label('Between the lines')}${list(p.summary.betweenTheLines)}</div>
		</div>
		<div class="grid gap-stack md:grid-cols-3">
			<div class="flex flex-col gap-tight">${label('Level')}<p>${esc(p.summary.seniority)}</p></div>
			<div class="flex flex-col gap-tight md:col-span-2">${label('Likely interview loop')}
				<ol class="prep-steps">${p.summary.likelyLoop.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
			</div>
		</div>`,
		'half',
	)}

	${section(
		2,
		'fit',
		'Your fit, line by line',
		`<ul class="prep-rows">${p.fit
			.map((f) => {
				const [shape, name] = strengthMark[f.strength];
				return `<li class="prep-fit">
					<p class="font-semibold">${esc(f.requirement)}</p>
					<p class="text-ink-muted">${esc(f.evidence)}</p>
					<p class="flex items-center gap-tight text-sm font-semibold">${mark(shape)}${name}</p>
				</li>`;
			})
			.join('')}</ul>`,
		'quarter',
	)}

	${section(
		3,
		'gaps',
		'Gaps and how to answer them',
		`<ul class="grid gap-gutter md:grid-cols-2">${p.gaps
			.map(
				(g) => `<li class="prep-card">
					<p class="flex items-center gap-tight font-semibold">${mark('quarter')}${esc(g.gap)}</p>
					<p class="text-ink-muted">${esc(g.howToAnswer)}</p>
				</li>`,
			)
			.join('')}</ul>`,
		'circle',
	)}

	${section(
		4,
		'pitch',
		'Tell me about yourself',
		`<div class="prep-pitch">
			<p class="text-lg">${esc(p.pitch)}</p>
			${label(`About ${seconds} seconds out loud · ${words} words`)}
		</div>`,
		'leaf',
	)}

	${section(
		5,
		'questions',
		'Questions they’re likely to ask',
		`<ol class="prep-rows">${p.questions
			.map(
				(q, i) => `<li>
				<details class="prep-q">
					<summary>
						<span class="prep-q-num">${i + 1}</span>
						<span class="grow font-semibold">${esc(q.question)}</span>
						<span class="text-sm text-ink-muted">${typeName[q.type] ?? esc(q.type)}</span>
					</summary>
					<div class="prep-q-body">
						<p><span class="font-semibold">Why they ask: </span><span class="text-ink-muted">${esc(q.whyTheyAsk)}</span></p>
						${q.useStory ? `<p><span class="font-semibold">Use your story: </span><span class="text-ink-muted">${esc(q.useStory)}</span></p>` : ''}
						<dl class="prep-star">
							<dt>Situation</dt><dd>${esc(q.outline.situation)}</dd>
							<dt>Task</dt><dd>${esc(q.outline.task)}</dd>
							<dt>Action</dt><dd>${esc(q.outline.action)}</dd>
							<dt>Result</dt><dd>${esc(q.outline.result)}</dd>
						</dl>
					</div>
				</details>
			</li>`,
			)
			.join('')}</ol>
		<p class="text-sm text-ink-muted">Anything in [brackets] is a fact only you know. Fill it in before the interview.</p>`,
		'half',
	)}

	${section(
		6,
		'stories',
		'Your story bank',
		`<ul class="grid gap-gutter md:grid-cols-2">${p.stories
			.map(
				(s) => `<li class="prep-card">
					<p class="font-semibold">${esc(s.title)}</p>
					<p class="text-ink-muted">${esc(s.fromResume)}</p>
					<p class="flex flex-wrap gap-tight">${s.themes.map((t) => `<span class="prep-tag">${esc(t)}</span>`).join('')}</p>
				</li>`,
			)
			.join('')}</ul>`,
		'quarter',
	)}

	${section(
		7,
		'ask',
		'Questions to ask them',
		`<ul class="prep-rows">${p.askThem
			.map((a) => `<li class="flex flex-col gap-1"><p class="font-semibold">${esc(a.question)}</p><p class="text-ink-muted">${esc(a.why)}</p></li>`)
			.join('')}</ul>`,
		'circle',
	)}

	${section(
		8,
		'company',
		'Pay, and what to check first',
		`<div class="grid gap-stack md:grid-cols-2">
			<div class="flex flex-col gap-tight">${label('The pay conversation')}${list(p.salary)}</div>
			<div class="flex flex-col gap-tight">${label('Verify about the company')}${list(p.companyNotes)}
				<p class="text-sm text-ink-muted">From the AI’s general knowledge, which may be out of date. Check before you rely on it.</p>
			</div>
		</div>`,
		'leaf',
	)}

	${section(
		9,
		'practice',
		'Practice: make the call',
		`<p class="max-w-3xl text-ink-muted">Five situations from this role’s day-to-day work. Pick what you’d do, then see the best answer and why.</p>
		<ol class="flex flex-col gap-stack">${p.practice
			.map(
				(x, i) => `<li class="prep-practice" data-practice data-answer="${x.answer}">
					${label(`Situation ${i + 1} of ${p.practice.length}`)}
					<p class="font-display text-xl leading-title tracking-display">${esc(x.situation)}</p>
					<ul class="grid gap-tight md:grid-cols-2">${x.options
						.map(
							(o, j) => `<li><button type="button" class="option" data-option="${j}">
								<span class="font-label text-xs uppercase tracking-label text-ink-muted pt-1">${letters[j]}</span>
								<span class="grow">${esc(o)}</span>
								<span data-mark="right" hidden class="pt-1">${mark('leaf')}</span>
								<span data-mark="wrong" hidden class="pt-1">${mark('quarter')}</span>
							</button></li>`,
						)
						.join('')}</ul>
					<div data-feedback hidden class="flex flex-col gap-tight">
						<p data-verdict class="text-lg font-semibold"></p>
						<p class="text-ink-muted"><span class="font-semibold text-ink">Why: </span>${esc(x.why)}</p>
					</div>
				</li>`,
			)
			.join('')}</ol>`,
		'half',
	)}
</article>`;
}

/** Plain text for "Copy as text": the whole prep, readable in any doc or note. */
export function prepToText(p: Prep) {
	const lines: string[] = [];
	const h = (t: string) => lines.push('', t.toUpperCase(), '');
	const b = (items: string[]) => items.forEach((i) => lines.push(`- ${i}`));
	lines.push(`${p.role}, ${p.company}`);
	h('What they’re really hiring for');
	lines.push(p.summary.hiringFor, '', 'Must-haves:');
	b(p.summary.mustHaves);
	lines.push('', 'Nice-to-haves:');
	b(p.summary.niceToHaves);
	lines.push('', 'Between the lines:');
	b(p.summary.betweenTheLines);
	lines.push('', `Level: ${p.summary.seniority}`, `Likely loop: ${p.summary.likelyLoop.join(' → ')}`);
	h('Your fit');
	p.fit.forEach((f) => lines.push(`- [${strengthMark[f.strength][1]}] ${f.requirement}: ${f.evidence}`));
	h('Gaps and how to answer them');
	p.gaps.forEach((g) => lines.push(`- ${g.gap}: ${g.howToAnswer}`));
	h('Tell me about yourself');
	lines.push(p.pitch);
	h('Likely questions');
	p.questions.forEach((q, i) => {
		lines.push(`${i + 1}. ${q.question} (${typeName[q.type] ?? q.type})`, `   Why they ask: ${q.whyTheyAsk}`);
		if (q.useStory) lines.push(`   Story: ${q.useStory}`);
		lines.push(
			`   S: ${q.outline.situation}`,
			`   T: ${q.outline.task}`,
			`   A: ${q.outline.action}`,
			`   R: ${q.outline.result}`,
			'',
		);
	});
	h('Your story bank');
	p.stories.forEach((s) => lines.push(`- ${s.title}: ${s.fromResume} (${s.themes.join(', ')})`));
	h('Questions to ask them');
	p.askThem.forEach((a) => lines.push(`- ${a.question} (${a.why})`));
	h('The pay conversation');
	b(p.salary);
	h('Verify about the company');
	b(p.companyNotes);
	return lines.join('\n').trim();
}

const RIGHT = ['Correct. Good call.', 'Spot on.', 'Right, that’s the one that holds up.'];
const WRONG = ['Not quite. Here’s why.', 'Close, but not the best move.', 'A reasonable move, but not the best one.'];

/** Adds the interactive parts to a rendered prep. */
export function wirePrep(root: HTMLElement, p: Prep) {
	root.querySelectorAll<HTMLElement>('[data-practice]').forEach((item, i) => {
		const answer = Number(item.dataset.answer);
		const options = [...item.querySelectorAll<HTMLButtonElement>('[data-option]')];
		options.forEach((btn) =>
			btn.addEventListener('click', () => {
				const picked = Number(btn.dataset.option);
				const correct = picked === answer;
				options.forEach((o, j) => {
					o.disabled = true;
					o.dataset.state = j === answer ? 'right' : j === picked ? 'wrong' : 'dim';
					o.querySelector<HTMLElement>('[data-mark="right"]')!.hidden = j !== answer;
					o.querySelector<HTMLElement>('[data-mark="wrong"]')!.hidden = !(j === picked && !correct);
				});
				const verdict = item.querySelector<HTMLElement>('[data-verdict]')!;
				verdict.textContent = (correct ? RIGHT : WRONG)[i % 3];
				verdict.dataset.correct = String(correct);
				item.querySelector<HTMLElement>('[data-feedback]')!.hidden = false;
			}),
		);
	});

	root.querySelector('[data-print]')?.addEventListener('click', () => {
		// Open every question so the printout has the full outlines.
		root.querySelectorAll('details').forEach((d) => (d.open = true));
		window.print();
	});
	root.querySelector('[data-copy]')?.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(prepToText(p));
			const done = root.querySelector<HTMLElement>('[data-copied]')!;
			done.hidden = false;
			setTimeout(() => (done.hidden = true), 2500);
		} catch {
			/* Clipboard blocked: nothing to do. */
		}
	});
}
