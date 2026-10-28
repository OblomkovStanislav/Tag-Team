import {GridComponent} from "./components/gridComponent/gridComponent.js";
import {SettingsComponent} from "./components/settingsComponent/settingsComponent.js";
import {ResultBlockComponent} from "./components/resultBlockComponent/resultBlockComponent.js";
import {ModalComponent} from "./components/modalComponent/modalComponent.js";
import {GameStatuses} from "../proxyModel/gameStatuses.js";
import {MessageComponent} from "./components/messageComponent/messageComponent.js";
import {HeaderComponent} from "./components/headerComponent/headerComponent.js";

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

        if (model.pointsToWin !== null && model.pointsToWin !== undefined) document.getElementById("points-to-win").value = model.pointsToWin;
        if (model.attemptsToLose !== null && model.attemptsToLose !== undefined) document.getElementById("attempts-to-lose").value = model.attemptsToLose;
    }

    //Получить настройки
    getSettings() {
        const gridSizeValue = document.getElementById("grid-size").value;

        const gridSizes = {
            0: {columns: 4, rows: 4},
            1: {columns: 5, rows: 5},
            2: {columns: 6, rows: 6},
        };

        const pointsToWinValue = Number(document.getElementById("points-to-win").value);
        const attemptsToLoseValue = Number(document.getElementById("attempts-to-lose").value);

        return {
            gridSize: gridSizes[gridSizeValue],
            pointsToWin: (isNaN(pointsToWinValue) || pointsToWinValue === 0) ? 3 : pointsToWinValue,
            attemptsToLose: (isNaN(attemptsToLoseValue) || attemptsToLoseValue === 0) ? 6 : attemptsToLoseValue
        };
    }

    //Публичные методы

    //Отрисовать вид
    render(model, isMute, callbacks) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const imgEnemy = "./assets/img/icons/goose.svg";
        const imgPlayer1 = "./assets/img/icons/man01.svg";
        const imgPlayer2 = "./assets/img/icons/man02.svg";


        //Корневой элемент
        const rootElement = document.getElementById("root");
        rootElement.innerHTML = "";

        if (model.isServerFull) {
            const messageComponent = new MessageComponent("Извините, сервер переполнен!");
            rootElement.appendChild(messageComponent.render());

            return;
        }

        const headerComponent = new HeaderComponent();

        rootElement.appendChild(headerComponent.render(model.playerId === 1 ? imgPlayer1
            : model.playerId === 2 ? imgPlayer2
                : imgEnemy, isMute, callbacks.onMute));

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

        if (model.score !== null && model.attempts !== null) {
            const resultBlockComponent = new ResultBlockComponent();
            rootElement.appendChild(resultBlockComponent.render(imgEnemy, imgPlayer1, imgPlayer2, model.score, model.attempts));
        }

        switch (model.status) {
            case GameStatuses.IN_PROGRESS:
                const gridComponent = new GridComponent(imgEnemy, imgPlayer1, imgPlayer2);

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
                    modalWin.render(imgEnemy, imgPlayer1, imgPlayer2, model.score, model.attempts),
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
                    modalLoss.render(imgEnemy, imgPlayer1, imgPlayer2, model.score, model.attempts),
                );

                break;
        }
    }
}
