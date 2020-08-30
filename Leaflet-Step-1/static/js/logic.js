const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(data) {
    makeMapInfo(data);
});

function makeMapInfo(d) {
    function makeLayers(feature) {
        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: feature.properties.mag,
            fillOpacity: 0.75,
            color: scaledColor(feature.properties.mag),
        });
    }
    function makeFeatures(feature, layer) {
        layer.bindPopup("<h1>" + feature.properties.place + "</h1><hr><h3>" + new Date(feature.properties.time) +
        "</h3><hr><h3>" + feature.properties.mag + "</h3>");
    }
    var earthquakes = L.geoJSON(d, {
        onEachFeature: makeFeatures,
        pointToLayer: makeLayers
    });
    makeMap(earthquakes);
};

function makeMap(earthquakes) {
    var map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: "pk.eyJ1IjoiY3ByaW5jZTIwIiwiYSI6ImNrZWhrOGQxYzB3Mmoyc3J6ZmVubHlkeGcifQ.eF3Eazz158d4FuUOVSobtQ"
      });
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    var baseMaps = {
        "Map": map
    };

    var myMap = L.map("map", {
        center: [
            0.00, 0.00
        ],
        zoom: 2,
        layers: [map, earthquakes]
    });
    L.control.layers(baseMaps, overlayMaps, {
        collapse: true
    }).addTo(myMap)
}

function scaledColor(mag) {
    if (mag >= 5) {
        return "red";
    }
    else if (mag >= 4) {
        return "orange";
    }
    else if (mag >= 3) {
        return "darkorange";
    }
    else if (mag >= 2) {
        return "yellow"
    }
    else if (mag >= 1) {
        return "yellowgreen";
    }
    else {
        return "green";
    };
};
