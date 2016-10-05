require([
    "aps/ResourceStore",
    "dojo/when",
    "dojox/mvc/at",
    "dojox/mvc/getStateful",
    "dojox/mvc/getPlainValue",
    "dijit/registry",
    "./displayError.js",
    "aps/load",
    "aps/ready!"
], function(Store, when, at, getStateful, getPlainValue, registry,  displayError, load) {
    "use strict";

    var cloudStore = new Store({
        target: "/aps/2/resources/",
        apsType: "http://readyspace.com/bm-mgmt/bmcloud/1.0"
    });
    var model;

    cloudStore.get(aps.context.vars.bmcloud.aps.id).then(function(object) {
        model = getStateful(object);
        var widgets =
            ["aps/PageContainer", {id: "page"}, [
                ["aps/FieldSet", {title: "Clouds"}, [
                    ["aps/TextBox", {id: "apphost", label: _("Endpoint Server IP/Domain Name:"),
                        value: at(model, "apphost"), required: true, trim: true, hint: _("This identifies the NOC-PS API endpoint to be used in the application.")}],
                    ["aps/TextBox", {id: "endpointadmin", label: _("Endpoint Server Administrator Username:"),
                        value: at(model, "endpointadmin"), required: true, trim: true, hint: _("This identifies the Endpoint Administrator ID to be used in the application.")}],
                    ["aps/Password", {id: "endpointpass", label: _("Endpoint Server Administrator Password:"),
                        value: at(model, "endpointpass"), required: true, trim: true, hint: _("This identifies the Endpoint Administrator Password to be used in the application.")}],
                    ["aps/TextBox", {id: "nocpsURL", label: _("NOC-PS Deployment URL:"),
                        value: at(model, "nocpsURL"), required: true, trim: true, hint: _("This identifies the NOC-PS Deployment URL to be used in the application.")}],
                    ["aps/TextBox", {id: "nocpsUser", label: _("NOC-PS Username:"),
                        value: at(model, "nocpsUser"), required: true, trim: true, hint: _("This identifies the NOC-PS Username to be used in the application.")}],
                    ["aps/Password", {id: "nocpsPass", label: _("NOC-PS Password:"),
                        value: at(model, "nocpsPass"), required: true, trim: true, hint: _("This identifies the NOC-PS Password to be used in the application.")}]
                ]]
            ]];
        return load(widgets);
    }).then(function(){
        /* ...Create handlers for the navigation buttons */
        aps.app.onCancel = function() {
            aps.apsc.gotoView("cloud.view");
        };
        aps.app.onSubmit = function() {
            var page = registry.byId("page");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
            when(cloudStore.put(getPlainValue(model)),
                function(){ aps.apsc.gotoView("cloud.view"); },
                displayError
            );
        };
    }).otherwise(displayError);
});