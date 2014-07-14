jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.controller("view.Menu", {

    onInit: function() {
        this.bus = sap.ui.getCore().getEventBus();
    },

    doNavOnSelect: function(event) {
        if (sap.ui.Device.system.phone) {
            event.getParameter("listItem").setSelected(false);
        }
        oModelDetail.setData({"file": event.getParameter('listItem').getCustomData()[0].getValue()});
        this.bus.publish("nav", "to", {
            id: "PDFDetail"
        });
    },

    onChart: function(oControlEvent) {
        this.bus.publish("nav", "to", {
            id: "ChartDetail"
        });
    },

    onSearch: function(oControlEvent){
        var strSearchTerm = sap.ui.getCore().byId("id-searchfield").getValue();

        var url = "http://localhost:3000/search?name=";//document.getElementsByTagName("body")[0].getAttribute("data-url") + '/search?name=';

        //prepare ajax request url with parameter name
        ajax_url = url + strSearchTerm;
        //ajax request on /search?name=<search term>
        $.ajax({
            url: ajax_url,
            dataType: "json",
            success: function(data, textStatus, jqXHR) {
                resp_data = data;
                if ( resp_data.length != 0 ) {
                    var col = ['matches'];
                    var cat = [];

                    for (var i = 0; i < 6; i++) {
                        if (resp_data[i].FILENAME === undefined)      // skip undefined elements
                            continue;
                        col.push(resp_data[i].COUNT_FILENAME);
                        cat.push(resp_data[i].FILENAME);
                    }

                    oChart.load({

                        columns: [
                            col
                        ],
                        categories: cat
                    });
                    oChart.unload('sample')
                };
                oModel.setData(resp_data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });

    }

});