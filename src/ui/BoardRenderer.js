export class BoardRenderer {
    constructor(scene) {
        this.scene = scene;
        this.metrics = null;
        this.rowHintTexts = [];
        this.colHintTexts = [];
    }

    render(config) {
        const { boardSize, rowHints, colHints, onCellClick } = config;

        this.metrics = this.calculateBoardMetrics(
            boardSize,
            rowHints,
            colHints
        );

        this.renderHints(rowHints, colHints);

        return this.renderCells(boardSize, onCellClick);
    }

    calculateBoardMetrics(boardSize, rowHints, colHints) {
        const padding = 100;
        const maxBoardWidth = this.scene.cameras.main.width - padding * 2;
        const maxBoardHeight = this.scene.cameras.main.height - padding * 2;

        const maxRowHintWidth =
            Math.max(...rowHints.map((arr) => arr.length)) * 25;
        const maxColHintHeight =
            Math.max(...colHints.map((arr) => arr.length)) * 25;

        const availableWidth = maxBoardWidth - maxRowHintWidth - 60;
        const availableHeight = maxBoardHeight - maxColHintHeight - 60;

        const maxCellSize = Math.min(
            Math.max(150 - (boardSize.rows + boardSize.cols) * 3, 60),
            120
        );

        const cellSize = Math.min(
            availableWidth / boardSize.cols,
            availableHeight / boardSize.rows,
            maxCellSize
        );

        const hintFontSize = Math.min(cellSize * 0.4, 20);

        const totalWidth = boardSize.cols * cellSize + maxRowHintWidth + 60;
        const totalHeight = boardSize.rows * cellSize + maxColHintHeight + 60;

        const startX =
            this.scene.cameras.main.centerX -
            totalWidth / 2 +
            maxRowHintWidth +
            30;
        const startY =
            this.scene.cameras.main.centerY -
            totalHeight / 2 +
            maxColHintHeight +
            30;

        return {
            cellSize,
            boardStartX: startX,
            boardStartY: startY,
            hintFontSize,
            maxRowHintWidth,
            maxColHintHeight,
        };
    }

    renderHints(rowHints, colHints) {
        const {
            cellSize,
            boardStartX,
            boardStartY,
            hintFontSize,
            maxRowHintWidth,
            maxColHintHeight,
        } = this.metrics;

        this.rowHintTexts = rowHints.map((hints, row) => {
            const hintString = hints.join(",");
            return this.scene.add
                .text(
                    boardStartX - 15,
                    boardStartY + row * cellSize + cellSize / 2,
                    hintString,
                    {
                        fontSize: hintFontSize + "px",
                        fill: "#ffffff",
                    }
                )
                .setOrigin(1, 0.5);
        });

        this.colHintTexts = colHints.map((hints, col) => {
            const hintString = hints.join("\n");
            return this.scene.add
                .text(
                    boardStartX + col * cellSize + cellSize / 2,
                    boardStartY - 15,
                    hintString,
                    {
                        fontSize: hintFontSize + "px",
                        fill: "#ffffff",
                        align: "center",
                    }
                )
                .setOrigin(0.5, 1);
        });
    }

    updateHintColor(rowIndex, colIndex, isRowComplete, isColComplete) {
        const completedColor = "#666666";
        const normalColor = "#ffffff";

        if (rowIndex !== undefined && this.rowHintTexts[rowIndex]) {
            this.rowHintTexts[rowIndex].setColor(
                isRowComplete ? completedColor : normalColor
            );
        }

        if (colIndex !== undefined && this.colHintTexts[colIndex]) {
            this.colHintTexts[colIndex].setColor(
                isColComplete ? completedColor : normalColor
            );
        }
    }

    renderCells(boardSize, onCellClick) {
        const { cellSize, boardStartX, boardStartY } = this.metrics;
        const cells = [];
        const gap = Math.max(1, Math.floor(cellSize * 0.1));

        for (let row = 0; row < boardSize.rows; row++) {
            cells[row] = [];
            for (let col = 0; col < boardSize.cols; col++) {
                const cell = this.scene.add.rectangle(
                    boardStartX + col * cellSize + cellSize / 2,
                    boardStartY + row * cellSize + cellSize / 2,
                    cellSize - gap,
                    cellSize - gap,
                    0xffffff,
                    0.1
                );

                cell.setStrokeStyle(1, 0xffffff);
                cell.setInteractive();

                const clickHandler = (pointer) => {
                    if (pointer.rightButtonDown()) {
                        pointer.event.preventDefault();
                    }
                    onCellClick(cell, row, col, pointer);
                };

                cell.on("pointerdown", clickHandler);

                cell.clickHandler = clickHandler;

                cells[row][col] = cell;
            }
        }
        return cells;
    }

    disableCell(cell) {
        cell.disableInteractive();
        if (cell.clickHandler) {
            cell.off("pointerdown", cell.clickHandler);
            cell.clickHandler = null;
        }
        cell.setAlpha(0.8);
    }

    drawCross(cell) {
        const size = cell.width * 0.5;

        if (!cell.cross) {
            cell.cross = [];

            const line1 = this.scene.add
                .line(
                    cell.x + cell.width / 4,
                    cell.y + cell.height / 4,
                    -size / 2,
                    -size / 2,
                    size / 2,
                    size / 2,
                    0xff0000
                )
                .setLineWidth(3);

            const line2 = this.scene.add
                .line(
                    cell.x + cell.width / 4,
                    cell.y + cell.height / 4,
                    -size / 2,
                    size / 2,
                    size / 2,
                    -size / 2,
                    0xff0000
                )
                .setLineWidth(3);

            cell.cross = [line1, line2];
        }
    }

    clearCross(cell) {
        if (cell.cross) {
            cell.cross.forEach((line) => line.destroy());
            cell.cross = null;
        }
    }
}
