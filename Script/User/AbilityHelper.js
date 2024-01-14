
/* twine-user-script #23: "AbilityHelper.js" */
setup.getAbilityId = function (index) {
    return displayString.join("\n");
};

setup.callAbilityTrigger = function (character, triggerName, abilityParams) {
    if (character.fight.abilities == undefined)
        return "";

    var displayString = [];

    var i;
    for (i = 0; i < character.fight.abilities.length; i++) {
        if (character.fight.abilities[i][triggerName] != undefined) {
            displayString.push(character.fight.abilities[i][triggerName](abilityParams));
        }
    }

    return displayString.join("\n");
};

setup.hasModifier = function (character, name) {
    var i;
    for (i = 0; i < character.fight.variables.fightModifiers.length; i++) {
        if (character.fight.variables.fightModifiers[i].name == name) {
            return true;
        }
    }

    return false;
};

setup.hasFightMove = function (character, fightMoveID) {
    var fightMoves = setup.getFightMovesWithAddons(character);

    for (let i = 0; i < fightMoves.length; i++) {
        if (fightMoves[i] == fightMoveID) {
            return true;
        }
    }

    return false;
}

setup.levelUp = function (character, levelUpParams) {
    if (State.variables.Level == 3) {
        character.fight.fightMoveIDs.push("FightMove_FirstStrike");
    }

    if (State.variables.Level == 6) {
        character.fight.fightMoveIDs.push("FightMove_EnragedPummel");
    }

    State.variables.Level++;

    setup.setBaseStatValue(character, "hp", levelUpParams.hp.value);
    setup.setBaseStatValue(character, "stamina", levelUpParams.stamina.value);
    setup.setBaseStatValue(character, "strength", levelUpParams.strength.value);
    setup.setBaseStatValue(character, "arousalGain", levelUpParams.arousalGain.value);
    character.info.limitBreaks.points = levelUpParams.limitBreaks.value;

    var abilityChoiceIndex = $('input[name=select]:checked').val();

    if (abilityChoiceIndex != undefined) {
        character.applyAbilityRuntimeData(setup.UnlockableAbilityList[abilityChoiceIndex]);
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_LEVEL_UP,
        self: character,
    }
    character.broadcastAbilityTrigger(params);
};

setup.getDemonicTFPassage = function (character) {
    if (character.hasAbility("Ability_DemonicCorruption")) {
        return "Transformation_Incubus_Level2_1";
    }
    else if (character.hasAbility("Ability_DemonicCorruption_2")) {
        return "Transformation_Incubus_Level3_1";
    }
    else if (character.hasAbility("Ability_DemonicCorruption_3")) {
        return undefined;
    }
    return "Transformation_Incubus_Level1_1"
};

setup.displaySeedMoveIntro = function (character, target, color) {
    var displayString = " ";

    displayString += character.info.name + " feels an urge building within him as his balls suddenly expand.\n";
    displayString += "A thundering roar emerges from him as a sudden orgasm overtakes his body!\n";
    displayString += setup.processFlavours(character, "Thick loads of " + color + " cum shoots out from his " + setup.getLength(setup.getStatValue(character, "cock")) + " @[all| cocks| noverb], " + target.info.name + " is inevitably hit by some of it.\n");
    return displayString;
}

setup.getDemonicTFCost = function (character) {
    if (character.hasAbility("Ability_DemonicCorruption")) {
        return 500;
    }
    else if (character.hasAbility("Ability_DemonicCorruption_2")) {
        return 1000;
    }
    else if (character.hasAbility("Ability_DemonicCorruption_3")) {
        return undefined;
    }
    return 200;
};

setup.getNyxChosenCocoonSize = function () {
    if (State.variables.WorldState.apothusChosen.essenceLevel == 0) {
        return setup.getLength(620);
    }
    else if (State.variables.WorldState.apothusChosen.essenceLevel == 1) {
        return setup.getLength(2500);
    }
    else if (State.variables.WorldState.apothusChosen.essenceLevel == 2) {
        return setup.getLength(6000);
    }
    else if (State.variables.WorldState.apothusChosen.essenceLevel == 3) {
        return setup.getLength(16896);
    }
    return 9999999;
}

setup.getNyxChosenFeedEssenceCost = function () {
    if (State.variables.WorldState.apothusChosen.essenceLevel == 0) {
        return 1500;
    }
    else if (State.variables.WorldState.apothusChosen.essenceLevel == 1) {
        return 3000;
    }
    else if (State.variables.WorldState.apothusChosen.essenceLevel == 2) {
        return 5000;
    }
    return 9999999;
};

setup.displayStatsUp = function (character, levelUpParams) {
    var displayString = "";
    var statGain = setup.LevelUpStatGainTable[State.variables.Level % 6];

    for (var propertyName in statGain) {
        levelUpParams[propertyName].value += statGain[propertyName];
        displayString += "You gained " + statGain[propertyName] + " " + levelUpParams[propertyName].name + "\n";
    }

    if (State.variables.Level == 3) {
        displayString += "You learned the 'First Strike' attack.\n";
    }

    if (State.variables.Level == 6) {
        displayString += "You learned the 'Enraged Pummel' attack.\n";
    }

    return displayString;
};

setup.setFightSkillCardBackgroundStyle = function (elementId, fightSkill) {
    var card = document.getElementById(elementId);

    card.style.backgroundImage = setup.getFightSkillCardBackgroundStyleContent(State.variables.CharacterSheet_Player, setup[fightSkill]);
    console.log("backgroundImage")
    console.log(card.style.backgroundImage)
}

setup.printChangeFightSkillList = function () {
    var displayString = "";

    displayString += State.variables.FightMovesLeft + ' moves left to choose.\n';

    for (let i = 0; i < State.variables.ComboableMovesInfo.length; i++) {
        displayString += "<div class='FullCard'>";
        if (State.variables.FightMovesLeft <= 0 && (State.variables.ComboableMovesInfo[i].chosen == undefined || State.variables.ComboableMovesInfo[i].chosen == false)) {
            displayString += "<span class='reallyInactive'>";
        }

        var pickedClass = "";
        if (State.variables.ComboableMovesInfo[i].chosen == true) {
            displayString += '<div class="FightSkillCardHighlight selected">';
        }
        else {
            displayString += '<div class="FightSkillCardHighlight">';
        }

        let params = 'class="FightSkillCard moveset" style="' + setup.getFightSkillCardBackgroundStyle(State.variables.CharacterSheet_Player, undefined, setup[State.variables.ComboableMovesInfo[i].id]) + '"';
        displayString += '<div ' + params + '>';
        displayString += '<<link "' + setup.getSkillDisplayString(State.variables.CharacterSheet_Player, undefined, setup[State.variables.ComboableMovesInfo[i].id], undefined) + '">>';
        displayString += '<<replace "#ChangeFightSkillList">>';

        if (State.variables.ComboableMovesInfo[i].chosen == true) {
            displayString += '<<set $FightMovesLeft++>>';
            displayString += '<<set $ComboableMovesInfo[' + i + '].chosen = false>>';
        }
        else {
            displayString += '<<set $FightMovesLeft-->>';
            displayString += '<<set $ComboableMovesInfo[' + i + '].chosen = true>>';
        }
        displayString += '<<print setup.printChangeFightSkillList()>>';

        displayString += '<</replace>>';
        displayString += '<</link>>';
        displayString += '</div>';
        displayString += '</div>';

        if (State.variables.FightMovesLeft <= 0 && (State.variables.ComboableMovesInfo[i].chosen == undefined || State.variables.ComboableMovesInfo[i].chosen == false)) {
            displayString += '</span>';
        }

        displayString += '</div>';
    }

    displayString += "\n\n";
    displayString += "<div class='MovesetButton'>";
    displayString += "[[Cancel->Village][[setup.resetComboableFightMoveList()]]]";
    displayString += "\n";

    if (State.variables.FightMovesLeft <= 0) {
        displayString += "[[Apply->Village][setup.applyComboableFightMoveList(); setup.resetComboableFightMoveList()]]";
    }
    else {
        displayString += "<span class='inactive'>[[Apply->Village]]</span>";
    }

    displayString += "</div>";

    return displayString;
}

setup.resetComboableFightMoveList = function () {
    var movelist = setup.getFightMovesWithAddons(State.variables.CharacterSheet_Player);

    State.variables.ComboableMovesInfo = undefined;
}

setup.applyComboableFightMoveList = function () {
    var movelistIDs = setup.getFightMovesWithAddons(State.variables.CharacterSheet_Player);

    console.log("applyComboableFightMoveList")
    console.log(movelistIDs)

    State.variables.EquippedFightMoveIDs = [];

    State.variables.ComboableMovesInfo = State.variables.ComboableMovesInfo.filter(function (val) {
        return val.chosen == true;
    });

    console.log(State.variables.ComboableMovesInfo)

    for (let i = 0; i < movelistIDs.length; ++i) {
        for (let j = 0; j < State.variables.ComboableMovesInfo.length; ++j) {
            if (movelistIDs[i] == State.variables.ComboableMovesInfo[j].id) {
                State.variables.EquippedFightMoveIDs.push(movelistIDs[i]);
            }
        }
    }

    console.log(State.variables.EquippedFightMoveIDs)

    State.variables.ComboableMovesInfo = undefined;
}

setup.displayChangeFightMoves = function () {
    var displayString = "";
    var movelistIDs = setup.getFightMovesWithAddons(State.variables.CharacterSheet_Player);

    movelistIDs = movelistIDs.filter(function (val) {
        console.log("1")
        console.log(setup[val])
        if (setup[val].comboCost != undefined && setup[val].unique == undefined && setup[val].skillType != "special") {
            return true;
        }
        return false;
    });

    State.variables.ComboableMovesInfo = [];
    for (let i = 0; i < movelistIDs.length; ++i) {
        State.variables.ComboableMovesInfo.push(
            {
                id: movelistIDs[i],
                chosen: false,
            }
        )
    }


    displayString += '<span id="ChangeFightSkillList">';
    displayString += setup.printChangeFightSkillList();
    displayString += '</span>';

    return displayString;
};

setup.canRemoveAbilityPoint = function (propertyName, value) {
    if (State.variables.CharacterSheet_Player.fight[propertyName] != undefined) {
        if (State.variables.CharacterSheet_Player.fight[propertyName] >= value) {
            return false;
        }

    }

    return true;
};

setup.displayAbilitiesUp = function (character) {
    var displayString = "<section>";

    for (var propertyName in setup.AbilityCategory) {
        var categoryString = setup.getAbilityCategoryDescription(character, setup.AbilityCategory[propertyName]);
        if (categoryString != "") {
            displayString += setup.getAbilityCategory(setup.AbilityCategory[propertyName]);
            displayString += categoryString;
            displayString += "</div>"
        }
    }

    displayString += "</section>"
    return displayString;
};

setup.getAbilityByIndex = function (index) {
    return setup[setup.AbilityIDCache[index]];
}

setup.getAbilityCategoryDescription = function (character, category) {
    var i;
    var j;
    var displayString = "";
    for (var gradeProperty in setup.AbilityGrade) {
        for (i = 0; i < setup.UnlockableAbilityList.length; i++) {
            if (category != setup.UnlockableAbilityList[i].category) {
                continue;
            }

            if (setup.AbilityGrade[gradeProperty] != setup.UnlockableAbilityList[i].grade) {
                continue;
            }

            var ability = undefined;
            var unlocked = false;
            for (j = 0; j < character.abilityHandler.abilityRuntimeDatas.length; j++) {
                let abilityRuntimeData = character.abilityHandler.abilityRuntimeDatas[j];
                let abilityData = setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex);

                if (setup.UnlockableAbilityList[i].baseID == abilityData.baseID) {
                    unlocked = true;
                    if (setup.canRank(abilityRuntimeData)) {
                        ability = abilityData;
                        displayString += setup.createRadioButton(i, abilityRuntimeData, abilityData, character);
                    }
                    else if (abilityData.nextAbilityID != undefined) {
                        if (abilityData.upgradeConditionFunction(abilityRuntimeData, character)) {
                            displayString += setup.createRadioButton(i, abilityRuntimeData, abilityData, character);
                        }
                        else {
                            let nextAbility = setup[abilityData.nextAbilityID];

                            let info = nextAbility.name + " " + "[Conditions Not Met]" + " :\n";
                            info += "<p style='opacity:.35'>" + nextAbility.description(character, undefined) + '</p>';
                            info += "<p style='color:#9e21218c;'>" + abilityData.upgradeDescription(character) + '</p>';
                            displayString += '<div class="AbilityLevelUpCard ' + setup.getAbilityGradeClass(abilityData) + '"><span class="inactive">' + info + '</span></div>';
                        }
                    }
                }
            }
            if (!unlocked && (setup.UnlockableAbilityList[i].unlockCondition(character))) {
                displayString += setup.createRadioButton(i, undefined, setup.UnlockableAbilityList[i], character);
            }
        }
    }

    return displayString;
}

setup.canRank = function (abilityRuntimeData) {
    let ability = setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex);

    if (abilityRuntimeData.rank < ability.maxRank) {
        return true;
    } else {
        return false;
    }
}

setup.addRank = function (abilityRuntimeData) {
    if (setup.canRank(abilityRuntimeData)) {
        abilityRuntimeData.rank += 1
        abilityRuntimeData.seen = false;
    }
}

setup.getRankGrowth = function (newAbilityRuntimeData, growthType, growthFactor) {
    switch (growthType) {
        case "constant":
            return growthFactor;
        case "linear":
            return newAbilityRuntimeData.rank * growthFactor;
        case "exp":
            return Math.pow(growthFactor, newAbilityRuntimeData.rank);
        case "log":
            return Math.log(newAbilityRuntimeData.rank) / Math.log(growthFactor);
    }
}

setup.getUnseenAbilitiesAmount = function (filter) {
    let displayString = "";
    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;
    let count = 0;
    let hasUnseen = false;

    for (var i = 0; i < abilities.length; i++) {
        if (abilities[i].isActive == false)
            continue;

        var abilityData = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        if (abilityData.filter != filter)
            continue;

        count++;

        if (abilities[i].seen == false) {
            hasUnseen = true;
        }
    }

    displayString += "<div class='AbilityNotification'>" + count + "</div>"

    if (hasUnseen == true) {
        displayString += "<div class='AbilityNotificationBlip'></div>"
    }

    return displayString;
}

setup.getAbilityCategory = function (category) {
    var displayString = '<div class="levelUpCardCategory">';
    displayString += setup.getAbilityCategoryDisplayName(category);

    return displayString;
}

setup.getAbilityCategoryDisplayName = function (category) {
    var categories = setup.AbilityCategory;

    var displayString = "<h2>";

    switch (category) {
        case categories.NONE:
            displayString += "";
            break;
        case categories.WARRIOR:
            displayString += "Ways of the Salvager";
            break;
        case categories.GROWTH:
            displayString += "Powers of Growth";
            break;
        case categories.SOMBREVE:
            displayString += "Whispers of Corruption";
            break;
        case categories.PURITY:
            displayString += "Devotion to Purity";
            break;
        case categories.LUST:
            displayString += "Lustful Instincts";
            break;
    }

    displayString += "</h2>";

    return displayString;
}

setup.getAbilityGradeClass = function (abilityData) {
    var grades = setup.AbilityGrade;
    switch (abilityData.grade) {
        case grades.VERYLOW:
            return "AbilityGradeVeryLow";
        case grades.LOW:
            return "AbilityGradeLow";
        case grades.MEDIUM:
            return "AbilityGradeMedium";
        case grades.HIGH:
            return "AbilityGradeHigh";
        case grades.VERYHIGH:
            return "AbilityGradeVeryHigh";
    }
}

setup.createRadioButton = function (radioListIndex, abilityRuntimeData, abilityData, character) {
    var displayString = "";
    var upgradeString = "";
    var ability = abilityData;

    if (abilityRuntimeData != undefined) {
        if (setup.canRank(abilityRuntimeData)) {
            upgradeString += " [" + abilityRuntimeData.rank + "/" + ability.maxRank + "]" + " → " + " [" + (abilityRuntimeData.rank + 1) + "/" + ability.maxRank + "]"
        }
        else {
            ability = setup[ability.nextAbilityID];

            if (ability.upgradeConditionFunction(abilityRuntimeData, character)) {
                upgradeString += " [Upgradable]";
            }
        }
    }

    //stupid ass hack - Can we keep this comment in here forever? - OK
    var levelUpRuntimeData = clone(abilityRuntimeData);
    if (levelUpRuntimeData != undefined) {
        if (setup.canRank(abilityRuntimeData)) {
            levelUpRuntimeData.rank++;
        }
    }

    displayString += "<div class='AbilityLevelUpCard " + setup.getAbilityGradeClass(abilityData) + "'>";

    displayString += '<input type="radio" class="AbilityLevelUpCardRadio" id="control_' + radioListIndex + '" name="select" value="' + radioListIndex + '" checked>';
    displayString += '<label class="abilityLabel" for="control_' + radioListIndex + '">';
    displayString += "<div class='AbilityLevelUpCardHeader'>" + ability.name + " " + upgradeString + "</div>";
    displayString += "<div class='AbilityLevelUpCardDescription' >";
    displayString += "<div class='AchievementAbilityBodyRow'>";
    displayString += ability.description(character, levelUpRuntimeData);
    displayString += "</div>";
    displayString += "</div>";
    displayString += '</label>';
    displayString += "</div>";

    return displayString;
}

setup.applyCurseOfTheNaga = function () {
    if (!State.variables.CharacterSheet_Player.hasAbility(State.variables.CharacterSheet_Player, "Ability_CurseOfTheNaga")) {
        let musclesDrain = Math.ceil(setup.getStatValue(State.variables.CharacterSheet_Player, "muscles") * 0.2);

        let height = setup.getStatValue(State.variables.CharacterSheet_Player, "height") - Math.min(68, setup.getStatValue(State.variables.CharacterSheet_Player, "height"));
        let heightDrain = Math.ceil(height * 0.2);

        let cock = setup.getStatValue(State.variables.CharacterSheet_Player, "cock") - Math.min(6, setup.getStatValue(State.variables.CharacterSheet_Player, "cock"));
        let cockDrain = Math.ceil(cock * 0.2);

        let balls = setup.getStatValue(State.variables.CharacterSheet_Player, "balls") - Math.min(2, setup.getStatValue(State.variables.CharacterSheet_Player, "balls"));
        let ballsDrain = Math.ceil(balls * 0.2);

        if (musclesDrain <= 0 || heightDrain <= 0 || cockDrain <= 0 || ballsDrain <= 0) {
            return "TooSmall";
        }

        State.variables.CharacterSheet_Player.quest.curseOfTheNagaStatDrain.muscles = musclesDrain;
        State.variables.CharacterSheet_Player.quest.curseOfTheNagaStatDrain.height = heightDrain;
        State.variables.CharacterSheet_Player.quest.curseOfTheNagaStatDrain.cock = cockDrain;
        State.variables.CharacterSheet_Player.quest.curseOfTheNagaStatDrain.balls = ballsDrain;

        State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_CurseOfTheNaga);
        State.variables.CharacterSheet_Lost_Naga.applyAbilityRuntimeData(setup.Ability_StolenMass);

        return "Cursed";
    }

    return "AlreadyCursed";
}

setup.removeCurseOfTheNaga = function () {
    State.variables.CharacterSheet_Player.removeAbilityRuntimeData(setup.Ability_CurseOfTheNaga);
    return State.variables.CharacterSheet_Lost_Naga.removeAbilityRuntimeData(setup.Ability_StolenMass);
}