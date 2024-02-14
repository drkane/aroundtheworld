var map = L.map('map').setView([33.3761, -2.1897], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var daveIcon = L.icon({
    iconUrl: 'static/img/dave.png',
    iconSize: [120, 120],
});

var dave_markers = L.featureGroup().addTo(map);
var dave_route = L.polyline([]);

daves.forEach(function (dave) {
    dave_route.addLatLng([dave.lat, dave.long]);
});

function createDave(marker_i, point_latlng) {
    var p = daves[marker_i];
    var dave_marker = L.marker(point_latlng, { icon: daveIcon }).bindTooltip(p.location, { permanent: true, direction: 'top', offset: [0, -60] });
    dave_markers.addLayer(dave_marker);

    var previous_point = daves[marker_i - 1];
    if (previous_point) {
        var line = L.polyline([
            [previous_point.lat, previous_point.long],
            [p.lat, p.long]
        ], { color: '#f95162', weight: 5 });
        line.addTo(map);
    }
}

var animatedMarker = L.animatedMarker(dave_route.getLatLngs(), {
    icon: daveIcon,
    interval: 3000,
    zIndexOffset: 2000,
    autoStart: false,
    onPoint: function (point) {
        var marker_i = this._i - 1;
        if (marker_i < 0) {
            dave_markers.clearLayers();
            return
        }
        var point_latlng = this._latlngs[marker_i];
        createDave(marker_i, point_latlng);
    },
    onEnd: function () {
        var point_latlng = this._latlngs[this._i - 1];
        createDave(this._i - 1, point_latlng);
    }
});
animatedMarker.addTo(map);
animatedMarker.start();
map.fitBounds(dave_route.getBounds());