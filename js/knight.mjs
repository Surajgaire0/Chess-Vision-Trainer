function Knight(sprite, canvas, ctx, color, currentPos) {
    this.color = color;
    this.currentPos = currentPos;
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = sprite;
    this.isSelected = false;

    this.sx = 107 * 3;
    this.sy = (this.color == 'white' ? 0 : 1) * 107;
    this.width = 107;
    this.height = 107;

    this.pieceCode = 4;

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


Knight.generateValidMoves = (currentPos, boardArray, color = 'white') => {
    let validMoves = [], x, y;
    let d1 = [1, -1, -2, 2], d2 = [1, -1, 2, -2];
    for (let i = 0; i <= 3; i++) {
        for (let j = 0; j <= 3; j++) {
            if (Math.abs(d1[i]) != Math.abs(d2[j])) {
                x = currentPos[0] + d1[i];
                y = currentPos[1] + d2[j];

                if (x >= 0 && x <= 7 && y >= 0 && y <= 7 && (boardArray[x][y] * (color == 'white' ? 1 : -1)) <= 0) {
                    validMoves.push([x, y]);
                }
            }
        }
    }

    return validMoves;
}

export default Knight;