
/* twine-user-script #47: "SavesManager.js" */
Save.onLoad.add(function () {
    console.log("pre-save")

    prerender['update-save-file'] = function (_, taskName) {
        delete prerender[taskName];
        new Wikifier(null, Story.get('update-save').text);
    };

    console.log("post-save")

    SimpleAudio.stop();
});