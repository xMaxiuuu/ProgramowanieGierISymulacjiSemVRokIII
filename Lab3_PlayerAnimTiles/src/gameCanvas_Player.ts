import AnimationType from "./gameCanvas_Animation.js";

export { PlayerType as default }

export type MyPlayerOptions = {
    x: number;
    y: number,
    nWidth: number,
    nHeight: number,
    bFlipH: boolean
}

class PlayerType {

    kvOptions: MyPlayerOptions;
    hAnimation?: number;
    AnimationCurrent?: AnimationType;

    constructor(akvOptionsIn?: Partial<MyPlayerOptions>) {
        const akvDefaults: MyPlayerOptions = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false
        };
        this.kvOptions = { ...akvDefaults, ...akvOptionsIn };
    }

    setAnimation(aAnimation: AnimationType) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation); // Wyczyszczenie poprzedniej animacji
            this.hAnimation = (void 0)
        }
        this.AnimationCurrent = aAnimation;

        const anNumFrames = aAnimation.getNumFrames(); // Pobranie liczby klatek

        if (1 < anNumFrames) {
            this.hAnimation = setInterval(() => {
            aAnimation.setCurrentFrameIndex((aAnimation.getCurrentFrameIndex() + 1) % anNumFrames)
        }, aAnimation.getInterval())
        } else {
            aAnimation.setCurrentFrameIndex(0);
        }
    }

    draw(adOffsetX: number) {
        if (!this.AnimationCurrent) {
            return
        }
    
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;

        this.AnimationCurrent.draw(x - adOffsetX, y, nWidth, nHeight, bFlipH)
    }

    setFlipH(abFlip: boolean) {
        this.kvOptions.bFlipH = abFlip
    }

    setX(x: number) {
        this.kvOptions.x = x
    }

    setY(y: number) {
        this.kvOptions.y = y
    }

    getX(): number {
        return this.kvOptions.x
    }

    getY(): number {
        return this.kvOptions.y
    }

    getWidth(): number{
        return this.kvOptions.nWidth
    }
}
