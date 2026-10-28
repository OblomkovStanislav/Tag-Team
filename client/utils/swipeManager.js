/**
 * Менеджер свайпов для мобильных устройств.
 * Отслеживает касания экрана и определяет направление свайпа.
 * Защищает от множественных срабатываний за одно касание.
 */
export class SwipeManager {
    //Приватные свойства

    /**
     * Функция-колбэк, которая вызывается при успешном свайпе.
     * @type {SwipeCallback}
     */
    #onSwipe;

    /**
     * Координата X начала касания.
     * @type {number}
     */
    #touchStartX = 0;

    /**
     * Координата Y начала касания.
     * @type {number}
     */
    #touchStartY = 0;

    /**
     * Минимальное расстояние (в пикселях), которое палец должен преодолеть,
     * чтобы это засчиталось как свайп, а не как обычный клик.
     * @type {number}
     */
    #minSwipeDistance = 20;

    /**
     * Флаг, показывающий, что свайп уже был обработан.
     * Нужен, чтобы за одно движение пальцем не произошло несколько шагов.
     * @type {boolean}
     */
    #isSwiping = false;

    /**
     * Создает экземпляр SwipeManager.
     * @param {SwipeCallback} onSwipe - Функция, вызываемая при свайпе. Принимает направление ('LEFT', 'RIGHT', 'UP', 'DOWN').
     */
    constructor(onSwipe) {
        this.#onSwipe = onSwipe;
    }

    //Приватные методы

    /**
     * Проверяет, было ли касание по интерактивному элементу (кнопка, инпут, меню).
     * Если да — свайп игнорируется, чтобы не мешать нажимать на кнопки.
     *
     * @param {EventTarget} target - Элемент, по которому произошло касание.
     * @returns {boolean} true, если элемент интерактивный.
     */
    #isInteractiveElement(target) {
        return target.closest("button, input, .settings-container");
    }

    /**
     * Обработчик начала касания.
     * Запоминает стартовые координаты.
     * @param {TouchEvent} e - Событие касания.
     */
    #handleTouchStart = e => {
        if (this.#isInteractiveElement(e.target)) return;
        if (this.#isSwiping) return;

        this.#touchStartX = e.changedTouches[0].clientX;
        this.#touchStartY = e.changedTouches[0].clientY;
    };

    /**
     * Обработчик движения пальца.
     * Вычисляет разницу координат и определяет направление свайпа.
     * @param {TouchEvent} e - Событие касания.
     */
    #handleTouchMove = e => {
        if (this.#isInteractiveElement(e.target)) return;
        if (this.#isSwiping) return;

        const diffX = e.changedTouches[0].clientX - this.#touchStartX;
        const diffY = e.changedTouches[0].clientY - this.#touchStartY;

        if (Math.abs(diffX) > this.#minSwipeDistance || Math.abs(diffY) > this.#minSwipeDistance) {
            /** @type {'LEFT'|'RIGHT'|'UP'|'DOWN'} */
            let direction;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                direction = diffX > 0 ? "RIGHT" : "LEFT";
            } else {
                direction = diffY > 0 ? "DOWN" : "UP";
            }

            this.#onSwipe(direction);
            this.#isSwiping = true; // Блокируем дальнейшие свайпы до отрыва пальца
        }
    };

    /**
     * Обработчик окончания касания (палец оторван).
     * Сбрасывает флаг, разрешая следующий свайп.
     */
    #handleTouchEnd = () => {
        this.#isSwiping = false;
    };

    //Публичные методы

    /**
     * Инициализирует прослушивание событий касания на всем окне.
     * Использует {passive: true} для повышения производительности скролла на мобильных.
     */
    init() {
        window.addEventListener("touchstart", this.#handleTouchStart, {passive: true});
        window.addEventListener("touchmove", this.#handleTouchMove, {passive: true});
        window.addEventListener("touchend", this.#handleTouchEnd, {passive: true});
        window.addEventListener("touchcancel", this.#handleTouchEnd, {passive: true});
    }
}

/**
 * Функция-колбэк для обработки свайпа.
 * @callback SwipeCallback
 * @param {'LEFT'|'RIGHT'|'UP'|'DOWN'} direction - Направление свайпа.
 * @returns {void}
 */