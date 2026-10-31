# Ramble Court

Put your rambling prompt on trial. Ramble Court is for people who build by voice: paste a long, dictated prompt and it finds the exact phrases that are vague, contradictory, or missing detail, credits what is already clear, gives a verdict out of 10, and rewrites the prompt tight and ready to paste into an AI coding tool.

Plain HTML, CSS and vanilla JavaScript, plus one serverless function that calls the Gemini API. No build step, no login, no database, no analytics.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole frontend (HTML, CSS, JS in one file) |
| `api/trial.js` | Serverless function: `POST /api/trial` |
| `vercel.json` | Lets the function run up to 60 seconds (needed for the one retry) |
| `dev-server.js` | Optional zero-dependency local server |
| `.env.example` | Template for the two environment variables |

## Environment variables

| Name | What it is |
| --- | --- |
| `LLM_API_KEY` | Your Gemini API key from https://aistudio.google.com/apikey |
| `MODEL_NAME` | A Gemini model ID from the model list in Google AI Studio, e.g. `gemini-2.5-flash` (names change, so copy a current one) |

Neither value is in the code. The key is only read on the server and is never sent to the browser.

## Run locally

Requires Node 18 or newer.

1. Copy the template: `cp .env.example .env` (on Windows: `copy .env.example .env`).
2. Open `.env` and fill in `LLM_API_KEY` and `MODEL_NAME`.
3. Run `node dev-server.js`.
4. Open http://localhost:3000.

"Load example" works without any key. "Put on trial" needs both variables.

Alternative: `npx vercel dev` also works if you have the Vercel CLI and are logged in.

## Deploy to Vercel

1. Push this folder to a GitHub repository (`.env` is git-ignored, so your key stays private).
2. On vercel.com choose **Add New, Project** and import the repository.
3. Leave the framework preset as "Other" and leave build settings empty.
4. Under **Environment Variables**, add `LLM_API_KEY` and `MODEL_NAME`.
5. Click **Deploy**.

Changed a variable later? Redeploy, because Vercel only applies new values to new deployments.

## How it behaves

- The trial button needs 15 to 4,000 characters' worth of words (at least 15 words, at most 4,000 characters). The server checks this again and returns a 400 with a clear message.
- The model is asked for strict JSON. Invalid output is retried once, then the API returns a friendly 502.
- Any failure shows an error banner with **Try Again** and **Show Example Verdict Instead**, so a demo can never fail live.
- Your text is sent to an AI model to produce the analysis and is not stored by this app.
