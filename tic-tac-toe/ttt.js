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

    loadScores();
    updateLeaderboard();

    function updateScoreboard() {
        document.getElementById("scoreboard").innerText =
            `You (X): ${humanScore} | AI (O): ${aiScore} | Draws: ${drawScore}`;
    }

    function saveScores() {
        localStorage.setItem("tttScores", JSON.stringify({
            humanScore, aiScore, drawScore
        }));
    }

    function loadScores() {
        let saved = JSON.parse(localStorage.getItem("tttScores"));
        if (saved) {
            humanScore = saved.humanScore;
            aiScore = saved.aiScore;
            drawScore = saved.drawScore;
        }
    }

    function updateLeaderboard() {
        let list = document.getElementById("leaderboard");
        list.innerHTML = `
            <li>You: ${humanScore}</li>
            <li>AI: ${aiScore}</li>
            <li>Draws: ${drawScore}</li>
        `;
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
        let empty = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);

        if (difficulty === "easy") {
            board[empty[Math.floor(Math.random()*empty.length)]] = ai;
            return;
        }

        if (difficulty === "medium" && Math.random() < 0.5) {
            board[empty[Math.floor(Math.random()*empty.length)]] = ai;
            return;
        }

        let bestScore = -Infinity;
        let move;

        for (let i=0;i<9;i++){
            if(board[i]===""){
                board[i]=ai;
                let score=minimax(board,0,false);
                board[i]="";
                if(score>bestScore){
                    bestScore=score;
                    move=i;
                }
            }
        }

        board[move]=ai;
    }

    function minimax(board,depth,isMax){
        let result=checkWinnerSimple();
        if(result!==null) return scores[result];

        if(isMax){
            let best=-Infinity;
            for(let i=0;i<9;i++){
                if(board[i]===""){
                    board[i]=ai;
                    best=Math.max(best,minimax(board,depth+1,false));
                    board[i]="";
                }
            }
            return best;
        } else {
            let best=Infinity;
            for(let i=0;i<9;i++){
                if(board[i]===""){
                    board[i]=human;
                    best=Math.min(best,minimax(board,depth+1,true));
                    board[i]="";
                }
            }
            return best;
        }
    }

    function checkWinner(){
        let result=checkWinnerSimple();
        if(result!==null){
            gameOver=true;

            winSound.play();

            if(result==="X") humanScore++;
            else if(result==="O") aiScore++;
            else drawScore++;

            saveScores();
            updateLeaderboard();
            updateScoreboard();

            setTimeout(()=>alert(result==="draw"?"Draw!":result+" Wins!"),100);
            return true;
        }
        return false;
    }

    function checkWinnerSimple(){
        for(let p of winPatterns){
            let[a,b,c]=p;
            if(board[a]&&board[a]===board[b]&&board[a]===board[c]) return board[a];
        }
        if(!board.includes("")) return "draw";
        return null;
    }

    window.restartGame=function(){
        board=["","","","","","","","",""];
        gameOver=false;
        renderBoard();
    }

    window.goBack=function(){
        window.location.href="../index.html";
    }

    renderBoard();
    updateScoreboard();
};