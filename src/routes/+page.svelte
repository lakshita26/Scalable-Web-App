<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const token = localStorage.getItem('access_token');
		if (token) goto('/dashboard');
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100">
	<div class="w-full max-w-6xl px-6 py-24">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
			<!-- Decorative background shapes -->
			<svg class="pointer-events-none absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="g1" x1="0" x2="1">
						<stop offset="0%" stop-color="#0f172a" stop-opacity="1" />
						<stop offset="100%" stop-color="#111827" stop-opacity="0.9" />
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#g1)" />
				<g transform="translate(60,40)" fill="none" stroke="#0ea5a4" stroke-opacity="0.06">
					<circle cx="200" cy="50" r="200" />
					<circle cx="420" cy="180" r="300" />
				</g>
			</svg>

			<!-- Left: Minimal Hero -->
			<section class="space-y-4 relative z-10 flex flex-col justify-center py-12 md:py-20" style="padding-left:50px;">
				<h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">Task Manager</h1>
				<p class="text-lg text-gray-300 max-w-lg">Plan, focus, and ship — faster.</p>

				<div class="mt-8">
					<a href="/signup" class="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-md font-medium shadow">Get Started</a>
				</div>
			</section>

			<!-- Right: Visual CTA (image+actions) -->
			<aside class="relative z-10 flex items-center justify-center">
				<div class="w-full max-w-sm bg-white/5 backdrop-blur rounded-xl p-6 shadow-lg border border-white/5">
					<div class="mb-4 text-white">
						<h3 class="text-xl font-semibold">Welcome</h3>
						<p class="text-sm text-gray-300">Access your tasks and progress.</p>
					</div>

					<!-- Decorative illustration (SVG) -->
					<div class="mb-4">
						<svg viewBox="0 0 200 120" class="w-full h-32 rounded-md" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<linearGradient id="bg" x1="0" x2="1">
									<stop offset="0%" stop-color="#06b6d4" stop-opacity="0.9"/>
									<stop offset="100%" stop-color="#7c3aed" stop-opacity="0.9"/>
								</linearGradient>
							</defs>
							<rect width="100%" height="100%" rx="8" fill="url(#bg)" />
							<g fill="#fff" fill-opacity="0.9">
								<rect x="12" y="20" width="120" height="10" rx="3" />
								<rect x="12" y="38" width="90" height="8" rx="3" />
								<rect x="12" y="56" width="70" height="8" rx="3" />
								<circle cx="160" cy="40" r="18" />
								<circle cx="160" cy="80" r="10" />
							</g>
						</svg>
					</div>

					<div class="space-y-3">
						<a href="/login" class="block w-full text-center bg-white text-gray-900 px-4 py-3 rounded-md font-medium hover:opacity-95">Login</a>
						<a href="/signup" class="block w-full text-center border border-white/20 text-white px-4 py-3 rounded-md font-medium hover:bg-white/5">Sign Up</a>
					</div>
				</div>
			</aside>
		</div>
	</div>
</div>
