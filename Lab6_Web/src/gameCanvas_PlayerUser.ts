/// <reference path="./mytypes.d.ts" />

import PlayerType from "./gameCanvas_Player.js"
import AnimationType from "./gameCanvas_Animation.js"
import Keyboard from "./gameCanvas_Keyboard.js"
import isSegmentsIntersect from "./isSegmentsIntersect.js"
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js"
import getSegmentsIntersection from "./getSegmentsIntersection.js"
import ManagerAudio from "./gameCanvas_ManagerAudio.js"
import WebSocketPlayerUser from "./gameCanvas_WebSocket.js"

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
    JUMP = Symbol("jump"),
    UNDEFINED = Symbol("undefined"),
    vIndex2Symbol: symbol[] = [STAND, WALK_LEFT, WALK_RIGHT, HIGH_KICK, JUMP];

class PlayerUserType extends PlayerType {
    // Does not emit JavaScript code,
    // only ensures the types are correct
    declare kvOptions: MyPlayerUserOptions;
    ePlayerState: symbol = UNDEFINED;
    dWalkSpeed: number = 280.0; // pixels/sec
    dJumpSpeed: number = 300.0;
    dAccelY: number = 220.0
    dSpeedX: number = 0
    dSpeedY: number = 0
    kvPlayerStateToAnim: {
        [key: symbol]: AnimationType;
    };

    constructor(akvOptionsIn: OnlyRequired<MyPlayerUserOptions, "context">) {
        const akvDefaults: OnlyOptional<MyPlayerUserOptions, "context"> = {
            x: 280,
            y: 180, // <----- Pozycja gracza na planszy
            nWidth: 72,
            nHeight: 67,
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
            nRate: 5000,
        }),

        aAnimJump = new AnimationType({
            strURL: "images/game_sprite.png",
            context: this.kvOptions.context,
            nRate: 100,
            bLoop: false
        });

         // Animacje stania
         aAnimStand.appendFrame(12, 16);
         aAnimStand.appendFrame(92, 16);
         aAnimStand.appendFrame(172, 16);
         aAnimStand.appendFrame(252, 16);
         aAnimStand.appendFrame(332, 16);
         aAnimStand.appendFrame(412, 16);
         aAnimStand.appendFrame(492, 16);
         aAnimStand.appendFrame(572, 16);

        // Animacje chodzenia
        aAnimWalk.appendFrame(12, 114);
        aAnimWalk.appendFrame(92, 114);
        aAnimWalk.appendFrame(172, 114);
        aAnimWalk.appendFrame(252, 114);
        aAnimWalk.appendFrame(332, 114);
        aAnimWalk.appendFrame(412, 114);
        
        // Animacje skoku
        aAnimJump.appendFrame(12, 296);
        aAnimJump.appendFrame(92, 296);

        // Animacje kopnięcia
        aAnimHighKick.appendFrame(12, 385);
        aAnimHighKick.appendFrame(92, 385);


        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick,
            [JUMP]: aAnimJump
        }

        this.kvPlayerStateToAnim = {
            [STAND]: aAnimStand,
            [WALK_LEFT]: aAnimWalk,
            [WALK_RIGHT]: aAnimWalk,
            [HIGH_KICK]: aAnimHighKick,
            [JUMP]: aAnimJump
        }

        WebSocketPlayerUser.attachOnReceivedXY(this.onReceivedXY.bind(this))
        WebSocketPlayerUser.attachOnReceivedPlayerState(this.onReceivedPlayerState.bind(this))
    }
    update(adElapsedTime: number, aTiles: TilesType) {

        if(WebSocketPlayerUser.isConnected() && (!WebSocketPlayerUser.canControlUser())){
            return;
        }

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
            this.sendPlayerState()

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
                case HIGH_KICK:
                    ManagerAudio.play("kick")
                    break
                default:
                    break
            }
        } else{
            switch (aePlayerState){
                case WALK_LEFT:
                    this.dSpeedX = -this.dWalkSpeed
                    break
                case WALK_RIGHT:
                    this.dSpeedX = this.dWalkSpeed
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
            
        const avTilesColliding: PlayerType[] = aTiles.getCollidingTile(akvBoundingBox_new),
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

                if ((20 < this.dSpeedY) && (0 > adCorrY)) {
                    ManagerAudio.play("onground")
                }

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
                ManagerAudio.play("hit")
                break
            }
        }
        this.setXY(adX_new, adY_new)
    }          
    setXY(x: number, y: number) {
        super.setXY(x,y)
        WebSocketPlayerUser.sendXY(x,y)
    }
    sendPlayerState(){
        WebSocketPlayerUser.sendPlayerState(vIndex2Symbol.indexOf(this.ePlayerState))
    }
    onReceivedXY(x: number, y: number){
        if(WebSocketPlayerUser.canControlUser()){
            return
        }
        super.setXY(x,y)
    }
    onReceivedPlayerState(anPlayerState: number) {
        if(WebSocketPlayerUser.canControlUser()){
            return
        }
    const aePlayerState: symbol = vIndex2Symbol[anPlayerState]
    this.ePlayerState = aePlayerState
    this.setAnimation(this.kvPlayerStateToAnim[aePlayerState])
    switch(aePlayerState){
        case WALK_LEFT:
            this.setFlipH(true)
            break
        case WALK_RIGHT:
            this.setFlipH(false)
            break
        default:
            break
       
        }
    }
}