//Класс Компонент Сообщение
export class MessageComponent {
    //Приватные свойства

    #message; //Сообщение

    //Конструктор класса
    constructor(message) {
        this.#message = message;
    }

    //Публичные методы

    //Отрисовать компонент
    render() {
        const messageComponent = document.createElement("div");
        messageComponent.classList.add("message-component");
        messageComponent.textContent = this.#message;

        return messageComponent;
    }
}