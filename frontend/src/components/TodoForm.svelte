<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let categories = [];

  let title = '';
  let description = '';
  let selectedCategoryId = null;

  function handleSubmit() {
    if (!title.trim()) return;
    dispatch('add', { title, description, category_id: selectedCategoryId });
    title = '';
    description = '';
    selectedCategoryId = null;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<form
  class="flex gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-2 mb-4 shadow-[var(--shadow)]"
  on:submit|preventDefault={handleSubmit}
>
  <div class="flex-1 flex flex-col gap-1.5">
    <input
      type="text"
      placeholder="What needs to be done?"
      bind:value={title}
      on:keydown={handleKeydown}
      class="font-[var(--sans)] text-[15px] py-2.5 px-3.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    <input
      type="text"
      placeholder="Add a description (optional)"
      bind:value={description}
      on:keydown={handleKeydown}
      class="font-[var(--sans)] text-[13px] py-2 px-3.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    {#if categories.length > 0}
      <select
        bind:value={selectedCategoryId}
        class="font-[var(--sans)] text-[13px] py-1.5 px-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] cursor-pointer outline-none w-fit"
      >
        <option value={null}>No category</option>
        {#each categories as category (category.id)}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    {/if}
  </div>
  <button
    type="submit"
    disabled={!title.trim()}
    class="flex items-center justify-center w-11 min-h-[44px] self-center border-none rounded-lg bg-[var(--accent)] text-white cursor-pointer shrink-0 hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
</form>
