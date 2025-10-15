import { useState } from "react";

const App = () => {
  const [text, setText] = useState(""); // Input text
  const [summary, setSummary] = useState(""); // Summary of input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarise = async () => {
    if (text.length < 1) return; // Handle empty strings

    try {
      setLoading(true); // Loading effect on button

      // Fetch api from local endpoint
      const res = await fetch("/.netlify/functions/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw Error(res.status);

      const data = await res.json();

      // Set summary
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setError("no summary");
      }
    } catch (err) {
      setError("Couldn't summarise text");
      console.error("Couldn't call function:", err);
    } finally {
      setLoading(false);
    }
  };

  // Return summary to default
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
            <div id="output">
              {error ? <div className="error">{error}</div> : <div>{summary}</div>}
            </div>
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
            <button
              name="summarise"
              disabled={loading}
              className="shimmer-btn"
              onClick={() => handleSummarise()}
            >
              {loading ? "Summarising..." : "Summarise"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
