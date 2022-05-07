export const checkWin = (a, b, c) => {
  // all / \
  if (a.x == a.y && b.x === b.y && c.x === c.y) {
    return true;
  }
  // all |
  if (a.x === b.x && a.x === c.x && a.y !== b.y && a.y !== c.y) {
    return true;
  }
  // all ---
  if (a.y === b.y && a.y === c.y && a.x !== b.x && a.x !== c.x) {
    return true;
  }
  return false;
};

export const generateThirdDot = (a, b, grid) => {
  // all |
  if (a.x === b.x && a.y !== b.y) {
    const calculatedDot = grid.find(
      (sq) => sq.x === a.x && sq.y === 3 - (a.y + b.y)
    );
    let isEmpty = true;
    if (calculatedDot.value === 0 || calculatedDot.value === 1) {
      isEmpty = false;
    }
    if (isEmpty) {
      return { x: a.x, y: 3 - (a.y + b.y) };
    }
    return false;
  }

  // all ---
  if (a.y === b.y && a.x !== b.x) {
    const calculatedDot = grid.find(
      (sq) => sq.x === 3 - (a.x + b.x) && sq.y === a.y
    );
    let isEmpty = true;
    if (calculatedDot.value === 0 || calculatedDot.value === 1) {
      isEmpty = false;
    }
    if (isEmpty) {
      return { x: 3 - (a.x + b.x), y: a.y };
    }
    return false;
  }

  // all / \
  const isDiagonal = (a, b) => {
    if (a.x === a.y && b.x === b.y) {
      return true;
    }
    if (a.x === 2 && a.y === 0 && b.x === 0 && b.y === 2) {
      return true;
    }
    if (a.x === 0 && a.y === 2 && b.x === 2 && b.y === 0) {
      return true;
    }
    if (a.x === 0 && a.y === 2 && b.x === b.y) {
      return true;
    }
    if (a.x === a.y && b.x === 0 && b.y === 2) {
      return true;
    }
    if (a.x === 2 && a.y === 0 && b.x === b.y) {
      return true;
    }
    if (a.x === a.y && b.x === 2 && b.y === 0) {
      return true;
    }
    return false;
  };

  if (isDiagonal(a, b)) {
    const calculatedDot = grid.find(
      (sq) => sq.x === 3 - (a.x + b.x) && sq.y === 3 - (a.y + b.y)
    );
    let isEmpty = true;
    if (calculatedDot.value === 0 || calculatedDot.value === 1) {
      isEmpty = false;
    }
    if (isEmpty) {
      return { x: 3 - (a.x + b.x), y: 3 - (a.y + b.y) };
    }
    return false;
  }
};

export const initGrid = (lim_x, lim_y) => {
  const grid = [];
  for (let i = 0; i < lim_y; i++) {
    for (let j = 0; j < lim_x; j++) {
      grid.push({ x: j, y: i, value: null });
    }
  }
  return grid;
};

export const getWinningCombinations = (grid, dots) => {
  let winningCombinations = [];
  for (let i in dots) {
    for (let j in dots) {
      if (i !== j) {
        let calculatedDot = generateThirdDot(dots[i], dots[j], grid);
        if (calculatedDot) {
          winningCombinations.push(calculatedDot);
        }
      }
    }
  }
  return winningCombinations;
};

export const updateGrid = (grid, newDot, value) => {
  return grid.map((dot) => {
    if (dot.x === newDot.x && dot.y === newDot.y) {
      dot.value = value;
    }
    return dot;
  });
};

export const generateMove = (grid) => {
  const pcDots = grid.filter((dot) => dot.value === 1);
  const playerDots = grid.filter((dot) => dot.value === 0);
  const emptyDots = grid.filter((dot) => dot.value == null);

  const generateRandomDot = (emptyDots) => {
    // random
    const getRandomIntInclusive = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    };

    const randomIndex = getRandomIntInclusive(0, emptyDots.length - 1);

    return emptyDots[randomIndex];
  };

  if (emptyDots.length === 0) {
    return { winner: "", updatedGrid: grid };
  }
  if (emptyDots.length === 1) {
    const generatedDot = generateRandomDot(emptyDots);
    return { winner: "", updatedGrid: updateGrid(grid, generatedDot, 1) };
  }
  if (playerDots.length === 1) {
    const isCenterEmpty = grid.some(
      (dot) => dot.x === 1 && dot.y === 1 && dot.value === null
    );
    const generatedDot = isCenterEmpty
      ? { x: 1, y: 1 }
      : generateRandomDot(emptyDots);
    return { winner: "", updatedGrid: updateGrid(grid, generatedDot, 1) };
  }
  if (playerDots.length === 2) {
    const generatedDot = generateThirdDot(playerDots[0], playerDots[1], grid);
    if (generatedDot) {
      return { winner: "", updatedGrid: updateGrid(grid, generatedDot, 1) };
    } else {
      const randomDot = generateRandomDot(emptyDots);
      return { winner: "", updatedGrid: updateGrid(grid, randomDot, 1) };
    }
  }
  if (playerDots.length > 2) {
    // check win
    let winningCombinations = [];
    winningCombinations = getWinningCombinations(grid, pcDots);

    if (winningCombinations.length) {
      const generatedDot = winningCombinations[0];
      return { winner: "pc", updatedGrid: updateGrid(grid, generatedDot, 1) };
    }
    let generatedDots = [];
    generatedDots = getWinningCombinations(grid, playerDots);

    if (generatedDots.length) {
      const block = generatedDots[0];
      return { winner: "", updatedGrid: updateGrid(grid, block, 1) };
    } else {
      const randomDot = generateRandomDot(emptyDots);
      return { winner: "", updatedGrid: updateGrid(grid, randomDot, 1) };
    }
  }
};
