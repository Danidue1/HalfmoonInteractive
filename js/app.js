(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuaWR1ZTEiLCJhIjoiY2oxaDhid2E1MDAzejJxcGRqdmRkNzZjaCJ9.iF4gj5b98voRypvuygAxGw';

    var map = L.mapbox.map('map', null, {
        'center': [42.86, -73.72],
        'zoom': 12,
        'dragging': true,
        'zoomControl': true,
        'scrollWheelZoom': true
    });
//2016 Parcel Data Addition
    $.getJSON("data/HalfmoonParcels2016.geojson", function(data) {
    })

    //call function to drawMap
  //drawMap(dataLayer)

            function drawMap(data, colorize) {
                // create Leaflet object with geometry data and add to map
                    //the data lodaded from the file is accessible here within this function scope
                    //console.log(data);
                    var parcelLayer = L.geoJson(data, {
                        style: function(feature) {
                            return {
                                color: 'orange',
                                weight: 1,
                                fillOpacity: 0.5,
                                fillColor: 'transparent'
                            };
                        }

                }).addTo(map);

                //adds listener when a county is moused over and calls the updateInfo function
                dataLayer.eachLayer(function(layer) {
                    layer.on('mouseover', function() {
                        //set visual affordance to show yellow outlined counties on mouseover
                        this.setStyle({
                            color: 'yellow',
                            opacity: 1,
                            weight: 4
                        }).bringToFront(); //bring yellow highlight to the forefront, over the inital drawMap style
                    });
                    //change visial affordance back to original outline color
                    layer.on('mouseout', function() {
                        this.setStyle({
                            color: 'black',
                            weight: 1
                        })
                    })
                })

    //NYS DEC wetlands layer
    $.getJSON("data/NYSDEC_Wetlands.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        //console.log(data);
        var nysdecLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'purple',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: 'purple'
                };
            }
        }).addTo(map);
    });
    //National Wetlands Inventory Layer
    $.getJSON("data/NWI_Wetlands.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        //console.log(data);
        var nwiLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'Green',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: 'Green'
                };
            }
        }).addTo(map);
    });


    $.getJSON("data/HalfmoonTrails.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        //console.log(data);
        var nysdecLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'red',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: 'red'
                };
            }
        }).addTo(map);
    });


    $.getJSON("data/HalfmoonParks.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        //console.log(data);
        var nysdecLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'Green',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: 'Green'
                };
            }
        }).addTo(map);
    });
    //Town Zoning and Classes
    var zoningLayer = L.geoJson(null, {
        style: function(feature) {
            return {
                color: 'pink',
                weight: 1,
                fillOpacity: 0.5,
                fillColor: 'pink'
            };
        }
    });

    $.getJSON("data/HalfmoonZoning.geojson", function(data) {
        //the data lodaded from the file is accessible here within this function scope
        console.log(data);

        zoningLayer.addData(data);
    });

    var townZoning = L.geoJson(null, {
        style: function(feature) {

            if (feature.properties.Zone == "R-1") {
                return {
                    color: "black",
                    fillColor: "#E3FFD1",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
            if (feature.properties.Zone == "R-2") {
                return {
                    color: "black",
                    fillColor: "#B5FF00",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
            if (feature.properties.Zone == "R-3") {
                return {
                    color: "black",
                    fillColor: "#149614",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
            if (feature.properties.Zone == "PDD") {
                return {
                    color: "black",
                    fillColor: "#FF7D7D",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
            if (feature.properties.Zone == "PO-R") {
                return {
                    color: "black",
                    fillColor: "#FFBFE8",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
            if (feature.properties.Zone == "C-1") {
                return {
                    color: "black",
                    fillColor: "#BFE8FF",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            }
            if (feature.properties.Zone == "LI-C") {
                return {
                    color: "black",
                    fillColor: "#33A1A6",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            }
            if (feature.properties.Zone == "M-1") {
                return {
                    color: "black",
                    fillColor: "#0082FF",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            }
            if (feature.properties.Zone == "TO") {
                return {
                    color: "black",
                    fillColor: "#ADA3FF",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            }
            if (feature.properties.Zone == "NB-1") {
                return {
                    color: "black",
                    fillColor: "#FF00C5",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            }
            if (feature.properties.Zone == "CC-1") {
                return {
                    color: "black",
                    fillColor: "#A6A6A6",
                    weight: 2,
                    fill: true,
                    fillOpacity: 0.8,
                    opacity: 1,
                    clickable: true
                };
            };
        }).addTo(map);
    // })

    }
    // function DrawParcels()

    //Load Basemap Layers

    //
    // var roads = L.gridLayer.googleMutant({
    //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    // }).addTo(map);

    // var googleLayer = new L.Google('ROADS');
    //    map.addLayer(googleLayer);

    // var positron_lite_rainbow = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: 'positron lite rainbow'
    //
    // }).addTo(map);

    // var nysdop2014 = L.tileLayer("http://www.orthos.dhses.ny.gov/ArcGIS/rest/services/2014/MapServer/", {
    //                 maxZoom: 19,
    //                 zIndex: 9,
    //                 attribution: '2014 NYSDOP Imagery courtesy of <a href="http://www.orthos.dhses.ny.gov/" target="_blank">NYS DHSES</a>'
    //             }).addTo(map)


})();
