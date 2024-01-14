
/* twine-user-script #29: "abilityData.js" */
setup.AchievementState =
{
    DISABLED: 0,
    IDLE: 1,
    COMPLETE: 2,
    ACTIVATED: 3,
}

setup.AbilityDataFactory =
{
    createAbilityData: function (param) {
        var newAbilityData = {};
        newAbilityData.id = param.id;
        newAbilityData.index = param.index;
        newAbilityData.name = param.name;
        newAbilityData.description = param.description;
        newAbilityData.maxRank = param.maxRank;

        newAbilityData.unlockableFromLevelScreen = false;
        newAbilityData.isGlobalAbility = false;
        newAbilityData.isAchievement = false;
        newAbilityData.startBehaviourInstructions = [];
        newAbilityData.updateBehaviourInstructions = [];
        newAbilityData.endBehaviourInstructions = [];
        newAbilityData.removeBehaviourInstructions = [];
        newAbilityData.category = setup.AbilityCategory.NONE;
        newAbilityData.setCategory = function (category) {
            this.category = category;
        }
        newAbilityData.filter = setup.AbilityFilter.POWER;
        newAbilityData.setFilter = function (filter) {
            this.filter = filter;
        }

        newAbilityData.grade = setup.AbilityGrade.MEDIUM;
        newAbilityData.setGrade = function (grade) {
            this.grade = grade;
        }

        newAbilityData.achievementInfo = "";

        newAbilityData.upgradeDescription = "";
        newAbilityData.upgradeConditionFunction = function () {
            return false;
        }
        newAbilityData.unlockCondition = function () {
            return false;
        }
        newAbilityData.nextAbility = undefined;

        var idRegex = /(.*)_\d|(.*)\b/g;
        var match = idRegex.exec(param.id);

        if (match[1] != undefined) {
            newAbilityData.baseID = match[1];
        }
        else {
            newAbilityData.baseID = match[0];
        }

        newAbilityData.setUpgrade = function (upgradeConditionFunction, nextAbility, upgradeDescription = "") {
            this.upgradeConditionFunction = upgradeConditionFunction;
            this.upgradeDescription = upgradeDescription;

            this.nextAbilityID = nextAbility.id;
        }

        newAbilityData.setUnlockableFromLevelScreen = function (unlockableFromLevelScreen) {
            this.unlockableFromLevelScreen = unlockableFromLevelScreen;
            setup.UnlockableAbilityList.push(setup[this.baseID]);
        }

        newAbilityData.setAsGlobalAbility = function () {
            this.isGlobalAbility = true;
            setup.GlobalAbilities.push(setup[this.id]);
        }

        newAbilityData.setUnlockCondition = function (unlockCondition) {
            this.unlockCondition = unlockCondition;
        }

        newAbilityData.addBehaviour = function (phase, triggers, triggerFunction) {
            var instruction = {};
            instruction["triggers"] = triggers;
            instruction["triggerFunction"] = triggerFunction;
            switch (phase) {
                case "start":
                    this.startBehaviourInstructions.push(instruction);
                    break;
                case "update":
                    this.updateBehaviourInstructions.push(instruction);
                    break;
                case "end":
                    this.endBehaviourInstructions.push(instruction);
                    break;
                case "remove":
                    this.removeBehaviourInstructions.push(instruction);
                    break;
            }
        }

        if (setup.AbilityIndexCache[newAbilityData.id] == undefined) {
            console.log("adding cache " + newAbilityData.id)
            setup.AbilityIndexCache[newAbilityData.id] = setup.AbilityIDCache.length;
            setup.AbilityIDCache.push(newAbilityData.id);
        }

        return newAbilityData;
    }
}