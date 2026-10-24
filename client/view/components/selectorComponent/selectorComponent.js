//Класс Компонент Выпадающий список
export class SelectorComponent {
    #id; //Идентификатор
    #label; //Надпись
    #disabled; //Флаг активности
    #options; //Опции
    #value; //Значение

    constructor(id, label, disabled, options, value) {
        this.#id = id;
        this.#label = label;
        this.#disabled = disabled;
        this.#options = options;
        this.#value = value;
    }

    //Отрисовать компонент
    render() {
        const selectorComponent = document.createElement("div");
        selectorComponent.classList.add("selector-component");

        //Элемент Надпись
        const labelSelectElement = document.createElement("label");
        labelSelectElement.classList.add("label-selector-element");
        labelSelectElement.textContent = this.#label;

        selectorComponent.appendChild(labelSelectElement);

        //Элемент компонента с выпадающим списком
        const selectSelectorElement = document.createElement("select");
        selectSelectorElement.id = this.#id;
        selectSelectorElement.classList.add("select-selector-element");
        selectSelectorElement.name = "select";
        selectSelectorElement.value = this.#value;
        selectSelectorElement.disabled = this.#disabled;

        this.#options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.text;
            selectSelectorElement.appendChild(option);
        });

        selectorComponent.appendChild(selectSelectorElement);

        return selectorComponent;
    }
}
