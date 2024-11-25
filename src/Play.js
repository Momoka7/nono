import Phaser from "phaser";
import { BoardSizeSelector } from "./ui/BoardSizeSelector";
import { NonogramGame } from "./game/NonogramGame";
import { BoardRenderer } from "./ui/BoardRenderer";

export class Play extends Phaser.Scene {
    constructor() {
        super({ key: "Play" });
        this.boardSize = { rows: 5, cols: 5 };
        this.statsText = null;
    }

    create() {
        this.cameras.main.setBackgroundColor("#4a9e4a");
        this.createSizeSelector();
    }

    createSizeSelector() {
        const sizeSelector = new BoardSizeSelector(this);
        const confirmButton = sizeSelector.create({
            title: "选择棋盘大小",
            onSizeSelect: (size) => {
                Object.assign(this.boardSize, size);
            },
        });

        confirmButton.on("pointerdown", () => this.startGame());
    }

    startGame() {
        this.children.removeAll();

        this.game = new NonogramGame(this, { boardSize: this.boardSize });
        this.game.generateSolution();
        this.createGameUI();
    }

    createGameUI() {
        const rowHints = this.game.calculateRowHints();
        const colHints = this.game.calculateColHints();

        this.boardRenderer = new BoardRenderer(this);
        this.boardRenderer.render({
            boardSize: this.boardSize,
            rowHints,
            colHints,
            onCellClick: this.handleCellClick.bind(this),
        });

        this.createStatsDisplay();
        this.createBackButton();
    }

    createBackButton() {
        const backButton = this.add
            .text(50, 50, "返回", {
                fontSize: "28px",
                fill: "#ffffff",
                backgroundColor: "#2d572d",
                padding: { x: 20, y: 15 },
            })
            .setInteractive();

        backButton.on("pointerdown", () => {
            this.scene.restart();
        });
    }

    createStatsDisplay() {
        const stats = this.game.getStats();
        this.statsText = this.add.text(
            this.cameras.main.width - 200,
            50,
            `关卡: ${stats.level}\n生命: ${stats.lives}`,
            {
                fontSize: "24px",
                fill: "#ffffff",
                align: "right",
            }
        );
    }

    updateStatsDisplay() {
        if (this.statsText) {
            const stats = this.game.getStats();
            this.statsText.setText(
                `关卡: ${stats.level}\n生命: ${stats.lives}`
            );
        }
    }

    handleCellClick(cell, row, col, pointer) {
        if (pointer.rightButtonDown()) {
            // 右键标记叉号
            if (this.game.playerBoard[row][col] !== 2) {
                this.game.playerBoard[row][col] = 2;
                if (this.game.solution[row][col] === 1) {
                    // 错误标记
                    const lives = this.game.reduceLife();
                    this.updateStatsDisplay();
                    if (lives <= 0) {
                        this.showGameOver();
                        return;
                    }
                    // 提示玩家标记错误
                    this.showErrorMessage();
                    return;
                }
                this.boardRenderer.drawCross(cell);
                this.boardRenderer.disableCell(cell);
            } else {
                this.game.playerBoard[row][col] = 0;
                this.boardRenderer.clearCross(cell);
            }
        } else {
            // 左键填充
            if (this.game.playerBoard[row][col] !== 1) {
                if (!this.game.checkMove(row, col, 1)) {
                    // 错误标记
                    const lives = this.game.reduceLife();
                    this.updateStatsDisplay();
                    if (lives <= 0) {
                        this.showGameOver();
                        return;
                    }
                    // 提示玩家标记错误
                    this.showErrorMessage();
                    return;
                }
                this.game.playerBoard[row][col] = 1;
                cell.setFillStyle(0xffffff, 1);
                this.boardRenderer.clearCross(cell);
                this.boardRenderer.disableCell(cell);
            } else {
                this.game.playerBoard[row][col] = 0;
                cell.setFillStyle(0xffffff, 0.1);
            }
        }

        if (
            (!pointer.rightButtonDown() &&
                this.game.playerBoard[row][col] === 1) ||
            (pointer.rightButtonDown() && this.game.playerBoard[row][col] === 2)
        ) {
            // 检查并更新行/列的完成状态
            const isRowComplete = this.game.isRowComplete(row);
            const isColComplete = this.game.isColComplete(col);

            // 更新提示数字的颜色
            this.boardRenderer.updateHintColor(
                row,
                col,
                isRowComplete,
                isColComplete
            );
        }

        if (this.game.isLevelComplete()) {
            this.showLevelComplete();
        }
    }

    showErrorMessage() {
        const text = this.add
            .text(
                this.cameras.main.centerX,
                100,
                "标记错误！剩余生命: " + this.game.lives,
                {
                    fontSize: "28px",
                    fill: "#ff0000",
                    backgroundColor: "#000000",
                    padding: { x: 20, y: 10 },
                }
            )
            .setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            text.destroy();
        });
    }

    showGameOver() {
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            400,
            200,
            0x000000,
            0.8
        );

        const gameOverText = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "游戏结束！\n点击重新开始",
                {
                    fontSize: "32px",
                    fill: "#ffffff",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        overlay.setInteractive();
        overlay.on("pointerdown", () => {
            this.scene.restart();
        });
    }

    showLevelComplete() {
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            400,
            200,
            0x000000,
            0.8
        );

        const completeText = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "恭喜通关！\n点击进入下一关",
                {
                    fontSize: "32px",
                    fill: "#ffffff",
                    align: "center",
                }
            )
            .setOrigin(0.5);

        overlay.setInteractive();
        overlay.on("pointerdown", () => {
            this.game.nextLevel();
            this.children.removeAll();
            this.createGameUI();
        });
    }
}
