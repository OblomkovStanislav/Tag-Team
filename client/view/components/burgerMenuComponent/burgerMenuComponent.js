import {SelectorComponent} from "../selectorComponent/selectorComponent.js";

//Класс Компонент Бургер-меню
export class BurgerMenuComponent {
    //Отрисовать компонент
    render(disabled) {
        const burgerMenuComponent = document.createElement("div");
        burgerMenuComponent.classList.add("navbar");

        if (disabled) burgerMenuComponent.classList.add("hide-on-mobile");

        burgerMenuComponent.innerHTML = `
        <div class="menu-wrapper">
                        <input type="checkbox" id="menu-checkbox">
                        <label for="menu-checkbox" class="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </label>
                        <ul id="menu-items"></ul>
                    </div>
        `;

        //Элемент Список меню
        const ulElement = burgerMenuComponent.querySelector("#menu-items");

        //Элемент Пункт мню с настройкой размера сетки
        const liGridSizeElement = document.createElement("li");

        //Компонент с выпадающим списком размеров сетки
        const gridSizeSelectorComponent = new SelectorComponent("grid-size", "Размер игрового поля", disabled, [
            {value: "0", text: "4X4"},
            {value: "1", text: "5X5"},
            {value: "2", text: "6X6"},
        ]);

        liGridSizeElement.appendChild(gridSizeSelectorComponent.render());
        ulElement.appendChild(liGridSizeElement);

        //Элемент Пункт меню с настройкой кол-ва очков для победы
        const liPointsToWinElement = document.createElement("li");

        //Компонент с выпадающим списком кол-ва очков для победы
        const pointsToWinSelectorComponent = new SelectorComponent("points-to-win", "Очков для победы", disabled, [
            {value: 3, text: "3"},
            {value: 6, text: "6"},
            {value: 9, text: "9"},
        ]);

        liPointsToWinElement.appendChild(pointsToWinSelectorComponent.render());
        ulElement.appendChild(liPointsToWinElement);

        //Элемент Пункт меню с настройкой кол-ва попыток для проигрыша
        const liAttemptsToLosElement = document.createElement("li");

        //Компонент с выпадающим списком кол-ва попыток для проигрыша
        const attemptsToLoseSelectorComponent = new SelectorComponent(
            "attempts-to-lose",
            "Попыток для проигрыша",
            disabled,
            [
                {value: 6, text: "6"},
                {value: 9, text: "9"},
                {value: 12, text: "12"},
            ],
        );

        liAttemptsToLosElement.appendChild(attemptsToLoseSelectorComponent.render());
        ulElement.appendChild(liAttemptsToLosElement);

        return burgerMenuComponent;
    }
}
