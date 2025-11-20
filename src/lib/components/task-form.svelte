<script lang="ts">
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';

	let { token = '', onTaskAdded } = $props();

	let title = $state('');
	let description = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit() {
		if (!title.trim()) {
			error = 'Task title is required';
			return;
		}

		loading = true;
		error = '';

		const response = await apiCall('/tasks', {
			method: 'POST',
			body: JSON.stringify({
				title: title.trim(),
				description: description.trim() || null,
			}),
			token,
		});

		if (response.error) {
			error = response.error;
			loading = false;
			return;
		}

		title = '';
		description = '';
		loading = false;
		onTaskAdded?.();
	}
</script>

<Card class="mb-6">
	<div class="p-6">
		<h3 class="text-lg font-bold mb-4">Create New Task</h3>

		{#if error}
			<div class="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>
		{/if}

		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
			<div>
				<label for="title" class="block text-sm font-medium mb-2">Task Title</label>
				<Input
					id="title"
					type="text"
					bind:value={title}
					placeholder="What needs to be done?"
					disabled={loading}
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium mb-2">Description (Optional)</label>
				<textarea
					id="description"
					bind:value={description}
					placeholder="Add more details..."
					disabled={loading}
					class="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
					rows="4"
				></textarea>
			</div>

			<div class="flex gap-3">
				<Button type="submit" disabled={loading} class="flex-1">
					{loading ? 'Creating...' : 'Create Task'}
				</Button>
			</div>
		</form>
	</div>
</Card>
