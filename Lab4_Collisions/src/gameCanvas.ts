document.addEventListener("DOMContentLoaded", onReady)

import PlayerType from "./gameCanvas_Player.js";
import PlayerUserType from "./gameCanvas_PlayerUser.js";
import AnimationType from "./gameCanvas_Animation.js";
import BackgroundType from "./gameCanvas_Background.js";
import TilesType from "./gameCanvas_Tiles.js";

function onReady() {

    const aBoard = document.getElementById("idGame");
    if (!aBoard) {
        console.error("Element #idGame nie został znaleziony w HTML.");
        return
    }

    const
        aSplashScreen = document.getElementById("idSplashScreen"),
        aCanvas = document.createElement("canvas");

    if(!aSplashScreen){
        return
    }

    aCanvas.setAttribute("id", "idCanvas");
    aCanvas.style.display = "none"
    aCanvas.width = 640;
    aCanvas.height = 480;
    aBoard.appendChild(aCanvas);

    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        console.error("Nie udało się uzyskać kontekstu 2D dla canvas.");
        return;
    }

    const aBackground = new BackgroundType({
        y: -100,
        nWorldWidth: 640,
        nWidth: 640, 
        nHeight: 650,
        strURL: "images/game_background.png",
        context: aContext
    }),

    aBackground2 = new BackgroundType({
        nWorldWidth: 5000,
        nWidth: 200, 
        nHeight: 100,
        strURL: "images/lijany.png",
        context: aContext
    }),

    aPlayer = new PlayerUserType({
        context: aContext
    }),

    aEnemy = new PlayerType({
        x: 400,
        y:70,
        nWidth: 70,
        nHeight: 100,
        bFlipH: true
    }),

    aAnimStandEnemy = new AnimationType({
        strURL: "images/game_sprite_enemy.png",
        context: aContext,
        nRate: 100,
    });
    
    aAnimStandEnemy.appendFrame(0, 0);
    aAnimStandEnemy.appendFrame(80, 0);
    aAnimStandEnemy.appendFrame(160, 0);
    aAnimStandEnemy.appendFrame(240, 0);
    aAnimStandEnemy.appendFrame(320, 0);
    aAnimStandEnemy.appendFrame(400, 0);
    aAnimStandEnemy.appendFrame(480, 0);
    aAnimStandEnemy.appendFrame(560, 0);

    aEnemy.setAnimation(aAnimStandEnemy)

    const aMapTiles_Level10 = [
        [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
        [0,2,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [2,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
        [1,3,1,1,2,1,1,1,1,3,2,1,1,1,1,1,1,2,1,1]
    ],

        aAnimTile0 = new AnimationType({
            strURL: "images/game_tiles.png",
            context: aContext
        }),
    
        aAnimTile1 = new AnimationType({
            strURL: "images/game_tiles2.png",
            context: aContext
        }),

        aAnimTile2 = new AnimationType({
            strURL: "images/game_tiles.png",
            context: aContext
        });

    aAnimTile0.appendFrame(0,0)
    aAnimTile1.appendFrame(0,0)
    aAnimTile2.appendFrame(0,0)
    /*aAnimTile0.appendFrame(280,0)
    aAnimTile0.appendFrame(350,0)*/

    const aTiles = new TilesType({
        nTileWidth: 80,
        nTileHeight: 50,
        vvMapTiles: aMapTiles_Level10,
        vAnimations: [aAnimTile0,aAnimTile1,aAnimTile2],
        context: aContext
    });

    function gameLoop(adTimestamp: number) {
        let adElapsedTime = (adTimestamp - adTime) * 0.001
        aPlayer.update(adElapsedTime, aTiles)

        const x = aPlayer.getX();
        let adOffsetX = 0.0;
        if (200<x){
            adOffsetX = x - 200
        }

        aBackground.draw(adOffsetX * 0.4)
        aBackground2.draw(adOffsetX * -0.3)
        aTiles.draw(adOffsetX)
        aEnemy.draw(adOffsetX)
        aPlayer.draw(adOffsetX)

        adTime = adTimestamp
        requestAnimationFrame(gameLoop)
    }

    let adTime: number;

    aSplashScreen.onclick = () => {
        aSplashScreen.style.display = "none"
        aCanvas.style.display = "block";  
    
        adTime = performance.now()
        requestAnimationFrame(gameLoop);
    }
}