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
    layers: [satellite, earthquake]
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
    }).addTo(myMap);

    //   ######### end of access to data ################
});
