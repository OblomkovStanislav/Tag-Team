import {Unit} from "./unit.js";

//Класс Враг наследуется от класса Unit
export class Enemy extends Unit {
    constructor(position) {
        super(position);
    }
}
