import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

function ColorGame() {
  const [screen, setScreen] = useState("start"); // "start", "game", "gameOver"
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  const correctAudio = useRef(
    new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3")
  );
  const incorrectAudio = useRef(
    new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3")
  );
  const gameOverAudio = useRef(
    new Audio("https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3")
  );

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
  ];

  const startGame = () => {
    setScreen("game");
    setScore(0);
    setTimeLeft(30);
    setIsPaused(false);
    initGame();
  };

  const initGame = () => {
    const randomTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomTargetColor);

    const shuffledColors = [...colors]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    if (!shuffledColors.includes(randomTargetColor)) {
      shuffledColors[Math.floor(Math.random() * 4)] = randomTargetColor;
    }

    setColorOptions(shuffledColors);
  };

  const checkGuess = (guess) => {
    if (guess === targetColor) {
      setScore((prevScore) => {
        const newScore = prevScore + 5;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("highScore", newScore);
        }
        return newScore;
      });
      setTimeLeft((prevTime) => Math.max(prevTime - 2, 5)); // Reduce time, min cap 5s
      correctAudio.current.play();
    } else {
      setScore((prevScore) => Math.max(prevScore - 5, 0)); // No negative score
      incorrectAudio.current.play();
    }
    initGame();
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setScreen("gameOver");
      gameOverAudio.current.play();
      return;
    }

    if (!isPaused && screen === "game") {
      if (timerRef.current) clearInterval(timerRef.current);

      const speed = Math.max(1000 - score * 50, 200);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, speed);

      return () => clearInterval(timerRef.current);
    }
  }, [timeLeft, isPaused, screen, score]);

  return (
    <div className="game-container">
      {screen === "start" && (
        <div className="start-screen">
          <h1>🎨 Color Game 🎮</h1>
          <button onClick={startGame}>Start Game</button>
          <p>High Score: {highScore}</p>
        </div>
      )}

      {screen === "game" && (
        <div className="game-screen">
          <h2>Guess the Color!</h2>
          <div
            className="color-box"
            style={{ backgroundColor: targetColor }}
          ></div>
          <div className="color-options">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                style={{ backgroundColor: color }}
                onClick={() => checkGuess(color)}
              ></button>
            ))}
          </div>
          <p>Time Left: {timeLeft}s</p>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      )}

      {screen === "gameOver" && (
        <div className="game-over-screen">
          <h1>Game Over! 🎭</h1>
          <p>Your Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default ColorGame;
