
/* twine-user-script #37: "RaceHelper.js" */
setup.changeLimb = function (anatomy, limb, newRaceIndex) {
    var racePool = Object.keys(setup.RacePool);
    var raceProperty = racePool[newRaceIndex];

    let raceObject = setup.RacePoolObjects[raceProperty];
    if (raceObject[limb] != undefined) {
        anatomy[limb].race = newRaceIndex;
    }
    return;
}

setup.colourLimb = function (anatomy, limb, newColour) {
    anatomy[limb].colour = newColour;
    return;
}

setup.colourAllLimbs = function (anatomy, newColour) {
    var limbList = Object.keys(anatomy);

    limbList.forEach(function (limb) {
        setup.colourLimb(anatomy, limb, newColour);
    });
}

setup.changeLimbNumber = function (anatomy, limb, number, mod = false) {
    if (mod == "add") {
        anatomy[limb].number += number;
    } else if (mod == "multiply") {
        anatomy[limb].number = anatomy[limb].number * number;
    } else {
        anatomy[limb].number = number;
    }
    return;
}

setup.alterLimbNumbers = function (anatomy, newRaceIndex) {
    var racePool = Object.keys(setup.RacePool);
    var raceProperty = racePool[newRaceIndex];

    let raceObject = setup.RacePoolObjects[raceProperty];
    var limbList = Object.keys(anatomy)
    limbList.forEach((limb) => {
        if (raceObject[limb] != undefined) {
            var oldRace = setup.RacePoolObjects[anatomy[limb].race];
            var oldRaceDefault = 0;
            if (oldRace[limb] != undefined) {
                oldRaceDefault = parseInt(oldRace[limb].defaultNumber);
            }
            var newLimbNumber = parseInt(raceObject[limb].defaultNumber) - oldRaceDefault;
            setup.changeLimbNumber(anatomy, limb, newLimbNumber, "add");
        } else {
            setup.changeLimbNumber(anatomy, limb, 0);
        }
    });
}

setup.transformEntireAnatomy = function (anatomy, newRaceIndex, gender = "male", changeLimbNumber = false) {
    var limbList = Object.keys(anatomy);

    console.log("newRaceIndex")
    console.log(newRaceIndex)
    console.log("limbList")
    console.log(limbList)

    function transformLimb(anatomy, newRaceIndex, limb, changeLimbNumber) {
        if (typeof anatomy[limb] != "string") {
            if (changeLimbNumber) {
                setup.alterLimbNumbers(anatomy, newRaceIndex);
            }
            setup.changeLimb(anatomy, limb, newRaceIndex);
        }
    }

    limbList.forEach(changeRace);
    function changeRace(limb) {
        switch (gender) {
            case "male":
                if (limb != "vaginas" && limb != "breasts") {
                    transformLimb(anatomy, newRaceIndex, limb, changeLimbNumber)
                }
                break;
            case "female":
                if (limb != "cocks" && limb != "balls") {
                    transformLimb(anatomy, newRaceIndex, limb, changeLimbNumber)
                }
                break;
            case "herm":
                transformLimb(anatomy, newRaceIndex, limb, changeLimbNumber)
                break;
        }
    }
    return;

}
setup.getCurrentNumberOfLimbs = function (anatomy, limb) {
    console.log("getCurrentNumberOfLimbs")

    if (anatomy[limb] != undefined) {
        if (anatomy[limb].number != undefined) {
            return anatomy[limb].number
        }
    }
    return 0;
}

setup.getDefaultNumberOfLimbs = function (anatomy, limb) {
    let race = setup.RacePoolObjects[anatomy[limb].race];
    if (race != undefined) {
        if (race[limb] != undefined) {
            if (race[limb].defaultNumber != undefined) {
                return race[limb].defaultNumber
            }
        }
    }
    return 0;
}

setup.changeGender = function (anatomy, gender) {
    switch (gender) {
        case "male":
            setup.changeLimbNumber(anatomy, "cocks", setup.getDefaultNumberOfLimbs(anatomy, "cocks"))
            setup.changeLimbNumber(anatomy, "balls", setup.getDefaultNumberOfLimbs(anatomy, "balls"))
            setup.changeLimbNumber(anatomy, "breasts", 0)
            setup.changeLimbNumber(anatomy, "vaginas", 0)
            break;
        case "female":
            setup.changeLimbNumber(anatomy, "vaginas", setup.getDefaultNumberOfLimbs(anatomy, "vaginas"))
            setup.changeLimbNumber(anatomy, "breasts", setup.getDefaultNumberOfLimbs(anatomy, "breasts"))
            setup.changeLimbNumber(anatomy, "cocks", 0)
            setup.changeLimbNumber(anatomy, "balls", 0)
            break;
        case "herm":
            setup.changeLimbNumber(anatomy, "vaginas", setup.getDefaultNumberOfLimbs(anatomy, "vaginas"))
            setup.changeLimbNumber(anatomy, "breasts", setup.getDefaultNumberOfLimbs(anatomy, "breasts"))
            setup.changeLimbNumber(anatomy, "cocks", setup.getDefaultNumberOfLimbs(anatomy, "cocks"))
            setup.changeLimbNumber(anatomy, "balls", setup.getDefaultNumberOfLimbs(anatomy, "balls"))
            break;
    }
    return;
}

setup.getRandomLimb = function (anatomy) {
    console.log("getRandomLimb")

    let limbKeys = Object.keys(anatomy);
    let limbNumber = 0;

    var limbToChange = undefined;
    limbKeys = limbKeys.filter(e => e !== 'teeths');

    while (limbNumber == 0) {
        limbToChange = limbKeys.random();
        limbNumber = setup.getCurrentNumberOfLimbs(anatomy, limbToChange);
    }

    return { limb: limbToChange, currentNumber: limbNumber }
}


setup.resetAllColours = function (anatomy) {
    var limbList = Object.keys(anatomy);

    limbList.forEach(resetColour);
    function resetColour(limb) {
        if (typeof anatomy[limb] != "string") {
            setup.colourLimb(anatomy, limb, setup.ColourPool.DEFAULT)
        }
    }
    return;
}

setup.setDefaultLimbNumbers = function (anatomy, newRace, gender) {
    var limbList = Object.keys(anatomy);

    function setDefaultLimb(anatomy, limb) {

        let raceObject = setup.RacePoolObjects[newRace];

        if (typeof anatomy[limb] != "string") {
            if (raceObject[limb] != undefined) {
                setup.changeLimbNumber(anatomy, limb, parseInt(raceObject[limb].defaultNumber));
            }
            else {
                setup.changeLimbNumber(anatomy, limb, 0);
            }
        }
    }

    limbList.forEach(changeLimbNumbers);
    function changeLimbNumbers(limb) {
        switch (gender) {
            case "male":
                if (limb != "vaginas" && limb != "breasts") {
                    setDefaultLimb(anatomy, limb);
                }
                break;
            case "female":
                if (limb != "cocks" && limb != "balls") {
                    setDefaultLimb(anatomy, limb);
                }
                break;
            case "herm":
                setDefaultLimb(anatomy, limb);
                break
        }

    }
    return;
}


setup.setRandomRace = function (anatomy) {
    let newRaceKey = [
        setup.RacePool.DEFAULT,
        setup.RacePool.WOLF,
        setup.RacePool.MINOTAUR,
        setup.RacePool.DRAGONBORN,
        setup.RacePool.BEHEMOTH,
        setup.RacePool.HALFORC,
    ].random();

    setup.setRace(anatomy, newRaceKey);
    return;
}


setup.setRace = function (anatomy, newRaceIndex, gender = "male") {
    var racePool = Object.keys(setup.RacePool);

    setup.transformEntireAnatomy(anatomy, newRaceIndex, gender);
    setup.setDefaultLimbNumbers(anatomy, racePool[newRaceIndex], gender);
    setup.resetAllColours(anatomy);
    return;
}


setup.getRace = function (anatomy, lower = false) {
    var limbList = Object.keys(anatomy);
    var raceLimbList = [];

    limbList.forEach(getRaceLimbs);
    function getRaceLimbs(limb) {
        var racePool = Object.keys(setup.RacePool);
        var raceProperty = racePool[anatomy[limb].race];

        raceLimbList.push(setup.RacePoolObjects[raceProperty].name);
    }

    if (raceLimbList.length == 0)
        return null;
    var modeMap = {};
    var maxEl = raceLimbList[0], maxCount = 1;
    for (var i = 0; i < raceLimbList.length; i++) {
        var el = raceLimbList[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    if (lower) {
        return maxEl.toLowerCase()
    } else {
        return maxEl;
    }
}