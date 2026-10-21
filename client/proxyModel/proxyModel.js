import {GameStatuses} from "../../shared/gameStatuses.js";

//Класс Прокси-модель
export class ProxyModel {
    #eventEmitter; //Эмиттер событий
    #ws; //Клиент веб-сокета

    //Состояние
    #state = {
        playerId: null, //Идентификатор игрока
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
        this.#ws = new WebSocket("ws://localhost:3001");

        this.#ws.addEventListener("message", event => {
            this.#state = JSON.parse(event.data);
            this.#eventEmitter.emit("change");
        });
    }

    //Получить идентификатор игрока
    get playerId() {
        return this.#state.playerId;
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

    //Задать кол-во попыток для проигрыша
    set attemptsToLose(attemptsToLose) {
        this.#state.attemptsToLose = attemptsToLose;
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

    //Переместить игрока
    movePlayers(player, direction) {
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
        this.#ws.send(
            JSON.stringify({
                type: "stop",
            }),
        );
    }
}
