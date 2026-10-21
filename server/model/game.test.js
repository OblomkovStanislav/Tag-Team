import {NumberUtility} from "./numberUtility.js";
import {GameStatuses} from "../../shared/gameStatuses.js";
import {Game} from "./game.js";
import {Position} from "./position.js";

describe("game", () => {
    it("Игра должна быть создана с корректными параметрами", async () => {
        const numberUtility = new NumberUtility();
        const game = new Game(numberUtility);
        game.gridSize = {columns: 4, rows: 5};

        await game.start();

        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
        expect(game.gridSize.columns).toBe(4);
        expect(game.gridSize.rows).toBe(5);
    });

    it("После запуска Google и игроки должны находиться в пределах игрового поля", async () => {
        const numberUtility = new NumberUtility();

        for (let i = 0; i < 1000; i++) {
            const game = new Game(numberUtility);

            await game.start();

            expect(game.google.position.x).toBeLessThan(game.gridSize.columns);
            expect(game.google.position.x).toBeGreaterThanOrEqual(0);
            expect(game.google.position.y).toBeLessThan(game.gridSize.rows);
            expect(game.google.position.y).toBeGreaterThanOrEqual(0);

            expect(game.player1.position.x).toBeLessThan(game.gridSize.columns);
            expect(game.player1.position.x).toBeGreaterThanOrEqual(0);
            expect(game.player1.position.y).toBeLessThan(game.gridSize.rows);
            expect(game.player1.position.y).toBeGreaterThanOrEqual(0);

            expect(game.player2.position.x).toBeLessThan(game.gridSize.columns);
            expect(game.player2.position.x).toBeGreaterThanOrEqual(0);
            expect(game.player2.position.y).toBeLessThan(game.gridSize.rows);
            expect(game.player2.position.y).toBeGreaterThanOrEqual(0);
        }
    });

    it("После прыжка Google должен переместиться на новую позицию в пределах игрового поля", async () => {
        const numberUtility = new NumberUtility();
        const game = new Game(numberUtility);

        game.googleJumpInterval = 1;
        await game.start();

        for (let i = 0; i < 100; i++) {
            const prevGooglePosition = game.google.position;
            await delay(1);
            const currentGooglePosition = game.google.position;
            expect(
                prevGooglePosition.x !== currentGooglePosition.x || prevGooglePosition.y !== currentGooglePosition.y,
            ).toBe(true);
        }
    });

    it("Игроки при перемещении не должны заходить за границы игрового поля и друг на друга", async () => {
        const numberUtility = new NumberUtility();
        const game = new Game(numberUtility);

        game.googleJumpInterval = 1;
        await game.start();

        game.player1.position = new Position(0, 0);
        game.player2.position = new Position(3, 3);

        game.movePlayers(game.player1, "LEFT");
        expect(game.player1.position.x).toBe(0);
        expect(game.player1.position.y).toBe(0);

        game.movePlayers(game.player1, "UP");
        expect(game.player1.position.x).toBe(0);
        expect(game.player1.position.y).toBe(0);

        game.movePlayers(game.player2, "RIGHT");
        expect(game.player2.position.x).toBe(3);
        expect(game.player2.position.y).toBe(3);

        game.movePlayers(game.player2, "DOWN");
        expect(game.player2.position.x).toBe(3);
        expect(game.player2.position.y).toBe(3);

        game.movePlayers(game.player1, "RIGHT");
        expect(game.player1.position.x).toBe(1);
        expect(game.player1.position.y).toBe(0);

        game.movePlayers(game.player1, "DOWN");
        expect(game.player1.position.x).toBe(1);
        expect(game.player1.position.y).toBe(1);

        game.movePlayers(game.player2, "LEFT");
        expect(game.player2.position.x).toBe(2);
        expect(game.player2.position.y).toBe(3);

        game.movePlayers(game.player2, "UP");
        expect(game.player2.position.x).toBe(2);
        expect(game.player2.position.y).toBe(2);

        game.movePlayers(game.player1, "RIGHT");
        expect(game.player1.position.x).toBe(2);
        expect(game.player1.position.y).toBe(1);

        game.movePlayers(game.player2, "UP");
        expect(game.player2.position.x).toBe(2);
        expect(game.player2.position.y).toBe(2);
    });

    it("После того, как один из игроков догнал Google у него увеличивается балл, а при достижении победного кол-ва баллов игра завершается победой игрока", async () => {
        const numberUtility = new NumberUtility();
        const game = new Game(numberUtility);

        game.googleJumpInterval = 1;
        await game.start();

        game.player1.position = new Position(0, 0);
        game.player2.position = new Position(3, 3);

        game.google.position = new Position(1, 0);
        game.movePlayers(game.player1, "RIGHT");
        expect(game.score["1"]).toBe(1);

        game.google.position = new Position(3, 2);
        game.movePlayers(game.player2, "UP");
        expect(game.score["2"]).toBe(1);

        game.google.position = new Position(3, 1);
        game.movePlayers(game.player2, "UP");
        expect(game.score["2"]).toBe(2);

        game.google.position = new Position(3, 0);
        game.movePlayers(game.player2, "UP");
        expect(game.score["2"]).toBe(3);
        expect(game.status).toBe(GameStatuses.WIN);
    });
});

const delay = ms => new Promise(res => setTimeout(res, ms));
