/// <reference path="./mytypes.d.ts" />

import PlayerType from "./gameCanvas_Player.js"
import AnimationType from "./gameCanvas_Animation.js"
import Keyboard from "./gameCanvas_Keyboard.js"
import isSegmentsIntersect from "./isSegmentsIntersect.js"
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js"
import getSegmentsIntersection from "./getSegmentsIntersection.js"

import type TilesType from "./gameCanvas_Tiles.js"
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
    HIGH_KICK = Symbol("high kick"),
    JUMP = Symbol("jump");

class PlayerUserType extends PlayerType {
    // Does not emit JavaScript code,
    // only ensures the types are correct
    declare kvOptions: MyPlayerUserOptions;
    ePlayerState?: symbol;
    dWalkSpeed: number = 280.0; // pixels/sec
    dJumpSpeed: number = 340.0;
    dAccelY: number = 220.0
    dSpeedX: number = 0
    dSpeedY: number = 0
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
        }),

        aAnimJump = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 350,
            bLoop: false
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

        // Animacje skoku
        
        // Mapowanie stanów na animacje
        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick,
            [JUMP]: aAnimJump
        }
    }
    update(adElapsedTime: number, aTiles: TilesType) {
        let aePlayerState: symbol = STAND;
        this.dSpeedX = 0

        if(Keyboard.isJump()) {
            aePlayerState = JUMP
        } else if(Keyboard.isLeft()) {
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
                case JUMP:
                    if (0 === this.dSpeedY) {
                        this.dSpeedY = -this.dJumpSpeed
                    }
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
        
        const adOrigY = this.getY(), adOrigX = this.getX();
        this.dSpeedY = Math.min(450, Math.max(-450, this.dSpeedY + this.dAccelY * adElapsedTime))

        let adX_new = adOrigX + this.dSpeedX * adElapsedTime,
            adY_new = adOrigY + this.dSpeedY * adElapsedTime;
        
        let akvBoundingBox: BoundingBox = this.getBoundingBox(),
            akvBoundingBox_new: BoundingBox = {
                xLeft: adX_new,
                xRight: adX_new + this.getWidth(),
                yTop: adY_new,
                yButtom: adY_new + this.getHeight()
            };
            
        const avTilesColliding: PlayerType[] = aTiles.getCollidingTiles(akvBoundingBox_new),
            anTiles = avTilesColliding.length;
        
        if (0 >= anTiles) {
            this.setX(adX_new)
            this.setY(adY_new)
            return
        }

        const adDeltaX = adX_new - adOrigX, adDeltaY = adY_new - adOrigY;
        let aTile: PlayerType;

        if (0 < Math.abs(adDeltaY)){
            for(let i = 0; i < anTiles; i++){
                aTile = avTilesColliding[i];
                const akvBoundingBox_Tile: BoundingBox = aTile.getBoundingBox();

                if(!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile)){
                    continue
                }

                if(isSegmentsIntersect(akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yButtom, akvBoundingBox.yTop, akvBoundingBox.yButtom)){
                    continue
                }

                const avSegmentY: Segment = getSegmentsIntersection(
                    akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yButtom,
                    akvBoundingBox_new.yTop, akvBoundingBox_new.yButtom
                );

                let adCorrY: number;

                if(Math.abs(avSegmentY[0] - adY_new) < 0.1) {
                    adCorrY = avSegmentY[1] - avSegmentY[0]
                } else {
                    adCorrY = avSegmentY[0] - avSegmentY[1]
                }

                adY_new += adCorrY
                akvBoundingBox_new.yTop += adCorrY
                akvBoundingBox_new.yButtom += adCorrY

                this.dSpeedY = 0
                break  
            }
        }
        if(0 < Math.abs(adDeltaX)) {
            for(let i = 0; i < anTiles; ++i){
                aTile = avTilesColliding[i]
                const akvBoundingBox_Tile: BoundingBox = aTile.getBoundingBox();

                if(!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile)){
                    continue
                }

                if(isSegmentsIntersect(akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight, akvBoundingBox.xLeft, akvBoundingBox.xRight)){
                    continue
                }

                const avSegmentX: Segment = getSegmentsIntersection(akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight, akvBoundingBox_new.xLeft, akvBoundingBox_new.xRight);

                let adCorrX: number;

                if (Math.abs(avSegmentX[0] - adX_new) < 0.1) {
                    adCorrX = avSegmentX[1] - avSegmentX[0]
                } else {
                    adCorrX = avSegmentX[0] - avSegmentX[1]
                }

                adX_new += adCorrX

                this.dSpeedX = 0
                break
            }
        }
        this.setX(adX_new)
        this.setY(adY_new)
    }          
}