//Класс Контроллер
import {GameStatuses} from "../proxyModel/gameStatuses.js";

/**
 * Контроллер (Controller).
 * Связывает модель (ProxyModel), представление (View) и менеджер звука (AudioManager).
 * Обрабатывает действия пользователя, обновляет интерфейс и управляет звуковыми эффектами.
 */
export class Controller {
    //Приватные свойства

    /**
     * Представление (интерфейс игры).
     * @type {View}
     */
    #view;

    /**
     * Модель данных игры (связь с сервером).
     * @type {ProxyModel}
     */
    #model;

    /**
     * Менеджер звуковых эффектов.
     * @type {AudioManager}
     */
    #audio;

    /**
     * Предыдущая позиция врага.
     * Используется для отслеживания прыжков и воспроизведения звука.
     * @type {{x: number, y: number}}
     */
    #prevEnemyPosition = {
        x: 0,
        y: 0,
    };

    /**
     * Предыдущий счет игроков.
     * Используется для отслеживания поимки гуся и воспроизведения звука.
     * @type {{1: number, 2: number}}
     */
    #prevScore = {
        1: 0,
        2: 0,
    };

    /**
     * Создает экземпляр контроллера.
     * @param {View} view - Объект представления.
     * @param {ProxyModel} model - Объект модели.
     * @param {AudioManager} audio - Объект менеджера звука.
     */
    constructor(view, model, audio) {
        this.#view = view;
        this.#model = model;
        this.#audio = audio;
    }

    //Приватные методы

    /**
     * Инициализирует состояние звука в localStorage, если его там нет.
     */
    #initIsMute() {
        if (localStorage.getItem("isMute") === null) {
            localStorage.setItem("isMute", JSON.stringify(Boolean(false)));
        }
    }

    /**
     * Сохраняет состояние звука в localStorage.
     * @param {boolean} value - true, если звук выключен.
     */
    #saveIsMute(value) {
        localStorage.setItem("isMute", JSON.stringify(Boolean(value)));
    }

    /**
     * Загружает состояние звука из localStorage.
     * @returns {boolean} true, если звук выключен.
     */
    #loadIsMute() {
        return JSON.parse(localStorage.getItem("isMute"));
    }

    /**
     * Отрисовывает интерфейс, передавая в View модель и колбэки для кнопок.
     * Также синхронизирует текущее состояние звука с сохраненным в localStorage.
     */
    #render() {
        if (this.#audio.isMute !== this.#loadIsMute()) this.#audio.mute();

        this.#view.render(this.#model, this.#audio.isMute, {
            onStart: () => this.#handleStart(),
            onStop: () => this.#handleStop(),
            onMute: () => this.#muteAudio(),
        });
    }

    /**
     * Проигрывает звуки победы или поражения при смене статуса игры.
     */
    #checkStatus() {
        if (this.#model.status === GameStatuses.WIN) this.#audio.play("win");
        if (this.#model.status === GameStatuses.LOSS) this.#audio.play("loss");
    }

    /**
     * Проверяет изменение позиции врага и проигрывает звук прыжка.
     */
    #checkJumpEnemy() {
        if (!this.#model.enemy) return;

        if (
            this.#prevEnemyPosition.x !== this.#model.enemy.position.x ||
            this.#prevEnemyPosition.y !== this.#model.enemy.position.y
        )
            this.#audio.play("jump");

        this.#prevEnemyPosition = {...this.#model.enemy.position};
    }

    /**
     * Проверяет изменение счета и проигрывает звук поимки гуся.
     */
    #checkScore() {
        if (!this.#model.score) return;

        if (this.#prevScore["1"] !== this.#model.score["1"] || this.#prevScore["2"] !== this.#model.score["2"])
            this.#audio.play("goose");

        this.#prevScore = {...this.#model.score};
    }

    /**
     * Обработчик нажатия на кнопку старта.
     * Считывает настройки из интерфейса, передает их в модель и запускает игру.
     */
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

    /**
     * Обработчик нажатия на кнопку завершения игры.
     */
    #handleStop() {
        this.#prevScore["1"] = 0;
        this.#prevScore["2"] = 0;
        this.#audio.play("click");
        this.#model.stop();
    }

    /**
     * Переключает режим звука и перерисовывает интерфейс для обновления иконки.
     */
    #muteAudio() {
        this.#saveIsMute(!this.#audio.isMute);
        this.#audio.mute();
        this.#render();
    }

    //Публичные методы

    /**
     * Инициализирует контроллер при запуске приложения.
     */
    init() {
        this.#initIsMute();
        this.#render();
    }

    /**
     * Вызывается при каждом обновлении состояния модели.
     * Перерисовывает интерфейс и проверяет необходимость проигрывания звуков.
     */
    update() {
        this.#render();
        this.#checkStatus();
        this.#checkJumpEnemy();
        this.#checkScore();
    }

    /**
     * Обрабатывает перемещение игрока.
     * Передает команду в модель и проигрывает звук шага.
     *
     * @param {PlayerData} player - Объект игрока.
     * @param {'LEFT'|'RIGHT'|'UP'|'DOWN'} direction - Направление движения.
     */
    movePlayer(player, direction) {
        this.#model.movePlayer(player, direction);
        this.#audio.play("move");
    }
}