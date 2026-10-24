//Класс Контроллер
import {GameStatuses} from "../proxyModel/gameStatuses.js";

export class Controller {
    //Приватные свойства

    #view; //Вид
    #model; //Модель
    #audio; //Звук

    //Предыдущая позиция врага
    #prevEnemyPosition = {
        x: 0,
        y: 0,
    };

    //Предыдущий счет
    #prevScore = {
        1: 0,
        2: 0,
    };

    //Конструктор класса
    constructor(view, model, audio) {
        this.#view = view;
        this.#model = model;
        this.#audio = audio;
    }

    //Приватные методы

    #initIsMute() {
        if (localStorage.getItem("isMute") === null) {
            localStorage.setItem("isMute", JSON.stringify(Boolean(false)));
        }
    }

    #saveIsMute(value) {
        localStorage.setItem("isMute", JSON.stringify(Boolean(value)));
    }

    #loadIsMute() {
        return JSON.parse(localStorage.getItem("isMute"));
    }

    //Отрисовать
    #render() {
        if (this.#audio.isMute !== this.#loadIsMute()) this.#audio.mute();

        this.#view.render(this.#model, this.#audio.isMute, {
            onStart: () => this.#handleStart(),
            onStop: () => this.#handleStop(),
            onMute: () => this.#muteAudio(),
        });
    }

    //Проверить статус
    #checkStatus() {
        if (this.#model.status === GameStatuses.WIN) this.#audio.play("win");
        if (this.#model.status === GameStatuses.LOSS) this.#audio.play("loss");
    }

    //Проверить был ли прыжок врага
    #checkJumpEnemy() {
        if (!this.#model.enemy) return;

        if (
            this.#prevEnemyPosition.x !== this.#model.enemy.position.x ||
            this.#prevEnemyPosition.y !== this.#model.enemy.position.y
        )
            this.#audio.play("jump");

        this.#prevEnemyPosition = {...this.#model.enemy.position};
    }

    //Проверить изменился ли счет
    #checkScore() {
        if (!this.#model.score) return;

        if (this.#prevScore["1"] !== this.#model.score["1"] || this.#prevScore["2"] !== this.#model.score["2"])
            this.#audio.play("goose");

        this.#prevScore = {...this.#model.score};
    }

    //Обработчик старта
    #handleStart() {
        this.#prevScore["1"] = 0;
        this.#prevScore["2"] = 0;
        this.#audio.play("click");
        const settings = this.#view.getSettings();
        this.#model.gridSize = settings.gridSize;
        this.#model.pointsToWin = settings.pointsToWin;
        this.#model.attemptsToLose = settings.attemptsToLose;
        this.#model.start();
    }

    //Обработчик стоп
    #handleStop() {
        this.#prevScore["1"] = 0;
        this.#prevScore["2"] = 0;
        this.#audio.play("click");
        this.#model.stop();
    }

    //Вкл/выкл звук
    #muteAudio() {
        this.#saveIsMute(!this.#audio.isMute);
        this.#audio.mute();
        this.#render();
    }

    //Инициализировать
    init() {
        this.#initIsMute();
        this.#render();
    }

    //Обновить
    update() {
        this.#render();
        this.#checkStatus();
        this.#checkJumpEnemy();
        this.#checkScore();
    }

    //Переместить игрока
    movePlayers(player, direction) {
        this.#model.movePlayers(player, direction);
        this.#audio.play("move");
    }
}
