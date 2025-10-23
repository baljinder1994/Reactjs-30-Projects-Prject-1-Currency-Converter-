import React, { useState, useEffect, useRef } from "react";

const sampleTexts = [
  "Practice makes a person perfect in everything they do.",
  "Typing fast is not just about speed, but accuracy too.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Learning React is fun when you actually build projects!",
];

export default function App() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isFinished]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setInput(value);

    if (value === text) {
      finishTest();
    }
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    const timeTaken = (Date.now() - startTime) / 60000; // in minutes
    const wordsTyped = input.trim().split(/\s+/).length;
    const wpmCalc = Math.round(wordsTyped / timeTaken);

    const correctChars = input
      .split("")
      .filter((ch, i) => ch === text[i]).length;
    const accCalc = Math.round((correctChars / text.length) * 100);

    setWpm(wpmCalc);
    setAccuracy(accCalc);
    setIsFinished(true);
  };

  const resetTest = () => {
    clearInterval(timerRef.current);
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    setIsFinished(false);
    setTime(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 text-white px-4">
      <div className="bg-gray-800/80 p-8 rounded-2xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
          ⚡ Typing Speed Checker
        </h1>

        {/* Target Text */}
        <p className="text-lg mb-6 leading-relaxed text-gray-300">
          {text.split("").map((char, i) => {
            let color = "";
            if (i < input.length) {
              color = char === input[i] ? "text-green-400" : "text-red-500";
            }
            return (
              <span key={i} className={`${color}`}>
                {char}
              </span>
            );
          })}
        </p>

        {/* Typing Box */}
        <textarea
          className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400 outline-none mb-4"
          value={input}
          onChange={handleChange}
          disabled={isFinished}
          rows="4"
          placeholder="Start typing here..."
        ></textarea>

        {/* Stats */}
        <div className="flex justify-around mb-4 text-lg">
          <div>
            ⏱️ <span className="text-yellow-400">{time}s</span>
          </div>
          <div>
            🏁 WPM: <span className="text-green-400">{wpm}</span>
          </div>
          <div>
            🎯 Accuracy: <span className="text-blue-400">{accuracy}%</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {!isFinished ? (
            <button
              onClick={finishTest}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-full font-semibold transition-transform hover:scale-105"
            >
              Finish Test ✅
            </button>
          ) : (
            <button
              onClick={resetTest}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold transition-transform hover:scale-105"
            >
              Try Again 🔁
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Type fast but type right ⚡ | Your speed = {wpm} WPM
      </p>
    </div>
  );
}
