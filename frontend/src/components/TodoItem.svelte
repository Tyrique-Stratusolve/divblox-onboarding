<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { Check, Pencil, Trash2 } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let task;
  export let categories = [];

  let editing = false;
  let editTitle = '';
  let editDesc = '';
  let editCategoryId = null;
  let editInput;

  async function startEdit() {
    editTitle = task.title;
    editDesc = task.description || '';
    editCategoryId = task.category?.id || null;
    editing = true;
    await tick();
    editInput?.focus();
  }

  function saveEdit() {
    if (!editTitle.trim()) return;
    dispatch('edit', {
      id: task.id,
      title: editTitle,
      description: editDesc,
      category_id: editCategoryId,
    });
    editing = false;
  }

  function cancelEdit() {
    editing = false;
  }

  function handleEditKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    }
    if (event.key === 'Escape') cancelEdit();
  }
</script>

<div
  class="flex items-start gap-3 p-3.5 bg-(--bg) border border-(--border) rounded-lg hover:border-(--accent) hover:shadow-[0_0_0_3px_var(--accent-bg)] transition-all group"
  class:opacity-65={task.done}
>
  <button
    class="flex items-center justify-center w-6 h-6 shrink-0 border-2 border-(--border) rounded-full bg-transparent cursor-pointer mt-0.5 p-0 text-white hover:border-(--accent) hover:bg-(--accent-bg) transition-all"
    class:bg-(--accent)={task.done}
    class:border-(--accent)={task.done}
    on:click={() => dispatch('toggle', { id: task.id, done: task.done })}
  >
    {#if task.done}
      <Check size={16} strokeWidth={3} />
    {/if}
  </button>

  {#if editing}
    <div class="flex-1 flex flex-col gap-1.5">
      <input
        type="text"
        class="font-(--sans) text-sm py-2 px-3 border border-(--border) rounded-md outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
        bind:value={editTitle}
        on:keydown={handleEditKeydown}
        bind:this={editInput}
      />
      <input
        type="text"
        class="font-(--sans) text-[13px] py-2 px-3 border border-(--border) rounded-md outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
        bind:value={editDesc}
        on:keydown={handleEditKeydown}
        placeholder="Description"
      />

      {#if categories.length > 0}
        <select
          bind:value={editCategoryId}
          class="font-(--sans) text-[12px] py-1 px-2 border border-(--border) rounded-md bg-(--bg) text-(--text) cursor-pointer outline-none w-fit"
        >
          <option value={null}>No category</option>
          {#each categories as category (category.id)}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      {/if}

      <div class="flex gap-1.5">
        <button
          class="font-(--sans) text-[13px] py-1.5 px-3.5 border-none rounded-md cursor-pointer bg-(--accent) text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          on:click={saveEdit}
          disabled={!editTitle.trim()}
        >
          Save
        </button>
        <button
          class="font-(--sans) text-[13px] py-1.5 px-3.5 border-none rounded-md cursor-pointer bg-transparent hover:bg-(--code-bg)"
          on:click={cancelEdit}
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <div class="flex-1 flex flex-col gap-1 min-w-0">
      <span
        class="text-[15px] font-medium wrap-break-word"
        class:line-through={task.done}
      >
        {task.title}
      </span>
      {#if task.description}
        <span class="text-[13px] wrap-break-word">{task.description}</span>
      {/if}
      {#if task.category}
        <span
          class="inline-flex items-center gap-1 text-[11px] py-0.75 px-2 rounded-[10px] text-white max-w-37.5"
          style="background-color: {task.category.color}80"
        >
          <span class="overflow-hidden text-ellipsis whitespace-nowrap">{task.category.name}</span>
        </span>
      {/if}
    </div>
    <div class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <button
        class="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent cursor-pointer p-0 text-(--text) hover:bg-(--accent-bg)"
        on:click={startEdit}
      >
        <Pencil size={16} />
      </button>
      <button
        class="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent cursor-pointer p-0 text-(--text) hover:bg-[rgba(239,68,68,0.1)]"
        on:click={() => dispatch('delete', { id: task.id })}
      >
        <Trash2 size={16} />
      </button>
    </div>
  {/if}
</div>
