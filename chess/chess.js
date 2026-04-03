let board;
let game = new Chess();

// 🚫 Prevent dragging black pieces
function onDragStart(source, piece) {
    if (piece.search(/^b/) !== -1) return false;
}

// 🎯 Player move
function onDrop(source, target) {

    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    setTimeout(makeAIMove, 300);
}

// 🔄 Sync board
function onSnapEnd() {
    board.position(game.fen());
}

// 🤖 AI move
function makeAIMove() {

    let moves = game.moves();

    if (moves.length === 0) {
        alert("Game Over");
        return;
    }

    let move = moves[Math.floor(Math.random() * moves.length)];

    game.move(move);
    board.position(game.fen());
}

// 🔁 Restart
function restartGame() {
    game.reset();
    board.start();
}

// 🚀 Init
board = Chessboard('board', {
    draggable: true,
    position: 'start',

    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',

    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});