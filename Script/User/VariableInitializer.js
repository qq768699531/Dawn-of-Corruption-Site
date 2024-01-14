
/* twine-user-script #49: "VariableInitializer.js" */
setup.variableInitializer =
{
    initializeFightVariables: function (encounterTarget) {
        this.initializeFightCharacter(State.variables.CharacterSheet_Player);

        let teammate = State.variables.CharacterSheet_Player.fight.teammate;
        if (teammate != undefined) {
            this.initializeFightCharacter(State.variables[teammate]);
        }

        this.initializeFightCharacter(encounterTarget);
        State.variables.FightTurn = 0;
        State.variables.FightSkillsHand = [];

        console.log("starting fight")
        var aList = SimpleAudio.lists.get(setup.getBattleTheme(encounterTarget));
        console.log(aList)

        if (aList.isPlaying() == false) {
            console.log('battle start')
            console.log(State.variables.VolumeControls.music.volume)

            aList.stop();
            aList.shuffle(true);
            aList.loop(true);
            aList.volume(State.variables.VolumeControls.music.volume);
            aList.play();

            State.variables.VolumeControls.music.list.push(setup.getBattleTheme(encounterTarget));
        }
    },
    initializeFightCharacter: function (character) {
        character.fight.variables.currentHP = 0;
        character.fight.variables.currentStamina = 0;
        character.fight.variables.currentArousal = setup.getStatValue(character, "minArousal");
        character.fight.variables.stunnedDuration = 0;
        character.fight.variables.hypnotizedMoveIDsList = [];
        character.fight.variables.cooldowns = [];

        var onFightStartAbilityParams =
        {
            character: character,
        }
        setup.callAbilityTrigger(character, "onFightStart", onFightStartAbilityParams);

        character.fight.variables.currentHP = setup.getMaxHP(character);
        character.fight.variables.currentStamina = setup.getMaxStamina(character);
    }
};

setup.mod =
{
    ADD: 1,
    REMOVE: 2,
    REPLACE: 3,
    CUSTOM: 4,
    IGNORE: 5,
    MULTIPLYPOS: 6,
    MULTIPLYNEG: 7,
};

