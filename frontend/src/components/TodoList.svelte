<script>
  import TodoItem from './TodoItem.svelte';

  export let tasks = [];
  export let categories = [];
</script>

{#if tasks.length > 0}
  <div class="flex flex-col gap-2">
    {#each tasks as task (task.id)}
      <TodoItem {task} {categories} on:toggle on:edit on:delete />
    {/each}
  </div>
{:else}
  <div class="text-center py-8 text-sm text-(--text)">
    <p>No tasks match this filter.</p>
  </div>
{/if}
