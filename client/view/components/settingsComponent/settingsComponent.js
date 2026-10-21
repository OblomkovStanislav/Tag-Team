import {ButtonComponent} from "../buttonComponent/buttonComponent.js";
import {GameStatuses} from "../../../../shared/gameStatuses.js";
import {BurgerMenuComponent} from "../burgerMenuComponent/burgerMenuComponent.js";

//Класс Компонент Настройки
export class SettingsComponent {
    //Отрисовать компонент
    render(model, callbacks) {
        const settingsComponent = document.createElement("div");
        settingsComponent.classList.add("settings-component");
        const disabled = model.status !== GameStatuses.SETTINGS;

        //Компонент Бургер-меню
        const burgerMenuComponent = new BurgerMenuComponent();

        settingsComponent.appendChild(burgerMenuComponent.render(disabled));

        //Компонент Кнопка Старт
        const startButtonComponent = new ButtonComponent("НАЧАТЬ ИГРУ", "button start-button", callbacks.onStart);

        //Компонент Кнопка Стоп
        const stopButtonComponent = new ButtonComponent("ЗАВЕРШИТЬ ИГРУ", "button stop-button", callbacks.onStop);

        settingsComponent.appendChild(
            model.status === GameStatuses.SETTINGS ? startButtonComponent.render() : stopButtonComponent.render(),
        );

        return settingsComponent;
    }
}
