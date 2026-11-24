// The shape of one interview prep. The server function asks the AI (through
// the Make.com scenario) for exactly this JSON, checks it with `isPrep`, and
// the page renders it with scripts/render.ts. The example prep and the
// stand-in response before Make is connected use the same shape.

export type Stage = 'recruiter' | 'hiring-manager' | 'panel' | 'unknown';
export type Strength = 'strong' | 'partial' | 'gap';
export type QuestionType = 'behavioral' | 'role' | 'technical' | 'motivation';

export type Prep = {
	company: string;
	role: string;
	/** What they're really hiring for. */
	summary: {
		hiringFor: string;
		mustHaves: string[];
		niceToHaves: string[];
		betweenTheLines: string[];
		seniority: string;
		likelyLoop: string[];
	};
	/** Each requirement in the job post against evidence from the résumé. */
	fit: { requirement: string; evidence: string; strength: Strength }[];
	gaps: { gap: string; howToAnswer: string }[];
	/** "Tell me about yourself", 60 to 90 seconds spoken. */
	pitch: string;
	questions: {
		question: string;
		type: QuestionType;
		whyTheyAsk: string;
		/** Title of a story from `stories`, or empty. */
		useStory: string;
		outline: { situation: string; task: string; action: string; result: string };
	}[];
	stories: { title: string; fromResume: string; themes: string[] }[];
	askThem: { question: string; why: string }[];
	salary: string[];
	/** What the AI knows about the company in general: always to be verified. */
	companyNotes: string[];
	/** Role-specific situations in the Your Call format. */
	practice: { situation: string; options: [string, string, string, string]; answer: number; why: string }[];
};

export type PrepRequest = {
	company: string;
	jobDescription: string;
	resume: string;
	stage: Stage;
	turnstileToken?: string;
};

export const LIMITS = { company: 120, jobDescription: 15000, resume: 20000 };

const str = (v: unknown) => typeof v === 'string';
const strs = (v: unknown) => Array.isArray(v) && v.every(str);
const arr = (v: unknown, each: (x: any) => boolean) => Array.isArray(v) && v.every(each);

/** A light structural check, so a malformed AI reply never reaches the page. */
export function isPrep(p: any): p is Prep {
	return (
		p &&
		str(p.company) &&
		str(p.role) &&
		p.summary &&
		str(p.summary.hiringFor) &&
		strs(p.summary.mustHaves) &&
		strs(p.summary.niceToHaves) &&
		strs(p.summary.betweenTheLines) &&
		str(p.summary.seniority) &&
		strs(p.summary.likelyLoop) &&
		arr(p.fit, (f) => str(f.requirement) && str(f.evidence) && ['strong', 'partial', 'gap'].includes(f.strength)) &&
		arr(p.gaps, (g) => str(g.gap) && str(g.howToAnswer)) &&
		str(p.pitch) &&
		arr(
			p.questions,
			(q) =>
				str(q.question) &&
				str(q.type) &&
				str(q.whyTheyAsk) &&
				str(q.useStory) &&
				q.outline &&
				str(q.outline.situation) &&
				str(q.outline.task) &&
				str(q.outline.action) &&
				str(q.outline.result),
		) &&
		arr(p.stories, (s) => str(s.title) && str(s.fromResume) && strs(s.themes)) &&
		arr(p.askThem, (a) => str(a.question) && str(a.why)) &&
		strs(p.salary) &&
		strs(p.companyNotes) &&
		arr(
			p.practice,
			(x) => str(x.situation) && strs(x.options) && x.options.length === 4 && Number.isInteger(x.answer) && x.answer >= 0 && x.answer < 4 && str(x.why),
		)
	);
}

/** Pull the JSON object out of a model reply that may be wrapped in a code fence or prose. */
export function extractJson(text: string): unknown {
	const start = text.indexOf('{');
	const end = text.lastIndexOf('}');
	if (start === -1 || end <= start) throw new Error('No JSON object in the reply.');
	return JSON.parse(text.slice(start, end + 1));
}
