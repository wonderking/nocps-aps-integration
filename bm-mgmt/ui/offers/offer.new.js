require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/getPlainValue",
    "aps/WizardData",
    "dojox/mvc/at",
    "aps/load",
    "aps/Memory",
    "./displayError.js",
    "dojo/text!./newbmsoffer.json",
    "aps/ready!"
], function (Store, registry, when, getPlainValue, wd, at, load, Memory, displayError, newBMSOffer) {
    /* Declare the data source */
    var store = new Store({
            apsType:   "http://aps-standard.org/samples/offer-mgmt/offer/1.0",
            target:    "/aps/2/resources/" + aps.context.vars.bmcloud.aps.id + "/offers"
        }),
        model = JSON.parse(newBMSOffer);

    var widgets =
        ["aps/PageContainer", {id: "page"}, [
            ["aps/FieldSet", {title: true}, [
                ["aps/TextBox", {id: "offerName", label: _("Offer Name"),
                    value: at(model, "name"), required: true}],
                ["aps/TextBox", {id: "poolIdfrom", label: _("Pool ID (Orgin)"),
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
    load(widgets).then(function(){
        /* ...Once the widgets are initialized, create handlers for the navigation buttons */
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
                function() {
                    aps.apsc.gotoView("offers");
                },
                function(err) {
                    displayError(err);
                }
            );
        };
    });
});