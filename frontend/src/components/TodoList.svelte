<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import TodoItem from './TodoItem.svelte';

  const dispatch = createEventDispatcher();

  /** @type {Array<{title: string, description: string, done: boolean}>} */
  export let tasks = [];
</script>

{#if tasks.length > 0}
  <div class="todo-list">
    {#each tasks as task, index (index)}
      <div class="item-wrap" transition:fade={{ duration: 200 }}>
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
