sap.ui.jsview("view.ChartDetail", {

    getControllerName: function() {
        return "view.ChartDetail";
    },

    createContent: function(oController) {

        var oPage = new sap.m.Page({
            title: "Detail View",
            showNavButton: "{device>/isPhone}",
            navButtonPress: [oController.doNavBack, oController],
            content: new sap.ui.core.HTML({
                content: "<div id=\"chart\"></div>",
                preferDOM: true
            })
        });

        return oPage;
    }

});