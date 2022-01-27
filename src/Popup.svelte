<script>
    import { createEventDispatcher } from 'svelte';
    import {races, activeRace} from './store.js';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close', {
            text: close
        });
    }


    let activeRaceValue = 0
    activeRace.subscribe(value => {
        activeRaceValue = value-1;
    });

    function getMonthFromNumber(num){
        return "JanFebMarAprMayJunJulAugSepOctNovDec".slice(num * 3 - 3, num * 3)
    }

</script>

<style>
    .popup {
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: 500px;
        height: 200px;
        background-color: black;
        z-index: 600;
        border-radius: 7px;
        color: white;
        padding: 20px;
    }
    .round {
        color: #d74040;
        font-size: 19px;
        font-weight: 400;
    }
    h1 {
        font-size: 35px;
        margin: 10px 0 4px 0;
    }
    h2 {
        font-size: 26px;
        margin: 7px 0 4px 0;
    }
    h3 {
        margin: 8px 0 8px 0;
    }
    h4 {
        font-size: 14px;
        margin: 8px 0 8px 0;
    }
    .cross
    {
        position: absolute;
        top: 5px;
        right: 17px;
        color: gray;
        font-size: 25px;
        background-color: black;
        border: 0 solid;
        cursor:pointer;
    }
</style>


<div class="popup">
    <div class="cross" on:click={close}>x</div>
    {#if $races.length === 0}
        Loading...
    {:else}
        <div class="round">Round {$races[activeRaceValue].round}</div>
        <h1>{$races[activeRaceValue].raceName}</h1>
        <h3>{$races[activeRaceValue].Circuit.circuitName}</h3>
        <h4>{$races[activeRaceValue].Circuit.Location.locality} - {$races[activeRaceValue].Circuit.Location.country}</h4>
        <h2 class="date">{$races[activeRaceValue].date.slice(8, 10)} {getMonthFromNumber(parseInt($races[activeRaceValue].date.slice(5, 7)))}</h2>
    {/if}
</div>