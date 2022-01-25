<script>
    import L from 'leaflet';
    import MapToolbar from './MapToolbar.svelte';
    import MarkerPopup from './MarkerPopup.svelte';
    import * as markerIcons from './markers.js';
    import tracksShapes from './tracks'
    import { onMount } from "svelte";
    import { apiData, races } from './store.js';

    let map;

    onMount(async () => {
        fetch("http://ergast.com/api/f1/2022.json")
            .then(response => response.json())
            .then(data => {
                console.log(data.MRData.RaceTable.Races);
                apiData.set(data);
            }).catch(error => {
            console.log(error);
            return [];
        });
    });

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

    let eye = true;
    let lines = true;
    let clouds = false;

    let toolbar = L.control({ position: 'topright' });
    let toolbarComponent;
    toolbar.onAdd = (map) => {
        let div = L.DomUtil.create('div');
        toolbarComponent = new MapToolbar({
            target: div,
            props: {}
        });

        toolbarComponent.$on('click-eye', ({ detail }) => eye = detail);
        toolbarComponent.$on('click-lines', ({ detail }) => {lines = detail });
        toolbarComponent.$on('click-clouds', ({ detail }) => {clouds = detail });
        toolbarComponent.$on('click-reset', () => {
            map.setView(initialView, initialZoom, { animate: true })
        })
        return div;
    }

    toolbar.onRemove = () => {
        if(toolbarComponent) {
            toolbarComponent.$destroy();
            toolbarComponent = null;
        }
    };

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
    let lineLayers;
    let trackLayers;
    let zoomLevel = 1;
    let wmsLayer;
    let wmsWeatherLayer;
    let myStyle = {
        "color": "#ff0000",
        "weight": 4,
    };

    function mapAction(container) {
        map = createMap(container);

        map.on('zoomend', function() {
            zoomLevel = map._zoom
        });

        toolbar.addTo(map);

        wmsWeatherLayer = L.tileLayer.wms('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=6f2438a5f710fca7fe64f7543f77ff2c', {
            layers: 'Dynamiczna-hipsometria',
            zIndex: 2
        }).addTo(map);

        wmsLayer = L.tileLayer.wms('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
            layers: 'Dynamiczna-hipsometria',
            zIndex: 1,
        }).addTo(map)

        trackLayers = L.layerGroup()
        let tracks = L.geoJson(tracksShapes, { style: myStyle })
        trackLayers.addLayer(tracks)

        markerLayers = L.layerGroup()
        for(let track of tracksShapes.features) {
            let m = createMarker([track.geometry.coordinates[0][1], track.geometry.coordinates[0][0]]);
            markerLayers.addLayer(m);
        }
        markerLayers.addTo(map);

        return {
            destroy: () => {
                toolbar.remove();
                map.remove();
                map = null;
            }
        };
    }

    $: if(wmsLayer && map) {
        if(eye) {
            wmsLayer.addTo(map);
        } else {
            wmsLayer.remove();
        }
    }

    $: if(wmsWeatherLayer && map) {
        if(clouds) {
            wmsWeatherLayer.addTo(map);
        } else {
            wmsWeatherLayer.remove();
        }
    }

    $: if((trackLayers || markerLayers) && map && zoomLevel) {
        if(lines) {
            if(zoomLevel < 11) {
                markerLayers.addTo(map);
                trackLayers.remove();
            }
            else {
                markerLayers.remove();
                trackLayers.addTo(map);
            }
        }
        else {
            trackLayers.remove();
            markerLayers.remove();
        }
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

