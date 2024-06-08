<script>
	import '../app.css';
	import Navbar from '$lib/navbar.svelte';
	import Footer from '$lib/footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Navbar />
	<div class="flex-grow">
		<slot></slot>
	</div>
	<Footer />
</div>


