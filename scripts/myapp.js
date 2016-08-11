(function () {

    window.myapp = window.myapp || {};

    window.onload = function () {

        // the URL to your viz.json
        var diJSON = 'https://team.carto.com/u/ramirocartodb/api/v3/viz/d4c696b6-5fb1-11e6-a9a0-0e233c30368f/viz.json';

        var username = 'ramirocartodb',
            myapp = window.myapp;

        // style
		var style = cdb.$("#style").text();

        // SQL client, inf needed
        myapp.sqlclient = new cartodb.SQL({
            user: username,
            protocol: "https",
            sql_api_template: "https://{user}.cartodb.com:443"
        });

        cartodb.deepInsights.createDashboard('#dashboard', diJSON, {
            no_cdn: false
        }, function (err, dashboard) {

            myapp.dashboard = dashboard;

            // DI map
            myapp.map = dashboard.getMap();

            // CDB map to add layers and so
            myapp.Cmap = myapp.map.map;

            // Leaflet map object
            //myapp.Lmap = myapp.map.getNativeMap();

            // CartoDB layers
            myapp.layers = myapp.map.getLayers();

            // layer (layers 0 is the basemap)
            myapp.blocks = myapp.layers[1]

            // Array of widgets views
            myapp.widgets = dashboard.getWidgets();

            // Array of widgets’ data models
            myapp.widgetsdata = myapp.widgets.map(function (a) {
                return a.dataviewModel
            });

            // retrieve the widgets container so we can add a custom one if needed
             myapp.wcontainer = cdb.$('#' + dashboard._dashboard.dashboardView.$el.context.id + ' .CDB-Widget-canvasInner').get(0);

			myapp.nodes = dashboard._dashboard.vis._analysisCollection.models;

            // function to add nodes
            myapp.addNode = function(options){
                return myapp.map.analysis.analyse(options);
            }

			// add node
            myapp.addNode({
                "id": "b0",
                "type": "source",
                "params": {
                    "query": "SELECT * FROM ramirocartodb.dominos_data"
                },
                "options": {
                    "table_name": "ramirocartodb.dominos_data"
                }
            });

            // add CartoDBLayer
            myapp.Cmap.createCartoDBLayer({
                "source": 'b0',
                "name": 'dominos_data',
                "cartocss": '#layer{marker-fill-opacity: 1; marker-line-color: red; marker-line-width: 1; marker-line-opacity: 0; marker-placement: point; marker-type: ellipse; marker-width: 5; marker-fill: red; marker-allow-overlap: true; } #layer::point{marker-fill-opacity: 0.5; marker-line-color: red; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 15; marker-fill: red; marker-allow-overlap: true; }'});

            // insert custom widget
            myapp.wcontainer.insertBefore(document.querySelector('#mywidget'), myapp.wcontainer.children[0]);

            // set widget - style by field function
            var StyleByField = {
                reset: function(){
                	myapp.blocks.set('cartocss', style.replace('field', 'total_pop'));
                },
                unemp: function(){
                    myapp.blocks.set('cartocss', style.replace('field', 'unemployed_pop').replace('#E4F1E1, #9CCDC1, #63A6A0, #337F7F, #0D585F', '#f6d2a9, #f3aa84, #ea8171, #d55d6a, #b13f64'));
                },
                bach: function(){
                    myapp.blocks.set('cartocss', style.replace('field', 'bachelors_pop').replace('#E4F1E1, #9CCDC1, #63A6A0, #337F7F, #0D585F', '#f3e79b, #fab27f, #eb7f86, #b95e9a, #5c53a5'));
                }
            };

            cdb.$('#selector').change(function() {
                StyleByField[cdb.$(this).val()]();
            }); 

        });
    }

})();