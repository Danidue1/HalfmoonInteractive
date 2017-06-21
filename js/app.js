(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGFuaWR1ZTEiLCJhIjoiY2oxaDhid2E1MDAzejJxcGRqdmRkNzZjaCJ9.iF4gj5b98voRypvuygAxGw';
//Create Map
    var map = L.mapbox.map('map', null, {
        'center': [42.813706, -73.732218],
        'zoom': 12,
        'dragging': true,
        'zoomControl': true,
        'scrollWheelZoom': true
    });

// Launch for Modal Disclaimer
    // $(window).on('load',function(){
    //      $('#loadModal').modal('show');
    //  });

    // encapsulate basemap code in IIFE (Immediately Invoked Function Expression)
    (function() {

        // empty layerGroup for holding basemap layers
        var basemapLayers = L.layerGroup().addTo(map);

        //Add a basemap layers
        var googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(basemapLayers);

        var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        var nysdop2014 = L.tileLayer('http://www.orthos.dhses.ny.gov/ArcGIS/rest/services/2014/MapServer/tile/{z}/{y}/{x} ', {
            maxZoom: 20,
            //zIndex: 9,
            attribution: '2014 NYSDOP Imagery courtesy of <a href="http://www.orthos.dhses.ny.gov/" target="_blank">NYS DHSES</a>'
        });

        var baseMaps = {
            "Google Aerial": googleSat,
            "Google Hybrid": googleHybrid,
            "Google Streets": googleStreets,
            "2014 NYS Aerials": nysdop2014
        }
        // Add function to each of the layer switches
        $('#streetSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                googleStreets.addTo(map);
            } else {
                map.removeLayer(googleStreets);
                // unchecked
              }
          });
          // Add function to each of the layer switches
          $('#satSwitch').on('change', function() {
              // access the target basemap
              var checkValue = $(this).prop('checked');
              //	console.log(parcelLayer);

              if (checkValue) {
                  // it's checked
                  googleSat.addTo(map);
              } else {
                  map.removeLayer(googleSat);
                  // unchecked
                }
            });
            // Add function to each of the layer switches
            $('#hybridSwitch').on('change', function() {
                // access the target basemap
                var checkValue = $(this).prop('checked');
                //	console.log(parcelLayer);

                if (checkValue) {
                    // it's checked
                    googleHybrid.addTo(map);
                } else {
                    map.removeLayer(googleHybrid);
                    // unchecked
                  }
              });
              // Add function to each of the layer switches
              $('#nysSwitch').on('change', function() {
                  // access the target basemap
                  var checkValue = $(this).prop('checked');
                  //	console.log(parcelLayer);

                  if (checkValue) {
                      // it's checked
                      nysdop2014.addTo(map);
                  } else {
                      map.removeLayer(nysdop2014);
                      // unchecked
                    }
                });

$('#streetSwitch').prop('checked', true).change();

$('#streetSwitch').change(function(){
	if ($(this).is(':checked')) {
		$('#satSwitch').bootstrapToggle('off') &
		$('#nysSwitch').bootstrapToggle('off') &
		$('#hybridSwitch').bootstrapToggle('off')
	}
});
$('#satSwitch').change(function(){
	if ($(this).is(':checked')) {
		$('#streetSwitch').bootstrapToggle('off') &
		$('#nysSwitch').bootstrapToggle('off') &
		$('#hybridSwitch').bootstrapToggle('off')
	}
});
$('#nysSwitch').change(function(){
	if ($(this).is(':checked')) {
		$('#satSwitch').bootstrapToggle('off') &
		$('#streetSwitch').bootstrapToggle('off') &
		$('#hybridSwitch').bootstrapToggle('off')
	}
});
$('#hybridSwitch').change(function(){
	if ($(this).is(':checked')) {
		$('#streetSwitch').bootstrapToggle('off') &
		$('#nysSwitch').bootstrapToggle('off') &
		$('#satSwitch').bootstrapToggle('off')
	}
});

        // when user clicks on li
    //     $('#basemap-ui li').click(function() {
    //         // access the target basemap
    //         var targetBasemap = $(this).attr('data-basemap');
    //
    //         // loop through basemap layers and remove any
    //         basemapLayers.eachLayer(function(layer) {
    //             basemapLayers.removeLayer(layer);
    //         });
    //
    //         // add the target basemap to the layerGroup
    //         basemapLayers.addLayer(baseMaps[targetBasemap]);
    //     })
    //
    })();

    // empty object to hold all data
    var data = {};

    // use promise to load all data
    $.when(
        $.getJSON("data/HalfmoonTrails.geojson", function(d) {
            data.trails = d;
        }),
        $.getJSON("data/HalfmoonParcels2016.geojson", function(d) {
            data.parcels = d;
        }),
        $.getJSON("data/NYSDEC_Wetlands.geojson", function(d) {
            data.NYwetlands = d;
        }),
        $.getJSON("data/NWI_Wetlands.geojson", function(d) {
            data.NWIwetlands = d;
        }),
        $.getJSON("data/HalfmoonParks.geojson", function(d) {
            data.parks = d;
        }),
        $.getJSON("data/HalfmoonZoning.geojson", function(d) {
            data.zoning = d;
        }),
        $.getJSON("data/SurroundingTowns.geojson", function(d) {
            data.towns = d;
        })
    ).then(function() {
        // when ready, you have it all here
        console.log(data);

        // sent to new function
        drawThematicLayers(data)
    });

    function drawThematicLayers(data) {

        // first create all leaflet layers and assign to ref
        var trailsLayer = drawTrails(data.trails);
        var parcelLayer = drawParcels(data.parcels);
        var wetlandsNYLayer = drawWetlandsNY(data.NYwetlands);
        var wetlandsNWILayer = drawWetlandsNWI(data.NWIwetlands);
        var parksLayer = drawParks(data.parks);
        var zoningLayer = drawZoning(data.zoning);
        var surroundTowns = drawTowns(data.towns)

        // now you can add/remove these layers from the map with a UI
        // zoningLayer.addTo(map);
        surroundTowns.addTo(map);

        // var overlayMaps = {
        //     "2016 Halfmoon Tax Parcels": drawParcels,
        //     "NYS DEC Wetlands": drawWetlandsNY,
        //     "NWI Wetlands": drawWetlandsNWI,
        //     "Parks": drawParks,
        //     "Trails": drawTrails,
        //     "Town Zoning": drawZoning
        // }


        // Add function to each of the layer switches
        $('#zoningSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                zoningLayer.addTo(map);
            } else {
                map.removeLayer(zoningLayer);
                // unchecked
            }
        });

        $('#parcelSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                parcelLayer.addTo(map);
            } else {
                map.removeLayer(parcelLayer);
                // unchecked
            }
        });

        $('#nyWetSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                wetlandsNYLayer.addTo(map);
            } else {
                map.removeLayer(wetlandsNYLayer);
                // unchecked
            }
        });

        $('#nwiWetSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                wetlandsNWILayer.addTo(map);
            } else {
                map.removeLayer(wetlandsNWILayer);
                // unchecked
            }
        });
        $('#parkSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                parksLayer.addTo(map);
            } else {
                map.removeLayer(parksLayer);
                // unchecked
            }
        });
        $('#trailSwitch').on('change', function() {
            // access the target basemap
            var checkValue = $(this).prop('checked');
            //	console.log(parcelLayer);

            if (checkValue) {
                // it's checked
                trailsLayer.addTo(map);
            } else {
                map.removeLayer(trailsLayer);
                // unchecked
            }
        });
//turn just the parcel layer on byt default.
		$('#parcelSwitch').prop('checked', true).change();

//scale tolerance for parcels
    // map.on('zoomend ', function(e) { if ( map.getZoom() < 13 ){ map.removeLayer( parcelLayer )} else if ( map.getZoom() >= 13 ){ map.addLayer( parcelLayer )} })

        var searchControl = new L.Control.Search({
            layer: parcelLayer,
            propertyName: 'OWNER1',
            circleLocation: false,
            zoom: 16,
            collapsed: false,
			marker: {
            icon: new L.Icon({iconUrl:'https://unpkg.com/leaflet@1.0.3/dist/images/marker-icon.png', iconSize: [18,32]}),
            circle: {
                radius: 0,
                color: '#0a0',
                opacity: 1
                }
            }
        });
        searchControl.on('search_locationfound', function(e) {
                e.layer.setStyle({
                    fillColor: 'white',
                    color: 'white',
                    fillOpacity: 0.5
                });
                if (e.layer._popup)
                    e.layer.openPopup();

            })
            .on('search_collapsed', function(e) {
                parcelLayer.eachLayer(function(layer) {
                    parcelLayer.resetStyle(layer);
                });
            });

        map.addControl(searchControl);
        // Call the getContainer routine.
        var htmlObject = searchControl.getContainer();
        // Get the desired parent node.
        var a = document.getElementById('collapse2_search1');

        // append that node to the new parent, recursively searching out and re-parenting nodes.
        function setParent(el, newParent) {
            newParent.appendChild(el);
        }
        setParent(htmlObject, a);
        // console.log(searchControl.getContainer());

        var searchControl = new L.Control.Search({
            layer: parcelLayer,
            propertyName: 'MAIL_1ADDR',
            circleLocation: false,
            zoom: 16,
           collapsed: false
        });
        searchControl.on('search_locationfound', function(e) {
                e.layer.setStyle({
                    fillColor: 'white',
                    color: 'white',
                    fillOpacity: 0.5
                });
                if (e.layer._popup)
                    e.layer.openPopup();
            })
            .on('search_collapsed', function(e) {
                parcelLayer.eachLayer(function(layer) {
                    parcelLayer.resetStyle(layer);
                });
            });

        map.addControl(searchControl);
        // Call the getContainer routine.
        var htmlObject = searchControl.getContainer();
        // Get the desired parent node.
        var a = document.getElementById('collapse2_search2');

        // append that node to the new parent, recursively searching out and re-parenting nodes.
        function setParent(el, newParent) {
            newParent.appendChild(el);
        }
        setParent(htmlObject, a);
    }

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
                    color: 'orange',
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
        });

        return parcelLayer;
    };

    //create and stylize wetlands layer
    function drawWetlandsNY(data) {
        var nysdecLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'purple',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: 'purple',
                };
          }
        });

        return nysdecLayer;
    }

    //create and stylize wetlands layer
    function drawWetlandsNWI(data) {
        var nwiLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: '#7fcdbb',
                    weight: 1,
                    fillOpacity: 0.5,
                    fillColor: '#7fcdbb'
                };
            }
        })

        return nwiLayer;
    }

    //create and stylize surrounding towns layer
    function drawTowns(data) {
        var surroundTowns = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'black',
                    weight: 1,
                    fillOpacity: 0.6,
                    fillColor: '#b2b3b3',

                };
            },
            onEachFeature: function(feature, layer) {
                var popuptext = feature.properties.NAME
                layer.bindPopup(popuptext, customPopupOptions)
            }
        })
        return surroundTowns;
    }
    //     var options = {
    //         radius: 8,
    //         fillColor: "#ff7800",
    //         color: "#000",
    //         weight: 1,
    //         opacity: 1,
    //         fillOpacity: 0.8
    //     };
    //     function drawPOI(data) {
    //         var pointOfInterest = L.geoJson(data, {
    //                 pointToLayer: function(feature, latlng) {
    //                     return L.circleMarker(latlng, options);
    //                 }
    //             })
    //     // onEachFeature: function(feature, latlng) {
    //     //     var popuptext = feature.properties.NAME
    //     //     layer.bindPopup(popuptext, customPopupOptions)
    //     // }
    // }
    // return pointOfInterest;
    // }

    //Create, sytlize and add UI to trails layer
    function drawTrails(data) {
        var trailsLayer = L.geoJson(data, {
            style: function(feature) {
              return {
                color: '#dd1c77',
                dashArray: "5 10",
                weight: 4.5,
                opacity: 1

              };
          },
            //     if (feature.properties.Type_2017 === "Off Road Trail (Constructed)") {
            //         return {
            //             weight: 4.5,
            //             color: '#dd1c77',
            //             opacity: 1
            //         };
            //     };
            //     if (feature.properties.Type_2017 === "On Road (Designated & Non Designated)") {
            //         return {
            //             weight: 4.5,
            //             color: 'red',
            //             opacity: 1
            //         };
            //     };
            //     if (feature.properties.Type_2017 === "Off Road Trail (Proposed / Potential)") {
            //         return {
            //             color: '#dd1c77',
            //             dashArray: "5 10",
            //             weight: 4.5,
            //             opacity: 1
            //         };
            //     };
            // },
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
        });

        return trailsLayer;
    }

    //Create, sytlize and add UI to parks layer
    function drawParks(data) {
        var parksLayer = L.geoJson(data, {
            style: function(feature) {
                return {
                    color: 'Green',
                    weight: 1,
                    fillOpacity: 0.7,
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
        });

        return parksLayer;
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
                        weight: 1.5,
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
        });

        return zoningLayer;
    }
})();
