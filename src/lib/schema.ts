// The JSON schema for a Prep (lib/prep.ts), sent as the Claude API's
// structured-output format so the reply is always valid JSON in this shape.
// The API's schemas need `additionalProperties: false` and `required` on every
// object, and don't support length limits, so counts (four options, five
// situations) stay in the prompt and in `isPrep`.

const obj = (properties: Record<string, unknown>) => ({
	type: 'object',
	properties,
	required: Object.keys(properties),
	additionalProperties: false,
});
const str = { type: 'string' };
const strs = { type: 'array', items: str };
const list = (items: unknown) => ({ type: 'array', items });

export const prepSchema = obj({
	company: str,
	role: str,
	summary: obj({
		hiringFor: str,
		mustHaves: strs,
		niceToHaves: strs,
		betweenTheLines: strs,
		seniority: str,
		likelyLoop: strs,
	}),
	fit: list(obj({ requirement: str, evidence: str, strength: { type: 'string', enum: ['strong', 'partial', 'gap'] } })),
	gaps: list(obj({ gap: str, howToAnswer: str })),
	pitch: str,
	questions: list(
		obj({
			question: str,
			type: { type: 'string', enum: ['behavioral', 'role', 'technical', 'motivation'] },
			whyTheyAsk: str,
			useStory: str,
			outline: obj({ situation: str, task: str, action: str, result: str }),
		}),
	),
	stories: list(obj({ title: str, fromResume: str, themes: strs })),
	askThem: list(obj({ question: str, why: str })),
	salary: strs,
	companyNotes: strs,
	practice: list(obj({ situation: str, options: strs, answer: { type: 'integer' }, why: str })),
});
