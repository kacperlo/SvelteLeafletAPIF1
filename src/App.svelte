<script>
    import L from 'leaflet';
    import MapToolbar from './MapToolbar.svelte';
    import MarkerPopup from './MarkerPopup.svelte';
    import * as markerIcons from './markers.js';
    import tracksShapes from './tracks'

    let map;

    const initialView = [10, 0];
    const initialZoom = 3;

    function createMap(container) {
        let m = L.map(container, {preferCanvas: true }).setView(initialView, initialZoom);
        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
                subdomains: 'abcd',
                maxZoom: 20,
            }
        ).addTo(m);
        return m;
    }

    function bindPopup(marker, createFn) {
        let popupComponent;
        marker.bindPopup(() => {
            let container = L.DomUtil.create('div');
            popupComponent = createFn(container);
            return container;
        });

        marker.on('popupclose', () => {
            if(popupComponent) {
                let old = popupComponent;
                popupComponent = null;
                // Wait to destroy until after the fadeout completes.
                setTimeout(() => {
                    old.$destroy();
                }, 500);

            }
        });
    }

    let markers = new Map();

    function markerIcon() {
        let html = `<div class="map-marker">${markerIcons.library}</div>`;
        return L.divIcon({
            html,
            className: 'map-marker'
        });
    }

    function createMarker(loc) {
        let icon = markerIcon();
        let marker = L.marker(loc, {icon});
        bindPopup(marker, (m) => {
            let c = new MarkerPopup({
                target: m,
            });

            c.$on('change', ({detail}) => {
                marker.setIcon(markerIcon());
            });

            return c;
        });

        return marker;
    }

    let markerLayers;
    let trackLayers;
    let myStyle = {
        "color": "#ff0000",
        "weight": 4,
    };

    function mapAction(container) {
        map = createMap(container);

        trackLayers = L.layerGroup()
        let tracks = L.geoJson(tracksShapes, { style: myStyle })
        trackLayers.addLayer(tracks)

        markerLayers = L.layerGroup()
        for(let track of tracksShapes.features) {
            let m = createMarker([track.geometry.coordinates[0][1], track.geometry.coordinates[0][0]]);
            markerLayers.addLayer(m);
        }
        markerLayers.addTo(map);
    }

    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }

</script>

<svelte:window on:resize={resizeMap} />

<style>
    .map :global(.marker-text) {
        width:100%;
        text-align:center;
        font-weight:600;
        background-color:#444;
        color:#EEE;
        border-radius:0.5rem;
    }

    .map :global(.map-marker) {
        width:30px;
        transform:translateX(-90%) translateY(-30%) scale(0.5);
    }
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
<div class="map" style="height:100%; width:100%" use:mapAction />
