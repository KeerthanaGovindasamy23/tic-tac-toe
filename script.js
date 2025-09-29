/** @format */

// --- Game State Variables ---
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let playerXScore = 0;
let playerOScore = 0;
let gamesPlayed = 0;
const MAX_GAMES = 5;
// Removed WINNING_SCORE constant to prevent early exit based on score.
// The winner is now determined strictly after 5 games.

// --- DOM Elements (No changes) ---
const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const boardElement = document.getElementById("board");
const statusMessage = document.getElementById("status-message");
const playerXScoreElement = document.getElementById("player-x-score");
const playerOScoreElement = document.getElementById("player-o-score");
const gameCountElement = document.getElementById("game-count");
const startButton = document.getElementById("start-game-button");
const resetButton = document.getElementById("reset-button");
const quitButton = document.getElementById("quit-button");

const roundModal = document.getElementById("round-modal");
const roundResultText = document.getElementById("round-result-text");
const modalNextRoundButton = document.getElementById("modal-next-round");

const quitModal = document.getElementById("quit-modal");
const confirmQuitYes = document.getElementById("confirm-quit-yes");
const confirmQuitNo = document.getElementById("confirm-quit-no");

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// --- Core Game Functions ---

// Initialize board and hide pop-up
const initializeBoard = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusMessage.textContent = "Player X's Turn";
  boardElement.innerHTML = "";
  roundModal.classList.remove("active");

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.textContent = "";
    cell.classList.remove("X", "O");
    cell.addEventListener("click", () => handleCellClick(cell, i));
    boardElement.appendChild(cell);
  }
};

// Update the scorecard
const updateScorecard = () => {
  playerXScoreElement.textContent = `Player X: ${playerXScore}`;
  playerOScoreElement.textContent = `Player O: ${playerOScore}`;

  // Series is only over when 5 games have been played
  const seriesOver = gamesPlayed === MAX_GAMES;

  if (seriesOver) {
    gameCountElement.textContent = `Series Finished!`;
  } else {
    gameCountElement.textContent = `Game ${gamesPlayed + 1} of ${MAX_GAMES}`;
  }
};

// Check for a win or tie after a move and update scores
const checkGameStatus = () => {
  let roundWon = false;
  for (const [a, b, c] of winningConditions) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    if (currentPlayer === "X") {
      playerXScore++;
    } else {
      playerOScore++;
    }
    endRound(`Winner: ${currentPlayer} 🏆`);
    return;
  }

  if (!board.includes("")) {
    // Tie condition
    gameActive = false;
    playerXScore++; // Award point for tie
    playerOScore++; // Award point for tie
    endRound(`It's a Tie! 🤝`);
    return;
  }

  // Only switch player if the game has not ended (win/tie)
  switchPlayer();
};

// Handle end of a single round (win or tie)
const endRound = (message) => {
  gamesPlayed++;
  updateScorecard();

  roundResultText.textContent = message;
  roundModal.classList.add("active");

  // **FIXED LOGIC**: Check for series end based only on MAX_GAMES
  const seriesOver = gamesPlayed === MAX_GAMES;

  if (seriesOver) {
    modalNextRoundButton.textContent = "See Final Results";
  } else {
    modalNextRoundButton.textContent = "Continue";
    statusMessage.textContent = message;
  }
};

// Display the overall series winner (Only called after Game 5)
const displaySeriesResult = () => {
  let resultMessage;
  if (playerXScore > playerOScore) {
    resultMessage = `PLAYER X WINS SERIES! (${playerXScore}-${playerOScore})`;
  } else if (playerOScore > playerXScore) {
    resultMessage = `PLAYER O WINS SERIES! (${playerXScore}-${playerOScore})`;
  } else {
    resultMessage = `SERIES ENDS IN A TIE! (${playerXScore}-${playerOScore})`;
  }

  statusMessage.textContent = resultMessage;

  roundResultText.textContent = resultMessage;
  roundModal.classList.add("active");
  modalNextRoundButton.style.display = "none"; // Series is over
};

// Logic when the "Continue" or "See Final Results" button is clicked
const nextRound = () => {
  roundModal.classList.remove("active");

  // **FIXED LOGIC**: Check for series end based only on MAX_GAMES
  const seriesOver = gamesPlayed === MAX_GAMES;

  if (seriesOver) {
    displaySeriesResult();
  } else {
    initializeBoard();
  }
};

// 6. Switch the current player
const switchPlayer = () => {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
};

// 7. Handle a player's click on a cell
const handleCellClick = (clickedCell, clickedCellIndex) => {
  if (board[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  board[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer);
  checkGameStatus();
};

// --- Game Flow & Event Listeners (No changes) ---

const startGameSeries = () => {
  welcomeScreen.classList.remove("active");
  gameScreen.classList.add("active");
  resetGameSeries();
};

const resetGameSeries = () => {
  playerXScore = 0;
  playerOScore = 0;
  gamesPlayed = 0;
  updateScorecard();
  initializeBoard();
  modalNextRoundButton.style.display = "block";
};

const showQuitModal = () => {
  quitModal.classList.add("active");
};

const hideQuitModal = () => {
  quitModal.classList.remove("active");
};

const confirmQuit = (quitConfirmed) => {
  hideQuitModal();
  if (quitConfirmed) {
    roundModal.classList.remove("active");
    gameScreen.classList.remove("active");
    welcomeScreen.classList.add("active");
    resetGameSeries();
  }
};

startButton.addEventListener("click", startGameSeries);
resetButton.addEventListener("click", resetGameSeries);
quitButton.addEventListener("click", showQuitModal);

modalNextRoundButton.addEventListener("click", nextRound);
confirmQuitYes.addEventListener("click", () => confirmQuit(true));
confirmQuitNo.addEventListener("click", () => confirmQuit(false));
