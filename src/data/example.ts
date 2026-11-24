// The "See an example" prep, also returned by the server function before the
// Make.com scenario is connected. Everything here is fictional: the candidate
// (Jordan Reyes), the companies (Tidewell, Kestrel Payments, Bluefin Telecom)
// and the job post. Never base the example on a real person's files.
import type { Prep } from '../lib/prep';

export const exampleInputs = {
	company: 'Tidewell',
	role: 'Technical Program Manager, Payments Platform',
	stage: 'hiring-manager' as const,
	resumeNote: 'Jordan Reyes: 7 years as a project manager at a payments company and a telecom, PMP certified.',
};

export const example: Prep = {
	company: 'Tidewell',
	role: 'Technical Program Manager, Payments Platform',
	summary: {
		hiringFor:
			'Tidewell is scaling its payments platform (ledger and payouts) across several engineering teams and needs one person to keep those programs moving together. The hire turns a busy roadmap into milestones engineering leads believe in, and keeps executives informed without slowing the teams down.',
		mustHaves: [
			'Running programs that span several engineering teams',
			'Comfort with APIs and distributed systems, enough to follow technical trade-offs',
			'Managing dependencies and risk on a shared roadmap',
			'Clear status and decisions for executives',
			'Using data (SQL) to track delivery',
		],
		niceToHaves: ['Payments or compliance experience (PCI DSS, SOC 2)', 'Launching in new markets such as the EU', 'An engineering background'],
		betweenTheLines: [
			'They’ve had programs slip between teams: the post mentions “dependencies” three times.',
			'Engineering leads may be skeptical of process: “partner with” and “lightweight” suggest they want help, not overhead.',
			'An EU launch is likely soon: it’s a nice-to-have now, but it’s why compliance experience matters.',
			'Growing from about 300 people, they want someone who can set up the first real program rhythm.',
		],
		seniority: 'Senior individual contributor: owns programs end to end, with no direct reports.',
		likelyLoop: ['Recruiter screen', 'Hiring manager interview', 'Technical deep-dive with an engineering lead', 'Cross-functional panel', 'Final with a VP'],
	},
	fit: [
		{
			requirement: 'Programs across several engineering teams',
			evidence: 'Led the move of card processing to a new cloud platform across 4 teams in 9 months at Kestrel Payments.',
			strength: 'strong',
		},
		{
			requirement: 'Payments and compliance',
			evidence: 'Five years at Kestrel Payments; ran preparation for the annual PCI DSS audit.',
			strength: 'strong',
		},
		{
			requirement: 'Risk and dependency management',
			evidence: 'The migration had zero failed transactions at cutover; the résumé doesn’t say how risks were tracked.',
			strength: 'partial',
		},
		{
			requirement: 'Executive communication',
			evidence: 'Not shown directly. The billing rollout at Bluefin reached 1.2M customers, so leadership reporting is likely: add it.',
			strength: 'partial',
		},
		{
			requirement: 'APIs and distributed systems',
			evidence: 'Platform migration experience, but no technical depth described.',
			strength: 'partial',
		},
		{ requirement: 'Data-driven delivery (SQL)', evidence: '“SQL basics” is listed under skills, with no example of using it.', strength: 'partial' },
		{ requirement: 'Engineering background', evidence: 'B.Sc. in Industrial Engineering; not a former software engineer.', strength: 'gap' },
		{ requirement: 'New-market launch', evidence: 'Nothing on the résumé.', strength: 'gap' },
	],
	gaps: [
		{
			gap: 'No software engineering background',
			howToAnswer:
				'Say it plainly, then show how you work with engineers: on the cloud migration you learned the architecture well enough to sequence 4 teams’ work and spot the dependency that would have blocked cutover. Offer to go deep on that example.',
		},
		{
			gap: 'No new-market launch',
			howToAnswer:
				'Point to the closest thing: the PCI DSS audit is regulated work with fixed external deadlines, which is most of what makes a market launch hard. Ask what the EU plans look like; it shows you read the post closely.',
		},
		{
			gap: 'SQL listed but not shown',
			howToAnswer:
				'Be honest about your level. Describe what you actually pulled or tracked with it [add your example], and what you’d want to measure on Tidewell’s platform.',
		},
	],
	pitch:
		'I’m a project manager who spends most of my time where several engineering teams have to land one thing together. For the last five years that’s been at Kestrel Payments, where I led the move of our card processing to a new cloud platform: four teams, nine months, and not one failed transaction at cutover. Along the way I took on our PCI DSS audit preparation, and I changed our releases from monthly to every two weeks with a release train the teams actually liked. Before that, at Bluefin Telecom, I rolled out a new billing system to 1.2 million customers with three offshore teams. What I enjoy is turning a crowded roadmap into a plan engineering leads believe in. Tidewell’s payments platform sounds like that problem at an earlier, faster stage, and with an EU launch possibly ahead, it’s the kind of program I want to run next.',
	questions: [
		{
			question: 'Tell me about a program where several teams depended on each other. How did you keep it on track?',
			type: 'behavioral',
			whyTheyAsk: 'This is the core of the job: whether you manage dependencies actively or just report on them.',
			useStory: 'Card processing cloud migration',
			outline: {
				situation: 'Kestrel was moving card processing to a new cloud platform, with 4 teams involved.',
				task: 'Land the cutover in 9 months without failed transactions.',
				action: 'Mapped the cross-team dependencies, set shared milestones, and ran a weekly dependency review with the team leads.',
				result: 'Cut over on time with zero failed transactions [add how many transactions a day].',
			},
		},
		{
			question: 'How do you work with engineering leads who see program management as overhead?',
			type: 'role',
			whyTheyAsk: 'They want process that helps engineers; the post says “lightweight” for a reason.',
			useStory: 'Release train',
			outline: {
				situation: 'Teams at Kestrel released monthly and saw release planning as a chore.',
				task: 'Ship more often without adding meetings.',
				action: 'Designed a two-week release train with the leads and cut the status meetings it replaced.',
				result: 'Releases went from monthly to every two weeks, and the teams kept it.',
			},
		},
		{
			question: 'Walk me through how a card payment flows through a system like ours.',
			type: 'technical',
			whyTheyAsk: 'To check you can follow technical conversations without being an engineer.',
			useStory: '',
			outline: {
				situation: 'Use what you learned on the cloud migration.',
				task: 'Explain authorization, capture and settlement at a high level.',
				action: 'Tie each step to where your migration had risk, such as moving the authorization service.',
				result: 'Show you know where programs in payments usually break.',
			},
		},
		{
			question: 'Tell me about a time a project was going to miss a date. What did you do?',
			type: 'behavioral',
			whyTheyAsk: 'Judgment under pressure and how early you surface bad news.',
			useStory: 'Billing system rollout',
			outline: {
				situation: 'During the Bluefin billing rollout, an offshore team fell behind on data migration.',
				task: 'Protect the go-live for 1.2M customers.',
				action: 'Raised it early with the numbers, re-sequenced the rollout by customer group, and agreed the trade-off with the sponsor.',
				result: '[add what happened to the date and customers]',
			},
		},
		{
			question: 'How would you prepare a payments platform for a SOC 2 or PCI audit?',
			type: 'role',
			whyTheyAsk: 'Compliance is a nice-to-have that becomes a must-have before an EU launch.',
			useStory: 'PCI DSS audit preparation',
			outline: {
				situation: 'You owned Kestrel’s annual PCI DSS audit preparation.',
				task: 'Get evidence ready across teams before a fixed external date.',
				action: 'Built an evidence tracker with control owners and ran readiness reviews ahead of the audit.',
				result: '[add the audit outcome]',
			},
		},
		{
			question: 'How do you report program status to executives?',
			type: 'role',
			whyTheyAsk: 'The post asks for clear updates to leadership.',
			useStory: 'Card processing cloud migration',
			outline: {
				situation: 'The migration had executive attention because it touched revenue.',
				task: 'Keep leadership informed without drowning them in detail.',
				action: 'Describe your one-page status: milestones, top risks and the decisions you needed [describe your format].',
				result: 'Leadership made decisions on time [add an example].',
			},
		},
		{
			question: 'Tell me about a disagreement with an engineering lead.',
			type: 'behavioral',
			whyTheyAsk: 'They want someone who can push back and keep the relationship.',
			useStory: 'Release train',
			outline: {
				situation: 'One lead resisted the two-week release train.',
				task: 'Bring them on board without forcing it.',
				action: 'Heard the concern (testing time), adjusted the train to include a hardening day, and piloted it with their team first.',
				result: 'The team adopted it [add what changed].',
			},
		},
		{
			question: 'How do you use data to run a program?',
			type: 'technical',
			whyTheyAsk: 'The post asks for SQL; they want delivery tracked with data, not opinion.',
			useStory: '',
			outline: {
				situation: 'Pick a program where you tracked delivery.',
				task: 'Show which measures mattered.',
				action: 'Name the measures (cycle time, release frequency, defect escape) and how you pulled them [add your example].',
				result: 'Say what decision the data changed.',
			},
		},
		{
			question: 'Why do you want to move from a large payments company to a scale-up?',
			type: 'motivation',
			whyTheyAsk: 'To check you’ll cope with less structure.',
			useStory: '',
			outline: {
				situation: 'Kestrel is mature, with established process.',
				task: 'Explain the move honestly.',
				action: 'You want to build the program rhythm, not just run one.',
				result: 'Connect it to Tidewell’s stage and the EU launch.',
			},
		},
		{
			question: 'How did you manage the offshore teams at Bluefin?',
			type: 'behavioral',
			whyTheyAsk: 'Tidewell may work across time zones; they want evidence you can lead remotely.',
			useStory: 'Billing system rollout',
			outline: {
				situation: 'Three offshore teams built and migrated the billing system.',
				task: 'Keep them aligned with the local teams.',
				action: 'Set overlap hours, written handoffs and a shared risk log [check the details].',
				result: 'The rollout reached 1.2M customers.',
			},
		},
		{
			question: 'What would you do in your first 90 days here?',
			type: 'role',
			whyTheyAsk: 'To see whether you listen before you change things.',
			useStory: '',
			outline: {
				situation: 'A new platform org with programs already in flight.',
				task: 'Earn trust and find the biggest dependency risk.',
				action: 'Meet each lead, map the cross-team dependencies, then propose one lightweight rhythm.',
				result: 'A shared view of the roadmap by day 90.',
			},
		},
		{
			question: 'Tell me about a vendor that let you down.',
			type: 'behavioral',
			whyTheyAsk: 'Payments platforms rely on processors and vendors.',
			useStory: 'Vendor management at Kestrel',
			outline: {
				situation: 'You managed 2 vendors at Kestrel.',
				task: 'Pick a moment one slipped.',
				action: 'Describe how you escalated against the contract and protected the timeline [add the details].',
				result: '[add the outcome]',
			},
		},
	],
	stories: [
		{
			title: 'Card processing cloud migration',
			fromResume: 'Led the move to a new cloud platform across 4 teams in 9 months, with zero failed transactions at cutover.',
			themes: ['delivery under pressure', 'cross-team leadership', 'technical depth'],
		},
		{
			title: 'Release train',
			fromResume: 'Moved releases from monthly to every two weeks with a release train.',
			themes: ['influence', 'process change', 'working with engineers'],
		},
		{
			title: 'PCI DSS audit preparation',
			fromResume: 'Ran preparation for the annual PCI DSS audit.',
			themes: ['compliance', 'deadlines', 'ownership'],
		},
		{
			title: 'Billing system rollout',
			fromResume: 'Rolled out a new billing system to 1.2M customers with 3 offshore teams.',
			themes: ['scale', 'remote teams', 'risk'],
		},
		{ title: 'Vendor management at Kestrel', fromResume: 'Managed 2 vendors.', themes: ['vendors', 'conflict'] },
	],
	askThem: [
		{
			question: 'Where do programs on the payments platform usually get stuck today?',
			why: 'It shows the dependency problem you’d fix and invites them to describe it.',
		},
		{
			question: 'How do engineering leads like to be involved in planning?',
			why: 'It answers the overhead worry before they raise it.',
		},
		{ question: 'What’s the timeline for the EU launch, and who owns compliance?', why: 'It shows you read between the lines of the post.' },
		{ question: 'What would make this hire a success after six months?', why: 'It gets you the real scorecard.' },
	],
	salary: [
		'Ask for their range before giving a number, and let the recruiter speak first.',
		'Research the market for senior TPMs in your location before the call.',
		'Talk about the whole package (base, equity, bonus) rather than base pay alone.',
	],
	companyNotes: [
		'Check how big Tidewell is now and its latest funding: the post suggests about 300 people.',
		'Look for any public news about an EU launch or a new license.',
		'Find the engineering leads on LinkedIn to see how the platform teams are organized.',
	],
	practice: [
		{
			situation:
				'Two weeks before a payouts release, the ledger team says their API change will be a week late, and the payouts team is blocked on it. What do you do first?',
			options: [
				'Ask the payouts team to build against a mock of the API so they can keep going.',
				'Get both leads together to size the impact and agree a plan you take to the sponsor.',
				'Move the release date out a week and tell stakeholders as soon as possible.',
				'Ask the ledger team to add more people so their API change still lands on the original date.',
			],
			answer: 1,
			why: 'Size the impact with the people who own the work, then let the sponsor decide with options. A mock may be part of the plan, but choosing it alone skips the trade-off.',
		},
		{
			situation:
				'An engineering lead skips your weekly dependency review, saying it’s a waste of time for their team. What do you do?',
			options: [
				'Ask what would make it useful for them, and change the format to fit.',
				'Escalate to their manager, since the review only works if everyone attends.',
				'Send them the notes afterwards so they stay informed without attending.',
				'Cancel the review and handle dependencies one-on-one with each lead instead.',
			],
			answer: 0,
			why: 'Treat the skipped meeting as feedback. Escalating damages the relationship, sending notes keeps a meeting that isn’t working, and cancelling throws away the shared view.',
		},
		{
			situation:
				'Two weeks before a PCI audit, you learn one team never collected evidence for a control. What do you do?',
			options: [
				'Ask the team to reconstruct the evidence from logs before the auditors arrive.',
				'Tell the auditors right away, and ask to move that one control to a later review date.',
				'Assess the gap with the compliance owner and agree a plan before telling anyone.',
				'Assess the gap with the compliance owner, then brief the sponsor on the options.',
			],
			answer: 3,
			why: 'Understand the gap with the owner, then bring the decision to the sponsor. Keeping it quiet until there’s a plan, or reconstructing evidence on your own, hides a compliance risk.',
		},
		{
			situation: 'The VP asks you for a single date for the EU launch. Legal requirements are still unclear. What do you give them?',
			options: [
				'A range with the main unknowns listed, and when each one will be settled.',
				'The engineering estimate, with a buffer added for the legal work on top.',
				'No date until legal confirms the requirements, then one firm commitment after that.',
				'The date the business wants, with a list of risks that could move it.',
			],
			answer: 0,
			why: 'With open requirements, a range plus the unknowns is the honest answer. A buffered date still pretends to know, and no date at all helps nobody plan.',
		},
		{
			situation:
				'Midway through a migration, a team proposes skipping the load test to save a week. The data looks fine so far. What do you do?',
			options: [
				'Agree, since the data so far shows the system is coping well with today’s load levels.',
				'Ask for a lighter load test that covers the riskiest paths, and keep the date.',
				'Lay out the risk of skipping it and let the sponsor make the call on the week.',
				'Refuse, and keep the full load test in the plan even if the date moves.',
			],
			answer: 2,
			why: 'Skipping a load test on a payments migration is a risk decision above the team and the TPM. Make the risk visible and let the sponsor decide; a lighter test may be the outcome, but it’s their call.',
		},
	],
};
