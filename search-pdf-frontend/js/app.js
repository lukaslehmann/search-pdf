sap.ui.localResources("view");
sap.ui.localResources("model");
jQuery.sap.registerModulePath('app', 'app');

/*
jQuery.sap.require("app.Component");

//create app Component and place at dom element with id = root
new sap.ui.core.ComponentContainer({
    name: "app"
}).placeAt('root');
*/

sap.ui.jsview("RootView", "view.App").placeAt('root');

var oChart;
setTimeout(function() {

        oChart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['sample', 30, 200, 100, 400, 150, 250]
                ],
                type: 'bar',
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['sample', 'sample', 'sample', 'sample', 'sample', 'sample']
                }
            }
        })}, 50);

