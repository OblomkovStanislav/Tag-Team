//Класс Эмиттер событий
export class EventEmitter {
    #subscribers = {}; //Подписчики на события

    //Подписаться на событие
    subscribe(eventName, callback) {
        if (!this.#subscribers[eventName]) this.#subscribers[eventName] = [];

        this.#subscribers[eventName].push(callback);

        return () => (this.#subscribers[eventName] = this.#subscribers[eventName]?.filter(cb => cb !== callback));
    }

    //Добавить событие
    addEventListener(eventName, callback) {
        this.subscribe(eventName, callback);
    }

    //Удалить событие
    removeEventListener(eventName, callback) {
        this.#subscribers[eventName] = this.#subscribers[eventName]?.filter(cb => cb !== callback);
    }

    //Вызвать событие
    emit(eventName, data) {
        this.#subscribers[eventName]?.forEach(callback => callback(data));
    }
}
