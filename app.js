const firstDomBar = document.querySelector(".first-bar");
const secondDomBar = document.querySelector(".second-bar");

// Gameboard module for managing the game board state

const Gameboard = (function () {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let winner = "";

  // Function to make a move on the board
  function makeMove(x, y, mark) {
    console.clear();
    if (!board[x][y]) {
      board[x][y] = mark;
      console.table(board);
      document.getElementById(`${x}-${y}`).innerHTML = mark;
      winnerCheck();
      gameController.gameFlow.push(mark);
    } else {
      alert("This cell is already occupied.");
    }
  }

  // Function to check for a winner or draw
  function winnerCheck() {
    for (let i = 0; i < 3; i++) {
      // Check columns
      const a = board[0][i];
      const b = board[1][i];
      const c = board[2][i];
      if (a != "" && a === b && b === c) {
        return displayWinner(a);
      }
      // Check rows
      const d = board[i][0];
      const e = board[i][1];
      const f = board[i][2];
      if (d != "" && d === e && e === f) {
        return displayWinner(d);
      }
    }

    // Check diagonals
    // Top left to right bottom
    const a = board[0][0];
    const b = board[1][1];
    const c = board[2][2];
    if (a != "" && a === b && b === c) {
      return displayWinner(a);
    }
    // Top right to left bottom
    const d = board[0][2];
    const e = board[1][1];
    const f = board[2][0];
    if (d != "" && d === e && e === f) {
      return displayWinner(d);
    }

    // Check for a draw
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const square = board[i][j];
        if (square === "") return undefined;
      }
    }
    return (winner = "Draw");
  }

  // Function to display the winner in the DOM
  function displayWinner(winner) {
    if (winner) {
      firstDomBar.innerHTML = `<h1>${winner} is a winner!</h1>`;
      secondDomBar.innerHTML = "";
    }
  }

  return { makeMove, board };
})();

// Player module for creating and managing players

const Player = (function () {
  // HTML form template for player input
  const inputHTML = `
    <form id="player">
      <input id="nickname" type="text" name="nickname" size="30" placeholder="Your nickname" required>
      <select id="symbol" name="symbol" required>
        <option value="X">X</option>
        <option value="O">O</option>
      </select>
      <button type="submit">OK</button>
    `;

  secondDomBar.innerHTML = inputHTML;

  let players = [];

  const form = document.getElementById("player");
  const symbolSelect = document.getElementById("symbol");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get the player's name and selected symbol (X or O)
    const name = document.getElementById("nickname").value;
    const mark = symbolSelect.value;

    // Create a player object and push it to the 'players' array
    const player = createPlayer(name, mark);
    players.push(player);

    // Update the symbol selection menu based on the last player's choice
    if (player.symbol === "X") {
      symbolSelect.innerHTML = `<option value="O">O</option>`;
    } else if (player.symbol === "O") {
      symbolSelect.innerHTML = `<option value="X">X</option>`;
    }

    // Clear the input field for the next player
    document.getElementById("nickname").value = "";

    // Remove form if two players are created
    if (players.length > 1) {
      secondDomBar.innerHTML = `Players ${players[0].nick} (${players[0].symbol}) and ${players[1].nick} (${players[1].symbol}) created.`;
    }

    //Firstly created player starts the game, add first player symbol to the gameflow
    gameController.gameFlow.push(player.symbol);
    firstDomBar.innerHTML = `${players[0].nick} (${players[0].symbol}) starts first.`;
  });

  function createPlayer(nick, symbol) {
    return { nick, symbol };
  }

  return {
    players,
    createPlayer,
  };
})();

// Game controller module for managing player moves

const gameController = (function () {
  const gameFlow = [];
  //add first
  const buttons = document.querySelectorAll(".square");

  buttons.forEach((element) => {
    element.addEventListener("click", (event) => {
      const gameFlowLast = gameFlow[gameFlow.length - 1]; //the last gameFlow element
      // Check cell id
      const x = event.target.id.split("-")[0];
      const y = event.target.id.split("-")[1];
      // Determine whose turn it is (X/O)
      let mark = gameFlow[0];
      if (gameFlowLast === "X") {
        mark = "O";
        firstDomBar.innerHTML = "X's turn.";
      } else if (gameFlowLast === "O") {
        mark = "X";
        firstDomBar.innerHTML = "O's turn.";
      }
      // Update the board array and display X/O in the cell
      Gameboard.makeMove(x, y, mark);
    });
  });
  //
  const restartButton = document.getElementById("RestartButton");
  restartButton.addEventListener("click", () => {
    // Reset the Gameboard board array
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        Gameboard.board[i][j] = "";
      }
    }

    // Clear the cell contents
    buttons.forEach((element) => {
      element.innerHTML = "";
    });
  });
  return { gameFlow };
})();
