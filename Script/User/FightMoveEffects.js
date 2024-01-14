
/* twine-user-script #26: "FightMoveEffects.js" */
setup.addPersistentEffect = function (character, persistentEffect) {
    character.fight.variables.persistentEffects.push(persistentEffect);
};

setup.removePersistentEffect = function (character, persistentEffect) {
    character.fight.variables.persistentEffects = character.fight.variables.persistentEffects.filter(function (val) {
        if (val.id == persistentEffect.id) {
            return false;
        }
        return true;
    })
};

setup.triggerVictimPersistentEffects = function (attacker, victim, trigger, params) {
    var displayString = "";
    var persistentEffects = victim.fight.variables.persistentEffects;
    for (let i = 0; i < persistentEffects.length; i++) {
        if (persistentEffects[i][trigger]) {
            displayString += persistentEffects[i][trigger](attacker, victim, params) + "\n";
        }
    }

    return displayString;
};

setup.canStackPersistentEffect = function (attacker, victim, effectID, maxStack) {
    var persistentEffects = victim.fight.variables.persistentEffects;
    var stackCount = 0;

    if (attacker.id == "CharacterSheet_Player") {
        if (State.variables.FightComboStackIndexes != undefined) {
            for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
                let fightMove = State.variables.FightSkills[State.variables.FightComboStackIndexes[i]];
                if (fightMove.persistentEffectOpponent != undefined) {
                    if (fightMove.persistentEffectOpponent.id == effectID) {
                        stackCount++;
                    }
                }
            }
        }
    }

    for (let i = 0; i < persistentEffects.length; i++) {
        if (persistentEffects[i].id == effectID) {
            stackCount++;
        }
    }

    return stackCount < maxStack;
}

setup.displayCurrentPersistentEffects = function (character, target) {
    var displayString = "";
    var persistentEffects = character.fight.variables.persistentEffects;
    for (let i = 0; i < persistentEffects.length; i++) {
        displayString += persistentEffects[i].constantDesc(character, target) + "\n";
    }

    return displayString;
};

setup.hypnotize = function (attackerSheet, victimSheet, stunDuration = 2) {
    if (victimSheet.fight.immuneToCharms) {
        return victimSheet.info.name + "'s mind is too strong to be hypnotized!";
    }
    else {
        victimSheet.applyAbilityRuntimeData(setup.Ability_Stunned);
        victimSheet.applyAbilityRuntimeData(setup.Ability_Stunned);

        return victimSheet.info.name + " falls under the mind shattering influence of " + attackerSheet.info.name + ". He eagerly wait for his master's commands.";
    }
}

setup.worship = function (attackerSheet, victimSheet) {
    victimSheet.fight.variables.currentArousal += 20;

    victimSheet.fight.variables.currentArousal = Math.min(victimSheet.fight.variables.currentArousal, 100);

    return "";
};

setup.heraldsDevotionEffect = function (attackerSheet, victimSheet) {
    var maxHP = setup.getMaxHP(attackerSheet);
    var arousal = attackerSheet.fight.variables.currentArousal;
    var healAmount = 0;

    if (!setup.usesArousal(attackerSheet)) {
        healAmount = maxHP * 0.35;
    }
    else {
        if (arousal < 20) {
            healAmount = maxHP * 0.35;
        }
        else if (arousal < 70) {
            healAmount = maxHP * 0.10;
        }
    }

    healAmount = Math.min(healAmount, maxHP - attackerSheet.fight.variables.currentHP);

    attackerSheet.fight.variables.currentHP += healAmount;

    console.log("post heal")
    console.log(attackerSheet.fight.variables.currentHP)

    return "∇: " + attackerSheet.info.name + " heals for " + healAmount + " health.";
};

setup.stunTarget = function (attackerSheet, victimSheet, stunDuration = 2) {
    if (victimSheet.fight.immuneToStun) {
        return victimSheet.info.name + "'s body is too hardened to be stunned!";
    }
    else {
        victimSheet.applyAbilityRuntimeData(setup.Ability_Stunned);

        return victimSheet.info.name + " struggles to move.";
    }

};

setup.infestStun = function (attackerSheet, victimSheet) {
    var displayString = "";
    if (victimSheet.fight.variables.currentArousal >= 50) {
        displayString += setup.stunTarget(attackerSheet, victimSheet, 1);
    }

    return displayString;
};

setup.witheringVenom = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += victimSheet.applyAbilityRuntimeData(setup.Ability_WitheringVenom);

    return displayString;
};

setup.cumDeluge = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += victimSheet.applyAbilityRuntimeData(setup.Ability_BuriedInCum);

    return displayString;
};

setup.consumeLost = function (attackerSheet, victimSheet) {
    var displayString = "";

    setup.applyGrowth(attackerSheet, "cock", 9);
    setup.applyGrowth(attackerSheet, "balls", 3);
    setup.applyGrowth(attackerSheet, "muscles", 5);
    setup.applyGrowth(attackerSheet, "height", 18);

    return displayString;
};

setup.tonicOfStillness = function (attackerSheet, victimSheet) {
    var displayString = "";

    var appliedCorruption = Math.max(-5, State.variables[attackerSheet.id].info.corruption * -1);

    if (appliedCorruption != 0) {
        displayString += "∇: " + attackerSheet.info.name + " has turned " + Math.max(0, State.variables[attackerSheet.id].info.corruption - 5) + " Corruption into strength. This effect will persist for the next 7 expeditions."

        State.variables[attackerSheet.id].applyAbilityRuntimeData(setup.Ability_TonicOfStillness);
    }
    else {
        displayString += "∇: " + State.variables[attackerSheet.id].info.name + " does not have any Corruption to convert into strength."
    }

    return displayString;
};

setup.doParry = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += attackerSheet.applyAbilityRuntimeData(setup.Ability_ActiveParry);

    return displayString;
}

setup.surrender = function (attackerSheet, victimSheet) {
    attackerSheet.fight.variables.surrender = true;

    return "";
};

setup.pridefulAscentEffects = function (attackerSheet, victimSheet) {
    var cockGrowth = setup.getRandomInt(3, 6);
    var ballsGrowth = cockGrowth / 2;
    var muscleGrowth = setup.getRandomInt(3, 4);
    var sizeGrowth = setup.getRandomInt(2, 5);

    cockGrowth = setup.applyGrowth(attackerSheet, "cock", cockGrowth);
    ballsGrowth = setup.applyGrowth(attackerSheet, "balls", ballsGrowth);
    muscleGrowth = setup.applyGrowth(attackerSheet, "muscles", muscleGrowth);
    sizeGrowth = setup.applyGrowth(attackerSheet, "height", sizeGrowth);

    var displayString = "";

    displayString += setup.growthFlavourDescriptors(attackerSheet, victimSheet, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth);

    return displayString;
};

setup.bindLossSubEffect = function () {
    var displayString = "";
    var loss = setup.getRandomInt(12, 20);
    State.variables.Essence -= loss;

    displayString += "∇: You lose " + loss + " Essence.\n"

    var cockGrowth = setup.getRandomInt(6, 12);
    var ballsGrowth = cockGrowth / 2;
    var muscleGrowth = setup.getRandomInt(6, 12);
    var sizeGrowth = setup.getRandomInt(15, 20);

    cockGrowth = setup.applyGrowth(State.variables.CharacterSheet_Shard_Ring, "cock", cockGrowth);
    ballsGrowth = setup.applyGrowth(State.variables.CharacterSheet_Shard_Ring, "balls", ballsGrowth);
    muscleGrowth = setup.applyGrowth(State.variables.CharacterSheet_Shard_Ring, "muscles", muscleGrowth);
    sizeGrowth = setup.applyGrowth(State.variables.CharacterSheet_Shard_Ring, "height", sizeGrowth);

    displayString += setup.growthFlavourDescriptors(State.variables.CharacterSheet_Shard_Ring, State.variables.CharacterSheet_Player, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth);

    return displayString;
};

setup.absorbEssenceEffects = function (attackerSheet, victimSheet) {
    var displayString = "";

    attackerSheet.applyAbilityRuntimeData(setup.Ability_EssenceSurge);

    displayString += "∇: " + attackerSheet.info.name + " gains " + (State.variables.FightTurn * 5) + " Strength."

    return displayString;
};

setup.incubusStrikeEffects = function (attackerSheet, victimSheet) {
    var attackDamage = setup.getAttackDamage(attackerSheet, victimSheet, attackerSheet.fight.variables.currentFightMove);
    var lustAbsorbtion = attackDamage * 3;

    victimSheet.fight.variables.currentArousal -= lustAbsorbtion;
    victimSheet.fight.variables.currentArousal = Math.max(victimSheet.fight.variables.currentArousal, setup.getStatValue(victimSheet, "minArousal"));

    var cockGrowth = Math.min(Math.ceil(attackDamage * 0.07), 6);
    var ballsGrowth = Math.min(Math.ceil(attackDamage * 0.025), 2);
    var muscleGrowth = Math.min(Math.ceil(attackDamage * 0.02), 3);
    var sizeGrowth = Math.min(Math.ceil(attackDamage * 0.13), 18);

    cockGrowth = setup.applyGrowth(attackerSheet, "cock", cockGrowth);
    ballsGrowth = setup.applyGrowth(attackerSheet, "balls", ballsGrowth);
    muscleGrowth = setup.applyGrowth(attackerSheet, "muscles", muscleGrowth);
    sizeGrowth = setup.applyGrowth(attackerSheet, "height", sizeGrowth);

    var displayString = "";

    displayString += setup.growthFlavourDescriptors(attackerSheet, victimSheet, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth);

    return displayString;
};

setup.growthFlavourDescriptors = function (attackerSheet, victimSheet, cockGrowth, ballsGrowth, muscleGrowth, sizeGrowth, minimal) {
    var His = setup.getPronoun(attackerSheet, "pronounDepPosCap");
    var his = setup.getPronoun(attackerSheet, "pronounDepPos");

    var displayString = "";

    if (attackerSheet.id == "CharacterSheet_Player") {
        if (muscleGrowth > 0) {
            displayString += setup.getMuscleGrowthSequenceText(attackerSheet, "Your", minimal);
            displayString += "\n"
        }

        if (cockGrowth > 0 && minimal != true) {
            displayString += setup.getFlavourBasedDescription(attackerSheet, "CockGrowthFlavourText", 1)
            displayString += "\n";
        }

        if (setup.hasLimb(attackerSheet.info.anatomy, "cocks") && cockGrowth > 0) {
            displayString += "∇: Your cock has grown " + setup.getLength(cockGrowth) + ".\n";
        }

        if (setup.hasLimb(attackerSheet.info.anatomy, "balls") && ballsGrowth > 0) {
            displayString += "∇: Your balls grow by " + setup.getLength(ballsGrowth) + ".\n";
        }

        if (sizeGrowth > 0) {
            displayString += "∇: Your body has become " + setup.getLength(sizeGrowth) + " taller \n";
        }

        displayString += "You marvel at your " + setup.getLength(setup.getStatValue(attackerSheet, "height")) + " muscular frame. ";
        displayString += "Your " + setup.getLength(setup.getStatValue(attackerSheet, "cock")) + " cock throbs with arousal."

    }
    else {
        if (muscleGrowth > 0) {
            displayString += setup.getMuscleGrowthSequenceText(attackerSheet, His)
            displayString += "\n"
        }

        if (cockGrowth > 0 && minimal != true) {
            displayString += setup.getFlavourBasedDescription(attackerSheet, "CockGrowthFlavourText", 1)
            displayString += "\n"
        }

        if (setup.hasLimb(attackerSheet.info.anatomy, "cocks") && cockGrowth > 0) {
            displayString += "∇: " + his + " cock has grown by " + setup.getLength(cockGrowth) + ".\n";
        }

        if (setup.hasLimb(attackerSheet.info.anatomy, "balls") && ballsGrowth > 0) {
            displayString += "∇: " + his + " balls have grown by " + setup.getLength(ballsGrowth) + ".\n";
        }

        if (sizeGrowth > 0) {
            displayString += "∇: " + his + " body becomes " + setup.getLength(sizeGrowth) + " taller \n";
        }

        displayString += attackerSheet.info.name + " marvels at " + his + " " + setup.getLength(setup.getStatValue(attackerSheet, "height")) + " muscular frame. ";
        displayString += His + " " + setup.getLength(setup.getStatValue(attackerSheet, "cock")) + " cock throbs with arousal."
    }

    return displayString;
}

setup.slimeLungeEffects = function (attackerSheet, victimSheet) {
    var displayString = "";
    if (setup.sizecomparison(setup.getStatValue(attackerSheet, "height"), setup.getStatValue(victimSheet, "height")) >= setup.Comparators.SLIGHTLY_BIGGER) {

        if (setup.getRandomInt(0, 100) > 80) {
            displayString += attackerSheet.info.name + " knocks " + victimSheet.info.name + " down on their back.";
            setup.stunTarget(attackerSheet, victimSheet, 1);
        }
    }
    else {
        displayString += attackerSheet.info.name + " clashes against " + victimSheet.info.name + "'s body, but their impressive stature stands.";
    }

    return displayString;
}

setup.incubusCallEffects = function (attackerSheet, victimSheet) {
    victimSheet.fight.variables.currentArousal += 40;
    victimSheet.fight.variables.currentArousal = Math.min(victimSheet.fight.variables.currentArousal, 100);

    var ballsGrowth = 1;
    var cockGrowth = 2;
    var bodyGrowth = 3;
    bodyGrowth = setup.applyGrowth(victimSheet, "height", bodyGrowth);
    cockGrowth = setup.applyGrowth(victimSheet, "cock", cockGrowth);
    ballsGrowth = setup.applyGrowth(victimSheet, "balls", ballsGrowth);

    var displayString = "";
    displayString += "∇: " + victimSheet.info.name + " gains <span style='color:#ac46c5;'>40</span> Arousal \n";
    displayString += "∇: " + victimSheet.info.name + "'s cock permanently grows by " + setup.getLength(cockGrowth) + "\n";
    displayString += "∇: " + victimSheet.info.name + "'s body permanently grows by " + setup.getLength(bodyGrowth) + "\n";
    displayString += "∇: " + victimSheet.info.name + "'s balls permanently grows by " + setup.getLength(ballsGrowth);

    return displayString;
};

setup.masturbate = function (attackerSheet, victimSheet) {
    attackerSheet.fight.variables.currentArousal += Math.abs(setup.getStatValue(attackerSheet, "arousalGain"))

    attackerSheet.fight.variables.currentArousal = Math.min(attackerSheet.fight.variables.currentArousal, 100);

    return "";
};

setup.focusFightMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += attackerSheet.applyAbilityRuntimeData(setup.Ability_Focused);

    return displayString;
};

setup.lustfulInstinctsMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    attackerSheet.fight.variables.currentArousal = Math.min(attackerSheet.fight.variables.currentArousal + 10, 100);

    displayString += "∇: " + attackerSheet.info.name + " gains 10 Arousal \n";

    return displayString;
};

setup.corruptedUrgesMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += attackerSheet.applyAbilityRuntimeData(setup.Ability_CorruptedStrength);

    displayString += "∇: " + attackerSheet.info.name + " gains the 'Corrupted Strength' ability until the end of combat \n";

    return displayString;
};

setup.unnaturalGrowthMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    attackerSheet.applyAbilityRuntimeData(setup.Ability_UnnaturalGrowth);

    displayString += "∇: " + attackerSheet.info.name + " gains the 'Unnatural Growth' ability until the end of combat \n";

    return displayString;
};

setup.infectiousLustMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    setup.applyCorruption(victimSheet, 5);
    victimSheet.fight.variables.currentArousal = Math.min(victimSheet.fight.variables.currentArousal + 50, 100);

    displayString += "∇: " + victimSheet.info.name + " gains 5 Corruption.\n";
    displayString += "∇: " + victimSheet.info.name + " gains 50 Arousal.";

    return displayString;
};

setup.corruptedRemedyMove = function (attackerSheet, victimSheet) {
    var displayString = "";

    let corruption = setup.getStatValue(attackerSheet, "corruption");
    let value = Math.floor(corruption * 0.05);

    attackerSheet.fight.variables.currentHP = Math.min(attackerSheet.fight.variables.currentHP + value, setup.getMaxHP(attackerSheet));

    displayString += attackerSheet.info.name + " gains " + value + " hp."

    return displayString;
};