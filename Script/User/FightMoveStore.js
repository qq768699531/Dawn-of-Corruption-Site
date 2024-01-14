
/* twine-user-script #27: "FightMoveStore.js" */
setup.displayFightMoveStore = function () {
    var displayString = "";
    var moves = setup.getAvailableStoreFightMoveIDs(State.variables.CharacterSheet_Player);

    for (let i = 0; i < moves.length; i++) {
        var fightMove = setup[moves[i]];
        if (State.variables.Essence < fightMove.essenceCost) {
            displayString += "<span class = 'inactive'>";
        }

        displayString += "[[" + fightMove.itemName + " [" + fightMove.essenceCost + " Essence]->" + fightMove.buyPassage + "]]";

        if (State.variables.Essence < fightMove.essenceCost) {
            displayString += "</span>";
        }

        displayString += "\n";
    }

    return displayString;
}

setup.buyFightMove = function (character, fightMoveId) {
    State.variables.CharacterSheet_Torgar.quest.relationshipScoring++;
    var move = setup[fightMoveId];
    if (move) {
        character.fight.fightMoveIDs.push(move.id);
    }

    State.variables.Essence -= move.essenceCost;

    State.variables.BoughtFightMoves++;
}

setup.getSigilBoughtPassage = function () {
    if (State.variables.BoughtFightMoves <= 0) {
        return "Buy_First_Sigil_1";
    }
    else if (State.variables.CharacterSheet_Torgar.quest.usedVialOnPlayerDick == false) {
        return "Buy_More_Sigil";
    }
    else {
        return "Buy_Sigil_Used_Vial_On_Dick";
    }
}

setup.getAvailableStoreFightMoveIDs = function (character) {
    var moveIDsFromStore = [...setup.FightMoveIDs];
    moveIDsFromStore = moveIDsFromStore.filter(function (val) {
        if (setup[val].buyFromStore) {
            return true;
        }
        return false;
    });

    var characterMoveIDs = [...character.fight.fightMoveIDs];
    characterMoveIDs = characterMoveIDs.filter(function (val) {
        if (setup[val].buyFromStore) {
            return true;
        }
        return false;
    });

    moveIDsFromStore = moveIDsFromStore.filter(function (val) {
        var i;
        for (i = 0; i < characterMoveIDs.length; i++) {
            if (setup[characterMoveIDs[i]].name == setup[val].name) {
                return false;
            }
        }
        return true;
    });
    return moveIDsFromStore;
};