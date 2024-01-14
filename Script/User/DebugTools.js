
/* twine-user-script #41: "DebugTools.js" */
setup.debug_LearnAllMoves = function () {
    State.variables.CharacterSheet_Player.fight.fightMoveIDs = [
        setup.FightMove_Focus.id,
        setup.FightMove_Sigil_Vitality.id,
        setup.FightMove_Sigil_Pain.id,
        setup.FightMove_Basic_Attack.id,
        setup.FightMove_Masturbate.id,
        setup.FightMove_Sigil_Perception.id,
        setup.FightMove_Sigil_Growth.id,
        setup.FightMove_IncubusCall.id,
        setup.FightMove_IncubusStrike.id,
        setup.FightMove_Do_Nothing.id,
        setup.FightMove_Bash.id,
        setup.FightMove_Slash.id,
        setup.FightMove_SummonParasite.id,
        setup.FightMove_Stomp.id,
        setup.FightMove_CumDeluge.id,
        setup.FightMove_Goo_Stun.id,
        setup.FightMove_HeraldsDevotion.id,
        setup.FightMove_TonicOfStillness.id,
        setup.FightMove_FirstStrike.id,
        setup.FightMove_EnragedPummel.id,
        setup.FightMove_UnnaturalGrowth.id,
        setup.FightMove_Submit_Completely.id];
};

setup.debug_SetHeight = function (character, comparator) {
    var comparators = setup.Comparators;
    if (comparator <= comparators.SMALLER) {
        setup.setBaseStatValue(character, "height", 50);
    }
    else if (comparator <= comparators.EQUAL) {
        setup.setBaseStatValue(character, "height", 71);
    }
    else if (comparator <= comparators.REACHES_WAIST) {
        setup.setBaseStatValue(character, "height", 130);
    }
    else if (comparator >= comparators.REACHES_KNEES) {
        setup.setBaseStatValue(character, "height", 360);
    }
};

setup.debug_GodStats = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "strength", 99999)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "hp", 99999)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "stamina", 99999)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "critChance", 100)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "arousalGain", 20)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "staminaRecovery", 20)
};

setup.debug_ResetSize = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "height", 68)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "cock", 6)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "balls", 2)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "muscles", 0)
};

setup.debug_GodSize = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "height", 99999)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "cock", 9999)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "balls", 3333)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "muscles", 9999)
};

setup.debug_GreatSize = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "height", 240)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "cock", 70)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "balls", 24)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "muscles", 70)
};

setup.debug_BigSize = function () {
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "height", 96)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "cock", 24)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "balls", 8)
    setup.setBaseStatValue(State.variables.CharacterSheet_Player, "muscles", 25)
};

setup.debug_ApplyTinyGrowth = function () {
    setup.applyGrowth(State.variables.CharacterSheet_Player, "cock", 0.01);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "balls", 0.01);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "muscles", 0.01);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "height", 0.01);
};

setup.debug_ApplyMaxGrowth = function () {
    setup.applyGrowth(State.variables.CharacterSheet_Player, "cock", 9007199254740992);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "balls", 9007199254740992);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "muscles", 9007199254740992);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "height", 9007199254740992);
};

setup.debug_ApplyOverflowGrowth = function () {
    setup.applyGrowth(State.variables.CharacterSheet_Player, "cock", 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 * 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "balls", 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 * 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "muscles", 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 * 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    setup.applyGrowth(State.variables.CharacterSheet_Player, "height", 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 * 9007199254740992000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
};

setup.debug_ApplyBunchOfAbilities = function () {
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_EchoForm);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_HostOfEcho);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_NeverendingGrowth);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_UnstoppableExpansion);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Masochism);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_HerculeanBuild);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_AppetiteForGrowth);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_VigorOfTheEndowed);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Oath_Containment);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_OrgasmicGrowth);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_LastStand);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_WarriorOfDuality);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_CodexPassion);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_FaithsReward);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_EssenceHoarder);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_SombrevesWhisper);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_VampiricLust);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Tank);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Berserking);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_DeadlyAim);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_KalethsFervour);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_PiercingPrecision);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_ChannelTheAstralSoul);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_ValiantRush);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_DracosOmnipotence);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Momentum);
    State.variables.CharacterSheet_Player.applyAbilityRuntimeData(setup.Ability_Incorruptible);
};

setup.debug_GetEssence = function () {
    setup.gainEssence(999999);
};

setup.debug_GetExp = function () {
    State.variables.Exp += 99999999999;
};

setup.debug_GetLevels = function () {
    State.variables.Level += 999;
};

setup.debug_GetLimitBreaks = function () {
    State.variables.CharacterSheet_Player.info.limitBreaks.points = 99999;
};

setup.debug_GetCorruption = function () {
    setup.applyCorruption(State.variables.CharacterSheet_Player, 25);
};

setup.debug_ResetCorruption = function () {
    setup.applyCorruption(State.variables.CharacterSheet_Player, setup.getStatValue(State.variables.CharacterSheet_Player, "corruption") * -1);
    State.variables.CharacterSheet_Player.info.corruption = 0;
};

setup.debug_SetCanExplore = function () {
    State.variables.Quest_CanExplore = true;
};

setup.debug_DebugStarter_MQ001 = function () {
    State.variables.Quest_InProgress = [State.variables.Quest_MQ001_01];
};

setup.debug_DebugStarter_MQ002 = function () {
    State.variables.Quest_InProgress = [State.variables.Quest_MQ002];
};


setup.debug_DebugStarter_JoinedApothus = function () {
    State.variables.Quest_InProgress = [State.variables.Quest_MQ002];
    State.variables.CharacterSheet_Apothus.quest.askedAboutHim = true;
    State.variables.CharacterSheet_Player.quest.apothusRealmStatus = setup.ApothusRealmStatus.JOINED;
    State.variables.CharacterSheet_Player.quest.apothusRealmFirstTime = false;
};

setup.debug_DebugStarter_MQ003 = function () {
    State.variables.WorldState.cultManor.monolithBroken = true;
    State.variables.DeathText = setup.DeathTextEnum.POST_APOTHUS
    State.variables.CharacterSheet_Player.removeAbilityRuntimeData(setup.Ability_EmbracedByNyxsLight);
};

setup.setTorgarProgressHigh = function () {
    State.variables.CharacterSheet_Torgar.quest.relationshipScoring = 6;
    State.variables.CharacterSheet_Torgar.quest.available_postFightPassagesLoss_lowRelaMidRelaTrigger = false;
    State.variables.CharacterSheet_Torgar.quest.available_encounterPassages_lowRelaMidRelaTrigger = false;
    State.variables.CharacterSheet_Torgar.quest.available_postFightPassagesWin_lowRelaMidRelaTrigger = false;
};

setup.setTorgarProgressVeryHigh = function () {
    setup.setTorgarProgressHigh();
    State.variables.CharacterSheet_Torgar.quest.relationshipScoring = 13;
    State.variables.CharacterSheet_Torgar.quest.available_postFightPassagesLoss_lostPathTrigger = false;
    State.variables.CharacterSheet_Torgar.quest.available_encounterPassages_lostPathTrigger = false;
    State.variables.CharacterSheet_Torgar.quest.available_postFightPassagesWin_lostPathTrigger = false;
};

setup.toggleDebugMode = function () {
    State.variables.Debug = !State.variables.Debug;
    state.display(state.active.title, null, "back");
};

setup.saves = function () {
    UI.saves();
};

setup.achievements = function () {
    Dialog.setup("Achievements");

    var displayString = '<div class="AchievementWindow">'

    var character = State.variables.CharacterSheet_Player;
    var abilities = character.abilityHandler.abilityRuntimeDatas;

    var activatedAchievements = abilities.filter(function (val) {
        if (val.achivemementState == setup.AchievementState.ACTIVATED) {
            return true;
        }
        return false;
    });

    if (activatedAchievements.length > 0) {
        displayString += '<div class="AchievementWindowContentContainer">';
        displayString += '<div class="AchievementWindowHeader"><h2 class="AchievementWindowHeaderTitle">Awarded Achievements</h2>Your feats have been noticed and have brought you boons that transcend time itself.</div>'

        displayString += '<div class="AchievementCardsContainer">';
        for (let i = 0; i < activatedAchievements.length; i++) {
            displayString += setup.displayAchievement(activatedAchievements[i]);
        }
        displayString += '</div>';

        displayString += '</div>';
    }

    var completeAchievements = abilities.filter(function (val) {
        if (val.achivemementState == setup.AchievementState.COMPLETE) {
            return true;
        }
        return false;
    });

    if (completeAchievements.length > 0) {
        displayString += '<div class="AchievementWindowContentContainer">';
        displayString += '<div class="AchievementWindowHeader"><h2 class="AchievementWindowHeaderTitle">Completed Achievements</h2>You have accomplished great deeds that will bring upon rewards to your next life.</div>'

        displayString += '<div class="AchievementCardsContainer">';
        for (let i = 0; i < completeAchievements.length; i++) {
            displayString += setup.displayAchievement(completeAchievements[i]);
        }
        displayString += '</div>';

        displayString += '</div>';
    }

    var idleAchievements = abilities.filter(function (val) {
        if (val.achivemementState == setup.AchievementState.IDLE) {
            return true;
        }
        return false;
    });

    if (idleAchievements.length > 0) {
        displayString += '<div class="AchievementWindowContentContainer">';
        displayString += '<div class="AchievementWindowHeader"><h2 class="AchievementWindowHeaderTitle">Locked Achievements</h2>Silent gods watch upon you expectantly.</div>'

        displayString += '<div class="AchievementCardsContainer">';
        for (let i = 0; i < idleAchievements.length; i++) {
            displayString += setup.displayAchievement(idleAchievements[i]);
        }
        displayString += '</div>';

        displayString += '</div>';
    }

    displayString += '</div>'

    Dialog.append(displayString);
    Dialog.open();
};

setup.displayAchievement = function (runtimeAbility) {
    var character = State.variables.CharacterSheet_Player;
    var displayString = ''
    let ability = setup.getAbilityByIndex(runtimeAbility.abilityDataIndex);

    var stateClass = "";

    switch (runtimeAbility.achivemementState) {
        case setup.AchievementState.IDLE:
            stateClass = "Idle"
            break;
        case setup.AchievementState.COMPLETE:
            stateClass = "Complete"
            break;
        case setup.AchievementState.ACTIVATED:
            stateClass = "Activated"
            break;

        default:
            stateClass = "Idle"
            break;
    }

    displayString += "<div class='AchievementAbility " + ability.id + "'>";
    displayString += "<div class='AchievementAbilityHeader'>" + ability.name + " </div>";
    displayString += "<div class='AchievementAbilityBody " + stateClass + "' >";

    displayString += "<div class='AchievementAbilityBodyRow'>";
    displayString += ability.achievementInfo;
    displayString += "</div>";

    if (runtimeAbility.achivemementState != setup.AchievementState.IDLE) {
        if (ability.description != undefined || ability.description(character, runtimeAbility) != "") {
            displayString += "<div class='AchievementAbilityBodyRow'>";
            displayString += ability.description(character, runtimeAbility);
            displayString += "</div>";
        }

        if (runtimeAbility.achivemementState == setup.AchievementState.ACTIVATED) {
            displayString += "<div class='AchievementAbilityBodyRow'>";
            displayString += setup.displayModifiers(runtimeAbility.modifier)
            displayString += "</div>";
        }
        else {
            //new game lock
            displayString += "<div class='AchievementAbilityBodyNewGameLock'>";
            displayString += "Reach an Ending to earn a Transcendent Ability in your next playthrough.";
            displayString += "</div>";
        }
    }
    else {
        //complete lock
        displayString += "<div class='AchievementAbilityBodyCompleteLock'>";
        displayString += "Locked";
        displayString += "</div>";
    }



    displayString += "</div>";
    displayString += "</div>";


    return displayString;
};

setup.completeAchievement = function (abilityID) {
    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;

    for (let i = 0; i < abilities.length; i++) {
        let ability = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        if (ability.id == abilityID) {
            if (abilities[i].achivemementState == setup.AchievementState.IDLE) {
                setup.notify("Achievement Unlocked: " + setup[abilityID].name);
                abilities[i].achivemementState = setup.AchievementState.COMPLETE;
            }
        }
    }
}

setup.restart = function () {
    Dialog.setup("Jump to another cycle");
    Dialog.wiki(Story.get("RestartScreen").processText());
    Dialog.open();
};

setup.volumeMenu = function () {
    Dialog.setup("Audio Settings");

    var displayString = '<div class="VolumeMenuWindow">'

    var corruption = setup.getStatValue(State.variables.CharacterSheet_Player, "corruption");
    var sliderClass = setup.getCorruptionUIClassName("dummy", corruption);

    displayString += '<div class="VolumeMenu">';
    displayString += '<div class="VolumeMenuTitle">Music</div>';
    displayString += '<div class="VolumeMenuSlider">';
    displayString += '<span class="macro-volume">';
    displayString += '<input id="volume-control" class="' + sliderClass + '" type="range" name="volumeMusic" min="0" max="1" step="0.01" value="' + State.variables.VolumeControls.music.volume + '">';
    displayString += '</span>';
    displayString += '</div>';
    displayString += '</div>';

    displayString += '<div class="VolumeMenu">';
    displayString += '<div class="VolumeMenuTitle">SFX</div>';
    displayString += '<div class="VolumeMenuSlider">';
    displayString += '<span class="macro-volume">';
    displayString += '<input id="volume-control" class="' + sliderClass + '" type="range" name="volumeSFX" min="0" max="1" step="0.01" value="' + State.variables.VolumeControls.sfx.volume + '">';
    displayString += '</span>';
    displayString += '</div>';
    displayString += '</div>';

    displayString += '<div class="VolumeMenu">';
    displayString += '<div class="VolumeMenuTitle">Voices</div>';
    displayString += '<div class="VolumeMenuSlider">';
    displayString += '<span class="macro-volume">';
    displayString += '<input id="volume-control" class="' + sliderClass + '" type="range" name="volumeVoices" min="0" max="1" step="0.01" value="' + State.variables.VolumeControls.voices.volume + '">';
    displayString += '</span>';
    displayString += '</div>';
    displayString += '</div>';

    displayString += '</div>'

    Dialog.append(displayString);
    Dialog.open();
};

setup.backupAchievements = function () {
    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;
    State.variables.AchievementBackup = [];

    for (var i = 0; i < abilities.length; i++) {
        var abilityData = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        if (abilityData.isAchievement == true && abilities[i].achivemementState > setup.AchievementState.IDLE) {
            var achievement = {};
            achievement.id = abilityData.id;
            State.variables.AchievementBackup.push(achievement);
        }
    }
};

setup.loadBackedUpAchievements = function () {
    var abilities = State.variables.CharacterSheet_Player.abilityHandler.abilityRuntimeDatas;
    var backup = State.variables.AchievementBackup;

    for (var i = 0; i < abilities.length; i++) {
        var abilityData = setup.getAbilityByIndex(abilities[i].abilityDataIndex);

        if (abilityData.isAchievement == true) {
            for (var j = 0; j < backup.length; j++) {
                if (backup[j].id == abilityData.id) {
                    abilities[i].achivemementState = setup.AchievementState.ACTIVATED;
                }
            }
        }
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_NEW_GAME_PLUS,
        self: State.variables.CharacterSheet_Player,
    }
    State.variables.CharacterSheet_Player.broadcastAbilityTrigger(params);

    setup.updateStaticCorruptionUI(State.variables.CharacterSheet_Player);

    State.variables.AchievementBackup = null;
};

setup.parseIntStats = function () {
    State.variables.CharacterSheet_Player.info.muscles = parseInt(State.variables.CharacterSheet_Player.info.muscles);
    State.variables.CharacterSheet_Player.info.height = parseInt(State.variables.CharacterSheet_Player.info.height);
    State.variables.CharacterSheet_Player.info.cock = parseInt(State.variables.CharacterSheet_Player.info.cock);
    State.variables.CharacterSheet_Player.info.balls = parseInt(State.variables.CharacterSheet_Player.info.balls);
};