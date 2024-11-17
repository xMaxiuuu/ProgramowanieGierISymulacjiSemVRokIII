import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";

let aContext: CanvasRenderingContext2D; // Globalna zmienna kontekstu

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
    aCanvas.style.display = "none";
    aCanvas.width = 640;
    aCanvas.height = 480;
    aBoard.appendChild(aCanvas);

    // Pobranie kontekstu 2D
    const context = aCanvas.getContext("2d");
    if (!context) {
        throw new Error("Nie udało się uzyskać kontekstu 2D.");
    }
    aContext = context;

    // Tworzenie obiektów gry
    const aBackground = new PlayerType({ nWidth: 625, nHeight: 400 });
    const aPlayer = new PlayerType({
        x: 250,
        y: 200,
        nWidth: 100,
        nHeight: 100,
    });
    const aEnemy = new PlayerType({
        x: 800,
        y: 140,
        nWidth: 126,
        nHeight: 114,
        bFlipH: true,
    });

    // Tworzenie animacji
    const aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
    });

    const aAnimStand = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 100,
    });

    const aAnimStandEnemy = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 350,
    });

    // Dodanie klatek animacji
    aAnimStand.appendFrame(20, 2);
    aAnimStand.appendFrame(98, 2);
    // Reszta klatek...

    // Przypisanie animacji
    aBackground.setAnimation(aAnimBackground);
    aPlayer.setAnimation(aAnimStand);
    aEnemy.setAnimation(aAnimStandEnemy);

    // Pętla gry
    function gameLoop() {
        aContext.clearRect(0, 0, aCanvas.width, aCanvas.height);

        aBackground.draw(aContext);
        aEnemy.draw(aContext);
        aPlayer.draw(aContext);

        requestAnimationFrame(gameLoop);
    }

    aCanvas.style.display = "block";
    requestAnimationFrame(gameLoop);
}
