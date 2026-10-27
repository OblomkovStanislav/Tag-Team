import {ToggleSoundComponent} from "../toggleSoundComponent/toggleSoundComponent.js";

export class HeaderComponent {
    render (imgPlayer, isMute, onMute) {
        const headerComponent = document.createElement("div");
        headerComponent.classList.add("header-component");

        const leftSpacerElement = document.createElement("div");

        headerComponent.appendChild(leftSpacerElement);

        const avatarElement = document.createElement("img");
        avatarElement.classList.add("avatar-element");
        avatarElement.src = imgPlayer;

        headerComponent.appendChild(avatarElement);

        const soundContainerElement = document.createElement("div");
        soundContainerElement.classList.add("sound-container-element");

        const toggleSoundComponent = new ToggleSoundComponent("Звук");

        soundContainerElement.appendChild(toggleSoundComponent.render(isMute, onMute));

        headerComponent.appendChild(soundContainerElement);

        return headerComponent;
    }
}