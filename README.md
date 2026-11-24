# Prepped

Interview prep for one specific role. You paste the job post, add the company and the résumé you sent, and get:

- what they're really hiring for
- your fit, requirement by requirement
- your gaps and how to answer them
- a "tell me about yourself" pitch
- 12–15 likely questions, with answer outlines built from your own résumé
- a story bank and questions to ask them
- five practice situations written for that role

**Practice** is *Your Call*: 50 PMP-style project management situations, each with its own cartoon.

- **Prep page:** `src/pages/index.astro` and `src/scripts/prep.ts`. The résumé PDF is read in the browser with pdf.js.
- **Prep shape:** `src/lib/prep.ts`
- **Prompt:** `src/lib/prompt.ts`
- **Renderer:** `src/scripts/render.ts`
- **Server function:** `functions/api/prep.ts`, a Cloudflare Pages Function that forwards to a Make.com scenario running the AI. No AI key lives in this repo. To connect it, see **MAKE-SETUP.md**.
- **Example:** `src/data/example.ts`. The candidate and company are fictional. It's shown at `/example/`, and it's what the function returns until Make is connected.
- **Practice:** `src/pages/practice/`
  - questions: `src/data/questions.ts` (People 17 / Process 20 / Business environment 13, matching the 2026 PMP outline)
  - cartoons: `src/components/Scene.astro`
  - game logic: `src/scripts/game.ts`
- **Look:** the tokens are copied from the portfolio site (`src/styles/tokens.css`). Keep them in sync.

## Run

```sh
npm install
npm run build
npm run serve    # http://127.0.0.1:4410 with the server function
```
