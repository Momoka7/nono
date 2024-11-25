import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
    constructor() {
        super({
            key: "Preloader",
        });
    }

    preload() {
        // 加载必要的资源
    }

    create() {
        this.scene.start("Play");
    }
}
