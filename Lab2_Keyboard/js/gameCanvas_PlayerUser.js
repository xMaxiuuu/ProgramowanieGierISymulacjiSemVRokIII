/// <reference path="./mytypes.d.ts" />
import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
import Keyboard from "./gameCanvas_Keyboard.js";
// lub
//import type { MyPlayerOptions } from "./gameCanvas_Player.js";
export { PlayerUserType as default };
const STAND = Symbol("stand"), WALK_LEFT = Symbol("walk left"), WALK_RIGHT = Symbol("walk right"), HIGH_KICK = Symbol("high kick");
class PlayerUserType extends PlayerType {
    constructor(akvOptionsIn) {
        const akvDefaults = {
            x: 280,
            y: 310,
            nWidth: 75,
            nHeight: 114,
            bFlipH: false
        }, akvOptions = Object.assign(Object.assign({}, akvDefaults), akvOptionsIn);
        super(akvOptions);
        this.dWalkSpeed = 80.0; // pixels/sec
        if (!this.kvOptions.context) {
            throw "Missing context";
        }
        const aAnimStand = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
        }), aAnimWalk = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
        }), aAnimHighKick = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
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
        aAnimWalk.appendFrame(0, 100);
        aAnimWalk.appendFrame(80, 100);
        aAnimWalk.appendFrame(160, 100);
        aAnimWalk.appendFrame(240, 100);
        aAnimWalk.appendFrame(320, 100);
        aAnimWalk.appendFrame(400, 100);
        // Animacje kopnięcia
        aAnimHighKick.appendFrame(1463, 1232);
        aAnimHighKick.appendFrame(1562, 1232);
        aAnimHighKick.appendFrame(1666, 1232);
        aAnimHighKick.appendFrame(1749, 1232);
        aAnimHighKick.appendFrame(1893, 1232);
        aAnimHighKick.appendFrame(1997, 1232);
        // Mapowanie stanów na animacje
        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick
        };
    }
    update(adElapsedTime) {
        let aePlayerState = STAND;
        if (Keyboard.isLeft()) {
            aePlayerState = WALK_LEFT;
        }
        else if (Keyboard.isRight()) {
            aePlayerState = WALK_RIGHT;
        }
        else if (Keyboard.isKick()) {
            aePlayerState = HIGH_KICK;
        }
        if (aePlayerState !== this.ePlayerState) {
            this.ePlayerState = aePlayerState;
            this.setAnimation(this.kvPlayerStateToAnim[aePlayerState]);
            switch (aePlayerState) {
                case WALK_LEFT:
                    this.setFlipH(true);
                    break;
                case WALK_RIGHT:
                    this.setFlipH(false);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (aePlayerState) {
                case WALK_LEFT:
                    this.setX(this.getX() - this.dWalkSpeed * adElapsedTime);
                    break;
                case WALK_RIGHT:
                    this.setX(this.getX() + this.dWalkSpeed * adElapsedTime);
                    break;
                default:
                    break;
            }
        }
    }
}
