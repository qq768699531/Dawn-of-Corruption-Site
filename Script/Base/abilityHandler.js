
/* twine-user-script #30: "abilityHandler.js" */
setup.AbilityHandlerFactory =
{
    createAbilityHandler: function (param) {
        var newAbilityHandler = {};
        newAbilityHandler.abilityRuntimeDatas = [];
        newAbilityHandler.ownerID = param.ownerID;

        newAbilityHandler.broadcastAbilityTrigger = function (abilityParams) {
            var displayString = "";

            for (let i = 0; i < this.abilityRuntimeDatas.length; i++) {
                let ability = setup.getAbilityByIndex(this.abilityRuntimeDatas[i].abilityDataIndex);

                var handledAbilityTrigger = this.handleAbilityTrigger(this.abilityRuntimeDatas[i], abilityParams);
                if (handledAbilityTrigger != "undefined" && handledAbilityTrigger != "" && handledAbilityTrigger != undefined) {
                    let abilitytext = "∇: " + State.variables[this.ownerID].info.name + "'s " + ability.name + " activates! " + handledAbilityTrigger
                    displayString += abilitytext;
                    displayString += "\n";
                }
            }

            return displayString;
        }

        newAbilityHandler.runBehaviour = function (abilityRuntimeData, abilityParams, behaviourInstructions, phase) {
            var behaviourInstructionsLength = behaviourInstructions.length;
            var displayString = "";

            console.log("asddsddddddd")

            if (behaviourInstructionsLength != 0) {
                for (var index = 0; index < behaviourInstructionsLength; ++index) {
                    var behaviourTriggers = behaviourInstructions[index].triggers;

                    if ((behaviourTriggers & abilityParams.trigger) == abilityParams.trigger) {
                        switch (phase) {
                            case "start":
                                abilityRuntimeData.isActive = true;
                                abilityRuntimeData.modifier = setup.ModifierFactory.createModifier(
                                    {
                                        abilityIndex: abilityRuntimeData.abilityDataIndex
                                    });
                                break;
                            case "update":
                                break;
                            case "end":
                                break;
                            case "remove":
                                break;
                        }

                        var behaviourFunction = behaviourInstructions[index].triggerFunction;
                        if (behaviourFunction != undefined) {
                            displayString += behaviourInstructions[index].triggerFunction(abilityRuntimeData, abilityParams);
                        }

                        switch (phase) {
                            case "start":
                                break;
                            case "update":
                                break;
                            case "end":
                                abilityRuntimeData.isActive = false;
                                break;
                            case "remove":
                                abilityParams.self.removeAbilityRuntimeData(setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex))
                                break;
                        }

                        if (abilityRuntimeData.isScheduledForRemoval == true) {
                            abilityRuntimeData.isScheduledForRemoval = undefined;
                            abilityParams.self.removeAbilityRuntimeData(setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex))
                        }
                        break;
                    }
                }
            }
            return displayString;
        }

        newAbilityHandler.handleAbilityTrigger = function (abilityRuntimeData, abilityParams) {
            var displayString = "";

            let ability = setup.getAbilityByIndex(abilityRuntimeData.abilityDataIndex);

            switch (abilityRuntimeData.isActive) {
                case true:
                    displayString += this.runBehaviour(
                        abilityRuntimeData,
                        abilityParams,
                        ability.updateBehaviourInstructions,
                        "update"
                    )

                    displayString += this.runBehaviour(
                        abilityRuntimeData,
                        abilityParams,
                        ability.endBehaviourInstructions,
                        "end"
                    )
                    break;
                case false:
                    displayString += this.runBehaviour(
                        abilityRuntimeData,
                        abilityParams,
                        ability.startBehaviourInstructions,
                        "start"
                    )

                    displayString += this.runBehaviour(
                        abilityRuntimeData,
                        abilityParams,
                        ability.updateBehaviourInstructions,
                        "update"
                    )
                    break;
            }

            displayString += this.runBehaviour(
                abilityRuntimeData,
                abilityParams,
                ability.removeBehaviourInstructions,
                "remove"
            )

            return displayString;
        }

        newAbilityHandler.checkAbilityRuntimeDataExists = function (abilityID, abilityRank = undefined, includeInactive) {
            for (let i = 0; i < this.abilityRuntimeDatas.length; ++i) {
                let ability = setup.getAbilityByIndex(this.abilityRuntimeDatas[i].abilityDataIndex);

                if (ability.id == abilityID) {
                    if (abilityRank != undefined) {
                        if (this.abilityRuntimeDatas[i].rank == abilityRank) {
                            if (includeInactive == true) {
                                return true;
                            }
                            else {
                                return this.abilityRuntimeDatas[i].isActive;
                            }

                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        if (includeInactive) {
                            return true;
                        }
                        else {
                            return this.abilityRuntimeDatas[i].isActive;
                        }
                    }
                }
            }
            return false;
        }

        newAbilityHandler.removeAbilityRuntimeData = function (abilityData) {
            for (let i = 0; i < this.abilityRuntimeDatas.length; ++i) {
                let ability = setup.getAbilityByIndex(this.abilityRuntimeDatas[i].abilityDataIndex);

                if (ability.baseID == abilityData.baseID) {
                    this.abilityRuntimeDatas.splice(i, 1);
                    break;
                }
            }
        }

        newAbilityHandler.applyAbilityRuntimeData = function (abilityData, blackboard) {
            console.log("applyAbilityRuntimeData")
            console.log(abilityData)

            var runtimeData;
            var character = State.variables[this.ownerID];
            let learned = false;
            let applied = false;

            var baseID = abilityData.baseID;

            //check if already learned, try to level it up in that case
            for (let i = 0; i < this.abilityRuntimeDatas.length; ++i) {
                let ability = setup.getAbilityByIndex(this.abilityRuntimeDatas[i].abilityDataIndex);
                if (ability.baseID == baseID) {
                    learned = true;
                    if (ability.upgradeConditionFunction(this.abilityRuntimeDatas[i], character)) {
                        if (blackboard != undefined) {
                            this.abilityRuntimeDatas[i] = setup.AbilityRuntimeDataFactory.createAbilityRuntimeData({
                                abilityData: setup[ability.nextAbilityID],
                                blackboard: blackboard,
                            });
                        }
                        else {
                            this.abilityRuntimeDatas[i] = setup.AbilityRuntimeDataFactory.createAbilityRuntimeData({
                                abilityData: setup[ability.nextAbilityID],
                            });
                        }


                        runtimeData = this.abilityRuntimeDatas[i];
                        applied = true;
                    } else if (setup.canRank(this.abilityRuntimeDatas[i])) {
                        setup.addRank(this.abilityRuntimeDatas[i]);
                        runtimeData = this.abilityRuntimeDatas[i];
                        applied = true;
                    }
                }
            }

            if (!learned) {
                if (blackboard != undefined) {
                    runtimeData = setup.AbilityRuntimeDataFactory.createAbilityRuntimeData({
                        abilityData: abilityData,
                        blackboard: blackboard,
                    });
                }
                else {
                    runtimeData = setup.AbilityRuntimeDataFactory.createAbilityRuntimeData({
                        abilityData: abilityData,
                    });
                }

                this.abilityRuntimeDatas.push(runtimeData);
                applied = true;
            }

            if (applied) {
                var params =
                {
                    trigger: setup.AbilityTrigger.ON_ACQUIRE,
                    self: character,
                }
                this.handleAbilityTrigger(runtimeData, params);
            }
        }

        newAbilityHandler.clearAllAbilityRuntimeData = function () {
            this.abilityRuntimeDatas = [];
        }

        newAbilityHandler.copyAllAbilityRuntimeData = function (character) {
            console.log("copyAllAbilityRuntimeData")

            for (let i = 0; i < character.abilityHandler.abilityRuntimeDatas.length; ++i) {
                let ability = setup.getAbilityByIndex(character.abilityHandler.abilityRuntimeDatas[i].abilityDataIndex);

                if (ability.id == "Ability_EchoForm")
                    continue;

                if (ability.id == "Ability_HostOfEcho")
                    continue;

                if (ability.id == "Ability_VampiricLust")
                    continue;

                if (ability.id == "Ability_CodexPassion")
                    continue;

                this.applyAbilityRuntimeData(ability);
            }
        }

        return newAbilityHandler;
    }
}