
/* twine-user-script #44: "KeyboardEvents.js" */
$(document).on("keydown.keygame", function (evt) {
    setup.handleExit(evt.which);
    setup.handleChoices(evt.which);
    setup.handleFightHotkeys(evt.which);
    setup.handleSecretCheats(evt.which);
});

setup.handleChoices = function (keypress) {
    let _links = getTwineLinks();
    let hotkeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let numpad = [97, 98, 99, 100, 101, 102, 103, 104, 105];
    for (let i = 0; i < hotkeys.length && i < hotkeys.length; ++i) {
        console.log("jytjty")
        console.log(numpad[i])
        console.log(keypress)
        if (hotkeys[i].charCodeAt(0) == keypress || numpad[i] == keypress) {
            console.log("ggggg")
            if (i < setup.choiceCount) {
                console.log("dasdasdasds")
                console.log(i)
                console.log(_links)
                _links[i].querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
            }
        }
    }
};

setup.handleFightHotkeys = function (keypress) {
    if (State.variables.FightSkills == undefined)
        return;

    var fightHotkeys = setup.FightHotkeys;
    for (let i = 0; i < fightHotkeys.length && i < State.variables.FightSkills.length; ++i) {
        if (fightHotkeys[i].charCodeAt(0) == keypress) {
            if (State.variables.FightSkills[i].comboCost == undefined) {
                setup.attackPressedLogic(i);
            }
            return;
        }
    }
};

setup.handleSecretCheats = function (keypress) {
    if (keypress == 68) {
        State.variables.SecretCheat++;
    }
};

setup.handleExit = function (keypress) {
    console.log("keypress " + keypress)
    if (keypress == 27 && !Dialog.isOpen()) {
        Dialog.setup("");
        Dialog.wiki(Story.get("Exit_Popup").processText());
        Dialog.open();
    }
};