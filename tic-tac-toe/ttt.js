let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

let humanScore = 0;
let aiScore = 0;
let drawScore = 0;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const scores = { X: -1, O: 1, draw: 0 };

window.onload = function () {

    const boardDiv = document.getElementById("board");
    const clickSound = document.getElementById("clickSound");
    const winSound = document.getElementById("winSound");

    let difficulty = localStorage.getItem("tttDifficulty") || "easy";

    document.getElementById("difficultyLabel").innerText =
        "Difficulty: " + difficulty.toUpperCase();

    function updateScoreboard() {
        document.getElementById("scoreboard").innerText =
            `You (X): ${humanScore} | AI (O): ${aiScore} | Draws: ${drawScore}`;
    }

    function renderBoard() {
        boardDiv.innerHTML = "";

        board.forEach((cell, i) => {
            const div = document.createElement("div");
            div.classList.add("cell");
            div.innerText = cell;
            div.addEventListener("click", () => makeMove(i));
            boardDiv.appendChild(div);
        });
    }

    function makeMove(i) {
        if (board[i] !== "" || gameOver) return;

        clickSound.play();

        board[i] = human;
        renderBoard();

        if (checkWinner()) return;

        bestMove();
        renderBoard();
        checkWinner();
    }

    function bestMove() {
        let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

        if (difficulty === "easy") {
            let move = empty[Math.floor(Math.random() * empty.length)];
            board[move] = ai;
            return;
        }

        if (difficulty === "medium" && Math.random() < 0.5) {
            let move = empty[Math.floor(Math.random() * empty.length)];
            board[move] = ai;
            return;
        }

        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = ai;
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        board[move] = ai;
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWinnerSimple();
        if (result !== null) return scores[result];

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner() {
        let result = checkWinnerSimple();

        if (result !== null) {
            gameOver = true;

            winSound.play();

            if (result === "X") humanScore++;
            else if (result === "O") aiScore++;
            else drawScore++;

            updateScoreboard();

            setTimeout(() => {
                alert(result === "draw" ? "Draw!" : result + " Wins!");
            }, 100);

            return true;
        }
        return false;
    }

    function checkWinnerSimple() {
        for (let pattern of winPatterns) {
            let [a,b,c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes("")) return "draw";
        return null;
    }

    window.restartGame = function () {
        board = ["", "", "", "", "", "", "", "", ""];
        gameOver = false;
        renderBoard();
    };

    window.goBack = function () {
        window.location.href = "../index.html";
    };

    renderBoard();
    updateScoreboard();
};