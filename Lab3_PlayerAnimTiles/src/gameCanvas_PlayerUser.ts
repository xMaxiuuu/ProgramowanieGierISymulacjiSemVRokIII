/// <reference path="./mytypes.d.ts" />

import PlayerType from "./gameCanvas_Player.js"
import AnimationType from "./gameCanvas_Animation.js"
import Keyboard from "./gameCanvas_Keyboard.js"

import { type MyPlayerOptions } from "./gameCanvas_Player.js"
// lub
//import type { MyPlayerOptions } from "./gameCanvas_Player.js";

export { PlayerUserType as default }

type MyPlayerUserOptions = MyPlayerOptions & {
    context: CanvasRenderingContext2D
};

const STAND = Symbol("stand"),
    WALK_LEFT = Symbol("walk left"),
    WALK_RIGHT = Symbol("walk right"),
    HIGH_KICK = Symbol("high kick");

class PlayerUserType extends PlayerType {
    // Does not emit JavaScript code,
    // only ensures the types are correct
    declare kvOptions: MyPlayerUserOptions;
    ePlayerState?: symbol;
    dWalkSpeed: number = 80.0; // pixels/sec
    kvPlayerStateToAnim: {
        [key: symbol]: AnimationType;
    };

    constructor(akvOptionsIn: OnlyRequired<MyPlayerUserOptions, "context">) {
        const akvDefaults: OnlyOptional<MyPlayerUserOptions, "context"> = {
            x: 280,
            y: 240, // <----- Pozycja gracza na planszy
            nWidth: 75,
            nHeight: 100,
            bFlipH: false
        }, akvOptions = { ...akvDefaults, ...akvOptionsIn };

        super(akvOptions);

        if (!this.kvOptions.context) {
            throw "Missing context";
        }

        const aAnimStand = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
        }),

        aAnimWalk = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
        }),

        aAnimHighKick = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 200,
        });

         // Animacje stania
        aAnimStand.appendFrame(0, 0);
        aAnimStand.appendFrame(80, 0);
        aAnimStand.appendFrame(160, 0);
        aAnimStand.appendFrame(240, 0);
        aAnimStand.appendFrame(320, 0);
        aAnimStand.appendFrame(400, 0);
        aAnimStand.appendFrame(480, 0);
        aAnimStand.appendFrame(560, 0);

        // Animacje chodzenia
        aAnimWalk.appendFrame(0, 98)
        aAnimWalk.appendFrame(80, 98)
        aAnimWalk.appendFrame(160, 98)
        aAnimWalk.appendFrame(240, 98)
        aAnimWalk.appendFrame(320, 98)
        aAnimWalk.appendFrame(400, 98)
        
        // Animacje kopnięcia
        aAnimHighKick.appendFrame(5, 370)
        aAnimHighKick.appendFrame(85, 370)
        
        // Mapowanie stanów na animacje
        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick
        }
    }
    update(adElapsedTime: number) {
        let aePlayerState: symbol = STAND;

        if(Keyboard.isLeft()) {
            aePlayerState = WALK_LEFT
        } else if (Keyboard.isRight()){
            aePlayerState = WALK_RIGHT
        } else if (Keyboard.isKick()){
            aePlayerState = HIGH_KICK
        }

        if (aePlayerState !== this.ePlayerState){
            this.ePlayerState = aePlayerState
            this.setAnimation(this.kvPlayerStateToAnim[aePlayerState])

            switch (aePlayerState) {
                case WALK_LEFT:
                    this.setFlipH(true)
                    break
                case WALK_RIGHT:
                    this.setFlipH(false)
                    break
                default:
                    break
            }
        } else{
            switch (aePlayerState){
                case WALK_LEFT:
                    this.setX(this.getX() - this.dWalkSpeed * adElapsedTime)
                    break
                case WALK_RIGHT:
                    this.setX(this.getX() + this.dWalkSpeed * adElapsedTime)
                    break
                default:
                    break
            }
        }     
    }          
}