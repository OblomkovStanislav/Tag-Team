//Класс Менеджер звука
export class AudioManager {
    //Приватные свойства

    #sounds = {}; //Звуки
    #isMute = false; //Флаг вкл/выкл звука

    //Публичные свойства

    //Получить состояние флага вкл/выкл звука
    get isMute() {
        return this.#isMute;
    }

    //Публичные методы

    //Добавить звук
    add(src, name) {
        this.#sounds[name] = new Audio(src);
    }

    //Удалить звук
    remove(name) {
        delete this.#sounds[name];
    }

    //Воспроизвести звук
    play(name) {
        if (this.#isMute) return;

        const sound = this.#sounds[name];

        if (!sound) return;

        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    //Вкл/выкл звук
    mute() {
        this.#isMute = !this.#isMute;
    }
}
