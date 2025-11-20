<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/auth-store';
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import TaskList from '$lib/components/task-list.svelte';
	import TaskForm from '$lib/components/task-form.svelte';

	let user = $state(null);
	let tasks = $state([]);
	let loading = $state(true);
	let showForm = $state(false);
	let searchQuery = $state('');
	let token = $state('');

	const filteredTasks = $derived(tasks.filter(task =>
		task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		task.description?.toLowerCase().includes(searchQuery.toLowerCase())
	));

	onMount(async () => {
		token = localStorage.getItem('access_token');
		if (!token) {
			goto('/login');
			return;
		}

		await loadUserProfile();
		await loadTasks();
	});

	async function loadUserProfile() {
		const response = await apiCall('/api/profile', { token });
		if (response.data) {
			user = response.data;
			authStore.setUser(response.data, token);
		} else {
			authStore.clearAuth();
			goto('/login');
		}
	}

	async function loadTasks() {
		const response = await apiCall('/api/tasks', { token });
		if (response.data) {
			tasks = response.data;
		}
		loading = false;
	}

	function handleTaskAdded() {
		showForm = false;
		loadTasks();
	}

	function handleTaskUpdated() {
		loadTasks();
	}

	function handleTaskDeleted() {
		loadTasks();
	}

	async function handleLogout() {
		authStore.clearAuth();
		goto('/login');
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="bg-card border-b border-border sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">Task Dashboard</h1>
				{#if user}
					<p class="text-sm text-muted-foreground">Welcome, {user.username}</p>
				{/if}
			</div>
			<Button onclick={handleLogout} variant="outline">Logout</Button>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-6xl mx-auto px-4 py-8">
		<!-- Profile Card -->
		{#if user}
			<Card class="mb-8">
				<div class="p-6">
					<h2 class="text-xl font-bold mb-4">Your Profile</h2>
					<div class="grid md:grid-cols-3 gap-4">
						<div>
							<p class="text-sm text-muted-foreground">Email</p>
							<p class="font-medium">{user.email}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Username</p>
							<p class="font-medium">{user.username}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Tasks Created</p>
							<p class="font-medium">{tasks.length}</p>
						</div>
					</div>
				</div>
			</Card>
		{/if}

		<!-- Tasks Section -->
		<div class="space-y-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold">My Tasks</h2>
					<p class="text-muted-foreground">Manage and track your tasks</p>
				</div>
				<Button onclick={() => showForm = !showForm} class="bg-primary text-primary-foreground">
					{showForm ? 'Cancel' : '+ Add Task'}
				</Button>
			</div>

			<!-- Task Form -->
			{#if showForm}
				<TaskForm onTaskAdded={handleTaskAdded} {token} />
			{/if}

			<!-- Search Bar -->
			<div class="flex gap-4">
				<Input
					type="text"
					placeholder="Search tasks..."
					bind:value={searchQuery}
					class="flex-1"
				/>
			</div>

			<!-- Tasks List -->
			{#if loading}
				<div class="text-center py-12">
					<p class="text-muted-foreground">Loading tasks...</p>
				</div>
			{:else if filteredTasks.length === 0}
				<div class="text-center py-12">
					<p class="text-muted-foreground">No tasks yet. Create one to get started!</p>
				</div>
			{:else}
				<TaskList
					{filteredTasks}
					{token}
					onTaskUpdated={handleTaskUpdated}
					onTaskDeleted={handleTaskDeleted}
				/>
			{/if}
		</div>
	</main>
</div>
