<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let filter = 'all';
  export let activeCount = 0;
  export let doneCount = 0;

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];
</script>

<div class="filters">
  <span class="count">{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>

  <div class="filter-btns">
    {#each filterOptions as filterOption}
      <button
        class="filter-btn"
        class:active={filter === filterOption.key}
        on:click={() => dispatch('change', filterOption.key)}
      >
        {filterOption.label}
      </button>
    {/each}
  </div>

  {#if doneCount > 0}
    <button class="clear-btn" on:click={() => dispatch('clear')}>
      Clear completed
    </button>
  {:else}
    <span></span>
  {/if}
</div>
