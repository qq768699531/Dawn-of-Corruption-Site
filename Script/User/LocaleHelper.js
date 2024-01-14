(function () {
    Macro.add('Locale', {
        handler: function () {
            alert("Locale");
            this.output.append(L10n.get(this.args[0]));
        }
    });
})();