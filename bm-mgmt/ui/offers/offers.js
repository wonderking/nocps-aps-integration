require([
    "aps/ResourceStore",
    "dojo/when",
    "dijit/registry",
    "aps/load",
    "./displayError.js",
    "dojo/_base/array",
    "aps/ready!"
], function (Store, when, registry, load, displayError, arr) {
    var store = new Store({
        apsType:    "http://readyspace.com/bm-mgmt/offer/1.0",
        target:     "/aps/2/resources/" + aps.context.vars.bmcloud.aps.id + "/offers"
    });
    load(["aps/PageContainer", { id: "page" }, [
        ["aps/Grid", {
            id:                "grid",
            selectionMode:     "multiple",
            apsResourceViewId: "offer.edit",
            columns:   [
                { field: "name",             name: "Name", type: "resourceName" },
                { field: "poolIdfrom",   name: "Pool ID (Origin)" },
                { field: "poolIddest",   name: "Pool ID (Destination)" },
                { field: "hardware.CPU.description",      name: "Hardware Specification" },
                { field: "hardware.CPU.number",   name: "CPU cores" },
                { field: "hardware.memory",       name: "RAM, GB" },
                { field: "hardware.diskspace",    name: "Diskspace, GB" }
            ],
            store: store
        }, [
            ["aps/Toolbar", { id: "toolbar" }, [
                ["aps/ToolbarButton", { id: "new",     iconClass: "sb-add-new",   label:  "New" }],
                ["aps/ToolbarButton", { id: "delete",  iconClass: "sb-delete",    label: "Delete",    requireItems: true }],
                ["aps/ToolbarButton", { id: "refresh", iconClass: "sb-refresh",   label: "Refresh",   autoBusy: false }]
            ]]
        ]]
    ]]).then(function() {
        /* ...Define button processing here */
        registry.byId("new").on("click", function() {
            aps.apsc.gotoView("offer.new");
        });

        registry.byId("refresh").on("click", function() {
            registry.byId("grid").refresh();
        });

        registry.byId("delete").on("click", function() {
            var self = this;
            if (!confirm("Are you sure you want delete Offers?")) {
                self.cancel();
                return;
            }
            var grid    = registry.byId("grid"),
                sel       = grid.get("selectionArray"),
                counter   = sel.length;

            registry.byId("page").get("messageList").removeAll();

            arr.forEach(sel, function(offerId){ /* Get a BMS from the selected list */
                console.log("I'm trying to delete Offer with id = [" + offerId + "]");

                /* Remove the BMS from the APS database */
                when(store.remove(offerId),
                    /* If success, process the next BMS until the list is empty */
                    function(){
                        console.log("Offer with id = [" + offerId + "] removed");
                        sel.splice(sel.indexOf(offerId),1); /* Remove the BMS from the view */
                        grid.refresh();
                        if(--counter === 0) { self.cancel();} /* Make the button available again */
                    },
                    /* If failure, call the error handler */
                    function(e){
                        displayError(e);
                        if(--counter === 0) { self.cancel(); }
                    }
                );
            });
        });
    });
});