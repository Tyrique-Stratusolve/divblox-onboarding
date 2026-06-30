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
    { key: 'completed', label: 'Completed' },
  ];
</script>

<div class="flex items-center justify-between px-1 pb-3 gap-2 flex-wrap">
  <span class="text-[13px] text-(--text)">
    {activeCount} {activeCount === 1 ? 'item' : 'items'} left
  </span>

  <div class="flex gap-1">
    {#each filterOptions as option}
      <button
        class="font-(--sans) text-[13px] py-1.5 px-3 border rounded-md bg-transparent cursor-pointer transition-all text-(--text) hover:bg-(--code-bg)"
        class:border-transparent={filter !== option.key}
        class:border-(--accent)={filter === option.key}
        class:bg-(--accent-bg)={filter === option.key}
        class:font-medium={filter === option.key}
        on:click={() => dispatch('change', option.key)}
      >
        {option.label}
      </button>
    {/each}
  </div>

  {#if categories.length > 0}
    <select
      on:change={event => dispatch('categoryFilter', event.target.value ? Number(event.target.value) : null)}
      class="font-(--sans) text-[13px] py-1.5 px-2.5 border border-(--border) rounded-md bg-(--bg) text-(--text) cursor-pointer"
    >
      <option value="">All categories</option>
      {#each categories as category (category.id)}
        <option value={category.id} selected={categoryFilter === category.id}>
          {category.name}
        </option>
      {/each}
    </select>
  {/if}

  {#if doneCount > 0}
    <button
      class="font-(--sans) text-[13px] py-1.5 px-3 border-none rounded-md bg-transparent cursor-pointer text-(--text) hover:bg-[rgba(239,68,68,0.1)]"
      on:click={() => dispatch('clear')}
    >
      Clear completed
    </button>
  {/if}
</div>
