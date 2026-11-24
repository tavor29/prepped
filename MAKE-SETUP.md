# Connecting the AI (Make.com) and going live (Cloudflare Pages)

Prepped never holds an AI key. When someone asks for a prep, the page sends the form to `/api/prep`, a small Cloudflare Pages Function (`functions/api/prep.ts`). The function:

1. checks the form and the Turnstile bot check
2. counts the visitor's daily limit
3. builds the prompt (`src/lib/prompt.ts`)
4. sends it to your Make scenario
5. checks the reply has the right shape before passing it back

Until `MAKE_WEBHOOK_URL` is set, the function returns the example prep, so the site works end to end without Make.

## 1. The Make scenario (three modules)

**Module 1: Webhooks > Custom webhook.** Create a new webhook and copy its URL.

The function sends this JSON body:

```json
{ "key": "<MAKE_WEBHOOK_KEY>", "system": "<the instructions>", "user": "<the job post and résumé>" }
```

To let Make learn the structure, click "Redetermine data structure" and send it one test request, for example from a terminal:

```sh
curl -X POST "<webhook URL>" -H "content-type: application/json" -d "{\"key\":\"test\",\"system\":\"s\",\"user\":\"u\"}"
```

**Filter between modules 1 and 2.** Allow the run only when `key` equals your secret (the same value you set as `MAKE_WEBHOOK_KEY` in Cloudflare). This stops anyone who finds the webhook URL from spending your Make operations.

**Module 2: the AI.** Use the Anthropic Claude module (or another AI module you prefer). Settings:

- Model: a Claude Sonnet model
- System prompt: map `system`
- Message (role user): map `user`
- Max tokens: 8000. The prep is long; too low a limit cuts the JSON short, and the function rejects it.
- Temperature: around 0.4, if the module offers it

**Module 3: Webhooks > Webhook response.**

- Status: `200`
- Body: map the AI module's text output, with nothing else around it
- Custom header: `content-type: application/json`

The function also accepts the text wrapped in a field called `result` (`{"result": "<text>"}`) if that's easier to map.

**Scheduling.** Turn the scenario on and set it to run immediately as data arrives. Make waits only a limited time for the Webhook response (a few minutes). A prep normally takes 30–90 seconds.

## 2. Cloudflare Pages

1. Push this repo to GitHub, then go to Cloudflare > Workers & Pages > Create > Pages > Connect to Git and pick the repo.
2. Build settings:
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
3. Settings > Variables and secrets (Production):

| Name | Type | Value |
| --- | --- | --- |
| `MAKE_WEBHOOK_URL` | Secret | the Make webhook URL |
| `MAKE_WEBHOOK_KEY` | Secret | a long random string, the same one as in the Make filter |
| `TURNSTILE_SECRET` | Secret | Turnstile secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | Turnstile site key (read at build time, so redeploy after setting it) |
| `LIMIT_PER_VISITOR` | Variable | optional, default 3 |
| `LIMIT_TOTAL` | Variable | optional, default 100 |

4. **Daily limits.** Create a KV namespace (Workers & Pages > KV), for example `prepped-rate`. Then bind it to the Pages project as `RATE` under Settings > Bindings. Without `RATE` there are no daily limits.
5. **Turnstile.** In Cloudflare > Turnstile, add the Pages hostname (for example `prepped.pages.dev`) to a widget. You can use the existing widget or create a new one.
6. Redeploy.

## 3. Check it

- Open the site and use **See an example** to check the page layout.
- Build a prep with a real job post and résumé. If it fails, the page shows the reason, and the Make scenario's history shows what the AI returned.
- **"The AI's reply was incomplete":** the JSON was cut off (raise max tokens) or a field was missing.

## Local development

```sh
npm install
npm run build
npm run serve    # wrangler pages dev on http://127.0.0.1:4410, with the function
```

For a local test against Make, put `MAKE_WEBHOOK_URL=...` and `MAKE_WEBHOOK_KEY=...` in a `.dev.vars` file. It's git-ignored; never commit it.
