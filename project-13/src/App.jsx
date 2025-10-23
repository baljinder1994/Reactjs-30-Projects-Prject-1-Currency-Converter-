import React, { useState } from "react";

export default function App() {
  const [number, setNumber] = useState(generateNumber());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function generateNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const handleGuess = () => {
    const userGuess = Number(guess);
    if (!userGuess || userGuess < 1 || userGuess > 100) {
      setMessage("⚠️ Enter a number between 1 and 100");
      return;
    }

    setAttempts(attempts + 1);

    if (userGuess === number) {
      setMessage(`🎉 Correct! The number was ${number}`);
      setGameOver(true);
    } else if (userGuess < number) {
      setMessage("📉 Too low! Try again.");
    } else {
      setMessage("📈 Too high! Try again.");
    }
    setGuess("");
  };

  const resetGame = () => {
    setNumber(generateNumber());
    setGuess("");
    setMessage("");
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-96 text-center transition-all">
        <h1 className="text-3xl font-bold mb-4 text-indigo-400">
          🎮 Number Guessing Game
        </h1>
        <p className="text-gray-300 mb-6">
          Guess a number between <span className="text-yellow-400">1–100</span>
        </p>

        {!gameOver ? (
          <>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg text-gray-900 outline-none text-center text-lg font-semibold"
              placeholder="Enter your guess..."
            />
            <button
              onClick={handleGuess}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-lg font-semibold transition-all"
            >
              Submit Guess
            </button>
          </>
        ) : (
          <button
            onClick={resetGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-lg font-semibold mt-4 transition-all"
          >
            🔄 Play Again
          </button>
        )}

        {message && (
          <p className="mt-4 text-xl font-medium animate-pulse">{message}</p>
        )}

        <p className="mt-3 text-gray-400 text-sm">
          Attempts: <span className="font-semibold text-white">{attempts}</span>
        </p>
      </div>
    </div>
  );
}
