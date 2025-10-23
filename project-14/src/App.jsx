import React, { useState } from "react";

const App = () => {
  const [mood, setMood] = useState("");
  const [result, setResult] = useState({ emoji: "🤔", message: "Type your mood!" });

  const moodEmojis = {
    happy: { emoji: "😄", message: "You’re shining bright today!" },
    sad: { emoji: "😢", message: "It’s okay to feel sad sometimes 💙" },
    angry: { emoji: "😡", message: "Take a deep breath, it’ll be okay 😌" },
    excited: { emoji: "🤩", message: "Woohoo! Keep that energy high!" },
    tired: { emoji: "🥱", message: "You deserve a break 😴" },
    love: { emoji: "😍", message: "Love is in the air 💖" },
    bored: { emoji: "😐", message: "Try something new today!" },
  };

  const handleDetect = () => {
    const key = mood.toLowerCase().trim();
    if (moodEmojis[key]) {
      setResult(moodEmojis[key]);
    } else {
      const emojis = Object.values(moodEmojis);
      const random = emojis[Math.floor(Math.random() * emojis.length)];
      setResult({ emoji: random.emoji, message: "Mood not found, but here’s one!" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🎭 Emoji Mood Detector</h1>

      <input
        type="text"
        placeholder="Type your mood (happy, sad...)"
        className="p-3 rounded-lg w-64 text-black mb-4 outline-none"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />

      <button
        onClick={handleDetect}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold"
      >
        Detect Mood
      </button>

      <div className="mt-8 text-center">
        <div className="text-6xl mb-3">{result.emoji}</div>
        <p className="text-lg">{result.message}</p>
      </div>
    </div>
  );
};

export default App;
