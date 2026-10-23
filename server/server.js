import {WebSocketServer} from "ws";
import {Game} from "./model/game.js";
import {NumberUtility} from "./model/numberUtility.js";
import {EventEmitter} from "./observer/observer.js";

const port = process.env.PORT || 3001;

const numberUtility = new NumberUtility();
const eventEmitter = new EventEmitter();
const game = new Game(numberUtility, eventEmitter);

const MAX_PLAYERS = 2; //Максимальное кол-во подключений
const activeChannels = new Map(); //Активные каналы

//Поиск свободного идентификатор пользователя
const findFreePlayerId = () => {
    for (let id = 1; id <= MAX_PLAYERS; id++) {
        if (!activeChannels.has(id)) return id;
    }

    return null;
};

//Создать объект передачи данных
const createDTO = playerId => {
    const hasUnit = game.player1 && game.player2 && game.enemy; //Флаг наличия всех Units

    return {
        playerId: playerId,
        status: game.status,
        gridSize: game.gridSize,
        pointsToWin: game.pointsToWin,
        attemptsToLose: game.attemptsToLose,
        player1: hasUnit
            ? {
                  id: game.player1.id,
                  position: {
                      x: game.player1.position.x,
                      y: game.player1.position.y,
                  },
              }
            : null,

        player2: hasUnit
            ? {
                  id: game.player2.id,
                  position: {
                      x: game.player2.position.x,
                      y: game.player2.position.y,
                  },
              }
            : null,

        enemy: hasUnit
            ? {
                  position: {
                      x: game.enemy.position.x,
                      y: game.enemy.position.y,
                  },
              }
            : null,

        score: {
            1: game.score["1"],
            2: game.score["2"],
        },

        attempts: game.attempts,
    };
};

const wss = new WebSocketServer({port}); //Веб-сокет сервер

setInterval(() => {
    wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
            console.log("Убиваем мертвое соединение");
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

//При подключении к серверу
wss.on("connection", chanel => {
    chanel.isAlive = true;
    const playerId = findFreePlayerId();

    if (playerId === null) {
        chanel.send(JSON.stringify({type: "error", payload: {reason: "SERVER_FULL"}}));
        chanel.close(1008, "Server is full"); // 1008 = Policy Violation
        return;
    }

    activeChannels.set(playerId, chanel);
    chanel.send(JSON.stringify(createDTO(playerId))); //Отправка объекта передачи данных через каналы

    const onChangeHandler = () => {
        if (chanel.readyState === chanel.OPEN) {
            chanel.send(JSON.stringify(createDTO(playerId)));
        }
    };

    game.eventEmitter.addEventListener("change", onChangeHandler);

    chanel.on("pong", () => {
        chanel.isAlive = true; // <-- Клиент ответил, он жив
    });

    //При получении сообщения в канале
    chanel.on("message", message => {
        let action;

        try {
            action = JSON.parse(message.toString());
        } catch {
            return;
        }

        switch (action.type) {
            case "start":
                if (playerId !== 1) return;
                if (activeChannels.size < MAX_PLAYERS) return;
                if (game.status === "IN_PROGRESS") return;

                game.gridSize = action.payload.gridSize;
                game.pointsToWin = action.payload.pointsToWin;
                game.attemptsToLose = action.payload.attemptsToLose;
                game.start();
                break;

            case "stop":
                game.stop();
                break;

            case "movePlayers":
                if (action.payload.playerId !== playerId) return;
                if (game.status !== "IN_PROGRESS") return;

                const player = playerId === 1 ? game.player1 : game.player2;

                if (!player) return;

                game.movePlayers(player, action.payload.direction);

                break;
        }
    });

    //При закрытии канала
    chanel.on("close", () => {
        activeChannels.delete(playerId);
        game.eventEmitter.removeEventListener("change", onChangeHandler);

        if (game.status === "IN_PROGRESS") game.stop();
    });

    //При получении ошибки
    chanel.on("error", () => {
        chanel.terminate();
    });
});
