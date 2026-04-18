const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PARTICIPANTS_TABLE = process.env.AIRTABLE_PARTICIPANTS_TABLE;

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed." });
  }

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_PARTICIPANTS_TABLE) {
    return response(500, { error: "Missing Airtable environment variables." });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const fields = payload.fields || {};

    if (!fields["fldDwLpP0cnkH0qYX"] || !fields["fldM5u16y3q6MkSBk"] || !fields["fldxLcf9nEHthI9gT"]) {
      return response(400, { error: "Missing required participant fields." });
    }

    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_PARTICIPANTS_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{ fields }],
          typecast: true,
        }),
      }
    );

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      return response(airtableRes.status, {
        error: data?.error?.message || "Failed to submit bracket to Airtable.",
        details: data,
      });
    }

    return response(200, { success: true, record: data.records?.[0] || null });
  } catch (error) {
    return response(500, {
      error: error.message || "Unexpected server error while submitting bracket.",
    });
  }
}
