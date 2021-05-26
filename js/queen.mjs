function Queen(sprite, canvas, ctx, color, currentPos) {
    this.color = color;
    this.currentPos = currentPos;
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = sprite;
    this.isSelected = false;

    this.sx = 107 * 1;
    this.sy = (this.color == 'white' ? 0 : 1) * 107;
    this.width = 107;
    this.height = 107;

    this.pieceCode = 5;

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


Queen.generateValidMoves = (currentPos, boardArray, color = 'white') => {
    let validMoves = [], x, y;
    let d1 = [0, 1, -1], d2 = [1, 0, -1];
    for (let i = 0; i < d1.length; i++) {
        for (let j = 0; j < d2.length; j++) {
            if (!(Math.abs(d1[i]) == 0 && Math.abs(d2[j]) == 0)) {
                for (let k = 1; k < 8; k++) {
                    x = currentPos[0] + d1[i] * k;
                    y = currentPos[1] + d2[j] * k;

                    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                        if ((boardArray[x][y] * (color == 'white' ? 1 : -1)) > 0) {
                            //same color piece
                            break;
                        }
                        else if ((boardArray[x][y] * (color == 'white' ? 1 : -1)) < 0) {
                            //opponent piece
                            validMoves.push([x, y]);
                            break;
                        }
                        validMoves.push([x, y]);
                    }
                    else {
                        //ouside board
                        break;
                    }
                }
            }
        }
    }

    return validMoves;
}

export default Queen;