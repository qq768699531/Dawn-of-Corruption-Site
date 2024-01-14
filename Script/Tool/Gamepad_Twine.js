
/* twine-user-script #43: "Gamepad_Twine.js" */
(function (exports) {
    var Gamepad = window.Gamepad;

    // Removed until it's tested with node-webkit.
    // if ((typeof(module) !== 'undefined') && module.exports) {
    //   Gamepad = require('gamepad');
    // } else {
    //   Gamepad = window.Gamepad;
    // }

    var gamepad = new Gamepad();
    var axes = { LEFT_STICK_X: 0, LEFT_STICK_Y: 0 };
    var DEADZONE = 0.5;

    gamepad.bind(Gamepad.Event.CONNECTED, function (_device) {
        console.log('Gamepad connected.');
    });

    gamepad.bind(Gamepad.Event.DISCONNECTED, function (_device) {
        console.log('Gamepad disconnected.');
    });

    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function (e) {
        switch (e.control) {
            case 'DPAD_DOWN':
            case 'DPAD_RIGHT':
                nextLink();
                break;
            case 'DPAD_UP':
            case 'DPAD_LEFT':
                prevLink();
                break;
            case 'FACE_1':
                var selected = document.querySelector('.gamepadSelected');
                if (selected) {
                    removeClass(selected, 'gamepadSelected');
                    selected.dispatchEvent(new MouseEvent('click'));
                }
                break;
            case 'FACE_2':
                var selected = document.querySelector('#ClearButton');
                if (selected) {
                    selected.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                }
                break;
            case 'FACE_3':
                var selected = document.querySelector('#MulliganButton');
                if (selected) {
                    selected.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                }
                break;
            case 'FACE_4':
                var selected = document.querySelector('#AttackButton');
                if (selected) {
                    selected.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                }
                break;
            case 'RIGHT_BOTTOM_SHOULDER':

                break;
            case 'RIGHT_TOP_SHOULDER':
                break;
            case 'LEFT_BOTTOM_SHOULDER':
                var stat = document.getElementById('statButtonText');

                if (stat) {
                    stat.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                }
                break;
            case 'LEFT_TOP_SHOULDER':
                var stat = document.getElementById('abilitiesButtonText');

                if (stat) {
                    stat.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                }
                break;
        }
    });

    // Treat axes as buttons; register presses and releases.
    gamepad.bind(Gamepad.Event.AXIS_CHANGED, function (data) {
        var newValue = 0;
        if (Math.abs(data.value) > DEADZONE) {
            newValue = data.value < 0 ? -1 : 1;
            if (axes[data.axis] !== newValue) {
                if (data.axis === 'LEFT_STICK_X') {
                    console.log("indexsdasddas")
                    let index = State.variables.SelectedAbilityFilter;
                    if (newValue === 1) {
                        index = Math.min(index + 1, 3);
                    }
                    else {
                        index = Math.max(index - 1, 0);
                    }

                    console.log(index);

                    let pickedClass = ".AbilityCategoryIconButton";

                    switch (index) {
                        case 0:
                            pickedClass += ".Powers";
                            break;
                        case 1:
                            pickedClass += ".Alteration";
                            break;
                        case 2:
                            pickedClass += ".StatusEffects";
                            break;
                        case 3:
                            pickedClass += ".Global";
                            break;

                        default:
                            break;
                    }

                    var selected = document.querySelector(pickedClass);
                    if (selected) {
                        selected.querySelector('.link-internal').dispatchEvent(new MouseEvent('click'));
                    }
                }

                if (data.axis === 'LEFT_STICK_Y') {
                    if (newValue === 1) {
                        document.getElementById('ui-bar-body').scrollBy(0, 350);
                    }
                    else {
                        document.getElementById('ui-bar-body').scrollBy(0, -350);
                    }
                }

                if (data.axis === 'RIGHT_STICK_Y') {
                    if (newValue === 1) {
                        window.scrollBy(0, 350)
                    }
                    else {
                        window.scrollBy(0, -350)
                    }
                }
            }
        }
        axes[data.axis] = newValue;
    });

    gamepad.init();

    function nextLink() {
        var links = getTwineLinks();
        if (links === null) return;
        var selectedIndex = findSelectedIndex(links);
        var newIndex = 0;
        if (selectedIndex !== null) {
            removeClass(links[selectedIndex], 'gamepadSelected');
            newIndex = (selectedIndex + 1) % links.length
        }
        addClass(links[newIndex], 'gamepadSelected');
        showLink();
    }

    function prevLink() {
        var links = getTwineLinks();
        if (links === null) return;
        var selectedIndex = findSelectedIndex(links);
        var newIndex = 0;
        if (selectedIndex !== null) {
            removeClass(links[selectedIndex], 'gamepadSelected');
            newIndex = selectedIndex > 0 ? selectedIndex - 1 : links.length - 1;
        }
        addClass(links[newIndex], 'gamepadSelected');
        showLink();
    }

    function showLink() {
        var selected = document.querySelector('.gamepadSelected');
        if (selected && !isVisible(selected)) {
            var position = isAboveViewport(selected)
            selected.scrollIntoView(position);
        }
    }

    function findSelectedIndex(links) {
        for (var i = 0; i < links.length; i++) {
            if (hasClass(links[i], 'gamepadSelected')) {
                return i;
            }
        }
        return null;
    }

    function isVisible(el) {
        var offset = el.getBoundingClientRect();
        if (offset.left < 0 || offset.top < 0) {
            return false;
        }
        if (offset.left > window.innerWidth || offset.top > window.innerHeight) {
            return false;
        }
        return true;
    }

    function isAboveViewport(el) {
        return el.getBoundingClientRect().top < 0;
    }

    // From youmightnotneedjquery.com
    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    // From youmightnotneedjquery.com
    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    // From youmightnotneedjquery.com
    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

})(((typeof (module) !== 'undefined') && module.exports) || window);