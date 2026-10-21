//Класс Компонент Блок результатов
export class ResultBlockComponent {
    #title; //Заголовок

    //Конструктор класса
    constructor(title) {
        this.#title = title;
    }

    //Отрисовать компонент
    render(value) {
        const resultBlockComponent = document.createElement("div");

        //Элемент Заголовок
        const titleResultBlockElement = document.createElement("span");
        titleResultBlockElement.classList.add("title-result-block-element");
        titleResultBlockElement.textContent = this.#title;

        resultBlockComponent.appendChild(titleResultBlockElement);

        //Элемент Значение
        const valueResultBlockElement = document.createElement("span");
        valueResultBlockElement.classList.add("value-result-block-element");
        valueResultBlockElement.textContent = value;

        resultBlockComponent.appendChild(valueResultBlockElement);

        return resultBlockComponent;
    }
}
