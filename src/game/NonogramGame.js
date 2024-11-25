export class NonogramGame {
    constructor(scene, config) {
        this.scene = scene;
        this.boardSize = config.boardSize;
        this.solution = [];
        this.playerBoard = [];
        this.level = 1;
        this.initializePlayerBoard();
        this.initializeLives();
    }

    initializeLives() {
        const totalCells = this.boardSize.rows * this.boardSize.cols;
        this.lives = Math.max(3, Math.floor(3 + totalCells / 25));
        this.lives = Math.min(this.lives, 10);
    }

    initializePlayerBoard() {
        this.playerBoard = Array(this.boardSize.rows)
            .fill()
            .map(() => Array(this.boardSize.cols).fill(0));
    }

    generateSolution() {
        this.solution = Array(this.boardSize.rows)
            .fill()
            .map(() =>
                Array(this.boardSize.cols)
                    .fill()
                    .map(() => (Math.random() < 0.5 ? 1 : 0))
            );
        this.initializePlayerBoard();
        this.initializeLives();
    }

    calculateRowHints() {
        return this.solution.map((row) => {
            const hints = [];
            let count = 0;
            for (let i = 0; i <= row.length; i++) {
                if (i < row.length && row[i] === 1) {
                    count++;
                } else if (count > 0) {
                    hints.push(count);
                    count = 0;
                }
            }
            return hints.length ? hints : [0];
        });
    }

    calculateColHints() {
        const hints = [];
        for (let col = 0; col < this.boardSize.cols; col++) {
            const colHints = [];
            let count = 0;
            for (let row = 0; row <= this.boardSize.rows; row++) {
                if (
                    row < this.boardSize.rows &&
                    this.solution[row][col] === 1
                ) {
                    count++;
                } else if (count > 0) {
                    colHints.push(count);
                    count = 0;
                }
            }
            hints.push(colHints.length ? colHints : [0]);
        }
        return hints;
    }

    checkWinCondition() {
        for (let row = 0; row < this.boardSize.rows; row++) {
            for (let col = 0; col < this.boardSize.cols; col++) {
                if (
                    this.solution[row][col] === 1 &&
                    this.playerBoard[row][col] !== 1
                ) {
                    return false;
                }
                if (
                    this.solution[row][col] === 0 &&
                    this.playerBoard[row][col] === 1
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    checkMove(row, col, value) {
        if (value === 1) {
            return this.solution[row][col] === 1;
        }
        return true;
    }

    isLevelComplete() {
        for (let row = 0; row < this.boardSize.rows; row++) {
            for (let col = 0; col < this.boardSize.cols; col++) {
                if (
                    this.solution[row][col] === 1 &&
                    this.playerBoard[row][col] !== 1
                ) {
                    return false;
                }
                if (
                    this.solution[row][col] === 0 &&
                    this.playerBoard[row][col] === 0
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    nextLevel() {
        this.level++;
        this.generateSolution();
    }

    reduceLife() {
        this.lives--;
        return this.lives;
    }

    getStats() {
        return {
            lives: this.lives,
            level: this.level,
        };
    }

    isRowComplete(row) {
        for (let col = 0; col < this.boardSize.cols; col++) {
            if (
                this.solution[row][col] === 1 &&
                this.playerBoard[row][col] !== 1
            ) {
                return false;
            }
            if (
                this.solution[row][col] === 0 &&
                this.playerBoard[row][col] !== 2
            ) {
                return false;
            }
        }
        return true;
    }

    isColComplete(col) {
        for (let row = 0; row < this.boardSize.rows; row++) {
            if (
                this.solution[row][col] === 1 &&
                this.playerBoard[row][col] !== 1
            ) {
                return false;
            }
            if (
                this.solution[row][col] === 0 &&
                this.playerBoard[row][col] !== 2
            ) {
                return false;
            }
        }
        return true;
    }
}
