import { writable, derived } from 'svelte/store';

export const apiData = writable([]);
export const races = derived(apiData, ($apiData) => {
    if ($apiData.MRData){
        return $apiData.MRData.RaceTable.Races.map(race => race);
    }
    return [];
});

export const activeRace = writable(1);
