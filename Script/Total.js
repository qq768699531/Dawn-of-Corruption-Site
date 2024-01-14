$(function (ev) {
    alert("Loading!")
    setup.bImportScript = importScripts(
        "../Script/Tool/articles.js",
        "../Script/Tool/continue.js",
        "../Script/Tool/css-macro.js",
        "../Script/Tool/dialog-api-macro-set.js",
        "../Script/Tool/disable.js",
    );
    setup.bImportScript.then(function () {
        alert("Load Success!")
    });
});