sap.ui.jsview("view.Menu", {

    getControllerName: function() {
        return "view.Menu";
    },

    createContent: function(oController) {

        var oList = new sap.m.List({
            selectionChange: [oController.doNavOnSelect, oController],
            mode: sap.m.ListMode.SingleSelectMaster,
            items: {
                path: "/",
            template: new sap.m.StandardListItem({
                title: "{FILENAME}",
                icon: "sap-icon://pdf-attachment",
                description: "{COUNT_FILENAME} matches",
                type: sap.m.ListType.Navigation,
            customData: new sap.ui.core.CustomData({
                key: "file",
                value: "https://s3-eu-west-1.amazonaws.com/swisscoment/" + "{FILENAME}" + ".pdf"
            })
            })
            }
        });
        oList.setModel(oModel);


        return new sap.m.Page({
            customHeader: new sap.m.Bar({
                contentLeft: [new sap.m.Image("SwisscomLogo", {
                    src: "http://www.res1.scsstatic.ch/etc/designs/header/clientlibs/publish/themes/default/resources/images/logo.png",
                    width: "35px",
                    height: "35px"
                })],
                contentMiddle: [new sap.m.Text({
                    text: "{i18n>WELCOME_TITLE}"
                })],
                contentRight: [new sap.m.Button({
                    icon: "sap-icon://bar-chart",
                    press: function(oControlEvent) {
                        oController.onChart(oControlEvent)
                    }
                    }
                )]
            }),
            subHeader: new sap.m.Bar({
                contentMiddle: [
                    new sap.m.SearchField({
                        id: "id-searchfield",
                        placeholder: "search for word in pdf...",
                        width: "100%",
                        liveChange: function(oControlEvent){
                            oController.onSearch(oControlEvent);

                        }
                    })
                ]
            }),
            content: [oList]
        });
    }

});