//Класс Прокси-модель
import {GameStatuses} from "./gameStatuses.js";

export class ProxyModel {
    //Приватные свойства

    #eventEmitter; //Эмиттер событий
    #ws; //Клиент веб-сокета

    //Состояние
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

    //Конструктор класса
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

    //Получить идентификатор игрока
    get playerId() {
        return this.#state.playerId;
    }

    //Получить кол-во подключенных игроков
    get connectedPlayers() {
        return this.#state.connectedPlayers || 1;
    }

    //Задать статус игры
    set status(status) {}

    //Получить статус игры
    get status() {
        return this.#state.status;
    }

    //Задать размер игрового поля
    set gridSize(gridSize) {
        this.#state.gridSize = gridSize;
    }

    //Получить размер игрового поля
    get gridSize() {
        return this.#state.gridSize;
    }

    //Задать кол-во очков для победы
    set pointsToWin(pointsToWin) {
        this.#state.pointsToWin = pointsToWin;
    }

    //Получить кол-во очков для победы
    get pointsToWin() {
        return this.#state.pointsToWin;
    }

    //Задать кол-во попыток для проигрыша
    set attemptsToLose(attemptsToLose) {
        this.#state.attemptsToLose = attemptsToLose;
    }

    //Получить кол-во попыток для проигрыша
    get attemptsToLose() {
        return this.#state.attemptsToLose;
    }

    //Получить игрока 1
    get player1() {
        return this.#state.player1;
    }

    //Получить игрока 2
    get player2() {
        return this.#state.player2;
    }

    //Получить врага
    get enemy() {
        return this.#state.enemy;
    }

    //Получить счет
    get score() {
        return this.#state.score;
    }

    //Получить попытки
    get attempts() {
        return this.#state.attempts;
    }

    //Получить эмиттер событий
    get eventEmitter() {
        return this.#eventEmitter;
    }

    //Публичные методы

    //Переместить игрока
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

    //Старт
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

    //Стоп
    stop() {
        if (this.#ws.readyState !== WebSocket.OPEN) return;

        this.#ws.send(
            JSON.stringify({
                type: "stop",
            }),
        );
    }
}
