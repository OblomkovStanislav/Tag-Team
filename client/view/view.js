import {GridComponent} from "./components/gridComponent/gridComponent.js";
import {SettingsComponent} from "./components/settingsComponent/settingsComponent.js";
import {ResultBlockComponent} from "./components/resultBlockComponent/resultBlockComponent.js";
import {ModalComponent} from "./components/modalComponent/modalComponent.js";
import {GameStatuses} from "../proxyModel/gameStatuses.js";
import {ToggleSoundComponent} from "./components/toggleSoundComponent/toggleSoundComponent.js";
import {MessageComponent} from "./components/messageComponent/messageComponent.js";

//Класс Вид
export class View {
    //Приватные методы

    //Задать настройки
    #setSettings(model) {
        let gridSizeValue = "0"; //Размер сетки

        if (model.gridSize)
            if (model.gridSize.columns === 4 && model.gridSize.rows === 4) gridSizeValue = "0";
            else if (model.gridSize.columns === 5 && model.gridSize.rows === 5) gridSizeValue = "1";
            else if (model.gridSize.columns === 6 && model.gridSize.rows === 6) gridSizeValue = "2";

        document.getElementById("grid-size").value = gridSizeValue;

        if (model.pointsToWin) document.getElementById("points-to-win").value = model.pointsToWin;
        if (model.attemptsToLose) document.getElementById("attempts-to-lose").value = model.attemptsToLose;
    }

    //Получить настройки
    getSettings() {
        const gridSizeValue = document.getElementById("grid-size").value;

        const gridSizes = {
            0: {columns: 4, rows: 4},
            1: {columns: 5, rows: 5},
            2: {columns: 6, rows: 6},
        };

        return {
            gridSize: gridSizes[gridSizeValue],
            pointsToWin: Number(document.getElementById("points-to-win").value),
            attemptsToLose: Number(document.getElementById("attempts-to-lose").value),
        };
    }

    //Публичные методы

    //Отрисовать вид
    render(model, isMute, callbacks) {
        //Корневой элемент
        const rootElement = document.getElementById("root");
        rootElement.innerHTML = "";

        if (model.isServerFull) {
            const messageComponent = new MessageComponent("Извините, сервер переполнен!");
            rootElement.appendChild(messageComponent.render());

            return;
        }

        //Компонент Переключатель звука
        const toggleSoundComponent = new ToggleSoundComponent("Звук");
        rootElement.appendChild(toggleSoundComponent.render(isMute, callbacks.onMute));

        //Компонент Настройки
        if (model.playerId === 1) {
            if (model.connectedPlayers === 2) {
                const settingsComponent = new SettingsComponent();
                rootElement.appendChild(settingsComponent.render(model, callbacks));

                this.#setSettings(model);
            }
            else {
                const messageComponent = new MessageComponent("Ожидаем, когда подключится второй игрок...");
                rootElement.appendChild(messageComponent.render());
            }
        }
        else if (model.playerId === 2 && model.status === GameStatuses.SETTINGS) {
            const messageComponent = new MessageComponent("Ожидаем, когда первый игрок начнет игру...");
            rootElement.appendChild(messageComponent.render());
        }

        //Контейнер для компонентов с результатами
        const resulContainerElement = document.createElement("div");
        resulContainerElement.classList.add("result-container");

        //Компонент Блока с результатами счета
        const scoreResultBlockComponent = new ResultBlockComponent("Поймано: ");

        if (model.score)
            resulContainerElement.appendChild(
                scoreResultBlockComponent.render(String(Number(model.score["1"]) + Number(model.score["2"]))),
            );

        //Компонент Блока с результатами попыток
        const attemptsResultBlockComponent = new ResultBlockComponent("Попыток: ");
        resulContainerElement.appendChild(attemptsResultBlockComponent.render(model.attempts));

        rootElement.appendChild(resulContainerElement);

        switch (model.status) {
            case GameStatuses.IN_PROGRESS:
                const gridComponent = new GridComponent(
                    "./assets/img/icons/goose.svg",
                    "./assets/img/icons/man01.svg",
                    "./assets/img/icons/man02.svg",
                );

                rootElement.appendChild(gridComponent.render(model));

                break;

            case GameStatuses.WIN:
                const modalWin = new ModalComponent(
                    "./assets/img/icons/winner.svg",
                    "Вы победили!",
                    "Поздравляем!",
                    callbacks.onStop,
                );

                rootElement.appendChild(
                    modalWin.render(String(Number(model.score["1"]) + Number(model.score["2"])), model.attempts),
                );

                break;
            case GameStatuses.LOSS:
                const modalLoss = new ModalComponent(
                    "./assets/img/icons/loss.svg",
                    "Вы проиграли!",
                    "Попробуйте еще раз...",
                    callbacks.onStop,
                );

                rootElement.appendChild(
                    modalLoss.render(String(Number(model.score["1"]) + Number(model.score["2"])), model.attempts),
                );

                break;
        }
    }
}
