import { useState } from "react";
import "./App.css";
import {
  initGrid,
  getWinningCombinations,
  generateMove,
  updateGrid,
} from "./gameLogic";
import { useEffect } from "react";
function App() {
  const [grid, setGrid] = useState([]);
  const [win, setWin] = useState(null);

  useEffect(() => {
    const grid = initGrid(3, 3);
    setGrid(grid);
  }, []);

  const handleRestart = () => {
    const grid = initGrid(3, 3);
    setGrid(grid);
    setWin(null);
  };

  const handleClick = (sq) => {
    const { x, y } = sq;
    let isWin = false;

    let winningCombinations = [];
    const playerDots = grid.filter((dot) => dot.value === 0);

    winningCombinations = getWinningCombinations(grid, playerDots);

    if (
      winningCombinations.length &&
      winningCombinations.some((dot) => dot.x === x && dot.y === y)
    ) {
      setWin("player");
      isWin = true;
    }

    const gridAfterPlayersMove = updateGrid(grid, sq, 0);

    if (sq.value != null && !isWin) {
      const { winner, updatedGrid } = generateMove(gridAfterPlayersMove);

      if (winner === "pc") {
        setGrid(updatedGrid);
        setWin("pc");
      }

      if (winner !== "pc" && winner !== "player") {
        setGrid(updatedGrid);
      }
    }
  };

  return (
    <div className="App">
      <div className="game">
        <div className="grid">
          {grid.map((sq, i) => (
            <div className="square" key={i} onClick={() => handleClick(sq)}>
              <div className={`${sq.value === 1 ? "sqO" : "sqX"}`}>
                {(sq.value === 0 && "+") || (sq.value === 1 && "O")}
              </div>
            </div>
          ))}
        </div>
        <div className="footer">
          <h5 className="restart" onClick={handleRestart}>
            Restart
          </h5>
          {win === "pc" && <h3>You lose</h3>}
          {win === "player" && <h3>You win</h3>}
        </div>
      </div>
    </div>
  );
}

export default App;
