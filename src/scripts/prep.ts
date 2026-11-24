// The Prep page: read the résumé PDF in the browser (pdf.js, loaded only when
// a file is picked), send the form to /api/prep, show progress while the AI
// works, then render the prep in place. The last three preps are kept in
// localStorage, guarded, since storage can be missing or blocked.
import { renderPrep, wirePrep } from './render';
import { LIMITS, isPrep, type Prep, type Stage } from '../lib/prep';

type Saved = { id: string; at: string; stage: Stage; prep: Prep };
const KEY = 'prepped:recent:v1';
const MAX_SAVED = 3;

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;

const form = $<HTMLFormElement>('[data-form]');
const formView = $('[data-form-view]');
const resultView = $('[data-result-view]');
const result = $('[data-result]');
const errorBox = $('[data-error]');
const progress = $('[data-progress]');
const submit = $<HTMLButtonElement>('[data-submit]');
const fileInput = $<HTMLInputElement>('[data-file]');
const fileStatus = $('[data-file-status]');
const drop = $('[data-drop]');
const resumeBox = form.elements.namedItem('resume') as HTMLTextAreaElement;

// ---------- Saved preps ----------

function loadSaved(): Saved[] {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
		return Array.isArray(raw) ? raw.filter((s) => s && isPrep(s.prep)) : [];
	} catch {
		return [];
	}
}
function storeSaved(list: Saved[]) {
	try {
		localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)));
	} catch {
		/* Storage blocked: the prep just isn't kept. */
	}
}

function renderRecent() {
	const list = loadSaved();
	$('[data-recent-wrap]').hidden = list.length === 0;
	const ul = $('[data-recent]');
	ul.replaceChildren(
		...list.map((s) => {
			const li = document.createElement('li');
			li.className = 'flex items-center justify-between gap-gutter border-t border-ink-rule py-tight';
			const open = document.createElement('button');
			open.type = 'button';
			open.className = 'link text-left text-sm';
			open.textContent = `${s.prep.role}, ${s.prep.company}`;
			open.addEventListener('click', () => showPrep(s.prep, s.stage));
			const remove = document.createElement('button');
			remove.type = 'button';
			remove.className = 'link shrink-0 text-sm text-ink-muted';
			remove.textContent = 'Delete';
			remove.setAttribute('aria-label', `Delete the prep for ${s.prep.role}, ${s.prep.company}`);
			remove.addEventListener('click', () => {
				storeSaved(loadSaved().filter((x) => x.id !== s.id));
				renderRecent();
			});
			li.append(open, remove);
			return li;
		}),
	);
}

// ---------- Showing a prep ----------

function showPrep(prep: Prep, stage: Stage, note = '') {
	result.innerHTML = renderPrep(prep, { stage, note });
	wirePrep(result, prep);
	formView.hidden = true;
	resultView.hidden = false;
	window.scrollTo({ top: 0 });
	result.querySelector<HTMLElement>('h1')?.setAttribute('tabindex', '-1');
	result.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
}

$('[data-new]').addEventListener('click', () => {
	resultView.hidden = true;
	formView.hidden = false;
	renderRecent();
	window.scrollTo({ top: 0 });
});

// ---------- Character counts ----------

(['jobDescription', 'resume'] as const).forEach((name) => {
	const box = form.elements.namedItem(name) as HTMLTextAreaElement;
	const count = $(`[data-count="${name}"]`);
	const update = () => (count.textContent = `${box.value.length.toLocaleString()} / ${LIMITS[name].toLocaleString()}`);
	box.addEventListener('input', update);
	update();
});

// ---------- Reading the PDF ----------

async function readPdf(file: File) {
	const pdfjs = await import('pdfjs-dist');
	const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
	pdfjs.GlobalWorkerOptions.workerSrc = worker;
	const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
	const pages: string[] = [];
	for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
		const page = await doc.getPage(i);
		const content = await page.getTextContent();
		let text = '';
		for (const item of content.items) {
			if (!('str' in item)) continue;
			text += item.str + (item.hasEOL ? '\n' : ' ');
		}
		pages.push(text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim());
	}
	return pages.join('\n\n');
}

async function takeFile(file: File | undefined) {
	if (!file) return;
	if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
		fileStatus.textContent = 'That isn’t a PDF. Upload a PDF, or paste the text below.';
		return;
	}
	if (file.size > 2 * 1024 * 1024) {
		fileStatus.textContent = 'That PDF is over 2 MB. Paste the text below instead.';
		return;
	}
	fileStatus.textContent = `Reading ${file.name}…`;
	try {
		const text = await readPdf(file);
		if (text.length < 300) {
			fileStatus.textContent = 'Couldn’t find much text in that PDF (is it a scan?). Paste the text below instead.';
			return;
		}
		resumeBox.value = text.slice(0, LIMITS.resume);
		resumeBox.dispatchEvent(new Event('input'));
		fileStatus.textContent = `Read ${file.name}. Check the text below; that’s what gets sent.`;
	} catch {
		fileStatus.textContent = 'Couldn’t read that PDF. Paste the text below instead.';
	}
}

$('[data-pick]').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => takeFile(fileInput.files?.[0]));
drop.addEventListener('dragover', (e) => {
	e.preventDefault();
	drop.dataset.over = '';
});
drop.addEventListener('dragleave', () => delete drop.dataset.over);
drop.addEventListener('drop', (e) => {
	e.preventDefault();
	delete drop.dataset.over;
	takeFile(e.dataTransfer?.files?.[0]);
});

// ---------- Sending ----------

const STEPS = [
	'Reading the job post…',
	'Working out what they’re really hiring for…',
	'Matching it to your résumé…',
	'Writing the questions you’re likely to get…',
	'Building answer outlines from your experience…',
	'Writing practice situations…',
	'Almost there…',
];

function showError(message: string) {
	errorBox.textContent = message;
	errorBox.hidden = false;
	errorBox.scrollIntoView({ block: 'nearest' });
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	errorBox.hidden = true;
	const data = new FormData(form);
	const company = String(data.get('company') ?? '').trim();
	const jobDescription = String(data.get('jobDescription') ?? '').trim();
	const resume = String(data.get('resume') ?? '').trim();
	const stage = String(data.get('stage') ?? 'unknown') as Stage;
	if (!company) return showError('Add the company name.');
	if (jobDescription.length < 200) return showError('Paste the whole job description (it looks too short).');
	if (resume.length < 300) return showError('Add your résumé: upload the PDF or paste the text.');

	const turnstileToken = String(data.get('cf-turnstile-response') ?? '') || undefined;

	submit.disabled = true;
	let step = 0;
	progress.textContent = STEPS[0];
	const timer = window.setInterval(() => {
		step = Math.min(step + 1, STEPS.length - 1);
		progress.textContent = STEPS[step];
	}, 9000);

	try {
		const res = await fetch(`${import.meta.env.BASE_URL}api/prep`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ company, jobDescription, resume, stage, turnstileToken }),
		});
		const body = (await res.json().catch(() => ({}))) as { prep?: unknown; demo?: boolean; error?: string };
		if (!res.ok || !isPrep(body.prep)) {
			showError(body.error ?? 'Something went wrong. Please try again.');
			return;
		}
		const prep = body.prep;
		if (!body.demo) {
			storeSaved([{ id: crypto.randomUUID(), at: new Date().toISOString(), stage, prep }, ...loadSaved()]);
		}
		showPrep(
			prep,
			stage,
			body.demo ? 'The AI isn’t connected yet, so this is the example prep for a fictional candidate. Yours will look like this.' : '',
		);
	} catch {
		showError('Couldn’t reach Prepped. Check your connection and try again.');
	} finally {
		window.clearInterval(timer);
		submit.disabled = false;
		progress.textContent = '';
		// A Turnstile token works once; get a fresh one for the next try.
		(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
	}
});

renderRecent();
