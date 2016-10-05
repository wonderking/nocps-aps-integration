require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/getPlainValue",
    "dojox/mvc/at",
    "dojox/mvc/getStateful",
    "aps/load",
    "./displayError.js",
    "aps/ready!"
], function (Store, registry, when, getPlainValue, at, getStateful, load, displayError) {
    /* Declare data sources */
    var store = new Store({
            apsType:    "http://readyspace.com/bm-mgmt/offer/1.0",
            target:     "/aps/2/resources/"
        }),
        model;

    store.get(aps.context.vars.offer.aps.id).then(function(object) {
        model = getStateful(object);

        var widgets =
            ["aps/PageContainer", {id: "page"}, [
                ["aps/FieldSet", {title: true}, [
                    ["aps/TextBox", {id: "offerName", label: _("Offer Name"),
                        value: at(model, "name"), required: true}],
                    ["aps/TextBox", {id: "poolIdfrom", label: _("Pool ID (Origin)"),
                        value: at(model, "poolIdfrom"), required: true}],
                    ["aps/TextBox", {id: "poolIddest", label: _("Pool ID (Destination)"),
                        value: at(model, "poolIddest"), required: true}],
                    ["aps/TextBox", {label: _("Description"), value: at(model, "description")}]
                ]],
                ["aps/FieldSet", {title: true}, [
                    ["aps/TextBox", { label: _( "Processor Specification"), value: at(model.hardware.CPU, "description")}],
                    ["aps/TextBox", { label: _( "Number of CPU Core"),value: at(model.hardware.CPU, "number")}],
                    ["aps/TextBox", {label: _("Disk Space"), value: at(model.hardware, "diskspace"), legend: _("GB")}],
                    ["aps/TextBox", {label: _("RAM"), value: at(model.hardware, "memory"), legend: _("GB")}]
                ]]
            ]];
        return load(widgets);
    }).then(function(){
        /* ...Create handlers for the navigation buttons */
        aps.app.onCancel = function() {
            aps.apsc.gotoView("offers");
        };
        aps.app.onSubmit = function() {
            var page = registry.byId("page");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
            when(store.put(getPlainValue(model)),
                function(){ aps.apsc.gotoView("offers"); },
                displayError
            );
        };
    }).otherwise(displayError);
});