const KEY_LEFT = "a", KEY_RIGHT = "d", KEY_E = "e", KEY_UP = " ";
;
class KeybordType {
    constructor() {
        //this.kvKeys = {};
        this.kvKeys = {};
        [KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_E].forEach(aKey => {
            this.kvKeys[aKey] = false;
        });
        document.onkeydown = event => {
            if (event.key in this.kvKeys) {
                this.kvKeys[event.key] = true;
            }
        };
        document.onkeyup = event => {
            if (event.key in this.kvKeys) {
                this.kvKeys[event.key] = false;
            }
        };
    }
    isLeft() {
        return this.kvKeys[KEY_LEFT] && !this.kvKeys[KEY_RIGHT];
    }
    isRight() {
        return this.kvKeys[KEY_RIGHT] && !this.kvKeys[KEY_LEFT];
    }
    isKick() {
        return this.kvKeys[KEY_E];
    }
    isJump() {
        return this.kvKeys[KEY_UP];
    }
}
const Keyboard = new KeybordType();
export { Keyboard as default };
