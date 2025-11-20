<script lang="ts">
	import { apiCall } from '$lib/api-client';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import TaskItem from './task-item.svelte';

	interface Task {
		id: number;
		title: string;
		description: string | null;
		completed: number;
		user_id: number;
		created_at: string;
		updated_at: string;
	}

	let { filteredTasks = [], token = '', onTaskUpdated, onTaskDeleted } = $props();

	const completedCount = filteredTasks.filter(task => task.completed === 1).length;
	const totalCount = filteredTasks.length;
	const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
</script>

<div class="space-y-4">
	<!-- Progress Bar -->
	<Card class="p-4">
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium">Progress: {completedCount} of {totalCount} completed</span>
			<span class="text-sm font-bold">{completionPercentage}%</span>
		</div>
		<div class="w-full bg-secondary rounded-full h-2">
			<div
				class="bg-primary h-2 rounded-full transition-all duration-300"
				style="width: {completionPercentage}%"
			></div>
		</div>
	</Card>

	<!-- Task Items -->
	{#each filteredTasks as task (task.id)}
		<TaskItem {task} {token} onTaskUpdated={onTaskUpdated} onTaskDeleted={onTaskDeleted} />
	{/each}
</div>
