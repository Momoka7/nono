export class BoardSizeSelector {
    constructor(scene) {
        this.scene = scene;
    }

    create(config) {
        const { title, onSizeSelect } = config;

        // 创建标题
        this.scene.add
            .text(this.scene.cameras.main.centerX, 100, title, {
                fontSize: "32px",
                fill: "#ffffff",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(0.5);

        // 创建行数选择器
        this.createSizeSelector("行数:", 400, 5, (value) => {
            onSizeSelect({ rows: value });
        });

        // 创建列数选择器
        this.createSizeSelector("列数:", 500, 5, (value) => {
            onSizeSelect({ cols: value });
        });

        // 创建确认按钮
        return this.createConfirmButton();
    }

    createSizeSelector(label, y, defaultValue, callback) {
        const centerX = this.scene.cameras.main.centerX;

        // 添加标签
        this.scene.add
            .text(centerX - 150, y, label, {
                fontSize: "24px",
                fill: "#ffffff",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(1, 0.5);

        // 减少按钮
        const minusBtn = this.scene.add
            .text(centerX - 100, y, "-", {
                fontSize: "24px",
                fill: "#ffffff",
                backgroundColor: "#2d572d",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        // 显示当前值
        const valueText = this.scene.add
            .text(centerX, y, defaultValue.toString(), {
                fontSize: "24px",
                fill: "#ffffff",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(0.5);

        // 增加按钮
        const plusBtn = this.scene.add
            .text(centerX + 100, y, "+", {
                fontSize: "24px",
                fill: "#ffffff",
                backgroundColor: "#2d572d",
                padding: { x: 15, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        let currentValue = defaultValue;

        minusBtn.on("pointerdown", () => {
            if (currentValue > 3) {
                currentValue--;
                valueText.setText(currentValue.toString());
                callback(currentValue);
            }
        });

        plusBtn.on("pointerdown", () => {
            if (currentValue < 25) {
                currentValue++;
                valueText.setText(currentValue.toString());
                callback(currentValue);
            }
        });
    }

    createConfirmButton() {
        const confirmButton = this.scene.add
            .text(this.scene.cameras.main.centerX, 600, "创建棋盘", {
                fontSize: "24px",
                fill: "#ffffff",
                backgroundColor: "#2d572d",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive();

        return confirmButton;
    }
}
