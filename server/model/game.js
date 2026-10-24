import {GameStatuses} from "../../shared/gameStatuses.js";
import {Position} from "./position.js";
import {Player} from "./player.js";
import {Enemy} from "./enemy.js";

//Класс Игра
export class Game {
    //Приватные свойства

    #status = GameStatuses.SETTINGS; //Статус игры

    //Настройки игры
    #settings = {
        //Размер игрового поля
        gridSize: {
            columns: 4,
            rows: 4,
        },

        pointsToWin: 3, //Кол-во очков для победы
        attemptsToLose: 1000, //кол-во попыток для проигрыша
        enemyJumpInterval: 1000, //Интервал между прыжками врага
    };

    #enemySetIntervalId; //Идентификатор интервала

    #player1; //Игрок №1
    #player2; //Игрок №2
    #enemy; //Враг

    //Очки
    #score = {
        1: 0,
        2: 0,
    };

    //Кол-во попыток
    #attempts = 0;

    #numberUtility; //Утилитарная функция для работы с числами
    #eventEmitter; //Эмиттер событий

    //Конструктор класса
    constructor(numberUtility, eventEmitter) {
        this.#numberUtility = numberUtility;
        this.#eventEmitter = eventEmitter;
    }

    //Публичные свойства

    //Задать статус игры
    set status(status) {
        return (this.#status = status);
    }

    //Получить статус игры
    get status() {
        return this.#status;
    }

    //Задать размер игрового поля
    set gridSize({columns, rows}) {
        this.#settings.gridSize.columns = columns;
        this.#settings.gridSize.rows = rows;
    }

    //Получить размер игрового поля
    get gridSize() {
        return this.#settings.gridSize;
    }

    //Задать кол-во очков для победы
    set pointsToWin(pointsToWin) {
        this.#settings.pointsToWin = pointsToWin;
    }

    //Получить кол-во очков для победы
    get pointsToWin() {
        return this.#settings.pointsToWin;
    }

    //Задать кол-во попыток для проигрыша
    set attemptsToLose(attemptsToLose) {
        this.#settings.attemptsToLose = attemptsToLose;
    }

    //Получить кол-во попыток для проигрыша
    get attemptsToLose() {
        return this.#settings.attemptsToLose;
    }

    //Получить игрока №1
    get player1() {
        return this.#player1;
    }

    //Получить игрока №2
    get player2() {
        return this.#player2;
    }

    //Получить врага
    get enemy() {
        return this.#enemy;
    }

    //Получить очки
    get score() {
        return this.#score;
    }

    //Получить количество попыток
    get attempts() {
        return this.#attempts;
    }

    //Получить эмиттер событий
    get eventEmitter() {
        return this.#eventEmitter;
    }

    //Приватные методы

    //Получить случайную позицию
    #getRandomPosition(positionsUnits) {
        const newRandomPosition = new Position(
            this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.columns),
            this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.rows),
        );

        if (!positionsUnits || positionsUnits.length === 0) return newRandomPosition;

        const isOccupied = positionsUnits.some(
            positionUnit => positionUnit.x === newRandomPosition.x && positionUnit.y === newRandomPosition.y,
        );

        if (isOccupied) return this.#getRandomPosition(positionsUnits);

        return newRandomPosition;
    }

    //Переместить врага
    #moveEnemy(firstPlayerPosition, secondPlayerPosition, enemyPosition) {
        let newEnemyPosition;

        if (enemyPosition === undefined)
            newEnemyPosition = this.#getRandomPosition([firstPlayerPosition, secondPlayerPosition]);
        else newEnemyPosition = this.#getRandomPosition([firstPlayerPosition, secondPlayerPosition, enemyPosition]);

        return newEnemyPosition;
    }

    //Создать Units
    #createUnits() {
        this.#player1 = new Player(1, this.#getRandomPosition(undefined));
        this.#player2 = new Player(2, this.#getRandomPosition([this.#player1.position]));
        this.#enemy = new Enemy(this.#moveEnemy(this.#player1.position, this.#player2.position));
        this.#eventEmitter.emit("change");
    }

    //Запустить интервал между прыжками врага
    #runEnemyJumpInterval() {
        this.#attempts = 0;

        this.#enemySetIntervalId = setInterval(() => {
            if (this.#status === GameStatuses.IN_PROGRESS) {
                this.#attempts++;

                if (this.#attempts >= this.#settings.attemptsToLose) {
                    this.#status = GameStatuses.LOSS;
                    clearInterval(this.#enemySetIntervalId);
                }

                this.#enemy.position = this.#moveEnemy(
                    this.#player1.position,
                    this.#player2.position,
                    this.#enemy.position,
                );

                this.#eventEmitter.emit("change");
            }
        }, this.#settings.enemyJumpInterval);
    }

    //Посчитать новую позицию игрока!!!
    #calculateNewPosition(playerPosition, direction) {
        const move = {
            LEFT: {x: -1, y: 0},
            RIGHT: {x: +1, y: 0},
            UP: {x: 0, y: -1},
            DOWN: {x: 0, y: +1},
        };

        return new Position(playerPosition.x + move[direction].x, playerPosition.y + move[direction].y);
    }

    //Проверить на столкновение игрока с границами поля
    #checkBorders(newPlayerPosition, gridSize) {
        const {columns, rows} = gridSize;

        return (
            newPlayerPosition.x >= 0 &&
            newPlayerPosition.x < columns &&
            newPlayerPosition.y >= 0 &&
            newPlayerPosition.y < rows
        );
    }

    //Проверить игрока на столкновение с другим игроком
    #checkOtherPlayer(newPlayerPosition, otherPlayerPosition) {
        return !otherPlayerPosition.equal(newPlayerPosition);
    }

    //Обработчик выйгрыша или перемещения врага
    #handleWinOrRespawnEnemy() {
        if (this.#score[1] + this.#score[2] >= this.#settings.pointsToWin) {
            clearInterval(this.#enemySetIntervalId);
            this.#status = GameStatuses.WIN;
        } else
            this.#enemy.position = this.#moveEnemy(
                this.#player1.position,
                this.#player2.position,
                this.#enemy.position,
            );
    }

    //Обработчик столкновения игрока с врагом - СОКРАТИТЬ
    #handleEnemyCapture(playerId, newPlayerPosition) {
        if (newPlayerPosition.equal(this.#enemy.position)) {
            this.#score[playerId]++;
            this.#handleWinOrRespawnEnemy();
        }
    }

    //Публичные методы

    //Переместить игроков
    movePlayer(player, direction) {
        const newPlayerPosition = this.#calculateNewPosition(player.position, direction);
        const checkingBorders = this.#checkBorders(newPlayerPosition, this.#settings.gridSize);
        const checkingOtherPlayer = this.#checkOtherPlayer(
            newPlayerPosition,
            player.id === 1 ? this.#player2.position : this.#player1.position,
        );

        if (
            checkingBorders &&
            checkingOtherPlayer &&
            this.#status !== GameStatuses.LOSS &&
            this.#status !== GameStatuses.WIN
        ) {
            this.#handleEnemyCapture(player.id, newPlayerPosition);
            player.position = newPlayerPosition;
            this.#eventEmitter.emit("change");
        }
    }

    //Старт игры
    start() {
        this.#createUnits();
        this.#status = GameStatuses.IN_PROGRESS;
        this.#score["1"] = 0;
        this.#score["2"] = 0;
        this.#runEnemyJumpInterval();
        this.#eventEmitter.emit("change");
    }

    //Стоп игры
    stop() {
        clearInterval(this.#enemySetIntervalId);
        this.#status = GameStatuses.SETTINGS;
        this.#score["1"] = 0;
        this.#score["2"] = 0;
        this.#attempts = 0;
        this.#eventEmitter.emit("change");
    }
}
