// The game loop for pages/index.astro. Questions live in <template data-q>
// elements; a round draws up to ten the player hasn't seen (from one domain
// or all), mixes easy, medium and hard, and orders them easy to hard.
// Results stay in localStorage, which can be missing or blocked, so every
// read and write is guarded and the game still works without it.

type Level = 'Easy' | 'Medium' | 'Hard';
type Results = Record<string, boolean>;

const ROUND = 10;
/** How many of each level a full round aims for. */
const MIX: Record<Level, number> = { Easy: 4, Medium: 3, Hard: 3 };
const LEVELS: Level[] = ['Easy', 'Medium', 'Hard'];
const KEY = 'your-call:v1';

const RIGHT = [
	'Correct. That’s the call I’d make too.',
	'Spot on. You think like a PM.',
	'Right. The textbook answer, and the one that works in practice.',
	'Yes. Good instinct.',
];
const WRONG = [
	'Not quite. Tricky, right?',
	'Close, and a very common call. Here’s the one that holds up.',
	'Not this time. Here’s why.',
	'A reasonable move, but not the best one.',
];

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const templates = $$<HTMLTemplateElement>('template[data-q]');
const byId = new Map(templates.map((t) => [t.dataset.q!, t]));

function load(): Results {
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}
function save(r: Results) {
	try {
		localStorage.setItem(KEY, JSON.stringify(r));
	} catch {
		/* Private mode or blocked storage: progress just isn't kept. */
	}
}

let results = load();
let domain = 'all';
let round: HTMLTemplateElement[] = [];
let index = 0;
let score = 0;
let roundResults: { t: HTMLTemplateElement; correct: boolean }[] = [];

const inDomain = (t: HTMLTemplateElement) => domain === 'all' || t.dataset.domain === domain;
const unseen = () => templates.filter((t) => inDomain(t) && !(t.dataset.q! in results));

function shuffle<T>(a: T[]) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function draw() {
	const pool = unseen();
	const picked: HTMLTemplateElement[] = [];
	for (const level of LEVELS) {
		picked.push(...shuffle(pool.filter((t) => t.dataset.level === level)).slice(0, MIX[level]));
	}
	const rest = shuffle(pool.filter((t) => !picked.includes(t)));
	while (picked.length < ROUND && rest.length) picked.push(rest.pop()!);
	return picked.sort((a, b) => LEVELS.indexOf(a.dataset.level as Level) - LEVELS.indexOf(b.dataset.level as Level));
}

// ---------- Screens ----------

const screens = $$('[data-screen]');
function show(name: string) {
	screens.forEach((s) => (s.hidden = s.dataset.screen !== name));
	const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
	window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
}

function renderStart() {
	const played = Object.keys(results).length;
	$$('[data-progress]').forEach((card) => {
		const d = card.dataset.progress!;
		const all = templates.filter((t) => t.dataset.domain === d);
		const seen = all.filter((t) => t.dataset.q! in results);
		const right = seen.filter((t) => results[t.dataset.q!]).length;
		$('[data-bar]', card).style.width = `${(seen.length / all.length) * 100}%`;
		$('[data-progress-text]', card).textContent = seen.length
			? `${seen.length} of ${all.length} played · ${Math.round((right / seen.length) * 100)}% right`
			: `0 of ${all.length} played`;
	});
	$('[data-reset]').hidden = played === 0;

	const left = unseen().length;
	const start = $<HTMLButtonElement>('[data-start]');
	const note = $('[data-start-note]');
	const scope = domain === 'all' ? '' : ` in ${domain}`;
	if (left === 0) {
		start.textContent = 'Play them again';
		note.textContent = `You’ve played every question${scope}.`;
	} else {
		start.textContent = 'Start a round';
		note.textContent = `${left} new question${left === 1 ? '' : 's'}${scope}. ${Math.min(ROUND, left)} in this round.`;
	}
}

function startRound() {
	if (unseen().length === 0) {
		// Everything here has been played: clear just this selection and go again.
		templates.filter(inDomain).forEach((t) => delete results[t.dataset.q!]);
		save(results);
	}
	round = draw();
	index = 0;
	score = 0;
	roundResults = [];
	show('round');
	renderQuestion();
}

function renderQuestion() {
	const t = round[index];
	const stage = $('[data-stage]');
	stage.replaceChildren(t.content.cloneNode(true));
	$('[data-round-count]').textContent = `${index + 1} / ${round.length}`;
	$('[data-round-bar]').style.width = `${(index / round.length) * 100}%`;

	const answer = Number(t.dataset.answer);
	const options = $$<HTMLButtonElement>('[data-option]', stage);
	const feedback = $('[data-feedback]', stage);
	const verdict = $('[data-verdict]', stage);
	const next = $<HTMLButtonElement>('[data-next]', stage);
	next.textContent = index < round.length - 1 ? 'Next situation' : 'See my score';

	options.forEach((btn) =>
		btn.addEventListener('click', () => {
			const picked = Number(btn.dataset.option);
			const correct = picked === answer;
			if (correct) score++;
			roundResults.push({ t, correct });
			results[t.dataset.q!] = correct;
			save(results);
			options.forEach((o, j) => {
				o.disabled = true;
				o.dataset.state = j === answer ? 'right' : j === picked ? 'wrong' : 'dim';
				$('[data-mark="right"]', o).hidden = j !== answer;
				$('[data-mark="wrong"]', o).hidden = !(j === picked && !correct);
			});
			const lines = correct ? RIGHT : WRONG;
			verdict.textContent = lines[Math.floor(Math.random() * lines.length)];
			verdict.dataset.correct = String(correct);
			feedback.hidden = false;
			$('[data-round-bar]').style.width = `${((index + 1) / round.length) * 100}%`;
			feedback.focus({ preventScroll: true });
			if (feedback.getBoundingClientRect().bottom > innerHeight) {
				feedback.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}),
	);

	next.addEventListener('click', () => {
		index++;
		if (index < round.length) {
			renderQuestion();
			const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
			window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
		} else renderEnd();
	});

	$('h2', stage).focus({ preventScroll: true });
}

function endLine(s: number, n: number) {
	const ratio = s / n;
	if (ratio === 1) return 'A perfect round. You think like a PM.';
	if (ratio >= 0.8) return 'Strong instincts. A couple of these trip up experienced PMs too.';
	if (ratio >= 0.5) return 'Good calls, and some useful ones to read twice.';
	return 'These are harder than they look. Read the why on each one, then try another round.';
}

function renderEnd() {
	$('[data-score]').textContent = String(score);
	$('[data-total]').textContent = String(round.length);
	$('[data-end-line]').textContent = endLine(score, round.length);

	const list = $('[data-review]');
	list.replaceChildren(
		...roundResults.map(({ t, correct }) => {
			const li = document.createElement('li');
			li.className = 'review-row';
			const mark = byId.get(t.dataset.q!)!.content.querySelector(correct ? '[data-mark="right"]' : '[data-mark="wrong"]')!;
			const icon = mark.cloneNode(true) as HTMLElement;
			icon.hidden = false;
			const text = document.createElement('span');
			text.textContent = `${t.dataset.topic} · ${t.dataset.level}`;
			const result = document.createElement('span');
			result.className = 'review-result';
			result.textContent = correct ? 'Right' : 'Missed';
			li.append(icon, text, result);
			return li;
		}),
	);

	const left = unseen().length;
	const nextBtn = $<HTMLButtonElement>('[data-next-round]');
	nextBtn.textContent = left ? `Next round (${Math.min(ROUND, left)} new)` : 'Play them again';
	show('end');
	$('[data-screen="end"] h2').focus({ preventScroll: true });
}

// ---------- Wiring ----------

$$<HTMLButtonElement>('[data-domain]').forEach((btn, _, all) =>
	btn.addEventListener('click', () => {
		domain = btn.dataset.domain!;
		all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
		renderStart();
	}),
);
$('[data-start]').addEventListener('click', startRound);
$('[data-next-round]').addEventListener('click', startRound);
$('[data-back]').addEventListener('click', () => {
	renderStart();
	show('start');
});
$('[data-home]').addEventListener('click', () => {
	renderStart();
	show('start');
});
$('[data-reset]').addEventListener('click', () => {
	if (!confirm('Clear your progress and start fresh?')) return;
	results = {};
	save(results);
	renderStart();
});

renderStart();
