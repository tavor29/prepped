// Your Call: 50 PMP-style situations set in tech companies and startups.
// The questions are original, written in the style of the PMP exam (not copied
// from it). The mix follows the July 2026 PMP exam outline: People 33%,
// Process 41%, Business environment 26%, so 17 / 20 / 13 questions.
//
// Rules for writing more:
// - Wrong answers sit close to the right one: a sensible move done in the
//   wrong order, by the wrong person, or one step short. Never a silly option.
// - Keep the four options about the same length. The build fails if the right
//   answer is the longest one, or people learn to pick the longest.
// - `why` explains the right answer and the closest wrong one by what they
//   say, never by letter, because the letters are assigned below.
// - Every question has its own cartoon in components/Scene.astro, keyed by id.

export type Level = 'Easy' | 'Medium' | 'Hard';
export type Domain = 'People' | 'Process' | 'Business environment';

type Source = {
	/** Also the cartoon's key in Scene.astro. */
	id: string;
	domain: Domain;
	topic: string;
	level: Level;
	/** What the cartoon shows, for screen readers. */
	alt: string;
	situation: string;
	right: string;
	wrong: [string, string, string];
	why: string;
};

export type Question = Omit<Source, 'right' | 'wrong'> & {
	options: [string, string, string, string];
	/** Index of the best answer in options. */
	answer: number;
};

export const domains: Domain[] = ['People', 'Process', 'Business environment'];

const source: Source[] = [
	// People (17)
	{
		id: 'stakeholders',
		domain: 'People',
		topic: 'Stakeholders',
		level: 'Medium',
		alt: 'A presenter shows the new AI tool on a flipchart. One colleague sits with arms crossed, and a chair at the table is empty.',
		situation:
			'You’re rolling out a new internal AI tool. One department head keeps skipping the check-ins, and their team isn’t using the tool. What’s your first move?',
		right: 'Meet them one-on-one to hear their concerns first, then adjust the rollout plan.',
		wrong: [
			'Ask the sponsor to talk to them, since the sponsor outranks you and they’ll listen.',
			'Meet them one-on-one and walk them through the benefits until they’re on board.',
			'Offer their team extra training sessions to build adoption from the bottom up.',
		],
		why: 'Start by listening. Resistance usually has a reason, like workload, a bad past rollout or a real gap in the tool. A one-on-one spent selling the benefits is still a pitch, and training their team works around the person who decides.',
	},
	{
		id: 'conflict',
		domain: 'People',
		topic: 'Conflict',
		level: 'Hard',
		alt: 'Two engineers point at two different designs on a whiteboard while the project manager between them shrugs.',
		situation:
			'Two senior engineers disagree on the architecture for a key service, and the team has been stalled for a week. What’s the best way to resolve it?',
		right: 'Get them to weigh both designs against the requirements and agree on one together.',
		wrong: [
			'Have each write up their design, then pick the stronger one yourself as the PM.',
			'Combine them: one engineer’s design for the service, the other’s for the data layer.',
			'Put it to a team vote so the decision has the whole team behind it from the start.',
		],
		why: 'Collaborating on the problem is the preferred way to resolve conflict: judge against agreed criteria and get real commitment. Choosing yourself forces the outcome, splitting the designs is a compromise nobody owns, and a vote skips the merits.',
	},
	{
		id: 'team-health',
		domain: 'People',
		topic: 'Team health',
		level: 'Easy',
		alt: 'Two tired developers at their laptops with coffee, next to a chart of velocity falling sprint after sprint.',
		situation:
			'Velocity has dropped for three sprints in a row, and in stand-ups the team says they’re stretched thin. What do you do?',
		right: 'Run a retrospective to find the root cause, then remove those blockers.',
		wrong: [
			'Cut the sprint commitment for now, until the team’s velocity recovers.',
			'Meet each developer separately to find out who is falling behind and why.',
			'Report the trend to the sponsor and ask for another developer to help.',
		],
		why: 'Find out what’s slowing the team before acting. A smaller commitment hides the cause, one-on-ones aimed at finding someone to blame break trust, and a new hire slows the team down at first.',
	},
	{
		id: 'resources',
		domain: 'People',
		topic: 'Resources',
		level: 'Hard',
		alt: 'A project manager by a matrix org chart looks worried as a manager waves the team’s data engineer off to another project.',
		situation:
			'In a matrix org, a functional manager moves your only data engineer to a VP’s project for two weeks, and your critical path runs through their work. What do you do first?',
		right: 'Work out the schedule impact, then negotiate with the functional manager.',
		wrong: [
			'Escalate to your sponsor right away, since the critical path is now at risk.',
			'Accept it, and plan overtime for when the engineer is back to recover the time.',
			'Bring in an outside contractor to cover the data engineering for two weeks.',
		],
		why: 'In a matrix, the functional manager owns the person’s time, so start with them, armed with the numbers. Escalating first damages the relationship, and overtime or a contractor spend money before anyone has agreed the trade-off.',
	},
	{
		id: 'onboarding',
		domain: 'People',
		topic: 'Onboarding',
		level: 'Easy',
		alt: 'A new developer at her laptop with a question mark above her, while a teammate points at the screen to help.',
		situation:
			'A developer joined your team a week ago and still hasn’t picked up a task on their own. In stand-ups they seem lost. What do you do?',
		right: 'Pair them with a mentor on the team and agree clear goals for their first weeks.',
		wrong: [
			'Give them a small, well-defined task so they can get a quick first win alone.',
			'Send them the project wiki and ask them to read it all before taking on tasks.',
			'Give it another sprint, since most new hires need a few weeks to settle in properly.',
		],
		why: 'New people ramp up fastest with someone to ask and a clear picture of what good looks like. A small first task helps, but on its own it leaves them guessing, and reading the wiki or waiting both leave the gap to chance.',
	},
	{
		id: 'charter',
		domain: 'People',
		topic: 'Team charter',
		level: 'Easy',
		alt: 'A teammate presents a flipchart headed “Rules” while two colleagues listen.',
		situation:
			'Your new team keeps clashing over small things: meeting times, how fast code reviews happen, when it’s OK to message after hours. What do you do?',
		right: 'Work with the team to agree ground rules and write them into a team charter.',
		wrong: [
			'Write clear ground rules yourself and share them with the team at the next stand-up.',
			'Raise each clash with the people involved as it happens, one conversation at a time.',
			'Let it settle on its own, since new teams always go through a storming phase.',
		],
		why: 'Rules the team writes together are rules the team keeps. Writing them yourself skips the buy-in, handling each clash alone never fixes the pattern, and storming passes faster once the team agrees how it works.',
	},
	{
		id: 'recognition',
		domain: 'People',
		topic: 'Recognition',
		level: 'Easy',
		alt: 'A project manager says “Thank you!” to two smiling teammates, with a trophy on the desk between them.',
		situation:
			'After a hard month, your team ships a milestone on time, helped by a few late nights. How do you recognize it?',
		right: 'Thank the team publicly and name what each person did to get it there.',
		wrong: [
			'Send a short thank-you email to the whole team and copy in the sponsor.',
			'Thank the two people who put in the most late nights at the all-hands.',
			'Plan a team dinner at the end of the project to celebrate it all at once.',
		],
		why: 'Recognition works when it’s timely and specific. A generic email is easy to ignore, singling out the late nights rewards overtime rather than results, and waiting until the end of the project loses the moment.',
	},
	{
		id: 'skills',
		domain: 'People',
		topic: 'Skills gap',
		level: 'Easy',
		alt: 'A worried teammate and a shrugging colleague look at a cloud marked “New” on the whiteboard.',
		situation:
			'The program moves to a new cloud platform next quarter, and nobody on your team has used it. What do you do first?',
		right: 'Assess the skill gaps with the team and build training time into the plan.',
		wrong: [
			'Hire a contractor who knows the platform to do the migration work for the team.',
			'Send the whole team on the vendor’s certification course as soon as possible.',
			'Let people learn the platform on the job once the migration work has started.',
		],
		why: 'Start by knowing which gaps you have, then plan for them, so training shows up in the schedule instead of as a surprise. A contractor or a blanket course may be part of the answer, but only once you know what’s missing.',
	},
	{
		id: 'underperform',
		domain: 'People',
		topic: 'Performance',
		level: 'Medium',
		alt: 'A project manager and a tired engineer talk one-on-one across a small table with a mug on it.',
		situation:
			'One engineer has missed their last three deadlines, and the rest of the team is starting to grumble. What do you do?',
		right: 'Talk with them in private to find out what’s behind it, then agree a plan.',
		wrong: [
			'Raise it at the retrospective so the team can talk openly about missed deadlines.',
			'Tell their functional manager, since performance problems are theirs to handle.',
			'Move their tasks to others on the team for now so the deadlines stop slipping.',
		],
		why: 'Private first, and listen before judging: the cause might be workload, unclear tasks or something personal. A retrospective puts one person on the spot, going to their manager goes around them, and moving the work hides the problem.',
	},
	{
		id: 'retro',
		domain: 'People',
		topic: 'Psychological safety',
		level: 'Medium',
		alt: 'A retrospective in front of blank sticky notes, where one teammate says “All good!” and another stands with arms crossed.',
		situation:
			'In retrospectives your team stays quiet and says “all good”, then complains about the same problems in private chats. What do you change?',
		right: 'Make it safer to speak up, for example with anonymous input before discussion.',
		wrong: [
			'Ask each person to name one problem in turn so that everyone has to speak up.',
			'Invite the team’s manager to the retrospective to show it’s taken seriously.',
			'Skip retrospectives for a while, since right now they aren’t producing anything.',
		],
		why: 'Silence in the room and complaints outside it mean people don’t feel safe raising problems. Anonymous input lowers the cost of speaking. Going round the table forces it, a manager in the room makes it worse, and dropping retros removes the only forum.',
	},
	{
		id: 'self-org',
		domain: 'People',
		topic: 'Servant leadership',
		level: 'Medium',
		alt: 'A developer asks “Today?” while the project manager points to the tasks on the team’s board.',
		situation:
			'Your newly agile team keeps asking you to assign their tasks each morning, the way their old manager did. What do you do?',
		right: 'Coach them to pull work from the board themselves, and step back over time.',
		wrong: [
			'Keep assigning the tasks for now, since the team isn’t ready to manage itself.',
			'Stop assigning tasks right away and let the team work it out on its own.',
			'Ask the scrum master to take over assigning the tasks each morning instead.',
		],
		why: 'A servant leader builds the team’s ability to organize itself instead of being the bottleneck. Assigning tasks keeps the old habit, stopping cold leaves them stranded, and handing the job to the scrum master is the same habit with a new owner.',
	},
	{
		id: 'new-vp',
		domain: 'People',
		topic: 'Stakeholders',
		level: 'Medium',
		alt: 'A new VP in a suit asks “New plan?” while the project manager holds the approved plan.',
		situation:
			'Halfway through your project, a new VP takes over the sponsoring department and says they see things differently. What’s your first step?',
		right: 'Meet the VP to learn their goals, then assess what it means for the project.',
		wrong: [
			'Send the VP the approved charter and plan so they can see what was already agreed.',
			'Keep delivering to the current plan until the VP asks for a formal change.',
			'Ask the original sponsor to brief the VP so the project keeps its direction.',
		],
		why: 'A new key stakeholder means updating your stakeholder analysis, and that starts with listening. Pointing to the charter defends the past, waiting means building something the new owner may not want, and a briefing from someone else isn’t engagement.',
	},
	{
		id: 'remote',
		domain: 'People',
		topic: 'Remote teams',
		level: 'Medium',
		alt: 'A project manager on a video call with an offshore engineer, next to a sticky note asking “Stuck?”.',
		situation:
			'Engineers in your offshore team rarely raise problems on calls, and you keep hearing about blockers days late. What do you do?',
		right: 'Build trust one-on-one and give them easy ways to flag blockers in writing.',
		wrong: [
			'Ask their local lead to collect the blockers and send you a summary every day.',
			'Add a daily blockers call where each engineer has to report their status.',
			'Remind everyone on the next call that raising blockers early is expected.',
		],
		why: 'Culture, language and time zones make speaking up on a group call hard. Trust and a low-pressure written channel fix the cause. A report through a lead or another call adds pressure without making it safer, and a reminder changes nothing.',
	},
	{
		id: 'negotiation',
		domain: 'People',
		topic: 'Negotiation',
		level: 'Hard',
		alt: 'Two product managers each hold their own launch box under a balance scale on the whiteboard, with the project manager between them.',
		situation:
			'Two product managers both need your platform team for the next six weeks, and each says their launch is the company’s top priority. What do you do?',
		right: 'Get both to weigh their value against the strategy, and escalate if they can’t agree.',
		wrong: [
			'Split the team’s capacity down the middle so each product manager gets an equal share.',
			'Take it straight to the sponsor, since this priority call sits above both of them.',
			'Serve the launch with the earliest date first, then move straight on to the other.',
		],
		why: 'Try to resolve it at the lowest level first, with the right yardstick: business value and strategy. Splitting the team helps nobody launch, going straight to the sponsor skips the people who own the trade-off, and the earliest date isn’t the same as the most value.',
	},
	{
		id: 'hidden-delay',
		domain: 'People',
		topic: 'Trust',
		level: 'Hard',
		alt: 'A nervous developer pictures an hourglass while confessing a delay to the project manager.',
		situation:
			'A developer admits they hid a two-week delay for a month, because the last person who reported a delay was blamed in front of everyone. What do you do?',
		right: 'Thank them for telling you, re-plan, and change how the team treats bad news.',
		wrong: [
			'Re-plan around the delay, and remind the team that hiding delays isn’t acceptable.',
			'Escalate the delay to the sponsor now, and note it in the developer’s review.',
			'Re-plan the delay quietly, so the developer isn’t blamed for it this time either.',
		],
		why: 'The delay is the symptom; a culture that punishes bad news is the cause. Fix both. A reminder about honesty ignores why they hid it, a mark on their review proves their fear right, and keeping it quiet hides it from the people who need to know.',
	},
	{
		id: 'public-critique',
		domain: 'People',
		topic: 'Emotional intelligence',
		level: 'Hard',
		alt: 'An executive points at a worried engineer and says “Why late?!”, while the project manager steps in.',
		situation:
			'In a steering meeting, an executive sharply criticizes one of your engineers by name for a slipped date that wasn’t the engineer’s fault. What do you do?',
		right: 'Calmly own the slip in the room, then follow up privately with both of them.',
		wrong: [
			'Correct the executive on the spot and explain whose fault the slip really was.',
			'Say nothing in the meeting, then send the executive an email with the full facts.',
			'Defend the engineer in the meeting and ask that names stay out of these reviews.',
		],
		why: 'As the PM you own the schedule, so you absorb the criticism and keep the meeting on the issue, then repair things one-on-one. Correcting an executive in public escalates, silence leaves your engineer exposed, and setting rules for the executive mid-meeting won’t land.',
	},
	{
		id: 'kanban-switch',
		domain: 'People',
		topic: 'Team empowerment',
		level: 'Hard',
		alt: 'A developer proposes Kanban on a flipchart next to a sticky note saying “Trial”, while the sponsor sits with arms crossed.',
		situation:
			'Your team asks to switch from two-week sprints to Kanban, saying sprints don’t fit their support-heavy work. The sponsor is nervous about it. What do you do?',
		right: 'Back a time-boxed trial with agreed measures, and keep the sponsor informed.',
		wrong: [
			'Keep the sprints until the project ends, since changing method mid-project is risky.',
			'Let the team switch right away, since how they work is entirely their own call.',
			'Ask the sponsor to decide, since they’re the one who is nervous about the change.',
		],
		why: 'Teams own how they work, and a servant leader backs them while managing the risk: a short trial, clear measures, and stakeholders kept in the loop. Refusing ignores a real problem, switching with no measures ignores the sponsor, and the sponsor doesn’t own the team’s method.',
	},

	// Process (20)
	{
		id: 'scope',
		domain: 'Process',
		topic: 'Scope change',
		level: 'Easy',
		alt: 'A CEO points at a launch checklist with a new red item and says “+ Feature”, while the project manager at her laptop looks worried.',
		situation:
			'Two weeks before launch, the CEO asks you to add a feature a big prospect wants in this release. What do you do first?',
		right: 'Assess the impact, then let the CEO decide with the trade-offs in front of them.',
		wrong: [
			'Ask the team for an estimate, then move the launch date so the feature fits.',
			'Assess the impact with the team, and add the feature if they say it fits in time.',
			'Log it as a change request and schedule it for the next release after launch.',
		],
		why: 'Change control means the impact is assessed and the person who owns the decision makes it. Adding it because the team says it fits, or parking it for the next release, both make the CEO’s call for them.',
	},
	{
		id: 'agile',
		domain: 'Process',
		topic: 'Agile',
		level: 'Easy',
		alt: 'A sales VP leans over a developer at his laptop calling “Urgent!”, in front of the team’s sprint board.',
		situation:
			'Mid-sprint, a sales VP messages a developer directly and asks them to drop everything for an urgent customer request. What should happen?',
		right: 'Send it to the product owner, who decides whether it changes the sprint or waits.',
		wrong: [
			'Send it to the product owner and add it to this sprint so the customer isn’t kept waiting.',
			'Have the developer estimate it first, then raise it at the next stand-up meeting.',
			'Have the scrum master tell the VP the sprint scope is locked until the review.',
		],
		why: 'The product owner owns priorities, so they decide, not the requester and not the team. Sprint scope isn’t untouchable either: the product owner can change it if the request is worth more than the sprint goal.',
	},
	{
		id: 'risk',
		domain: 'Process',
		topic: 'Risk',
		level: 'Medium',
		alt: 'A project manager stands by a half-empty server rack, picturing a delivery truck and an hourglass.',
		situation:
			'Your launch depends on new GPU servers, and the supplier warns that lead times just stretched to five months. Nothing has slipped yet. What do you do?',
		right: 'Log the risk, plan a response such as ordering early, and tell the stakeholders.',
		wrong: [
			'Add it to the risk register and review it at next month’s risk meeting with the team.',
			'Treat it as an issue now and ask the sponsor for contingency budget to cover it.',
			'Order the servers now and move the schedule baseline to the new delivery dates.',
		],
		why: 'It’s a risk, not yet an issue, and it needs a response while there’s time, not just a log entry. Ordering is a good move, but changing the baseline goes through change control.',
	},
	{
		id: 'communication',
		domain: 'Process',
		topic: 'Communication',
		level: 'Easy',
		alt: 'A project manager at a laptop between two video-call screens and two clocks showing Tel Aviv and New York time.',
		situation:
			'Your team is split between Tel Aviv and a US office, and status updates keep getting missed on one side or the other. What do you do?',
		right: 'Agree who needs which updates, how often and through which channel.',
		wrong: [
			'Send a longer, more detailed weekly status email to everyone on both sides.',
			'Move all status updates into one shared chat channel for both offices.',
			'Set up a daily all-hands call at a time that works for both offices.',
		],
		why: 'The gap is the plan, not the tool. Decide who needs what information, when and how, then pick the channel. A new channel, a longer email or another meeting only treat the symptom.',
	},
	{
		id: 'requirements',
		domain: 'Process',
		topic: 'Requirements',
		level: 'Medium',
		alt: 'A developer scratches his head at a whiteboard where one question mark splits into a small task and a big one.',
		situation:
			'Mid-sprint, the team realizes a story’s acceptance criteria can be read two ways, and each reading is a very different amount of work. What happens next?',
		right: 'Ask the product owner to clarify the acceptance criteria before the work goes on.',
		wrong: [
			'Build the simpler reading for now, and confirm it with the product owner at the sprint review.',
			'Build both versions behind a feature flag so the product owner can choose later.',
			'Finish the story as you read it, and raise the gap in the sprint retrospective.',
		],
		why: 'The product owner decides what “done” means, and asking now costs minutes. Building first and confirming later risks wasted work, and the retrospective is too late for this story.',
	},
	{
		id: 'budget',
		domain: 'Process',
		topic: 'Budget',
		level: 'Medium',
		alt: 'A project manager points at a chart showing more budget spent than work done, while the sponsor sits by a stack of coins.',
		situation:
			'Six months into a 12-month program, you’ve spent 60% of the budget and finished about 45% of the work. What do you do?',
		right: 'Find the cause, forecast the final cost, and bring options to the sponsor.',
		wrong: [
			'Ask the sponsor for a 15% budget increase to cover the gap before it grows.',
			'Cut scope now so the rest of the work fits inside the remaining budget.',
			'Keep going, since spending is often front-loaded on programs like this one.',
		],
		why: 'You’re getting about 75 cents of work for every dollar spent. Find out why, forecast where it lands, then let the sponsor choose. Asking for money or cutting scope before the analysis acts on a guess, and assuming front-loading is also a guess.',
	},
	{
		id: 'vendor',
		domain: 'Process',
		topic: 'Vendors',
		level: 'Hard',
		alt: 'A vendor hands over a box marked v1.0 and the project manager holds a signed-off contract, while a user shrugs with a question mark.',
		situation:
			'A vendor delivers a module that meets the contract’s written spec but not what your users actually need. The vendor wants sign-off and final payment. What do you do?',
		right: 'Sign off against the contract, then raise a change request for what users need.',
		wrong: [
			'Hold back the final payment until the module meets what users actually need.',
			'Sign off and pay, then informally ask the vendor to fix it as a goodwill gesture.',
			'Ask legal to reopen the contract and renegotiate before you agree to sign off.',
		],
		why: 'Deliverables are accepted against the contract. It meets the spec, so you sign off, and holding payment would breach the contract. The real gap was in the requirements, so it’s a change request plus a lesson learned, not a side deal.',
	},
	{
		id: 'lessons',
		domain: 'Process',
		topic: 'Lessons learned',
		level: 'Easy',
		alt: 'Next to a server rack and a release box, an engineer points at the release checklist on the whiteboard.',
		situation:
			'A release fails because of a manual deployment step that everyone forgot. It’s fixed within the hour. What else should happen now?',
		right: 'Record the lesson now and add the missing step to the release checklist.',
		wrong: [
			'Note it down to discuss at the lessons-learned session when the project ends.',
			'Find out who skipped the step and remind them to follow the process.',
			'Nothing more, since the fix went in fast and the users barely noticed.',
		],
		why: 'Lessons are captured as they happen and turned into a change that stops a repeat, here a checklist step. Saving it for the end means it can happen again first, and hunting for who forgot treats a process gap as one person’s fault.',
	},
	{
		id: 'dod',
		domain: 'Process',
		topic: 'Definition of done',
		level: 'Easy',
		alt: 'A tester points at a big red bug on a flipchart while a developer shrugs under a whiteboard that asks “Done?”.',
		situation:
			'Developers mark stories as done, but many of them then fail QA and bounce back into the sprint. What do you do?',
		right: 'Agree a shared definition of done with the team, with testing included.',
		wrong: [
			'Ask QA to test each story sooner so failures show up earlier in the sprint.',
			'Have the developers write more unit tests before they move a story along.',
			'Track how many stories bounce back and report it at each sprint review.',
		],
		why: '“Done” means different things to different people until the team writes it down. A shared definition of done that includes testing fixes the cause. Earlier testing or more unit tests help, but they don’t settle when a story is actually finished.',
	},
	{
		id: 'estimate',
		domain: 'Process',
		topic: 'Estimating',
		level: 'Easy',
		alt: 'The CEO asks “Date?” while the project manager thinks about the calendar.',
		situation:
			'On day one of a new project, the CEO asks you for a firm launch date. The scope is still rough. What do you give them?',
		right: 'A range based on what’s known now, and a date when you’ll be able to narrow it.',
		wrong: [
			'A firm date with a buffer added, so the team has some room to absorb surprises.',
			'No date yet, and a promise to send one when the requirements are signed off.',
			'The date the CEO hopes for, then a correction later as the plan gets clearer.',
		],
		why: 'Early estimates are uncertain, so give a range and say when it will narrow. A padded date still pretends to know, no answer at all helps no one plan, and agreeing to the hoped-for date sets up a broken promise.',
	},
	{
		id: 'config',
		domain: 'Process',
		topic: 'Change control',
		level: 'Easy',
		alt: 'A worried developer at a laptop, a phone on the desk flashing red, and a server rack calling “Outage!”.',
		situation:
			'A developer pushed a configuration change straight to production to fix a small issue, and it caused a short outage. Service is back. What next?',
		right: 'Review what happened, then route all production changes through change control.',
		wrong: [
			'Roll back the change and ask the developer to fix it properly in the next sprint.',
			'Remove the developer’s production access until the next quarterly access review.',
			'Write up the outage and send it to the sponsor along with an apology for it.',
		],
		why: 'The issue is the missing control, not one developer. A blameless review and a working change process stop the next one. Rolling back fixes this change only, pulling access punishes a person for a process gap, and an apology prevents nothing.',
	},
	{
		id: 'float',
		domain: 'Process',
		topic: 'Schedule',
		level: 'Medium',
		alt: 'A project manager calmly points at a Gantt chart where one bar has slipped.',
		situation:
			'A task that isn’t on the critical path slips by three days. It has five days of float. What do you do?',
		right: 'Update the schedule and keep watching it; the end date isn’t at risk yet.',
		wrong: [
			'Escalate it to the sponsor, since any slip should be reported straight away.',
			'Add people to the task so it gets back on its original dates this week.',
			'Raise a change request to move the project’s end date by three days.',
		],
		why: 'With five days of float, a three-day slip doesn’t move the end date, but it uses most of the cushion, so keep an eye on it. Escalating or adding people overreacts, and the end date doesn’t change at all.',
	},
	{
		id: 'compress',
		domain: 'Process',
		topic: 'Schedule compression',
		level: 'Medium',
		alt: 'The sponsor asks “Sooner?” while the project manager thinks about the clock.',
		situation:
			'The sponsor asks whether you can launch three weeks early to beat a competitor. What do you do first?',
		right: 'Study the critical path and price options such as fast-tracking, with their risks.',
		wrong: [
			'Agree to it, and ask the team to work weekends for as long as the new date needs.',
			'Cut the lowest-priority features so that the remaining work fits the new date.',
			'Decline politely, since the current plan already has no slack left anywhere in it.',
		],
		why: 'Compress the critical path, not just any work, and show the trade-offs: fast-tracking adds risk, adding people (crashing) adds cost. Weekends burn the team out, cutting features is the sponsor’s call, and saying no without looking isn’t analysis.',
	},
	{
		id: 'quality',
		domain: 'Process',
		topic: 'Quality',
		level: 'Medium',
		alt: 'A project manager points at a chart of bug tickets climbing, while a worried teammate shrugs next to a sticky note saying “Bugs”.',
		situation:
			'Since the last release, support tickets about bugs have doubled. The team wants to start by fixing the loudest ones. What do you suggest first?',
		right: 'Find the root cause by grouping the bugs and seeing where most of them come from.',
		wrong: [
			'Fix the bugs customers complain about most, starting with the loudest accounts.',
			'Add a full regression test pass before every single release, starting from today.',
			'Freeze new features until the support ticket count is back to where it was.',
		],
		why: 'Group the defects and look for the few causes behind most of them, then fix those. Fixing the loudest bugs treats symptoms, and a blanket test pass or a feature freeze is a cure picked before the diagnosis.',
	},
	{
		id: 'backlog',
		domain: 'Process',
		topic: 'Backlog',
		level: 'Medium',
		alt: 'A product owner and the project manager stare at a backlog so long it runs off the board.',
		situation:
			'Your product backlog has grown to 400 items, and nobody can say what the team should build next. What do you do?',
		right: 'With the product owner, rank it by value and archive the stale items.',
		wrong: [
			'Ask the team to estimate every item so the backlog can be planned properly.',
			'Have each stakeholder vote for their top ten items, and build the most popular.',
			'Start a new backlog with only this quarter’s goals, and delete the old one.',
		],
		why: 'The product owner orders the backlog by value, and refining it regularly keeps it usable. Estimating all 400 wastes effort on items that may never be built, voting ranks by popularity, and deleting the old backlog throws away real needs.',
	},
	{
		id: 'closure',
		domain: 'Process',
		topic: 'Closing',
		level: 'Medium',
		alt: 'A project manager holds out a sign-off form while the business owner hesitates with a question mark.',
		situation:
			'The sponsor wants to close the project this week, but one deliverable still hasn’t been formally accepted by the business owner. What do you do?',
		right: 'Get formal acceptance, or agree in writing how the open item will be handled.',
		wrong: [
			'Close it as planned and log the open deliverable as a known issue for support.',
			'Keep the project open until the deliverable is fully accepted, however long it takes.',
			'Close it, since the sponsor has the authority to decide when the project ends.',
		],
		why: 'Closing needs formal acceptance of the deliverables, or a written agreement on what happens to the open item. Closing over it hands support a surprise, keeping the project open indefinitely wastes money, and the sponsor’s authority doesn’t replace the owner’s acceptance.',
	},
	{
		id: 'evm',
		domain: 'Process',
		topic: 'Earned value',
		level: 'Hard',
		alt: 'A project manager points at an earned value chart where the progress line falls behind the plan.',
		situation:
			'Your earned value report shows a CPI of 1.1 and an SPI of 0.8. What does it tell you, and what do you look at next?',
		right: 'Under budget but behind; look at the critical path for what’s causing the delay.',
		wrong: [
			'Over budget but ahead of schedule; slow spending until the cost index is back to 1.',
			'On track overall, since the two indexes balance each other out across the budget.',
			'Under budget and behind schedule; spend the savings on overtime to catch up.',
		],
		why: 'CPI above 1 means more work per dollar than planned; SPI below 1 means less work done than planned by now. Find the cause before acting. Spending the savings on overtime might help, but only once you know why it’s late and the sponsor has agreed.',
	},
	{
		id: 'hybrid',
		domain: 'Process',
		topic: 'Hybrid delivery',
		level: 'Hard',
		alt: 'A hardware engineer and a developer shrug under a whiteboard where their two timelines don’t line up, while the project manager points at it.',
		situation:
			'Hardware runs on a waterfall plan and software in two-week sprints. Integration keeps failing because each side is ready at a different time. What do you do?',
		right: 'Set shared integration milestones and line up both teams’ plans to meet them.',
		wrong: [
			'Move the hardware team onto sprints too, so that both sides plan the same way.',
			'Have the software team wait for each hardware drop before starting sprints.',
			'Add a buffer sprint before each integration to absorb the mismatched timing.',
		],
		why: 'Hybrid works when the predictive and agile parts meet at agreed points. Hardware with long lead times rarely fits sprints, making software wait wastes capacity, and a buffer sprint absorbs the symptom without syncing the plans.',
	},
	{
		id: 'contract',
		domain: 'Process',
		topic: 'Procurement',
		level: 'Hard',
		alt: 'A vendor and the project manager sit at a table with a contract, a stack of coins and an hourglass.',
		situation:
			'You need a vendor for a three-month AI pilot. Nobody can define the scope precisely yet, and Finance wants costs under control. Which contract fits best?',
		right: 'Time and materials with a not-to-exceed cap, reviewed at set checkpoints.',
		wrong: [
			'Fixed price, so the vendor carries the risk if the pilot grows in scope.',
			'Cost plus a percentage fee, so the vendor stays flexible as scope changes.',
			'Fixed price per phase, with the full scope agreed before the first phase.',
		],
		why: 'When scope is unclear, time and materials fits, and a cap plus checkpoints keeps cost in hand. Fixed price on vague scope leads to padded bids and change-order fights, and cost plus a percentage fee rewards the vendor for spending more.',
	},
	{
		id: 'reserve',
		domain: 'Process',
		topic: 'Reserves',
		level: 'Hard',
		alt: 'An auditor hands over an unexpected “Audit fee” while the worried project manager thinks about the coins on the desk.',
		situation:
			'Midway through, a software license audit brings a cost nobody had identified as a risk. The contingency reserve is still untouched. How do you fund it?',
		right: 'Request the management reserve from the sponsor, through change control.',
		wrong: [
			'Use the contingency reserve, since it’s there to absorb surprises like this one.',
			'Cover it from the budgets of tasks that are running under their estimates.',
			'Ask Finance for a separate budget line, outside the project, for the audit.',
		],
		why: 'Contingency reserve covers identified risks; an unknown one draws on the management reserve, which the sponsor controls. Moving money between tasks hides the overrun, and a budget line outside the project hides the true cost.',
	},

	// Business environment (13)
	{
		id: 'security',
		domain: 'Business environment',
		topic: 'Security risk',
		level: 'Hard',
		alt: 'A worried project manager stands under a big warning sign while the product lead points ahead saying “Ship it!”.',
		situation:
			'Two days before release, a critical vulnerability is found in an open-source library you use. A proper patch takes a week, and the product lead wants to ship and patch later. What do you do?',
		right: 'Assess the exposure with security, then have the sponsor decide on the options.',
		wrong: [
			'Delay the release until the patch is ready, since security always comes first.',
			'Ship on schedule and record the vulnerability in the risk register for follow-up.',
			'Turn off the affected feature with a feature flag, and ship on schedule as planned.',
		],
		why: 'A risk this size is above the PM’s or the product lead’s authority to accept. Turning off the feature may well be the right fix, but the sponsor makes that call with the facts in front of them. Delaying on reflex makes the decision for them too.',
	},
	{
		id: 'test-data',
		domain: 'Business environment',
		topic: 'Privacy',
		level: 'Easy',
		alt: 'A developer at a laptop reaches for customer data while the project manager points at a padlock on the whiteboard.',
		situation:
			'To test faster, a developer wants to copy real customer data into the test environment. What do you do?',
		right: 'Check the privacy rules first and use masked or synthetic data instead.',
		wrong: [
			'Allow it for this sprint only, as long as the test environment is locked down.',
			'Allow it if the team deletes the copy as soon as the testing is finished.',
			'Ask the customers’ account managers whether their customers would mind.',
		],
		why: 'Real personal data in test usually breaks privacy law and company policy, however locked down it is. Masked or synthetic data gets the same testing done. Short-term use or prompt deletion doesn’t make the copy acceptable.',
	},
	{
		id: 'business-case',
		domain: 'Business environment',
		topic: 'Business case',
		level: 'Easy',
		alt: 'A project manager shows a worried sponsor a chart of the target market shrinking.',
		situation:
			'Halfway through your project, the market it was built for shrinks sharply. The team is on track. What do you do?',
		right: 'Ask the sponsor to review whether the business case for it still holds up.',
		wrong: [
			'Keep delivering to plan, since the team is on track and the scope is approved.',
			'Speed up delivery so the product reaches the smaller market before others do.',
			'Cut the remaining scope by half to match the smaller size of the market.',
		],
		why: 'A project exists to deliver value. When the reason for it changes, the business case needs a fresh look, and the sponsor decides whether to continue, change or stop. Being on track doesn’t matter if the target moved, and cutting or speeding up acts before that decision.',
	},
	{
		id: 'sponsor-leaves',
		domain: 'Business environment',
		topic: 'Governance',
		level: 'Easy',
		alt: 'The sponsor carries a box out of the office, leaving an empty chair under the org chart, while the project manager looks on worried.',
		situation:
			'In a reorganization, your project’s sponsor leaves the company. What do you do first?',
		right: 'Work with leadership to confirm a new sponsor and reconfirm the goals.',
		wrong: [
			'Keep working to the current plan until someone new reaches out to you.',
			'Report to the old sponsor’s manager until a new sponsor is appointed.',
			'Pause the project until the reorganization is finished and settled.',
		],
		why: 'A project without a sponsor has no one to make decisions, fund changes or clear blockers. Get one named quickly and check the goals still stand. Carrying on alone, borrowing someone else’s authority, or pausing all leave the project without direction.',
	},
	{
		id: 'gift',
		domain: 'Business environment',
		topic: 'Ethics',
		level: 'Easy',
		alt: 'A smiling vendor holds out a gift and says “Free trip!” to the project manager, who stands with arms crossed.',
		situation:
			'During a vendor selection you’re running, one of the bidders invites you on an all-expenses-paid trip to their user conference. What do you do?',
		right: 'Decline the trip and disclose the offer to the selection committee.',
		wrong: [
			'Accept, but make sure it doesn’t affect how you score their proposal.',
			'Accept, and disclose the trip to your manager after the selection ends.',
			'Decline the trip, but keep it to yourself so the bidder isn’t penalized.',
		],
		why: 'Even the appearance of a conflict of interest undermines a selection. Decline and disclose. Accepting while promising to stay fair still creates the conflict, and keeping it quiet hides something the process needs to know.',
	},
	{
		id: 'accessibility',
		domain: 'Business environment',
		topic: 'Compliance',
		level: 'Easy',
		alt: 'A developer asks “Optional?” while the project manager points at an EU flag on the whiteboard.',
		situation:
			'Your app is launching in the EU, where accessibility rules now apply to it. The team calls accessibility a nice-to-have. What do you do?',
		right: 'Treat it as a requirement, and plan the work through change control.',
		wrong: [
			'Add it to the backlog as a nice-to-have, and prioritize it after the launch.',
			'Fix the most visible accessibility issues in the final week of testing.',
			'Leave it to the team to judge, since they know the product best of anyone.',
		],
		why: 'A legal requirement isn’t optional scope. It goes into the requirements, with its effect on time and cost assessed through change control. Pushing it past launch or patching it in the last week risks a launch you can’t legally ship.',
	},
	{
		id: 'regulation',
		domain: 'Business environment',
		topic: 'Regulation',
		level: 'Medium',
		alt: 'A lawyer brings the project manager a document and says “New rules”, next to an AI sign on the whiteboard.',
		situation:
			'Mid-project, legal tells you a new AI regulation will apply to the recommendation feature you’re building. What do you do first?',
		right: 'Assess the impact with legal and compliance, then take it through change control.',
		wrong: [
			'Pause work on the feature until legal sends you the full list of new requirements.',
			'Keep building as planned and handle compliance in a separate project after launch.',
			'Drop the feature from this release so the new regulation doesn’t delay the launch.',
		],
		why: 'Regulation changes the requirements, so assess what it means with the experts, then change the plan the formal way. Pausing waits on others, building on ignores it, and dropping the feature is a product decision made before the analysis.',
	},
	{
		id: 'adoption',
		domain: 'Business environment',
		topic: 'Benefits',
		level: 'Medium',
		alt: 'A salesperson sits with arms crossed in front of the new system, next to a chart showing 20% use.',
		situation:
			'You delivered the new CRM on time and on budget, but three months later only 20% of the sales team uses it. Whose problem is that?',
		right: 'Yours too: help the business owner fix adoption, since the benefits depend on it.',
		wrong: [
			'The sales managers’, since the project delivered everything in the approved scope.',
			'The vendor’s, since their product should have been easier for the team to learn.',
			'Nobody’s yet; adoption of a new system takes at least six months to settle.',
		],
		why: 'A project succeeds when it delivers its benefits, not just its scope. Work with the business owner on why people aren’t using it. Blaming the sales managers or the vendor, or waiting, leaves the value on the table.',
	},
	{
		id: 'competitor',
		domain: 'Business environment',
		topic: 'Market change',
		level: 'Medium',
		alt: 'The sponsor points at a competitor’s “NEW!” launch and says “Pivot!”, while the project manager thinks it over.',
		situation:
			'A competitor launches the feature your team is three months into building. The sponsor wants to pivot to something new right away. What do you do?',
		right: 'Help the sponsor and product reassess the roadmap, then change it formally.',
		wrong: [
			'Pivot right away as asked, since the sponsor owns what the project delivers.',
			'Finish the feature first, since it’s three months in and nearly half done.',
			'Speed up the feature so you launch a better version before they gain ground.',
		],
		why: 'A market change is a reason to reassess, not to react. Look at the options with product and the sponsor, then change scope through governance. Pivoting on the spot, sunk-cost thinking and racing the competitor all skip the analysis.',
	},
	{
		id: 'change-mgmt',
		domain: 'Business environment',
		topic: 'Change management',
		level: 'Hard',
		alt: 'A support agent asks “My job?” while the project manager presents the new AI tool on a flipchart.',
		situation:
			'Your new AI support tool will change how the support team works, and rumors say it will replace jobs. Launch is in six weeks. What do you do?',
		right: 'Bring support leaders in early, be open about the changes, and plan training.',
		wrong: [
			'Launch on schedule, and hold a Q&A session for the whole support team after go-live.',
			'Ask HR to announce now that no jobs will be lost because of the new tool.',
			'Pilot it quietly with a few agents so the rumors don’t spread any further.',
		],
		why: 'People adopt change they help shape and understand. Involve them early, say honestly what changes, and prepare them. A Q&A after launch is too late, a promise you may not control can backfire, and a quiet pilot feeds the rumors.',
	},
	{
		id: 'portfolio',
		domain: 'Business environment',
		topic: 'Portfolio',
		level: 'Hard',
		alt: 'Two project managers holding their plans face each other under two overlapping circles on the whiteboard.',
		situation:
			'You discover that another team’s project overlaps half of your scope, and both are funded. What do you do?',
		right: 'Raise it with portfolio governance or the PMO so the overlap is resolved.',
		wrong: [
			'Agree with the other PM to split the overlapping scope between your two teams.',
			'Speed up so your project delivers the shared part first and the other drops it.',
			'Keep going as planned, since both projects were approved and funded on their own.',
		],
		why: 'Duplicated work is a portfolio problem: it wastes money and needs a decision above both projects. A deal between the two PMs may help, but it changes approved scope without the people who own the portfolio.',
	},
	{
		id: 'green-status',
		domain: 'Business environment',
		topic: 'Honest reporting',
		level: 'Hard',
		alt: 'The sponsor points at a status chart asking “Green?” and says “Just once”, while the project manager folds their arms.',
		situation:
			'Your project is amber, but the sponsor asks you to report it as green to the board, promising you’ll recover before anyone notices. What do you do?',
		right: 'Report amber with a recovery plan, after talking it through with the sponsor.',
		wrong: [
			'Report it as green this once, and note the real status in the project records.',
			'Report it as green, since the sponsor owns the board relationship and the risk.',
			'Report it as amber without telling the sponsor, since honesty comes first.',
		],
		why: 'Status has to be truthful, so it’s amber. But you don’t go around your sponsor either: talk to them first and bring a recovery plan, so the honest report also says how you’ll fix it.',
	},
	{
		id: 'esg',
		domain: 'Business environment',
		topic: 'Sustainability',
		level: 'Hard',
		alt: 'A project manager stands between a server rack and a stack of coins, under a green carbon target on the whiteboard.',
		situation:
			'Your company has a public carbon target. The cheapest hosting option for your project would use far more energy than the alternative. What do you do?',
		right: 'Compare cost and emissions against the target, and bring both to the sponsor.',
		wrong: [
			'Pick the cheaper option, since the budget is what the project is measured on.',
			'Pick the greener option, since it matches the company’s public commitment.',
			'Ask the sustainability team to decide, since emissions are their responsibility.',
		],
		why: 'Company strategy, sustainability goals included, is part of the environment a project serves. Make the trade-off visible and let the decision owner choose. Picking either option yourself, or handing the call to another team, skips the sponsor.',
	},
];

// Where the right answer goes: a fixed, balanced pattern (each letter equally
// often), so the position never gives the answer away.
const PATTERN = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 1, 0];

export const questions: Question[] = source.map(({ right, wrong, ...q }, i) => {
	const answer = PATTERN[i % PATTERN.length];
	const options = [...wrong];
	options.splice(answer, 0, right);
	return { ...q, options: options as Question['options'], answer };
});

// Build checks.
const ids = new Set<string>();
for (const q of questions) {
	if (ids.has(q.id)) throw new Error(`Quiz: duplicate id "${q.id}".`);
	ids.add(q.id);
	const lengths = q.options.map((o) => o.length);
	const longest = Math.max(...lengths);
	if (lengths[q.answer] === longest && lengths.filter((l) => l === longest).length === 1) {
		throw new Error(`Quiz: the right answer is the longest option in "${q.id}". Rebalance the lengths.`);
	}
}
const count = (d: Domain) => questions.filter((q) => q.domain === d).length;
if (questions.length !== 50 || count('People') !== 17 || count('Process') !== 20 || count('Business environment') !== 13) {
	throw new Error(`Quiz: expected 17 / 20 / 13 questions, got ${count('People')} / ${count('Process')} / ${count('Business environment')}.`);
}
