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
    aCanvas.width = 625;
    aCanvas.height = 400;
    aBoard.appendChild(aCanvas);
    // Pobranie kontekstu 2D
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        throw new Error("Nie udało się uzyskać kontekstu 2D.");
    }
    // Tworzenie obiektów gry
    const aBackground = new PlayerType({ nWidth: 625, nHeight: 400 });
    const aPlayer = new PlayerType({
        x: 200,
        y: 280,
        nWidth: 100,
        nHeight: 120,
    });
    // Tworzenie animacji
    const aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
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
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}
