import { useEffect, useRef, useState } from "react";

const App = () => {
  const [text, setText] = useState(""); // Input text
  const [summary, setSummary] = useState(""); // Summary of input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(false); // char limit reached
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef(null);

  // Check if summary overflows, hide read more
  useEffect(() => {
    if (summary.length > 200) {
      setLimit(true);
    } else {
      setLimit(false);
    }
  }, [summary]);

  useEffect(() => {
    if (!summary) return;

    // Renders out read more when scrolled
    const handleScroll = () => {
      if (scrollRef.current.scrollTop > 40) setHasScrolled(true);
      else setHasScrolled(false);
    };

    // Scroll watcher for summary box
    const scrollBox = scrollRef.current;
    scrollBox.addEventListener("scroll", handleScroll);

    //  Event listener cleanup
    return () => {
      scrollBox.removeEventListener("scroll", handleScroll);
    };
  }, [summary]);

  const handleSummary = async () => {
    if (text.length < 1) return; // Handle empty strings

    try {
      setLoading(true); // Loading effect on button

      // Fetch summary from api
      const res = await fetch("https://briefly-sak3y.netlify.app/.netlify/functions/summarise", {
        statusCode: 200,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw Error(res.status); // Handle error

      const data = await res.json();

      // Set summary
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      setError("Failed to summarise text");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Return summary to default on clickc
  const handleReturn = () => {
    setText("");
    setSummary("");
  };

  return (
    <main>
      <div className="container">
        <h1>Summarise Text</h1>
        <div className="text-container">
          {/* Display input or summary if exists */}
          {summary ? (
            <div id="output" ref={scrollRef}>
              {/* Dipslay error if summary exist */}
              {error ? (
                <div className="error">{error}</div>
              ) : (
                <div>
                  <div className="summary">{summary}</div>
                  {limit && !hasScrolled && <div className="scroll">Scoll Down</div>}
                </div>
              )}
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
          {/* Display summarise or return button */}
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
              onClick={() => handleSummary()}
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
