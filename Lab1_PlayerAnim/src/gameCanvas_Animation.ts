export { AnimationType as default }

type MyPoint = {
    x: number;
    y: number;
};

type MyAnimationOptions = {
    strURL: string;
    context: CanvasRenderingContext2D;
    nCurrentFrame: number;
    nRate: number; // Czas trwania klatki w milisekundach
};

// Typy pomocnicze
type SkipByKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OnlyOptional<T, K extends keyof T> = Partial<Pick<T, K>> & Required<SkipByKeys<T, K>>;
type OnlyRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<SkipByKeys<T, K>>;

class AnimationType {
    vFrames: MyPoint[] = []; // Współrzędne klatek animacji
    kvOptions: MyAnimationOptions; // Opcje animacji
    Image: HTMLImageElement; // Obraz z animacją

    constructor(akvOptionsIn: OnlyRequired<MyAnimationOptions, "strURL" | "context">) {
        const akvDefaults: OnlyOptional<MyAnimationOptions, "strURL" | "context"> = {
            nCurrentFrame: 0,
            nRate: 60,
        };
        this.kvOptions = { ...akvDefaults, ...akvOptionsIn };

        // Załaduj obraz
        this.Image = new Image();
        this.Image.src = this.kvOptions.strURL;
    }

    // Dodawanie klatek do animacji
    appendFrame(x: number, y: number) {
        this.vFrames.push({ x, y });
    }

    // Pobierz liczbę klatek
    getNumFrames(): number {
        return this.vFrames.length;
    }

    // Pobierz czas trwania jednej klatki
    getInterval(): number {
        return this.kvOptions.nRate;
    }

    // Ustaw indeks aktualnej klatki
    setCurrentFrameIndex(anIndex: number) {
        this.kvOptions.nCurrentFrame = anIndex;
    }

    // Pobierz indeks aktualnej klatki
    getCurrentFrameIndex(): number {
        return this.kvOptions.nCurrentFrame;
    }

    // Rysowanie aktualnej klatki
    draw(x: number, y: number, nWidth: number, nHeight: number, bFlipH: boolean) {
        const { kvOptions: { context: aContext, nCurrentFrame: anCurrrentFrame } } = this;
        const aFrame: MyPoint = this.vFrames[anCurrrentFrame];

        if (!aFrame || !aContext || !this.Image.complete) {
            return; // Jeśli coś jest niegotowe, nie rysujemy
        }

        if (bFlipH) {
            aContext.save(); // Zachowaj bieżący stan kontekstu
            aContext.scale(-1, 1); // Odbij obraz w poziomie
            aContext.translate(-nWidth + 1, 0); // Dostosuj pozycję

            // Rysuj aktualną klatkę
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, -x, y, nWidth, nHeight);
            aContext.restore()
        } else {
            // Rysowanie bez odbicia
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, x, y, nWidth, nHeight);
        }
    }
}