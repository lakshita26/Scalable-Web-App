<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/auth-store';
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card } from '$lib/components/ui/card';

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let fullName = $state('');
	let error = $state('');
	let loading = $state(false);

	// Password visibility and validation
	let showPassword = false;

	const pwdLengthOk = () => password.length >= 8 && password.length <= 12
	const hasUpper = () => /[A-Z]/.test(password)
	const hasLower = () => /[a-z]/.test(password)
	const hasDigit = () => /[0-9]/.test(password)
	const hasSpecial = () => /[^A-Za-z0-9]/.test(password)
	function passwordValid() {
		return pwdLengthOk() && hasUpper() && hasLower() && hasDigit() && hasSpecial()
	}

	async function handleSignup() {
		if (!email || !username || !password) {
			error = 'Please fill in all fields';
			return;
		}

		if (!passwordValid()) {
			error = 'Password does not meet requirements';
			loading = false;
			return;
		}

		loading = true;
		error = '';

		const response = await apiCall('/signup', {
			method: 'POST',
			body: JSON.stringify({
				email,
				username,
				password,
				full_name: fullName || null,
			}),
		});
		if (response.error) {
			error = response.error;
			loading = false;
			return;
		}

		// We already receive the created user and token from the signup API.
		// Use that directly to set auth state instead of fetching the profile again.
		if (response.data && (response.data as any).user && (response.data as any).access_token) {
			authStore.setUser((response.data as any).user, (response.data as any).access_token)
			goto('/dashboard')
		} else {
			error = 'Failed to sign up'
		}

		loading = false;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
	<div class="w-full max-w-md px-6 py-20">
		<Card class="w-full rounded-xl shadow-xl">
			<div class="p-8">
				<h1 class="text-2xl font-bold mb-6">Sign Up</h1>

				{#if error}
					<div class="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
				{/if}

				<form onsubmit={(e) => { e.preventDefault(); handleSignup(); }} class="space-y-4">
					<div>
						<label for="fullName" class="block text-sm font-medium mb-2">Full Name (Optional)</label>
						<Input id="fullName" type="text" bind:value={fullName} placeholder="Your full name" />
					</div>

					<div>
						<label for="email" class="block text-sm font-medium mb-2">Email</label>
						<Input id="email" type="email" bind:value={email} placeholder="Enter your email" />
					</div>

					<div>
						<label for="username" class="block text-sm font-medium mb-2">Username</label>
						<Input id="username" type="text" bind:value={username} placeholder="Choose a username" />
					</div>

					<div>
							<label for="password" class="block text-sm font-medium mb-2">Password</label>
							<div class="relative">
								<Input id="password" type={showPassword ? 'text' : 'password'} bind:value={password} placeholder="Create a password" />
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

							<!-- Password requirements -->
							<div class="mt-2 text-xs space-y-1">
								<div class="flex items-center text-sm">
									<span class="mr-2">{pwdLengthOk() ? '✅' : '⬜'}</span>
									<span>Length 8–12 characters</span>
								</div>
								<div class="flex items-center text-sm">
									<span class="mr-2">{hasUpper() ? '✅' : '⬜'}</span>
									<span>At least one uppercase letter</span>
								</div>
								<div class="flex items-center text-sm">
									<span class="mr-2">{hasLower() ? '✅' : '⬜'}</span>
									<span>At least one lowercase letter</span>
								</div>
								<div class="flex items-center text-sm">
									<span class="mr-2">{hasDigit() ? '✅' : '⬜'}</span>
									<span>At least one digit</span>
								</div>
								<div class="flex items-center text-sm">
									<span class="mr-2">{hasSpecial() ? '✅' : '⬜'}</span>
									<span>At least one special character</span>
								</div>
							</div>
						</div>

					<Button onclick={handleSignup} disabled={loading || !passwordValid()} class="w-full">
						{loading ? 'Creating account...' : 'Sign Up'}
					</Button>
				</form>

				<p class="mt-4 text-center text-sm text-muted-foreground">
					Already have an account? <a href="/login" class="text-primary font-medium hover:underline">Login</a>
				</p>
			</div>
		</Card>
	</div>
</div>
