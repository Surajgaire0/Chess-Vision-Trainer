import Knight from './knight.mjs';
import Bishop from './bishop.mjs';
import Rook from './rook.mjs';
import Queen from './queen.mjs';
import King from './king.mjs';
import Pawn from './pawn.mjs';

export let validMoveFunc = (pieceCode) => {
    switch (Math.abs(pieceCode)) {
        case 1:
            return King.generateValidMoves;
            break;
        case 2:
            return Pawn.generateValidMoves;
            break;
        case 3:
            return Bishop.generateValidMoves;
            break;
        case 4:
            return Knight.generateValidMoves;
            break;
        case 5:
            return Queen.generateValidMoves;
            break;
        case 6:
            return Rook.generateValidMoves;
            break;

    }
};