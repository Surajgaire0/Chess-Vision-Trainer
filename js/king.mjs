import { validMoveFunc } from "./validmovefunc.mjs";

function King(sprite, canvas, ctx, color, currentPos) {
    this.color = color;
    this.currentPos = currentPos;
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = sprite;
    this.isSelected = false;

    this.sx = 107 * 0;
    this.sy = (this.color == 'white' ? 0 : 1) * 107;
    this.width = 107;
    this.height = 107;

    this.pieceCode = 1;

    this.move = (boardArray, newPos) => {
        boardArray[newPos[0]][newPos[1]] = boardArray[this.currentPos[0]][this.currentPos[1]];
        boardArray[this.currentPos[0]][this.currentPos[1]] = 0;
        this.currentPos = newPos;

        return true;
    }

    this.draw = () => {
        ctx.drawImage(this.sprite, this.sx, this.sy, this.width, this.height, Math.floor(this.currentPos[1] * this.canvas.width / 8), Math.floor(this.currentPos[0] * this.canvas.height / 8), Math.floor(this.canvas.width / 8), Math.floor(this.canvas.height / 8));
    };
}


King.generateValidMoves = (currentPos, boardArray, color = 'white') => {
    let validMoves = [], x, y;
    let d1 = [0, 1, -1], d2 = [1, 0, -1];
    for (let i = 0; i < d1.length; i++) {
        for (let j = 0; j < d2.length; j++) {
            if (!(Math.abs(d1[i]) == 0 && Math.abs(d2[j]) == 0)) {
                x = currentPos[0] + d1[i];
                y = currentPos[1] + d2[j];

                if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                    if ((boardArray[x][y] * (color == 'white' ? 1 : -1)) <= 0) {
                        //opponent piece or empty
                        validMoves.push([x, y]);
                    }
                }
            }
        }
    }

    let tempboardArray = [];

    let x_temp, y_temp;
    let sqInCheck = [];
    for (let k = 0; k < validMoves.length; k++) {
        tempboardArray = [];
        for (let v = 0; v < boardArray.length; v++) {
            tempboardArray[v] = boardArray[v].slice();
        }
        x_temp = validMoves[k][0];
        y_temp = validMoves[k][1];

        tempboardArray[x_temp][y_temp] = 1;
        tempboardArray[currentPos[0]][currentPos[1]] = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let player = 1;


                if (tempboardArray[i][j] * player < 0) {

                    sqInCheck = validMoveFunc(tempboardArray[i][j])([i, j], tempboardArray, 'black');

                    sqInCheck.forEach((a) => {
                        if (parseInt(a[0]) == parseInt(validMoves[k][0]) && parseInt(a[1]) == parseInt(validMoves[k][1])) {
                            validMoves[k] = [8, 8]; //[8,8] will be removed later
                        };
                    });


                }
            }
        }
    }


    validMoves = validMoves.filter((validmove) => !(validmove[0] == 8 && validmove[1] == 8));
    return validMoves;
}

export default King;