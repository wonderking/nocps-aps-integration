require([
        "aps/Container",
        "aps/PageContainer",
        "aps/FieldSet",
        "aps/Output",
        "aps/load",
        "dojox/mvc/at",
        "aps/ready!"
    ], function(Container, PageContainer, FieldSet, Output, load, at) {
        "use strict";

        var model = aps.context.vars.bmcloud;
        load(
            [PageContainer, { id: "page" }, [
                [FieldSet, {title: "Cloud Settings"},[
                    [Output, { label: "Endpoint Server IP/Domain Name:", value: at(model, "apphost") }],
                    [Output, { label: "Endpoint Server Administrator Username:", value: at(model, "endpointadmin") }],
                    [Output, { label: "NOC-PS Deployment URL:", value: at(model, "nocpsURL") }],
                    [Output, { label: "NOC-PS Username:", value: at(model, "nocpsUser") }]
                ]]
            ]]).then(function(){
            aps.app.onSubmit = function() {
                aps.apsc.gotoView("cloud.edit");
            };
        });
    }
);