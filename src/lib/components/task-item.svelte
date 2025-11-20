<script lang="ts">
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';

	interface Task {
		id: number;
		title: string;
		description: string | null;
		completed: number;
		user_id: number;
		created_at: string;
		updated_at: string;
	}

	let { task, token = '', onTaskUpdated, onTaskDeleted } = $props();

	let isEditing = $state(false);
	let editTitle = $state(task.title);
	let editDescription = $state(task.description || '');
	let isLoading = $state(false);

	async function toggleComplete() {
		isLoading = true;
		await apiCall(`/tasks/${task.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				completed: task.completed === 0 ? 1 : 0,
			}),
			token,
		});
		isLoading = false;
		onTaskUpdated?.();
	}

	async function saveEdit() {
		isLoading = true;
		const response = await apiCall(`/tasks/${task.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				title: editTitle,
				description: editDescription || null,
			}),
			token,
		});

		if (!response.error) {
			isEditing = false;
		}
		isLoading = false;
		onTaskUpdated?.();
	}

	async function deleteTask() {
		if (confirm('Are you sure you want to delete this task?')) {
			isLoading = true;
			await apiCall(`/tasks/${task.id}`, {
				method: 'DELETE',
				token,
			});
			isLoading = false;
			onTaskDeleted?.();
		}
	}
</script>

<Card class="p-4 {task.completed === 1 ? 'bg-secondary/30' : ''}">
	<div class="flex gap-4">
		<input
			type="checkbox"
			checked={task.completed === 1}
			onchange={toggleComplete}
			disabled={isLoading}
			class="mt-1 w-5 h-5 cursor-pointer accent-primary"
		/>

		<div class="flex-1">
			{#if isEditing}
				<div class="space-y-2">
					<Input
						type="text"
						bind:value={editTitle}
						placeholder="Task title"
						disabled={isLoading}
					/>
					<textarea
						bind:value={editDescription}
						placeholder="Description"
						disabled={isLoading}
						class="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
						rows="2"
					></textarea>
					<div class="flex gap-2">
						<Button onclick={saveEdit} disabled={isLoading} size="sm">Save</Button>
						<Button
							onclick={() => {
								isEditing = false;
								editTitle = task.title;
								editDescription = task.description || '';
							}}
							variant="outline"
							size="sm"
							disabled={isLoading}
						>
							Cancel
						</Button>
					</div>
				</div>
			{:else}
				<div>
					<h3 class="font-medium {task.completed === 1 ? 'line-through text-muted-foreground' : ''}">
						{task.title}
					</h3>
					{#if task.description}
						<p class="text-sm text-muted-foreground mt-1">{task.description}</p>
					{/if}
					<p class="text-xs text-muted-foreground mt-2">
						Created: {new Date(task.created_at).toLocaleDateString()}
					</p>
				</div>
			{/if}
		</div>

		<div class="flex gap-2">
			<Button
				onclick={() => (isEditing = !isEditing)}
				variant="outline"
				size="sm"
				disabled={isLoading}
			>
				{isEditing ? 'Cancel' : 'Edit'}
			</Button>
			<Button onclick={deleteTask} variant="destructive" size="sm" disabled={isLoading}>
				Delete
			</Button>
		</div>
	</div>
</Card>
