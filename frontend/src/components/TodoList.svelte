<script>
  import { createEventDispatcher } from 'svelte';
  import TodoItem from './TodoItem.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Array<{title: string, description: string, done: boolean}>} */
  export let tasks = [];
</script>

{#if tasks.length > 0}
  <div class="todo-list">
    {#each tasks as task}
      <div>
        <TodoItem
          {task}
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
