<script>
    import MapToolbar from './MapUtils/MapToolbar.svelte';
    import { onMount } from "svelte";
    import {apiData, popup} from './store.js';
    import Sidebar from "./MapUtils/Sidebar.svelte";
    import Popup from "./MapUtils/Popup.svelte";
    import Map from "./MapUtils/Map.svelte";

    onMount(async () => {
        fetch("https://ergast.com/api/f1/2022.json")
            .then(response => response.json())
            .then(data => {
                apiData.set(data);
            }).catch(error => {
            console.log(error);
            return [];
        });
    });
</script>

<style>
    .body {
        position:relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction:row;
        background-color: black;
    }
    .map-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>

<div class="body">
    <Sidebar />
    <div class="map-container">
        <MapToolbar />
        {#if $popup === true}
            <Popup />
        {/if}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
              integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
              crossorigin=""/>
        <Map />
    </div>
</div>


