import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("hi");
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ar", name: "Arabic" },
  ];

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setTranslatedText("");

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${fromLang}|${toLang}`;

      const res = await fetch(url);
      const data = await res.json();

      setTranslatedText(data.responseData.translatedText);
    } catch (err) {
      console.error("Translation Error:", err);
      alert("Something went wrong while translating!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🌐 Language Translator
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="border p-3 rounded-xl w-full"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <span className="text-center md:mt-3 font-bold text-gray-500">➡️</span>

          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="border p-3 rounded-xl w-full"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded-xl w-full p-3 h-32 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
        ></textarea>

        <button
          onClick={handleTranslate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-xl text-lg transition"
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {translatedText && (
          <div className="mt-6 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <h2 className="font-semibold text-indigo-700 mb-2">Translation:</h2>
            <p className="text-gray-800 text-lg">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
