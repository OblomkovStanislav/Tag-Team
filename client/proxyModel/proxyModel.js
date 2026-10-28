//Класс Прокси-модель
import {GameStatuses} from "./gameStatuses.js";

/**
 * @typedef {Object} PositionData
 * @property {number} x - Координата X.
 * @property {number} y - Координата Y.
 */

/**
 * @typedef {Object} PlayerData
 * @property {number} id - Идентификатор игрока (1 или 2).
 * @property {PositionData} position - Текущая позиция игрока.
 */

/**
 * @typedef {Object} EnemyData
 * @property {PositionData} position - Текущая позиция врага.
 */

/**
 * Прокси-модель клиента.
 * Хранит состояние игры, получаемое с сервера, и отправляет действия на сервер через WebSocket.
 */
export class ProxyModel {
    //Приватные свойства

    /**
     * Эмиттер событий для уведомления View об изменениях.
     * @type {EventEmitter}
     */
    #eventEmitter;

    /**
     * WebSocket-клиент для связи с сервером.
     * @type {WebSocket}
     */
    #ws;

    /**
     * Внутреннее состояние модели, синхронизированное с сервером.
     * @type {Object}
     */
    #state = {
        playerId: null, //Идентификатор игрока
        connectedPlayers: null, //Кол-во подключенных игроков
        isServerFull: false,
        status: GameStatuses.SETTINGS, //Статус игры
        gridSize: null, //Размер игрового поля
        pointsToWin: null, //Кол-во очков для победы
        attemptsToLose: null, // Кол-во попыток для проигрыша
        player1: null, //Игрок 1
        player2: null, //Игрок 2
        enemy: null, //Враг
        score: null, //Счет
        attempts: null, //Попытки
    };

    /**
     * Создает экземпляр ProxyModel и устанавливает соединение с сервером.
     * @param {EventEmitter} eventEmitter - Эмиттер для оповещения об изменениях.
     */
    constructor(eventEmitter) {
        this.#eventEmitter = eventEmitter;
        this.#ws = new WebSocket("wss://tag-team.onrender.com");

        this.#ws.addEventListener("message", event => {
            const data = JSON.parse(event.data);

            if (data.type === "error" && data.payload.reason === "SERVER_FULL") {
                this.#state.serverFull = true;
                this.#eventEmitter.emit("change");
                return;
            }

            if (data.type === "error") return;

            this.#state = data;
            this.#eventEmitter.emit("change");
        });

        this.#ws.addEventListener("close", event => {
            if (event.code === 1008) {
                this.#state.serverFull = true;
                this.#eventEmitter.emit("change");
            }
        });
    }

    //Публичные свойства

    /**
     * Получить идентификатор текущего игрока.
     * @returns {number|null} ID игрока (1 или 2) или null, если еще не подключен.
     */
    get playerId() {
        return this.#state.playerId;
    }

    /**
     * Получить количество подключенных игроков.
     * @returns {number} Количество игроков (по умолчанию 1).
     */
    get connectedPlayers() {
        return this.#state.connectedPlayers || 1;
    }

    //Задать статус игры (заглушка, статус приходит только с сервера)
    set status(status) {}

    /**
     * Получить текущий статус игры.
     * @returns {string} Статус из GameStatuses.
     */
    get status() {
        return this.#state.status;
    }

    /**
     * Задать размер игрового поля локально (перед отправкой на сервер).
     * @param {{columns: number, rows: number}} gridSize - Размеры поля.
     */
    set gridSize(gridSize) {
        this.#state.gridSize = gridSize;
    }

    /**
     * Получить размер игрового поля.
     * @returns {{columns: number, rows: number}|null} Размеры поля.
     */
    get gridSize() {
        return this.#state.gridSize;
    }

    /**
     * Задать кол-во очков для победы локально.
     * @param {number} pointsToWin - Кол-во очков.
     */
    set pointsToWin(pointsToWin) {
        this.#state.pointsToWin = pointsToWin;
    }

    /**
     * Получить кол-во очков для победы.
     * @returns {number|null} Кол-во очков.
     */
    get pointsToWin() {
        return this.#state.pointsToWin;
    }

    /**
     * Задать кол-во попыток для проигрыша локально.
     * @param {number} attemptsToLose - Кол-во попыток.
     */
    set attemptsToLose(attemptsToLose) {
        this.#state.attemptsToLose = attemptsToLose;
    }

    /**
     * Получить кол-во попыток для проигрыша.
     * @returns {number|null} Кол-во попыток.
     */
    get attemptsToLose() {
        return this.#state.attemptsToLose;
    }

    /**
     * Получить данные Игрока 1.
     * @returns {PlayerData|null} Данные игрока или null, если игра не запущена.
     */
    get player1() {
        return this.#state.player1;
    }

    /**
     * Получить данные Игрока 2.
     * @returns {PlayerData|null} Данные игрока или null, если игра не запущена.
     */
    get player2() {
        return this.#state.player2;
    }

    /**
     * Получить данные Врага.
     * @returns {EnemyData|null} Данные врага или null, если игра не запущена.
     */
    get enemy() {
        return this.#state.enemy;
    }

    /**
     * Получить текущий счет игры.
     * @returns {{1: number, 2: number}|null} Объект со счетом игроков.
     */
    get score() {
        return this.#state.score;
    }

    /**
     * Получить текущее количество попыток.
     * @returns {number|null} Количество попыток.
     */
    get attempts() {
        return this.#state.attempts;
    }

    /**
     * Получить эмиттер событий.
     * @returns {EventEmitter}
     */
    get eventEmitter() {
        return this.#eventEmitter;
    }

    //Публичные методы

    /**
     * Отправляет на сервер запрос на перемещение игрока.
     * Проверяет, что игрок ходит именно за своего персонажа.
     *
     * @param {PlayerData} player - Объект игрока, которым хотят походить.
     * @param {'LEFT'|'RIGHT'|'UP'|'DOWN'} direction - Направление движения.
     */
    movePlayer(player, direction) {
        if (player.id === this.#state.playerId) {
            this.#ws.send(
                JSON.stringify({
                    type: "movePlayers",
                    payload: {
                        playerId: player.id,
                        direction,
                    },
                }),
            );
        }
    }

    /**
     * Отправляет команду на старт игры с текущими настройками.
     */
    start() {
        if (this.#ws.readyState !== WebSocket.OPEN) return;

        this.#ws.send(
            JSON.stringify({
                type: "start",
                payload: {
                    gridSize: this.#state.gridSize,
                    pointsToWin: this.#state.pointsToWin,
                    attemptsToLose: this.#state.attemptsToLose,
                },
            }),
        );
    }

    /**
     * Отправляет команду на остановку игры.
     */
    stop() {
        if (this.#ws.readyState !== WebSocket.OPEN) return;

        this.#ws.send(
            JSON.stringify({
                type: "stop",
            }),
        );
    }
}