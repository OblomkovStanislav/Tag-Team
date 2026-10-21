//Класс Unit
export class Unit {
    #position; //Позиция Unit

    //Конструктор класса
    constructor(position) {
        this.#position = position;
    }

    //Задать позицию
    set position(position) {
        this.#position = position;
    }

    //Получить позицию
    get position() {
        return this.#position;
    }
}
