import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
document.addEventListener("DOMContentLoaded", onReady);
function onReady() {
    const aBoard = document.getElementById("idGame");
    if (!aBoard) {
        console.error("Element #idGame nie został znaleziony.");
        return;
    }
    // Tworzenie elementu canvas
    const aCanvas = document.createElement("canvas");
    aCanvas.setAttribute("id", "idCanvas");
    aCanvas.width = 625;
    aCanvas.height = 400;
    aBoard.appendChild(aCanvas);
    // Pobranie kontekstu 2D
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        return;
    }
    // Tworzenie obiektów gry
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
    }), aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
    }), aAnimStand = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 100
    }), aAnimStandEnemy = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 350
    });
    // Dodanie klatek animacji dla sprite'ów
    aAnimStand.appendFrame(0, 0); // Klatka 1
    aAnimStand.appendFrame(98, 2); // Klatka 2
    aAnimStand.appendFrame(322, 2); // Klatka 3
    aAnimStand.appendFrame(483, 2); // Klatka 4
    aAnimStand.appendFrame(644, 2); // Klatka 5
    aAnimStand.appendFrame(805, 2); // Klatka 6
    aAnimStandEnemy.appendFrame(1073, 308);
    aAnimStandEnemy.appendFrame(1193, 308);
    aAnimStandEnemy.appendFrame(1323, 308);
    aAnimStandEnemy.appendFrame(1473, 308);
    aAnimStandEnemy.appendFrame(1623, 308);
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
