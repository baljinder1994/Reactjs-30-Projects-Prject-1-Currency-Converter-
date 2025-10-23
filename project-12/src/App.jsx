import React, { useState, useEffect } from "react";

const GRID_SIZE = 15;

const App = () => {
  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState([3, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // move snake every 200ms
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  });

  // handle key press
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // move snake logic
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[newSnake.length - 1]];

    if (direction === "UP") head[1] -= 1;
    if (direction === "DOWN") head[1] += 1;
    if (direction === "LEFT") head[0] -= 1;
    if (direction === "RIGHT") head[0] += 1;

    // hit wall or itself
    if (
      head[0] < 0 ||
      head[0] >= GRID_SIZE ||
      head[1] < 0 ||
      head[1] >= GRID_SIZE ||
      snake.some((segment) => segment[0] === head[0] && segment[1] === head[1])
    ) {
      setGameOver(true);
      return;
    }

    newSnake.push(head);

    // eat food
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      generateFood();
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  // random food
  const generateFood = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood([x, y]);
  };

  const restartGame = () => {
    setSnake([[7, 7]]);
    setDirection("RIGHT");
    setFood([3, 5]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4">🐍 Snake Game</h1>
      <p className="mb-3 text-lg">Score: <span className="font-semibold">{score}</span></p>

      <div
        className="grid bg-gray-700 rounded-xl p-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          gap: "2px",
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const isSnake = snake.some((s) => s[0] === x && s[1] === y);
            const isFood = food[0] === x && food[1] === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`w-5 h-5 rounded-sm transition-all duration-150 ${
                  isSnake
                    ? "bg-green-400 shadow-lg shadow-green-500/40"
                    : isFood
                    ? "bg-red-500"
                    : "bg-gray-600"
                }`}
              ></div>
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="mt-6 text-center">
          <p className="text-red-400 text-lg font-semibold mb-3">
            Game Over! Your Score: {score}
          </p>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
