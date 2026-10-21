import {ResultBlockComponent} from "../resultBlockComponent/resultBlockComponent.js";
import {ButtonComponent} from "../buttonComponent/buttonComponent.js";

//Класс Компонент Модальное окно
export class ModalComponent {
    #srcIcon; //Иконка
    #title; //Заголовок
    #text; //Текст
    #clickHandler; //Обратный вызов функции на событие "click"

    constructor(srcIcon, title, text, clickHandler) {
        this.#srcIcon = srcIcon;
        this.#title = title;
        this.#text = text;
        this.#clickHandler = clickHandler;
    }

    //Отрисовать компонент
    render(score, attempts) {
        const modalComponent = document.createElement("div");
        modalComponent.classList.add("modal-component");

        //Декоративный элемент
        const decorationModalElement = document.createElement("div");
        decorationModalElement.classList.add("decoration-modal-element");

        //Элемент Изображение декоративного элемента
        const modalDecorationImageElement = document.createElement("img");
        modalDecorationImageElement.src = this.#srcIcon;

        decorationModalElement.appendChild(modalDecorationImageElement);
        modalComponent.appendChild(decorationModalElement);

        //Элемент модального окна
        const modalElements = document.createElement("div");
        modalElements.classList.add("modal-elements");

        //Элемент Фон элемента модального окна
        const backgroundIconModalElement = document.createElement("div");
        backgroundIconModalElement.classList.add("background-icon-modal-element");

        modalElements.prepend(backgroundIconModalElement);

        //Элемент Заголовок элемента модального окна
        const titleModalElement = document.createElement("div");
        titleModalElement.textContent = this.#title;
        titleModalElement.classList.add("title-modal-element");

        modalElements.appendChild(titleModalElement);

        //Элемент Текст элемента модального окна
        const textModalElement = document.createElement("div");
        textModalElement.textContent = this.#text;
        textModalElement.classList.add("text-modal-element");

        modalElements.appendChild(textModalElement);

        //Элемент Результат элемента модального окна
        const resultModalElement = document.createElement("div");
        resultModalElement.classList.add("result-modal-element");

        //Компонент Блок с результатами счета
        const scoreResultBlockComponent = new ResultBlockComponent("Поймано: ");
        resultModalElement.appendChild(scoreResultBlockComponent.render(score));

        //Компонент Блок с результатами попыток
        const attemptsResultBlockComponent = new ResultBlockComponent("Попыток: ");
        resultModalElement.appendChild(attemptsResultBlockComponent.render(attempts));

        modalElements.appendChild(resultModalElement);

        //Компонент Кнопка "Играть снова"
        const playAgainButtonComponent = new ButtonComponent("Ок", "button", this.#clickHandler);
        modalElements.appendChild(playAgainButtonComponent.render());

        modalComponent.appendChild(modalElements);

        return modalComponent;
    }
}
