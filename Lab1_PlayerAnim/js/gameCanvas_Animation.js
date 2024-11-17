export { AnimationType as default };
class AnimationType {
    constructor(akvOptionsIn) {
        this.vFrames = []; // Współrzędne klatek animacji
        const akvDefaults = {
            nCurrentFrame: 0,
            nRate: 60,
        };
        this.kvOptions = Object.assign(Object.assign({}, akvDefaults), akvOptionsIn);
        // Załaduj obraz
        this.Image = new Image();
        this.Image.src = this.kvOptions.strURL;
    }
    // Dodawanie klatek do animacji
    appendFrame(x, y) {
        this.vFrames.push({ x, y });
    }
    // Pobierz liczbę klatek
    getNumFrames() {
        return this.vFrames.length;
    }
    // Pobierz czas trwania jednej klatki
    getInterval() {
        return this.kvOptions.nRate;
    }
    // Ustaw indeks aktualnej klatki
    setCurrentFrameIndex(anIndex) {
        this.kvOptions.nCurrentFrame = anIndex;
    }
    // Pobierz indeks aktualnej klatki
    getCurrentFrameIndex() {
        return this.kvOptions.nCurrentFrame;
    }
    // Rysowanie aktualnej klatki
    draw(x, y, nWidth, nHeight, bFlipH) {
        const { kvOptions: { context: aContext, nCurrentFrame: anCurrrentFrame } } = this;
        const aFrame = this.vFrames[anCurrrentFrame];
        if (!aFrame || !aContext || !this.Image.complete) {
            return; // Jeśli coś jest niegotowe, nie rysujemy
        }
        if (bFlipH) {
            aContext.save(); // Zachowaj bieżący stan kontekstu
            aContext.scale(-1, 1); // Odbij obraz w poziomie
            aContext.translate(-nWidth + 1, 0); // Dostosuj pozycję
            // Rysuj aktualną klatkę
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, -x, y, nWidth, nHeight);
            aContext.restore();
        }
        else {
            // Rysowanie bez odbicia
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, x, y, nWidth, nHeight);
        }
    }
}
