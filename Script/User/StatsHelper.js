
/* twine-user-script #28: "StatsHelper.js" */
setup.isStunned = function (character) {
    return character.fight.variables.stunnedDuration > 0;
};

setup.getPronoun = function (character, desc) {
    if (character.info.gender == "male") {
        switch (desc) {
            case "pronoun":
                return "he";
            case "pronounCap":
                return "He";
            case "pronounDepPos":
                return "his";
            case "pronounDepPosCap":
                return "His";
            case "pronounObject":
                return "him";
            case "pronounObjectCap":
                return "Him";
        }
    }

    return "";
};

setup.getSymbioteStats = function () {
    return State.variables.Player_Symbiote_Modifiers_Level_1;
}

setup.applyFightModifier = function (character, modifier) {
    character.fight.variables.fightModifiers.push(modifier);

    for (var propertyName in modifier) {
        if (character.fight.variables[propertyName]) {
            character.fight.variables[propertyName].push(modifier[propertyName]);
        }
    }
};

setup.getValueWithModifier = function (character, valueToModify, propertyName, ignoreAbility) {
    var i;
    var modifiers = setup.getModifiers(character);
    var modifierLines = [];
    var replaceArray = [];

    for (i = 0; i < modifiers.length; i++) {
        let ability = setup.getAbilityByIndex(modifiers[i].abilityIndex);

        for (var modifierPropertyName in modifiers[i]) {
            if (propertyName == modifierPropertyName && ability.id != ignoreAbility) {
                modifierLines.push(modifiers[i][modifierPropertyName]);
            }
        }
    }

    for (i = 0; i < modifierLines.length; i++) {
        if (Array.isArray(modifierLines[i].value)) {
            if (modifierLines[i].mod == setup.mod.ADD) {
                valueToModify.push(...modifierLines[i].value);
            }
            else if (modifierLines[i].mod == setup.mod.REPLACE) {
                replaceArray.push(...modifierLines[i].value);
            }
        }
        else if (!isNaN(modifierLines[i].value)) {
            if (modifierLines[i].mod == setup.mod.ADD) {
                valueToModify = valueToModify + modifierLines[i].value;
            }
            else if (modifierLines[i].mod == setup.mod.REMOVE) {
                valueToModify -= modifierLines[i].value;
            }
        }
    }

    if (!isNaN(valueToModify)) {
        //Apply multipliers after additives
        var multiplier = 1;
        for (i = 0; i < modifierLines.length; i++) {
            if (!isNaN(modifierLines[i].value)) {
                if (modifierLines[i].mod == setup.mod.MULTIPLYPOS) {
                    multiplier += multiplier * modifierLines[i].value;
                }
                else if (modifierLines[i].mod == setup.mod.MULTIPLYNEG) {
                    multiplier -= multiplier * modifierLines[i].value;
                }
            }
        }

        valueToModify = Math.ceil(valueToModify * multiplier);
    }


    if (replaceArray.length > 0) {
        valueToModify = replaceArray;
    }

    for (i = 0; i < modifierLines.length; i++) {
        if (modifierLines[i].mod == setup.mod.REPLACE) {
            valueToModify = modifierLines[i].value;
        }
    }

    return valueToModify;
};

setup.updateArousal = function (character) {
    var arousalGain = setup.getArousalGain(character);
    character.fight.variables.currentArousal += arousalGain;
    if (character.fight.variables.currentArousal >= 100) {
        character.fight.variables.currentArousal = 100;
        var params =
        {
            trigger: setup.AbilityTrigger.ON_MAX_LUST,
            self: character,
        }

        if (character.id == "CharacterSheet_Player") {
            return character.broadcastAbilityTrigger(params) + "\n\n";
        } else {
            return character.broadcastAbilityTrigger(params)
        }

    }
    else if (character.fight.variables.currentArousal < setup.getStatValue(character, "minArousal")) {
        character.fight.variables.currentArousal = setup.getStatValue(character, "minArousal");

        var params =
        {
            trigger: setup.AbilityTrigger.ON_MIN_LUST,
            self: character,
        }
        return character.broadcastAbilityTrigger(params) + "\n\n";
    }

    return "";
};

setup.applyCorruption = function (character, amount) {
    var previousCorruption = setup.getStatValue(character, "corruption");

    if (character.id == "CharacterSheet_Player") {
        //Corruption of the player is applied with Ability_ProcessingCorruption
    }
    else {
        if (character.info.corruption + amount < 0) {
            amount = character.info.corruption * -1;
        }

        console.log("adding " + amount);
        setup.addToBaseStatValue(character, "corruption", amount)

        if (setup.getStatValue(character, "corruption") >= 150) {
            setup.completeAchievement("Achievement_BaptismInCorruption");
        }
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_GAIN_CORRUPTION,
        self: character,
        gainedCorruption: amount,
    }
    character.broadcastAbilityTrigger(params);

    if (character.info.name == State.variables.CharacterSheet_Player.info.name) {
        //did we change tier?
        if (setup.getCorruptionTierFromValue(previousCorruption) != setup.getCorruptionTier(character)) {
            setup.updateStaticCorruptionUI(character);
        }
    }
};

setup.applyDailyCorruption = function (character) {
    let amount = State.variables.CharacterSheet_Player.info.accumulatedCorruption + setup.getStatValue(State.variables.CharacterSheet_Player, "corruptionPerDay");
    var previousCorruption = setup.getStatValue(character, "corruption");

    if (character.info.corruption + amount < 0) {
        amount = character.info.corruption * -1;
    }

    if (character.info.accumulatedCorruption > 0) {
        character.info.accumulatedCorruption = Math.max(0, character.info.accumulatedCorruption + setup.getStatValue(State.variables.CharacterSheet_Player, "corruptionPerDay"))
    }

    setup.addToBaseStatValue(character, "corruption", amount)

    if (character.info.name == State.variables.CharacterSheet_Player.info.name) {
        //did we change tier?
        if (setup.getCorruptionTierFromValue(previousCorruption) != setup.getCorruptionTier(character)) {
            setup.updateStaticCorruptionUI(character);
        }
    }
}

setup.updateStaticCorruptionUI = function (character) {
    var corruption = setup.getStatValue(character, "corruption");
    var story = document.getElementById("story");
    story.className = setup.getCorruptionUIClassName(window.screenClass, corruption);

    var uibar = document.getElementById("ui-bar");
    uibar.className = setup.getCorruptionUIClassName("Sidebar", corruption);

    //document.getElementById("topBorderImage").src = setup.getBorderTop();
    //document.getElementById("bottomBorderImage").src = setup.getBordeBottom();

    //initialized in runtime
    var rowLogo = document.getElementById("stat-container-row-logo");
    if (rowLogo) {
        document.getElementById("stat-container-row-logo").src = setup.getStatWindowLogo(character);
    }
}

setup.getCorruptionTier = function (character) {
    let corruption = setup.getStatValue(character, "corruption");

    return setup.getCorruptionTierFromValue(corruption);
};

setup.getCorruptionTierFromValue = function (corruption) {
    let tier = 0;

    for (let i = 0; i < setup.corruptionTiers.length; i++) {
        if (i == setup.corruptionTiers.length - 1) {
            //we are at max tier
            tier = setup.corruptionTiers.length - 1;
            break;
        }

        if (corruption >= setup.corruptionTiers[i] && corruption < setup.corruptionTiers[i + 1]) {
            tier = i;
            break;
        }
    }

    return tier;
}

setup.getCorruptionUIClassName = function (baseClass, corruption) {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return baseClass + " Corrupt0";
        case 1:
            return baseClass + " Corrupt25";
        case 2:
            return baseClass + " Corrupt50";
        case 3:
            return baseClass + " Corrupt75";
        case 4:
            return baseClass + " Corrupt100";
        default:
            return baseClass + " Corrupt100";
    }
}

setup.getStatWindowLogo = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_stats_border_top_middle_100.png";
    }
}

setup.getProgressBarImage = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_border_100.png";
    }
}

setup.getEXPBarImage = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_border_100.png";
    }
}

setup.getProgressBarBackground = function (statName) {
    switch (statName) {
        case "Health":
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_back_health.png";
        case "Stamina":
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_back_stamina.png";
        case "Arousal":
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_back_arousal.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_stats_back_arousal.png";
    }
}

setup.getSaveIcon = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_save_100.png";
    }
}

setup.getResetIcon = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_erase_100.png";
    }
}

setup.getAchievementIcon = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_button_achievement_100.png";
    }
}

setup.getSideBarButton = function () {
    var corruptionTier = setup.getCorruptionTier(State.variables.CharacterSheet_Player)
    if (UIBar.isStowed()) {
        switch (corruptionTier) {
            case 0:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt0.png";
            case 1:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt25.png";
            case 2:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt50.png";
            case 3:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt75.png";
            case 4:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt100.png";
            default:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_expand_corrupt100.png";
        }
    }
    else {
        switch (corruptionTier) {
            case 0:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt0.png";
            case 1:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt25.png";
            case 2:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt50.png";
            case 3:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt75.png";
            case 4:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt100.png";
            default:
                return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/ui_button_collapse_corrupt100.png";
        }
    }
}

setup.getBorderTop = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_100.png";
    }
}

setup.getBordeBottom = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_0.png";
        case 1:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_25.png";
        case 2:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_50.png";
        case 3:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_75.png";
        case 4:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_100.png";
        default:
            return "https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_100.png";
    }
}

setup.onVillageEnterCallback = function () {
    //save file hack
    if (State.variables.VolumeControls == undefined) {
        State.variables.VolumeControls =
        {
            master:
            {
                volume: 0.2,
            },
            music:
            {
                volume: 0.2,
                list: [],
            },
            voices:
            {
                volume: 0.8,
                list: [],
            },
            sfx:
            {
                volume: 1,
                list: [],
            },
        };
    }

    var currentPassage = Story.get(State.peek().title);

    if (State.variables.InNyxDungeon == false && currentPassage.tags && currentPassage.tags.includes("NyxCastle")) {
        //enter dungeon
        State.variables.InNyxDungeon = true;

        if (!Save.slots.has(7) || Save.slots.get(7).title == "Autosave") {
            Save.slots.save(7, "Autosave");
        }

        var aList = SimpleAudio.lists.get("nyx_dungeon_theme");
        if (aList.isPlaying() == false) {
            State.variables.VolumeControls.music.list = [];

            console.log('NyxCastle start')
            console.log(State.variables.VolumeControls.music.volume)
            aList.stop();
            aList.shuffle(true);
            aList.loop(true);
            aList.volume(State.variables.VolumeControls.music.volume);
            aList.play();

            State.variables.VolumeControls.music.list.push("nyx_dungeon_theme");
        }
    }
    else if (State.variables.InNyxDungeon == true && (!currentPassage.tags || !currentPassage.tags.includes("NyxCastle"))) {
        //exit dungeon
        State.variables.InNyxDungeon = false;
        State.variables.VolumeControls.music.list = [];

        if (SimpleAudio.lists.get("nyx_dungeon_theme").isPlaying()) {
            console.log('NyxCastle end')
            //leaving overworld
            SimpleAudio.lists.get("nyx_dungeon_theme").fadeOut(2);
        }
    }

    if (currentPassage.tags && currentPassage.tags.includes("Overworld")) {
        if (State.variables.InOverworld == false || State.variables.InOverworld == undefined) {
            State.variables.CharacterSheet_Shard_Ring.quest.cockOut = false;
            State.variables.CharacterSheet_Lost_Naga.quest.cockOut = false;

            State.variables.CharacterSheet_Abel.quest.available_flavourDialogue_sexMaxRela_daily = true;

            State.variables.InOverworld = true;
            setup.addDays(1);

            if (State.variables.CharacterSheet_Player.quest.lostPrisonerUntied == true && State.variables.CharacterSheet_Player.quest.lostPrisonerEscaped == false) {
                State.variables.CharacterSheet_Player.quest.lostPrisonerEscaped = true;
                State.variables.CharacterSheet_Lost_Prisoner.quest.locked = false;
                State.variables.CharacterSheet_Lost_Prisoner.quest.tentaclesOut = false;
            }

            State.variables.CharacterSheet_Player.quest.lostPrisonerRelaxed = false;

            if (!Save.slots.has(7) || Save.slots.get(7).title == "Autosave") {
                Save.slots.save(7, "Autosave");
            }

            switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
                case 0:
                    State.variables.PlayingVillageTheme = "village_bgm1";
                    break;
                case 1:
                    State.variables.PlayingVillageTheme = "village_bgm2";
                    break;
                case 2:
                    State.variables.PlayingVillageTheme = "village_bgm3";
                    break;
                case 3:
                    State.variables.PlayingVillageTheme = "village_bgm4";
                    break;
                default:
                    State.variables.PlayingVillageTheme = "village_bgm4";
                    break;
            }

            console.log(State.variables.PlayingVillageTheme);
            console.log(setup.getCorruptionTier(State.variables.CharacterSheet_Player));

            var aList = SimpleAudio.lists.get(State.variables.PlayingVillageTheme);
            if (aList.isPlaying() == false) {
                State.variables.VolumeControls.music.list = [];

                console.log('village start')
                console.log(State.variables.VolumeControls.music.volume)
                aList.stop();
                aList.shuffle(true);
                aList.loop(true);
                aList.volume(State.variables.VolumeControls.music.volume);
                aList.play();

                State.variables.VolumeControls.music.list.push(State.variables.PlayingVillageTheme);
            }
        }
    }
    else {
        if (State.variables.InOverworld == true && State.variables.PlayingVillageTheme != undefined) {
            if (SimpleAudio.lists.get(State.variables.PlayingVillageTheme).isPlaying()) {
                //leaving overworld
                SimpleAudio.lists.get(State.variables.PlayingVillageTheme).fadeOut(2);
            }
        }

        State.variables.InOverworld = false;
    }
};

setup.saveFightAttributes = function (character) {
    character.fight.variables = State.variables.FightVariables;
    State.variables[character.id].info = character.info;
    State.variables[character.id].fight = character.fight;

    SimpleAudio.lists.get(setup.getBattleTheme(character)).fadeOut(2);
}

setup.getBattleTheme = function (character) {
    if (character.id == "CharacterSheet_Apothus_2nd_Form") {
        return "final_boss_bgm"
    }

    if (character.id == "CharacterSheet_MQ002_NyxParasite" || character.id == "CharacterSheet_Doppleganger" || character.id == "CharacterSheet_MQ002_DragonMonk") {
        return "nyx_dungeon_battle"
    }

    if (character.id == "CharacterSheet_Ethrex") {
        return "battle_bgm_hard"
    }

    if (character.id == "CharacterSheet_Imp") {
        return "battle_bgm"
    }

    if (character.fight.fightReward >= setup.RewardTier.HIGH) {
        return "battle_bgm_hard"
    }
    else {
        return "battle_bgm"
    }
}

setup.applyGrowth = function (character, type, amount) {
    switch (type) {
        case "cock":
            if (!setup.hasLimb(character.info.anatomy, "cocks")) {
                return 0;
            }
            break;
        case "muscles":
            if (!setup.hasLimb(character.info.anatomy, "arms") &&
                !setup.hasLimb(character.info.anatomy, "pecs") &&
                !setup.hasLimb(character.info.anatomy, "abdominals") &&
                !setup.hasLimb(character.info.anatomy, "legs")) {
                return 0;
            }
            break;
        case "balls":
            if (!setup.hasLimb(character.info.anatomy, "balls")) {
                return 0;
            }
            break;
    }

    var multiplier = setup.getStatValue(character, "growthMultiplier");

    amount *= multiplier;

    if (amount > 0) {
        switch (type) {
            case "cock":
                amount += setup.getStatValue(character, "bonusGrowthCock");
                break;
            case "muscles":
                amount += setup.getStatValue(character, "bonusGrowthMuscles");
                break;
            case "height":
                amount += setup.getStatValue(character, "bonusGrowthHeight");
                break;
            case "balls":
                amount += setup.getStatValue(character, "bonusGrowthBalls");
                break;
        }
    }

    //because .tofixed turns it into a string lmao what a joke
    var growth = Math.round(amount * 100) / 100;

    switch (type) {
        case "cock":
            setup.addToBaseStatValue(character, "cock", growth);
            break;
        case "muscles":
            setup.addToBaseStatValue(character, "muscles", growth);
            break;
        case "height":
            setup.addToBaseStatValue(character, "height", growth);
            break;
        case "balls":
            setup.addToBaseStatValue(character, "balls", growth);
            break;
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_APPLY_GROWTH,
        self: character,
    }
    character.broadcastAbilityTrigger(params);

    return growth;
}

setup.displayCorruptSidebar = function (character) {
    var displayString = "";

    displayString += "<span class='corruptText100'>";
    displayString += "<span class='glitch nyx fucked' data-text='̶̱̍̔ɟ̷͓͔̌ı̴͕͇͎̊ɹ̴̗͇͂͑̀ͅs̴̰͖̆ʇ̷̴͇͕͛́͘Ṫ̶̖Ḩ̵̰̈Ȅ̷̥̄ ̴̛̣̟̃Ā̸͜G̴͇̗̅͝Ḙ̴͋͐ ̶̪̖̑O̸̙͛̀F̴̡̖̊͆ ̸̠̥̇͐N̴̬͑Y̸̰̔X̴͚́ɟ̷͓͔̌ı̴͕͇͎̊ɹ̴̗͇͂͑̀ͅs̴̰͖̆ʇ̷͇͛ '>̶̱̍̔ɟ̷͓͔̌ı̴͕͇͎̊ɹ̴̗͇͂͑̀ͅs̴̰͖̆ʇ̷͇͛ THE AGE OF NYXɟ̷͓͔̌ı̴͕͇͎̊ɹ̴̗͇͂͑̀ͅs̴̰͖̆ʇ̷͇͛ </span> \n";
    displayString += "<div id='SidebarDivisionTop'>" + setup.getCorruptSidebarDividerTop() + "</div>";
    displayString += "<div class='stat-window-offset'>"
    displayString += "<div class='info-row'>"
    displayString += "<div class='info-column1 corruptText100'>"
    displayString += "CORRUPTION\n"
    displayString += "CORRUPTION\n"
    displayString += "CORRUPTION\n"
    displayString += "</div>";
    displayString += "<div class='info-column2'>"
    displayString += "ɥ̸̡̌̆͒̕͠ƃ̶̤͔̦̳̰͋͊̐͐̂ı̴̛͎̠̂́͝ɥ̶̲̜̎̏̐́̚ ̷̟͉̮͑͜ʎ̷̧̺͎͉̘̻̒̈́̍͗̿ן̶̛̲̝̱̈́́͘ן̵̖̣̖͇̘̈́̀̾̾͘ɐ̸̨͈͌̅ı̸̻͔͕̩̓̄̇̒͠ʇ̵̤̠̠͖̈̉͌̊͛͝͝u̸͔̰̟̖͐̎̏ͅǝ̷̧̭̗̰̱̜̩̀̄̆̋̊͆ͅu̸͙̼̜̭̺̓͛͌͆̏̕͜ȍ̵̭͓̼̑̿d̸̙̜̺͙̓͑̂͝x̵̬̣͇̍́̎̉̇̅ǝ̸͋̒̃̋͗̓͊͜͠\n"
    displayString += "̷̺͖̻̟̫̱̹͐̎̿͑̅̔͘ȋ̶̤͎͓͇̪̪͚̂ᴎ̸̥͉͎͈̳̏̃̆͜ꟻ̶̡͍̯͙̪͙̋̈́̏͐̎̎ì̴̢̡͚̜̭̳̭̫͓̉̕ᴎ̶̈́̄̃ͅͅi̶̻̜͓̘̗̯̊͗̔̍͒́̉͝T̸̩̭͈̞̣̳͆ɘ̵̳̥̲͖̳̈́̌̓́̍̚͜͠͝\n"
    displayString += "̸̧̻͎͔̗̪́͝A̴̧̯̪̬̘̙̝̿̌͊l̷͍͎͆̒̔̅̄̒͛̄͠l̴͇͚̾̂ ̸̰̼̟͇͍̮̙̤̰̊Ↄ̵̢̘̺̪̮̙͖͙̞̉͊͐ô̵̖̦͍̯͇̫͙̠̒͐̄̈̾͒̚ᴎ̷̲͈̘͔̞̙̪̰͋ꙅ̴̦̟͔̂̓͂̃U̸̫̞̻͉̝͔͕̠͕̇m̸̙̬͎̻͕͔͙̓͗̂͗̃̓̕͝ị̷̧̧̡̛͈̝͖͓̙̀̄̃̆̕ᴎ̸̛̹̻̃̾̔͛̿̂̂͝g̶̢̞̪͐̓͛̀̋́̈́́̕\n"
    displayString += "</div>";
    displayString += "</div>";
    displayString += "<div class='statBarContainer'>";
    displayString += setup.displayStatProgressBar(character, "Arousal", 99999999, 99999999, "ArousalProgress");
    displayString += "<div class='stat-perturn'>";
    displayString += setup.displaySign(setup.getArousalGain(character)) + setup.displayStatValue(character, "arousalGain");
    displayString += " <span style='color:#d600b2'>per turn </span></div>";
    displayString += "</div>";
    displayString += "</div>";
    displayString += "<div class='statBarContainer'>";
    displayString += setup.displayStatProgressBar(character, "Arousal", 99999999, 99999999, "ArousalProgress");
    displayString += "<div class='stat-perturn'>";
    displayString += setup.displaySign(setup.getArousalGain(character)) + setup.displayStatValue(character, "arousalGain");
    displayString += " <span style='color:#d600b2'>per turn </span></div>";
    displayString += "</div>";
    displayString += "</div>";
    displayString += "<div class='statBarContainer'>";
    displayString += setup.displayStatProgressBar(character, "Arousal", undefined, 99999999999, "ArousalProgress");
    displayString += "<div class='stat-perturn'>";
    displayString += setup.displaySign(setup.getArousalGain(character)) + setup.displayStatValue(character, "arousalGain");
    displayString += " <span style='color:#d600b2'>per turn </span></div>";
    displayString += "</div>";
    displayString += "</div>";
    displayString += "</span>";

    return displayString;
}

setup.displayInfoStats = function (character) {
    var cycle = State.variables.Cycle;
    var expedition = State.variables.Expedition;
    var displayString = "";

    displayString += "<span class='DateText'>" + setup.ordinal_suffix(expedition) + " Expedition of the " + setup.ordinal_suffix(cycle) + " Cycle</span>";
    displayString += "<div id='SidebarDivisionTop'>" + setup.getCorruptSidebarDividerTop() + "</div>";
    displayString += "<div class='PlayerDescriptor'>";
    displayString += "<span class='PlayerName'>" + State.variables.CharacterSheet_Player.info.name.toUpperCase() + "</span>\n";
    displayString += "<span class='LevelText'>Lvl " + State.variables.Level + "</span> <span class='PlayerRace'>" + setup.getRace(State.variables.CharacterSheet_Player.info.anatomy).toUpperCase() + "</span>\n";
    displayString += "</div>";
    displayString += "<div id='LevelBarContainer'>";
    displayString += "<div class='ProgressBarRow'>"
    displayString += "<div class='ProgressBarColumn1'>"
    displayString += "Next"
    displayString += "</div>";
    displayString += "<div class='ProgressBarColumn2'>"

    if (State.variables.Exp >= setup.getXPRequirement(State.variables.Level)) {
        displayString += 0;
    }
    else {
        displayString += (setup.getXPRequirement(State.variables.Level) - State.variables.Exp).toFixed(2).replace(/\.00$/, '');
    }

    displayString += "</div>";
    displayString += "</div>";
    displayString += "<div id='LevelBarContent'>";
    displayString += "<progress id='LevelProgress' @value='" + (State.variables.Exp - setup.getXPRequirement(State.variables.Level - 1)) + "' @max='" + setup.getXPRequirement(State.variables.Level) + "'></progress>";
    displayString += "</div>";
    displayString += "<div id='LevelBarBorder'><img src='" + setup.getEXPBarImage(character) + "'></div>";
    displayString += "<div class='ProgressBarBackground'><img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_bar_level_empty.png'></div>";
    displayString += "</div>";
    displayString += "<div class='info-container'>"
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>"
    displayString += "<dt>ESSENCE</dt>"
    displayString += "<dd>" + State.variables.Essence.toFixed(2).replace(/\.00$/, '') + "</dd>"
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>"
    displayString += "<dt>CORRUPTION</dt>"

    if (State.variables.CharacterSheet_Player.info.accumulatedCorruption > 0) {
        let perDay = State.variables.CharacterSheet_Player.info.accumulatedCorruption;
        displayString += "<dd>" + setup.displayStatValue(State.variables.CharacterSheet_Player, "corruption") + " + " + perDay + " daily</dd>"
    }
    else {
        displayString += "<dd>" + setup.displayStatValue(State.variables.CharacterSheet_Player, "corruption") + "</dd>"
    }
    displayString += "</div>";
    displayString += "</div>";

    return displayString;
}

setup.ordinal_suffix = function (i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

setup.displayFightStats = function (character) {
    var displayString = "";

    displayString += "<div class='fightStatContainer'>"
    displayString += "<div class='statBarContainer'>";
    if (character.fight.variables.currentHP != undefined) {
        displayString += setup.displayStatProgressBar(character, "Health", "currentHP", setup.getMaxHP(character), "HPProgress");
    }
    else {
        displayString += setup.displayStatProgressBar(character, "Health", undefined, setup.getMaxHP(character), "HPProgress");
    }
    displayString += "<div class='stat-perturn'>";
    displayString += "&nbsp;";
    displayString += "</div>";
    displayString += "</div>";

    if (character.hasAbility("Ability_HostOfEcho")) {
        displayString += "<div class='statBarContainer'>";
        if (character.fight.variables.currentStamina != undefined) {
            displayString += setup.displayStatProgressBar(character, "Arousal", "currentArousal", 100, "ArousalProgress");
        }
        else {
            displayString += setup.displayStatProgressBar(character, "Arousal", undefined, 100, "ArousalProgress");
        }

        displayString += "<div class='stat-perturn'>";
        displayString += setup.displaySign(setup.getArousalGain(character)) + setup.displayStatValue(character, "arousalGain");
        displayString += " <span style='color:#d600b2'>per turn </span></div>";
        displayString += "</div>";
    }
    displayString += "</div>";

    displayString += "<div class='fight-stat-window-offset'>";
    displayString += "<div id='stat-container'>";
    displayString += "<div id='stat-container-row' class='" + setup.getCorruptionUIClassName(setup.getCorruptTextClass(character), setup.getStatValue(character, "corruption")) + "'>";
    displayString += "<img id='stat-container-row-logo' src='" + setup.getStatWindowLogo(character) + "'>";

    if (State.variables.DisplayStatWindow) {
        displayString += "<div id='statButtonText' class='stat-container-column-active'>";
    }
    else {
        displayString += "<div id='statButtonText'>";
    }

    displayString += "<<click '<span>STATS</span>'>>";
    displayString += "<<if $DisplayStatWindow == false>>";
    displayString += "<<toggleclass '#StatsWindow' 'hidden'>>";
    displayString += "<<toggleclass '#statButtonText' 'stat-container-column-active'>>";
    displayString += "<<toggleclass '#abilitiesButtonText' 'stat-container-column-active'>>";
    displayString += "<<toggleclass '#AbilitiesWindow' 'hidden'>>";
    displayString += "<</if>>";
    displayString += "<<set $DisplayStatWindow = true>>";
    displayString += "<</click>>";
    displayString += "</div>";

    if (State.variables.DisplayStatWindow) {
        displayString += "<div id='abilitiesButtonText'>";
    }
    else {
        displayString += "<div id='abilitiesButtonText' class='stat-container-column-active'>";
    }

    displayString += "<<click '<span>ABILITIES</span>'>>";
    displayString += "<<if $DisplayStatWindow == true>>";
    displayString += "<<toggleclass '#StatsWindow' 'hidden'>>";
    displayString += "<<toggleclass '#statButtonText' 'stat-container-column-active'>>";
    displayString += "<<toggleclass '#abilitiesButtonText' 'stat-container-column-active'>>";
    displayString += "<<toggleclass '#AbilitiesWindow' 'hidden'>>";
    displayString += "<</if>>";
    displayString += "<<set $DisplayStatWindow = false>>";
    displayString += "<</click>>";
    displayString += "</div>";
    displayString += "</div>";
    displayString += "</div>";

    displayString += "<div class='" + setup.getCorruptionUIClassName("stat-container", setup.getStatValue(character, "corruption")) + "'>";

    if (State.variables.DisplayStatWindow) {
        displayString += "<div id='StatsWindow'>";
    }
    else {
        displayString += "<div id='StatsWindow' class='hidden'>";
    }
    displayString += "<div class='stats-combat'>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt data-short='STR'><span>STRENGTH</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "strength") + "</dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt data-short='PRO'><span>PROWESS</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "stamina") + "</dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt data-short='CRIT'><span>CRIT %</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "critChance") + "%</dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt data-short=''><span>CRIT DMG</span></dt>";
    displayString += "<dd>× " + setup.displayStatValue(character, "critDamage") + "</dd>";
    displayString += "</div>";
    displayString += "<div class='SidebarDivisionMid'>" + setup.getCorruptSidebarDividerMid() + "</div>";
    displayString += "</div>";
    displayString += setup.displayBodyStats(character);
    displayString += "</div>";

    var classname = setup.getCorruptionUIClassName("dummy", setup.getStatValue(character, "corruption"));
    if (!State.variables.DisplayStatWindow) {
        displayString += "<div id='AbilitiesWindow' class='" + classname + "'>";
    }
    else {
        displayString += "<div id='AbilitiesWindow' class='hidden " + classname + "'>";
    }
    displayString += "<div id='AbilitiesWindowContentList'>";
    displayString += setup.displayAbilityCategoryIcons(character);
    displayString += setup.displayPersistentAbilities(character);
    displayString += "</div>";
    displayString += "</div>";

    displayString += "</div>";
    displayString += "</div>";

    return displayString;
};

setup.displayStatProgressBar = function (character, statName, currentStatVariable, statValue, statStyle) {
    var displayString = "";

    console.log(statValue)
    var statValueString = statValue.toFixed(0);

    var statNameColor = undefined;
    var statValueName = "";

    switch (statName) {
        case "Health":
            statNameColor = "#ff6767"
            statValueName = "hp"
            break;
        case "Stamina":
            statNameColor = "#42ff87"
            statValueName = "stamina"
            break;
        case "Arousal":
            statNameColor = "#ff5ae3"

            break;
    }

    displayString += "<div class='ProgressBarContainer'>";
    displayString += "<div class='ProgressBarContent'>";

    if (statNameColor == undefined) {
        displayString += "<div class='ProgressBarName'>";
    }
    else {
        displayString += "<div class='ProgressBarName' style='color:" + statNameColor + "'>";
    }

    displayString += statName;
    displayString += "</div>";

    if (currentStatVariable == undefined) {
        if (statName == "Arousal") {
            displayString += "<progress id='" + statStyle + "' @value=\"" + 0 + "\" @max=\"" + statValueString + "\"></progress>";
        }
        else {
            displayString += "<progress id='" + statStyle + "' @value=\"" + statValueString + "\" @max=\"" + statValueString + "\"></progress>";
        }
    }
    else {
        displayString += "<progress id='" + statStyle + "' @value=\"$CharacterSheet_Player.fight.variables." + currentStatVariable + "\" @max=\"" + statValueString + "\"></progress>";
    }

    displayString += "</div>";
    displayString += "<div class='ProgressBarBackground'><img src='" + setup.getProgressBarBackground(statName) + "'></div>";
    displayString += "<div class='ProgressBarBorder'><img src='" + setup.getProgressBarImage(character) + "'>";
    displayString += "<div class='ProgressBarText'>";

    if (currentStatVariable == undefined) {
        if (statName == "Arousal") {
            if (State.variables.CorruptSidebar) {
                displayString += statValueString + " / " + statValueString;
            }
            else {
                displayString += "0 / " + statValueString;
            }
        }
        else {
            displayString += statValueString + " / " + setup.displayStatValue(character, statValueName);
        }
    }
    else {
        if (statName == "Arousal") {
            displayString += "$CharacterSheet_Player.fight.variables." + currentStatVariable + " / " + statValueString;
        }
        else {
            displayString += "$CharacterSheet_Player.fight.variables." + currentStatVariable + " / " + setup.displayStatValue(character, statValueName);
        }

    }

    displayString += "</div>";
    displayString += "</div>";

    displayString += "</div>";

    return displayString;
}

setup.displayBodyStats = function (character) {
    var displayString = "";
    displayString += "<div class='stats-body'>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt><span>BODY TYPE</span></dt>";
    displayString += "<dd>" + "<<nobr>>" + setup.getMusclesDescriptor(character) + "&nbsp;(" + setup.displayStatValue(character, "muscles") + ")<</nobr>></dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt><span>HEIGHT</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "height", true) + "</dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt><span>COCK SIZE</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "cock", true) + "</dd>";
    displayString += "</div>";
    displayString += "<div class='info-row " + setup.getCorruptTextClass(character) + "'>";
    displayString += "<dt><span>BALLS SIZE</span></dt>";
    displayString += "<dd>" + setup.displayStatValue(character, "balls", true) + "</dd>";
    displayString += "</div>";
    displayString += "</div>";

    return displayString;
}

setup.getCorruptTextClass = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "corruptText0";
        case 1:
            return "corruptText25";
        case 2:
            return "corruptText50";
        case 3:
            return "corruptText75";
        case 4:
            return "corruptText100";
        default:
            return "corruptText100";
    }
}

setup.getCorruptBackgroundClass = function (character) {
    switch (setup.getCorruptionTier(character)) {
        case 0:
            return "corruptBackground0";
        case 1:
            return "corruptBackground25";
        case 2:
            return "corruptBackground50";
        case 3:
            return "corruptBackground75";
        case 4:
            return "corruptBackground100";
        default:
            return "corruptBackground100";
    }
}

setup.getCorruptSidebarDividerMid = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_0.png'>";
        case 1:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_25.png'>";
        case 2:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_50.png'>";
        case 3:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_75.png'>";
        case 4:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_100.png'>";
        default:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_mid_100.png'>";
    }
}

setup.getCorruptSidebarDividerTop = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_0.png'>";
        case 1:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_25.png'>";
        case 2:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_50.png'>";
        case 3:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_75.png'>";
        case 4:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_100.png'>";
        default:
            return "<img src='https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/side_bar/ui_sidebar_division_top_100.png'>";
    }
}

setup.getAbilitiesPowerIcon = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt0.png">';
        case 1:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt25.png">';
        case 2:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt50.png">';
        case 3:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt75.png">';
        case 4:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt100.png">';
        default:
            return '<img title="Perks" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_power_corrupt100.png">';
    }
}

setup.getAbilitiesAlterationIcon = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt0.png">';
        case 1:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt25.png">';
        case 2:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt50.png">';
        case 3:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt75.png">';
        case 4:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt100.png">';
        default:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_alteration_corrupt100.png">';
    }
}

setup.getAbilitiesStatusEffectsIcon = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt0.png">';
        case 1:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt25.png">';
        case 2:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt50.png">';
        case 3:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt75.png">';
        case 4:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt100.png">';
        default:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_statuseffect_corrupt100.png">';
    }
}

setup.getAbilitiesGlobalIcon = function () {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt0.png">';
        case 1:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt25.png">';
        case 2:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt50.png">';
        case 3:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt75.png">';
        case 4:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt100.png">';
        default:
            return '<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/Abilities/ui_abilities_global_corrupt100.png">';
    }
}

setup.getAbilityCategoryIcon = function (category) {
    var displayString = "";

    switch (category) {
        case 0:
            displayString += setup.getAbilitiesPowerIcon();
            break;
        case 1:
            displayString += setup.getAbilitiesAlterationIcon();
            break;
        case 2:
            displayString += setup.getAbilitiesStatusEffectsIcon();
            break;
        case 3:
            displayString += setup.getAbilitiesGlobalIcon();
            break;
        default:
            displayString += setup.getAbilitiesGlobalIcon();
            break;
    }

    displayString += setup.getUnseenAbilitiesAmount(category);

    console.log("displayAbilityCategoryIcons")
    console.log(category)

    displayString += "<<link \"<div " + setup.displayAbilityCategoryTitleElement(category) + " class='AbilityCategoryHighlight" + setup.isAbilityCategorySelected(category) + "'></div>\">>";
    displayString += '<<replace "#AbilitiesWindowContentList">>';
    displayString += '<<set $SelectedAbilityFilter = ' + category + '>>';
    displayString += '<<print setup.displayAbilityCategoryIcons(State.variables.CharacterSheet_Player)>>';
    displayString += '<<print setup.displayPersistentAbilities(State.variables.CharacterSheet_Player)>>';
    displayString += '<</replace>>';
    displayString += '<</link>>';

    return displayString
}

setup.displayAbilityCategoryTitleElement = function (category) {
    var displayString = "";

    switch (category) {
        case 0:
            displayString += "title='Perks'";
            break;
        case 1:
            displayString += "title='Alterations'";
            break;
        case 2:
            displayString += "title='Status Effects'";
            break;
        case 3:
            displayString += "title='Global Effects'";
            break;
        default:
            displayString += "title='Global Effects'";
            break;
    }

    return displayString;
}

setup.displayAbilityCategoryIcons = function (character) {
    var displayString = "";

    displayString += '<div class="AbilityCategoryIconsContainer">';
    displayString += '<div class="AbilityCategoryIconsContainerInternal">';
    displayString += '<div class="AbilityCategoryIconButton Powers">';
    displayString += setup.getAbilityCategoryIcon(0);
    displayString += '</div>';
    displayString += '<div class="AbilityCategoryIconButton Alteration">';
    displayString += setup.getAbilityCategoryIcon(1);
    displayString += '</div>';
    displayString += '<div class="AbilityCategoryIconButton StatusEffects">';
    displayString += setup.getAbilityCategoryIcon(2);
    displayString += '</div>';
    displayString += '<div class="AbilityCategoryIconButton Global">';
    displayString += setup.getAbilityCategoryIcon(3);
    displayString += '</div>';
    displayString += '</div>';
    displayString += '</div>';

    return displayString;
}

setup.isAbilityCategorySelected = function (category) {
    var displayString = "";

    if (category == State.variables.SelectedAbilityFilter) {
        displayString += " selected"

        console.log("selected")
    }


    return displayString;
}

setup.displayPersistentAbilities = function (character) {
    var displayString = "";
    var abilities = character.abilityHandler.abilityRuntimeDatas;

    var i;
    for (i = 0; i < abilities.length; i++) {
        if (abilities[i].isActive == false) {
            continue;
        }

        let ability = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        if (ability.filter != State.variables.SelectedAbilityFilter) {
            continue;
        }

        var modifier = abilities[i].modifier;
        var rankString = setup.displayRankText(abilities[i]);

        displayString += "<span class='AbilityContainer'>"
        if (abilities[i].seen == false) {
            abilities[i].seen = true;
            displayString += "<div class='AbilityNotificationBlipContainer'>"
            displayString += "<div class='AbilityHeaderNotificationBlip'></div>"
            displayString += "</div>"
        }

        displayString += "<details class='PassiveAbility'>";

        displayString += "<summary class='" + setup.getCorruptionUIClassName("PassiveAbilityHeader", setup.getStatValue(character, "corruption")) + "'>" + ability.name + " " + rankString + "</summary>";
        displayString += "<p class='PassiveAbilityBody' >";

        displayString += setup.displayModifiers(modifier);

        if (ability.description != undefined || ability.description(character, abilities[i]) != "") {
            displayString += ability.description(character, abilities[i]);
            displayString += "\n"
        }

        displayString += "</p>";
        displayString += "</details>";
        displayString += "</span>";
    }

    return displayString;
}

setup.displayModifiers = function (modifier) {
    var displayString = "";

    for (var propertyName in modifier) {
        if (propertyName == "maxHPMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Max HP");
            displayString += "<br>"
        }

        if (propertyName == "maxStaminaMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Prowess");
            displayString += "<br>"
        }

        if (propertyName == "strengthMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Strength");
            displayString += "<br>"
        }

        if (propertyName == "critChanceMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Crit Chance");
            displayString += "<br>"
        }

        if (propertyName == "critDamageMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Crit Damage Multiplier");
            displayString += "<br>"
        }

        if (propertyName == "essenceMultiplierMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Essence Gain Multiplier");
            displayString += "<br>"
        }

        if (propertyName == "actionSlotsMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Action Slots");
            displayString += "<br>"
        }

        if (propertyName == "comboMovesPerTurnMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Combo Moves Per Turn");
            displayString += "<br>"
        }

        if (propertyName == "arousalGainMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Arousal Gain");
            displayString += "<br>"
        }

        if (propertyName == "minArousalMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Min Arousal");
            displayString += "<br>"
        }

        if (propertyName == "staminaRecoveryMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Stamina Recovery");
            displayString += "<br>"
        }

        if (propertyName == "corruptionMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Corruption");
            displayString += "<br>"
        }

        if (propertyName == "cockMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Cock Size", true);
            displayString += "<br>"
        }

        if (propertyName == "ballsMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Balls Size", true);
            displayString += "<br>"
        }

        if (propertyName == "heightMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Body Size", true);
            displayString += "<br>"
        }

        if (propertyName == "musclesMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Muscles");
            displayString += "<br>"
        }

        if (propertyName == "growthMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Growth Multiplier");
            displayString += "<br>"
        }

        if (propertyName == "xpMultiplierMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "XP Multiplier");
            displayString += "<br>"
        }

        if (propertyName == "corruptionPerDayMods") {
            displayString += setup.displayModifierText(modifier[propertyName], "Corruption Per Day");
            displayString += "<br>"
        }
    }

    return displayString;
}

setup.displayRankText = function (abilityRuntimeData) {
    var rankString = "";
    let ability = setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex);

    if (ability.maxRank > 1) {
        rankString += "[" + abilityRuntimeData.rank + "]";
    }

    return rankString;
}

setup.displayModifierText = function (modifier, propertyName, asLength = false) {
    var displayString = "";
    displayString += propertyName + setup.displayModifierTypeText(modifier) + " ";

    if (modifier.mod == setup.mod.MULTIPLYPOS || modifier.mod == setup.mod.MULTIPLYNEG) {
        displayString += (modifier.value * 100).toFixed(2).replace(/\.00$/, '') + "%";
    }
    else {
        if (asLength) {
            displayString += setup.getLength(modifier.value);
        }
        else {
            displayString += modifier.value.toFixed(2).replace(/\.00$/, '');
        }
    }

    return displayString;
}

setup.displayModifierTypeText = function (modifier) {
    var displayString = "";

    if (modifier.mod == setup.mod.ADD || modifier.mod == setup.mod.MULTIPLYPOS) {
        displayString += " + ";
    }
    else if (modifier.mod == setup.mod.REMOVE || modifier.mod == setup.mod.MULTIPLYNEG) {
        displayString += " - ";
    }
    else if (modifier.mod == setup.mod.REPLACE) {
        displayString += " becomes ";
    }

    return displayString;
}

setup.displayChanceToHit = function (character, fightMove) {
    var displayString = "";

    if (fightMove.critMod != undefined) {
        displayString += "<div class='" + setup.getCorruptionUIClassName("FightSkillCardCritChance", setup.getStatValue(character, "corruption")) + "'>";

        var statValue = setup.getStatValue(character, "critChance");
        var critChance = statValue + fightMove.critMod;

        displayString += " <span class='tooltip' id=";
        if (statValue < 0) {
            displayString += "'StatModifierNegative'";
        }
        else {
            displayString += "'StatModifierPositive'";
        }

        displayString += ">" + critChance;
        displayString += "<span class='tooltipContainer'>";
        displayString += "<span class='tooltiptext'>";

        displayString += "Critical Hit Chance<br><br>"
        displayString += "Modifiers:<br>";

        var statValue = setup.getStatValue(character, "critChance");
        var damageMod = { mod: setup.mod.ADD, value: statValue };

        displayString += setup.displayModifierText(damageMod, "Crit Chance Stat ");

        displayString += "</span>";
        displayString += "</span>";
        displayString += "</span>";

        displayString += "</div>"
    }

    return displayString;
}

setup.displaySign = function (number) {
    if (number >= 0) {
        return "+";
    }

    return "";
}

setup.getModifiers = function (character) {
    var modifiers = [];
    var runtimeAbilityDatas = character.abilityHandler.abilityRuntimeDatas;
    for (let i = 0; i < runtimeAbilityDatas.length; i++) {
        if (runtimeAbilityDatas[i].modifier != undefined && runtimeAbilityDatas[i].isActive == true) {
            modifiers.push(runtimeAbilityDatas[i].modifier);
        }
    }

    return modifiers;
}

setup.getModifiersForStat = function (character, statName) {
    var baseModifiers = setup.getModifiers(character);
    var statInfo = setup.getStatModifierPropertyName(statName);

    var modifiers = [];
    var i;
    for (i = 0; i < baseModifiers.length; i++) {
        for (var propertyName in baseModifiers[i]) {
            if (propertyName == statInfo.modifierProperty) {
                modifiers.push(baseModifiers[i]);
            }
        }
    }

    return modifiers;
}

setup.getStatModifierPropertyName = function (stat) {
    var statInfo = { name: stat, modifier: undefined };

    switch (stat) {
        case "hp":
            statInfo.modifierProperty = "maxHPMods";
            break;
        case "stamina":
            statInfo.modifierProperty = "maxStaminaMods";
            break;
        case "strength":
            statInfo.modifierProperty = "strengthMods";
            break;
        case "critChance":
            statInfo.modifierProperty = "critChanceMods";
            break;
        case "critDamage":
            statInfo.modifierProperty = "critDamageMods";
            break;
        case "essenceMultiplier":
            statInfo.modifierProperty = "essenceMultiplierMods";
            break;
        case "actionSlots":
            statInfo.modifierProperty = "actionSlotsMods";
            break;
        case "comboMovesPerTurn":
            statInfo.modifierProperty = "comboMovesPerTurnMods";
            break;
        case "arousalGain":
            statInfo.modifierProperty = "arousalGainMods";
            break;
        case "minArousal":
            statInfo.modifierProperty = "minArousalMods";
            break;
        case "growthMultiplier":
            statInfo.modifierProperty = "growthMods";
            break;
        case "xpMultiplier":
            statInfo.modifierProperty = "xpMultiplierMods";
            break;
        case "corruptionPerDay":
            statInfo.modifierProperty = "corruptionPerDayMods";
            break;
        case "staminaRecovery":
            statInfo.modifierProperty = "staminaRecoveryMods";
            break;
        case "corruption":
            statInfo.modifierProperty = "corruptionMods";
            break;
        case "muscles":
            statInfo.modifierProperty = "musclesMods";
            break;
        case "height":
            statInfo.modifierProperty = "heightMods";
            break;
        case "cock":
            statInfo.modifierProperty = "cockMods";
            break;
        case "balls":
            statInfo.modifierProperty = "ballsMods";
            break;
        default:
            alert(stat + " not handled by getStatModifierPropertyName")
            break;
    }

    return statInfo;
};

setup.getStatValue = function (character, stat, ignoreAbility) {
    switch (stat) {
        case "hp":
            return setup.getMaxHP(character, ignoreAbility);
        case "stamina":
            return setup.getMaxStamina(character, ignoreAbility);
        case "strength":
            return setup.getStrength(character, ignoreAbility);
        case "critChance":
            return setup.getCritChance(character, ignoreAbility);
        case "critDamage":
            return setup.getCritDamage(character, ignoreAbility);
        case "essenceMultiplier":
            return setup.getEssenceMultiplier(character, ignoreAbility);
        case "actionSlots":
            return setup.getActionSlots(character, ignoreAbility);
        case "comboMovesPerTurn":
            return setup.getComboMovesPerTurn(character, ignoreAbility);
        case "arousalGain":
            return setup.getArousalGain(character, ignoreAbility);
        case "minArousal":
            return setup.getMinArousal(character, ignoreAbility);
        case "growthMultiplier":
            return setup.getGrowthMultiplier(character, ignoreAbility);
        case "xpMultiplier":
            return setup.getXpMultiplier(character, ignoreAbility);
        case "corruptionPerDay":
            return setup.getCorruptionPerDay(character, ignoreAbility);
        case "bonusGrowthBalls":
            return setup.getBonusGrowth(character, "balls", ignoreAbility);
        case "bonusGrowthHeight":
            return setup.getBonusGrowth(character, "height", ignoreAbility);
        case "bonusGrowthMuscles":
            return setup.getBonusGrowth(character, "muscles", ignoreAbility);
        case "bonusGrowthCock":
            return setup.getBonusGrowth(character, "cock", ignoreAbility);
        case "staminaRecovery":
            return setup.getStaminaRecovery(character, ignoreAbility);
        case "corruption":
            return setup.getCorruption(character, ignoreAbility);
        case "muscles":
            return setup.getMuscles(character, ignoreAbility);
        case "height":
            return setup.getHeight(character, ignoreAbility);
        case "cock":
            return setup.getCock(character, ignoreAbility);
        case "balls":
            return setup.getBalls(character, ignoreAbility);
    }

    return undefined;
};

setup.setBaseStatValue = function (character, stat, value) {
    //hook hook - Hook hook
    switch (stat) {
        case "hp":
        case "stamina":
        case "strength":
        case "critChance":
        case "critDamage":
        case "essenceMultiplier":
        case "actionSlots":
        case "comboMovesPerTurn":
        case "arousalGain":
        case "minArousal":
        case "growthMultiplier":
        case "staminaRecovery":
            character.fight[stat] = value;
            break;
        case "muscles":
        case "corruption":
        case "height":
        case "cock":
        case "balls":
        case "corruptionPerDay":
            character.info[stat] = value;
            break;
        case "bonusGrowthBalls":
            character.fight.bonusGrowth.balls = value;
            break;
        case "bonusGrowthHeight":
            character.fight.bonusGrowth.height = value;
            break;
        case "bonusGrowthMuscles":
            character.fight.bonusGrowth.muscles = value;
            break;
        case "bonusGrowthCock":
            character.fight.bonusGrowth.cock = value;
            break;
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_STAT_CHANGE,
        self: character,
    }
    return character.broadcastAbilityTrigger(params);
};

setup.addToBaseStatValue = function (character, stat, value) {
    let baseValue = setup.getStatValueNoModifiers(character, stat)
    let newValue = baseValue + value;

    if (character.id == "CharacterSheet_Player") {
        let cap = undefined;
        switch (stat) {
            case "muscles":
                cap = setup.getStatSizeCap("muscles", character.info.limitBreaks.cap.muscles);
                break;
            case "height":
                cap = setup.getStatSizeCap("height", character.info.limitBreaks.cap.height);
                break;
            case "cock":
                cap = setup.getStatSizeCap("cock", character.info.limitBreaks.cap.cock);
                break;
            case "balls":
                cap = setup.getStatSizeCap("balls", character.info.limitBreaks.cap.balls);
                break;
            default:
                break;
        }

        if (cap != undefined) {
            if (cap < newValue) {
                //Add difference to overgrowth
                let overgrowth = newValue - cap;
                character.info.overgrowth[stat] += Math.ceil(overgrowth);
            }

            newValue = Math.min(newValue, cap);
        }
    }

    if (newValue >= 9007199254740992) {
        setup.setBaseStatValue(character, stat, 9007199254740992);
    } else {
        setup.setBaseStatValue(character, stat, newValue);
    }
};

setup.getStatValueNoModifiers = function (character, stat) {
    switch (stat) {
        case "hp":
        case "stamina":
        case "strength":
        case "critChance":
        case "critDamage":
        case "essenceMultiplier":
        case "actionSlots":
        case "comboMovesPerTurn":
        case "arousalGain":
        case "minArousal":
        case "growthMultiplier":
        case "staminaRecovery":
            return character.fight[stat];
        case "corruption":
        case "muscles":
        case "height":
        case "cock":
        case "balls":
        case "corruptionPerDay":
            return character.info[stat];
        case "bonusGrowthBalls":
            return character.info.bonusGrowth.balls;
        case "bonusGrowthHeight":
            return character.info.bonusGrowth.height;
        case "bonusGrowthMuscles":
            return character.info.bonusGrowth.muscles;
        case "bonusGrowthCock":
            return character.info.bonusGrowth.cock;
    }

    alert(stat + " not handled by getStatValueNoModifiers")
};

setup.getMaxHP = function (character, ignoreAbility) {
    var maxHP = character.fight.hp;
    maxHP = setup.getValueWithModifier(character, maxHP, "maxHPMods", ignoreAbility);

    return maxHP;
};

setup.getMaxStamina = function (character, ignoreAbility) {
    var maxStam = character.fight.stamina;
    maxStam = setup.getValueWithModifier(character, maxStam, "maxStaminaMods", ignoreAbility);
    return maxStam;
};

setup.getStrength = function (character, ignoreAbility) {
    var strength = character.fight.strength;
    return setup.getValueWithModifier(character, strength, "strengthMods", ignoreAbility);
};

setup.getCritChance = function (character, ignoreAbility) {
    var critChance = character.fight.critChance;
    return setup.getValueWithModifier(character, critChance, "critChanceMods", ignoreAbility);
};

setup.getCritDamage = function (character, ignoreAbility) {
    var critDamage = character.fight.critDamage;
    return setup.getValueWithModifier(character, critDamage, "critDamageMods", ignoreAbility);
};

setup.getEssenceMultiplier = function (character, ignoreAbility) {
    var essenceMultiplier = character.fight.essenceModifierToAdd;
    return setup.getValueWithModifier(character, essenceMultiplier, "essenceMultiplierMods", ignoreAbility);
};

setup.getActionSlots = function (character, ignoreAbility) {
    var actionSlots = character.fight.actionSlots;
    return setup.getValueWithModifier(character, actionSlots, "actionSlotsMods", ignoreAbility);
};

setup.getComboMovesPerTurn = function (character, ignoreAbility) {
    var comboMovesPerTurn = character.fight.comboMovesPerTurn;
    return setup.getValueWithModifier(character, comboMovesPerTurn, "comboMovesPerTurnMods", ignoreAbility);
};

setup.getArousalGain = function (character, ignoreAbility) {
    var arousalGain = character.fight.arousalGain;
    return setup.getValueWithModifier(character, arousalGain, "arousalGainMods", ignoreAbility);
};

setup.getGrowthMultiplier = function (character, ignoreAbility) {
    var growthMultiplier = character.fight.growthMultiplier;
    var stuff = setup.getValueWithModifier(character, growthMultiplier, "growthMods", ignoreAbility);
    return stuff
};

setup.getXpMultiplier = function (character, ignoreAbility) {
    var xpMultiplier = character.fight.xpMultiplier;
    return setup.getValueWithModifier(character, xpMultiplier, "xpMultiplierMods", ignoreAbility);
};

setup.getCorruptionPerDay = function (character, ignoreAbility) {
    var corruptionPerDay = character.info.corruptionPerDay;

    if (corruptionPerDay != undefined) {
        return setup.getValueWithModifier(character, corruptionPerDay, "corruptionPerDayMods", ignoreAbility);
    }

    return 0;
};

setup.addDays = function (value) {
    setup.applyDailyCorruption(State.variables.CharacterSheet_Player)

    if (State.variables.CharacterSheet_MQ002_Guard.quest.movedToCastle == true) {
        State.variables.CharacterSheet_MQ002_Guard.quest.lustIncrease = true;
    }

    return setup.setDays(State.variables.Expedition + value)
};

setup.setDays = function (value) {
    State.variables.Expedition = value;

    var displayString = "";
    var params =
    {
        trigger: setup.AbilityTrigger.ON_DAY_CHANGE,
        self: State.variables.CharacterSheet_Player,
    }
    displayString += State.variables.CharacterSheet_Player.broadcastAbilityTrigger(params);

    return displayString;
}

setup.getBonusGrowth = function (character, type, ignoreAbility) {
    switch (type) {
        case "balls":
            var value = character.fight.bonusGrowth.balls;
            return setup.getValueWithModifier(character, value, "bonusGrowthBalls", ignoreAbility);
        case "cock":
            var value = character.fight.bonusGrowth.cock;
            return setup.getValueWithModifier(character, value, "bonusGrowthCock", ignoreAbility);
        case "muscles":
            var value = character.fight.bonusGrowth.muscles;
            return setup.getValueWithModifier(character, value, "bonusGrowthMuscles", ignoreAbility);
        case "height":
            var value = character.fight.bonusGrowth.height;
            return setup.getValueWithModifier(character, value, "bonusGrowthHeight", ignoreAbility);
    }
};

setup.getMinArousal = function (character, ignoreAbility) {
    var value = character.fight.minArousal;
    return setup.getValueWithModifier(character, value, "minArousalMods", ignoreAbility);
}

setup.getStaminaRecovery = function (character, ignoreAbility) {
    var staminaRecovery = character.fight.staminaRecovery;
    return setup.getValueWithModifier(character, staminaRecovery, "staminaRecoveryMods", ignoreAbility);
};

setup.getCorruption = function (character, ignoreAbility) {
    var corruption = character.info.corruption;
    return setup.getValueWithModifier(character, corruption, "corruptionMods", ignoreAbility);
}

setup.getMuscles = function (character, ignoreAbility) {
    let value = setup.getValueWithModifier(character, character.info.muscles, "musclesMods", ignoreAbility);

    if (character.id == "CharacterSheet_Player") {
        let cap = setup.getStatSizeCap("muscles", character.info.limitBreaks.cap.muscles);

        if (cap != undefined) {
            value = Math.min(value, cap);
        }
    }

    return value;
}

setup.getHeight = function (character, ignoreAbility) {
    let value = setup.getValueWithModifier(character, character.info.height, "heightMods", ignoreAbility);

    if (character.id == "CharacterSheet_Player") {
        let cap = setup.getStatSizeCap("height", character.info.limitBreaks.cap.height);

        if (cap != undefined) {
            value = Math.min(value, cap);
        }
    }

    return value;
}

setup.getCock = function (character, ignoreAbility) {
    let value = setup.getValueWithModifier(character, character.info.cock, "cockMods", ignoreAbility);

    if (character.id == "CharacterSheet_Player") {
        let cap = setup.getStatSizeCap("cock", character.info.limitBreaks.cap.cock);

        if (cap != undefined) {
            value = Math.min(value, cap);
        }
    }

    return value;
}

setup.getBalls = function (character, ignoreAbility) {
    let value = setup.getValueWithModifier(character, character.info.balls, "ballsMods", ignoreAbility);

    if (character.id == "CharacterSheet_Player") {
        let cap = setup.getStatSizeCap("balls", character.info.limitBreaks.cap.balls);

        if (cap != undefined) {
            value = Math.min(value, cap);
        }
    }

    return value;
}

setup.getFightMovesWithAddons = function (character, ignoreAbility) {
    var fightMoveIDs = [...character.fight.fightMoveIDs];

    fightMoveIDs = setup.getValueWithModifier(character, fightMoveIDs, "fightMoveIDsMods", ignoreAbility);

    var fightMoveIDsNoDup = [];

    let idCount = {};
    for (let i = 0; i < fightMoveIDs.length; i++) {
        if (idCount[fightMoveIDs[i]] == undefined) {
            fightMoveIDsNoDup.push(fightMoveIDs[i])
            idCount[fightMoveIDs] = true;
        }
    }

    return fightMoveIDsNoDup;
};

setup.modifiersEqual = function (a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i].name !== b[i].name) return false;
    }
    return true;
};

setup.canLevelUp = function (level) {
    return State.variables.Exp >= setup.getXPRequirement(level);
};

setup.canExplore = function () {
    return State.variables.Quest_CanExplore;
};

setup.getXPRequirement = function (level) {
    if (level <= 0)
        return 0;

    if (level <= setup.LevelUpTable.length) {
        return setup.LevelUpTable[level - 1];
    }
    else {
        var lastLevelXP = setup.LevelUpTable[setup.LevelUpTable.length - 1];
        var secondToLastLevelXP = setup.LevelUpTable[setup.LevelUpTable.length - 2];

        var endlessTier = lastLevelXP - secondToLastLevelXP;

        return lastLevelXP + endlessTier * (level - setup.LevelUpTable.length);
    }
};

setup.gainEssence = function (amount) {
    State.variables.Essence += setup.getEssenceGain(amount);

    var displayString = "";
    var params =
    {
        trigger: setup.AbilityTrigger.ON_GAIN_ESSENCE,
        self: State.variables.CharacterSheet_Player,
    }
    displayString += State.variables.CharacterSheet_Player.broadcastAbilityTrigger(params);

    return displayString;
}

setup.getEssenceGain = function (amount) {
    return amount + Math.ceil(amount * setup.getStatValue(State.variables.CharacterSheet_Player, "essenceMultiplier"));
}

setup.getProportionalCockSize = function (height) {
    return height / 3;
}

setup.getProportionalBallsSize = function (height) {
    return height / 9;
}

setup.getProportionalMuscles = function (height) {
    return height / 4.5;
}

setup.playRealizationPackage = function (actorsList, arousalLevel) {
    for (var characterID of actorsList) {
        console.log(characterID)
        var characterAudioSheet = State.variables[characterID].info.audioSheet;
        if (characterAudioSheet != null) {
            console.log(setup[characterAudioSheet])

            var voiceObject = setup[characterAudioSheet].voice;
            if (voiceObject != null) {
                console.log(voiceObject)
                var playlistObject = voiceObject.playlist;

                if (playlistObject != null) {
                    console.log(playlistObject)
                    var bestPlaylistID = setup.evaluateBestAudioTrack(characterID, playlistObject, arousalLevel);

                    if (bestPlaylistID != null) {
                        for (var trackProperty in playlistObject.tracks) {
                            console.log(trackProperty)
                            var aList = SimpleAudio.lists.get(playlistObject.tracks[trackProperty].track);
                            if (playlistObject.tracks[trackProperty].track == bestPlaylistID) {
                                console.log(aList)
                                aList.shuffle(true);
                                aList.loop(true);
                                aList.volume(State.variables.VolumeControls.voices.volume);
                                aList.play();
                            }
                            else {
                                aList.stop();
                            }
                        }

                        State.variables.VolumeControls.voices.list.push(bestPlaylistID);
                        State.variables.PlayingAudio = true;
                    }
                }
            }
        }
    }

    //todo rework that
}

setup.playSoundActionParams = function (actionParams, loop) {
    setup.stopSoundActions();

    if (actionParams != undefined) {
        for (var param of actionParams) {
            var aList = SimpleAudio.lists.get(param);

            if (aList != null) {
                aList.shuffle(true);
                aList.loop(loop);
                aList.volume(State.variables.VolumeControls.sfx.volume);
                aList.play();

                State.variables.VolumeControls.sfx.list.push(param);
            }
        }
    }
}

setup.stopSoundActions = function () {
    for (var param of setup.AllSoundActions) {
        var aList = SimpleAudio.lists.get(param);

        if (aList != null) {
            if (aList.isPlaying() && aList.volume() >= 0) {
                aList.fadeOut(2, aList.volume());
            }
            else {
                aList.stop();
            }
        }
    }

    State.variables.VolumeControls.sfx.list = [];
}

setup.stopRealizationPackages = function (actorsList) {
    for (var characterID of actorsList) {
        var characterAudioSheet = State.variables[characterID].info.audioSheet;
        if (characterAudioSheet != null) {
            var voiceObject = setup[characterAudioSheet].voice;
            if (voiceObject != null) {
                console.log(voiceObject)
                var playlistObject = voiceObject.playlist;

                if (playlistObject != null) {
                    for (var trackProperty in playlistObject.tracks) {
                        var aList = SimpleAudio.lists.get(playlistObject.tracks[trackProperty].track);

                        console.log("alist")
                        console.log(aList)
                        console.log(SimpleAudio.lists)
                        console.log(trackProperty)
                        if (aList.isPlaying() && aList.volume() >= 0) {
                            aList.fadeOut(2, aList.volume());
                        }
                        else {
                            aList.stop();
                        }

                        State.variables.VolumeControls.voices.list = State.variables.VolumeControls.voices.list.filter(function (e) { return e !== playlistObject.tracks[trackProperty].track })
                    }
                }

                State.variables.PlayingAudio = false;
            }
        }
    }
}

setup.stopAllRealizationPackages = function () {
    setup.stopRealizationPackages(["CharacterSheet_Player", "CharacterSheet_Lost_Naga", "CharacterSheet_Imp", "CharacterSheet_Torgar", "CharacterSheet_Shard_Ring"]);
}

setup.evaluateBestAudioTrack = function (characterID, playlistObject, arousalLevel) {
    var tracks = playlistObject.tracks;
    var bestScoring = -1;
    var bestPlaylistProperty = null;

    var size = setup.sizeNormalPersoncomparison(State.variables[characterID]);

    for (var trackProperty in tracks) {
        var scoring = 0;

        var tags = tracks[trackProperty].tags;

        console.log("tags")
        console.log(tags)

        if (setup.hasArousalTag(tags, arousalLevel) == true) {
            scoring++;
        }

        if (setup.hasSizeTag(tags, size)) {
            scoring++;
        }

        if (setup.hasTorgarTag(tags)) {
            scoring++;
        }

        if (setup.hasBindTag(tags)) {
            scoring++;
        }

        if (scoring > bestScoring) {
            console.log("best scoring")
            console.log(trackProperty)

            bestScoring = scoring;
            bestPlaylistProperty = tracks[trackProperty].track;
        }
    }

    return bestPlaylistProperty;
}

setup.hasTorgarTag = function (tagsArray) {
    let torgarState = State.variables.CharacterSheet_Torgar.quest.progress;
    let states = setup.TorgarProgress;

    if (torgarState == states.INFECTED) {
        torgarState = "Torgar_Infected";
    }
    else if (torgarState == states.LOST || torgarState == states.LOST_TEAMMATE || torgarState == states.ASCENDED) {
        torgarState = "Torgar_Lost";
    }
    else {
        torgarState = "Torgar_Normal";
    }

    for (var tag of tagsArray) {
        if (tag == torgarState) {
            return true;
        }
    }

    return false;
}

setup.hasBindTag = function (tagsArray) {
    let bindState = "";
    setup.BodyVisualSheet_Shard_Ring.bodyList

    if (setup.BodyVisualSheet_Shard_Ring.bodyList.normal.condition(State.variables.CharacterSheet_Shard_Ring)) {
        bindState = "Bind_Big";
    }
    else if (setup.BodyVisualSheet_Shard_Ring.bodyList.dom.condition(State.variables.CharacterSheet_Shard_Ring)) {
        bindState = "Bind_Huge";
    }
    else {
        bindState = "Bind_Normal";
    }

    for (var tag of tagsArray) {
        if (tag == bindState) {
            return true;
        }
    }

    return false;
}

setup.hasSizeTag = function (tagsArray, size) {
    let sizeTag = ""
    if (size <= setup.Comparators.SLIGHTLY_BIGGER) {
        sizeTag = "Size_1";
    }
    else if (size <= setup.Comparators.REACHES_WAIST) {
        sizeTag = "Size_2";
    }
    else if (size <= setup.Comparators.FITS_ON_HAND) {
        sizeTag = "Size_3";
    }
    else if (size >= setup.Comparators.FITS_ON_HAND) {
        sizeTag = "Size_4";
    }

    for (var tag of tagsArray) {
        if (tag == sizeTag) {
            return true;
        }
    }

    return false;
}

setup.hasArousalTag = function (tagsArray, arousalLevel) {
    for (var tag of tagsArray) {
        switch (arousalLevel) {
            case 1:
                if (tag == "arousal_1") {
                    return true;
                }
                break;
            case 2:
                if (tag == "arousal_2") {
                    return true;
                }
                break;
            case 3:
                if (tag == "arousal_3") {
                    return true;
                }
                break;
            case 4:
                if (tag == "arousal_4") {
                    return true;
                }
                break;
        }
    }
}

setup.printActiveSound = function () {
    console.log(SimpleAudio.volume);
    var displayString = "";
    if (SimpleAudio.volume() <= 0.02 && State.variables.PlayingAudio == true) {
        displayString = '<span class = "VolumeWarning">This passage features audio. You can adjust the volume with the slider at the bottom left.</span>'
    }

    return displayString;
}

setup.displayVoiceRadio = function (character, voiceIDs) {
    var displayString = "";

    for (let i = 0; i < voiceIDs.length; ++i) {
        displayString += '<label><<radiobutton "$' + character.id + '.info.audioSheet" ' + voiceIDs[i] + ' checked>>  Voice ' + (i + 1) + '  </label>'

        displayString += '<span class="' + setup.getCorruptBackgroundClass(character) + '">'
        displayString += '<<button "Test Voice">><<run setup.playRandomVoiceClip(' + i + ')>><</button>>';
        displayString += '</span>'
        displayString += '\n'
    }

    return displayString;
}

setup.playRandomVoiceClip = function (index) {
    let testVoices = setup.TestVoices;

    setup.stopTestVoices();

    var randomAList = SimpleAudio.lists.get(testVoices[index]);
    randomAList.shuffle(true);
    randomAList.loop(false);
    randomAList.volume(State.variables.VolumeControls.voices.volume);
    randomAList.play();

}

setup.stopTestVoices = function () {
    let testVoices = setup.TestVoices;

    for (let i = 0; i < testVoices.length; ++i) {
        var aList = SimpleAudio.lists.get(testVoices[i]);
        aList.stop();
    }
}

setup.getSpentLimitBreaks = function () {
    let cap = State.variables.CharacterSheet_Player.info.limitBreaks.cap;
    let count = 0;

    for (var propertyName in cap) {
        count += cap[propertyName];
    }

    return count;
}

setup.applyModifyMetabolism = function (character, params) {
    State.variables.Essence = params.essence;
    character.info.limitBreaks = params;

    //update for lowered caps
    setup.addToBaseStatValue(character, "muscles", 0);
    setup.addToBaseStatValue(character, "height", 0);
    setup.addToBaseStatValue(character, "cock", 0);
    setup.addToBaseStatValue(character, "balls", 0);
}

setup.getStatSizeCap = function (stat, limit) {
    let musclesCap = [30, 50, 80, 120, 200, 300, 500, 1000]
    let heightCap = [12 * 7.5, 12 * 9, 12 * 12, 12 * 15.5, 12 * 20, 12 * 32, 12 * 60, 12 * 102]

    let cap = 8;
    let overCap = limit >= cap;
    let multiplierExponent = 0;

    if (overCap == true) {
        multiplierExponent = (limit + 1) - cap;
    }

    let value = 0;

    switch (stat) {
        case "muscles":
            value = musclesCap[Math.min(cap - 1, limit)]
            break;
        case "height":
            value = heightCap[Math.min(cap - 1, limit)]
            break;
        case "cock":
            value = heightCap[Math.min(cap - 1, limit)] / 11
            break;
        case "balls":
            value = heightCap[Math.min(cap - 1, limit)] / 11 / 3
            break;
        default:
            break;
    }

    value *= Math.pow(2, multiplierExponent);

    return value;
}

setup.onClickMetabolismChange = function (link, script) {
    let displayString = "";

    displayString += "<<link '" + link + "'>>";
    displayString += '<<replace "#ModifyMetabolismContent">>';
    displayString += '<<nobr>>';
    displayString += '<<run ' + script + '>>';
    displayString += '<</nobr>>';
    displayString += '<<include Modify_Metabolism_LimitBreak_Show>>';
    displayString += '<</replace>>';
    displayString += '<</link>>';

    return displayString;
}

setup.applyStoryContainer = function () {
    // `element` is the element you want to wrap
    var story = document.getElementById("story")
    var parent = story.parentNode;
    var wrapper = document.createElement('div');
    wrapper.setAttribute("id", "StoryContainer");

    // set the wrapper as child (instead of the element)
    parent.replaceChild(wrapper, story);
    // set element as child of wrapper
    wrapper.appendChild(story);
}

setup.getOvergrowthToEssence = function () {
    var overgrowth = State.variables.CharacterSheet_Player.info.overgrowth;
    let baseMultiplier = 0.3;

    let essence = 0;

    essence += Math.ceil(overgrowth.balls * baseMultiplier);
    essence += Math.ceil(overgrowth.cock * 0.3 * baseMultiplier);
    essence += Math.ceil(overgrowth.height * 0.027 * baseMultiplier);
    essence += overgrowth.muscles
    5
    return essence;
}

setup.convertOvergrowthToEssence = function () {
    State.variables.Essence += setup.getOvergrowthToEssence();

    var overgrowth = State.variables.CharacterSheet_Player.info.overgrowth;

    overgrowth.balls = 0;
    overgrowth.cock = 0;
    overgrowth.height = 0;
    overgrowth.muscles = 0;
}