<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let filter = 'all';
  export let activeCount = 0;
  export let doneCount = 0;
  export let categories = [];
  export let categoryFilter = null;

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

  {#if categories.length > 0}
    <select class="cat-select" on:change={event => dispatch('categoryFilter', event.target.value || null)}>
      <option value="">All categories</option>
      {#each categories as category}
        <option value={category.id} selected={categoryFilter === category.id}>{category.name}</option>
      {/each}
    </select>
  {/if}

  {#if doneCount > 0}
    <button class="clear-btn" on:click={() => dispatch('clear')}>
      Clear completed
    </button>
  {/if}
</div>

<style>
  .filters { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 12px; gap: 8px; flex-wrap: wrap; }
  .count { font-size: 13px; color: var(--text); }
  .filter-btns { display: flex; gap: 4px; }
  .filter-btn { font-family: var(--sans); font-size: 13px; padding: 6px 12px; border: 1px solid transparent; border-radius: 6px; background: transparent; cursor: pointer; transition: all 0.15s; color: var(--text); }
  .filter-btn:hover { background: var(--code-bg); }
  .filter-btn.active { border-color: var(--accent); background: var(--accent-bg); font-weight: 500; }
  .cat-select { font-family: var(--sans); font-size: 13px; padding: 5px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); cursor: pointer; }
  .clear-btn { font-family: var(--sans); font-size: 13px; padding: 6px 12px; border: none; border-radius: 6px; background: transparent; cursor: pointer; color: var(--text); }
  .clear-btn:hover { background: rgba(239, 68, 68, 0.1); }
</style>
