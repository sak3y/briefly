import { useState } from "react";

const App = () => {
  const [text, setText] = useState(""); // Input text
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummary = async () => {
    if (text.length < 1) return;
    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setSummary(data.summary);

    } catch (err) {
      throw Error(err);
    } finally {
      setLoading(false);

      console.log(summary);
    }
  };

  const handleReturn = () => {
    setSummary("");
  };

  return (
    <main>
      <div className="container">
        <h1>Summarise Text</h1>
        <div className="text-container">
          {summary ? (
            <div id="output">{summary}</div>
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
            <button name="summarise" disabled={loading} onClick={() => handleSummary()}>
              {loading ? "..." : "Summarise"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
