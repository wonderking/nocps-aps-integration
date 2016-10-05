require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/getPlainValue",
    "dojox/mvc/at",
    "dojox/mvc/getStateful",
    "aps/load",
    "aps/PageContainer",
    "./displayError.js",
    "aps/Memory",
    "aps/xhr",
    "dojo/promise/all",
    "aps/ready!"
], function (Store, registry, when, getPlainValue, at, getStateful, load, PageContainer, displayError, Memory, xhr, all) {
    var store = new Store({
            apsType: "http://readyspace.com/bm-mgmt/bms/1.0",
            target: "/aps/2/resources"
        }),
        model,
        oses;

    /* Getting BMS properties */
    all([store.get(aps.context.vars.bms.aps.id),xhr("/aps/2/resources/" + aps.context.vars.context.aps.id + "/profiles",
        {
            method: "GET",
            handleAs: "json"}
    )]).then(function(results){
        /* Collect the VPS properties in the model */
        model = getStateful(results[0]);
        oses = new Memory({
            data: results[1]
        });
        /* and create the widgets */
        var widgets =
            ["aps/PageContainer", { id: "page" }, [
                ["aps/FieldSet", { id: "edit_general", title: true }, [
                    ["aps/TextBox", {id: "serverName", label: _("Server Name"),
                        value: at(model, "name"), required: true}],
                    ["aps/Password", {label: _("Root Password"), value: at(model, "rootpass"),required: true}],
                    ["aps/TextBox", {label: _("Admin Username (Optional)"), value: at(model, "adminuser")}],
                    ["aps/Password", {label: _("Admin Password (Optional)"), value: at(model, "adminpass")}],
                    ["aps/TextBox", {label: _("Description"), value: at(model, "description")}]
                ]],
                ["aps/FieldSet", { id: "edit_os", title: true }, [
                    ["aps/Select", { label: _( "OS"),
                        value: at(model.OS, "id"),store:oses, required:true }]
                ]]
            ]];

        return load(widgets);
    }).then(function(){
        /* Once the widgets are created, create handlers for the navigation buttons */
        aps.app.onCancel = function() {
            aps.apsc.gotoView("servers");
        };

        aps.app.onSubmit = function() {
            var confirmation = confirm("Reprovisioning will cancel any provision process that is taking place and will erase all data on the server. Press \"OK\" to proceed or Press \"Cancel\" to return to previous page. ");
            if (!confirmation){
                aps.apsc.cancelProcessing();
                aps.apsc.gotoView("servers");
            }

            var page = registry.byId("page");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }

            var osObject= oses.get(model.OS.id);
            model.OS.name = osObject.label;

            var data = getPlainValue(model),
                reqs = [];
            reqs.push(store.put(data));
            all(reqs).then(function(){
                    var result = xhr("/aps/2/resources/" + aps.context.vars.bms.aps.id + "/reprovision", {
                        method: "PUT"
                    });
                    aps.apsc.gotoView("servers");
                },
                displayError
            );
        };
    }).otherwise(displayError);
});