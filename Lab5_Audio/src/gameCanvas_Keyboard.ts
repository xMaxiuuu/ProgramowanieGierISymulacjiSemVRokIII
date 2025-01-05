const KEY_LEFT: string = "a",
    KEY_RIGHT: string = "d",
    KEY_E: string = "e",
    KEY_UP = " ";

interface MyKeyContainer {
    [key: string]: boolean
};

class KeybordType {
    kvKeys: MyKeyContainer = {};

    constructor() {
        //this.kvKeys = {};

        [KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_E].forEach(aKey => {
            this.kvKeys[aKey] = false
        })

        document.onkeydown = event => {
            if(event.key in this.kvKeys){
                this.kvKeys[event.key] = true
            }
        }
        document.onkeyup = event => {
            if(event.key in this.kvKeys) {
                this.kvKeys[event.key] = false
            }
        }
    }

    isLeft(): boolean {
        return this.kvKeys[KEY_LEFT] && !this.kvKeys[KEY_RIGHT]
    }
    isRight(): boolean {
        return this.kvKeys[KEY_RIGHT] && !this.kvKeys[KEY_LEFT]
    }
    isKick(): boolean {
        return this.kvKeys[KEY_E]
    }
    isJump(): boolean {
        return this.kvKeys[KEY_UP]
    }
}

const Keyboard: KeybordType = new KeybordType();

export { Keyboard as default }