function Pawn(sprite, canvas, ctx, color, currentPos) {
    this.color = color;
    this.currentPos = currentPos;
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite = sprite;
    this.isSelected = false;

    this.sx = 107 * 5;
    this.sy = (this.color == 'white' ? 0 : 1) * 107;
    this.width = 107;
    this.height = 107;

    this.pieceCode = 2;

    this.move = (boardArray, newPos) => {
        boardArray[newPos[0]][newPos[1]] = boardArray[this.currentPos[0]][this.currentPos[1]];
        boardArray[this.currentPos[0]][this.currentPos[1]] = 0;
        this.currentPos = newPos;

        return true;
    }

    this.draw = () => {
        ctx.drawImage(this.sprite, this.sx, this.sy, this.width, this.height, Math.floor(this.currentPos[1] * this.canvas.width / 8), Math.floor(this.currentPos[0] * this.canvas.height / 8), Math.floor(this.canvas.width / 8), Math.floor(this.canvas.height / 8));
    };
};


Pawn.generateValidMoves = (currentPos, boardArray, color = 'white') => {
    let validMoves = [];
    let direction = color == 'white' ? -1 : 1;
    let x, y; //current x and y
    x = currentPos[0];
    y = currentPos[1];
    if (x * direction == -6 || x * direction == 1) { //-6 for white pawn on 2nd rank and 1 for black pawn on 7th rank
        if (boardArray[x + direction][y] == 0 && boardArray[x + direction * 2][y] == 0) {
            //both squares in front are empty, so can move two steps
            validMoves.push([x + direction * 2, y]);
        }
    }

    if (x + direction >= 0 && x + direction <= 7) {
        //1 move straight
        if (boardArray[x + direction][y] == 0) {
            validMoves.push([x + direction, y]);
        }

        //capture move
        if (boardArray[x + direction][y + 1] * (color == 'white' ? 1 : -1) < 0 && y <= 6) {
            validMoves.push([x + direction, y + 1]);
        }

        if (boardArray[x + direction][y - 1] * (color == 'white' ? 1 : -1) < 0 && y > 0) {
            validMoves.push([x + direction, y - 1]);
        }
    }

    return validMoves;
};

export default Pawn;