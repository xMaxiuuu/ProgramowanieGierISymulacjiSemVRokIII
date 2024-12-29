/// <reference path="./mytypes.d.ts" />

export { AnimationType as default }

type MyPoint = {
    x: number,
    y: number
};

type MyAnimationOptions = {
    strURL: string;
    context: CanvasRenderingContext2D;
    nCurrentFrame: number;
    nRate: number;
    bLoop: boolean ///<true - plays forever
};

class AnimationType {

    vFrames: MyPoint[] = [];
    kvOptions: MyAnimationOptions;
    Image: HTMLImageElement;

    constructor(akvOptionsIn: OnlyRequired<MyAnimationOptions, "strURL" | "context">) {
        const akvDefaults: OnlyOptional<MyAnimationOptions, "strURL" | "context"> = {
            nCurrentFrame: 0,
            nRate: 60,
            bLoop: true
        };
        this.kvOptions = { ...akvDefaults, ...akvOptionsIn };
        this.Image = new Image()
        this.Image.src = this.kvOptions.strURL
    }

    appendFrame(x: number, y: number) {
        this.vFrames.push({ x, y })
    }

    getNumFrames(): number {
        return this.vFrames.length;
    }

    getInterval(): number {
        return this.kvOptions.nRate;
    }

    setCurrentFrameIndex(anIndex: number) {
        this.kvOptions.nCurrentFrame = anIndex;
    }

    getCurrentFrameIndex(): number {
        return this.kvOptions.nCurrentFrame;
    }
    isLoop(): boolean {
        return this.kvOptions.bLoop
    }

    draw(x: number, y: number, nWidth: number, nHeight: number, bFlipH: boolean) {
        const { kvOptions: { context: aContext, nCurrentFrame: anCurrentFrame } } = this,
            aFrame: MyPoint = this.vFrames[anCurrentFrame];

        if (bFlipH) {
            aContext.save();
            aContext.scale(-1, 1);
            aContext.translate(-nWidth + 1, 0);

            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, -x, y, nWidth, nHeight)
            aContext.restore();
        } else {
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, x, y, nWidth, nHeight)
        }
    }
}
