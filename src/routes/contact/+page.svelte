<script>
	import { fade } from 'svelte/transition';
	// import { base } from '$app/paths';
	//
	// console.log(base);

	function goToLinkedIn() {
		window.location.href = 'https://www.linkedin.com/in/nikhil-sharma-39056a237/';
	}

	function goToContactForm() {
		window.location.href = 'https://forms.gle/F48CFUMC2GgbxXGK6';
	}
</script>
<div class="p-10 md:p-32" in:fade>
	<h1 class="text-3xl md:text-5xl font-bold underline animate-fade-in">Contact Me!</h1>
	<br />
	<h2 class="text-3xl md:text-5xl font-bold animate-fade-in">You can reach me at:</h2>
	<br />
	<br />
	<div class="join">
		<button class="btn join-item" on:click={goToLinkedIn}>LinkedIn</button>
		<button class="btn join-item" on:click={goToContactForm}>Contact Form</button>
	</div>

</div>

