<script>
  import { createEventDispatcher } from 'svelte';
  import TodoItem from './TodoItem.svelte';

  const dispatch = createEventDispatcher();

  export let tasks = [];
  export let categories = [];
</script>

{#if tasks.length > 0}
  <div class="todo-list">
    {#each tasks as task (task.id)}
      <div class="item-wrap">
        <TodoItem
          {task}
          {categories}
          on:toggle={event => dispatch('toggle', event.detail)}
          on:edit={event => dispatch('edit', event.detail)}
          on:delete={event => dispatch('delete', event.detail)}
        />
      </div>
    {/each}
  </div>
{:else}
  <div class="empty-filter">
    <p>No tasks match this filter.</p>
  </div>
{/if}

<style>
  .todo-list { display: flex; flex-direction: column; gap: 8px; }
  .empty-filter { text-align: center; padding: 32px; font-size: 14px; color: var(--text); }
</style>
