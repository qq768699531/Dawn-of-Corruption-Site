
/* twine-user-script #39: "RewardHelper.js" */
setup.getFightReward = function (beatenCharacter, loss) {
    var essence = 0;
    var xp = 0;
    if (beatenCharacter.fight.fightReward == setup.RewardTier.NONE) {
        return "";
    }
    else {
        if (beatenCharacter == undefined || loss == true) {
            xp = setup.getRandomInt(75, 100);
        }
        else {
            if (beatenCharacter.fight.fightReward == setup.RewardTier.VERY_LOW) {
                essence = setup.getRandomInt(15, 30);
                xp = setup.getRandomInt(150, 250);
            }
            else if (beatenCharacter.fight.fightReward == setup.RewardTier.LOW) {
                essence = setup.getRandomInt(25, 50);
                xp = setup.getRandomInt(350, 500);
            }
            else if (beatenCharacter.fight.fightReward == setup.RewardTier.MEDIUM) {
                essence = setup.getRandomInt(75, 100);
                xp = setup.getRandomInt(750, 900);
            }
            else if (beatenCharacter.fight.fightReward == setup.RewardTier.HIGH) {
                essence = setup.getRandomInt(125, 150);
                xp = setup.getRandomInt(1100, 1400);
            }
            else if (beatenCharacter.fight.fightReward == setup.RewardTier.VERY_HIGH) {
                essence = setup.getRandomInt(200, 300);
                xp = setup.getRandomInt(1700, 2100);
            }
        }

        var essenceGain = setup.getEssenceGain(essence);
        var gainEssenceString = setup.gainEssence(essence);
        State.variables.Exp += xp * setup.getStatValue(State.variables.CharacterSheet_Player, "xpMultiplier");

        return gainEssenceString + "You gain " + essenceGain + " Essence of Power and " + xp + " XP!";
    }
};

setup.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};