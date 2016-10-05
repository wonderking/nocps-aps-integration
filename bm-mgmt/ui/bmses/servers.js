require([
        "aps/ResourceStore",
        "dojo/when",
        "dijit/registry",
        "aps/load",
        "./displayError.js",
        "dojo/_base/array",
        "aps/xhr",
        "aps/ready!"
    ], function (Store, when, registry, load, displayError, arr, xhr) {


        /* Create the data store */

        var store = new Store({
            apsType: "http://readyspace.com/bm-mgmt/bms/1.0",
            target: "/aps/2/resources/" + aps.context.vars.context.aps.id + "/bmses"
        });

        when(store.query(), function(bmses) {
            for (var i = 0; i < bmses.length; i++) {
                var bms = bmses[i];
                xhr("/aps/2/resources/" + bms.aps.id + "/provisionstatus", {
                    method: "GET"
                });
            }
        });




        /* Create widgets */
        load(["aps/PageContainer", { id: "page" }, [
            ["aps/Grid", {
                id:                "srv_grid",
                store:             store,
                selectionMode:     "single",
                apsResourceViewId: "server.reprovision",
                columns:           [
                    { field: "name",                  name: "Name",       filter: { title: "Name" }, type: "resourceName" },
                    { field: "hardware.CPU.description", name: "Server Specifications"},
                    { field: "hardware.CPU.number",   name: "Number of Cores" },
                    { field: "hardware.memory",       name: "RAM",        filter: { title: "RAM" } },
                    { field: "hardware.diskspace",    name: "Disk Space", filter: { title: "Disk" } },
                    { field: "state",                 name: "State" },
                    { field: "provisioningstatus",	  name: "Provisioning Status"},
                    { field: "OS.name",                	  name: "OS" },
                    { field: "ipAdd",                	  name: "IP Address" },
                    { field: "macAdd",                	  name: "Mac Address" }
                ]
            }, [
                ["aps/Toolbar", [
                    // Declare a button with CSS class sb-service-start and label Start.
                    // It will be enabled only if at least one string is selected
                    ["aps/ToolbarButton", { id: "server.new",
                        label: "New"}],
                    ["aps/ToolbarButton", { id: "server.reprovision",
                        label: "Reprovision",      requireSingleItem:   true }],
                    ["aps/ToolbarButton", { id: "power",
                        label: "Power",      requireSingleItem:   true }],
                    ["aps/ToolbarButton", { id: "srv_refresh",
                        label: "Refresh"}]
                ]]
            ]]
        ]]).then(function(){
            /* Once the widgets are created, create the widget processing logic */
            var grid = registry.byId("srv_grid"),
                page = registry.byId("page");

            /* Create a handler for the *New* button click */
            registry.byId("server.reprovision").on("click", function() {
                aps.apsc.gotoView("server.reprovision");
            });

            registry.byId("power").on("click", function() {
                aps.apsc.gotoView("power");
            });

            registry.byId("server.new").on("click", function() {
                aps.apsc.gotoView("server.new");
            });

            registry.byId("srv_refresh").on("click", function() {
                location.reload();
            });
        });
    }   /* end of main function  */
);    /* end of require */
