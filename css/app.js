(function() {

var map = L.map('map', {
center: [42.86, -73.72],
zoom: 12,
dragging: true,
zoomControl: true,
scrollWheelZoom: true
});


// var positron_lite_rainbow = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
// maxZoom: 19,
// attribution: 'positron lite rainbow'
//
// }).addTo(map);

var parcelData, zoningData;
$.when(
// make requests for data
$.getJSON('https://danidue1.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM halfmoonparcels2016', function(data) {
  parcelData = data;
}),
$.getJSON('https://danidue1.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM zoning_asof_jan2015', function(data) {
  zoningData = data;
})
).then(function() {
// when all data is loaded
drawMap(parcelData)
//drawCreature(llamaData);

});

function drawMap(data) {
var parcelLayer = L.geoJson(data, {
  style: function(feature) {
    return {
      fillcolor: 'purple',
      weight: 1,
      fillOpacity: 1,
      color: '#636363'
    }
  },

  // onEachFeature: function(feature, layer) {
  //   layer.on('mouseover', function() {
  //     //set visual affordance to show yellow outlined counties on mouseover
  //     this.setStyle({
  //       color: 'yellow',
  //       opacity: 1,
  //       weight: 4
  //     }).bringToFront();
  //   });
  //   //change visial affordance back to original outline color
  //   layer.on('mouseout', function() {
  //     this.setStyle({
  //       color: '#636363',
  //       weight: 1
  //     })
  //   });
    // var popup = '<b>' + layer.feature.properties.owner1 + ' </b><br />' + "Owner: ";
    // //console.log(layer.feature.properties.value);
	//
    // layer.bindPopup(popup, {
    //   offset: new L.Point(0, 10) // can set anchor here to avoid interference with mouse
    // });
    // //Popup opens on mouseover
  //   layer.on('mouseover', function(e) {
  //     var pop = e.target.getPopup();
  //     pop.setLatLng(e.latlng).openOn(map);
  //   });
  //   //tooltip closed when "not moused"
  //   layer.on('mouseout', function(e) {
  //     e.target.closePopup();
  //   });
  //
  // }
}).addTo(map); // and you can simply use that GeoJSON

// var breaks = getClassBreaks(alpacaLayer);
// alpacaLayer.eachLayer(function(layer) {
//   layer.setStyle({
//     fillColor: getColor(layer.feature.properties.value, breaks)
//   })
// })
//
// drawLegend(breaks);
// }
//
// function getClassBreaks(alpacaLayer) {
// //create empty array
// var values = [];
// //loop through all states
// alpacaLayer.eachLayer(function(layer) {
//   var value = layer.feature.properties.value
//   values.push(Number(value));
//   //push the alpaca number values for each layer into the array
//   //console.log(value);
// });
// //determine alike clusters
// var clusters = ss.ckmeans(values, 5);
// //console.log(clusters);
// //if (clusters
// //create an array of the lowest values of each cluster
// var breaks = clusters.map(function(cluster) {
//   return [cluster[0], cluster.pop()];
// });
// //console.log(breaks);
// return breaks //return resulting class breaks
// } //end of getClassBreaks function
// function getColor(d, breaks) {
// // console.log(d, breaks);
// if (d <= breaks[0][1]) {
//   return '#ffffcc';
// } else if (d <= breaks[1][1]) {
//   return '#c2e699';
// } else if (d <= breaks[2][1]) {
//   return '#78c679'
// } else if (d <= breaks[3][1]) {
//   return '#31a354'
// } else if (d <= breaks[4][1]) {
//   return '#006837'
// }
// }
//
// function drawLegend(breaks) {
// var legend = L.control({
//   position: 'topright'
// });
// legend.onAdd = function() {
//   var div = L.DomUtil.create('div', 'legend');
//   div.innerHTML = "<h3>Alpaca Distribution</h3>";
//   for (var i = 0; i < breaks.length; i++) {
//     var color = getColor(breaks[i][0], breaks);
//     div.innerHTML +=
//       '<span style="background:' + color + '"></span>' + '<label>' + (breaks[i][0]) + ' &mdash; ' + (breaks[i][1]) + ' Critters' + '</label>';
//   }
//   return div;
// };
// legend.addTo(map);
// }
//set creature icon
// var sheepIcon = new L.Icon({
// iconSize: [27, 27],
// //iconAnchor: [13, 27],
// popupAnchor: [1, -24],
// iconUrl: 'graphics/animal.svg'
// });
// // var highlightIcon = L.icon({
//   //     iconUrl: 'graphics/sheep.svg'
//   // });
//
// //draw creature marker
// function drawCreature (data) {
// var llamaLayer = L.geoJson(data, {
//   pointToLayer: function(feature, latlng) {
//     return L.marker(latlng, {
//       icon: sheepIcon
//     });
//   },
//   //overlayPane: 'drawCircle',
//   // style: function(feature) {
//   // 	return {
//   // 		color: '#0a6ed8', //blue
//   // 		fillColor: '#0a6ed8',
//   // 		weight: 3,
//   // 		stroke: 1,
//   // 		fillOpacity: .6,
//   // 		//radius: getRadius(feature.properties.atlas_name)
//   // 	}
//   // },
//   onEachFeature: function(feature, layer) {
//         // layer.on("mouseover",function(e){
//         //     layer.setIcon(highlightIcon)
//         // });.bringToFront();
//         // layer.on("mouseout",function(e){
//         //     layer.setIcon(sheepIcon)
//         // });
//
//     //pop up tip for creature Icon
//     var creaturePopup = '<b>' + layer.feature.properties.atlas_name + ' </b><br />' + "Llama Populous: " + layer.feature.properties.value;
//     //console.log(layer.feature.properties.value);
//
//     layer.bindPopup(creaturePopup, {
//       //offset: new L.Point(0, 10) // can set anchor here to avoid interference with mouse
//     });
//     // //Popup opens on mouseover
//     layer.on('mouseover', function(e) {
//       var pop = e.target.getPopup();
//       pop.setLatLng(e.latlng).openOn(map);
//     });
//     //tooltip closed when "not moused"
//     layer.on('mouseout', function(e) {
//       e.target.closePopup();
//     });
//   }
// }).addTo(map);

}
        })();
