import { useState } from "react";

const App = () => {
  const [text, setText] = useState(""); // Input text
  const [summary, setSummary] = useState(""); // Summary of input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleSummarise = async () => {
    if (text.length < 1) return; // Handle edge case

    console.log("Text to summarise:", text);

    try {
      setLoading(true); // Visual cue on button

      // Fetch local endpoint from serverless function
      const res = await fetch("/.netlify/functions/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setSummary(data.summary || "No Summary");
    } catch (err) {
      setSummary("Couldn't summarise text");
      console.error("Couldn't call function:", err);
    } finally {
      setLoading(false);
    }
  };


  // Return back to default
  const handleReturn = () => {
    setSummary("");
  };

  return (
    <main>
      <div className="container">
        <h1>Summarise Text</h1>
        <div className="text-container">
          {/* Display input or summary */}
          {summary ? (
            <div id="output">{error ? error : summary}</div>
          ) : (
            <textarea
              autoFocus
              about="Summarise text"
              placeholder="Paste Text Here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            ></textarea>
          )}
        </div>

        <div className="btn-container">
          {/* Display either summarise or return button */}
          {summary ? (
            <button
              name="Return"
              onClick={() => {
                handleReturn();
              }}
            >
              Return
            </button>
          ) : (
            <button name="summarise" disabled={loading} className="shimmer" onClick={() => handleSummarise()}>
              {loading ? "Summarising..." : "Summarise"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
