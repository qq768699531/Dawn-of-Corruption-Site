
/* twine-user-script #35: "FlavourFactory.js" */
setup.getLimbNumber = function (numberRequirement, characterLimb, keyOnly = false) {
    var gameMaxNumber = Object.keys(setup.englishNumbers).length
    var availableLimbs = undefined;
    var currentLimbNumber = characterLimb['number'];
    var resultantNumber = undefined;

    if (currentLimbNumber > gameMaxNumber) {
        return ["forest of", "cluster of", "mountain of", "egregious collection of"].random()
    } else {
        availableLimbs = currentLimbNumber
    }

    if (numberRequirement == "all") {
        resultantNumber = availableLimbs
    } else {
        if (numberRequirement <= availableLimbs) {
            resultantNumber = numberRequirement
        } else {
            resultantNumber = availableLimbs
        }
    }

    if (keyOnly) {
        return resultantNumber
    } else {
        return setup.englishNumbers[resultantNumber]
    }
}

setup.compileBrew = function (brewArr) {
    var brewedArray = [];
    brewArr.forEach(addDefinedItemsTobrew);
    function addDefinedItemsTobrew(item) {
        if (item != undefined) {
            brewedArray.push(item)
        }
    }
    return brewedArray.join(" ");
}

setup.getAdjective = function (limb, characterAnatomy, character, customAdjectives) {
    var comparators = setup.Comparators;
    var corruptionComparitors = setup.CorruptionComparators;

    var size = setup.sizeNormalPersoncomparison(character);
    var corruption = setup.getStatValue(character, "corruption")
    var sizeCategory = undefined;
    var corruptionCategory = undefined;

    //get the size index for the RacePool
    if (size <= comparators.SLIGHTLY_BIGGER) {
        sizeCategory = 'small';
    } else if (size <= comparators.REACHES_WAIST) {
        sizeCategory = 'medium';
    } else if (size <= comparators.FITS_ON_HAND) {
        sizeCategory = 'large';
    } else if (size >= comparators.FITS_ON_FINGER) {
        sizeCategory = 'huge';
    }

    //get the corruption index for the RacePool
    if (corruption <= corruptionComparitors.NEUTRAL) {
        corruptionCategory = "pure";
    } else {
        corruptionCategory = "corrupt"
    }

    var limbDetails = undefined;

    var racePool = Object.keys(setup.RacePool);
    var raceProperty = racePool[characterAnatomy["race"]];

    let raceObject = setup.RacePoolObjects[raceProperty];
    if (raceObject[limb] != undefined) {
        limbDetails = raceObject[limb]
    } else {
        return "<<Error: This race does not have this limb natively>>"
    }

    var brewArr = [];
    var adjectivePool = setup.AdjectivePool[limb];

    //Add custom adjectives, if exists
    if (customAdjectives != undefined) {
        brewArr.push(customAdjectives.split("~").join(" "));
    }

    //Add size based description if exists
    if (adjectivePool[sizeCategory] != undefined) {
        if (Math.floor(Math.random() * 5) == 4) {
            brewArr.push(adjectivePool[sizeCategory].random());
        } else {
            brewArr.push(undefined);
        }
    }

    //Add corruption text if exists
    if (adjectivePool.adjectives[corruptionCategory] != undefined) {
        if (Math.floor(Math.random() * 5) == 4) {
            brewArr.push(adjectivePool.adjectives[corruptionCategory].random());
        } else {
            brewArr.push(undefined);
        }
    }

    //Add racial texture if exists
    if (limbDetails.raceTexture != undefined) {
        if (Array.isArray(limbDetails.raceTexture)) {
            brewArr.push(limbDetails.raceTexture.random());
        } else {
            let customArray = limbDetails.raceTexture.trim();
            customArray = limbDetails.raceTexture.split(",");
            if (Math.floor(Math.random() * 5) == 4) {
                brewArr.push(customArray.random());
            } else {
                brewArr.push(undefined);
            }
        }
    }

    return setup.compileBrew(brewArr);
}

setup.processVerbInstructionSet = function (verbInstructions, number, limb, colour, adjective) {
    var vowels = ["a", "e", "i", "o", "u"];

    if (verbInstructions == "a~an") {
        if (colour != undefined && vowels.includes(colour.substring(0, 1))) {
            return "an";
        } else if (vowels.includes(adjective.substring(0, 1))) {
            return "an";
        } else if (vowels.includes(limb.substring(0, 1))) {
            return "an"
        } else {
            return "a"
        }
    }

    if (verbInstructions == "noverb") {
        return undefined;
    } else {
        let oneRegEx = /one=(.*)\b/;
        let moreRegEx = /more=(.*)\b/;
        var verbList = verbInstructions.split("~");
        var oneVerb = oneRegEx.exec(verbList[0]);
        var moreVerb = moreRegEx.exec(verbList[1]);

        if (number == 1) {
            return oneVerb[1].split("%").join(" ");
        } else {
            return moreVerb[1].split("%").join(" ");
        }
    }
}

setup.brewFlavour = function (numberRequirement, customAdjectives, limb, verbInstructions, characterAnatomy, character) {
    var number = setup.getLimbNumber(numberRequirement, characterAnatomy[limb], true);
    var numberText = setup.getLimbNumber(numberRequirement, characterAnatomy[limb]);
    var adjective = setup.getAdjective(limb, characterAnatomy[limb], character, customAdjectives);
    var colour = undefined;
    var verb = setup.processVerbInstructionSet(verbInstructions, number, limb, colour, adjective);

    if (Math.floor(Math.random() * 5) == 4) {
        colour = setup.ColourPool[characterAnatomy[limb].colour];
    }

    if (limb == "cocks") {
        limb = ["cocks", "dicks", "tools", "rods", "poles", "shafts", "javelins", "lances", "spires"].random();
    }

    if (limb == "vaginas") {
        limb = ["vaginas", "clits", "nether-lips", "vulvas", "rocks"].random();
    }

    if (limb == "breasts") {
        limb = ["breasts", "boobs", "knockers", "melons", "bosoms"].random();
    }

    if (limb == "balls") {
        limb = ["balls", "testicles", "nuts", "orbs", "gonads", "rocks"].random();
    }

    if (numberText == "") {
        if (["a", "an"].includes(verb)) {
            let result = [verb, colour, adjective, limb.substring(0, limb.length - 1)];
            return setup.compileBrew(result)
        } else {
            let result = [colour, adjective, limb.substring(0, limb.length - 1), verb];
            return setup.compileBrew(result)
        }
    } else if (numberText == "two") {
        let result = [colour, adjective, limb, verb];
        return setup.compileBrew(result)
    } else {
        let result = [numberText, colour, adjective, limb, verb];
        return setup.compileBrew(result)
    } s
}

setup.applyLimbFilter = function (anatomy, flavourText) {
    var textToProcess = "";
    var sentenceTail = "";
    var filterRegex = /(>[\s\S]*?|^[\s\S]*?)<limbs=(.*)>([\s\S]*?)<\/limbs>([\s\S]*?)$/;
    var limbFilterMatch = filterRegex.exec(flavourText);

    if (limbFilterMatch != null) {
        while (limbFilterMatch != null) {
            var include = true;
            var limbsRequirements = limbFilterMatch[2].replace(/\s/g, "").split(',');

            if (limbFilterMatch[1] != null && limbFilterMatch[1] != "") {
                textToProcess += limbFilterMatch[1];
            }

            for (let i = 0; i < limbsRequirements.length; i++) {
                var limb = limbsRequirements[i];

                if (!setup.hasLimb(anatomy, limb)) {
                    include = false;
                    break;
                }
            }

            if (include) {
                textToProcess += limbFilterMatch[3]
            }

            sentenceTail = limbFilterMatch[4];
            limbFilterMatch = filterRegex.exec(limbFilterMatch[4]);
        }
    }
    else {
        textToProcess = flavourText;
    }

    if (sentenceTail != null) {
        textToProcess += sentenceTail;
    }

    return textToProcess;
}

setup.hasLimb = function (anatomy, limb) {
    return anatomy[limb] != undefined && anatomy[limb]["number"] != 0;
}

setup.processFlavours = function (character, flavourText, useSymbiote = false) {

    if (character.id == "CharacterSheet_Player") {
        setup.gender.setPronouns(
            {
                "subjective": "you",
                "objective": "you",
                "possessive": "yours",
                "determiner": "your",
                "reflexive": "yourself",
                "noun": "you"
            }
        )
    } else {
        setup.gender.setPronouns(character.info.gender);
    }

    var anatomy = undefined;
    if (useSymbiote) {
        anatomy = character.symbiote.anatomy;
    }
    else {
        anatomy = character.info.anatomy;
    }

    //Resolve limb requirements
    flavourText = setup.applyLimbFilter(anatomy, flavourText)

    var processedFlavour = flavourText;
    var flavourParameters = undefined;
    var fullFlavourtag = undefined;
    var tagRegex = /\B@\[([^\]]*)\]/g;
    var match = tagRegex.exec(flavourText);

    var numberRequirement = undefined;
    var customAdjectives = undefined;
    var limb = undefined;
    var verbInstructions = undefined;

    while (match != null) {
        fullFlavourtag = match[0];
        flavourParameters = match[1].replace(/\s/g, "").split("|");

        numberRequirement = undefined;
        customAdjectives = undefined;
        limb = undefined;
        verbInstructions = undefined;

        if (flavourParameters.length == 3) {
            numberRequirement = flavourParameters[0];
            limb = flavourParameters[1];
            verbInstructions = flavourParameters[2];
        } else if (flavourParameters.length == 4) {
            numberRequirement = flavourParameters[0];
            customAdjectives = flavourParameters[1];
            limb = flavourParameters[2];
            verbInstructions = flavourParameters[3];
        }

        let brewedFlavour = setup.brewFlavour(
            numberRequirement,
            customAdjectives,
            limb,
            verbInstructions,
            anatomy,
            character
        );

        processedFlavour = processedFlavour.replace(fullFlavourtag, brewedFlavour);
        match = tagRegex.exec(flavourText);
    }
    return processedFlavour;
}