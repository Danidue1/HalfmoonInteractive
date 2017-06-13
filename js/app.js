(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuaWR1ZTEiLCJhIjoiY2oxaDhid2E1MDAzejJxcGRqdmRkNzZjaCJ9.iF4gj5b98voRypvuygAxGw';

    var map = L.mapbox.map('map', null, {
        'center': [42.876301, -73.727470],
        'zoom': 12,
        'dragging': true,
        'zoomControl': true,
        'scrollWheelZoom': true
    });

    // encapsulate basemap code in IIFE (Immediately Invoked Function Expression)
    (function(){

            // empty layerGroup for holding basemap layers
            var basemapLayers = L.layerGroup().addTo(map);

            //Add a basemap layers
            var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                }).addTo(basemapLayers)

            var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            var nysdop2014 = L.tileLayer('http://www.orthos.dhses.ny.gov/ArcGIS/rest/services/2014/MapServer/tile/{z}/{y}/{x} ', {
                maxZoom: 20,
                //zIndex: 9,
                attribution: '2014 NYSDOP Imagery courtesy of <a href="http://www.orthos.dhses.ny.gov/" target="_blank">NYS DHSES</a>'
            });

            var baseMaps = {
                "Google Aerials": googleSat,
                "Google Hybrid": googleHybrid,
                "Google Streets": googleStreets,
                "2014 NYS Aerials": nysdop2014
            }

            // when user clicks on li
            $('#basemap-ui li').click(function(){
                // access the target basemap
                var targetBasemap = $(this).attr('data-basemap');

                // loop through basemap layers and remove any
                basemapLayers.eachLayer(function(layer){
                    basemapLayers.removeLayer(layer);
                });

                // add the target basemap to the layerGroup
                basemapLayers.addLayer(baseMaps[targetBasemap]);
            })

    })();

    var overlayMaps = {
        "2016 Halfmoon Tax Parcels": drawParcels,
        "NYS DEC Wetlands": drawWetlandsNY,
        "NWI Wetlands": drawWetlandsNWI,
        "Parks": drawParks,
        "Trails": drawTrails,
        "Town Zoning": drawZoning
    }


    // //Load halfmoon trails data
    $.getJSON("data/HalfmoonTrails.geojson", function(data) {
        //console.log(data);
        drawTrails(data)
    });
    // //load 2016 Parcel Data
    $.getJSON("data/HalfmoonParcels2016.geojson", function(data) {
        //console.log(data);
        drawParcels(data);
    });
    // //Load NYS DEC wetlands layer
    $.getJSON("data/NYSDEC_Wetlands.geojson", function(data) {
        //console.log(data);
        drawWetlandsNY(data)
    });
    // //load National Wetlands Inventory Layer
    $.getJSON("data/NWI_Wetlands.geojson", function(data) {
        //console.log(data);
        drawWetlandsNWI(data)
    });
    // //load halfmoon parks data
    $.getJSON("data/HalfmoonParks.geojson", function(data) {
        //console.log(data);
        drawParks(data)
    });
    //load halfmoon zoning data
    // $.getJSON("data/HalfmoonZoning.geojson", function(data) {
    //           // console.log(data);
    //             drawZoning(data)
    //           });

    var customPopupOptions = {
        'max-width': '500',
        'className': 'custom',
        'closeButton': 'false'
    }

    //Creat, stylize and add UI to parcel layer
    function drawParcels(data) {
        var parcelLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'yellow',
                    weight: 1.5,
                    fillOpacity: 0.5,
                    fillColor: 'transparent'
                };
            },
            onEachFeature: function(feature, layer) {
                var popuptext = '<b>' + "Tax Pacel ID: " + layer.feature.properties.PRINT_KEY + '</b><br />' + '<b>' + "Parcel Address: " + layer.feature.properties.PROP_ADDR + '</b><br />' + '<b>' + "Owner Name: " + layer.feature.properties.OWNER1 + '</b><br />'
                layer.bindPopup(popuptext, customPopupOptions)

                layer.on('mouseover', function() {
                    //set visual affordance to show yellow outlined counties on mouseover
                    this.setStyle({
                        opacity: 0.8,
                        weight: 4,
                    }).bringToFront();
                });
                //change visial affordance back to original outline color
                layer.on('mouseout', function() {
                    this.setStyle({
                        weight: 1.5
                    })
                });
            }
        }).addTo(map);
    };

    //create and stylize wetlands layer
    function drawWetlandsNY(data) {
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
    }

    //create and stylize wetlands layer
    function drawWetlandsNWI(data) {
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
    }

    //Create, sytlize and add UI to trails layer
    function drawTrails(data) {
        var trailsLayer = L.geoJson(data, {
            style: function(feature) {
                if (feature.properties.Type_2017 === "Off Road Trail (Constructed)") {
                    return {
                        weight: 4.5,
                        color: 'purple',
                        opacity: 1
                    };
                };
                if (feature.properties.Type_2017 === "On Road (Designated & Non Designated)") {
                    return {
                        weight: 4.5,
                        color: 'red',
                        opacity: 1
                    };
                };
                if (feature.properties.Type_2017 === "Off Road Trail (Proposed / Potential)") {
                    return {
                        color: 'purple',
                        dashArray: "5 10",
                        weight: 4.5,
                        opacity: 1
                    };
                };
            },
            onEachFeature: function(feature, layer) {
                var popuptext = feature.properties.Trail_Name
                layer.bindPopup(popuptext, customPopupOptions)


                // //I really want to use the mouseover text more than click
                // layer.bindPopup(popuptext);
                // //Tooltip opens on mouseover
                // layer.on('mouseover', function(e) {
                //     e.target.openPopup();
                // });
                // //tooltip closed when "not moused"
                // layer.on('mouseout', function(e) {
                //     e.target.closePopup();
                // });
                // layer.bindPopup(popuptext)

                layer.on('mouseover', function() {
                    //set visual affordance to show yellow outlined counties on mouseover
                    this.setStyle({
                        opacity: 0.8,
                        weight: 7,
                    }).bringToFront();
                });
                //change visial affordance back to original outline color
                layer.on('mouseout', function() {
                    this.setStyle({
                        weight: 4.5
                    })
                });
            }
        }).addTo(map);
    }

    //Create, sytlize and add UI to parks layer
    function drawParks(data) {
        var parksLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'Green',
                    weight: 1,
                    fillOpacity: 1,
                    fillColor: 'Green'
                };
            },
            onEachFeature: function(feature, layer) {
                var popuptext = feature.properties.name
                layer.bindPopup(popuptext, customPopupOptions)

                layer.on('mouseover', function() {
                    //set visual affordance to show yellow outlined counties on mouseover
                    this.setStyle({
                        color: 'yellow',
                        opacity: 1,
                        weight: 2,
                    }).bringToFront();
                });
                //change visial affordance back to original outline color
                layer.on('mouseout', function() {
                    this.setStyle({
                        color: 'null',
                        weight: 1
                    })
                });
            }
        }).addTo(map)
    }

    //Create, sytlize and add UI to zoning layer
    function drawZoning(data) {
        var zoningLayer = L.geoJson(data, {
            style: function(feature) {
                if (feature.properties.Zone === "A-R") {
                    return {
                        color: "black",
                        fillColor: "#FFF7A3",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "R-1") {
                    return {
                        color: "black",
                        fillColor: "#E3FFD1",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "R-2") {
                    return {
                        color: "black",
                        fillColor: "#B5FF00",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "R-3") {
                    return {
                        color: "black",
                        fillColor: "#149614",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "PDD") {
                    return {
                        color: "black",
                        fillColor: "#FF7D7D",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "PO-R") {
                    return {
                        color: "black",
                        fillColor: "#FFBFE8",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
                if (feature.properties.Zone === "C-1") {
                    return {
                        color: "black",
                        fillColor: "#BFE8FF",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                }
                if (feature.properties.Zone === "LI-C") {
                    return {
                        color: "black",
                        fillColor: "#33A1A6",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                }
                if (feature.properties.Zone === "M-1") {
                    return {
                        color: "black",
                        fillColor: "#0082FF",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                }
                if (feature.properties.Zone === "TO") {
                    return {
                        color: "black",
                        fillColor: "#ADA3FF",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                }
                if (feature.properties.Zone === "NB-1") {
                    return {
                        color: "black",
                        fillColor: "#FF00C5",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                }
                if (feature.properties.Zone === "CC-1") {
                    return {
                        color: "black",
                        fillColor: "#A6A6A6",
                        weight: 0,
                        fill: true,
                        fillOpacity: 0.8,
                        opacity: 1,
                        clickable: true
                    };
                };
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    var popuptext = feature.properties.Zone + " - " + feature.properties.Descript
                    layer.bindPopup(popuptext, customPopupOptions)
                }
                layer.on('mouseover', function() {
                    //set visual affordance to show yellow outlined counties on mouseover
                    this.setStyle({
                        color: 'black',
                        opacity: 1,
                        weight: 2,
                    }).bringToFront();
                });
                //change visial affordance back to original outline color
                layer.on('mouseout', function() {
                    this.setStyle({
                        color: 'null',
                        weight: 1
                    })
                });
            }
        }).addTo(map)
    }

})();
