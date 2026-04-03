let board;
let game = new Chess();

// 🚫 Prevent moving black pieces
function onDragStart(source, piece) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;
}

// 🎯 Player move
function onDrop(source, target) {

    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // ❌ illegal move
    if (move === null) return 'snapback';

    // ✅ check game end after player move
    if (game.game_over()) {
        showResult();
        return;
    }

    // 🤖 AI move
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
        showResult();
        return;
    }

    let move = moves[Math.floor(Math.random() * moves.length)];

    game.move(move);
    board.position(game.fen());

    if (game.game_over()) {
        showResult();
    }
}

// 🏆 Show result
function showResult() {

    if (game.in_checkmate()) {
        alert("Checkmate!");
    } 
    else if (game.in_stalemate()) {
        alert("Stalemate!");
    } 
    else if (game.in_draw()) {
        alert("Draw!");
    }
}

// 🔁 Restart
function restartGame() {
    game.reset();
    board.start();
}

// 🚀 Initialize board
board = Chessboard('board', {
    draggable: true,
    position: 'start',

    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',

    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});