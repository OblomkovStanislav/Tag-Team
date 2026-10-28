import {GameStatuses} from "../../shared/gameStatuses.js";
import {Position} from "./position.js";
import {Player} from "./player.js";
import {Enemy} from "./enemy.js";

/**
 * Основной класс игры.
 * Хранит состояние игрового поля, юнитов, очков и таймеров.
 */
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
        attemptsToLose: 6, //кол-во попыток для проигрыша
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

    /**
     * Создает экземпляр игры.
     * @param {NumberUtility} numberUtility - Утилита для генерации случайных чисел.
     * @param {EventEmitter} eventEmitter - Эмиттер для оповещения об изменениях состояния.
     */
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

    /**
     * Устанавливает новые размеры игрового поля.
     * @param {Object} size - Объект с размерами.
     * @param {number} size.columns - Количество колонок.
     * @param {number} size.rows - Количество строк.
     */
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

    /**
     * Генерирует случайную свободную позицию на поле.
     * Если сгенерированная позиция занята одной из переданных Units,
     * функция вызывается рекурсивно, пока не найдет свободную.
     *
     * @param {Array<Position>} [positionsUnits] - Массив позиций, которые нужно избегать.
     * @returns {Position} Новая свободная позиция.
     */
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

    /**
     * Перемещает врага на новую случайную позицию.
     * @param {Position} firstPlayerPosition - Позиция первого игрока.
     * @param {Position} secondPlayerPosition - Позиция второго игрока.
     * @param {Position} [enemyPosition] - Текущая позиция врага (чтобы не остаться на месте).
     * @returns {Position} Новая позиция врага.
     */
    #moveEnemy(firstPlayerPosition, secondPlayerPosition, enemyPosition) {
        let newEnemyPosition;

        if (enemyPosition === undefined)
            newEnemyPosition = this.#getRandomPosition([firstPlayerPosition, secondPlayerPosition]);
        else newEnemyPosition = this.#getRandomPosition([firstPlayerPosition, secondPlayerPosition, enemyPosition]);

        return newEnemyPosition;
    }

    /**
     * Создает новых игроков и врага в начале игры.
     * Расставляет их на случайные свободные позиции.
     */
    #createUnits() {
        this.#player1 = new Player(1, this.#getRandomPosition(undefined));
        this.#player2 = new Player(2, this.#getRandomPosition([this.#player1.position]));
        this.#enemy = new Enemy(this.#moveEnemy(this.#player1.position, this.#player2.position));
        this.#eventEmitter.emit("change");
    }

    /**
     * Запускает интервал, с которым враг прыгает по полю.
     * На каждом тике увеличивает счетчик попыток. Если попытки кончились —
     * меняет статус на LOSS и останавливает таймер.
     */
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

    /**
     * Вычисляет координаты новой позиции игрока после шага.
     * @param {Position} playerPosition - Текущая позиция игрока.
     * @param {'LEFT'|'RIGHT'|'UP'|'DOWN'} direction - Направление движения.
     * @returns {Position} Новая позиция после шага.
     */
    #calculateNewPosition(playerPosition, direction) {
        const move = {
            LEFT: {x: -1, y: 0},
            RIGHT: {x: +1, y: 0},
            UP: {x: 0, y: -1},
            DOWN: {x: 0, y: +1},
        };

        return new Position(playerPosition.x + move[direction].x, playerPosition.y + move[direction].y);
    }

    /**
     * Проверяет, не выходит ли новая позиция за границы поля.
     * @param {Position} newPlayerPosition - Проверяемая позиция.
     * @param {{columns: number, rows: number}} gridSize - Размеры поля.
     * @returns {boolean} true, если позиция в пределах поля.
     */
    #checkBorders(newPlayerPosition, gridSize) {
        const {columns, rows} = gridSize;

        return (
            newPlayerPosition.x >= 0 &&
            newPlayerPosition.x < columns &&
            newPlayerPosition.y >= 0 &&
            newPlayerPosition.y < rows
        );
    }

    /**
     * Проверяет, не столкнулся ли игрок с другим игроком.
     * @param {Position} newPlayerPosition - Новая позиция шагающего игрока.
     * @param {Position} otherPlayerPosition - Позиция другого игрока.
     * @returns {boolean} true, если клетка свободна от другого игрока.
     */
    #checkOtherPlayer(newPlayerPosition, otherPlayerPosition) {
        return !otherPlayerPosition.equal(newPlayerPosition);
    }

    /**
     * Обрабатывает условие победы или перемещает врага.
     * Если сумма очков достигает цели, останавливает таймер и ставит WIN.
     * В противном случае просто спавнит врага в новом месте.
     */
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

    /**
     * Проверяет, поймал ли игрок врага.
     * Если позиции совпали, начисляет очко и вызывает обработчик победы/респавна.
     * @param {number} playerId - ID игрока (1 или 2).
     * @param {Position} newPlayerPosition - Позиция, куда шагнул игрок.
     */
    #handleEnemyCapture(playerId, newPlayerPosition) {
        if (newPlayerPosition.equal(this.#enemy.position)) {
            this.#score[playerId]++;
            this.#handleWinOrRespawnEnemy();
        }
    }

    //Публичные методы

    /**
     * Перемещает игрока в указанном направлении.
     * Проверяет границы поля и столкновение с другим игроком.
     * @param {Player} player - Объект игрока.
     * @param {'LEFT'|'RIGHT'|'UP'|'DOWN'} direction - Направление движения.
     */
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

    /**
     * Запускает игру. Создает юнитов, обнуляет очки,
     * устанавливает статус IN_PROGRESS и запускает таймер врага.
     */
    start() {
        this.#createUnits();
        this.#status = GameStatuses.IN_PROGRESS;
        this.#score["1"] = 0;
        this.#score["2"] = 0;
        this.#runEnemyJumpInterval();
        this.#eventEmitter.emit("change");
    }

    /**
     * Останавливает игру. Сбрасывает таймер, удаляет юнитов,
     * обнуляет очки и возвращает статус в SETTINGS.
     */
    stop() {
        clearInterval(this.#enemySetIntervalId);
        this.#status = GameStatuses.SETTINGS;
        this.#player1 = undefined;
        this.#player2 = undefined;
        this.#enemy = undefined;
        this.#score["1"] = 0;
        this.#score["2"] = 0;
        this.#attempts = 0;
        this.#eventEmitter.emit("change");
    }
}