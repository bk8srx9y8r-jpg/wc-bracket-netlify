const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_MATCHES_TABLE = process.env.AIRTABLE_MATCHES_TABLE;

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function handler(event, context) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_MATCHES_TABLE) {
    return response(500, { error: "Missing Airtable environment variables." });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_MATCHES_TABLE)}?sort[0][field]=Sort+Order&sort[0][direction]=asc&pageSize=100`;

    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      return response(airtableRes.status, {
        error: data?.error?.message || "Failed to load matches from Airtable.",
        details: data,
      });
    }

    return response(200, { records: data.records || [] });
  } catch (error) {
    return response(500, {
      error: error.message || "Unexpected server error while loading matches.",
    });
  }
}
