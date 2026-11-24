# Your Call

A project management judgment game. It has 50 situations from tech companies and startups, written in the style of the PMP exam. Each round is up to ten questions, ordered from easy to hard. For each one you pick what you'd do, then see the best answer and why.

- **Questions:** `src/data/questions.ts`. The mix follows the 2026 PMP exam outline: People 17, Process 20, Business environment 13. The build fails if the counts are off, if an id repeats, or if a right answer is the longest option.
- **Cartoons:** `src/components/Scene.astro`, one per question and keyed by the question's `id`. They're built from `scene/Person.astro` and `scene/Prop.astro`.
- **Game logic:** `src/scripts/game.ts`. Progress is saved in the browser's `localStorage` only.
- **Look:** the design tokens are copied from the portfolio site (`src/styles/tokens.css`). Keep them in sync with the site.

## Run

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

The site is served at `/` by default. Set `BASE=/pm-quiz/` when building for a GitHub Pages project site.
