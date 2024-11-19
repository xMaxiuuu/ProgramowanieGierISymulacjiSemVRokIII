import PlayerType from "./gameCanvas_Player.js";
import PlayerUserType from "./gameCanvas_PlayerUser.js";
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
    aCanvas.style.display = "none";
    aCanvas.width = 640;
    aCanvas.height = 480;
    aBoard.appendChild(aCanvas);
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        //console.error("Nie udało się uzyskać kontekstu 2D dla canvas.");
        return;
    }
    const aBackground = new PlayerType({ nWidth: 640, nHeight: 480 }), aPlayer = new PlayerUserType({
        context: aContext
    }), aEnemy = new PlayerType({
        x: 400,
        y: 140,
        nWidth: 75,
        nHeight: 114,
        bFlipH: true
    }), aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
    }), aAnimStandEnemy = new AnimationType({
        strURL: "images/game_sprite_enemy.png",
        context: aContext,
        nRate: 100,
    });
    aAnimBackground.appendFrame(0, 0);
    aAnimStandEnemy.appendFrame(0, 0);
    aAnimStandEnemy.appendFrame(80, 0);
    aAnimStandEnemy.appendFrame(160, 0);
    aAnimStandEnemy.appendFrame(240, 0);
    aAnimStandEnemy.appendFrame(320, 0);
    aAnimStandEnemy.appendFrame(400, 0);
    aAnimStandEnemy.appendFrame(480, 0);
    aAnimStandEnemy.appendFrame(560, 0);
    aBackground.setAnimation(aAnimBackground);
    aEnemy.setAnimation(aAnimStandEnemy);
    function gameLoop(adTimestamp) {
        let adElapsedTime = (adTimestamp - adTimeOld) * 0.001;
        aPlayer.update(adElapsedTime);
        aBackground.draw();
        aEnemy.draw();
        aPlayer.draw();
        adTimeOld = adTimestamp;
        requestAnimationFrame(gameLoop);
    }
    aCanvas.style.display = "block";
    let adTimeOld = performance.now(), adTimeStart = adTimeOld;
    requestAnimationFrame(gameLoop);
}
