require([
        "aps/ResourceStore",
        "dojo/when",
        "dijit/registry",
        "aps/load",
        "./displayError.js",
        "dojo/_base/array",
        "aps/xhr",
        "aps/ready!"
    ], function (Store, when, registry, load, displayError, arr, xhr ){
        /* Create the data store */
        var store = new Store({
            apsType: "http://readyspace.com/bm-mgmt/bms/1.0",
            target: "/aps/2/resources/"
        });

        /* Create widgets */
        load(["aps/PageContainer", { id: "page" }, [
            ["aps/Grid", {
                id:                "srv_power_grid",
                store:             store,
                selectionMode:     "single",
                columns:           [
                    { field: "name",                  name: "Name",       filter: { title: "Name" }, type: "resourceName" },
                    { field: "hardware.CPU.description", name: "Server Specifications"},
                    { field: "hardware.CPU.number",   name: "Number of Cores" },
                    { field: "hardware.memory",       name: "RAM",        filter: { title: "RAM" } },
                    { field: "hardware.diskspace",    name: "Disk Space", filter: { title: "Disk" } },
                    { field: "state",                 name: "State" },
                    { field: "OS.name",                	  name: "OS" },
                    { field: "ipAdd",                	  name: "IP Address" },
                    { field: "macAdd",                	  name: "Mac Address" }
                ]
            }, [
                ["aps/Toolbar", [
                    // Declare a button with CSS class sb-service-start and label Start.
                    // It will be enabled only if at least one string is selected
                    ["aps/ToolbarButton", { id: "server",
                        label: "Back"}],
                    ["aps/ToolbarButton", { id: "start",      iconClass: "sb-service-start",
                        label: "Start",     requireItems:   true }],
                    ["aps/ToolbarButton", { id: "stop",       iconClass: "sb-service-stop",
                        label: "Stop",      requireItems:   true }],
                    ["aps/ToolbarButton", { id: "reset",
                        label: "Reset",    requireItems:   true }],
                    ["aps/ToolbarButton", { id: "refresh",    iconClass: "sb-refresh",
                        label: "Refresh",   autoBusy:       false }]
                ]]
            ]]
        ]]).then(function(){
            /* Once the widgets are created, create the widget processing logic */
            var grid = registry.byId("srv_power_grid"),
                page = registry.byId("page");


            /* Create a handler for the *New* button click */
            registry.byId("server").on("click", function() {
                aps.apsc.gotoView("servers");
            });

            registry.byId("start").on("click", function() {
                xhr("/aps/2/resources/" + aps.context.vars.bms.aps.id + "/poweron", {
                    method: "POST",
                    handleAs: "text"
                });
                alert("Server Power On.");
                location.reload();
            });


            registry.byId("stop").on("click", function() {
                var result = xhr("/aps/2/resources/" + aps.context.vars.bms.aps.id + "/poweroff", {
                    method: "POST",
                    handleAs: "text"
                });
                alert("Server Power Off.");
                location.reload();
            });

            registry.byId("reset").on("click", function() {
                var result = xhr("/aps/2/resources/" + aps.context.vars.bms.aps.id + "/powerreset", {
                    method: "POST",
                    handleAs: "text"
                });
                alert("Server Power Reset.");
                location.reload();
            });


            registry.byId("refresh").on("click", function() {
                grid.refresh();
            });
        });
    }   /* end of main function  */
);    /* end of require */