require([
        "aps/ResourceStore",
        "dijit/registry",
        "dojox/mvc/getPlainValue",
        "aps/WizardData",
        "dojox/mvc/at",
        "aps/load",
        "aps/Memory",
        "dojox/mvc/getStateful",
        "dojo/when",
        "dojo/_base/array",
        "dojo/text!./newbms.json",
        "dojo/text!./server-wizard.json",
        "./displayError.js",
        "aps/xhr",
        "dojo/promise/all",
        "aps/ready!"
    ], function (Store, registry, getPlainValue, wd, at, load, Memory, getStateful, when, arr,
                 newBMS, wizardControl, displayError, xhr, all) {

        wizardControl = JSON.parse(wizardControl);
        wizardControl[0].active = true;
        var model = JSON.parse(newBMS),
            offerStore = new Store({
                apsType: "http://readyspace.com/bm-mgmt/offer/1.0",
                target: "/aps/2/resources"
            }),
            oses,
            offerCtrl;

        var oses;

        /* Declare and define data sources */
        all([offerStore.query(), xhr("/aps/2/resources/" + aps.context.vars.context.aps.id + "/profiles",{method: "GET",handleAs: "json"})]).then(function(results) {

            var offers = results[0];
            var json = results[1];

            oses = new Memory({
                data: json
            });

            console.log("!!! ", oses);
            /* ...Initiate the VPS model and offer control */
            if (offers.length === 0) return;
            var offerCache = new Memory({ data: offers, idProperty: "aps.id" });
            offerCtrl = getStateful({ model: offers[0] });
            model.offer.aps.id = offerCtrl.model.aps.id;

            /* ...Define the on-offer-change handler */
            function onChangeOffer(offerID) {
                when(offerCache.get(offerID), function(data) {
                    console.log(offerID); /* For debugging only */
                    var offer1 = getStateful(data);
                    offerCtrl.set("model", offer1);
                });
            }
            /* Create widgets */
            var widgets =
                ["aps/PageContainer", {id: "page"}, [
                    ["aps/WizardControl", {steps: wizardControl}],
                    ["aps/FieldSet", {title: true}, [
                        ["aps/TextBox", {id: "serverName", label: _("Server Name"),
                            value: at(model, "name"), required: true}],
                        ["aps/Password", {label: _("Root Password"), value: at(model, "rootpass"), required: true}],
                        ["aps/TextBox", {label: _("Admin Username (Optional)"), value: at(model, "adminuser")}],
                        ["aps/Password", {label: _("Admin Password (Optional)"), value: at(model, "adminpass")}],
                        ["aps/TextBox", {label: _("Description"), value: at(model, "description")}]]],
                    ["aps/FieldSet", {title: _("Offers")}, [
                        ["aps/Select", { store: offerCache, onChange: onChangeOffer, labelAttr: "name",
                            value: at(model.offer.aps, "id")}]
                    ]],
                    ["aps/FieldSet", {title: true}, [
                        ["aps/Select", { label: _( "OS"),
                            value: at(model.OS, "id"),store:oses, required:true }],
                        ["aps/Output", { label: _( "Server Specifications"),
                            value: at(offerCtrl.model.hardware.CPU, "description")}],
                        ["aps/Output", { label: _( "CPU Cores"),
                            value: at(offerCtrl.model.hardware.CPU, "number")}],
                        ["aps/Output", {label: _("Disk Space"),
                            value: at(offerCtrl.model.hardware, "diskspace"), legend: _("GB")}],
                        ["aps/Output", {label: _("RAM"),
                            value: at(offerCtrl.model.hardware, "memory"), legend: _("GB")}]
                    ]]
                ]];
            return load(widgets);
        }).then(function(){
            /* ...Create handlers for the navigation buttons */
            aps.app.onCancel = function() {
                aps.apsc.gotoView("servers");
            };
            aps.app.onNext = function() {
                var page = registry.byId("page");
                page.get("messageList").removeAll();
                if (!page.validate()) {
                    aps.apsc.cancelProcessing();
                    return;
                }
                model.poolIdfrom = offerCtrl.model.poolIdfrom;
                model.poolIddest = offerCtrl.model.poolIddest;
                model.hardware.CPU.description = offerCtrl.model.hardware.CPU.description;
                model.hardware.CPU.number = offerCtrl.model.hardware.CPU.number;
                model.hardware.memory = offerCtrl.model.hardware.memory;
                model.diskspace = offerCtrl.model.diskspace;
                model.state = "Started";
                console.log("$$$ ", oses);
                var osObject= oses.get(model.OS.id);
                model.OS.name = osObject.label;

                console.log(model.OS.name);
                console.log(model); /* For debugging only */
                wd.put(getPlainValue(model));
                aps.apsc.gotoView("server.review");
            };
        }).otherwise(displayError);
    }
);

