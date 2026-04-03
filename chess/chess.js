let board;
let game = new Chess();

let playerScore = 0;
let aiScore = 0;
let drawScore = 0;

window.onload = function () {

    let moveSound = document.getElementById("moveSound");

    let difficulty = localStorage.getItem("chessDifficulty") || "easy";

    document.getElementById("difficultyLabel").innerText =
        "Difficulty: " + difficulty.toUpperCase();

    function updateScore() {
        document.getElementById("scoreboard").innerText =
            `You: ${playerScore} | AI: ${aiScore} | Draws: ${drawScore}`;
    }

    function onDragStart(source, piece) {
        if (game.game_over()) return false;
        if (piece.search(/^b/) !== -1) return false;
    }

    function onDrop(source, target) {
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        moveSound.play();

        setTimeout(makeAIMove, 300);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    function makeAIMove() {
        let moves = game.moves();
        if (moves.length === 0) return;

        let move;

        if (difficulty === "easy") {
            move = moves[Math.floor(Math.random() * moves.length)];
        } else if (difficulty === "medium") {
            move = moves[Math.floor(Math.random() * (moves.length / 2))];
        } else {
            move = moves[moves.length - 1];
        }

        game.move(move);
        board.position(game.fen());

        checkGameEnd();
    }

    function checkGameEnd() {
        if (game.in_checkmate()) {
            aiScore++;
            alert("AI Wins!");
        } else if (game.in_draw()) {
            drawScore++;
            alert("Draw!");
        }
        updateScore();
    }

    window.restartGame = function () {
        game.reset();
        board.start();
    };

    window.goBack = function () {
        window.location.href = "../index.html";
    };

    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    });

    updateScore();
};