import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";

document.addEventListener("DOMContentLoaded", onReady);

function onReady() {
    const aBoard = document.getElementById("idGame");
    if (!aBoard) {
        console.error("Element #idGame nie został znaleziony w HTML.");
        return;
    }

    const aCanvas = document.createElement("canvas");
    aCanvas.setAttribute("id", "idCanvas");
    aCanvas.width = 640;
    aCanvas.height = 480;
    aBoard.appendChild(aCanvas);

    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        console.error("Nie udało się uzyskać kontekstu 2D dla canvas.");
        return;
    }

    // Inicjalizacja obiektów gry
    const aBackground = new PlayerType({ x: 0, y: 0, nWidth: 640, nHeight: 480 });
    const aPlayer = new PlayerType({
        x: 170,
        y: 50,
        nWidth: 400,
        nHeight: 500,
    });

    const aAnimBackground = new AnimationType({
        strURL: "images/game_background.jpg",
        context: aContext,
    });

    // Zmniejszono nRate, aby animacja była szybsza
    const aAnimPlayer = new AnimationType({
        strURL: "images/game_sprite.png",
        context: aContext,
        nRate: 80, // Szybsza animacja (wcześniej 150 ms)
    });

    // Ustawianie klatek animacji
    aAnimBackground.appendFrame(0, 0);

    aAnimPlayer.appendFrame(0, 0);    // Klatka 1
    aAnimPlayer.appendFrame(98, 0);  // Klatka 2
    aAnimPlayer.appendFrame(196, 0); // Klatka 3
    aAnimPlayer.appendFrame(294, 0); // Klatka 4
    aAnimPlayer.appendFrame(392, 0); // Klatka 5
    aAnimPlayer.appendFrame(490, 0); // Klatka 6

    // Ustaw animacje
    aBackground.setAnimation(aAnimBackground);
    aPlayer.setAnimation(aAnimPlayer);

    // Pętla gry
    function gameLoop() {
        if (!aContext) {
            console.error("Kontekst canvas jest niedostępny w gameLoop.");
            return;
        }

        aContext.clearRect(0, 0, aCanvas.width, aCanvas.height);
        aBackground.draw();
        aPlayer.draw();

        // Opcjonalna ramka dla postaci
        aContext.strokeStyle = "blue";
        aContext.lineWidth = 2;
        aContext.strokeRect(
            aPlayer.kvOptions.x,
            aPlayer.kvOptions.y,
            aPlayer.kvOptions.nWidth,
            aPlayer.kvOptions.nHeight
        );

        requestAnimationFrame(gameLoop);
    }

    aCanvas.style.display = "block";
    requestAnimationFrame(gameLoop);
}
