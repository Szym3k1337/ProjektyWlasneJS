/* --- ZMIENNE --- */
let moves = 0;
let shift = 1;
let gameActive = false;
let winner = null;

const xScoreLabel = document.getElementById("xScore");
const oScoreLabel = document.getElementById("oScore");
const titleShift = document.getElementById("title-shift");
const shiftLabel = document.getElementById("shift");
const squares = document.querySelectorAll(".game-square");
const btnGame = document.getElementById("startGame");
let selectGamemode = document.getElementById("select-gamemode");
let gamemode = selectGamemode.value;
let botActive = false;
let  bot = {
    level:0,
    name:`ticTacToe bot`,

}

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

squares.forEach(square => {
    square.addEventListener("click", handleSquareClick);
});
selectGamemode.addEventListener("change", checkGamemode);

btnGame.addEventListener("click", newGame);
btnGame.addEventListener("click", function() {
    console.log("Wybrany tryb to: " + gamemode);
});

/* --- FUNKCJE --- */
function getActualBoard() {
    return Array.from(squares).map(square => square.textContent);
}
function checkGamemode() {
    gamemode = selectGamemode.value;
    if (gamemode !== "Gracz") {
        botActive = true;
    } else {
        botActive = false;
        bot.level = 0;
    }
    if (botActive) {
        if (gamemode === "Łatwy") {
            bot.level = 1;
        }
        else if (gamemode === "Średni") {
            bot.level = 2;
        }
        else if (gamemode === "Trudny") {
            bot.level = 3;
        }
        else if (gamemode === "Niepokonany") {
            bot.level = 4;
        }
        console.log(bot.level)
        console.log(gamemode)
    }
}
function checkShift() {
    if (!gameActive) return;
    if (botActive) {
        shiftLabel.textContent = (shift === 1) ? "Gracz X" : "Bot myśli...";
    }
    else {
        if (shift === 1) {
            shiftLabel.textContent = "Gracz X";
        } else {
            shiftLabel.textContent = "Gracz O";
        }
    }
}

function handleSquareClick(event) {
    let clickedSquare = event.target;

    if (!gameActive || clickedSquare.textContent !== "" || (botActive && shift === 2)) return;

    clickedSquare.textContent = (gamemode === "Gracz" && shift === 2) ? "o" : "x";
    moves++;

    let gameResult = checkWin(getActualBoard());

    if (gameResult) {
        processWin(gameResult);
        return;
    }
    if (moves === 9) {
        gameActive = false;
        informAboutWinner("remis");
        return;
    }


    if (gamemode === "Gracz") {
        shift = (shift === 1) ? 2 : 1;
        checkShift();
    } else {

        shift = 2;
        checkShift();

        let botLevel = bot.level;
        setTimeout(() => {
            if (botLevel === 1) easyBotMove();
            else if (botLevel === 2) mediumBotMove();
            else if (botLevel === 3) hardBotMove();
        }, 500);
    }
}
function processWin(winnerSymbol) {
    gameActive = false;
    if (winnerSymbol === "X") {
        xScoreLabel.textContent = parseInt(xScoreLabel.textContent) + 1;
    } else if (winnerSymbol === "O") {
        oScoreLabel.textContent = parseInt(oScoreLabel.textContent) + 1;
    }
    informAboutWinner(winnerSymbol);
}

function checkWin(board) {
    for (let combo of winningCombos) {
        let [a, b, c] = combo;

        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            return board[a].toUpperCase();
        }
    }
    return null;
}

function informAboutWinner(result) {
    if (result === "remis") {

        titleShift.textContent = "Koniec gry:";
        shiftLabel.textContent = "Mamy remis!";
    } else {
        titleShift.textContent = "Zwycięzca:";
        shiftLabel.textContent = "Gracz " + result;
    }
    btnGame.style.opacity = "1";

}

function newGame() {
    checkGamemode();
    gameActive = true;
    moves = 0;
    winner = null;
    titleShift.textContent = "Tura:";
    btnGame.style.opacity = "0";

    squares.forEach(square => {
        square.textContent = "";
    });

    shift = random(1, 3);

    checkShift();

    if (shift === 2 && botActive) {
        titleShift.textContent = "Bot myśli...";
        setTimeout(() => {
            if (bot.level === 1) easyBotMove();
            else if (bot.level === 2) mediumBotMove();
            else if (bot.level === 3) hardBotMove();
        }, 500);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function easyBotMove() {
    let emptySquares = [];

    squares.forEach((square, index) => {
        if (square.textContent === "") {
            emptySquares.push(index);
        }
    });

    if (emptySquares.length > 0) {

        let randomIndex = random(0, emptySquares.length);
        let chosenSquareIndex = emptySquares[randomIndex];

        squares[chosenSquareIndex].textContent = "o";

        moves++;
        let botResult = checkWin(getActualBoard());
        if (botResult) {
            processWin(botResult);
        } else if (moves === 9) {
            gameActive = false;
            informAboutWinner("remis");
        } else {
            shift = 1;
            checkShift();
        }
        if (gameActive) {
            shift = 1;
            checkShift();
        }
    }
}

function findBestMove(symbol) {
    let moveFound = null;
    winningCombos.forEach(combo => {
        let a = combo[0];
        let b = combo[1];
        let c = combo[2];

        let valA = squares[a].textContent;
        let valB = squares[b].textContent;
        let valC = squares[c].textContent;

        if (valA !== "" && valA === valB && valC === "" && valA === symbol) {
            moveFound = c;
        }

        else if (valB !== "" && valB === valC && valA === "" && valB === symbol) {
            moveFound = a;
        }

        else if (valA !== "" && valA === valC && valB === "" && valA === symbol) {
            moveFound = b;
        }
    });

    return moveFound;
}
function mediumBotMove() {
    let bestMove = findBestMove("o");
    if (bestMove === null) {
        bestMove = findBestMove("x");
    }
    if (bestMove !== null) {

        squares[bestMove].textContent = "o";
        moves++;
        let botResult = checkWin(getActualBoard());
        if (botResult) {
            processWin(botResult);
        } else if (moves === 9) {
            gameActive = false;
            informAboutWinner("remis");
        } else {
            shift = 1;
            checkShift();
        }
        if (gameActive) {
            shift = 1;
            checkShift();
        }
    } else {

        easyBotMove();
    }
}
function simulateVirtualGame(boardState, startingPlayer) {
    let virtualBoard = [...boardState];
    let virtualShift = (startingPlayer === "Bot") ? 2 : 1;

    while (virtualBoard.includes("")) {
        let freeIndexes = [];
        virtualBoard.forEach((val, index) => {
            if (val === "") freeIndexes.push(index);
        });

        let randomIndexInFree = random(0, freeIndexes.length);
        let boardIndex = freeIndexes[randomIndexInFree];

        virtualBoard[boardIndex] = (virtualShift === 2) ? "o" : "x";

        let result = checkWin(virtualBoard);
        if (result) return result;

        virtualShift = (virtualShift === 1) ? 2 : 1;
    }
    return "remis";
}
function hardBotMove() {
    let board = getActualBoard();
    let emptyIndices = [];

    board.forEach((val, idx) => {
        if (val === "") emptyIndices.push(idx);
    });

    let bestMove = -1;
    let highestScore = -Infinity;

    emptyIndices.forEach(moveIndex => {
        let score = 0;
        let simulations = 100000;

        for (let i = 0; i < simulations; i++) {

            let result = simulateFromChoice(board, moveIndex);

            if (result === "O") score += 1;
            else if (result === "remis") score += 0.5;
            else if (result === "X") score -= 1;
        }

        if (score > highestScore) {
            highestScore = score;
            bestMove = moveIndex;
        }
    });

    if (bestMove !== -1) {
        makeBotMove(bestMove);
    }
}
function simulateFromChoice(currentBoard, firstmove) {
    let vBoard = [...currentBoard];
    vBoard[firstmove] = "o";
    return simulateVirtualGame(vBoard, "Gracz");
}
function makeBotMove(index) {
    squares[index].textContent = "o";
    moves++;

    let botResult = checkWin(getActualBoard());
    if (botResult) {
        processWin(botResult);
    } else if (moves === 9) {
        gameActive = false;
        informAboutWinner("remis");
    } else {
        shift = 1;
        checkShift();
    }
}

