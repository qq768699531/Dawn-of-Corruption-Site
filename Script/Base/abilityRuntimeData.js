
/* twine-user-script #31: "abilityRuntimeData.js" */
setup.AbilityRuntimeDataFactory =
{
    createAbilityRuntimeData: function (param) {
        console.log("createAbilityRuntimeData")
        console.log(setup.AbilityIndexCache[param.abilityData.id])
        var newAbilityRuntimeData = {};
        newAbilityRuntimeData.abilityDataIndex = setup.AbilityIndexCache[param.abilityData.id];

        if (param.blackboard != undefined) {
            newAbilityRuntimeData.blackboard = param.blackboard;
        }

        newAbilityRuntimeData.isActive = false;

        if (param.abilityData.isAchievement == true) {
            newAbilityRuntimeData.achivemementState = setup.AchievementState.IDLE;
        }

        newAbilityRuntimeData.rank = 1;
        newAbilityRuntimeData.modifier = setup.ModifierFactory.createModifier(
            {
                abilityIndex: newAbilityRuntimeData.abilityDataIndex
            });
        newAbilityRuntimeData.seen = false;

        return newAbilityRuntimeData;
    }
}