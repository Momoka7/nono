import { Preloader } from "./Preloader";
import { Play } from "./Play";
import Phaser from "phaser";

const config = {
    title: "Nonogram",
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: "game-container",
    backgroundColor: "#192a56",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preloader, Play],
};

new Phaser.Game(config);
