<script>
	import {eye, lines, clouds, map, initialView, initialZoom} from '../store'

	const clickEye = () => $eye = !$eye;
	const clickLines = () => $lines = !$lines;
	const clickClouds = () => $clouds = !$clouds;
	const clickReset = () => $map.setView($initialView, $initialZoom, { animate: true })
</script>

<style>
	.selected {
		background-color: #DCC !important;
	}
	.not-selected{
		background-color: rgba(221, 204, 204, 0.4);
	}
	button {
		width: 2rem;
		height: 2rem;
		border: 0;
		background-color: transparent;
		transition-property: background-color, background-opacity;
		transition-duration: 250ms;
		border-radius: 0.375rem;
	}
	.single-click:hover {
		background-color: lightgray;
	}
	.toolbar-container {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 1000;
	}
</style>

<!-- Icons from heroicons.dev -->
<div class="toolbar-container">
	<button type="button" class="single-click not-selected" on:click={clickReset} title="Reset View">
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
	</button>

	<button type="button" on:click={clickEye} class:selected={$eye} class="single-click not-selected" title="Show Markers">
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="{$eye ? 2 : 1}" viewBox="0 0 24 24" stroke="currentColor">
			<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
		</svg>
	</button>

	<button type="button" on:click={clickLines} class:selected={$lines} class="single-click not-selected" title="Show Lines">
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="{$lines ? 2 : 1}" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
	</button>

	<button type="button" on:click={clickClouds} class:selected={$clouds} class="single-click not-selected" title="Show Clouds">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
			 aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink">
			<title>Rain</title>
			<desc>A solid styled icon from Orion Icon Library.</desc>
			<path data-name="layer2"
				  d="M49 12h-.5a17 17 0 0 0-32.3 4.4A11 11 0 1 0 13 38h36a13 13 0 0 0 0-26z"
				  fill="#202020"></path>
			<path data-name="layer1" d="M47 42a2 2 0 0 0-2 2v16a2 2 0 1 0 4 0V44a2 2 0 0 0-2-2zm-10 0a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V44a2 2 0 0 0-2-2zm-10 0a2 2 0 0 0-2 2v16a2 2 0 1 0 4 0V44a2 2 0 0 0-2-2zm-10 0a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V44a2 2 0 0 0-2-2z"
				  fill="#202020"></path>
		</svg>
	</button>
</div>