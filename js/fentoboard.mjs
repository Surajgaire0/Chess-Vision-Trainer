let fenToBoard = (fenString) => {
    let code = { k: -1, K: 1, p: -2, P: 2, b: -3, B: 3, n: -4, N: 4, q: -5, Q: 5, r: -6, R: 6 };
    let board = [];
    let rows = fenString.split('/');
    let subarray;
    rows.forEach((row) => {
        subarray = [];
        for (let c of row) {
            if (!isNaN(c)) {
                for (let i = 0; i < parseInt(c); i++) {
                    subarray.push(0);
                }
            }
            else {
                subarray.push(code[c]);
            }
        }
        board.push(subarray);
    });
    return board;
};

export { fenToBoard };