<script>
    import {library} from './markers.js';
    import {races} from './store.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function moveMap(race) {
        let raceToPass = race
        if(parseInt(race.round) === 2)
        {
            raceToPass.Circuit.Location.long = 39.103768;
            raceToPass.Circuit.Location.lat = 21.634993;
        }
        dispatch('passLocation', {
            text: raceToPass
        });
    }

    function getMonthFromNumber(num){
        return "JanFebMarAprMayJunJulAugSepOctNovDec".slice(num * 3 - 3, num * 3)
    }
</script>

<style>
    .sidebar {
        min-width: 300px;
        max-width: 300px;
        position: relative;
        height: 100%;
        background-color: black;
        overflow: hidden;
    }
    .panel {
        position: absolute;
        overflow-y: scroll;
        overflow-x: hidden;
        top: 0;
        bottom: 0;
        left: 0;
        right: -17px; /* Increase/Decrease this value for cross-browser compatibility */
    }
    .logo {
        /*margin-left: 20px;*/
        transform-origin: 0 0;
        margin: 40px 35px;
        transform: translateX(0) translateY(0) scale(1.9)
    }
    .races {
        margin-top: 65px;
    }
    .round {
        color: #d74040;
        font-size: 15px;
        font-weight: 500;
    }
    h1 {
        font-size: 30px;
        margin: 10px 0 4px 0;
    }
    h3 {
        margin: 8px 0 8px 0;
    }
    .white {
        color: white;
        margin: 20px;
        font-size: 12px;
    }
    .race {

    }
    .date {
        font-size: 20px;
        font-weight: 700;
    }

    .button {
        background: none;
        border: 0 solid;
        font: inherit;
        line-height: 1;
        margin: 0;
        padding: 20px 20px;
        cursor:pointer;

    }
    .button {
        transition: 0.25s;
    }


    .slide:hover,
    .slide:focus {
        box-shadow: inset 255px 0 0 0 rgba(255, 255, 255, 0.08);
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 }
    }
</style>

<div class="sidebar">
    <div class="panel">
        <div class="logo">{@html library}</div>
            <div class="races">
                <div class="white">
                    {#each $races as race}
                        <div class="slide button" on:click={() => {moveMap(race)}}>
                            <div class="round">Round {race.round}</div>
                            <h1>{race.Circuit.Location.country}</h1>
                            <h3>{race.Circuit.circuitName}</h3>
                            <div class="date">{race.date.slice(8, 10)} {getMonthFromNumber(parseInt(race.date.slice(5, 7)))}</div>
                        </div>
                        <hr class="solid">
                    {/each}
                </div>
        </div>
    </div>
</div>