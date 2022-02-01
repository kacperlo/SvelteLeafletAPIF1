import {writable, derived, readable} from 'svelte/store';

export const apiData = writable([]);
export const races = derived(apiData, ($apiData) => {
    if ($apiData.MRData){
        return $apiData.MRData.RaceTable.Races.map(race => race);
    }
    return [];
});

export const activeRace = writable(1);

export const map = writable();
export const wmsLayer = writable();
export const wmsWeatherLayer = writable();
export const trackLayers = writable();
export const markerLayers = writable();
export const popup = writable(false);

export const eye = writable(true);
export const lines = writable(true);
export const clouds = writable(false);
export const zoomLevel = writable(1);

export const initialView = readable([20, 20]);
export const initialZoom = readable(3);
