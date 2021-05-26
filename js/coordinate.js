import { getRandom } from './utils.mjs';

let start = 0, isflipped = 0;
let numOfCorrectAnswers = 0, numOfTotalAttempts = 0;
let rank = [8, 7, 6, 5, 4, 3, 2, 1];
let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let sound = 'on';

let correctSound = new Audio('./assets/correct.mp3');
let failedSound = new Audio('./assets/wrong.mp3');

let flip = document.querySelector('#flipboard');
let startBtn = document.querySelector('.start-btn');
let startonly = document.querySelector('.start-only');
let menu = document.querySelector('.fa-bars');
let afterstart = document.querySelector('.afterstart');
let coordinateText = document.querySelector('.coordinateText');
let checkbox = document.querySelector('#checkbox');
let soundIcon = document.querySelector('.sound-icon');
let boardDiv = document.querySelector('.board');
let score = document.querySelector('.score-number');
let tabs = document.querySelector('.tabs');

let coordinate;
let nextCoordinate = () => {
    let random = getRandom(0, 63);
    let row = Math.floor(random / 8);
    let column = random % 8;
    coordinate = files[column] + rank[row];
    coordinateText.innerHTML = coordinate;
};

startBtn.onclick = (e) => {
    startonly.classList.add('hide');
    afterstart.classList.remove('hide');
    nextCoordinate();
    start = 1;
    boardDiv.style.display = 'block';
}

checkbox.onchange = (e) => {
    if (!checkbox.checked) {
        boardDiv.style.backgroundImage = 'url("./assets/board.png")';
    }
    else {
        if (!isflipped) {
            boardDiv.style.backgroundImage = 'url("./assets/board-w.png")';
        }
        else {
            boardDiv.style.backgroundImage = 'url("./assets/board-b.png")';
        }
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

menu.addEventListener('click', (e) => {
    tabs.classList.toggle('hide');
});

flip.addEventListener('click', (e) => {
    if (isflipped == 0) {
        if (checkbox.checked) {
            //show flipped 
            boardDiv.style.backgroundImage = 'url("./assets/board-b.png")';
        }
        isflipped = 1;
    }
    else {
        if (checkbox.checked) {
            //show flipped 
            boardDiv.style.backgroundImage = 'url("./assets/board-w.png")';
        }
        isflipped = 0;
    }
});

boardDiv.addEventListener('click', (e) => {
    if (start) {
        let boardWidth = boardDiv.clientWidth;
        let boardHeight = boardDiv.clientWidth;

        let temp1 = Math.floor(e.offsetX / boardWidth * 8);
        let temp2 = Math.floor(e.offsetY / boardHeight * 8);

        if (isflipped) {
            if ((files[7 - temp1] + rank[7 - temp2]) == coordinate) {
                numOfCorrectAnswers = numOfCorrectAnswers + 1;
                if (sound == 'on') {
                    correctSound.play();
                }
            }
            else {
                if (sound == 'on') {
                    failedSound.play();
                }
            }
        }
        else { //white's view
            if (files[temp1] + rank[temp2] == coordinate) {
                numOfCorrectAnswers = numOfCorrectAnswers + 1;
                if (sound == 'on') {
                    correctSound.play();
                }
            }
            else {
                if (sound == 'on') {
                    failedSound.play();
                }
            }
        }

        numOfTotalAttempts = numOfTotalAttempts + 1;
        score.innerHTML = numOfCorrectAnswers + '/' + numOfTotalAttempts;
        nextCoordinate();
    }
});