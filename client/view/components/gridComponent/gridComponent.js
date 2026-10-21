//Класс Компонент Сетка
export class GridComponent {
    #imgEnemy; //Изображение врага
    #imgPlayer1; //Изображение игрока 1
    #imgPlayer2; //Изображение игрока 2

    //Конструктор класса
    constructor(imgEnemy, imgPlayer1, imgPlayer2) {
        this.#imgEnemy = imgEnemy;
        this.#imgPlayer1 = imgPlayer1;
        this.#imgPlayer2 = imgPlayer2;
    }

    //Отрисовать компонент
    render(model) {
        const gridComponent = document.createElement("div");
        gridComponent.classList.add("grid-component");

        //Элемент сетки
        const GridElement = document.createElement("div");
        GridElement.classList.add("grid-element");

        GridElement.style.gridTemplateColumns = `repeat(${model.gridSize.columns}, 1fr)`;
        GridElement.style.gridTemplateRows = `repeat(${model.gridSize.rows}, 1fr)`;

        for (let y = 0; y < model.gridSize.rows; y++) {
            for (let x = 0; x < model.gridSize.columns; x++) {
                //Элемент Клетка элемента сетки
                const gridCellElement = document.createElement("div");
                gridCellElement.classList.add("grid-cell-element");

                if (model.enemy.position.x === x && model.enemy.position.y === y) {
                    const enemyElement = document.createElement("img");
                    enemyElement.src = this.#imgEnemy;
                    gridCellElement.appendChild(enemyElement);
                }

                if (model.player1.position.x === x && model.player1.position.y === y) {
                    const player1Element = document.createElement("img");
                    player1Element.src = this.#imgPlayer1;
                    gridCellElement.appendChild(player1Element);
                }

                if (model.player2.position.x === x && model.player2.position.y === y) {
                    const player2Element = document.createElement("img");
                    player2Element.src = this.#imgPlayer2;
                    gridCellElement.appendChild(player2Element);
                }

                GridElement.appendChild(gridCellElement);
            }
        }

        gridComponent.appendChild(GridElement);

        return gridComponent;
    }
}
