import { validMoveFunc } from './validmovefunc.mjs';
import { Cell } from './cell.mjs';

export let shortestPath = (boardArray, initialPos, targetPos) => {
    let piece = boardArray[initialPos[0]][initialPos[1]];
    let func = validMoveFunc(piece);

    let queue = [];

    queue.push([new Cell(initialPos[0], initialPos[1], 0)]);

    let visited = [];
    for (let i = 0; i < 8; i++) {
        let subarr = [];
        for (let j = 0; j < 8; j++) {
            subarr.push(0);
        }
        visited.push(subarr);
    }

    visited[initialPos[0]][initialPos[1]] = 1;

    while (queue.length > 0) {
        let path = queue[0];
        queue.shift();
        let node = path[path.length - 1];

        if (node.x == targetPos[0] && node.y == targetPos[1]) {
            return path;
        }

        if (node.dist == 15) {
            return -1;
        }

        let valid = func([node.x, node.y], boardArray);
        valid.forEach(pos => {
            let x = pos[0];
            let y = pos[1];

            if (!visited[x][y]) {
                visited[x][y] = 1;
                let new_path = [...path];
                new_path.push(new Cell(x, y, node.dist + 1));
                queue.push(new_path);
            }
        });
    }

    return -1;
};


export let shortestPathForKing = (boardArray, initialPos, targetPos) => {
    let piece = boardArray[initialPos[0]][initialPos[1]]; //1
    let func = validMoveFunc(piece);

    let queue = [];

    queue.push([[new Cell(initialPos[0], initialPos[1], 0), boardArray]]);

    let visited = [];
    for (let i = 0; i < 8; i++) {
        let subarr = [];
        for (let j = 0; j < 8; j++) {
            subarr.push(0);
        }
        visited.push(subarr);
    }

    visited[initialPos[0]][initialPos[1]] = 1;

    while (queue.length > 0) {
        let path = queue[0];
        queue.shift();
        let node = path[path.length - 1][0];
        let board = path[path.length - 1][1];
        let boardcopy = [];
        for (let i = 0; i < board.length; i++) {
            boardcopy[i] = board[i].slice();
        }

        if (node.x == targetPos[0] && node.y == targetPos[1]) {
            return path.map(a => {
                return a[0];
            });
        }

        if (node.dist == 15) {
            return -1;
        }

        let valid = func([node.x, node.y], boardcopy);
        valid.forEach(pos => {
            let x = pos[0];
            let y = pos[1];

            if (!visited[x][y]) {
                visited[x][y] = 1;

                let temp = [];
                for (let i = 0; i < boardcopy.length; i++) {
                    temp[i] = boardcopy[i].slice();
                }
                temp[x][y] = temp[node.x][node.y];
                temp[node.x][node.y] = 0;

                let new_path = [...path];
                new_path.push([new Cell(x, y, node.dist + 1), temp]);
                queue.push(new_path);
            }
        });
    }

    return -1;
};