import AnimationType from "./gameCanvas_Animation.js";

export type MyPlayerOptions = {
    x: number;
    y: number;
    nWidth: number;
    nHeight: number;
    bFlipH: boolean;
};

export default class PlayerType {
    kvOptions: MyPlayerOptions;
    hAnimation?: number;
    AnimationCurrent?: AnimationType;

    constructor(akvOptionsIn?: Partial<MyPlayerOptions>) {
        const akvDefaults: MyPlayerOptions = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false,
        };
        this.kvOptions = { ...akvDefaults, ...akvOptionsIn };
    }

    // Ustawienie animacji
    setAnimation(aAnimation: AnimationType) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation); // Wyczyszczenie poprzedniej animacji
            this.hAnimation = void 0;
        }

        this.AnimationCurrent = aAnimation;

        const anNumFrames = aAnimation.getNumFrames(); // Pobranie liczby klatek

        if (anNumFrames > 1) {
            // Jeśli animacja ma więcej niż jedną klatkę
            this.hAnimation = setInterval(() => {
                const nextFrameIndex =
                    (aAnimation.getCurrentFrameIndex() + 1) % anNumFrames;
                aAnimation.setCurrentFrameIndex(nextFrameIndex);
            }, aAnimation.getInterval());
        } else {
            // Jeśli animacja ma tylko jedną klatkę
            aAnimation.setCurrentFrameIndex(0);
        }
    }

    // Rysowanie obiektu
    draw(context: CanvasRenderingContext2D) {
        if (!this.AnimationCurrent) {
            return; // Jeśli brak animacji, zakończ
        }
    
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;
    
        // Rysowanie aktualnej klatki animacji
        this.AnimationCurrent.draw(x, y, nWidth, nHeight, bFlipH);
    }
}
