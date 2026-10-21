//Класс Компонент Переключатель звука
export class ToggleSoundComponent {
    #title; //Заголовок

    //Конструктор класса
    constructor(title) {
        this.#title = title;
    }

    //Отрисовать компонент
    render(isMute, onMute) {
        const toggleSoundComponent = document.createElement("div");
        toggleSoundComponent.classList.add("toggle-sound-component");

        //Элемент Надпись
        const labelElement = document.createElement("label");
        labelElement.textContent = this.#title;

        toggleSoundComponent.appendChild(labelElement);

        //Элемент Кнопка
        const buttonElement = document.createElement("button");

        if (!isMute) buttonElement.classList.add("on");
        else buttonElement.classList.remove("on");

        buttonElement.addEventListener("click", () => onMute());

        const spanElement = document.createElement("span");

        buttonElement.appendChild(spanElement);
        toggleSoundComponent.appendChild(buttonElement);

        return toggleSoundComponent;
    }
}
