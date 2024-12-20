export { PlayerType as default };
class PlayerType {
    constructor(akvOptionsIn) {
        const akvDefaults = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false
        };
        this.kvOptions = Object.assign(Object.assign({}, akvDefaults), akvOptionsIn);
    }
    setAnimation(aAnimation) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation); // Wyczyszczenie poprzedniej animacji
            this.hAnimation = (void 0);
        }
        this.AnimationCurrent = aAnimation;
        const anNumFrames = aAnimation.getNumFrames(); // Pobranie liczby klatek
        if (1 < anNumFrames) {
            this.hAnimation = setInterval(() => {
                aAnimation.setCurrentFrameIndex((aAnimation.getCurrentFrameIndex() + 1) % anNumFrames);
            }, aAnimation.getInterval());
        }
        else {
            aAnimation.setCurrentFrameIndex(0);
        }
    }
    draw(adOffsetX) {
        if (!this.AnimationCurrent) {
            return;
        }
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;
        this.AnimationCurrent.draw(x - adOffsetX, y, nWidth, nHeight, bFlipH);
    }
    setFlipH(abFlip) {
        this.kvOptions.bFlipH = abFlip;
    }
    setX(x) {
        this.kvOptions.x = x;
    }
    setY(y) {
        this.kvOptions.y = y;
    }
    getX() {
        return this.kvOptions.x;
    }
    getY() {
        return this.kvOptions.y;
    }
    getWidth() {
        return this.kvOptions.nWidth;
    }
}
