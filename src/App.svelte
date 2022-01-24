<script>
    import L from 'leaflet';

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

    function mapAction(container) {
        map = createMap(container);
    }
    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }

</script>

<svelte:window on:resize={resizeMap} />

<style>
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
<div class="map" style="height:100%; width:100%" use:mapAction />
