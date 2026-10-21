import {Unit} from "./unit.js";

//Класс Игрок наследуется от класса Unit
export class Player extends Unit {
    constructor(id, position) {
        super(position);
        this.id = id;
    }
}
