import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
let aContext; // Globalna zmienna kontekstu
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
<<<<<<< HEAD
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
=======
    const context = aCanvas.getContext("2d");
    if (!context) {
>>>>>>> parent of 405d122 (Wersja przepisana z pdf)
        throw new Error("Nie udało się uzyskać kontekstu 2D.");
    }
    aContext = context;
    // Tworzenie obiektów gry
    const aBackground = new PlayerType({ nWidth: 625, nHeight: 400 });
    const aPlayer = new PlayerType({
<<<<<<< HEAD
        x: 200,
        y: 280,
        nWidth: 100,
        nHeight: 120,
=======
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
>>>>>>> parent of 405d122 (Wersja przepisana z pdf)
    });
    // Tworzenie animacji
    const aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
<<<<<<< HEAD
    });
    const aAnimStand = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 200, // Czas odświeżania klatek w milisekundach
    });
    // Dodanie klatek animacji dla sprite'ów
    aAnimStand.appendFrame(0, 0); // Klatka 1
    aAnimStand.appendFrame(161, 0); // Klatka 2
    aAnimStand.appendFrame(322, 0); // Klatka 3
    aAnimStand.appendFrame(483, 0); // Klatka 4
    aAnimStand.appendFrame(644, 0); // Klatka 5
    aAnimStand.appendFrame(805, 0); // Klatka 6
    // Przypisanie animacji
    aBackground.setAnimation(aAnimBackground);
    aPlayer.setAnimation(aAnimStand);
    // Pętla gry
    function gameLoop() {
        aContext === null || aContext === void 0 ? void 0 : aContext.clearRect(0, 0, aCanvas.width, aCanvas.height);
        aBackground.draw();
        aPlayer.draw();
=======
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
>>>>>>> parent of 405d122 (Wersja przepisana z pdf)
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}
