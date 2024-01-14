
/* twine-user-script #25: "FightHelper.js" */
setup.createEntity = function (characterSheet, difficulty = 0) {
    characterSheet.info.alive = true;

    var difficultyArrayName = setup.getEncounterListNameByDifficulty(difficulty);

    if (State.variables[difficultyArrayName] != undefined) {
        State.variables[difficultyArrayName].push(characterSheet.id);
        return;
    }
    return;
};

setup.getEncounterListNameByDifficulty = function (difficulty) {
    switch (difficulty) {
        case 0:
            return "EasyRandomEncounters";
        case 1:
            return "MediumRandomEncounters";
    }
}

setup.getEncounterList = function (difficulty) {
    switch (difficulty) {
        case 0:
            return State.variables.EasyRandomEncounters;
        case 1:
            return State.variables.MediumRandomEncounters;
    }
}

setup.getAllEncounters = function () {
    var allEncounters = [];
    allEncounters = allEncounters.concat(State.variables.EasyRandomEncounters);
    allEncounters = allEncounters.concat(State.variables.MediumRandomEncounters);
    return allEncounters;
}


setup.getEncounterAmount = function () {
    return State.variables.EasyRandomEncounters.length + State.variables.MediumRandomEncounters.length
}

setup.aiFightStart = function () {
    if (State.variables.Encounter_Target.id == State.variables.CharacterSheet_Player.fight.teammate) {
        State.variables.CachedTeammate = State.variables.CharacterSheet_Player.fight.teammate;
        State.variables.CharacterSheet_Player.fight.teammate = undefined;
    }

    if (State.variables.Encounter_Target.fight.aiFightStart) {
        State.variables.Encounter_Target.fight.aiFightStart()
    }
};

setup.broadcastFightFlowTrigger = function (player, enemy, trigger) {
    var displayString = "";
    var params =
    {
        trigger: trigger,
        self: player,
        target: enemy,
    }
    displayString += player.broadcastAbilityTrigger(params);

    let teammate = player.fight.teammate;

    if (teammate != undefined) {
        var params =
        {
            trigger: trigger,
            self: State.variables[teammate],
            target: enemy,
        }
        displayString += State.variables[teammate].broadcastAbilityTrigger(params);
    }

    params =
    {
        trigger: trigger,
        self: enemy,
        target: player,
    }
    displayString += enemy.broadcastAbilityTrigger(params);

    return displayString;
}

setup.displayTooltipedString = function (exterior, interior) {
    var displayString = "";
    displayString += "<span class='tooltip'>"
    displayString += exterior;

    displayString += "<span class='tooltipContainer'>";
    displayString += "<span class='tooltiptext'>";
    displayString += interior;
    displayString += "</span>";
    displayString += "</span>";

    displayString += "</span>";

    return displayString;
}

setup.getSkillDisplayString = function (character, target, fightMove, fightHotkey, useDoubleBackslashLinebreak = true) {
    var displayString = "";
    var allowedLines = 8;

    var linebreak = "\\n";

    if (useDoubleBackslashLinebreak == false) {
        linebreak = "\n";
    }

    if (fightMove.comboValue != undefined) {
        displayString += "<div class='" + setup.getCorruptionUIClassName("comboValue", setup.getStatValue(character, "corruption")) + "'>";
        displayString += setup.displayTooltipedString(fightMove.comboValue != 0 ? fightMove.comboValue : "*", "Link Value<br>(Can only combo with moves that have an adjacent Link Value)");
        displayString += "</div>";
    }

    displayString += "<div id='FightSkillHeader' class='" + fightMove.skillType + "'>"

    /*if(fightMove.staminaCost != 0)
    {
        displayString += "<div class='"+setup.getCorruptionUIClassName("FightSkillCardStaminaCost", setup.getStatValue(character, "corruption"))+"'>"
        displayString += setup.displayTooltipedString(fightMove.staminaCost, "Stamina Cost");
        displayString += "</div>";
    }*/

    displayString += "<div class='FightSkillHeaderStatIconRow'>"
    if (fightMove.critMod != 100) {
        displayString += setup.displayChanceToHit(character, fightMove);
    }

    if (setup.getAttackDamage(character, target, fightMove) >= 0) {
        displayString += setup.getAttackDamageDisplay(character, target, fightMove);
    }

    /*if(fightMove.cooldown)
    {
        displayString += "<div class='"+setup.getCorruptionUIClassName("FightSkillCardCooldown", setup.getStatValue(character, "corruption"))+"'>"
        displayString += setup.displayTooltipedString(fightMove.cooldown, "Cooldown");
        displayString += "</div>";
    }
    
    if(fightMove.maxStack)
    {
        displayString += "<div class='"+setup.getCorruptionUIClassName("FightSkillCardStackCount", setup.getStatValue(character, "corruption"))+"'>"
        displayString += setup.displayTooltipedString(fightMove.maxStack, "Maximum Stack Count");
        displayString += "</div>";
    }*/

    displayString += "</div>";
    displayString += "</div>";

    displayString += "<div class='comboMoveName'>";
    /*if(fightHotkey != undefined)
    {
        displayString += fightHotkey +". ";
    }*/

    displayString += fightMove.name;
    displayString += "</div>";

    displayString += "<p id='FightSkillBody'>";

    //remove allowed lines mechanic
    if (fightMove.skillStatsToDescriptionSpacing) {
        allowedLines -= fightMove.skillStatsToDescriptionSpacing;
    }
    else {
        //assume one line for flavour text by default
        allowedLines--;
    }

    displayString += fightMove.skillDescription;
    displayString += "</p>";

    console.log("2")
    console.log(fightMove)
    if (fightMove.comboCost != undefined) {
        let costMultiplier = setup.getProwessCostMultiplier(character);

        displayString += "<div class='FightSkillActionCosts'>"

        displayString += "<span class='tooltip'>"

        displayString += "<div class='FightSkillActionCostsNumber'>"
        displayString += (fightMove.comboCost * costMultiplier).toFixed(2).replace(/\.00$/, '')
        displayString += "</div>";
        displayString += "<div class='FightSkillActionCostsFirstLink'>"
        displayString += "</div>";

        for (let i = 0; i < Math.ceil(fightMove.comboCost * costMultiplier); ++i) {
            displayString += "<div class='FightSkillActionCostsMiddleLink'>"
            displayString += "</div>";
        }

        displayString += "<div class='FightSkillActionCostsLastLink'>"
        displayString += "</div>";

        displayString += "<span class='tooltipContainer'>";
        displayString += "<span class='tooltiptext'>";
        displayString += "Action Cost<br>(Determines how many links this move takes in your timeline)<br>";
        displayString += "Prowess reduces cost by " + (1 - (costMultiplier * 100)).toFixed(2).replace(/\.00$/, '') + "% ";
        displayString += "</span>";
        displayString += "</span>";

        displayString += "</span>";

        displayString += "</div>";
    }

    return displayString;
};

setup.getProwessCostMultiplier = function (character) {
    return Math.max(0.3, 1 - (setup.getMaxStamina(character) / 1000));
};

setup.getAttackChanceToHit = function (character, fightMove) {
    return setup.getCritChance(character) + fightMove.critMod;
};

setup.getAttackDamage = function (character, target, fightMove) {
    var strength = setup.getStatValue(character, "strength");
    if (fightMove.dmg) {
        let param = fightMove.dmg(character, target);
        return Math.floor(param.multiplier * strength / 5) + param.addon;
    }

    return 0;
};

setup.getAttackDamageDisplay = function (character, target, fightMove) {
    var displayString = "";

    if (fightMove.dmg) {
        let param = fightMove.dmg(character, target)
        let damage = setup.getAttackDamage(character, target, fightMove);

        console.log("asdasdasddsasdasdsadasddas")
        console.log(damage)
        if (damage > 0) {
            displayString += "<div class='" + setup.getCorruptionUIClassName("FightSkillCardAttackDamage", setup.getStatValue(character, "corruption")) + "'>"

            var strength = setup.getStatValue(character, "strength");

            displayString += " <span class='tooltip' id=";
            if (damage < Math.floor(param.multiplier * strength / 5)) {
                displayString += "'StatModifierNegative'";
            }
            else {
                displayString += "'StatModifierPositive'";
            }

            displayString += ">" + damage;
            displayString += "<span class='tooltipContainer'>";
            displayString += "<span class='tooltiptext'>";
            displayString += "Damage Value<br><br>";
            displayString += "Modifiers:<br>";


            var damageMod = { mod: setup.mod.ADD, value: Math.floor(strength / 5) };
            displayString += setup.displayModifierText(damageMod, "Strength Stat ");
            displayString += "<br>";

            if (param.multiplier != 0 && param.multiplier != 1) {
                var multiplierMod = { mod: setup.mod.MULTIPLYPOS, value: param.multiplier };
                displayString += setup.displayModifierText(multiplierMod, "Multiplier ");
                displayString += "<br>";
            }

            var addonMod = { mod: setup.mod.ADD, value: param.addon };
            displayString += setup.displayModifierText(addonMod, "Bonus Damage ");

            displayString += "</span>";
            displayString += "</span>";
            displayString += "</span>";

            displayString += "</div>"
        }
    }

    return displayString;
};

setup.applyCooldown = function (character, target, fightMove) {
    var cooldown =
    {
        skillID: fightMove.name,
        value: fightMove.cooldown,
    }

    character.fight.variables.cooldowns.push(cooldown);
}

setup.updateCooldowns = function (character, target) {
    character.fight.variables.cooldowns = character.fight.variables.cooldowns.filter(function (val) {
        val.value--;
        if (val.value <= 0) {
            return false;
        }
        return true;
    });
}

setup.preAttacksUpdate = function (character, target) {
    State.variables.FightTurn++;

    if (setup.isStunned(character)) {
        setup.clearCombo();
    }

    var params =
    {
        trigger: setup.AbilityTrigger.ON_FIGHT_TURN_START,
        self: character,
        target: target,
    }
    character.fight.variables.currentTurnAbilityText = character.broadcastAbilityTrigger(params);

    let teammate = character.fight.teammate;

    if (teammate != undefined) {
        params =
        {
            trigger: setup.AbilityTrigger.ON_FIGHT_TURN_START,
            self: State.variables[teammate],
            target: target,
        }
        State.variables[teammate].fight.variables.currentTurnAbilityText = State.variables[teammate].broadcastAbilityTrigger(params);
    }

    params =
    {
        trigger: setup.AbilityTrigger.ON_FIGHT_TURN_START,
        self: target,
        target: character,
    }
    target.fight.variables.currentTurnAbilityText = target.broadcastAbilityTrigger(params);

    setup.updateCooldowns(character, target);
    if (teammate != undefined) {
        setup.updateCooldowns(State.variables[teammate], target);
    }
    setup.updateCooldowns(target, character);

    if (target.fight.preAttacksAIUpdate) {
        target.fight.preAttacksAIUpdate();
    }
};

setup.postAttacksAIUpdate = function (character) {
    if (character.fight.postAttacksAIUpdate) {
        character.fight.postAttacksAIUpdate();
    }
};

setup.doComboAttack = function (attackerSheet, victimSheet) {
    var displayString = "";
    for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
        attackerSheet.fight.variables.currentFightMoveOutcome = "";
        let fightSkillIndex = State.variables.FightComboStackIndexes[i];
        attackerSheet.fight.variables.currentFightMove = State.variables.FightSkills[fightSkillIndex];

        displayString += "<div class='AttackAttemptContainer'>";

        if (State.variables.FightSkills[fightSkillIndex].attackAttemptDesc && State.variables.FightSkills[fightSkillIndex].currentStep == State.variables.FightSkills[fightSkillIndex].steps) {
            displayString += "<div class='attackAttemptDesc'>";
            displayString += State.variables.FightSkills[fightSkillIndex].attackAttemptDesc(attackerSheet, victimSheet);
            displayString += "</div>";
        }

        displayString += setup.doAttack(attackerSheet, victimSheet);
        displayString += "</div>";
        displayString += "\n\n"
    }

    //attackerSheet.fight.variables.currentStamina -= setup.calculateComboStaminaCost();

    attackerSheet.fight.variables.currentFightMoveOutcome = displayString;
}

setup.displayTurnHeaderText = function (attackerSheet, victimSheet) {
    var displayString = "";

    displayString += "<div class='turnHeaderText'>";
    displayString += "<h1>" + attackerSheet.info.name + "'s Turn</h1>";
    displayString += "</div>";

    return displayString;
}

setup.cardClicked = function (id, isSpecial) {
    console.log("cardClicked")
    console.log(id)
    let fightMove;

    if (isSpecial) {
        fightMove = setup[id];
    }
    else {
        let cardIndex = id.match(/\d+/)[0];
        fightMove = setup[State.variables.FightSkillsHand[cardIndex]];
    }

    console.log("post set fightMove")

    if (setup.canTeammateAct(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, setup.AttackTiming.BEFORE_PLAYER) == true) {
        setup.doTeammateAttacks();
    }

    setup.applyAttack(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, "playerTimeline", fightMove, setup.playerHistory);

    if (setup.canTeammateAct(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, setup.AttackTiming.BETWEEN_PLAYER_AND_ENEMY) == true) {
        setup.doTeammateAttacks();
    }

    while (setup.targetHistory.chains < setup.playerHistory.chains) {
        setup.setNextAIMove(State.variables.Encounter_Target, State.variables.CharacterSheet_Player);
        setup.applyAttack(State.variables.Encounter_Target, State.variables.CharacterSheet_Player, "enemyTimeline", State.variables.Encounter_Target.fight.variables.currentFightMove, setup.targetHistory);
    }

    if (setup.canTeammateAct(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, setup.AttackTiming.AFTER_ENEMY) == true) {
        setup.doTeammateAttacks();
    }

    console.log("applyAttack done")

    setup.postAttacksAIUpdate(State.variables.Encounter_Target)

    console.log("postAttacksAIUpdate done")

    setup.updateFightStatus(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)

    console.log("updateFightStatus done")

    UIBar.update();

    if (State.variables.Encounter_Target != undefined) {
        setup.newTurn(State.variables.CharacterSheet_Player, State.variables.Encounter_Target);

        //start next turn
        setup.buildCardsData();

        console.log("buildCardsData done")

        setup.preAttacksUpdate(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)

        console.log("preAttacksUpdate done")
    }
}

setup.doTeammateAttacks = function () {
    while (setup.teammateHistory.chains < setup.playerHistory.chains) {
        setup.setNextAIMove(State.variables[State.variables.CharacterSheet_Player.fight.teammate], State.variables.Encounter_Target);
        setup.applyAttack(State.variables[State.variables.CharacterSheet_Player.fight.teammate], State.variables.Encounter_Target, "teammateTimeline", State.variables[State.variables.CharacterSheet_Player.fight.teammate].fight.variables.currentFightMove, setup.teammateHistory);
    }
}

setup.setNextAIMove = function (attackerSheet, victimSheet) {
    if (setup.isStunned(attackerSheet)) {
        if (attackerSheet.fight.variables.hypnotizedMoveIDsList.length > 0) {
            attackerSheet.fight.variables.currentFightMove = setup[attackerSheet.fight.variables.hypnotizedMoveIDsList.random()];
        }
        else {
            attackerSheet.fight.variables.currentFightMove = setup.FightMove_Stunned;
        }
    }
    else {
        setup.aiApplyNextFightMove(attackerSheet, victimSheet);
    }

    console.log("aiApplyNextFightMove")
    console.log(attackerSheet.fight.variables.currentFightMove)
}

setup.applyAttack = function (character, target, timelineClass, move, fullHistory) {
    character.fight.variables.currentFightMove = move;
    let attempt = "";

    if (move.attackAttemptDesc != undefined) {
        attempt += "<div class='attackAttemptDesc'>";
        attempt += move.attackAttemptDesc(character, target);
        attempt += "</div>";
    }

    setup.doAttack(character, target);
    let historyObject = { id: move.id, name: move.name, recent: true, outcome: attempt + character.fight.variables.currentFightMoveOutcome }

    historyObject.outcome += setup.updateArousal(character);

    console.log("historyObject")
    console.log(historyObject)

    let costMultiplier = setup.getProwessCostMultiplier(character)

    fullHistory.history.push(historyObject);
    fullHistory.chains += move.comboCost * costMultiplier;

    setup.updateTimeline(character, timelineClass, fullHistory);
}

setup.buildCardsData = function () {
    State.variables.FightSkillsHand = [];
    var elements = $(".ComboFightMovesContainer").find(".FullCard");
    console.log("elements")
    console.log(elements)

    console.log("State.variables.EquippedFightMoveIDs")
    console.log(State.variables.EquippedFightMoveIDs)
    console.log(State.variables.FightSkills)

    var nonSpecialSkills = State.variables.FightSkills.filter(function (val) {
        if (val.skillType != "special") {
            return true;
        }
        return false;
    });

    console.log(nonSpecialSkills)

    //check desync cards amount
    let actionSlots = setup.getStatValue(State.variables.CharacterSheet_Player, "actionSlots");
    while (actionSlots > elements.length) {
        $(elements[0]).clone().appendTo(".ComboFightMovesContainer");
        elements = $(".ComboFightMovesContainer").find(".FullCard");
    }

    for (let i = 0; i < elements.length; ++i) {
        var move = nonSpecialSkills.random().id;
        State.variables.FightSkillsHand.push(move);

        elements[i].id = "CardMove" + i;

        setup.applyCardToElement(move, $(elements[i]), false)
    }

    var specialElements = $(".SpecialFightMovesContainer").find(".FullCard");

    console.log("specialElements")
    console.log(specialElements)

    var specialSkills = State.variables.FightSkills.filter(function (val) {
        if (val.skillType == "special") {
            return true;
        }
        return false;
    });

    for (let i = 0; i < specialElements.length; ++i) {
        var move = specialSkills[i].id;
        specialElements[i].id = specialSkills[i].id;
        setup.applyCardToElement(move, $(specialElements[i]), true)
    }
}

setup.applyCardToElement = function (move, element, isSpecial) {
    console.log("applyCardToElement")
    console.log(element)
    let domElement = element[0];
    let highlight = element.find(".FightSkillCardHighlight")

    /*highlight.unbind('mouseenter');
    highlight.mouseenter(function() {
        $(this).addClass("selected");
      });
      
    highlight.unbind('mouseleave');
    highlight.mouseleave(function() {
    $(this).removeClass("selected");
    });*/

    element.unbind('click');
    element.click(function () {
        setup.cardClicked($(this).attr('id'), isSpecial)
    });

    setup.setFightSkillCardBackgroundStyle(domElement.id, move);

    //set move name
    domElement.querySelector("#MoveName").innerHTML = setup[move].name;
    domElement.querySelector("#FightSkillBody").innerHTML = setup[move].skillDescription;

    let damageElement = domElement.querySelector("#CardDamage");
    let critElement = domElement.querySelector("#CardCritChance");

    if (setup.getAttackDamage(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, setup[move]) > 0) {
        damageElement.style.display = "block";
        critElement.style.display = "block";

        damageElement.innerHTML = setup.getAttackDamageDisplay(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, setup[move]);

        if (setup[move].critMod != 100) {
            critElement.innerHTML = setup.displayChanceToHit(State.variables.CharacterSheet_Player, setup[move]);
        }
    }
    else {
        damageElement.style.display = "none";
        critElement.style.display = "none";
    }

    if (setup[move].comboCost != undefined) {
        let costMultiplier = setup.getProwessCostMultiplier(State.variables.CharacterSheet_Player)
        let comboCostHTML = "";
        comboCostHTML += "<div class='FightSkillActionCosts'>"

        comboCostHTML += "<span class='tooltip'>"

        comboCostHTML += "<div class='FightSkillActionCostsNumber'>"
        comboCostHTML += (setup[move].comboCost * costMultiplier).toFixed(2).replace(/\.00$/, '')
        comboCostHTML += "</div>";
        comboCostHTML += "<div class='FightSkillActionCostsFirstLink'>"
        comboCostHTML += "</div>";

        for (let i = 0; i < Math.ceil(setup[move].comboCost * costMultiplier); ++i) {
            comboCostHTML += "<div class='FightSkillActionCostsMiddleLink'>"
            comboCostHTML += "</div>";
        }

        comboCostHTML += "<div class='FightSkillActionCostsLastLink'>"
        comboCostHTML += "</div>";

        comboCostHTML += "<span class='tooltipContainer'>";
        comboCostHTML += "<span class='tooltiptext'>";
        comboCostHTML += "Action Cost<br>(Determines how many links this move takes in the Combo Chain)";
        comboCostHTML += "Prowess reduces cost by " + (costMultiplier * 100).toFixed(2).replace(/\.00$/, '') + "% ";

        comboCostHTML += "</span>";
        comboCostHTML += "</span>";

        comboCostHTML += "</span>";

        comboCostHTML += "</div>";


        domElement.querySelector("#CardActionCost").innerHTML = comboCostHTML;
    }
}

setup.setupTimeline = function (character, characterClass, attackHistory) {
    setup.updateTimeline(character, characterClass, attackHistory);
}

setup.selectCircle = function (characterClass, selector) {
    let element = $("#" + characterClass);

    let circleID = "#" + selector;
    let spanSelector = circleID.replace("circle", "circleSpan");
    var current = circleID.replace("circle", "");

    element.find(".circleActive").removeClass("circleActive");
    element.find(circleID).addClass("circleActive");

    if (element.find(spanSelector).hasClass("right")) {
        element.find(".center").removeClass("center").addClass("left")
        element.find(spanSelector).addClass("center");
        element.find(spanSelector).removeClass("right")
    } else if (element.find(spanSelector).hasClass("left")) {
        element.find(".center").removeClass("center").addClass("right");
        element.find(spanSelector).addClass("center");
        element.find(spanSelector).removeClass("left");
    };
};

setup.updateTimeline = function (character, characterClass, attackHistory) {
    let timelineFill = attackHistory.offset;
    var timelineSize = 10;
    let element = $("#" + characterClass);

    console.log("attackHistory")
    console.log(attackHistory)
    let costMultiplier = setup.getProwessCostMultiplier(character);

    for (let i = 0; i < attackHistory.history.length; i++) {
        timelineFill += setup[attackHistory.history[i].id].comboCost * costMultiplier;
    }

    console.log("cleaning timeline")

    if (timelineFill > timelineSize) {
        let lastAttack = attackHistory.history.pop();

        console.log("overfill");
        console.log(timelineFill);


        timelineFill -= setup[lastAttack.id].comboCost * costMultiplier;
        attackHistory.offset = timelineFill - timelineSize;
        attackHistory.history = [lastAttack];


        console.log(timelineSize);
        console.log(timelineFill);
    }

    element.find("#chainsLabel").text(attackHistory.chains.toFixed(2).replace(/\.00$/, ''));

    if (attackHistory.history.length > 0) {
        var timelineProgress = attackHistory.offset;
        element.find("#line").empty();
        element.find("#mainCont").empty();

        for (let i = 0; i < attackHistory.history.length; i++) {
            var timelinePlacement = timelineProgress + setup[attackHistory.history[i].id].comboCost * costMultiplier;
            console.log("timelinePlacement")
            console.log(timelinePlacement)

            //Integer relative to the first and last attackHistory
            var relativeInt = timelinePlacement / timelineSize;

            //Draw the date circle
            console.log("element");
            console.log(element);
            console.log(element.find("#line"));
            console.log(element.find("#mainCont"));

            var recentClass = "";

            if (attackHistory.history[i].recent == true) {
                recentClass = " recent";
            }

            element.find("#line").append('<div class="circle' + recentClass + '" id="circle' + i + '" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan">' + attackHistory.history[i].name + '</div></div>');

            element.find("#mainCont").append('<span id="circleSpan' + i + '" class="right">' + attackHistory.history[i].outcome + '</span>');

            timelineProgress += setup[attackHistory.history[i].id].comboCost * costMultiplier;
            attackHistory.history[i].recent = false;
        }
    }

    element.find(".circle").mouseenter(function () {
        $(this).addClass("hover");
    });

    element.find(".circle").mouseleave(function () {
        $(this).removeClass("hover");
    });

    element.find(".circle").click(function () {
        var spanNum = $(this).attr("id");

        console.log("clickID")
        console.log(spanNum)

        setup.selectCircle(characterClass, spanNum);
    });

    setup.selectCircle(characterClass, "circle" + (attackHistory.history.length - 1));
}

setup.fightStart = function (attackerSheet, victimSheet) {
    setup.newTurn(attackerSheet, victimSheet);
    setup.aiFightStart()
}

setup.newTurn = function (attackerSheet, victimSheet) {
    setup.refreshFightSkills(attackerSheet, victimSheet);
}

setup.refreshFightSkills = function (attackerSheet, victimSheet) {
    var availableFightMoveIDs = setup.getFightMovesWithAddons(attackerSheet);
    var comboMovesPerTurn = 3;

    var comboSkillIDs = availableFightMoveIDs.filter(function (val) {
        console.log("4")
        console.log(setup[val])
        if (setup[val].comboCost != undefined && setup.isFightMoveEquipped(val) == true && setup[val].unique == undefined && setup[val].skillType != "special") {
            return true;
        }
        return false;
    });

    var uniqueSkillIDs = availableFightMoveIDs.filter(function (val) {
        if (setup[val].skillType != "special" && setup[val].unique == true) {
            return true;
        }
        return false;
    });

    var specialSkillIDs = availableFightMoveIDs.filter(function (val) {
        if (setup[val].skillType == "special") {
            return true;
        }
        return false;
    });

    State.variables.FightSkills = [];
    State.variables.FightComboStackIndexes = [];

    var i;

    if (comboSkillIDs.length != 0) {
        setup.corruptComboableFightMoveList(comboSkillIDs);

        for (var i = 0; i < comboSkillIDs.length; i++) {
            var skill = { ...(setup[comboSkillIDs[i]]) };

            skill.available = true;
            State.variables.FightSkills.push(skill);
        }
    }

    for (var i = 0; i < uniqueSkillIDs.length; i++) {
        var skill = { ...(setup[uniqueSkillIDs[i]]) };

        skill.available = true;
        State.variables.FightSkills.push(skill);
    }

    for (var i = 0; i < specialSkillIDs.length; i++) {
        State.variables.FightSkills.push(setup[specialSkillIDs[i]]);
    }
}

setup.doAttack = function (attackerSheet, victimSheet) {
    if (setup.isStunned(attackerSheet)) {
        attackerSheet.fight.variables.currentFightMove = setup.FightMove_Stunned;
    }

    function addToFightOutcome(fightvariables, displayString) {
        if (displayString != "" && displayString != undefined) {
            if (displayString == "undefined" || displayString == undefined) {
                console.log("WARN: Undefined return received from ability " + fightvariables.currentFightMove.id);
            } else {
                displayString += "\n";
                fightvariables.currentFightMoveOutcome += displayString;
            }
        }
    }

    if (attackerSheet.fight.variables.currentFightMove.persistentEffectOpponent) {
        if (attackerSheet.fight.variables.currentFightMove.persistentEffectOpponent.onActivate) {
            attackerSheet.fight.variables.currentFightMove.persistentEffectOpponent.onActivate(attackerSheet, victimSheet, undefined);
        }
    }

    var params =
    {
        self: attackerSheet,
        target: victimSheet,
        thresholdToMiss: setup.getAttackChanceToHit(attackerSheet, attackerSheet.fight.variables.currentFightMove),
        attackDamage: setup.getAttackDamage(attackerSheet, victimSheet, attackerSheet.fight.variables.currentFightMove),
        hitcheck: random(0, 100),
        ignoreAdditionalEffects: false,
        finalDamageModifier: 1,
    };

    attackerSheet.fight.variables.currentFightMoveOutcome = ""
    addToFightOutcome(attackerSheet.fight.variables, setup.callAbilityTrigger(attackerSheet, "onDoAttack", params));

    if (params.attackDamage <= 0) {
        params.trigger = setup.AbilityTrigger.ON_FIGHT_DO_DAMAGELESS_ATTACK;
        addToFightOutcome(attackerSheet.fight.variables, attackerSheet.broadcastAbilityTrigger(params));
    }
    else {
        params.trigger = setup.AbilityTrigger.ON_FIGHT_DAMAGING_HIT;
        addToFightOutcome(attackerSheet.fight.variables, attackerSheet.broadcastAbilityTrigger(params));
    }

    if (attackerSheet.fight.variables.currentFightMove.cooldown) {
        setup.applyCooldown(attackerSheet, victimSheet, attackerSheet.fight.variables.currentFightMove);
    }

    /*var fightCard = "";

    fightCard += '<div class="FightSkillCardContainer">';
    fightCard += '<div class="FightSkillCard" style="'+setup.getFightSkillCardBackgroundStyle(attackerSheet, victimSheet, setup[attackerSheet.fight.variables.currentFightMove.id])+'">';
    fightCard += setup.getSkillDisplayString(attackerSheet, victimSheet, setup[attackerSheet.fight.variables.currentFightMove.id], undefined);
    fightCard += '</div>';
    fightCard += '</div>';

    addToFightOutcome(attackerSheet.fight.variables, fightCard);*/

    if (attackerSheet.fight.variables.stunnedDuration > 0) {
        //hook hook MOVE THIS SOMEWHERE ELSE
        attackerSheet.fight.variables.stunnedDuration -= 1;

        if (attackerSheet.fight.variables.stunnedDuration == 0) {
            attackerSheet.fight.variables.hypnotizedMoveIDsList = [];
        }
    }
    else if (attackerSheet.fight.variables.currentFightMove.doesNothing || attackerSheet.fight.variables.currentFightMove.currentStep != attackerSheet.fight.variables.currentFightMove.steps) {
        //do nothing
    }
    else {
        if (attackerSheet.fight.variables.currentFightMove.attackHitDesc) {
            addToFightOutcome(attackerSheet.fight.variables, attackerSheet.fight.variables.currentFightMove.attackHitDesc(attackerSheet, victimSheet));
        }

        if (attackerSheet.fight.variables.currentFightMove.persistentEffectOpponent) {
            //remove this next version
            setup.addPersistentEffect(victimSheet, attackerSheet.fight.variables.currentFightMove.persistentEffectOpponent);
        }

        if (params.hitcheck <= params.thresholdToMiss) {

            params.attackDamage = Math.ceil(params.attackDamage * setup.getStatValue(attackerSheet, "critDamage"));
        }

        if (!params.ignoreAdditionalEffects) {
            if (params.attackDamage != 0) {
                //remove this next version
                addToFightOutcome(attackerSheet.fight.variables, setup.triggerVictimPersistentEffects(attackerSheet, victimSheet, "onDamagingHit", params));
            }
        }

        params.attackDamage = Math.ceil(params.attackDamage * params.finalDamageModifier);

        params.trigger = setup.AbilityTrigger.ON_FIGHT_PRE_RECEIVE_DAMAGE;

        if (!params.ignoreAdditionalEffects) {
            let abilityString = victimSheet.broadcastAbilityTrigger(params);
            addToFightOutcome(attackerSheet.fight.variables, abilityString);
        }

        if (params.attackDamage != 0) {
            if (params.hitcheck <= params.thresholdToMiss) {
                addToFightOutcome(attackerSheet.fight.variables, "It hits with a critical hit for <span style='color:#ff0000;'>" + params.attackDamage + "</span> damage!");
            }
            else {
                addToFightOutcome(attackerSheet.fight.variables, "It hits for <span style='color:#ff0000;'>" + params.attackDamage + "</span> damage!");
            }
            params.trigger = setup.AbilityTrigger.ON_FIGHT_POST_RECEIVE_DAMAGE;

            if (!params.ignoreAdditionalEffects) {
                let abilityString = victimSheet.broadcastAbilityTrigger(params);
                addToFightOutcome(attackerSheet.fight.variables, abilityString);
            }
            var previousHP = victimSheet.fight.variables.currentHP;
            victimSheet.fight.variables.currentHP = Math.max(victimSheet.fight.variables.currentHP - params.attackDamage, 0);

            if (victimSheet.fight.variables.currentHP / setup.getStatValue(victimSheet, "hp") <= 0.5 &&
                previousHP / setup.getStatValue(victimSheet, "hp") > 0.5) {
                params.trigger = setup.AbilityTrigger.ON_ENTER_MID_HEALTH;
                addToFightOutcome(attackerSheet.fight.variables, victimSheet.broadcastAbilityTrigger(params));
            }
            else if (victimSheet.fight.variables.currentHP / setup.getStatValue(victimSheet, "hp") > 0.5 &&
                previousHP / setup.getStatValue(victimSheet, "hp") <= 0.5) {
                params.trigger = setup.AbilityTrigger.ON_ENTER_MID_HEALTH;
                addToFightOutcome(attackerSheet.fight.variables, victimSheet.broadcastAbilityTrigger(params));
            }

            if (victimSheet.fight.variables.currentHP / setup.getStatValue(victimSheet, "hp") <= 0.25 &&
                previousHP / setup.getStatValue(victimSheet, "hp") > 0.25) {
                params.trigger = setup.AbilityTrigger.ON_ENTER_LOW_HEALTH;
                addToFightOutcome(attackerSheet.fight.variables, victimSheet.broadcastAbilityTrigger(params));
            }
            else if (victimSheet.fight.variables.currentHP / setup.getStatValue(victimSheet, "hp") > 0.25 &&
                previousHP / setup.getStatValue(victimSheet, "hp") <= 0.25) {
                params.trigger = setup.AbilityTrigger.ON_EXIT_LOW_HEALTH;
                addToFightOutcome(attackerSheet.fight.variables, victimSheet.broadcastAbilityTrigger(params));
            }
        }

        if (!params.ignoreAdditionalEffects) {
            for (let i = 0; i < attackerSheet.fight.variables.currentFightMove.additionalEffects.length; i++) {
                let additionalEffectText = attackerSheet.fight.variables.currentFightMove.additionalEffects[i](attackerSheet, victimSheet);

                if (additionalEffectText != "") {
                    addToFightOutcome(attackerSheet.fight.variables, additionalEffectText);
                }
            }
        }
    }

    if (attackerSheet.id != "CharacterSheet_Player") {
        attackerSheet.fight.variables.currentStamina = Math.min(attackerSheet.fight.variables.currentStamina + setup.getStaminaRecovery(attackerSheet), setup.getStatValue(attackerSheet, "stamina"));

        if (State.variables.FightComboStackIndexes.length == 0) {
            attackerSheet.fight.variables.currentStamina -= attackerSheet.fight.variables.currentFightMove.staminaCost;
        }
    }

    return attackerSheet.fight.variables.currentFightMoveOutcome;
};

setup.displayFightTurnOutcome = function (attackerSheet, victimSheet) {
    var attackerFightVariables = attackerSheet.fight.variables;
    var victimFightVariables = victimSheet.fight.variables;

    var displayString = "";

    if (typeof attackerFightVariables.currentFightMove !== 'undefined' && typeof victimFightVariables.currentFightMove !== 'undefined') {
        displayString += setup.displayTurnHeaderText(attackerSheet, victimSheet);

        if (attackerFightVariables.currentFightMove.comboValue != undefined) {
            for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
                let fightSkillIndex = State.variables.FightComboStackIndexes[i];
                State.variables.FightSkills[fightSkillIndex].available = true;
            }
        }

        displayString += "<div class='AttackAttemptContainer'>";

        if (attackerFightVariables.currentTurnAbilityText) {
            displayString += attackerFightVariables.currentTurnAbilityText;
        }

        if (attackerFightVariables.currentFightMove.comboValue == undefined) {
            if (attackerFightVariables.currentFightMove.attackAttemptDesc && attackerFightVariables.currentFightMove.currentStep == attackerFightVariables.currentFightMove.steps) {
                let attackAttemptDesc = attackerFightVariables.currentFightMove.attackAttemptDesc(attackerSheet, victimSheet);
                displayString += attackAttemptDesc;
            }
        }

        if (attackerFightVariables.currentFightMoveOutcome.length > 0) {
            displayString += attackerFightVariables.currentFightMoveOutcome + "\n";
        }
        displayString += "</div>";
    }

    return displayString;
};

setup.learnRandomMoveFromTarget = function (attackerSheet, victimSheet) {
    var victimMovelist = setup.getFightMovesWithAddons(victimSheet);
    var attackerMovelist = setup.getFightMovesWithAddons(attackerSheet);

    var victimNoComboSkills = victimMovelist.filter(function (val) {
        if (val.skillType != "special" && val.comboCost == undefined) {
            return true;
        }
        return false;
    });

    var attackerNoComboSkills = attackerMovelist.filter(function (val) {
        if (val.skillType != "special" && val.unique == true) {
            return true;
        }
        return false;
    });

    victimNoComboSkills = victimNoComboSkills.filter(function (val) {
        if (val.unlearnable == true) {
            return false;
        }

        var i;
        for (i = 0; i < attackerNoComboSkills.length; i++) {
            if (val.name == attackerNoComboSkills[i].name) {
                return false;
            }
        }
        return true;
    });

    return victimNoComboSkills.random();
};

setup.hasLostFight = function (character) {
    return character.fight.variables.currentHP <= 0 || character.fight.variables.surrender;
}

setup.onFightEnd = function (winner, loser) {
    var displayString = "";
    var params =
    {
        trigger: setup.AbilityTrigger.ON_FIGHT_BATTLE_WON,
        self: winner,
        target: loser,
    }
    displayString += winner.broadcastAbilityTrigger(params);

    if (winner.fight.teammate != undefined) {
        params =
        {
            trigger: setup.AbilityTrigger.ON_FIGHT_BATTLE_WON,
            self: State.variables[winner.fight.teammate],
            target: loser,
        }
        displayString += State.variables[winner.fight.teammate].broadcastAbilityTrigger(params);
    }

    params =
    {
        trigger: setup.AbilityTrigger.ON_FIGHT_BATTLE_LOST,
        self: loser,
        target: winner,
    }
    displayString += loser.broadcastAbilityTrigger(params);

    if (loser.fight.teammate != undefined) {
        params =
        {
            trigger: setup.AbilityTrigger.ON_FIGHT_BATTLE_WON,
            self: State.variables[loser.fight.teammate],
            target: winner,
        }
        displayString += State.variables[loser.fight.teammate].broadcastAbilityTrigger(params);
    }

    return displayString;
}

setup.updateFightStatus = function (attackerSheet, victimSheet) {
    var victimFightVariables = victimSheet.fight.variables;

    var displayString = "";

    console.log("fffffffffffffff")

    if (setup.hasLostFight(victimSheet) && setup.hasLostFight(attackerSheet)) {
        attackerSheet.fight.variables.currentHP = 0.1;
        State.variables.FightSkills = undefined;

        Engine.play('FightOutcome_Draw');
    }
    else if (setup.hasLostFight(victimSheet)) {
        State.variables.FightSkills = undefined;

        Engine.play('FightOutcome_Win');
    }
    else if (setup.hasLostFight(attackerSheet)) {
        State.variables.FightSkills = undefined;

        Engine.play('FightOutcome_Loss');
    }
    else {
        console.log("2")

        if (attackerSheet.fight.teammate != undefined) {
            var teammateEffects = setup.displayCurrentPersistentEffects(State.variables[attackerSheet.fight.teammate], victimSheet);
            if (teammateEffects != "") {
                displayString += teammateEffects;
                displayString += "\n";
            }
        }

        console.log("3")

        var attackerEffects = setup.displayCurrentPersistentEffects(attackerSheet, victimSheet);
        if (attackerEffects != "") {
            displayString += attackerEffects;
            displayString += "\n";
        }

        var victimEffects = setup.displayCurrentPersistentEffects(victimSheet, attackerSheet);
        if (victimEffects != "") {
            displayString += victimEffects;
            displayString += "\n";
        }

        console.log("4")

        displayString += victimSheet.info.name + " looks " + setup.Fight_HealthDescriptor(setup.getMaxHP(victimSheet), victimFightVariables.currentHP);
        displayString += "\n\n";

        /*if(attackerSheet.fight.teammate != undefined)
        {
            displayString += State.variables[attackerSheet.fight.teammate].fight.variables.currentFightMove.preparation(State.variables[attackerSheet.fight.teammate], attackerSheet);
            
            if(State.variables[attackerSheet.fight.teammate].fight.variables.currentFightMove.callbackOnPreparation)
            {
                State.variables[attackerSheet.fight.teammate].fight.variables.currentFightMove.callbackOnPreparation(State.variables[attackerSheet.fight.teammate], attackerSheet);
            }

            displayString += "\n\n";
        }

        console.log("5")

        displayString += victimFightVariables.currentFightMove.preparation(victimSheet, attackerSheet);
    	
        if(victimFightVariables.currentFightMove.callbackOnPreparation)
        {
            victimFightVariables.currentFightMove.callbackOnPreparation(victimSheet, attackerSheet);
        }
    	
        displayString +="\n";
        displayString +="\n";*/

        console.log("7")

        /*if(setup.isStunned(attackerSheet))
        {
            if(attackerSheet.fight.variables.hypnotizedMoveIDsList.length > 0)
            {
                State.variables.availableFightMoveIDs = attackerSheet.fight.variables.hypnotizedMoveIDsList;

                displayString += setup.displayAvailableFightMoves(attackerSheet, victimSheet, State.variables.availableFightMoveIDs);
            }
            else
            {
                //hook
                var _fightMoveDescription = setup.getSkillDisplayString(attackerSheet, victimSheet, setup.FightMove_Stunned, "1", false);
                displayString += "<a class='FightSkillCard' style='"+setup.getFightSkillCardBackgroundStyle(attackerSheet, victimSheet, setup.FightMove_Stunned)+"' data-passage='FightLogic' data-setter='$CharacterSheet_Player.fight.variables.currentFightMove = setup.FightMove_Stunned'>"+ _fightMoveDescription +" </a>";
            }
        }
        else
        {
            State.variables.availableFightMoveIDs = setup.getFightMovesWithAddons(attackerSheet);
            displayString += setup.displayAvailableFightMoves(attackerSheet, victimSheet, State.variables.availableFightMoveIDs);
        }*/

        console.log("8")
    }

    console.log("end of it")
    console.log($("#enemyInfo"))
    console.log(displayString)
    $("#enemyInfo").html(displayString);
};

setup.showInspectWindow = function (attackerSheet, target) {
    Dialog.setup("Inspect");

    var dialogText = "";
    dialogText += '<div class="inspectWindow">'
    dialogText += setup.getInspectText(attackerSheet, target)
    dialogText += '</div>'

    Dialog.append(dialogText);

    Dialog.open();
}

setup.showInspectText = function (attackerSheet, target, displayID) {
    $("#" + displayID).find("#mainCont").html(setup.getInspectText(attackerSheet, target));
}

setup.aiApplyNextFightMove = function (ai, aiTarget) {
    var aiAvailableMoveIDs = setup.getFightMovesWithAddons(ai);
    aiAvailableMoveIDs = aiAvailableMoveIDs.filter(function (val) {
        if (setup.canActivateFightMove(ai, aiTarget, setup[val]) == "") {
            return true;
        }
        return false;
    });

    console.log("aiAvailableMoveIDs")
    console.log(aiAvailableMoveIDs)

    if (aiAvailableMoveIDs.length <= 0) {
        aiAvailableMoveIDs.push(setup.FightMove_Basic_Attack.id);
    }

    if (ai.fight.variables.currentFightMove && ai.fight.variables.currentFightMove.currentStep != ai.fight.variables.currentFightMove.steps) {
        ai.fight.variables.currentFightMove.currentStep++;
    }
    else {
        console.log("setup ids")
        if (ai.fight.getNextFightMoveID) {
            ai.fight.variables.currentFightMove = setup[ai.fight.getNextFightMoveID()];
        }
        else {
            ai.fight.variables.currentFightMove = setup[aiAvailableMoveIDs.random()];
        }
        console.log(ai.fight.variables.currentFightMove)
    }
}

setup.canTeammateAct = function (protagonistSheet, enemySheet, timing) {
    var teammateName = protagonistSheet.fight.teammate;

    if (teammateName != undefined) {
        if (State.variables[teammateName].fight.teammateSettings.attackTiming == timing) {
            return true;
        }
    }

    return false;
}

setup.getInspectText = function (character, target) {
    var displayString = "";

    displayString += character.info.name + " inspects " + target.info.name + " carefully.\n\n";

    if (target.info.picture != undefined) {
        displayString += setup.displayEncounterImage(target.info.picture) + "\n\n";
    }
    else if (target.info.bodyVisual != undefined) {
        displayString += setup.setAndDisplayBodyVisual(target, undefined) + "\n\n";
    }

    displayString += "HP: " + target.fight.variables.currentHP + "/" + setup.displayStatValue(target, "hp") + "\n";
    displayString += "Prowess: " + setup.displayStatValue(target, "stamina") + "\n";
    displayString += "Arousal: " + target.fight.variables.currentArousal + "\n\n";

    displayString += "Strength: " + setup.displayStatValue(target, "strength") + "\n";
    displayString += "Critical Hit Chance: " + setup.displayStatValue(target, "critChance") + "\n";
    displayString += "Arousal per Turn: " + setup.displayStatValue(target, "arousalGain") + "\n";

    displayString += "Corruption: " + setup.getStatValue(target, "corruption") + "\n";
    displayString += "Muscles: " + setup.getMusclesDescriptor(target) + "(" + setup.displayStatValue(target, "muscles") + ")\n";
    displayString += "Height: " + setup.displayStatValue(target, "height", true) + "\n";
    displayString += "Cock Size: " + setup.displayStatValue(target, "cock", true) + "\n\n";

    displayString += "Passive Abilities:\n";

    if (character.abilityHandler.abilityRuntimeDatas.length > 0) {
        for (let i = 0; i < target.abilityHandler.abilityRuntimeDatas.length; ++i) {
            let abilityRuntimeData = target.abilityHandler.abilityRuntimeDatas[i];
            if (abilityRuntimeData.isActive == true) {
                let abilityData = setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex);
                displayString += abilityData.name + ": " + abilityData.description(target, abilityRuntimeData) + "\n";
            }
        }
    }
    else {
        displayString += "None\n";
    }

    displayString += "\n"

    return displayString;
}

setup.getFightMoveCooldown = function (attackerSheet, victimSheet, fightMove) {
    if (fightMove.cooldown) {
        for (let i = 0; i < attackerSheet.fight.variables.cooldowns.length; i++) {
            if (attackerSheet.fight.variables.cooldowns[i].skillID == fightMove.name) {
                return attackerSheet.fight.variables.cooldowns[i].value;
            }
        }
    }

    return 0;
}

setup.usesArousal = function (character) {
    if (character.id == "CharacterSheet_Player") {
        return character.hasAbility("Ability_HostOfEcho");
    }

    return true;
}

setup.calculateAvailableComboSlots = function () {
    var maxSlots = setup.getStatValue(State.variables.CharacterSheet_Player, "actionSlots");
    maxSlots += State.variables.AddSlotCount;

    var slotsTaken = setup.calculateTakenComboSlots();

    return maxSlots - slotsTaken;
}

setup.calculateTakenComboSlots = function () {
    var slotsTaken = 0;
    for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
        let fightMove = State.variables.FightSkills[State.variables.FightComboStackIndexes[i]];
        if (!fightMove.available) {
            slotsTaken += fightMove.comboCost;
        }
    }

    return slotsTaken;
}

setup.canActivateFightMove = function (attackerSheet, victimSheet, fightMove, fightSkillIndex) {
    if (fightSkillIndex != undefined && fightMove.comboValue != undefined) {
        if (!fightMove.available) {
            return "This move is already part of your combo.";
        }

        console.log("3")
        console.log(fightMove)
        if (setup.calculateAvailableComboSlots() < fightMove.comboCost) {
            return "Not enough slots left for this move in your combo.";
        }

        if (fightMove.maxStack) {
            if (!setup.canStackPersistentEffect(attackerSheet, victimSheet, fightMove.persistentEffectOpponent.id, fightMove.maxStack)) {
                return "Can't stack this skill more than " + fightMove.maxStack + " times.";
            }
        }

        if (State.variables.FightComboStackIndexes.length != 0) {
            var latestComboValue = State.variables.FightSkills[State.variables.FightComboStackIndexes[State.variables.FightComboStackIndexes.length - 1]].comboValue;
            var currentComboValue = State.variables.FightSkills[fightSkillIndex].comboValue;
            var isNotAdjacent = currentComboValue - 1 != latestComboValue && currentComboValue + 1 != latestComboValue;
            var isFourAndOne = (currentComboValue == 1 && latestComboValue == 4) || (latestComboValue == 1 && currentComboValue == 4);
            var isZero = currentComboValue == 0 || latestComboValue == 0;

            if (!isZero && (isNotAdjacent && !isFourAndOne)) {
                return "This move's Link Value (" + currentComboValue + ") is not adjacent to the Link Value of the latest move of your combo (" + latestComboValue + ")";
            }
        }

        if (fightMove.staminaCost) {
            if (attackerSheet.fight.variables.currentStamina < (setup.calculateComboStaminaCost() + fightMove.staminaCost)) {
                return "Not enough Stamina.";
            }
        }

        let cooldown = setup.getFightMoveCooldown(attackerSheet, victimSheet, fightMove);

        if (cooldown != 0) {
            return "In cooldown for " + cooldown + " more turns."
        }
    }
    else {
        if (fightMove.maxStack) {
            if (!setup.canStackPersistentEffect(attackerSheet, victimSheet, fightMove.persistentEffectOpponent.id, fightMove.maxStack)) {
                return "Can't stack this skill more than " + fightMove.maxStack + " times.";
            }
        }

        if (fightMove.staminaCost) {
            if (attackerSheet.fight.variables.currentStamina < fightMove.staminaCost) {
                return "Not enough Stamina.";
            }
        }

        let cooldown = setup.getFightMoveCooldown(attackerSheet, victimSheet, fightMove);

        if (cooldown != 0) {
            return "In cooldown for " + cooldown + " more turns."
        }
    }


    if (fightMove.activationCondition) {
        if (!fightMove.activationCondition(attackerSheet, victimSheet)) {
            return "Can't activate this skill.";
        }
    }

    return "";
}

setup.isFightMoveEquipped = function (fightMoveID) {
    for (var i = 0; i < State.variables.EquippedFightMoveIDs.length; i++) {
        if (fightMoveID == State.variables.EquippedFightMoveIDs[i])
            return true;
    }

    return false;
}

setup.displayAvailableFightMoves = function (character, target, fightMoveIDs) {
    var displayString = "";

    var comboSkillIDs = fightMoveIDs.filter(function (val) {
        console.log("4")
        console.log(setup[val])
        if (setup[val].comboCost != undefined && setup.isFightMoveEquipped(val) == true && setup[val].unique == undefined && setup[val].skillType != "special") {
            return true;
        }
        return false;
    });

    var uniqueSkillIDs = fightMoveIDs.filter(function (val) {
        if (setup[val].skillType != "special" && setup[val].unique == true) {
            return true;
        }
        return false;
    });

    var specialSkillIDs = fightMoveIDs.filter(function (val) {
        if (setup[val].skillType == "special") {
            return true;
        }
        return false;
    });

    State.variables.FightSkills = [];
    State.variables.FightComboStackIndexes = [];

    var i;

    if (comboSkillIDs.length != 0) {
        var comboMovesPerTurn = setup.getStatValue(character, "comboMovesPerTurn");
        var comboValueList = setup.getRandomComboValueList(comboMovesPerTurn);
        setup.corruptComboableFightMoveList(comboSkillIDs);

        for (var i = 0; i < comboMovesPerTurn; i++) {
            var skill = { ...(setup[comboSkillIDs.random()]) };

            skill.comboValue = comboValueList[i];
            skill.available = true;
            State.variables.FightSkills.push(skill);
        }
    }

    for (var i = 0; i < uniqueSkillIDs.length; i++) {
        var skill = { ...(setup[uniqueSkillIDs[i]]) };

        skill.comboValue = 0;
        skill.available = true;
        State.variables.FightSkills.push(skill);
    }

    for (var i = 0; i < specialSkillIDs.length; i++) {
        State.variables.FightSkills.push(setup[specialSkillIDs[i]]);
    }

    displayString += '<span id="FightSkillsList">';
    displayString += setup.printAvailableFightMovesString(character, target);
    displayString += '</span>';

    return displayString;
};

setup.printComboCost = function (character, target) {
    var displayString = "";

    displayString += "<h3>Stamina Remaining: <span>" + setup.getRemainingStamina(character, target) + "</span></h3><h3>Action Slots Remaining: <span>" + setup.calculateAvailableComboSlots() + "</span></h3>";

    return displayString;
}

setup.calculateComboStaminaCost = function (character, target) {
    var staminaCost = 0;
    for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
        let fightMove = State.variables.FightSkills[State.variables.FightComboStackIndexes[i]];
        if (!fightMove.available) {
            staminaCost += fightMove.staminaCost;
        }
    }

    return staminaCost;
}

setup.getRemainingStamina = function (character, target) {
    return character.fight.variables.currentStamina - setup.calculateComboStaminaCost(character, target);
}

setup.printAvailableFightMovesString = function (character, target) {
    var displayString = "";

    displayString += '<div class="outerComboContainer ' + setup.getCorruptionUIClassName("StatCaption", setup.getStatValue(character, "corruption")) + '">';
    displayString += setup.printComboCost(character, target);
    displayString += '\n\n'
    displayString += '<div class="comboCounterContainer">';
    displayString += '<div class="FightSkillsComboContainer">';
    displayString += '<div class="FightSkillsCombo">' + setup.printFightSkillsComboList() + '</div>';
    displayString += '<div class="FightSkillsComboAdd">';

    if (!setup.canAddSlot(character, target)) {
        displayString += "<span class='inactive'>";
    }

    displayString += '<span class="' + setup.getCorruptBackgroundClass(character) + '">';
    displayString += '<<button "Add Slot (' + setup.getAddSlotCost() + ' Stamina)">>';
    displayString += '<<run setup.addComboSlot()>>';
    displayString += '<<replace "#FightSkillsList">> <<print setup.printAvailableFightMovesString(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)>> <</replace>>';
    displayString += '<</button>>';
    displayString += '</span>';

    if (!setup.canAddSlot(character, target)) {
        displayString += "</span>";
    }

    displayString += '</div>';
    displayString += '</div>';

    displayString += "<div class='SidebarDivisionMid'>" + setup.getCorruptSidebarDividerMid() + "</div>";

    displayString += "<div class='BottomComboContainer'>";

    if (!setup.canRedraw(character, target)) {
        displayString += "<span class='inactive'>";
    }

    displayString += '<div id="MulliganButton" class="BottomComboZone">';
    displayString += '<span class="' + setup.getCorruptBackgroundClass(character) + '">';
    displayString += '<<button "Draw (' + setup.getRedrawCost() + ' Stamina)">>';
    displayString += '<<run setup.drawComboMove()>>';
    displayString += '<<replace "#FightSkillsList">> <<print setup.printAvailableFightMovesString(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)>> <</replace>>';
    displayString += '<</button>>';
    displayString += '</span>';
    displayString += '</div>';
    displayString += '<div class="BottomComboZone">';
    displayString += '&nbsp;';
    displayString += '</div>';

    if (!setup.canRedraw(character, target)) {
        displayString += "</span>";
    }

    if (State.variables.FightComboStackIndexes.length > 0) {
        displayString += '<div id="ClearButton" class="BottomComboZone">';
        displayString += '<span class="' + setup.getCorruptBackgroundClass(character) + '">';
        displayString += '<<button "Clear">>';
        displayString += '<<run setup.clearCombo()>>';
        displayString += '<<replace "#FightSkillsList">> <<print setup.printAvailableFightMovesString(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)>> <</replace>>';
        displayString += '<</button>>';
        displayString += '</span>';
        displayString += '</div>';
        displayString += '<div class="BottomComboZone">';
        displayString += '&nbsp;';
        displayString += '</div>';
        displayString += '<div id="AttackButton" class="BottomComboZone">';
        displayString += '<span class="' + setup.getCorruptBackgroundClass(character) + '">';
        displayString += '<<button [[Attack with Combo!->FightLogic]]>><</button>>';
        displayString += '</span>';
        displayString += '</div>';
    }

    displayString += '</div>';
    displayString += '</div>';

    var comboSkills = [];
    for (let i = 0; i < State.variables.FightSkills.length; ++i) {
        console.log("5")
        console.log(State.variables.FightSkills[i])
        console.log(character)
        console.log(target)
        console.log(i)
        console.log(State.variables.FightSkills)
        if (State.variables.FightSkills[i].comboCost != undefined && State.variables.FightSkills[i].unique == undefined) {
            comboSkills.push(
                {
                    fightSkill: State.variables.FightSkills[i],
                    index: i,
                }
            );
        }
    }

    let sortedByComboValues = comboSkills.sort(function (a, b) {
        return a.fightSkill.comboValue - b.fightSkill.comboValue;
    });

    comboSkills = sortedByComboValues;

    var noComboSkills = [];
    for (let i = 0; i < State.variables.FightSkills.length; ++i) {
        if (State.variables.FightSkills[i].skillType != "special" && State.variables.FightSkills[i].unique == true) {
            noComboSkills.push(
                {
                    fightSkill: State.variables.FightSkills[i],
                    index: i,
                }
            );
        }
    }

    var specialSkills = [];
    for (let i = 0; i < State.variables.FightSkills.length; ++i) {
        if (State.variables.FightSkills[i].skillType == "special") {
            specialSkills.push(
                {
                    fightSkill: State.variables.FightSkills[i],
                    index: i,
                }
            );
        }
    }

    displayString += '<div class="ComboFightMovesContainer">';
    for (let i = 0; i < comboSkills.length; ++i) {
        displayString += setup.displayFightSkillCard(character, target, comboSkills[i].fightSkill, comboSkills[i].index);
    }

    if (noComboSkills.length != 0) {
        displayString += "<br><br><hr><br>";
    }

    for (let i = 0; i < noComboSkills.length; ++i) {
        displayString += setup.displayFightSkillCard(character, target, noComboSkills[i].fightSkill, noComboSkills[i].index);
    }

    if (specialSkills.length != 0) {
        displayString += "<br><br><hr><br>";
    }

    for (let i = 0; i < specialSkills.length; ++i) {
        displayString += setup.displayFightSkillCard(character, target, specialSkills[i].fightSkill, specialSkills[i].index);
    }

    displayString += "</div>";
    displayString += "</div>";

    return displayString;
}

setup.getFightSkillCardBackgroundStyleContent = function (character, fightSkill) {
    var displayString = "";
    var corruptionLink = "";

    switch (setup.getCorruptionTier(character)) {
        case 0:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_0.png)";
            break;
        case 1:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_25.png)";
            break;
        case 2:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_50.png)";
            break;
        case 3:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_75.png)";
            break;
        case 4:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_100.png)";
            break;
        default:
            corruptionLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_border_100.png)";
            break;
    }

    displayString += corruptionLink + ", ";

    var skillTypeLink = "";
    switch (fightSkill.skillTheme) {
        case "offensive":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_offensive.png)";
            break;
        case "sigil":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_sigil.png)";
            break;
        case "buff":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_buff.png)";
            break;
        case "symbiote":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_offensive_symbiote.png)";
            break;
        case "special":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_pacific.png)";
            break;
        case "demon":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_offensive_demon.png)";
            break;
        case "corruption":
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_corruption.png)";
            break;
        default:
            skillTypeLink = "url(https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/battle_system/card_bg_pacific.png)";
            break;
    }

    displayString += skillTypeLink;

    console.log("background")
    console.log(displayString)

    return displayString;
}

setup.getFightSkillCardBackgroundStyle = function (character, target, fightSkill) {
    var displayString = "background-image: ";

    displayString += setup.getFightSkillCardBackgroundStyleContent(character, fightSkill);

    displayString += ";";

    return displayString;
}

setup.displayFightSkillCard = function (character, target, fightSkill, index) {
    var displayString = "";

    var fightMoveActivationString = setup.canActivateFightMove(character, target, fightSkill, index);

    if (fightMoveActivationString != "") {
        displayString += "<span class='tooltipskill'>";
        if (fightSkill.available == false) {
            displayString += "<span>";
        }
        else {
            displayString += "<span class='inactive'>";
        }
    }

    let _fightMoveDescription = setup.getSkillDisplayString(character, target, fightSkill, setup.FightHotkeys[index]);
    let params = 'class="FightSkillCard" style="' + setup.getFightSkillCardBackgroundStyle(character, target, fightSkill) + '"';

    displayString += '<div class="FightSkillCardHighlight">';

    displayString += '<span ' + params + '>';
    displayString += '<<link "' + _fightMoveDescription + '">>';
    displayString += '<<set $CharacterSheet_Player.fight.variables.currentFightMove = setup["' + fightSkill.id + '"]>>';
    displayString += '<<run setup.onAttackClick("' + index + '")>>';

    if (fightSkill.comboValue != undefined) {
        displayString += '<<replace "#FightSkillsList">> <<print setup.printAvailableFightMovesString(State.variables.CharacterSheet_Player, State.variables.Encounter_Target)>><</replace>>';
    }

    displayString += '<</link>>';
    displayString += '</span>';
    displayString += '</div>';

    if (fightMoveActivationString != "") {
        displayString += "</span>";//inactive close

        displayString += "<span class='tooltipskilltext'>";
        displayString += fightMoveActivationString;
        displayString += "</span></span>";
    }

    return displayString;
}

setup.getRandomComboValueList = function (amount) {
    var comboValueList = [];

    for (var i = 0; i < amount; i++) {
        let value = setup.getRandomInt(1, 4);

        comboValueList.push(value)
    }

    return comboValueList;
}

setup.corruptComboableFightMoveList = function (fightMoveList) {
    switch (setup.getCorruptionTier(State.variables.CharacterSheet_Player)) {
        case 0:
            return fightMoveList;
        case 1:
            fightMoveList.push("FightMove_LustfulInstincts");
            break;
        case 2:
            fightMoveList.push("FightMove_LustfulInstincts");
            fightMoveList.push("FightMove_CorruptedUrges");
            break;
        case 3:
            fightMoveList.push("FightMove_LustfulInstincts");
            fightMoveList.push("FightMove_CorruptedUrges");
            fightMoveList.push("FightMove_CorruptedRemedy");
            break;
        case 4:
            fightMoveList.push("FightMove_LustfulInstincts");
            fightMoveList.push("FightMove_CorruptedUrges");
            fightMoveList.push("FightMove_CorruptedRemedy");
            fightMoveList.push("FightMove_InfectiousLust");
            break;
        default:
            fightMoveList.push("FightMove_LustfulInstincts");
            fightMoveList.push("FightMove_CorruptedUrges");
            fightMoveList.push("FightMove_CorruptedRemedy");
            fightMoveList.push("FightMove_InfectiousLust");
            break;
    }

    return fightMoveList;
}

setup.drawComboMove = function () {
    setup.clearCombo();

    var fightMoveIDs = State.variables.availableFightMoveIDs;

    var comboSkillIDs = fightMoveIDs.filter(function (val) {
        if (setup[val].comboCost != undefined && setup.isFightMoveEquipped(val) == true) {
            return true;
        }
        return false;
    });

    if (comboSkillIDs.length != 0) {
        setup.corruptComboableFightMoveList(comboSkillIDs);

        var skill = { ...(setup[comboSkillIDs.random()]) };

        skill.comboValue = setup.getRandomInt(1, 4);;
        skill.available = true;
        State.variables.FightSkills.unshift(skill);
    }

    State.variables.CharacterSheet_Player.fight.variables.currentStamina = Math.max(0, State.variables.CharacterSheet_Player.fight.variables.currentStamina - setup.getRedrawCost());

    State.variables.RedrawCount++;
    UIBar.update()
}

setup.addComboSlot = function () {
    State.variables.CharacterSheet_Player.fight.variables.currentStamina = Math.max(0, State.variables.CharacterSheet_Player.fight.variables.currentStamina - setup.getAddSlotCost());
    State.variables.AddSlotCount++;
}

setup.mulliganComboMoves = function () {
    setup.clearCombo();

    var fightMoveIDs = State.variables.availableFightMoveIDs;

    var comboSkillIDs = fightMoveIDs.filter(function (val) {
        if (setup[val].comboCost != undefined && setup.isFightMoveEquipped(val) == true) {
            return true;
        }
        return false;
    });

    if (comboSkillIDs.length != 0) {
        var comboMovesPerTurn = setup.getStatValue(State.variables.CharacterSheet_Player, "comboMovesPerTurn");
        var comboValueList = setup.getRandomComboValueList(comboMovesPerTurn);
        setup.corruptComboableFightMoveList(comboSkillIDs);

        for (var i = 0; i < comboMovesPerTurn; i++) {
            var skill = { ...(setup[comboSkillIDs.random()]) };

            skill.comboValue = comboValueList[i];
            skill.available = true;
            State.variables.FightSkills[i] = skill;
        }
    }

    State.variables.CharacterSheet_Player.fight.variables.currentStamina = Math.max(0, State.variables.CharacterSheet_Player.fight.variables.currentStamina - setup.getRedrawCost());

    State.variables.RedrawCount++;
    UIBar.update()
}

setup.getRedrawCost = function () {
    if (State.variables.RedrawCount < setup.RedrawCosts.length) {
        return setup.RedrawCosts[State.variables.RedrawCount];
    }
    else {
        let multiplierExponent = State.variables.RedrawCount - (setup.RedrawCosts.length - 1);
        return setup.RedrawCosts[setup.RedrawCosts.length - 1] * Math.pow(2, multiplierExponent);
    }
}

setup.getLimitBreakEssenceCost = function () {
    let limitBreakCount = State.variables.ModifyMetabolismParams.points;

    for (let propertyName in State.variables.ModifyMetabolismParams.cap) {
        limitBreakCount += State.variables.ModifyMetabolismParams.cap[propertyName];
    }

    console.log(limitBreakCount);

    if (limitBreakCount < setup.LimitBreakEssenceCosts.length) {
        console.log(setup.LimitBreakEssenceCosts[limitBreakCount]);
        return setup.LimitBreakEssenceCosts[limitBreakCount];
    }
    else {
        console.log(setup.LimitBreakEssenceCosts[setup.LimitBreakEssenceCosts.length - 1]);
        return setup.LimitBreakEssenceCosts[setup.LimitBreakEssenceCosts.length - 1];
    }
}

setup.getAddSlotCost = function () {
    if (State.variables.AddSlotCount < setup.AddSlotCosts.length) {
        return setup.AddSlotCosts[State.variables.AddSlotCount];
    }
    else {
        let multiplierExponent = State.variables.AddSlotCount - (setup.AddSlotCosts.length - 1);
        return setup.AddSlotCosts[setup.AddSlotCosts.length - 1] * Math.pow(2, multiplierExponent);
    }
}

setup.canRedraw = function (character, target) {
    return setup.getRemainingStamina(character, target) >= setup.getRedrawCost();
}

setup.canAddSlot = function (character, target) {
    return setup.getRemainingStamina(character, target) >= setup.getAddSlotCost();
}

setup.clearCombo = function () {
    for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
        let fightSkillIndex = State.variables.FightComboStackIndexes[i];
        State.variables.FightSkills[fightSkillIndex].available = true;
    }

    State.variables.FightComboStackIndexes = [];
}

setup.onAttackClick = function (fightSkillIndex) {
    setup.attackPressedLogic(fightSkillIndex);
}

setup.attackPressedLogic = function (fightSkillIndex) {
    if (State.variables.FightSkills[fightSkillIndex].comboValue != undefined) {
        if (setup.canActivateFightMove(State.variables.CharacterSheet_Player, State.variables.Encounter_Target, State.variables.FightSkills[fightSkillIndex], fightSkillIndex) == "") {
            State.variables.FightSkills[fightSkillIndex].available = false;
            State.variables.FightComboStackIndexes.push(fightSkillIndex);
        }
    }
    else {
        State.variables.CharacterSheet_Player.fight.variables.currentFightMove = State.variables.FightSkills[fightSkillIndex];
        Engine.play("FightLogic");
    }
}

setup.printFightSkillsComboList = function () {
    var displayString = "";

    var firstLinkClass = "UIActionCostsFirstLink";
    if (State.variables.FightComboStackIndexes.length == 0) {
        firstLinkClass += " Grayed";
    }

    displayString += "<div class='" + firstLinkClass + "'>"
    displayString += "</div>";

    var takenActionsCount = 0;

    for (let i = 0; i < State.variables.FightComboStackIndexes.length; i++) {
        displayString += "<div class='FightSkillActionCostsNumberInComboContainer'>"
        displayString += "<div class='FightSkillActionCostsNumberInCombo'>"

        let comboValue = State.variables.FightSkills[State.variables.FightComboStackIndexes[i]].comboValue;

        displayString += comboValue != 0 ? comboValue : "*"
        displayString += "</div>";
        displayString += "</div>";

        var middleLinkClass = "UIActionCostsMiddleLink";

        if (i % 2 == 1) {
            middleLinkClass += " Alt";
        }

        console.log("6")
        console.log(State.variables.FightSkills[State.variables.FightComboStackIndexes[i]])

        for (let j = 0; j < State.variables.FightSkills[State.variables.FightComboStackIndexes[i]].comboCost; j++) {
            displayString += "<div class='" + middleLinkClass + "'>"
            displayString += "</div>";
        }

        takenActionsCount += State.variables.FightSkills[State.variables.FightComboStackIndexes[i]].comboCost;
    }

    var actionSlots = setup.getStatValue(State.variables.CharacterSheet_Player, "actionSlots");
    actionSlots += State.variables.AddSlotCount;

    for (let i = takenActionsCount; i < actionSlots; i++) {
        displayString += "<div class='UIActionCostsMiddleLink Grayed'>"
        displayString += "</div>";
    }

    var lastLinkClass = "UIActionCostsLastLink";
    if (takenActionsCount < actionSlots) {
        lastLinkClass += " Grayed";
    }
    else if (State.variables.FightComboStackIndexes.length % 2 == 0) {
        lastLinkClass += " Alt";
    }

    displayString += "<div class='" + lastLinkClass + "'>"
    displayString += "</div>";

    return displayString;
}

setup.getCharacterSheet = function (sheetID) {
    return State.variables[sheetID];
}

setup.getRandomEncounter = function (difficulty) {
    var encounters;
    encounters = setup.getEncounterList(difficulty);

    if (encounters.length > 1) {
        encounters = encounters.filter(function (val) {
            if (val == State.variables.LastEncounter || State.variables[val].quest.locked == true) {
                return false;
            }
            return true;
        });
    }

    var randomEncounter = encounters.random();
    State.variables.LastEncounter = randomEncounter;

    return State.variables[randomEncounter];
};

setup.getExploreDestination = function (difficulty) {
    let nonCombatDests = State.variables.Explore_Destinations.filter(function (val) {

        return setup.getExplorationData(val).condition(difficulty);
    });

    let highPriorityDest = nonCombatDests.filter(function (val) {
        return setup.getExplorationData(val).highPriority;
    });

    console.log("highPriorityDest")
    console.log(highPriorityDest)

    if (highPriorityDest.length != 0) {
        return setup.getExplorationData(highPriorityDest[0]).passage;
    }

    var encounterAmount = setup.getEncounterAmount();
    var destinationRange = encounterAmount + nonCombatDests.length;

    var choice = Math.floor(Math.random() * destinationRange);

    if (choice < encounterAmount && (State.variables.LastExplorationEnemyEncounter < 2 || nonCombatDests.length == 0)) {
        State.variables.LastExplorationEnemyEncounter++;
        return "RandomEcounter";
    }
    else {
        State.variables.LastExplorationEnemyEncounter = 0;
        return nonCombatDests.random();
    }
};

setup.getExplorationData = function (id) {
    for (var propertyName in setup.ExplorationData) {
        if (setup.ExplorationData[propertyName].id == id) {
            return setup.ExplorationData[propertyName];
        }
    }
}

setup.getManorDestinations = function () {
    var destinations = ["WestWing_GymRoom", "WestWing_NyxSpawnPit", "WestWing_DrenthRoom", "WestWing_NyxSpawnFight", "WestWing_MirrorRoom", "WestWing_GloryHole"];

    for (let i = 0; i < destinations.length; i++) {
        if (destinations[i] == State.variables.WorldState.cultManor.westWing_LastDestination) {
            destinations.splice(i, 1);
        }
    }

    while (destinations.length >= 2) {
        console.log("removing")
        var index = setup.getRandomInt(0, destinations.length - 1);
        destinations.splice(index, 1);

        setup.shuffle(destinations);
    }

    /*var majorDestinations = ["WestWing_DrenthRoom","WestWing_NyxSpawnFight"]

    destinations.push(majorDestinations[setup.getRandomInt(0, majorDestinations.length - 1)])*/

    return destinations;
};

setup.shuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


setup.getNextManorDestination = function () {
    var dest = "";
    if (State.variables.MQ002_Manor_Destinations.length >= 1) {
        dest = State.variables.MQ002_Manor_Destinations.shift();

        State.variables.WorldState.cultManor.westWing_LastDestination = dest;
    }
    else {
        dest = "MQ002_Manor_WestWing_Ending";
    }

    return "[[Enter the next room->" + dest + "]]";
};

setup.clearWestWingRoom = function (room) {
    State.variables.CharacterSheet_MQ002_Guard.quest.lustIncrease = true;

    for (let i = 0; i < State.variables.WorldState.cultManor.westWing_ClearedRooms.length; i++) {
        if (room == State.variables.WorldState.cultManor.westWing_ClearedRooms[i]) {
            return "";
        }
    }

    State.variables.WorldState.cultManor.westWing_ClearedRooms.push(room);

    if (State.variables.WorldState.cultManor.westWing_ClearedRooms.length >= 5) {
        setup.completeAchievement("Achievement_ExplorerOfCorruptedDepths");
    }

    return "∇: The monolith has gained power.";
};

setup.getFightStartPassages = function (character) {
    var displayString = "";

    character.quest.met = true;
    State.variables.Encounter_Target = character;

    if (setup.sizeCharactercomparison(State.variables.CharacterSheet_Player, character) >= setup.Comparators.REACHES_WAIST) {
        displayString += '<<run setup.choice("[[Fight->FightLogic]]");>>' +
            '\<<run setup.choice("[[They are too small for you to care->Village]]");>>';
    }
    else {
        displayString += '<<run setup.choice("[[Fight->FightLogic]]");>>' +
            '\<<run setup.choice("[[Run Away->Village]]");>>';
    }

    return displayString;
};

setup.impSetAggressiveMoveset = function () {
    State.variables.CharacterSheet_Imp.fight.fightMoveIDs = [setup.FightMove_Basic_Attack.id]
};

setup.impSetSigilMoveset = function () {
    State.variables.CharacterSheet_Imp.fight.fightMoveIDs = [setup.FightMove_Sigil_Vitality.id, setup.FightMove_Sigil_Pain.id, setup.FightMove_Sigil_Growth.id, setup.FightMove_Sigil_Perception.id]
};

setup.impSetGrowthMoveset = function () {
    State.variables.CharacterSheet_Imp.fight.fightMoveIDs = [setup.FightMove_Sigil_Growth.id, setup.FightMove_PridefulAscent.id]
};

setup.hasKnownEncounter = function () {
    var encounterList = setup.getEncounterListByEncounterID(state.variables.Encounter_Target.id);

    if (encounterList == undefined) {
        return false;
    }

    for (let i = 0; i < encounterList.length; ++i) {
        if (state.variables[encounterList[i]].info.known == setup.EncounterKnownState.KNOWN) {
            return true;
        }
    }

    return false;
}

setup.displayKnownEncounters = function () {
    var encounterList = setup.getEncounterListByEncounterID(state.variables.Encounter_Target.id);
    if (encounterList == undefined) {
        return "";
    }

    var displayString = "";

    for (let i = 0; i < encounterList.length; ++i) {
        if (state.variables[encounterList[i]].info.known == setup.EncounterKnownState.KNOWN) {
            displayString += "[[" + state.variables[encounterList[i]].info.name + "->KnownEncounter][$Encounter_Target = $" + state.variables[encounterList[i]].id + "]]\n";
        }
    }

    return displayString;
};

setup.getEncounterListByEncounterID = function (id) {
    for (let i = 0; i < state.variables.EasyRandomEncounters.length; ++i) {
        if (state.variables.EasyRandomEncounters[i] == id) {
            return state.variables.EasyRandomEncounters;
        }
    }

    for (let i = 0; i < state.variables.MediumRandomEncounters.length; ++i) {
        if (state.variables.MediumRandomEncounters[i] == id) {
            return state.variables.MediumRandomEncounters;
        }
    }

    return undefined;
}