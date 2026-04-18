# Netlify + Airtable Bracket Form

This version removes the Airtable personal access token from the browser.

## Files
- `index.html` — frontend bracket form
- `netlify/functions/load-matches.js` — reads bracket match data from Airtable
- `netlify/functions/submit-bracket.js` — writes participant picks to Airtable
- `netlify.toml` — tells Netlify where functions live

## Netlify environment variables
In Netlify, go to:

**Site configuration → Environment variables**

Add these:

- `AIRTABLE_TOKEN` = your Airtable personal access token
- `AIRTABLE_BASE_ID` = `app0EbSfMvO1YAieV`
- `AIRTABLE_MATCHES_TABLE` = `tblBBIQJvHooxbQyA`
- `AIRTABLE_PARTICIPANTS_TABLE` = `tblzGNRjUuXLe3zdD`

## Airtable token scopes
Your token needs both:
- `data.records:read`
- `data.records:write`

And it must be granted access to the correct base.

## Deploy structure
Upload these files to your Netlify site root.

## Local test
If you use Netlify CLI, run:
```bash
netlify dev
```

## Important
This keeps your token off the public frontend. The browser only talks to Netlify functions.
