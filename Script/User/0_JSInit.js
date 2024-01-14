
/* twine-user-script #40: "0_JSInit.js" */
$('body').append('<canvas id="forceRefreshCanvas" class="steamOverlayCanvasFix"></canvas>');

function forceRefresh() {
    var canvas = document.getElementById("forceRefreshCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(forceRefresh);
};

function getTwineLinks() {
    var links = Array.from(document.querySelectorAll('.choiceWindowElement'));
    return links;
};

// Mobile support scaler, disabled after putting in 2_dynamic_layout.css
function deviceAspectRatioFix() {
    var mvp = document.getElementById('myViewport');

    if ((window.innerWidth <= 1080 || window.screen.width <= 1080)) {
        if (window.innerWidth > 570 || window.screen.width > 570) {
            console.log("smoll window")
            if (window.innerHeight > window.innerWidth) {
                console.log("portrait")
                mvp.setAttribute('content', 'width=800');
            }
            else {
                console.log("landscape")
                mvp.setAttribute('content', 'width=1500');
            }
        }
    }
    else {
        console.log("big window")
        mvp.setAttribute('content', 'width=device-width');
    }
};

(function () {
    if (typeof (greenworks) !== 'undefined') {
        if (greenworks.init()) {
            console.log('Steam API has been initalized.');
        }

        forceRefresh();
    }

    State.variables.SpecialBuild = $("tw-storydata")
        .attr("options")
        .splitOrEmpty(/\s+/)
        .includes("debug");

    UIBar.unstow();
    $('#ui-bar-toggle').remove();

    window.screenClass = "LargeBorder";
})();

(function () {
    var debug = $("tw-storydata")
        .attr("options")
        .splitOrEmpty(/\s+/)
        .includes("debug");

    if (debug) {
        return;
    }

    // Duration of the splash image's fade in.
    var fadeIn = 3000; // in milliseconds

    // Delay before the splash screen begins to fade out.
    var linger = 4000; // in milliseconds

    // Duration of the splash screen's fade out.
    var fadeOut = 3000; // in milliseconds

    // Splash image.
    var $image = $('<img src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/full_logo/full_logo_color_bg_fire_small.png">').hide();

    // Display the splash screen.
    $(document.body)
        .append('<div id="splash-screen"></div>')
        .find('#splash-screen')
        .append($image)
        .find('img')
        .fadeIn(fadeIn)
        .end()
        .delay(linger)
        .fadeOut(fadeOut);

    // Set up the removal of the splash screen.
    setTimeout(function () {
        $('#splash-screen').remove();
    }, fadeIn + linger + fadeOut + 1000);
})();

(function () {
    var vol = {};

    // options object
    var options = {
        current: 0.1,
        rangeMax: 1,
        step: 0.01,
        setting: true
    };

    vol.last = options.current;
    vol.start = vol.last / options.rangeMax;

    function setVolume(val, type) {
        // fix for SugarCube 2.28 and higher
        if (typeof val !== 'number') {
            val = Number(val);
        }
        if (Number.isNaN(val) || val < 0) {
            val = 0;
        }
        if (val > 1) {
            val = 1;
        }

        console.log('setting ' + type)

        try {
            if (State.variables.VolumeControls == undefined) {
                console.log('no SV oh no!')
            }
            else if (SimpleAudio) {
                if (type == 'master') {
                    console.log('doin masterrrrr')
                    if (typeof SimpleAudio.volume === 'function') {
                        SimpleAudio.volume(State.variables.VolumeControls.master.volume);
                    }
                    else {
                        SimpleAudio.volume = State.variables.VolumeControls.master.volume;
                    }

                    //hack to fight a bug in simpleaudio
                    for (let propertyName in State.variables.VolumeControls) {
                        if (propertyName != undefined && State.variables.VolumeControls[propertyName].list != undefined) {
                            for (let playlist of State.variables.VolumeControls[propertyName].list) {
                                var aList = SimpleAudio.lists.get(playlist);
                                if (aList != undefined) {
                                    aList.volume(State.variables.VolumeControls[propertyName].volume);
                                }
                            }
                        }
                    }
                }
                else {
                    var control = State.variables.VolumeControls[type];

                    if (control != undefined) {
                        control.volume = val;
                        for (let playlist of control.list) {
                            var aList = SimpleAudio.lists.get(playlist);
                            if (aList != undefined) {
                                aList.volume(val);
                            }
                        }
                    }
                }
            }
            else {
                throw new Error('Cannot access audio API.');
            }
        } catch (err) {
            // fall back to the wikifier if we have to
            console.error(err.message, err);
            $.wiki('<<masteraudio volume ' + val + '>>');
        } finally {
            return val;
        }
    }

    postdisplay['volume-task'] = function (taskName) {
        console.log('volume-task')
        delete postdisplay[taskName];
        setVolume(vol.start.toFixed(2), 'master');
    }

    $(document).on('input', 'input[name=volume]', function () {
        // grab new volume from input
        var change = Number($('input[name=volume]').val());
        var newVol = change / options.rangeMax;
        let current = newVol;

        // change volume; set slider position
        State.variables.VolumeControls.master.volume = current;
        vol.last = change;
        console.log('input master')
        setVolume(current, 'master');
    });

    $(document).on('input', 'input[name=volumeMusic]', function () {
        // grab new volume from input
        var change = Number($('input[name=volumeMusic]').val());
        var newVol = change / options.rangeMax;
        let current = newVol;

        // change volume; set slider position
        State.variables.VolumeControls.music.volume = current;
        setVolume(current, 'music');
    });

    $(document).on('input', 'input[name=volumeVoices]', function () {
        // grab new volume from input
        var change = Number($('input[name=volumeVoices]').val());
        var newVol = change / options.rangeMax;
        let current = newVol;

        // change volume; set slider position
        State.variables.VolumeControls.voices.volume = current;
        console.log('input voices')
        setVolume(current, 'voices');
    });

    $(document).on('input', 'input[name=volumeSFX]', function () {
        // grab new volume from input
        var change = Number($('input[name=volumeSFX]').val());
        var newVol = change / options.rangeMax;
        let current = newVol;

        // change volume; set slider position
        State.variables.VolumeControls.sfx.volume = current;
        setVolume(current, 'sfx');
    });

    Macro.add('volume', {
        handler: function () {

            // set up variables
            var $wrapper = $(document.createElement('span'));
            var $slider = $(document.createElement('input'));
            var className = 'macro-' + this.name;

            var corruption = setup.getStatValue(State.variables.CharacterSheet_Player, "corruption");
            var sliderClass = setup.getCorruptionUIClassName("dummy", corruption);

            // create range input
            $slider
                .attr({
                    id: 'volume-control',
                    class: sliderClass,
                    type: 'range',
                    name: 'volume',
                    min: '0',
                    max: options.rangeMax,
                    step: options.step,
                    value: vol.last
                });
            // class '.macro-volume' and id '#volume-control' for styling

            // output
            $wrapper
                .append($slider)
                .addClass(className)
                .appendTo(this.output);
        }
    });

    if (options.setting) {
        // settings API integration, for SugarCube 2.26 and higher
        if (Setting && Setting.addRange && typeof Setting.addRange === 'function') {

            function settingsVol() {
                var newVol = settings.volume / options.rangeMax;
                options.current = newVol.toFixed(2);
                setVolume(options.current, 'master');
            }

            Setting.addRange('volume', {
                label: 'Volume: ',
                min: 0,
                max: options.rangeMax,
                step: options.step,
                default: options.current,
                onInit: settingsVol,
                onChange: settingsVol
            });
        } else {
            console.error('This version of SugarCube does not include the `Settings.addRange()` method; please try updating to the latest version of SugarCube.')
        }
    }
})();

//$('#story').prepend('<div id="topBorder"><img id="topBorderImage" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_top_0.png"></div>');
//$('#story').append('<div id="bottomBorder"><img id="bottomBorderImage" src="https://sombreve.github.io/Dawn-of-Corruption-Site/UI/VoidUI/general/ui_borderlarge_corrupt_middle_bottom_0.png"></div>');

(function () {
    setup.allCharacters = [];
    setup.corruptionTiers = [0, 50, 200, 500, 1000]

    setup.applyStoryContainer();

    window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
        const portrait = e.matches;

        deviceAspectRatioFix()
    });
})();
