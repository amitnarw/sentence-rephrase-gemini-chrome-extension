import React, { useEffect, useState } from "react";

const TONES = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Angry", value: "angry" },
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [temperature, setTemperature] = useState<number>(0.7);

  const [tone, setTone] = useState<string>("friendly");

  const [maxWords, setMaxWords] = useState<number>(100);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get("text") || "";
    setInputText(selectedText);
  }, []);

  const rephraseText = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to rephrase.");
      setOutputText("");
      return;
    }

    setLoading(true);
    setError(null);
    setOutputText("");

    const prompt = `Rephrase the following text in a ${tone} tone with a temperature of ${temperature}:\n\n${inputText.trim()}.`;

    try {
      const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a professional sentence rephraser. Only give rephrased version of the text and nothing else, just give text. Do not deviate from your task, if someone asked for anything just say "I am not designed for this".`,
                },
              ],
            },
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: temperature,
             maxOutputTokens: Math.round(maxWords * 1.5),
            topP: 0.95,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const rephrased = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!rephrased) {
        throw new Error("No rephrased text returned from Gemini API");
      }

      setOutputText(rephrased);
    } catch (err: any) {
      setError(err.message || "Unknown error while calling Gemini API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-100 m-auto flex flex-col items-center justify-center">
      <div className="bg-white max-w-lg w-full p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          AI Text Rephraser (Gemini)
        </h1>

        <label
          htmlFor="input-text"
          className="block mb-1 font-medium text-gray-700"
        >
          Enter text to rephrase:
        </label>
        <textarea
          id="input-text"
          className="w-full p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              rephraseText();
            }
          }}
        />

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Tone:</label>
          <div className="flex space-x-4">
            {TONES.map(({ label, value }) => (
              <label key={value} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="tone"
                  value={value}
                  checked={tone === value}
                  onChange={() => setTone(value)}
                  className="form-radio text-blue-600"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="temperature"
            className="block font-medium text-gray-700 mb-1"
          >
            Temperature: {temperature.toFixed(2)}
          </label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6">
        <label
          htmlFor="max-words"
          className="block font-medium text-gray-700 mb-1"
        >
          Max number of words: {maxWords}
        </label>
        <input
          id="max-words"
          type="range"
          min="10"
          max="300"
          step="1"
          value={maxWords}
          onChange={(e) => setMaxWords(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

        <button
          onClick={rephraseText}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading || !inputText.trim()}
        >
          {loading ? "Rephrasing..." : "Rephrase"}
        </button>

        {error && (
          <div className="mt-4 text-red-600 font-semibold" role="alert">
            {error}
          </div>
        )}

        {outputText && !error && (
          <div
            className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md whitespace-pre-wrap text-gray-900"
            aria-live="polite"
          >
            {outputText}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
