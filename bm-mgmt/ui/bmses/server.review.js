/* This is custom JavaScript */
require([
        "aps/ResourceStore",
        "dojo/when",
        "dijit/registry",
        "aps/load",
        "aps/Memory",
        "dojox/mvc/getStateful",
        "dojox/mvc/getPlainValue",
        "aps/WizardData",
        "dojo/text!./server-wizard.json",
        "./displayError.js",
        "dojox/mvc/at",
        "aps/ready!"
    ], function (Store, when, registry, load, Memory, getStateful, getPlainValue, wd,
                 wizardControl, displayError, at) {
        wizardControl = JSON.parse(wizardControl);
        wizardControl[1].active = true;

        var store = new Store({
                apsType: "http://readyspace.com/bm-mgmt/bms/1.0",
                target: "/aps/2/resources/"
            }),
            model = getStateful(wd.get());

        load(["aps/PageContainer", { id: "page" }, [
            /* Define widgets here */
            ["aps/WizardControl", { steps: wizardControl }],
            ["aps/FieldSet", { title: "General" }, [
                ["aps/Output", { label: "Server Name", value: at(model, "name") }],
                ["aps/Output", { label: "Root Password", value: at(model, "rootpass") }],
                ["aps/Output", { label: "Admin Username", value: at(model, "adminuser") }],
                ["aps/Output", { label: "Admin Password", value: at(model, "adminpass") }],
                ["aps/Output", { label: "Description", value: at(model, "description") }]
            ]],
            ["aps/FieldSet", { title: "Server Configuration" }, [
                ["aps/Output", { label: "OS",          value: at(model.OS, "name") }],
                ["aps/Output", { label: "Server Specifications",         value: at(model.hardware.CPU, "number") }],
                ["aps/Output", { label: "CPU Cores",         value: at(model.hardware.CPU, "number") }],
                ["aps/Output", { label: "Disk Space",  value: at(model.hardware, "diskspace") }],
                ["aps/Output", { label: "RAM",         value: at(model.hardware, "memory") }]
            ]]

        ]]).then(function(){
            /* Once the widgets are created, create handlers for the navigation buttons */
            aps.app.onSubmit = function() {
                var page = registry.byId("page");
                if (!page.validate()) {
                    aps.apsc.cancelProcessing();
                    return;
                }
                when(store.put(getPlainValue(model)),
                    function(){ aps.apsc.gotoView("servers"); },
                    displayError
                );
            };
            aps.app.onPrev = function() {
                aps.apsc.gotoView("server.new", null, { "isNew": false });
            };
        });
    }  // End of main call-back function
);    // End of require