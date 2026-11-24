# Connecting the AI (Make.com) and going live (Cloudflare Pages)

Prepped never holds an AI key. When someone asks for a prep, the page sends the form to `/api/prep`, a small Cloudflare Pages Function (`functions/api/prep.ts`). The function:

1. checks the form and the Turnstile bot check
2. counts the visitor's daily limit
3. builds the complete Claude API request: the prompt (`src/lib/prompt.ts`), the model, and a JSON schema (`src/lib/schema.ts`) that makes the reply valid JSON
4. sends that request to your Make scenario, which forwards it to the Claude API with the key stored in Make
5. checks the reply has the right shape before passing it back

Until `MAKE_WEBHOOK_URL` is set, the function returns the example prep, so the site works end to end without Make.

## 1. Import the scenario

1. In Make, go to **Scenarios > Create a new scenario**, click the **…** menu at the bottom, choose **Import Blueprint**, and pick `make/prepped.blueprint.json`.
2. **Module 1, Custom webhook.** Click it and choose **Add** to create a webhook (for example "prepped"). Copy its URL: that's `MAKE_WEBHOOK_URL`.
3. **The filter between modules 1 and 2.** Click the small filter icon on the line. Replace `REPLACE_WITH_YOUR_MAKE_WEBHOOK_KEY` with a long random string you make up. Use the same string as `MAKE_WEBHOOK_KEY` in Cloudflare. This stops anyone who finds the webhook URL from spending your Claude credits.
4. **Module 2, HTTP "Make a request" (Claude API).** In the headers, replace `REPLACE_WITH_YOUR_ANTHROPIC_API_KEY` with your Anthropic API key, from the [Anthropic Console](https://platform.claude.com/) > API keys. Leave everything else as imported:
   - POST to `https://api.anthropic.com/v1/messages`
   - header `anthropic-version: 2026-10-21`
   - body type **Raw**, content type **JSON**, request content `{{1.anthropicBody}}`
   - **Parse response: No**
   - timeout 300
5. **Module 3, Webhook response.** Status `{{2.statusCode}}`, body `{{2.data}}`, header `content-type: application/json`.
6. **Teach module 1 the data.** Click module 1 and choose **Redetermine data structure**. Then send one request from a terminal. The filter won't match this test, so nothing is sent to Claude:

   ```sh
   curl -X POST "<webhook URL>" -H "content-type: application/json" -d "{\"key\":\"test\",\"anthropicBody\":\"{}\"}"
   ```

7. **Scenario settings** (the gear icon at the bottom):
   - **Data is confidential** is on in the blueprint. Make then doesn't keep the résumés and job posts in its run history. Turn it off for a short while only if you need to debug a run.
   - Save, switch the scenario **On**, and set it to run **immediately** as data arrives.

**Spend.** Set a monthly spend limit in the Anthropic Console. Each prep is one Claude call, on Claude Sonnet 5.5 by default.

**Model.** To use a different model, set `MODEL` in Cloudflare, for example `claude-opus-5-5`: stronger, but slower and pricier. Nothing in Make needs to change.

**Speed.** The function asks for medium effort so a prep normally finishes in about a minute, well within Make's wait for the webhook response.

### Using Make's built-in Claude module instead of HTTP

If you'd rather use Make's Anthropic Claude module (a Make connection instead of a pasted key):

- Map the system prompt and the user message from the decoded body. Add a **JSON > Parse JSON** module on `{{1.anthropicBody}}` first, then map its `system` and `messages[1].content`.
- Set max tokens to 16000.
- In the Webhook response, return `{"result": <the module's text output>}` and wrap it with a **JSON > Create JSON** module, so quotes and line breaks are escaped.
- The function accepts that form too. It loses the schema guarantee, though, so the HTTP route above is more reliable.

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
| `MAKE_WEBHOOK_KEY` | Secret | the same random string as in the Make filter |
| `TURNSTILE_SECRET` | Secret | Turnstile secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | Turnstile site key (read at build time, so redeploy after setting it) |
| `MODEL` | Variable | optional, default `claude-sonnet-5-5` |
| `LIMIT_PER_VISITOR` | Variable | optional, default 3 |
| `LIMIT_TOTAL` | Variable | optional, default 100 |

4. **Daily limits.** Create a KV namespace (Workers & Pages > KV), for example `prepped-rate`. Then bind it to the Pages project as `RATE` under Settings > Bindings. Without `RATE` there are no daily limits.
5. **Turnstile.** In Cloudflare > Turnstile, add the Pages hostname (for example `prepped.pages.dev`) to a widget.
6. Redeploy.

## 3. Check it

- Build a prep with a real job post and résumé.
- If it fails, the page shows the reason in plain words:
  - "The AI is busy right now": rate limits
  - "The AI declined this one": a refusal
  - "The prep came out too long and was cut off": the reply hit its length limit
  - "The AI service had a problem": anything else from the API
- For the details, look at the scenario's run in Make, with "Data is confidential" turned off briefly.

## Local development

```sh
npm install
npm run build
npm run serve    # wrangler pages dev on http://127.0.0.1:4410, with the function
```

For a local test against Make, put `MAKE_WEBHOOK_URL=...` and `MAKE_WEBHOOK_KEY=...` in a `.dev.vars` file. It's git-ignored; never commit it.
