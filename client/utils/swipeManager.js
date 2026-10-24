export class SwipeManager {
    #onSwipe;
    #touchStartX = 0;
    #touchStartY = 0;
    #minSwipeDistance = 20;
    #isSwiping = false;

    constructor(onSwipe) {
        this.#onSwipe = onSwipe;
    }

    init() {
        window.addEventListener("touchstart", this.#handleTouchStart, {passive: true});
        window.addEventListener("touchmove", this.#handleTouchMove, {passive: true});
        window.addEventListener("touchend", this.#handleTouchEnd, {passive: true});
        window.addEventListener("touchcancel", this.#handleTouchEnd, {passive: true});
    }

    #isInteractiveElement(target) {
        return target.closest("button, input, .settings-container");
    }

    #handleTouchStart = e => {
        if (this.#isInteractiveElement(e.target)) return;
        if (this.#isSwiping) return;

        this.#touchStartX = e.changedTouches[0].clientX;
        this.#touchStartY = e.changedTouches[0].clientY;
    };

    #handleTouchMove = e => {
        if (this.#isInteractiveElement(e.target)) return;
        if (this.#isSwiping) return;

        const diffX = e.changedTouches[0].clientX - this.#touchStartX;
        const diffY = e.changedTouches[0].clientY - this.#touchStartY;

        if (Math.abs(diffX) > this.#minSwipeDistance || Math.abs(diffY) > this.#minSwipeDistance) {
            let direction;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                direction = diffX > 0 ? "RIGHT" : "LEFT";
            } else {
                direction = diffY > 0 ? "DOWN" : "UP";
            }

            this.#onSwipe(direction);

            this.#isSwiping = true;
        }
    };

    #handleTouchEnd = () => {
        this.#isSwiping = false;
    };
}