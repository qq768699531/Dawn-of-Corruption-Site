
/* twine-user-script #32: "characterClass.js" */
setup.CharacterFactory =
{
    createCharacter: function (param) {
        var newCharacter = {};
        newCharacter.id = param.id;
        newCharacter.info = param.info;
        newCharacter.symbiote = param.symbiote;
        newCharacter.fight = param.fight;
        newCharacter.quest = param.quest;
        newCharacter.text = param.text;

        if (!setup.allCharacters.includes(param.id)) {
            setup.allCharacters.push(param.id);
        }

        newCharacter.createFlavourEvent = function (eventName) {
            var textSheet = setup[this.text];
            if (this.text[eventName] == undefined) {
                this.text[eventName] = {};
            }
        }

        newCharacter.addHeightFlavourText = function (eventName, sizeLevel, flavourText) {
            var sizeKey = ""
            switch (sizeLevel) {
                case 1:
                    sizeKey = "small";
                    break;
                case 2:
                    sizeKey = "medium";
                    break;
                case 3:
                    sizeKey = "large";
                    break;
                case 4:
                    sizeKey = "huge";
                    break;
            }

            this.createFlavourEvent(eventName)

            if (this.text[eventName]['heightFlavour'] == undefined) {
                var innerDict = {
                    "small": [],
                    "medium": [],
                    "large": [],
                    "huge": []
                }
                innerDict[sizeKey] = [flavourText]
                this.text[eventName]['heightFlavour'] = innerDict
            } else {
                this.text[eventName]['heightFlavour'][sizeKey].push(flavourText)
            }
        }

        newCharacter.addCorruptionFlavourText = function (eventName, corruptionLevel, flavourText) {
            var corruptionKey = ""
            switch (corruptionLevel) {
                case 1:
                    corruptionKey = "corrupt25";
                    break;
                case 2:
                    corruptionKey = "corrupt50";
                    break;
                case 3:
                    corruptionKey = "corrupt75";
                    break;
                case 4:
                    corruptionKey = "corrupt100";
                    break;
            }

            this.createFlavourEvent(eventName)

            if (this.text[eventName]['corruptionFlavour'] == undefined) {
                var innerDict = {
                    "corrupt25": [],
                    "corrupt50": [],
                    "corrupt75": [],
                    "corrupt100": []
                }
                innerDict[corruptionKey] = [flavourText]
                this.text[eventName]['corruptionFlavour'] = innerDict
            } else {
                this.text[eventName]['corruptionFlavour'][corruptionKey].push(flavourText)
            }

        }

        newCharacter.hasAbility = function (abilityID, abilityRank = undefined, includeInactive) {
            return this.abilityHandler.checkAbilityRuntimeDataExists(abilityID, abilityRank, includeInactive)
        }

        newCharacter.broadcastAbilityTrigger = function (abilityParams) {
            return this.abilityHandler.broadcastAbilityTrigger(abilityParams);
        };

        newCharacter.removeAbilityRuntimeData = function (abilityData) {
            console.log("applyAbilityRuntimeData")
            console.log(abilityData)
            this.abilityHandler.removeAbilityRuntimeData(abilityData);
        }

        newCharacter.applyAbilityRuntimeData = function (abilityData, blackboard) {
            console.log("applyAbilityRuntimeData")
            console.log(abilityData)
            this.abilityHandler.applyAbilityRuntimeData(abilityData, blackboard);
        }

        //sad hack because ability handler init will read for the character variable in State.variables directly
        State.variables[param.id] = newCharacter;

        var abilityHandlerParam =
        {
            ownerID: param.id,
        };

        newCharacter.abilityHandler = setup.AbilityHandlerFactory.createAbilityHandler(abilityHandlerParam);

        for (let i = 0; i < setup.GlobalAbilities.length; i++) {
            newCharacter.applyAbilityRuntimeData(setup.GlobalAbilities[i])
        }

        return newCharacter;
    },
}