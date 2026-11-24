# Connecting the AI (Make.com) and going live (Cloudflare Pages)

Prepped never holds an AI key. When someone asks for a prep, the page sends the form to `/api/prep`, a small Cloudflare Pages Function (`functions/api/prep.ts`). The function:

1. checks the form and the Turnstile bot check
2. counts the visitor's daily limit
3. builds the prompt (`src/lib/prompt.ts`)
4. sends it to your Make scenario
5. checks the reply has the right shape before passing it back

The webhook body has:

- `instructions`: the coaching rules and the exact JSON shape to return
- `input`: the company, the stage, the job post, the résumé and any extra material
- `key`
- `anthropicBody`: only for option B below

Until `MAKE_WEBHOOK_URL` is set, the function returns the example prep, so the site works end to end without Make.

## 1A. The Make scenario with Make's free AI Agent (recommended)

Three modules, built by hand in about 5 minutes. They use **Make's AI Provider**, so there's no API key to manage. It runs on Make credits and works on every Make plan; Make lists it as an open beta.

**Module 1: Webhooks > Custom webhook.**

1. Click **Add** under Webhook and name it "prepped".
2. Under **API keys**, add a key: a long random string you make up. That's `MAKE_WEBHOOK_KEY`. Prepped sends it in the `x-make-apikey` header, and Make rejects any call without it, so a leaked webhook URL can't spend your credits.
3. Copy the webhook URL: that's `MAKE_WEBHOOK_URL`.
4. Click **Redetermine data structure**, then send one sample so Make learns the fields:

```sh
curl -X POST "<webhook URL>" -H "content-type: application/json" -H "x-make-apikey: <your key>" -d "{\"key\":\"x\",\"instructions\":\"x\",\"input\":\"x\",\"anthropicBody\":\"x\"}"
```

**Module 2: Make AI Agent (New) > Run an agent.**

| Field | Set it to |
| --- | --- |
| Connection | **Make's AI Provider** |
| Model | the most capable model on offer. Prep quality depends on it. |
| Instructions | map `instructions` from module 1 |
| Input | map `input` from module 1 |
| Conversation ID | **leave empty**. Every run is a fresh conversation, so one candidate's résumé never carries into another's prep. |
| Response format | **Text** |
| Maximum output length | 100% (the prep is long; less cuts it off) |
| Step timeout | 600 |
| Knowledge, tools, MCP | none |

**Module 3: Webhooks > Webhook response.**

- **Status:** `200`.
- **Body:** map only the agent's **Response**, with nothing around it. The response is itself the JSON prep. Don't wrap it in `{"response": "..."}` typed by hand, because quotes inside the text would break it.
- **Custom headers** (under Advanced settings): `content-type` = `application/json`.

**Scenario settings** (the gear icon at the bottom):

- Turn on **Data is confidential**, so Make doesn't keep the résumés and job posts in its run history. Turn it off for a short while only if you need to debug a run.
- Save, switch the scenario **On**, and set it to **Immediately as data arrives**.

**If preps come back incomplete or the page says the reply couldn't be read:** the model on offer may be struggling with the long JSON. Pick a larger model in module 2, or use option B.

## 1B. The alternative: the Claude API directly (import a blueprint)

Use this for stronger, guaranteed-valid output: the request carries a JSON schema the API enforces. It needs an Anthropic API key, which you paste into Make; it never goes into the app or the repo.

1. In Make, go to **Scenarios > Create a new scenario**, open the **…** menu at the bottom, choose **Import Blueprint**, and pick `make/prepped.blueprint.json`.
2. **Module 1:** click **Add** to create the webhook, and copy its URL.
3. **The filter on the line between modules 1 and 2:** replace `REPLACE_WITH_YOUR_MAKE_WEBHOOK_KEY` with your `MAKE_WEBHOOK_KEY`. Or delete the filter and set an API key on the webhook as in 1A.
4. **Module 2 (HTTP):** replace `REPLACE_WITH_YOUR_ANTHROPIC_API_KEY` with your key from the [Anthropic Console](https://platform.claude.com/). It posts `{{1.anthropicBody}}` raw to `https://api.anthropic.com/v1/messages` with `anthropic-version: 2026-10-21`, and Parse response is off.
5. **Module 3:** status `{{2.statusCode}}`, body `{{2.data}}`.
6. Redetermine the webhook's data structure, turn on Data is confidential, and switch the scenario on.
7. **Model and spend:**
   - It runs on Claude Sonnet 5.5 at medium effort. Set `MODEL` in Cloudflare to change the model, for example `claude-opus-5-5`.
   - Set a monthly spend limit in the Anthropic Console.

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
| `MAKE_WEBHOOK_KEY` | Secret | the webhook's API key (1A) or the filter's string (1B) |
| `TURNSTILE_SECRET` | Secret | Turnstile secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | Turnstile site key (read at build time, so redeploy after setting it) |
| `MODEL` | Variable | option 1B only, default `claude-sonnet-5-5` |
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
  - "The AI’s reply couldn’t be read" or "was incomplete": with option 1A, the agent didn’t return clean JSON in the full shape; try a larger model
- For the details, look at the scenario's run in Make, with "Data is confidential" turned off briefly.

## Local development

```sh
npm install
npm run build
npm run serve    # wrangler pages dev on http://127.0.0.1:4410, with the function
```

For a local test against Make, put `MAKE_WEBHOOK_URL=...` and `MAKE_WEBHOOK_KEY=...` in a `.dev.vars` file. It's git-ignored; never commit it.
