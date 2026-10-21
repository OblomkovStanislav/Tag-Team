//Класс Позиция
export class Position {
    #x = 0; //Координата по оси X
    #y = 0; //Координата по оси Y

    //Конструктор класса
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    //Сравнить с другой позицией
    equal(otherPosition) {
        return this.#x === otherPosition.x && this.#y === otherPosition.y;
    }

    //Получить координату по оси X
    get x() {
        return this.#x;
    }

    //Получить координату по оси Y
    get y() {
        return this.#y;
    }
}
