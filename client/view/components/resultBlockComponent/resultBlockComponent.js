//Класс Компонент Блок результатов
export class ResultBlockComponent {
    //Отрисовать компонент
    render(imgEnemy, imgPlayer1, imgPlayer2, score, attempts) {
        const resultBlockComponent = document.createElement("div");
        resultBlockComponent.classList.add("result-block-component")

        const caughtSectionElement = document.createElement("div");
        caughtSectionElement.classList.add(".caught-section-element");

        const titleCaughtElement = document.createElement("span");
        titleCaughtElement.classList.add("title-result-block-element");
        titleCaughtElement.textContent = "ПОЙМАНО";

        caughtSectionElement.appendChild(titleCaughtElement);

        const playerListElement = document.createElement("div");
        playerListElement.classList.add("players-list-element");

        const player1ContainerElement = document.createElement("div");
        player1ContainerElement.classList.add("unit-container-element");

        const player1AvatarElement = document.createElement("img");
        player1AvatarElement.classList.add("unit-avatar-element");
        player1AvatarElement.src = imgPlayer1;

        const player1ScoreElement = document.createElement("span");
        player1ScoreElement.classList.add("value-result-block-element");
        player1ScoreElement.textContent = score["1"];

        player1ContainerElement.appendChild(player1AvatarElement);
        player1ContainerElement.appendChild(player1ScoreElement);

        playerListElement.appendChild(player1ContainerElement);

        const player2ContainerElement = document.createElement("div");
        player2ContainerElement.classList.add("unit-container-element");

        const player2AvatarElement = document.createElement("img");
        player2AvatarElement.classList.add("unit-avatar-element");
        player2AvatarElement.src = imgPlayer2;

        const player2ScoreElement = document.createElement("span");
        player2ScoreElement.classList.add("value-result-block-element");
        player2ScoreElement.textContent = score["2"];

        player2ContainerElement.appendChild(player2AvatarElement);
        player2ContainerElement.appendChild(player2ScoreElement);

        playerListElement.appendChild(player2ContainerElement);

        caughtSectionElement.appendChild(playerListElement);

        const attemptsSectionElement = document.createElement("div");
        attemptsSectionElement.classList.add("attempts-section-element");

        const titleAttemptsElement = document.createElement("span");
        titleAttemptsElement.classList.add("title-result-block-element");
        titleAttemptsElement.textContent = "ПОПЫТОК";

        attemptsSectionElement.appendChild(titleAttemptsElement);

        const enemyContainerElement = document.createElement("div");
        enemyContainerElement.classList.add("unit-container-element");

        const enemyAvatarElement = document.createElement("img");
        enemyAvatarElement.classList.add("unit-avatar-element");
        enemyAvatarElement.src = imgEnemy;

        const valueAttemptsElement = document.createElement("span");
        valueAttemptsElement.classList.add("value-result-block-element");
        valueAttemptsElement.textContent = attempts;

        enemyContainerElement.appendChild(enemyAvatarElement);
        enemyContainerElement.appendChild(valueAttemptsElement);

        attemptsSectionElement.appendChild(enemyContainerElement);

        resultBlockComponent.appendChild(caughtSectionElement);
        resultBlockComponent.appendChild(attemptsSectionElement);

        return resultBlockComponent;
    }
}
