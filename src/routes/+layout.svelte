<script lang="ts">
	import '../app.css';
	import { authStore } from '$lib/auth-store';
	import { onMount } from 'svelte';

	onMount(() => {
		authStore.initializeFromStorage();
	});
</script>

<div class="min-h-screen bg-background">
	<slot />
</div>
