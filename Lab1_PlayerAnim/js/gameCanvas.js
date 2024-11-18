import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
document.addEventListener("DOMContentLoaded", onReady);
function onReady() {
    const aBoard = document.getElementById("idGame");
    if (!aBoard) {
        //console.error("Element #idGame nie został znaleziony w HTML.");
        return;
    }
    const aCanvas = document.createElement("canvas");
    aCanvas.setAttribute("id", "idCanvas");
    aCanvas.width = 640;
    aCanvas.height = 480;
    aBoard.appendChild(aCanvas);
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        //console.error("Nie udało się uzyskać kontekstu 2D dla canvas.");
        return;
    }
    const aBackground = new PlayerType({ nWidth: 640, nHeight: 480 }), aPlayer = new PlayerType({
        x: 280,
        y: 140,
        nWidth: 75,
        nHeight: 114,
    }), aEnemy = new PlayerType({
        x: 400,
        y: 140,
        nWidth: 126,
        nHeight: 114,
        bFlipH: true
    }), aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
    }), aAnimStand = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 100,
    }), aAnimStandEnemy = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 350,
    });
    aAnimBackground.appendFrame(0, 0);
    aAnimStand.appendFrame(0, 0);
    aAnimStand.appendFrame(80, 0);
    aAnimStand.appendFrame(160, 0);
    aAnimStand.appendFrame(240, 0);
    aAnimStand.appendFrame(320, 0);
    aAnimStand.appendFrame(400, 0);
    aAnimStand.appendFrame(480, 0);
    aAnimStand.appendFrame(560, 0);
    aAnimStandEnemy.appendFrame(0, 0);
    aAnimStandEnemy.appendFrame(80, 0);
    aAnimStandEnemy.appendFrame(160, 0);
    aAnimStandEnemy.appendFrame(240, 0);
    aAnimStandEnemy.appendFrame(320, 0);
    aAnimStandEnemy.appendFrame(400, 0);
    aAnimStandEnemy.appendFrame(480, 0);
    aAnimStandEnemy.appendFrame(560, 0);
    aBackground.setAnimation(aAnimBackground);
    aPlayer.setAnimation(aAnimStand);
    aEnemy.setAnimation(aAnimStandEnemy);
    function gameLoop() {
        aBackground.draw();
        aEnemy.draw();
        aPlayer.draw();
        requestAnimationFrame(gameLoop);
    }
    aCanvas.style.display = "block";
    requestAnimationFrame(gameLoop);
}
