sap.ui.controller("view.PDFDetail", {

    onInit: function() {
        this.bus = sap.ui.getCore().getEventBus();
    },

    doNavBack: function(event) {
        this.bus.publish("nav", "back");
    }
});