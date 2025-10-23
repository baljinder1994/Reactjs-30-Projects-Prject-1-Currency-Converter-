import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput("");
    } else if (value === "⌫") {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    "C", "⌫", "%", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "="
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-6 w-80 border border-white/20">
        <h1 className="text-white text-3xl font-bold text-center mb-4">🧮 Modern Calculator</h1>

        <div className="bg-white/20 text-right text-2xl text-white p-4 rounded-xl mb-4 min-h-[60px]">
          {input || "0"}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`py-4 text-xl font-semibold rounded-xl transition-all duration-200 ${
                btn === "="
                  ? "bg-green-500 hover:bg-green-600 text-white col-span-1"
                  : btn === "C"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
