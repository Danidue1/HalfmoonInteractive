(function() {

    var map = L.map('map', {
        center: [42.86, -73.72],
        zoom: 12,
        dragging: true,
        zoomControl: true,
        scrollWheelZoom: true
    });


    var positron_lite_rainbow = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'positron lite rainbow'

    }).addTo(map);

    // var nysdop2014 = L.esri.tiledMapLayer("http://www.orthos.dhses.ny.gov/ArcGIS/rest/services/2014/MapServer/", {
    //                 maxZoom: 19,
    //                 zIndex: 9,
    //                 attribution: '2014 NYSDOP Imagery courtesy of <a href="http://www.orthos.dhses.ny.gov/" target="_blank">NYS DHSES</a>'
    //             }).addTo(map)

    $.getJSON("data/HalfmoonParcels2016_WGS84.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        console.log(data);
        var countyLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    fillcolor: '#dddddd',
                    weight: 1,
                    fillOpacity: 1,
                    color: '#1f78b4'
                }
            }
        })
    });



    //            L.TopoJSON = L.GeoJSON.extend({
    //   addData: function(jsonData) {
    //     if (jsonData.type === "Topology") {
    //       for (key in jsonData.objects) {
    //         geojson = topojson.feature(jsonData, jsonData.objects[key]);
    //         L.GeoJSON.prototype.addData.call(this, geojson);
    //       }
    //     }
    //     else {
    //       L.GeoJSON.prototype.addData.call(this, jsonData);
    //     }
    //   }
    // });
    //
    // var parcelLayer = new L.TopoJSON();
    // $.getJSON('data/halfmoonparcels2016.topojson')
    // .done(addParcelData)
    //
    // function addParcelData(parcelData){
    // parcelLayer.addData(parcelData);
    // parcelLayer.addTo(map);
    // }


    //
    // var parcelData, zoningData;
    // $.when(
    // // make requests for data
    // $.getJSON('https://danidue1.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM halfmoonparcels2016', function(data) {
    //   parcelData = data;
    // }),
    // $.getJSON('https://danidue1.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM zoning_asof_jan2015', function(data) {
    //   zoningData = data;
    // })
    // ).then(function() {
    // // when all data is loaded
    // drawMap(parcelData)
    // //drawCreature(llamaData);
    //
    // });
    //
    // function drawMap(data) {
    // var parcelLayer = L.geoJson(data, {
    //   style: function(feature) {
    //     return {
    //       fillcolor: 'purple',
    //       weight: 1,
    //       fillOpacity: 1,
    //       color: '#636363'
    //     }
    //   },


})();
