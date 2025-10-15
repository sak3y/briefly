export async function handler(event) {
  try {
    // eslint-disable-next-line no-undef
    const apiKey = process.env.COHERE_API_KEY;

    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 400, body: JSON.stringify({ error: "Missing text" }) };

    // Fetch from Cohere chat
    const res = await fetch("https://api.cohere.com/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "chrome-extension://bdagdjobngmcoljcokelmlcflacdodel",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: `Summarize the following as best as possible: ${text}`, // Chat prompt to summ
        model: "command-a-03-2025",
        stream: false,
      }),
    });

    const data = await res.json();

    // Returns Cohere 'text' response as summary
    const summary = data.text || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ summary, raw: data }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
