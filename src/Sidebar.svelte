<script>
    import {library} from './markers.js';

    console.log(library)

</script>

<style>
    .white {
        color: white;
        margin: 20px;
    }
    .component {
        min-width: 240px;
        max-width: 240px;
        position: relative;
        height: 100%;
        background-color: black;
    }
    .logo {
        /*margin-left: 20px;*/
        transform-origin: 0 0;
        margin: 30px 25px;
        transform: translateX(0) translateY(0) scale(1.6)
    }
</style>

<div class="component">
    <div class="logo">{@html library}</div>
    <h1 class="white">
        BONJOUR
    </h1>
</div>