import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
import { type MyPlayerOptions } from "./gameCanvas_Player.js";

export { BackgroundType as default }

type MyBackgroundOptions = MyPlayerOptions & {
    context: CanvasRenderingContext2D,
    strURL: string,
    nWorldWidth: number
};

class BackgroundType extends PlayerType{
    declare kvOptions: MyBackgroundOptions;

    constructor(akvOptionsIn: OnlyRequired<MyBackgroundOptions, "strURL" | "context">) {
        const akvDefaults: Partial<MyBackgroundOptions> = {
            nWorldWidth: 1
        }, akvOptions = { ...akvDefaults, ...akvOptionsIn };

        super(akvOptions);

        if (!this.kvOptions.context) {
            throw "Missing context"
        }
        const { strURL: astrURL, context: aContext } = this.kvOptions,
        aAnimBackgroud = new AnimationType({
            strURL: astrURL,
            context: aContext
        });
        aAnimBackgroud.appendFrame(0,0)
        this.setAnimation(aAnimBackgroud)
    }

    draw(adWorldOffsetX: number) {
        const adWorldXL = adWorldOffsetX,
            adWorldXR = adWorldXL + this.kvOptions.nWorldWidth - 1;
            anWidth = this.getWidth(),
            anStart = Math.floor(adWorldXL / anWidth),
            anEnd = Math.floor(adWorldXR / anWidth);

        for(let n = anStart; n <= AnalyserNode; n++){
            this.setX(aWidth * n)
            super.draw(aWorldOffsetX)
        }
    }
}
