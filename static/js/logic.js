// // creating map object
// var myMap = L.map("map", {
//     center: [15.5994, -28.6731],
//     zoom: 3,
//     layers: [streets]
//   });


// Creating tile layer with leaflet quickstart and mapbox styles
//      maobox styles: https://docs.mapbox.com/api/maps/styles/
const streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


const outoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


const satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});


const baseMaps = {
    "Street Map": streets,
    "Outdoor Map": outoors,
    "Satellite Map": satellite
};


// create new layer group for earthquake and tectonic paltes
const earthquake = new L.LayerGroup();
const tectonicPlates = new L.LayerGroup();



const overlayMaps = {
    "Earthquake": earthquake,
    "Tectonic Plates": tectonicPlates
};


// creating map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [satellite, earthquake, tectonicPlates]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

//   load data from USGS    https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson
// using d3.json() method and hte .then to satisfy a  promise
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson').then(function (data) {
    console.log(data);

    //   create circle markers for each earthquake 
    // get radius functin     all are mag 1 or higher
    function getRadius(magnitude) {
        return Math.sqrt(magnitude) * 6  //multiply by a scaling factor  ** 6 ** for visualization
    }

    // get color function
    //   using switch and depth to determine color
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return '#d73027';
            case depth > 70:
                return '#fc8d59';
            case depth > 50:
                return '#fee08b';
            case depth > 30:
                return '#ffffbf';
            case depth > 10:
                return '#d9ef8b';
            default:
                return '#91cf60';

        }
    }

    // creating style function
    function getStyle(features) {
        return {
            fillColor: getColor(features.geometry.coordinates[2]),
            radius: getRadius(features.properties.mag),
            weight: 0.5,
            stroke: true,
            opacity: 0.9,
            fillOpacity: 0.7
        };
    }






    // using pointToLayer option to create a circle Marker
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // get style for the circleMarkers
        style: getStyle,

        // include popup for each feature using onEachFeature option from Leaflet choropleth tutorial
        onEachFeature: function (features, layer) {
            layer.bindPopup(
                "Location: "
                + features.properties.place
                + '<br> Time: '
                + Date(features.properties.time)
                + '<br> Magnitude: '
                + features.properties.mag
                + '<br> Depth: '
                + features.geometry.coordinates[2]
            );
        }


    }).addTo(earthquake);




    //   ######### end of access to data ################
});


// get tectonic plates data and add to TP layer
// url:   https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(function (plateData) {
    // geojson method to create layer
    L.geoJSON(plateData, {
        color: "orange",
        weight: 1.5
    }).addTo(tectonicPlates);
});





// add legend

var legend = L.control( {
    position: 'bottomleft'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [90, 70, 50, 30, 10],
        colors = [
            //  colors matching grades
            '#d73027',
            '#fc8d59',
            '#fee08b',
            '#ffffbf',
            '#d9ef8b',
            '#91cf60'
        ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' 
            + colors[i]
            + '"></i> ' 
            + grades[i] 
            + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);