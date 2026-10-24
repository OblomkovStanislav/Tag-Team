export class MessageComponent {
    #message;

    constructor(message) {
        this.#message = message;
    }

    render() {
        const messageComponent = document.createElement("div");
        messageComponent.classList.add("message-component");
        messageComponent.textContent = this.#message;

        return messageComponent;
    }
}