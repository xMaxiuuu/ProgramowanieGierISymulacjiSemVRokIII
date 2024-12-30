/// <reference path="./mytypes.d.ts" />

import PlayerType from "./gameCanvas_Player.js";
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js";
import getSegmentsIntersection from "./getSegmentsIntersection.js";
import type AnimationType from "./gameCanvas_Animation.js";

export { TilesType as default }

type MyTilesOptions = {
    nTileWidth: number,
    nTileHeight: number,
    vvMapTiles: number[][],
    vAnimations: AnimationType[],
    context: CanvasRenderingContext2D
}

class TilesType{
    kvOptions: MyTilesOptions;
    vvTiles: PlayerType[][] = [];
    kvBoundingBox = { xLeft: 0, xRight: 0, yTop: 0, yButtom: 0 };
    nNumTilesWidth = 0;
    nNumTilesHeight = 0;

    constructor(akvOptionsIn: MyTilesOptions) {
        const akvDefaults = {
        };
        this.kvOptions = { ...akvDefaults, ...akvOptionsIn }

        if (!this.kvOptions.context) {
            throw "Missing context"
        }

        const aMapTiles = this.kvOptions.vvMapTiles;

        if(Array.isArray(aMapTiles)){
            const { vAnimations: avAnimations, nTileWidth: anTileWidth, nTileHeight: anTileHeight } = this.kvOptions;
            let anRow: number, anCol: number, anRows: number, anCols: number, avLine: number[], aTile: PlayerType, anTileIndex: number;

            for(anRow = 0, anRows = aMapTiles.length; anRow < anRows; ++anRow){
                avLine = aMapTiles[anRow]
                for(anCol = 0, anCols = avLine.length; anCol < anCols; ++anCol){
                    anTileIndex = avLine[anCol]
                    if (0<anTileIndex){
                        aTile = new PlayerType({
                            x: anCol * anTileWidth,
                            y: anRow * anTileHeight,
                            nWidth: anTileWidth,
                            nHeight: anTileHeight
                        })
                        aTile.setAnimation(avAnimations[anTileIndex - 1])

                        this.vvTiles[anRow] = this.vvTiles[anRow] || []
                        this.vvTiles[anRow][anCol] = aTile

                        this.kvBoundingBox.xRight = Math.max(this.kvBoundingBox.xRight, aTile.getX() + anTileWidth)
                        this.kvBoundingBox.yButtom = Math.max(this.kvBoundingBox.yButtom, aTile.getY() + anTileHeight)

                    }
                }
                this.nNumTilesWidth = Math.max(this.nNumTilesHeight, anCols)
            }
            this.nNumTilesHeight = anRows
        }
    }    
    draw(adOffsetX: number){
        this.vvTiles.forEach(avLine => avLine.forEach(aTile => aTile.draw(adOffsetX)))
    }

    getCollidingTile(akvBoundingBox: BoundingBox): PlayerType[] {
        if(!areBoundingBoxesIntersect(akvBoundingBox, this.kvBoundingBox)){
            return []
        }

        const
            avSegmentX: Segment = getSegmentsIntersection(akvBoundingBox.xLeft, akvBoundingBox.xRight, this.kvBoundingBox.xLeft, this.kvBoundingBox.xRight),
            avSegmentY: Segment = getSegmentsIntersection(akvBoundingBox.yTop, akvBoundingBox.yButtom, this.kvBoundingBox.yTop, this.kvBoundingBox.yButtom);

        const 
            anTileWidth = this.kvOptions.nTileWidth,
            anNumTileHeight = this.kvOptions.nTileHeight,
            anNumTilesWidth = this.nNumTilesWidth,
            anNumTilesHeight = this.nNumTilesHeight;

        const akvIndexes = {
            ix0: Math.floor((avSegmentX[0] - this.kvBoundingBox.xLeft) / anTileWidth),
            ix1: Math.ceil((avSegmentX[1] - this.kvBoundingBox.xLeft) / anTileWidth),

            iy0: Math.floor((avSegmentY[0] - this.kvBoundingBox.yTop) / anNumTileHeight),
            iy1: Math.ceil((avSegmentY[1] - this.kvBoundingBox.yTop) / anNumTileHeight)
        };

        akvIndexes.ix0 = Math.min(Math.max(0, akvIndexes.ix0), anNumTilesWidth - 1)
        akvIndexes.ix1 = Math.min(Math.max(0, akvIndexes.ix1), anNumTilesWidth - 1)

        akvIndexes.iy0 = Math.min(Math.max(0, akvIndexes.iy0), anNumTilesHeight - 1)
        akvIndexes.iy1 = Math.min(Math.max(0, akvIndexes.iy1), anNumTilesHeight - 1)
    
        const avTilesColliding: PlayerType[] = [],
        aMapTiles: number[][] = this.kvOptions.vvMapTiles;

        if(Array.isArray(aMapTiles)) {
            let anRow: number, anCol: number, aTile: PlayerType;

            for(anRow = akvIndexes.iy0; anRow <= akvIndexes.iy1; ++anRow) {
                for(anCol = akvIndexes.ix0; anCol <= akvIndexes.ix1; ++anCol) {
                    if(0 < aMapTiles[anRow][anCol]){
                        aTile = this.vvTiles[anRow][anCol]
                        if(aTile){
                            avTilesColliding.push(aTile)
                        }
                    }
                }
            }
        }
        return avTilesColliding
    }
}