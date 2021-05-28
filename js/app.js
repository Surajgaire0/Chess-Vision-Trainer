import Knight from './knight.mjs';
import Bishop from './bishop.mjs';
import Rook from './rook.mjs';
import Queen from './queen.mjs';
import Pawn from './pawn.mjs';
import King from './king.mjs';
import { shortestPath } from './shortestpath.mjs';
import { shortestPathForKing } from './shortestpath.mjs';
import { Cell } from './cell.mjs';
import { getRandom } from './utils.mjs';
import { drawPath } from './drawpath.mjs';
import { validMoveFunc } from './validmovefunc.mjs';
import { pawnPositions, kingPositions } from './position.mjs';
import { fenToBoard } from './fentoboard.mjs';

let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');

let sound = 'on';

let checkbox = document.querySelector('#checkbox');
let soundIcon = document.querySelector('.sound-icon');
let startOnly = document.querySelector('.start-only');
let afterstart = document.querySelector('.afterstart');
let startBtn = document.querySelector('#btn-start');
let nextbutton = document.querySelector('.next');
let sol = document.querySelector('.solution');
let menu = document.querySelector('.fa-bars');
let tabs = document.querySelector('.tabs');
let boarddiv = document.querySelector('.board');
let minmoveText = document.querySelector('.minmove');
let minpathText = document.querySelector('.minpath');
let que = document.querySelector('.que');
let resetbutton = document.querySelector('#reset');
let scoreText = document.querySelector('#score');
let message = document.querySelector('.message');
let shortest = document.querySelector('.short');

let boardsprite = new Image();
boardsprite.src = './assets/board-w.png';

let sprite = new Image();
sprite.src = './assets/chess.png';

let arrowsprite = new Image();
arrowsprite.src = './assets/arrow.png';

let correctSound = new Audio('./assets/correct.mp3');
let failedSound = new Audio('./assets/wrong.mp3');
let captureSound = new Audio('./assets/piececapture.wav');
let moveSound = new Audio('./assets/move.wav');

let state = {
    start: 1,
    playing: 2,
    next: 3,
    current: 1
}

let rank, files, pieces;
let boardArr;
let rand1, rand2, rand3, rand4, rand5;
//rand1 for piece to move
//rand2 for initial square
//rand3 for destination square
//rand4 for other pieces
//rand5 for other pieces positions

let minpath;
let mindistance;
let pieceArr;
let squareToReach;
let numberOfPlayerMoves;
let playerFoundShortestMove;
let numberOfCorrectAttempts, numberOfTotalAttempts;
let pieceArrCopy;

let start = () => {
    rank = [8, 7, 6, 5, 4, 3, 2, 1];
    files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    pieces = { 1: 'K', 2: 'P', 3: 'B', 4: 'N', 5: 'Q', 6: 'R' };
    loop();
};

let reset = () => {
    minpath = -1;
    numberOfPlayerMoves = 0;
    playerFoundShortestMove = false;
    while (minpath == -1) {
        //reset board
        boardArr = [];
        for (let i = 0; i < 8; i++) {
            let subarr = [];
            for (let j = 0; j < 8; j++) {
                subarr.push(0);
            }
            boardArr.push(subarr);
        }

        //piece to move
        rand1 = getRandom(1, 6);

        if (rand1 <= 2) {
            let loadedPos;
            if (rand1 == 1) { // King
                loadedPos = kingPositions[getRandom(1, kingPositions.length) - 1];
            }
            else if (rand1 == 2) { //pawn
                loadedPos = pawnPositions[getRandom(1, pawnPositions.length) - 1];
            }
            boardArr = fenToBoard(loadedPos.fen);
            rand3 = loadedPos.start[0] * 8 + loadedPos.start[1];
            rand2 = loadedPos.finish[0] * 8 + loadedPos.finish[1];
        }
        else if (rand1 >= 3) {
            rand3 = getRandom(0, 63); //source
            rand2 = getRandom(0, 63); //destination

            while ((rand3 == rand2) || (rand1 == 3 && (rand2 + rand3) % 2 == 1)) {
                rand2 = getRandom(0, 63);
            }

            //assign to source
            boardArr[Math.floor(rand3 / 8)][rand3 % 8] = rand1;

            //barrier
            let t = getRandom(5, 15);
            for (let i = 0; i < t; i++) {
                //barrier piece
                rand4 = getRandom(3, 6);
                //square for barrier piece
                rand5 = getRandom(0, 63);

                let temp = [-1, 1];
                if (rand5 != rand3 && rand5 != rand2) {
                    boardArr[Math.floor(rand5 / 8)][rand5 % 8] = temp[getRandom(0, 1)] * rand4;
                }
            }

        }

        if (rand1 == 1) {
            minpath = shortestPathForKing(boardArr, [Math.floor(rand3 / 8), rand3 % 8], [Math.floor(rand2 / 8), rand2 % 8]);
        }
        else {
            minpath = shortestPath(boardArr, [Math.floor(rand3 / 8), rand3 % 8], [Math.floor(rand2 / 8), rand2 % 8]);
        }

        if (minpath != -1) {
            mindistance = minpath[minpath.length - 1].dist;
        }
    };

    //make pieceArr
    pieceArr = [];
    pieceArrCopy = [];

    let addPieceToArray = (boardArr, x_pos, y_pos, array) => {
        switch (Math.abs(boardArr[x_pos][y_pos])) {
            case 1:
                array.push(new King(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
            case 2:
                array.push(new Pawn(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
            case 3:
                array.push(new Bishop(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
            case 4:
                array.push(new Knight(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
            case 5:
                array.push(new Queen(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
            case 6:
                array.push(new Rook(sprite, canvas, ctx, tempcolor, [x_pos, y_pos]));
                break;
        }
    };

    //for piece to move
    let t1 = Math.floor(rand3 / 8), t2 = rand3 % 8; let tempcolor;
    tempcolor = 'white';
    addPieceToArray(boardArr, t1, t2, pieceArr);
    addPieceToArray(boardArr, t1, t2, pieceArrCopy);

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            if (boardArr[i][j] != 0 && !(i == t1 && j == t2)) {
                tempcolor = boardArr[i][j] < 0 ? 'black' : 'white';
                addPieceToArray(boardArr, i, j, pieceArr);
                addPieceToArray(boardArr, i, j, pieceArrCopy);
            }
        }
    }


    squareToReach = new Cell(Math.floor(rand2 / 8), rand2 % 8, 0);

    //question in notation
    que.innerHTML = (rand1 != 2 ? pieces[rand1] : '') + files[rand3 % 8] + rank[Math.floor(rand3 / 8)] + ' to ' + files[rand2 % 8] + rank[Math.floor(rand2 / 8)];
};

let draw = () => {
    ctx.drawImage(boardsprite, 0, 0, canvas.width, canvas.height);

    if (state.current == state.playing) {
        if (pieceArr[0].isSelected) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(150,150,0,100)';
            ctx.rect(pieceArr[0].currentPos[1] * canvas.width / 8, pieceArr[0].currentPos[0] * canvas.height / 8, canvas.width / 8, canvas.height / 8);
            ctx.fill();
            ctx.closePath()
        };

        pieceArr.forEach((piece) => {
            piece.draw();
        });

        //show destination square
        squareToReach.draw(ctx, canvas);

        if (pieceArr[0].isSelected) {
            //show valid moves
            for (let move of validMoveFunc(pieceArr[0].pieceCode)(pieceArr[0].currentPos, boardArr)) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255,255,0,255)';
                ctx.arc(move[1] * canvas.width / 8 + canvas.width / 16, move[0] * canvas.width / 8 + canvas.width / 16, 5, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath()
            };
        }

    }
    else if (state.current == state.next) {
        squareToReach.draw(ctx, canvas);

        if (!playerFoundShortestMove) {
            //show initial position while drawing path
            pieceArrCopy.forEach((piece) => {
                piece.draw();
            });
            drawPath(arrowsprite, ctx, canvas, minpath);
        }
        else {
            pieceArr.forEach((piece) => {
                piece.draw();
            });
        }

    }
};

let loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    window.setTimeout(loop, 1000 / 5);
};

let updateScore = (numberOfCorrectAttempts, numberOfTotalAttempts) => {
    window.localStorage.setItem('num_successful_attempt_chess', numberOfCorrectAttempts);
    window.localStorage.setItem('num_total_attempt_chess', numberOfTotalAttempts);
    let scoreInPercent = numberOfCorrectAttempts == 0 ? 0 : (numberOfCorrectAttempts / numberOfTotalAttempts * 100).toFixed();
    scoreText.innerHTML = scoreInPercent + '%';
};


//EVENT HANDLING

document.addEventListener('DOMContentLoaded', start);

checkbox.onchange = (e) => {
    if (!checkbox.checked) {
        boardsprite.src = 'assets/board.png';
    }
    else {
        boardsprite.src = 'assets/board-w.png';
    }
};

soundIcon.onclick = (e) => {
    if (sound == 'on') {
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-volume-mute');
        sound = 'off';
    }
    else {
        soundIcon.classList.remove('fa-volume-mute');
        soundIcon.classList.add('fa-volume-up');
        sound = 'on';
    }
};

startBtn.onclick = (e) => {
    startOnly.classList.add('hide');
    afterstart.classList.remove('hide');
    state.current = state.playing;

    numberOfCorrectAttempts = window.localStorage.getItem('num_successful_attempt_chess') ? parseInt(window.localStorage.getItem('num_successful_attempt_chess')) : 0;
    numberOfTotalAttempts = window.localStorage.getItem('num_total_attempt_chess') ? parseInt(window.localStorage.getItem('num_total_attempt_chess')) : 0;
    updateScore(numberOfCorrectAttempts, numberOfTotalAttempts);

    reset();
};

nextbutton.onclick = (e) => {
    sol.classList.add('hide');
    nextbutton.classList.add('hide');
    state.current = state.playing;
    reset();
};



boarddiv.onclick = (e) => {
    let finishProblem = () => {
        sol.classList.remove('hide');
        nextbutton.classList.remove('hide');

        minmoveText.innerHTML = mindistance;

        //update score
        if (playerFoundShortestMove == true) {
            numberOfCorrectAttempts = numberOfCorrectAttempts + 1;
            shortest.classList.add('hide');
        }
        else {
            //show path in text form
            let path = '';
            minpath.forEach((cell, index) => {
                path += files[cell.y] + rank[cell.x];
                if (index != minpath.length - 1) {
                    path += ' -> ';
                }
            });
            shortest.classList.remove('hide');
            minpathText.innerHTML = path;
            message.classList.add('hide');
        }
        numberOfTotalAttempts = numberOfTotalAttempts + 1;
        updateScore(numberOfCorrectAttempts, numberOfTotalAttempts);
    };

    if (state.current == state.playing) {
        let clicked_row = Math.floor(e.offsetY / boarddiv.clientWidth * 8);
        let clicked_col = Math.floor(e.offsetX / boarddiv.clientHeight * 8);

        if (clicked_row == pieceArr[0].currentPos[0] && clicked_col == pieceArr[0].currentPos[1]) {
            //select piece
            pieceArr[0].isSelected = !pieceArr[0].isSelected;
        }
        else if (pieceArr[0].isSelected) { //if not clicked on piece to move but piece was already selected

            if (validMoveFunc(validMoveFunc(pieceArr[0].pieceCode)(pieceArr[0].currentPos, boardArr).some(position => position[0] == clicked_row && position[1] == clicked_col))) {

                //capture
                let capture = false;
                for (let i = 1; i <= pieceArr.length - 1; i++) {
                    if (pieceArr[i].currentPos[0] == clicked_row && pieceArr[i].currentPos[1] == clicked_col) {
                        pieceArr[i] = undefined;
                        capture = true;
                        if (sound == 'on') {
                            captureSound.play();
                        }
                        break;
                    }
                }
                pieceArr = pieceArr.filter((piece) => piece != undefined);

                pieceArr[0].move(boardArr, [clicked_row, clicked_col]);
                numberOfPlayerMoves = numberOfPlayerMoves + 1;

                //unselect after move
                pieceArr[0].isSelected = false;

                // if pawn can't reach destination after that move
                if (pieceArr[0].pieceCode == 2 && shortestPath(boardArr, pieceArr[0].currentPos, [squareToReach.x, squareToReach.y]) == -1) {
                    state.current = state.next;
                    if (sound == 'on') {
                        failedSound.play();
                    }
                    playerFoundShortestMove = false;

                    finishProblem();
                }

                //check if the piece reached the destination square
                else if (pieceArr[0].currentPos[0] == squareToReach.x && pieceArr[0].currentPos[1] == squareToReach.y) {
                    state.current = state.next;
                    if (sound == 'on') {
                        correctSound.play();
                    }

                    //check if shortest path has been found
                    if (mindistance == numberOfPlayerMoves) {
                        playerFoundShortestMove = true;

                        message.classList.remove('hide');
                        message.innerHTML = 'Congratulations!!!'
                    };

                    finishProblem();
                }
                else if (sound == 'on' && capture == false) {
                    moveSound.play();
                }
            };
        }
    };
};

//for hamburger, navbar
menu.addEventListener('click', (e) => {
    tabs.classList.toggle('hide');
});


resetbutton.onclick = (e) => {
    numberOfCorrectAttempts = 0;
    numberOfTotalAttempts = 0;
    updateScore(numberOfCorrectAttempts, numberOfTotalAttempts);
};