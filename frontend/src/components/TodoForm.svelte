<script>
  import { createEventDispatcher } from 'svelte';
  import { Plus } from 'lucide-svelte';

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
  class="flex gap-2 bg-(--bg) border border-(--border) rounded-xl p-2 mb-4 shadow-(--shadow)"
  on:submit|preventDefault={handleSubmit}
>
  <div class="flex-1 flex flex-col gap-1.5">
    <input
      type="text"
      placeholder="What needs to be done?"
      bind:value={title}
      on:keydown={handleKeydown}
      class="font-(--sans) text-[15px] py-2.5 px-3.5 border border-(--border) rounded-lg outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    <input
      type="text"
      placeholder="Add a description (optional)"
      bind:value={description}
      on:keydown={handleKeydown}
      class="font-(--sans) text-[13px] py-2 px-3.5 border border-(--border) rounded-lg outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    {#if categories.length > 0}
      <select
        bind:value={selectedCategoryId}
        class="font-(--sans) text-[13px] py-1.5 px-3 border border-(--border) rounded-lg bg-(--bg) text-(--text) cursor-pointer outline-none w-fit"
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
    class="flex items-center justify-center w-11 min-h-11 self-center border-none rounded-lg bg-(--accent) text-white cursor-pointer shrink-0 hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
  >
    <Plus size={20} strokeWidth={2.5} />
  </button>
</form>
