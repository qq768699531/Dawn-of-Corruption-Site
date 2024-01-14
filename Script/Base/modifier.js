
/* twine-user-script #33: "modifier.js" */

setup.setModifierCorruptionMods = function (modifier, mods) {
    modifier.corruptionMods = mods;

    setup.updateStaticCorruptionUI(State.variables.CharacterSheet_Player);
}

setup.ModifierFactory =
{
    createModifier: function (param) {
        var newModifier = {};
        newModifier.abilityIndex = param.abilityIndex;

        return newModifier;
    }
}