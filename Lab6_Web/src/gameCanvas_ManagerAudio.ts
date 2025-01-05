type MySoundsCollection = {
    [key: string]: HTMLAudioElement[]
};

class ManagerAdioType {
    strExtenstion: string;
    kvSounds: MySoundsCollection = {};

    constructor(){
        this.strExtenstion = ManagerAdioType.getSupportedExtenstion()
    }

    static getSupportedExtenstion(): string {
        const avAudio: string[][] = [["mp3","audio/mpeg"], ["ogg","audio/ogg"], ["wav", "audio/wav"]],
            aAudio: HTMLAudioElement = new Audio(),
            anElems: number = avAudio.length;
        let astrResult: string, i: number;

        for (i = 0; i < anElems; ++i) {
            astrResult = aAudio.canPlayType(avAudio[i][1])
            if("probably" === astrResult) {
                return avAudio[i][0]
            }
        }

        for (i = 0; i < anElems; ++i) {
            astrResult = aAudio.canPlayType(avAudio[i][1])
            if("maybe" === astrResult) {
                return avAudio[i][0]
            }
        }
        return ""
    }

    play(astrName: string) {
        const aAudio: HTMLAudioElement = this.getAudioElement(astrName)
        aAudio.play()
    }

    getAudioElement(astrName: string): HTMLAudioElement {
        if(this.kvSounds[astrName]) {
            const anElems: number = this.kvSounds[astrName].length;
            for(let i = 0; i < anElems; ++i){
                if(this.kvSounds[astrName][i].ended){
                    return this.kvSounds[astrName][i]
                }
            }
        }
        return this.createAudioElement(astrName)
    }
    createAudioElement(astrName: string): HTMLAudioElement{
        const aAudio: HTMLAudioElement = new Audio("sounds/" + astrName + "." + this.strExtenstion);
        this.kvSounds[astrName] = this.kvSounds[astrName] || []
        this.kvSounds[astrName].push(aAudio)
        return aAudio
    }

    cache(acbDone: () => void, avstrNames: string[]){
        let anCounter: number = avstrNames.length;

        avstrNames.forEach((astrName: string) => {
            const aAudio: HTMLAudioElement = new Audio("sounds/" + astrName + "." + this.strExtenstion);
            aAudio.addEventListener("canplaythrough", function() {
                if(0 >= (--anCounter)) {
                    if (acbDone){
                        acbDone()
                    }
                }
            })
        })
    }
}
const ManagerAdio: ManagerAdioType = new ManagerAdioType();

export { ManagerAdio as default }