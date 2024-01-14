
/* twine-user-script #45: "PassageStart.js" */

$(document).on(':passagestart', function (ev) {
    setup.onVillageEnterCallback();

    console.log(window.innerWidth)
    $(document.head).append('<meta id="myViewport" name="viewport" content="width=device-width, initial-scale=1" />');

    deviceAspectRatioFix();

    //var isWide = window.innerWidth > 1200;
    var isWide = true;
    console.log("screen")
    console.log(window.screen)

    if (isWide && window.screenClass == "MobileBorder") {
        console.log("wide")
        window.screenClass = "LargeBorder";

        var story = document.getElementById("story");
        story.className = setup.getCorruptionUIClassName(window.screenClass, setup.getStatValue(State.variables.CharacterSheet_Player, "corruption"));

        //var topBorder = document.getElementById("topBorder");
        //topBorder.className = "";

        //var bottomBorder = document.getElementById("bottomBorder");
        //bottomBorder.className = "";

    }
    else if (!isWide && window.screenClass == "LargeBorder") {
        console.log("smoll")
        window.screenClass = "MobileBorder";

        var story = document.getElementById("story");
        story.className = setup.getCorruptionUIClassName(window.screenClass, setup.getStatValue(State.variables.CharacterSheet_Player, "corruption"));

        //var topBorder = document.getElementById("topBorder");
        //topBorder.className = "hidden";

        //var bottomBorder = document.getElementById("bottomBorder");
        //bottomBorder.className = "hidden";
    }

    $('#choiceWindow').remove();
    setup.choices = "";
    setup.choiceCount = 0;
});