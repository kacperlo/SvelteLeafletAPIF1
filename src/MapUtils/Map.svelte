<script>
    import L from "leaflet";
    import tracksShapes from "./f1-tracks";
    import {
        activeRace,
        wmsLayer,
        map,
        wmsWeatherLayer,
        trackLayers,
        markerLayers,
        initialView,
        initialZoom,
        zoomLevel,
        eye,
        lines,
        clouds,
        popup
    } from '../store.js';
    import * as markerIcons from "./markers";

    function markerIcon() {
        let html = `<div class="map-marker">${markerIcons.library}</div>`;
        return L.divIcon({
            html,
            className: 'map-marker'
        });
    }

    function createMarker(loc, i) {
        let icon = markerIcon();
        let marker = L.marker(loc, {icon});
        marker.on('click', () => {
            $map.flyTo(loc, 15, {animate: false, duration: 1})
            activeRace.set(i)
            $popup = true
        })
        return marker;
    }

    function createMap(container) {
        let m = L.map(container, {preferCanvas: true }).setView($initialView, $initialZoom);
        L.tileLayer(
            'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            {
                attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
                subdomains: 'abcd',
                maxZoom: 20,
            }
        ).addTo(m);
        return m;
    }

    function mapAction(container) {
        $map = createMap(container);
        $map.on('zoomend', function() {
            $zoomLevel = $map._zoom
        });

        $wmsWeatherLayer = L.tileLayer.wms('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=6f2438a5f710fca7fe64f7543f77ff2c', {
            layers: 'Dynamiczna-hipsometria',
            zIndex: 2
        }).addTo($map);

        $wmsLayer = L.tileLayer.wms('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            layers: 'Dynamiczna-hipsometria',
            zIndex: 1,
        })

        $trackLayers = L.layerGroup()
        let tracks = L.geoJson(tracksShapes, { style: { "color": "#ff0000", "weight": 4 } })
        $trackLayers.addLayer(tracks)

        $markerLayers = L.layerGroup()
        for (const race of tracksShapes.features) {
            let m = createMarker([race.geometry.coordinates[0][1], race.geometry.coordinates[0][0]], race.properties.id);
            $markerLayers.addLayer(m);
        }
        $markerLayers.addTo($map);

        $map.on('click', () => $popup = false);

        return {
            destroy: () => {
                $map.remove();
                $map = null;
            }
        };
    }

    $: if($wmsLayer && $map) {
        if($eye) {
            $wmsLayer.remove();
        } else {
            $wmsLayer.addTo($map);
        }
    }

    $: if($wmsWeatherLayer && $map) {
        if($clouds) {
            $wmsWeatherLayer.addTo($map);
        } else {
            $wmsWeatherLayer.remove();
        }
    }

    $: if(($trackLayers || $markerLayers) && $map && $zoomLevel) {
        if($lines) {
            if($zoomLevel < 11) {
                $markerLayers.addTo($map);
                $trackLayers.remove();
            }
            else {
                $markerLayers.remove();
                $trackLayers.addTo($map);
            }
        }
        else {
            $trackLayers.remove();
            $markerLayers.remove();
        }
    }

    function resizeMap() {
        if($map) { $map.invalidateSize(); }
    }

</script>

<style>
    .map :global(.map-marker) {
        width:30px;
        transform:translateX(-90%) translateY(-30%) scale(0.5);
        animation: fadein 0.2s;
    }
    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    .map {
        background: #090909;
        outline: 0;
    }
</style>

<svelte:window on:resize={resizeMap} />
<div class="map" style="height:100%; width:100%" use:mapAction></div>
