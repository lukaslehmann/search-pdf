sap.ui.jsview("view.PDFDetail", {

    getControllerName: function() {
        return "view.PDFDetail";
    },

    createContent: function(oController) {
        var oPage = new sap.m.Page({
            title: "Detail View",
            showNavButton: "{device>/isPhone}",
            navButtonPress: [oController.doNavBack, oController],
            content: new sap.ui.core.HTML({
                content: "<object width=\"100%\" maxHeight=\"100%\" height=\"100%\" data=\"{file}\" type=\"application/pdf\"> " +
                    "<iframe src=\"{file}\"  /> " +
                    "</object>",
                preferDOM: true
            })
        });
        oPage.setModel(oModelDetail);
        oPage.bindObject("/");

        return oPage;
    }
});