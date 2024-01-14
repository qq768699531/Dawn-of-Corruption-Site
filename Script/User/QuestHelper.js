
/* twine-user-script #38: "QuestHelper.js" */
setup.getVillagePassages = function () {
    var displayString = "";
    var i;

    for (i = 0; i < State.variables.Quest_InProgress.length; i++) {
        if (State.variables.Quest_InProgress[i].villagePassage) {
            displayString += State.variables.Quest_InProgress[i].villagePassage + "\n";
        }
    }

    return displayString;
}

setup.getNextNarativeEventPassageListText = function (narativeEventPackage, amount) {

    var displayString = "";
    var count = 0;
    for (var propertyName in narativeEventPackage) {
        if (narativeEventPackage[propertyName].available() == true &&
            narativeEventPackage[propertyName].condition() == true) {
            displayString += Story.get(narativeEventPackage[propertyName].passage).text + "\n";

            count++;
            if (count >= amount) {
                return displayString;
            }
        }
    }

    console.log("fffffffffff")

    return displayString;
}

setup.getNextNarativeEventPassage = function (narativeEventPackage) {

    for (var propertyName in narativeEventPackage) {
        console.log(propertyName)
        if (narativeEventPackage[propertyName].available() == true &&
            narativeEventPackage[propertyName].condition() == true) {
            return narativeEventPackage[propertyName].passage;
        }
    }
    console.log("fffffffffff")
}

setup.hasAvailableNarativeEvent = function (narativeEventPackage) {
    for (var propertyName in narativeEventPackage) {
        if (narativeEventPackage[propertyName].available() == true &&
            narativeEventPackage[propertyName].condition() == true) {
            return true;
        }
    }

    return false
}

setup.completeQuest = function (quest) {
    quest.onComplete();

    var i;
    for (i = 0; i < State.variables.Quest_InProgress.length; i++) {
        if (State.variables.Quest_InProgress[i].id === quest.id) {
            State.variables.Quest_InProgress.splice(i, 1);
            return;
        }
    }
}

setup.removeExplorationDestination = function (quest) {
    var i;

    for (i = 0; i < State.variables.Explore_Destinations.length; i++) {
        if (State.variables.Explore_Destinations[i] == quest) {
            State.variables.Explore_Destinations.splice(i, 1);
            break;
        }
    }
}


setup.getVillageDescriptor = function () {
    var displayString = "";

    var i;
    for (i = 0; i < State.variables.Quest_InProgress.length; i++) {
        if (State.variables.Quest_InProgress[i].villageDescriptor) {
            displayString += State.variables.Quest_InProgress[i].villageDescriptor + "\n\n";
        }
    }

    if (State.variables.CharacterSheet_Player.quest.corruptionVillageExiled == true) {
        //TODO
    }
    else {
        displayString += setup.displayVillageCorruptionDescriptor();
    }

    return displayString;
}

setup.upgradeEthrexStats = function (level) {
    switch (level) {
        case 1:
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "hp", 320)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "stamina", 60)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "strength", 60)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "critChance", 20)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "staminaRecovery", 10)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "corruption", 50)
            State.variables.CharacterSheet_Ethrex.quest.minorDemon = true;
            break;

        case 2:
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "hp", 500)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "stamina", 95)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "strength", 70)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "critChance", 40)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "staminaRecovery", 25)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "corruption", 70)
            State.variables.CharacterSheet_Ethrex.fight.fightReward = setup.RewardTier.HIGH;
            State.variables.CharacterSheet_Ethrex.quest.majorDemon = true;
            break;

        case 3:
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "hp", 800)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "stamina", 210)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "strength", 140)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "critChance", 80)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "staminaRecovery", 50)
            setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "corruption", 95)
            State.variables.CharacterSheet_Ethrex.fight.fightReward = setup.RewardTier.VERY_HIGH;
            State.variables.CharacterSheet_Ethrex.quest.lordOfLust = true;
            break;
    }
}

setup.boostNyxEthrexStats = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "hp", State.variables.CharacterSheet_Ethrex.fight.hp * 10)
    setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "stamina", State.variables.CharacterSheet_Ethrex.fight.stamina * 10)
    setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "strength", State.variables.CharacterSheet_Ethrex.fight.strength * 10)
    setup.setBaseStatValue(State.variables.CharacterSheet_Ethrex, "corruption", State.variables.CharacterSheet_Ethrex.info.corruption * 10)
}

setup.growNyxEthrexStats = function () {
    var growParams = {};

    var growthMod = 1.5;

    growParams.height = setup.getStatValue(State.variables.CharacterSheet_Ethrex, "height") * growthMod;
    growParams.muscles = setup.getStatValue(State.variables.CharacterSheet_Ethrex, "muscles") * growthMod;
    growParams.cock = setup.getStatValue(State.variables.CharacterSheet_Ethrex, "cock") * growthMod;
    growParams.balls = setup.getStatValue(State.variables.CharacterSheet_Ethrex, "balls") * growthMod;

    var cockGrowth = setup.applyGrowth(State.variables.CharacterSheet_Ethrex, "cock", growParams.cock);
    var ballsGrowth = setup.applyGrowth(State.variables.CharacterSheet_Ethrex, "balls", growParams.balls);
    var muscleGrowth = setup.applyGrowth(State.variables.CharacterSheet_Ethrex, "muscles", growParams.muscles);
    var sizeGrowth = setup.applyGrowth(State.variables.CharacterSheet_Ethrex, "height", growParams.height);

    var displayString = "";

    displayString += setup.growthFlavourDescriptors(State.variables.CharacterSheet_Ethrex, State.variables.CharacterSheet_Player, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth, true);

    return displayString;
}

setup.displayVillageCorruptionDescriptor = function () {
    var displayString = "";
    var corruption = setup.getStatValue(State.variables.CharacterSheet_Player, "corruption");
    //TODO upgrade with new tiers

    if (corruption >= 150) {
        displayString += "Terrifying roars and monstrous moans constantly boom across the Golden Bastion.";
    }
    else if (corruption >= 100) {
        displayString += "The Golden Bastion is eerily quiet. People can barely handle the lustful aura radiating from your body.";
    }
    else if (corruption >= 75) {
        displayString += "The Golden Bastion's soil is darkened and corrupted. Whispers and schemes softly ring behind your back.";
    }
    else if (corruption >= 50) {
        displayString += "People give you worrying looks. You are not the same as before...";
    }
    else {
        displayString += "Life is not easy for the people here, but together they do their best to make it work. Every scrap fills a purpose. Everyone has a role to play.";
    }

    return displayString;
}

setup.initialJormSetup = function () {
    var corruption = setup.getStatValue(State.variables.CharacterSheet_Player, "corruption");
    if (corruption >= setup.CorruptionComparators.NEUTRAL) {
        State.variables.CharacterSheet_Jorm.info.height = 5230 * 12;
        State.variables.CharacterSheet_Jorm.info.cock = setup.getProportionalCockSize(5230 * 12);
        State.variables.CharacterSheet_Jorm.info.balls = setup.getProportionalBallsSize(5230 * 12);
        State.variables.CharacterSheet_Jorm.info.muscles = setup.getProportionalMuscles(5230 * 12) * 2;
    }
    else if (corruption >= setup.CorruptionComparators.PURE) {
        State.variables.CharacterSheet_Jorm.info.height = 461 * 12;
        State.variables.CharacterSheet_Jorm.info.cock = setup.getProportionalCockSize(461 * 12);
        State.variables.CharacterSheet_Jorm.info.balls = setup.getProportionalBallsSize(461 * 12);
        State.variables.CharacterSheet_Jorm.info.muscles = setup.getProportionalMuscles(461 * 12) * 2;
    }
    else {
        State.variables.CharacterSheet_Jorm.info.height = 120 * 12;
        State.variables.CharacterSheet_Jorm.info.cock = setup.getProportionalCockSize(120 * 12);
        State.variables.CharacterSheet_Jorm.info.balls = setup.getProportionalBallsSize(120 * 12);
        State.variables.CharacterSheet_Jorm.info.muscles = setup.getProportionalMuscles(120 * 12) * 2;
    }
}

setup.getInitialJormSizeDiffPassage = function () {
    var sizeComp = setup.sizeCharactercomparison(State.variables.CharacterSheet_Jorm, State.variables.CharacterSheet_Player);
    var comparators = setup.Comparators;

    if (sizeComp > comparators.BIGGER) {
        return "Jorm_JormDescriptions_LargerThanPlayer";
    }
    else if (sizeComp < comparators.SMALLER) {
        return "Jorm_JormDescriptions_SmallerThanPlayer";
    }
    else {
        return "Jorm_JormDescriptions_EvenToPlayer";
    }
}

setup.getSecondJormSizeDiffPassage = function () {
    var sizeComp = setup.sizeCharactercomparison(State.variables.CharacterSheet_Jorm, State.variables.CharacterSheet_Player);
    var comparators = setup.Comparators;

    if (sizeComp > comparators.MUCH_BIGGER) {
        return "Jorm_PostNamingPrompt_PlayerSmaller";
    }
    else if (sizeComp < comparators.MUCH_SMALLER) {
        return "Jorm_PostNamingPrompt_PlayerBigger";
    }
    else {
        return "Jorm_PostNamingPrompt_PlayerEven";
    }
}

setup.getJormIntroductionPassage = function () {
    if (State.variables.CharacterSheet_Lost_Naga.quest.hasBeenVored) {
        return "Jorm_NamingDialogue_VoredNaga"
    }
    else if (State.variables.CharacterSheet_Lost_Naga.quest.fuckedByPlayer) {
        return "Jorm_NamingDialogue_FuckedNaga"
    }
    else {
        return "Jorm_NamingDialogue_GotFuckedByNaga"
    }
}

setup.displayJournal = function (quest) {
    var displayString = "";

    var i;
    for (i = 0; i < State.variables.Quest_InProgress.length; i++) {
        displayString += State.variables.Quest_InProgress[i].description + "\n\n";
    }

    if (displayString == "") {
        displayString += "Your journal is turned to a blank page"
    }

    return displayString;
}

setup.MQ002_Manor_IsMassiveInManor = function (character) {
    let manorSize = 12 * 12;

    var isMassive = setup.sizecomparison(setup.getStatValue(character, "height"), manorSize) >= setup.Comparators.BIGGER;
    return isMassive;
}

setup.MQ002_Manor_IsCockMassiveInManor = function (character) {
    let manorSize = 2 * 12;

    var isMassive = setup.sizecomparison(setup.getStatValue(character, "cock"), manorSize) >= setup.Comparators.BIGGER;
    return isMassive;
}

setup.MQ002_Manor_IsGiganticInManor = function (character) {
    let giganticSize = 12 * 18;

    var isMassive = setup.sizecomparison(setup.getStatValue(character, "height"), giganticSize) >= setup.Comparators.BIGGER;
    return isMassive;
}

setup.MQ002_Manor_IsCockGiganticInManor = function (character) {
    let giganticSize = 4 * 12;

    var isMassive = setup.sizecomparison(setup.getStatValue(character, "cock"), giganticSize) >= setup.Comparators.BIGGER;
    return isMassive;
}

setup.MQ002_Manor_IsCorruptedInManor = function (character) {
    return setup.getStatValue(character, "corruption") > 200;
}

setup.MQ002_Manor_HasBrokenPartOfManor = function () {
    var manorAreaState = State.variables.WorldState.cultManor;

    for (var propertyName in manorAreaState) {
        if (manorAreaState[propertyName].isBroken) {
            return true;
        }
    }

    return false;
}

setup.MQ002_Manor_RandomEncounter = function () {
    return random(0, 100) > 10;
}

setup.MQ002_GiveNyxLightAbility = function () {
    if (!State.variables.CharacterSheet_Player.hasAbility("Ability_TouchedByNyxsLight")) {
        State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_TouchedByNyxsLight);
    }
}

setup.MQ002_AddNyxParasiteInfection = function () {
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_NyxParasiteInfection);

    ++State.variables.CharacterSheet_Player.quest.nyxParasiteInfections;
}

setup.MQ002_LeavingManor = function (character) {
    if (character.hasAbility("Ability_TouchedByNyxsLight")) {
        character.removeAbilityRuntimeData(setup.Ability_TouchedByNyxsLight);
    }
}

setup.MQ002_HasBrokenSeal = function () {
    return State.variables.CharacterSheet_MQ002_DragonMonk.quest.infected == true ||
        State.variables.CharacterSheet_Player.quest.oaths.drenth == setup.Oath.BROKEN ||
        State.variables.CharacterSheet_MQ002_DragonMonk.quest.beaten == true
}

setup.MQ002_HasIntactOath = function () {
    return State.variables.CharacterSheet_Player.quest.oaths.drenth == setup.Oath.ACTIVE;
}

setup.breakOath = function (oath) {
    switch (oath) {
        case "drenth":
            if (State.variables.CharacterSheet_Player.quest.oaths.drenth == setup.Oath.ACTIVE) {
                State.variables.CharacterSheet_Player.removeAbilityRuntimeData(setup.Ability_Oath_Containment);
                State.variables.CharacterSheet_Player.quest.oaths.drenth = setup.Oath.BROKEN;

                if (!State.variables.CharacterSheet_Player.hasAbility("Ability_Oathbreaker")) {
                    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Oathbreaker);
                }
            }
            break;
    }
}

setup.triggerEnding = function (endingID) {
    for (let i = 0; i < State.variables.EndingSheet.length; ++i) {
        if (State.variables.EndingSheet[i].id == endingID) {
            State.variables.EndingSheet[i].unlocked = true;
            State.variables.EndingSheet[i].onPreWorldReset();
        }
    }
}

setup.backupEndingAbilities = function () {
    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;

    State.variables.achievementsBackup = [];

    for (let i = 0; i < abilities.length; ++i) {
        if (abilities[i].achivemementState == setup.AchievementState.COMPLETE || abilities[i].achivemementState == setup.AchievementState.ACTIVATED) {
            let ability = setup.getAbilityByIndex(abilities[i].abilityDataIndex);
            State.variables.achievementsBackup.push(ability.id)
        }
    }
}

setup.triggerEndingsPostWorldCallbacks = function () {
    for (let i = 0; i < State.variables.EndingSheet.length; ++i) {
        if (State.variables.EndingSheet[i].unlocked == true) {
            State.variables.EndingSheet[i].onPostWorldReset();
        }
    }

    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;
    var achivementBackups = State.variables.achievementsBackup;
    for (let i = 0; i < abilities.length; ++i) {
        let ability = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        for (let j = 0; j < achivementBackups.length; ++j) {
            if (ability.id == achivementBackups[j]) {
                abilities[i].achivemementState = setup.AchievementState.ACTIVATED;
            }
        }
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_NEW_GAME_PLUS,
        self: State.variables.CharacterSheet_Player,
    }
    State.variables.CharacterSheet_Player.broadcastAbilityTrigger(params);

    State.variables.achievementsBackup = null;

    setup.updateStaticCorruptionUI(State.variables.CharacterSheet_Player);
}

setup.displayRandomNyxGibberish = function (amount) {
    var displayString = "";
    for (let i = 0; i < amount; ++i) {
        var randomLine = setup.getRandomInt(0, 2);
        var randomStyle = setup.getRandomInt(0, 1);

        var style = "";

        if (randomStyle == 0) {
            style = " fucked"
        }

        switch (randomLine) {
            case 0:
                displayString += '<span class="glitch nyx' + style + '" data-text="S̶͔̣͈͕̥̆̎̔͑́́̈̿̾̆͝͝ͅP̶̼̺̪̘͚̱͓̙̭̙͐̇̄̐̍̋̅̅̆̕͘͘͠R̴̦̩͕̙̿͆͌̾̈́̏͐̕E̶̡̧̝̭̩̪̜͙͋̓̿̓͝A̴̜̘͚̜͕̜̙̺͎̤͋̀̓̀̊̂̔̿͑̾̐̀̃͐̑̾͜͜ͅD̶̢̘͚̹̦̟̈́͒͐͆́͘">[[AHHHH->Ending][State.variables.CorruptSidebar = undefined]]</span>'
                break;
            case 1:
                displayString += '<span class="glitch nyx' + style + '" data-text="G̶̠͉͖͐R̴̛̎̔̚͜Ȍ̵̹̹̹̖̅W̷̨͊̾̚͠">[[HHHH->Ending][State.variables.CorruptSidebar = undefined]]</span>'
                break;
            case 2:
                displayString += '<span class="glitch nyx' + style + '" data-text="C̷̛̛̱̹̟͚͕̱̗͎͙̳̞̜̘̬̝͖̖̟̻̐̎́̌̈͐̉͑͐̋̽̔̋͂̋͝ͅƠ̶̢̱̯̬̖̥̠̬̼̼̼̜͔̬̜͚̯̺̹̩̐̍̅͒̅̓̀̚͠R̷̨̡̛̪̣͚̲͕̝̥̩͚̗̭̫̯̪͙̯̥̓͐̉̈́̒͐̃͒̽͊͛̀͋̅̕͜R̷̠̎U̵̧̫͙̺̤̰͎͓̦̓̎̿̈́̈̅́͌͝P̸̘͔̺̘̮̼̱̭̜̲͕̬̩̋̑́͜T̷͓̱͎̘̞̣͎̗̙̦̲͔͒͛͑̋̔̊̀͑̔͒͆̚̚͜͝͠͝͝ͅ">[[HHHH->Ending][State.variables.CorruptSidebar = undefined]]</span>'
                break;
        }
    }

    return displayString;
}

setup.isWithinStoryProgress = function (range, amount) {
    return amount >= range[0] && amount <= range[1];
}

setup.buffImpEncounter = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "hp", State.variables.CharacterSheet_Imp.fight.hp + 3)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "strength", State.variables.CharacterSheet_Imp.fight.strength + 2)

    if (State.variables.CharacterSheet_Imp.quest.relationshipScoring >= 7) {
        State.variables.CharacterSheet_Imp.fight.fightReward = setup.RewardTier.MEDIUM;
    }
    else if (State.variables.CharacterSheet_Imp.quest.relationshipScoring >= 4) {
        State.variables.CharacterSheet_Imp.fight.fightReward = setup.RewardTier.LOW;
    }
}

setup.impJoinsPlayer = function () {
    State.variables.CharacterSheet_Imp.quest.storylineProgress = setup.StorylineProgress_Imp.MASTER;
    State.variables.CharacterSheet_Imp.fight.fightReward = setup.RewardTier.NONE;
    State.variables.CharacterSheet_Player.fight.teammate = "CharacterSheet_Imp";

    if (!State.variables.CharacterSheet_Player.fight.unlockedTeammates.includes("CharacterSheet_Imp")) {
        State.variables.CharacterSheet_Player.fight.unlockedTeammates.push("CharacterSheet_Imp");
    }
}

setup.ferroJoinsPlayer = function () {
    State.variables.CharacterSheet_Lost_Prisoner.fight.fightReward = setup.RewardTier.NONE;
    State.variables.CharacterSheet_Player.fight.teammate = "CharacterSheet_Lost_Prisoner";

    if (!State.variables.CharacterSheet_Player.fight.unlockedTeammates.includes("CharacterSheet_Lost_Prisoner")) {
        State.variables.CharacterSheet_Player.fight.unlockedTeammates.push("CharacterSheet_Lost_Prisoner");
    }
}

setup.torgarJoinsPlayer = function () {
    State.variables.CharacterSheet_Player.fight.teammate = "CharacterSheet_Torgar";

    if (!State.variables.CharacterSheet_Player.fight.unlockedTeammates.includes("CharacterSheet_Torgar")) {
        State.variables.CharacterSheet_Player.fight.unlockedTeammates.push("CharacterSheet_Torgar");
    }
}

setup.tiadaneJoinsPlayer = function () {
    State.variables.CharacterSheet_Player.fight.teammate = "CharacterSheet_MQ002_Guard";

    if (!State.variables.CharacterSheet_Player.fight.unlockedTeammates.includes("CharacterSheet_MQ002_Guard")) {
        State.variables.CharacterSheet_Player.fight.unlockedTeammates.push("CharacterSheet_MQ002_Guard");
    }
}

setup.ethrexJoinsPlayer = function () {
    State.variables.CharacterSheet_Ethrex.fight.fightReward = setup.RewardTier.NONE;
    State.variables.CharacterSheet_Player.fight.teammate = "CharacterSheet_Ethrex";

    if (!State.variables.CharacterSheet_Player.fight.unlockedTeammates.includes("CharacterSheet_Ethrex")) {
        State.variables.CharacterSheet_Player.fight.unlockedTeammates.push("CharacterSheet_Ethrex");
    }
}

setup.setupDebugCastleRoom = function () {
    State.variables.MQ002_Manor_Destinations = ["DebugMenu"];
}

setup.levelUpImp = function () {
    var levelUpParams = {};

    levelUpParams.hp = 45;
    levelUpParams.stamina = 30;
    levelUpParams.staminaRecovery = 6;
    levelUpParams.strength = 25;
    levelUpParams.critChance = 10;
    levelUpParams.critDamage = 0.02;
    levelUpParams.growthMultiplier = 0.2;

    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "hp", State.variables.CharacterSheet_Imp.fight.hp + levelUpParams.hp)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "stamina", State.variables.CharacterSheet_Imp.fight.stamina + levelUpParams.stamina)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "staminaRecovery", State.variables.CharacterSheet_Imp.fight.staminaRecovery + levelUpParams.staminaRecovery)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "strength", State.variables.CharacterSheet_Imp.fight.strength + levelUpParams.strength)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "critChance", State.variables.CharacterSheet_Imp.fight.critChance + levelUpParams.critChance)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "critDamage", State.variables.CharacterSheet_Imp.fight.critDamage + levelUpParams.critDamage)
    setup.setBaseStatValue(State.variables.CharacterSheet_Imp, "growthMultiplier", State.variables.CharacterSheet_Imp.fight.growthMultiplier + levelUpParams.growthMultiplier)

    return levelUpParams;
}

setup.growImp = function () {
    var growParams = {};

    var growthMod = 0.25;

    growParams.height = setup.getStatValue(State.variables.CharacterSheet_Imp, "height") * growthMod;
    growParams.muscles = setup.getStatValue(State.variables.CharacterSheet_Imp, "muscles") * growthMod;
    growParams.cock = setup.getStatValue(State.variables.CharacterSheet_Imp, "cock") * growthMod;
    growParams.balls = setup.getStatValue(State.variables.CharacterSheet_Imp, "balls") * growthMod;

    var cockGrowth = setup.applyGrowth(State.variables.CharacterSheet_Imp, "cock", growParams.cock);
    var ballsGrowth = setup.applyGrowth(State.variables.CharacterSheet_Imp, "balls", growParams.balls);
    var muscleGrowth = setup.applyGrowth(State.variables.CharacterSheet_Imp, "muscles", growParams.muscles);
    var sizeGrowth = setup.applyGrowth(State.variables.CharacterSheet_Imp, "height", growParams.height);

    var displayString = "";

    displayString += setup.growthFlavourDescriptors(State.variables.CharacterSheet_Imp, State.variables.CharacterSheet_Player, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth, true);

    return displayString;
}

setup.displayImpModsPassages = function () {
    var displayString = "";

    var essenceCost = State.variables.CharacterSheet_Imp.quest.growthMultiplier * 600;

    if (State.variables.Essence < essenceCost) {
        displayString += "<span class = 'inactive'>";
    }

    displayString += "[[Grant him power and size [" + essenceCost + " Essence]->Village_MeetImp_GrowHim][$Essence -= " + essenceCost + "; State.variables.CharacterSheet_Imp.quest.growthMultiplier++]]";

    if (State.variables.Essence < essenceCost) {
        displayString += "</span>";
    }

    displayString += "\n";

    return displayString;
}

setup.displayTorgarConverse = function () {
    var displayString = "";

    if (State.variables.CharacterSheet_Torgar.quest.available_encounterPassages_lowRelaIdle_GotBig == true) {
        displayString += "[[Ask him how he got so big->Torgar_Low_Rela_EncounterStart_GotBig]]\n"
    }

    if (State.variables.CharacterSheet_Torgar.quest.available_encounterPassages_lowRelaIdle_Carry == true) {
        displayString += "[[Ask him what he is carrying on his back->Torgar_Low_Rela_EncounterStart_Carry]]\n"
    }

    if (State.variables.CharacterSheet_Torgar.quest.available_encounterPassages_lowRelaIdle_Origin == true) {
        displayString += "[[Ask him where he is from->Torgar_Low_Rela_EncounterStart_Origin]]\n"
    }

    return displayString;
}

setup.evaluateTorgarPath = function () {
    if (State.variables.CharacterSheet_Torgar.quest.relationshipScoring < 4) {
        return setup.TorgarProgress.NORMAL;
    }

    var quest = State.variables.CharacterSheet_Torgar.quest;
    if (quest.lostScoring >= quest.pureScoring) {
        return setup.TorgarProgress.LOST;
    }
    else {
        return setup.TorgarProgress.REDEEMED;
    }

    /*if(quest.pureScoring >= quest.ascendedScoring && quest.pureScoring >= quest.lostScoring)
    {
        return setup.TorgarProgress.REDEEMED;
    }

    return setup.TorgarProgress.ASCENDED;*/
}

setup.debug_SetTorgarState = function (state) {
    switch (state) {
        case setup.TorgarProgress.LOST:
            State.variables.CharacterSheet_Torgar.quest.progress = setup.TorgarProgress.LOST;
            State.variables.CharacterSheet_Torgar.quest.relationshipScoring = 4;
            break;
    }

}

setup.displaySelectTeammate = function () {
    var displayString = "";
    var unlockedTeammates = State.variables.CharacterSheet_Player.fight.unlockedTeammates;
    for (let i = 0; i < unlockedTeammates.length; i++) {
        displayString += "[[" + State.variables[unlockedTeammates[i]].info.name + "->Village][$CharacterSheet_Player.fight.teammate = '" + unlockedTeammates[i] + "']]\n";
    }

    displayString += "[[None->Village][$CharacterSheet_Player.fight.teammate = undefined]]";

    return displayString;
}

setup.getTorgarVersionEndMessage = function () {
    var displayString = "";
    switch (setup.evaluateTorgarPath()) {
        case setup.TorgarProgress.LOST:
            displayString += "(Based on your current choices, you currently lead Torgar towards embracing the pleasure and power of Corruption)\n";
            break;
        case setup.TorgarProgress.REDEEMED:
            displayString += "(Based on your current choices, you currently lead Torgar towards giving up on Corruption completely)\n";
            break;
        case setup.TorgarProgress.ASCENDED:
            displayString += "(Based on your current choices, you currently lead Torgar towards achieving mastery over his changes)\n";
            break;
    }

    return displayString;
}

setup.getMinoPromptPassage = function (param) {
    param = param.toLowerCase();

    if (typeof param === 'string' || param instanceof String) {
        console.log("loolol")
        console.log(param)
        switch (param) {
            case "nyx":
                return "Quest_MQ002_Entrance_Answer_Nyx";
            case "cray":
                return "Quest_MQ002_Entrance_Answer_Cray";
            case "kanathar":
                return "Quest_MQ002_Entrance_Answer_Kanathar";
            case "tiadane":
                return "Quest_MQ002_Entrance_Answer_Tiadane";
            case "apothus":
                return "Quest_MQ002_Entrance_Answer_Apothus";
            case "sombreve":
                return "Quest_MQ002_Entrance_Answer_Sombreve";
        }
    }

    return "Quest_MQ002_Entrance_Answer_Invalid";
}

setup.getMinoTalkMenuPassage = function () {
    if (State.variables.CharacterSheet_MQ002_Guard.quest.nyxPromise == true) {
        return "Quest_MQ002_Manor_MainHall_TalkMinotaur_PromisedMenu"
    }

    switch (State.variables.CharacterSheet_MQ002_Guard.quest.lustLevel) {
        case 1:
            return "Quest_MQ002_Manor_MainHall_TalkMinotaur_Lust1";
        case 2:
            return "Quest_MQ002_Manor_MainHall_TalkMinotaur_Lust2";
        case 3:
            return "Quest_MQ002_Manor_MainHall_TalkMinotaur_Lust3";
    }

    return "Quest_MQ002_Manor_MainHall_TalkMinotaur_Lust3";
}

setup.updateMinoLust = function () {
    if (State.variables.CharacterSheet_MQ002_Guard.quest.lustIncrease == true) {
        State.variables.CharacterSheet_MQ002_Guard.quest.lustIncrease = false;
        State.variables.CharacterSheet_MQ002_Guard.quest.lustLevel++;
    }
}

setup.setDopplegangerStats = function () {
    if (State.variables.CharacterSheet_Player.info.audioSheet == "AudioSheet_Voice1_Player") {
        State.variables.CharacterSheet_Doppleganger.info.audioSheet = "AudioSheet_Voice2_Player";
    }
    else {
        State.variables.CharacterSheet_Doppleganger.info.audioSheet = "AudioSheet_Voice1_Player";
    }

    if (setup.MQ002_Manor_IsCorruptedInManor(State.variables.CharacterSheet_Player)) {
        State.variables.CharacterSheet_Doppleganger.info.corruption = 0;
    }
    else {
        State.variables.CharacterSheet_Doppleganger.info.corruption = 1500;
    }

    State.variables.CharacterSheet_Doppleganger.info.muscles = State.variables.CharacterSheet_Player.info.muscles;
    State.variables.CharacterSheet_Doppleganger.info.height = State.variables.CharacterSheet_Player.info.height;
    State.variables.CharacterSheet_Doppleganger.info.cock = State.variables.CharacterSheet_Player.info.cock;
    State.variables.CharacterSheet_Doppleganger.info.balls = State.variables.CharacterSheet_Player.info.balls;
    State.variables.CharacterSheet_Doppleganger.info.anatomy = State.variables.CharacterSheet_Player.info.anatomy;

    State.variables.CharacterSheet_Doppleganger.fight.hp = 300;
    State.variables.CharacterSheet_Doppleganger.fight.stamina = State.variables.CharacterSheet_Player.fight.stamina;
    State.variables.CharacterSheet_Doppleganger.fight.strength = State.variables.CharacterSheet_Player.fight.strength;
    State.variables.CharacterSheet_Doppleganger.fight.critChance = State.variables.CharacterSheet_Player.fight.critChance;
    State.variables.CharacterSheet_Doppleganger.fight.critDamage = State.variables.CharacterSheet_Player.fight.critDamage;
    State.variables.CharacterSheet_Doppleganger.fight.arousalGain = State.variables.CharacterSheet_Player.fight.arousalGain;
    State.variables.CharacterSheet_Doppleganger.fight.growthMultiplier = State.variables.CharacterSheet_Player.fight.growthMultiplier;
    State.variables.CharacterSheet_Doppleganger.fight.bonusGrowth = State.variables.CharacterSheet_Player.fight.bonusGrowth;
    State.variables.CharacterSheet_Doppleganger.fight.minArousal = State.variables.CharacterSheet_Player.fight.minArousal;
    State.variables.CharacterSheet_Doppleganger.fight.staminaRecovery = State.variables.CharacterSheet_Player.fight.staminaRecovery;
    State.variables.CharacterSheet_Doppleganger.fight.fightMoveIDs = State.variables.CharacterSheet_Player.fight.fightMoveIDs.filter(function (val) {
        if (setup[val].skillType == "demon" ||
            setup[val].skillType == "symbiote" ||
            setup[val].skillType == "offensive") {
            return true;
        }
        return false;
    });



    State.variables.CharacterSheet_Doppleganger.abilityHandler.clearAllAbilityRuntimeData();
    State.variables.CharacterSheet_Doppleganger.abilityHandler.copyAllAbilityRuntimeData(State.variables.CharacterSheet_Player);
}