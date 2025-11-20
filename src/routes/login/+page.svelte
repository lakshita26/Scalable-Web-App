<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/auth-store';
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card } from '$lib/components/ui/card';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

    // Toggle password visibility on login
    let showPassword = false;

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		const response = await apiCall('/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.error) {
			error = response.error;
			loading = false;
			return;
		}

		const profileRes = await apiCall('/profile', {
			token: response.data?.access_token,
		});

		if (profileRes.data) {
			authStore.setUser(profileRes.data, response.data.access_token);
			goto('/dashboard');
		} else {
			error = 'Failed to fetch profile';
		}

		loading = false;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
	<div class="w-full max-w-md px-6 py-20">
		<Card class="w-full rounded-xl shadow-xl">
			<div class="p-8">
				<h1 class="text-2xl font-bold mb-6">Login</h1>

				{#if error}
					<div class="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
				{/if}

				<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
					<div>
						<label for="email" class="block text-sm font-medium mb-2">Email</label>
						<Input id="email" type="email" bind:value={email} placeholder="Enter your email" />
					</div>

					<div>
						<label for="password" class="block text-sm font-medium mb-2">Password</label>
						<div class="relative">
							<Input id="password" type={showPassword ? 'text' : 'password'} bind:value={password} placeholder="Enter your password" />
							<button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password visibility" onclick={() => (showPassword = !showPassword)}>
								{#if showPassword}
									<!-- eye off -->
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-3.5-10-8 1-2.5 3-4.5 5.5-5.5M6.6 6.6A9.96 9.96 0 0 1 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
								{:else}
									<!-- eye on -->
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
								{/if}
							</button>
						</div>
					</div>

					<Button type="submit" disabled={loading} class="w-full">
						{loading ? 'Logging in...' : 'Login'}
					</Button>
				</form>

				<p class="mt-4 text-center text-sm text-muted-foreground">
					Don't have an account? <a href="/signup" class="text-primary font-medium hover:underline">Sign up</a>
				</p>
			</div>
		</Card>
	</div>
</div>
