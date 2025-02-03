import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("Make your guess!");

  // Predefined set of colors
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
    "#000080",
    "#808000",
  ];

  // Initialize the game
  const initGame = () => {
    // Select a random target color
    const randomTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomTargetColor);

    // Shuffle colors and pick 6 for the options
    const shuffledColors = colors.sort(() => Math.random() - 0.5).slice(0, 6);

    // Ensure the target color is among the options
    if (!shuffledColors.includes(randomTargetColor)) {
      const randomIndex = Math.floor(Math.random() * 6);
      shuffledColors[randomIndex] = randomTargetColor;
    }

    setColorOptions(shuffledColors);
    setGameStatus("Make your guess!");
  };

  // Check if the guessed color is correct
  const checkGuess = (guess) => {
    if (guess === targetColor) {
      setGameStatus("Correct!");
      setScore((prevScore) => prevScore + 1);
    } else {
      setGameStatus("Wrong! Try again.");
    }
  };

  // Reset the game
  const resetGame = () => {
    setScore(0);
    initGame();
  };

  // Initialize the game on component mount
  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="container">
      <h1>Color Game</h1>
      <div
        className="color-box"
        style={{ backgroundColor: targetColor }}
        data-testid="colorBox"
      ></div>
      <p data-testid="gameInstructions">Guess the correct color!</p>
      <div className="color-options">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            style={{ backgroundColor: color }}
            onClick={() => checkGuess(color)}
            data-testid="colorOption"
          ></button>
        ))}
      </div>
      <p data-testid="gameStatus">{gameStatus}</p>
      <p>
        Score: <span data-testid="score">{score}</span>
      </p>
      <button onClick={resetGame} data-testid="newGameButton">
        New Game
      </button>
    </div>
  );
}

export default App;
