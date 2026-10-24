import {Controller} from "./controller/controller.js";
import {View} from "./view/view.js";
import {ProxyModel} from "./proxyModel/proxyModel.js";
import {AudioManager} from "./utils/audioManager.js";
import {EventEmitter} from "./utils/observer.js";
import {SwipeManager} from "./utils/swipeManager.js";

const view = new View();

const eventEmitter = new EventEmitter();
const proxyModel = new ProxyModel(eventEmitter);

const audio = new AudioManager();

audio.add("./assets/sounds/click.mp3", "click");
audio.add("./assets/sounds/jump.mp3", "jump");
audio.add("./assets/sounds/move.mp3", "move");
audio.add("./assets/sounds/goose.mp3", "goose");
audio.add("./assets/sounds/win.mp3", "win");
audio.add("./assets/sounds/loss.mp3", "loss");

const controller = new Controller(view, proxyModel, audio);

controller.init();

proxyModel.eventEmitter.addEventListener("change", () => {
    controller.update();
});

window.addEventListener("keydown", e => {
    const player = proxyModel.playerId === 1 ? proxyModel.player1 : proxyModel.player2;

    switch (e.code) {
        case "ArrowUp":
            controller.movePlayer(player, "UP");
            break;
        case "ArrowDown":
            controller.movePlayer(player, "DOWN");
            break;
        case "ArrowLeft":
            controller.movePlayer(player, "LEFT");
            break;
        case "ArrowRight":
            controller.movePlayer(player, "RIGHT");
            break;
    }
});

const swipeManager = new SwipeManager(direction => {
    const player = proxyModel.playerId === 1 ? proxyModel.player1 : proxyModel.player2;
    controller.movePlayer(player, direction);
});

swipeManager.init();