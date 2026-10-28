/**
 * Класс реализует паттерн "Наблюдатель" (Observer).
 * Позволяет подписываться на события, отписываться от них и вызывать их.
 */
export class EventEmitter {
    //Приватные свойства

    /**
     * Хранилище подписчиков.
     * Ключи — названия событий, значения — массивы функций-обработчиков.
     * @type {Object.<string, Function[]>}
     */
    #subscribers = {};

    //Публичные методы

    /**
     * Подписывает функцию-обработчик на определенное событие.
     *
     * @param {string} eventName - Название события (например, "change").
     * @param {Function} callback - Функция, которая будет вызвана при событии.
     * @returns {Function} Функция для отписки от этого события.
     */
    subscribe(eventName, callback) {
        if (!this.#subscribers[eventName]) this.#subscribers[eventName] = [];

        this.#subscribers[eventName].push(callback);

        return () => (this.#subscribers[eventName] = this.#subscribers[eventName]?.filter(cb => cb !== callback));
    }

    /**
     * Псевдоним (алиас) для метода subscribe.
     * Создан для привычного API в стиле браузерных событий.
     *
     * @param {string} eventName - Название события.
     * @param {Function} callback - Функция-обработчик.
     */
    addEventListener(eventName, callback) {
        this.subscribe(eventName, callback);
    }

    /**
     * Отписывает функцию-обработчик от события.
     *
     * @param {string} eventName - Название события.
     * @param {Function} callback - Функция, которую нужно удалить.
     */
    removeEventListener(eventName, callback) {
        this.#subscribers[eventName] = this.#subscribers[eventName]?.filter(cb => cb !== callback);
    }

    /**
     * Вызывает событие, запуская все подписанные на него функции.
     *
     * @param {string} eventName - Название события.
     * @param {*} [data] - Необязательные данные, которые будут переданы в callback.
     */
    emit(eventName, data) {
        this.#subscribers[eventName]?.forEach(callback => callback(data));
    }
}