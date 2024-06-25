import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { marked } from "marked";
import oracleImage from "./assets/oracle.jpeg";

declare global {
  interface Window {
    ai?: {
      createTextSession: () => Promise<{
        prompt: (query: string) => Promise<string>;
      }>;
    };
  }
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [featureAvailable, setFeatureAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (!window.ai || !window.ai.createTextSession) {
      setFeatureAvailable(false);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset error state
    if (query.trim() === "") return;

    if (!featureAvailable) {
      setError("The AI feature is not available in your browser.");
      return;
    }

    try {
      console.log("Creating text session...");
      const sesh = await window.ai.createTextSession();
      console.log("Session created:", sesh);
      const result = await sesh.prompt(query);
      console.log("Result received:", result);

      // Set the response (Markdown format expected)
      setResponse(result);
    } catch (err) {
      console.error("Error creating text session:", err);
      setError(
        "Failed to create session or retrieve response. Please try again.",
      );
    }
  };

  return (
    <div className="app">
      <img
        src={oracleImage}
        alt="The Browser Oracle"
        className="oracle-image"
      />
      <h1>The Digital Oracle</h1>
      <p>
        Enter your query below and behold the wisdom of the virtual sage. Don't
        worry, even simple minds can seek knowledge.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Seek your answer..."
        />
        <button type="submit">Reveal Truth</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div
          className="response"
          dangerouslySetInnerHTML={{ __html: marked(response) }}
        ></div>
      )}
    </div>
  );
};

export default App;
