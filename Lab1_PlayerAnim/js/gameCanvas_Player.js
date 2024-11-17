export { PlayerType as default };
class PlayerType {
    constructor(akvOptionsIn) {
        const akvDefaults = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false,
        };
        this.kvOptions = Object.assign(Object.assign({}, akvDefaults), akvOptionsIn);
    }
    // Ustawienie animacji
    setAnimation(aAnimation) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation); // Wyczyszczenie poprzedniej animacji
            this.hAnimation = (void 0);
        }
        this.AnimationCurrent = aAnimation;
        const anNumFrames = aAnimation.getNumFrames(); // Pobranie liczby klatek
        if (1 < anNumFrames) {
            // Jeśli animacja ma więcej niż jedną klatkę
            this.hAnimation = setInterval(() => {
                aAnimation.setCurrentFrameIndex((aAnimation.getCurrentFrameIndex() + 1) % anNumFrames);
            }, aAnimation.getInterval());
        }
        else {
            // Jeśli animacja ma tylko jedną klatkę
            aAnimation.setCurrentFrameIndex(0);
        }
    }
    // Rysowanie obiektu
    draw() {
        if (!this.AnimationCurrent) {
            return; // Jeśli brak animacji, zakończ
        }
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;
        // Rysowanie aktualnej klatki animacji
        this.AnimationCurrent.draw(x, y, nWidth, nHeight, bFlipH);
    }
}
