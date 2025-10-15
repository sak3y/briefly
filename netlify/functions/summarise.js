export async function handler(event) {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "chrome-extension://bdagdjobngmcoljcokelmlcflacdodel",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  try {
    const apiKey = process.env.COHERE_API_KEY;

    const { text } = JSON.parse(event.body || "{}");
    if (!text) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "chrome-extension://bdagdjobngmcoljcokelmlcflacdodel",
        },
        body: JSON.stringify({ error: "Missing text" }),
      };
    }

    // Call Cohere API
    const res = await fetch("https://api.cohere.com/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Summarize the following as best as possible: ${text}`,
        model: "command-a-03-2025",
        stream: false,
      }),
    });

    const data = await res.json();
    const summary = data.text || "";

    // Return response with CORS header
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "chrome-extension://bdagdjobngmcoljcokelmlcflacdodel",
      },
      body: JSON.stringify({ summary, raw: data }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "chrome-extension://bdagdjobngmcoljcokelmlcflacdodel",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
