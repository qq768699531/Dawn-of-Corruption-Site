
/* twine-user-script #34: "DescriptionHelper.js" */

setup.autoCap = function (str) {
    var strArr = str.split(/([\.\?\!])/);
    var retStr = "";
    strArr.forEach((sentence) => {
        // Capitalize the first letter of each sentence.
        var index = sentence.search(/[A-Za-z]/);
        if (index >= 0) {
            retStr += sentence.slice(0, index) + sentence.charAt(index).toUpperCase() + sentence.slice(index + 1);
        }
        else {
            retStr += sentence;
        }
    });
    return retStr;
}

setup.displayStatValue = function (character, statName, asLength = false, useDoubleLineBreak = false) {
    var statValue = setup.getStatValue(character, statName);
    var statInfo = setup.getStatModifierPropertyName(statName);

    var tooltipStrings = [];
    var runtimeAbilityDatas = character.abilityHandler.abilityRuntimeDatas;
    for (i = 0; i < runtimeAbilityDatas.length; i++) {
        if (runtimeAbilityDatas[i].modifier[statInfo.modifierProperty] != undefined) {
            if (!runtimeAbilityDatas[i].isActive)
                continue;
            var rankString = setup.displayRankText(runtimeAbilityDatas[i]);

            let ability = setup.getAbilityByIndex(runtimeAbilityDatas[i].abilityDataIndex);

            tooltipStrings.push(
                setup.displayModifierText(runtimeAbilityDatas[i].modifier[statInfo.modifierProperty],
                    ability.name + rankString + ":",
                    asLength)
            );
        }
    }

    var displayString = "";

    if (tooltipStrings.length > 0) {
        displayString += "<span class='tooltip' id=";
        if (statValue - setup.getStatValueNoModifiers(character, statName) < 0) {
            displayString += "'StatModifierNegative'";
        }
        else {
            displayString += "'StatModifierPositive'";
        }

        displayString += ">";
    }

    if (asLength) {
        displayString += setup.getLength(statValue);
    }
    else {
        if (statValue > 1000000000000) {
            displayString += (statValue / 1000000000000).toFixed(0).replace(/\.00$/, '') + "b";
        }
        else if (statValue > 1000000000) {
            displayString += (statValue / 1000000000).toFixed(0).replace(/\.00$/, '') + "m";
        }
        else if (statValue > 1000000) {
            displayString += (statValue / 1000000).toFixed(0).replace(/\.00$/, '') + "k";
        }
        else {
            displayString += statValue.toFixed(2).replace(/\.00$/, '');
        }
    }

    if (tooltipStrings.length > 0) {

        displayString += "<span class='tooltipContainer'>";
        displayString += "<span class='tooltiptext'>";

        var i;
        for (i = 0; i < tooltipStrings.length; i++) {
            displayString += tooltipStrings[i];

            if (useDoubleLineBreak) {
                displayString += "\\n"
            }
            else {
                displayString += "\n"
            }
        }

        displayString += "</span>";
        displayString += "</span>";

        displayString += "</span>";
    }

    return displayString;
};

setup.getRaceLimbDescriptor = function (limb, name = toString(limb), namePlural = toString(limb)) {
    var displayString = "";
    if (limb) {
        displayString += setup.englishNumbers[limb.defaultNumber] + " "
            + (limb.raceTexture ? limb.raceTexture.random() + " " : "")
            + (limb.defaultNumber > 1 ? namePlural : name);
    }
    return displayString;
}

setup.renderGraph = function () {
    var allEncounters = setup.allCharacters

    var sizeDict = {}
    for (var encounterIndex in allEncounters) {
        var character = State.variables[allEncounters[encounterIndex]]
        sizeDict[character.info.name] = [
            setup.getStatValue(character, 'height'),
            setup.getCorruptBackgroundClass(character),
            setup.getLength(setup.getStatValue(character, "height")),
            character.quest.met
        ]
    }

    var items = Object.keys(sizeDict).map(
        function (key) {
            return [key, sizeDict[key]];
        }
    );

    items.sort(
        function (first, second) {
            return second[1][0] - first[1][0];
        }
    );
    var max = items[0][1][0];

    var chartItems = "";

    function round2(x) {
        return Math.ceil(x / 2) * 2;
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i][1][3] == true) {
            var normalisedSize = round2((items[i][1][0] / max) * 100)
            var nameText = '<span style="color:#99C8E2">' + items[i][0] + '</span><span>: (' + items[i][1][2] + ')</span>'
            chartItems += nameText + '<li class="chart-bar ' + items[i][1][1] + '" data-skill="' + normalisedSize + '"></li>'
        }
    }

    var chart = '<ul class="chart-horizontal">' + chartItems + '</ul>';
    var displayString = "<div><h2>Size Chart:</h2></div>"
    displayString += '<div><section class="chart-wrapper">' + chart + '</section></div>';
    return displayString;
}

setup.getRaceDescriptor = function (race) {

    var displayString = setup.autoCap(race.description) + "\n";


    /* Only describe certain anatomy if it is non-standard */
    // This is a pretty hacky way to get plural and singular names of anatomy. Need to figure out a better way.
    // Doesn't even work for "Teeths"
    const limbArr = ["heads", "eyes", "jaws", "teeths", "hands", "tongues", "arms", "pecs", "abdominals", "legs", "wings", "horns", "tails"];
    var anatomyStr = "";
    limbArr.forEach(limbStr => {
        var limb = race[limbStr];
        if (limb != undefined
            && (setup.RacePoolObjects.DEFAULT[limbStr] == undefined
                || limb.defaultNumber != setup.RacePoolObjects.DEFAULT[limbStr].defaultNumber)) {
            var singular;
            var plural;
            if (limbStr == "teeths") {
                singular = "tooth";
                plural = "teeth";
            }
            else {
                // Trim off the "s"
                singular = limbStr.slice(0, -1)
                plural = limbStr;
            }
            anatomyStr += setup.autoCap(setup.getRaceLimbDescriptor(limb, singular, plural)) + "\n";
        }
    });

    if (anatomyStr.length > 0) {
        displayString += "\n" + anatomyStr;
    }

    /* males Section */
    displayString += "\nmales:\n";
    displayString += setup.autoCap(setup.getRaceLimbDescriptor(race.cocks, "penis", "penises")) + "\n";
    displayString += setup.autoCap(setup.getRaceLimbDescriptor(race.balls, "ball", "balls")) + "\n";

    return displayString;
}

setup.getMusclesDescriptorForValue = function (value) {
    var displayString = "";

    if (value >= 5000) {
        displayString += "Godlike";
    }
    else if (value >= 3000) {
        displayString += "Demi-God";
    }
    else if (value >= 2000) {
        displayString += "Mountainous";
    }
    else if (value >= 1250) {
        displayString += "Monumental";
    }
    else if (value >= 800) {
        displayString += "Gigantic";
    }
    else if (value >= 500) {
        displayString += "Hyper";
    }
    else if (value >= 300) {
        displayString += "Hulking";
    }
    else if (value >= 200) {
        displayString += "Powerful";
    }
    else if (value >= 100) {
        displayString += "Brawny";
    }
    else if (value >= 70) {
        displayString += "Ripped";
    }
    else if (value >= 30) {
        displayString += "Athletic";
    }
    else if (value >= 15) {
        displayString += "Fit";
    }
    else {
        displayString += "Slim";
    }

    return displayString;
}

setup.getMusclesDescriptor = function (character) {
    var displayString = "";

    var value = setup.getMuscles(character);

    displayString += setup.getMusclesDescriptorForValue(value);

    return displayString;
}

setup.getLength = function (value) {
    var displayString = "";
    var shownUnits = 2;

    if (State.variables.Measurement == setup.Units.METRIC) {
        var cm = Math.floor(value * 2.54);
        if (cm / 100000 >= 1 && shownUnits != 0) {
            var km = Math.floor(cm / 100000);
            cm -= km * 100000;

            if (km > 1000000000) {
                displayString += (km / 1000000000).toFixed(0).replace(/\.00$/, '') + "m km&nbsp;";
                shownUnits = 0
            }
            else if (km > 1000000) {
                displayString += (km / 1000000).toFixed(0).replace(/\.00$/, '') + "k km&nbsp;";
                shownUnits = 0;
            }
            else {
                displayString += km.toFixed(2).replace(/\.00$/, '') + "km&nbsp;";
                shownUnits--;
            }
        }

        if (cm / 100 >= 1 && shownUnits != 0) {
            if (cm > 0) {
                var m = Math.floor(cm / 100);
                cm -= m * 100;

                displayString += m.toFixed(2).replace(/\.00$/, '') + "m&nbsp;";
            }

            shownUnits--;
        }

        if (cm < 100 && shownUnits != 0) {
            if (cm > 0) {
                displayString += cm.toFixed(2).replace(/\.00$/, '') % 100 + "cm";
            }

            shownUnits--;
        }
    }
    else {
        if (value / 63360 >= 1 && shownUnits != 0) {
            var miles = Math.floor(value / 63360);
            value -= miles * 63360;

            if (miles > 1000000000) {
                displayString += (miles / 1000000000).toFixed(0).replace(/\.00$/, '') + "m miles&nbsp;";
                shownUnits = 0
            }
            else if (miles > 1000000) {
                displayString += (miles / 1000000).toFixed(0).replace(/\.00$/, '') + "k miles&nbsp;";
                shownUnits = 0;
            }
            else {
                displayString += miles.toFixed(2).replace(/\.00$/, '') + "miles&nbsp;";
                shownUnits--;
            }
        }

        if (value / 12 >= 1 && shownUnits != 0) {
            if (value > 0) {
                var ft = Math.floor(value / 12);
                value -= ft * 12;

                displayString += ft.toFixed(2).replace(/\.00$/, '') + "ft&nbsp;";
            }

            shownUnits--;
        }

        if (value < 12 && shownUnits != 0) {
            if (value > 0) {
                displayString += (value % 12).toFixed(2).replace(/\.00$/, '') + "in";
            }

            shownUnits--;
        }
    }

    return displayString;
};

setup.getHornsSize = function (character) {
    return setup.getLength(Math.floor(setup.getStatValue(character, "height") / 7));
}

setup.getRandomColor = function () {
    return setup.Colors.random();
}

setup.sizeNormalPersoncomparison = function (character) {
    return setup.sizecomparison(setup.getStatValue(character, "height"), 72);
}

setup.sizeNormalPersoncomparisonCock = function (character) {
    return setup.cockcomparison(setup.getStatValue(character, "cock"), 8);
}

setup.sizecomparisonCock = function (charA, charB) {
    return setup.cockcomparison(setup.getStatValue(charA, "cock"), setup.getStatValue(charB, "cock"));
}

setup.sizecomparisonBalls = function (charA, charB) {
    return setup.cockcomparison(setup.getStatValue(charA, "balls"), setup.getStatValue(charB, "balls"));
}

setup.sizeNormalPersoncomparisonMuscle = function (character) {
    return setup.musclecomparison(setup.getStatValue(character, "muscles"), 30);
}

setup.sizecomparisonMuscle = function (charA, charB) {
    return setup.musclecomparison(setup.getStatValue(charA, "muscles"), setup.getStatValue(charB, "muscles"));
}

setup.sizeCharactercomparison = function (charA, charB) {
    return setup.sizecomparison(setup.getStatValue(charA, "height"), setup.getStatValue(charB, "height"));
}

setup.getMuscleGrowthSequenceText = function (character, pronoun = "Your", minimal) {
    var displayString = "";
    var muscleGrowthFlavourText = setup.getFlavourBasedDescription(character, "MuscleGrowthFlavourText");
    var muscleDescriptor = setup.getMusclesDescriptor(character);
    var muscleStatValue = setup.displayStatValue(character, "muscles");

    if (minimal != true) {
        displayString += pronoun + " " + muscleGrowthFlavourText + " \n\n";
    }

    displayString += pronoun + " muscles have increased in size! They are now " + muscleDescriptor + "(" + muscleStatValue + ")";
    return displayString;
}

setup.getFlavourBasedDescription = function (character, eventKey, minFlavourAmount = 4, comparingCharacter = undefined, useSymbiote = false) {
    var descriptorObjectArray = [];
    var specificDescriptors = undefined;
    var gender = undefined;

    var textSheet = setup[character['text']];
    if (textSheet != undefined) {
        var eventValue = textSheet[eventKey];
        if (eventValue != undefined) {
            specificDescriptors = eventValue;
        }
    }

    if (specificDescriptors != undefined) {
        descriptorObjectArray = specificDescriptors;
    }

    var univesalFlavourObject = setup.UniversalFlavour;

    var universalFlavourObjects = univesalFlavourObject[eventKey];

    if (universalFlavourObjects != undefined) {
        //fill descriptors from the universal list if we are missing some.

        for (var flavourObjectpropertyName in universalFlavourObjects) {
            if (descriptorObjectArray[flavourObjectpropertyName] == undefined) {
                descriptorObjectArray[flavourObjectpropertyName] = {};
            }

            //Overkill since we'll still parse the category we want later lmao, I'm sure this is dumb but it's 2AM.
            for (var flavourObjectCategoryName in universalFlavourObjects[flavourObjectpropertyName]) {
                if (descriptorObjectArray[flavourObjectpropertyName][flavourObjectCategoryName] == undefined) {
                    descriptorObjectArray[flavourObjectpropertyName][flavourObjectCategoryName] = [];
                }

                var universalFlavourValueCopy = [...universalFlavourObjects[flavourObjectpropertyName][flavourObjectCategoryName]];
                while (descriptorObjectArray[flavourObjectpropertyName][flavourObjectCategoryName].length < minFlavourAmount && universalFlavourValueCopy.length > 0) {
                    var flavour = universalFlavourValueCopy.random();

                    descriptorObjectArray[flavourObjectpropertyName][flavourObjectCategoryName].push(flavour);

                    let spliceIndex = universalFlavourValueCopy.indexOf(flavour);
                    universalFlavourValueCopy.splice(spliceIndex, 1);
                }
            }
        }
    }

    let displayString = "";

    for (var propertyName in descriptorObjectArray) {
        //build a sequence of randomly picked flavour text from all available types

        let flavourTextList = undefined;
        switch (propertyName) {
            case "heightFlavour":
                flavourTextList = setup.getEventValueHeight(character, comparingCharacter, descriptorObjectArray[propertyName]);
                break;
            case "corruptionFlavour":
                flavourTextList = setup.getEventValueCorruption(character, descriptorObjectArray[propertyName]);
                break;
            case "musclesFlavour":
                flavourTextList = setup.getEventValueMuscle(character, comparingCharacter, descriptorObjectArray[propertyName]);
                break;
            case "cockSizeFlavour":
                flavourTextList = setup.getEventValueCockSize(character, undefined, descriptorObjectArray[propertyName]);
                break;
        }

        if (flavourTextList != undefined) {
            var flavourPassage = Story.get(flavourTextList.random());
            if (flavourPassage != undefined) {
                displayString += setup.processFlavours(character, flavourPassage.processText() + " ", useSymbiote);
            }
        }
    }

    return displayString;
}

setup.getEventValueCorruption = function (character, eventValue) {
    var arr = undefined;
    var corruptionComparitors = setup.CorruptionComparators;
    var corruption = setup.getStatValue(character, "corruption");

    if (corruption <= corruptionComparitors.PURE) {
        arr = eventValue['corrupt25'];
    } else if (corruption <= corruptionComparitors.NEUTRAL) {
        arr = eventValue['corrupt50'];
    } else if (corruption <= corruptionComparitors.TAINTED) {
        arr = eventValue['corrupt75'];
    } else if (corruption >= corruptionComparitors.TAINTED) {
        arr = eventValue['corrupt100'];
    }

    return arr
}

setup.getEventValueHeight = function (character, comparingCharacter, eventValue) {
    var arr = undefined;
    var size = undefined;
    var comparators = setup.Comparators;

    if (comparingCharacter == undefined) {
        size = setup.sizeNormalPersoncomparison(character);
    } else {
        size = setup.sizeCharactercomparison(character, comparingCharacter);
    }

    if (size <= comparators.SLIGHTLY_BIGGER) {
        arr = eventValue['small'];
    } else if (size <= comparators.REACHES_WAIST) {
        arr = eventValue['medium'];
    } else if (size <= comparators.FITS_ON_HAND) {
        arr = eventValue['large'];
    } else if (size >= comparators.FITS_ON_HAND) {
        arr = eventValue['huge'];
    }
    return arr
}

setup.getEventValueMuscle = function (character, comparingCharacter, eventValue) {
    var arr = undefined;
    var size = undefined;
    var muscleComparators = setup.MuscleComparators;

    if (comparingCharacter == undefined) {
        size = setup.sizeNormalPersoncomparisonMuscle(character);
    } else {
        size = setup.sizecomparisonMuscle(character, comparingCharacter);
    }

    if (size <= muscleComparators.EQUAL) {
        arr = eventValue['small'];
    } else if (size <= muscleComparators.DWARFING) {
        arr = eventValue['medium'];
    } else if (size <= muscleComparators.MACRO) {
        arr = eventValue['large'];
    } else if (size >= muscleComparators.MACRO) {
        arr = eventValue['huge'];
    }
    return arr
}

setup.getEventValueCockSize = function (character, comparingCharacter, eventValue) {
    var arr = undefined;
    var size = undefined;
    var comparators = setup.CockComparators;

    if (comparingCharacter == undefined) {
        size = setup.sizeNormalPersoncomparisonCock(character);
    } else {
        size = setup.sizecomparisonCock(character, comparingCharacter);
    }

    if (size <= comparators.MUCH_BIGGER) {
        arr = eventValue['small'];
    } else if (size <= comparators.MASSIVE) {
        arr = eventValue['medium'];
    } else if (size <= comparators.MACRO) {
        arr = eventValue['large'];
    } else if (size >= comparators.MACRO) {
        arr = eventValue['huge'];
    }
    return arr
}

setup.musclecomparison = function (a, b) {
    var sizeRatio = a / b;
    var comparators = setup.MuscleComparators;

    if (sizeRatio > 14) {
        return comparators.GIGA;
    }
    else if (sizeRatio > 8) {
        return comparators.MACRO;
    }
    else if (sizeRatio > 4.25) {
        return comparators.GIANT;
    }
    else if (sizeRatio > 1.8) {
        return comparators.DWARFING;
    }
    else if (sizeRatio > 1.4) {
        return comparators.MUCH_BIGGER;
    }
    else if (sizeRatio > 1.15) {
        return comparators.BIGGER;
    }
    else if (sizeRatio > 1.05) {
        return comparators.SLIGHTLY_BIGGER;
    }
    else if (sizeRatio > 0.95) {
        return comparators.EQUAL;
    }
    else if (sizeRatio > 0.85) {
        return comparators.SLIGHTLY_SMALLER;
    }
    else if (sizeRatio > 0.7) {
        return comparators.SMALLER;
    }
    else if (sizeRatio > 0.5) {
        return comparators.MUCH_SMALLER;
    }
    else if (sizeRatio > 0.1) {
        return comparators.MICRO_TO;
    }
}

setup.sizecomparison = function (a, b) {
    var sizeRatio = a / b;
    var comparators = setup.Comparators;

    if (sizeRatio > 14) {
        return comparators.FITS_ON_FINGER;
    }
    else if (sizeRatio > 8) {
        return comparators.FITS_ON_HAND;
    }
    else if (sizeRatio > 4.25) {
        return comparators.REACHES_KNEES;
    }
    else if (sizeRatio > 1.8) {
        return comparators.REACHES_WAIST;
    }
    else if (sizeRatio > 1.4) {
        return comparators.MUCH_BIGGER;
    }
    else if (sizeRatio > 1.15) {
        return comparators.BIGGER;
    }
    else if (sizeRatio > 1.05) {
        return comparators.SLIGHTLY_BIGGER;
    }
    else if (sizeRatio > 0.95) {
        return comparators.EQUAL;
    }
    else if (sizeRatio > 0.85) {
        return comparators.SLIGHTLY_SMALLER;
    }
    else if (sizeRatio > 0.7) {
        return comparators.SMALLER;
    }
    else if (sizeRatio > 0.5) {
        return comparators.MUCH_SMALLER;
    }
    else if (sizeRatio > 0.1) {
        return comparators.MICRO_TO;
    }
}

setup.cockcomparison = function (a, b) {
    var sizeRatio = a / b;
    var comparators = setup.CockComparators;

    if (sizeRatio > 13) {
        return comparators.GIGA;
    }
    else if (sizeRatio > 8) {
        return comparators.MACRO;
    }
    else if (sizeRatio > 4.25) {
        return comparators.HYPER;
    }
    else if (sizeRatio > 2.8) {
        return comparators.MASSIVE;
    }
    else if (sizeRatio > 1.4) {
        return comparators.MUCH_BIGGER;
    }
    else if (sizeRatio > 1.15) {
        return comparators.BIGGER;
    }
    else if (sizeRatio > 1.05) {
        return comparators.SLIGHTLY_BIGGER;
    }
    else if (sizeRatio > 0.95) {
        return comparators.EQUAL;
    }
    else if (sizeRatio > 0.85) {
        return comparators.SLIGHTLY_SMALLER;
    }
    else if (sizeRatio > 0.7) {
        return comparators.SMALLER;
    }
    else if (sizeRatio > 0.5) {
        return comparators.MUCH_SMALLER;
    }
    else if (sizeRatio > 0.1) {
        return comparators.MICRO_TO;
    }
}

setup.getcockToBodyRatio = function (character) {
    var height = setup.getStatValue(character, 'height');
    var cock = setup.getStatValue(character, 'cock');

    return cock / height;
}

setup.getCurrentBodyVisual = function (character) {
    var bodyVisual = setup[character.info.bodyVisual];

    for (var propertyName in bodyVisual.bodyList) {
        if (bodyVisual.bodyList[propertyName].condition(character) == true) {
            return propertyName;
        }
    }
}

setup.getCurrentCockVisual = function (character) {
    var bodyVisual = setup[character.info.bodyVisual];
    var permittedCocks = bodyVisual.bodyList[setup.getCurrentBodyVisual(character)].permittedCocks;

    for (let i = 0; i < permittedCocks.length; ++i) {
        if (permittedCocks[i].condition(character) == true) {
            return permittedCocks[i].cock;
        }
    }
}

setup.setAndDisplayBodyVisual = function (character, emote, useCum) {
    var bodyVisual = setup[character.info.bodyVisual];

    if (emote != undefined) {
        character.info.currentEmote = bodyVisual.emoteList[emote];
    }

    let currentEmote = character.info.currentEmote;
    let currentBody = "";
    let currentCock = "";
    let headClass = "";
    let cockClass = "";
    var permittedAccessories = [];

    //set body by size
    if (bodyVisual != undefined) {
        if (bodyVisual.bodyList != undefined) {
            for (var bodyProperty in bodyVisual.bodyList) {
                if (bodyVisual.bodyList[bodyProperty].condition(character) == true) {
                    currentBody = bodyVisual.bodyList[bodyProperty];
                    headClass = bodyVisual.bodyList[bodyProperty].headClass;

                    console.log("limbs check")
                    console.log(bodyVisual.bodyList[bodyProperty].permittedCocks)

                    if (bodyVisual.bodyList[bodyProperty].permittedAccessories != undefined) {
                        for (let i = 0; i < bodyVisual.bodyList[bodyProperty].permittedAccessories.length; ++i) {
                            if (bodyVisual.bodyList[bodyProperty].permittedAccessories[i].condition(character) == true) {
                                console.log("accessory win")
                                permittedAccessories.push(bodyVisual.bodyList[bodyProperty].permittedAccessories[i])
                            }
                        }
                    }

                    //get our associated limbs
                    for (let i = 0; i < bodyVisual.bodyList[bodyProperty].permittedCocks.length; ++i) {
                        if (bodyVisual.bodyList[bodyProperty].permittedCocks[i].condition(character) == true) {
                            console.log("check win")
                            currentCock = bodyVisual.cockList[bodyVisual.bodyList[bodyProperty].permittedCocks[i].cock];
                            cockClass = bodyVisual.bodyList[bodyProperty].permittedCocks[i].cockClass;

                            break;
                        }
                    }

                    break;
                }
            }
        }
    }

    var portrait = "";

    if (window.innerHeight > window.innerWidth) {
        portrait = " PortraitMode";
    }

    var displayString = '<div class="BodyVisualEnemyImage ' + character.id + portrait + '">';

    if (useCum == true && currentBody.cumVisual != undefined) {
        displayString += '<div class="BodyCumClass">';
        displayString += '<img src="' + currentBody.cumVisual + '">';
        displayString += '</div>';
    }

    if (currentEmote != undefined) {
        var corruption = setup.getStatValue(character, "corruption");

        displayString += '<div class="' + headClass + '">';

        if (corruption >= 150 && currentEmote.corruptedVisual != undefined) {
            displayString += '<img src="' + currentEmote.corruptedVisual + '">';
        }
        else {
            displayString += '<img src="' + currentEmote.visual + '">';
        }
        displayString += '</div>';


        if (useCum == true && currentEmote.cumVisual != undefined) {
            displayString += '<div class="' + headClass + '">';
            displayString += '<img src="' + currentEmote.cumVisual + '">';
            displayString += '</div>';
        }
    }

    for (let i = 0; i < permittedAccessories.length; ++i) {
        console.log("accessory print")
        console.log(permittedAccessories[i])

        displayString += '<div class="' + permittedAccessories[i].accessoryClass + '">';
        displayString += '<img src="' + permittedAccessories[i].visual + '">';
        displayString += '</div>';

        console.log("post print")
    }

    if (currentCock != "") {
        displayString += '<div class="' + cockClass + '">';
        displayString += '<img src="' + currentCock.visual + '">';
        displayString += '</div>';

        if (useCum == true && currentCock.cumVisual != undefined) {
            displayString += '<div class="' + cockClass + '">';
            displayString += '<img src="' + currentCock.cumVisual + '">';
            displayString += '</div>';
        }
    }

    console.log("dasdddddddddd")
    console.log(currentBody)

    if (currentBody != "") {
        displayString += '<img src="' + currentBody.visual + '">';
    }

    displayString += '</div>';

    return displayString;
}

setup.displayPlaceholderImage = function (previewPath, fullCGPath, currentEmote, useBorder) {
    var displayString = setup.displayEncounterImage(previewPath, fullCGPath, currentEmote, useBorder)

    displayString += '<div class="PlaceholderHeader">';
    displayString += 'Placeholder generated art.';
    displayString += '</div>';

    return displayString;
}

setup.displayVideo = function (path, useBorder) {
    var displayString = '<div class="EnemyImage">';

    if (useBorder == true) {
        displayString += "<div class='ImageContainer'>";
        displayString += "<div class='" + setup.getCorruptionUIClassName("MobileBorder FillWidth", setup.getStatValue(State.variables.CharacterSheet_Player, "corruption")) + "'><video autoplay muted><source src='" + path + "' type='video/mp4'></video></div>";
        displayString += '</div>';
    }
    else {
        displayString += "<video autoplay muted loop><source src='" + path + "' type='video/mp4'></video>";
    }

    displayString += '</div>';

    return displayString;
}

setup.displayEncounterImage = function (previewPath, fullCGPath, currentEmote, useBorder) {
    var displayString = '<div class="EnemyImage">';

    if (currentEmote != undefined) {
        displayString += '<div class="EmotePortrait">';
        displayString += '<img src="' + currentEmote + '">';
        displayString += '</div>';
    }

    if (fullCGPath != undefined) {
        if (useBorder == true) {
            displayString += "<<link \"<div class='ImageContainer'><div class='" + setup.getCorruptionUIClassName("MobileBorder FillWidth", setup.getStatValue(State.variables.CharacterSheet_Player, "corruption")) + "'></div><img src='" + previewPath + "'></div>\" >>";
        }
        else {
            displayString += '<img src="' + previewPath + '">';
        }

        displayString += '<<run setup.showImagePopup("' + fullCGPath + '")>>';

        displayString += '<</link>>';
    }
    else {
        displayString += "<div class='ImageContainer'>";
        if (useBorder == true) {
            displayString += '<div class="' + setup.getCorruptionUIClassName("MobileBorder FillWidth", setup.getStatValue(State.variables.CharacterSheet_Player, "corruption")) + '"></div>';
        }

        displayString += '<img src="' + previewPath + '">';
        displayString += '</div>';
    }

    displayString += '</div>';

    return displayString;
}

setup.showImagePopup = function (path) {
    Dialog.setup("");

    var displayString = '<div class="EnemyImage">'
    displayString += '<img src="' + path + '">'
    displayString += '</div>'

    Dialog.append(displayString);
    Dialog.open();
}

setup.displayAttackTimingDescription = function (character) {
    var displayString = "";

    switch (character.fight.teammateSettings.attackTiming) {
        case setup.AttackTiming.BEFORE_PLAYER:
            displayString += character.info.name + " currently attacks before you.";
            break;
        case setup.AttackTiming.BETWEEN_PLAYER_AND_ENEMY:
            displayString += character.info.name + " currently attacks between you and your enemy.";
            break;
        case setup.AttackTiming.AFTER_ENEMY:
            displayString += character.info.name + " currently attacks after you and your enemy.";
            break;

        default:
            displayString += "TeammateSettings is not valid";
            break;
    }

    return displayString;
}

setup.clickChoiceContainer = function (choiceIndex) {
    var choiceElement = document.getElementById('choice' + choiceIndex);

    if (choiceElement) {
        document.getElementById('choice' + choiceIndex).querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
    }
}

setup.choice = function (text) {
    setup.choiceCount++;
    var corruption = setup.getStatValue(State.variables.CharacterSheet_Player, "corruption");
    let _windowClass = setup.getCorruptionUIClassName("choiceWindowElement", corruption)
    let _choiceClass = setup.getCorruptionUIClassName("choiceIndex", corruption)

    console.log('<div class="' + _windowClass + '"></div>')

    if (State.variables.ChoicesWindow) {
        setup.choices += '<label id="choice' + setup.choiceCount + '" class="' + _windowClass + '"><span class="' + _choiceClass + '">' + setup.choiceCount + '</span>' + text + '</label>';
    }
    else {
        setup.choices += text + "<br>";
    }
}