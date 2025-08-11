const boardSize = 8;
const mineCount = 10;
const bsound1 = new Audio('/tileon.wav')
const bsound2 = new Audio('explosion.ogg')
let board = [];
let revealedCells = 0;
let isGameOver = false;

function generateBoard() {
    board = [];
    revealedCells = 0;
    isGameOver = false;
    const mines = generateMines();

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push({
                isMine: mines.includes(i * boardSize + j),
                revealed: false,
                flagged: false,
                neighborMines: 0,
            });
        }
        board.push(row);
    }

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isMine) continue;
            board[i][j].neighborMines = countNeighborMines(i, j);
        }
    }

    renderBoard();
}

function generateMines() {
    const mines = [];
    while (mines.length < mineCount) {
        const mine = Math.floor(Math.random() * (boardSize * boardSize));
        if (!mines.includes(mine)) {
            mines.push(mine);
        }
    }
    // mines.push(1);
    return mines;
}

function countNeighborMines(row, col) {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [1, 1],
        [-1, 1],
        [1, -1]
    ];
    let mineCount = 0;

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            if (board[newRow][newCol].isMine) mineCount++;
        }
    });

    return mineCount;
}

function revealCell(row, col) {
    if (revealedCells == 0) {
        if (board[row][col].isMine) {
            bsound1.play();
            generateBoard();
        }
        renderBoard();
    }
    if (isGameOver || board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    revealedCells++;
    if (board[row][col].isMine) {
        isGameOver = true;

        alert('lost');
        renderBoard();
        return;
    }


    if (board[row][col].neighborMines === 0) {
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            [-1, -1],
            [1, 1],
            [-1, 1],
            [1, -1]
        ];
        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                revealCell(newRow, newCol);
            }
        });
    }

    if (revealedCells === boardSize * boardSize - mineCount) {
        isGameOver = true;
        alert('You won!');
    }

    renderBoard();
}

function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = board[i][j];
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (isGameOver == true) {
                cellElement.classList.addre
            }
            if (cell.revealed) {
                cellElement.classList.add('revealed');
                if (cell.isMine) {
                    cellElement.classList.add('mine');
                    cellElement.innerText = '💣';
                } else if (cell.neighborMines > 0) {
                    cellElement.innerText = cell.neighborMines;
                    cellElement.id = ("i" + cellElement.innerText);




                }
            }

            if (cell.flagged) {
                cellElement.classList.add('flagged');
                cellElement.innerText = '🚩';
            }

            cellElement.addEventListener('click', () => revealCell(i, j));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!cell.revealed) {
                    cell.flagged = !cell.flagged;
                    renderBoard();
                }
            });

            boardContainer.appendChild(cellElement);
        }
    }
}

// Reset the game
function resetGame() {
    generateBoard();
}

// Set up event listeners
document.getElementById('reset').addEventListener('click', () => {
    bsound1.play();
    alert('Want to Restart ?');
    resetGame();
});

// Start the game
generateBoard();