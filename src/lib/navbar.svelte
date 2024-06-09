<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';

	$: console.log(base);
	$: currentPage = `${base}${$page.route.id}`;
	$: console.log('Current Page is:', currentPage);
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
				</svg>
			</div>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
				<li><a href="{base}/about" class="btn mb-2">About</a></li>
				<li><a href="{base}/expertise" class="btn mb-2">Expertise</a></li>
				<li><a href="{base}/contact" class="btn mb-2">Contact</a></li>
			</ul>
		</div>

		<a href="{base}/" class="btn btn-ghost text-xl transition-container text-center min-w-32">
			{#if currentPage === base+'/'}
				<span transition:fade>Nikhil MS</span>
			{:else}
				<span transition:fade>Home</span>
			{/if}
		</a>

	</div>
	<div class="navbar-end hidden lg:flex">
		<ul class="menu menu-horizontal px-1">

			<li><a href="{base}/about" class="btn mr-2">About</a></li>
			<li><a href="{base}/expertise" class="btn mr-2">Expertise</a></li>
			<li><a href="{base}/contact" class="btn mr-2">Contact</a></li>
		</ul>
	</div>
</div>

<style>
    .navbar {
        padding: 20px;
    }

    .transition-container {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
    }

    .transition-container > * {
        grid-row: 1;
        grid-column: 1;
    }
</style>