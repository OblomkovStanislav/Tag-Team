//Класс Компонент Кнопка
export class ButtonComponent {
    #title; //Заголовок
    #style; //Стили
    #click; //Обратный вызов функции на событие "click"

    //Конструктор класса
    constructor(title, style, click) {
        this.#title = title;
        this.#style = style;
        this.#click = click;
    }

    //Отрисовать компонент
    render() {
        const buttonComponent = document.createElement("button");

        buttonComponent.textContent = this.#title;
        buttonComponent.className = this.#style;

        buttonComponent.addEventListener("click", this.#click);

        return buttonComponent;
    }
}
