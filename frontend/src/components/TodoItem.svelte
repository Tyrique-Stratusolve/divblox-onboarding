<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  const dispatch = createEventDispatcher();

  export let task;
  export let categories = [];

  let editing = false;
  let editTitle = '';
  let editDesc = '';
  let editCategoryId = null;
  let editInput;
  let justStartedEdit = false;

  function startEdit() {
    editTitle = task.title;
    editDesc = task.description || '';
    editCategoryId = task.category?.id || null;
    editing = true;
    justStartedEdit = true;
  }

  afterUpdate(() => {
    if (justStartedEdit && editInput) {
      editInput.focus();
      justStartedEdit = false;
    }
  });

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
  class="flex items-start gap-3 p-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] hover:shadow-[0_0_0_3px_var(--accent-bg)] transition-all group"
  class:opacity-65={task.done}
>
  <button
    class="flex items-center justify-center w-6 h-6 shrink-0 border-2 border-[var(--border)] rounded-full bg-transparent cursor-pointer mt-0.5 p-0 text-white hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all"
    class:bg-[var(--accent)]={task.done}
    class:border-[var(--accent)]={task.done}
    on:click={() => dispatch('toggle', { id: task.id, done: task.done })}
    aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
  >
    {#if task.done}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    {/if}
  </button>

  {#if editing}
    <div class="flex-1 flex flex-col gap-1.5">
      <input
        type="text"
        class="font-[var(--sans)] text-sm py-2 px-3 border border-[var(--border)] rounded-md outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-bg)]"
        bind:value={editTitle}
        on:keydown={handleEditKeydown}
        bind:this={editInput}
      />
      <input
        type="text"
        class="font-[var(--sans)] text-[13px] py-2 px-3 border border-[var(--border)] rounded-md outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-bg)]"
        bind:value={editDesc}
        on:keydown={handleEditKeydown}
        placeholder="Description"
      />

      {#if categories.length > 0}
        <select
          bind:value={editCategoryId}
          class="font-[var(--sans)] text-[12px] py-1 px-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] cursor-pointer outline-none w-fit"
        >
          <option value={null}>No category</option>
          {#each categories as category (category.id)}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      {/if}

      <div class="flex gap-1.5">
        <button
          class="font-[var(--sans)] text-[13px] py-1.5 px-3.5 border-none rounded-md cursor-pointer bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          on:click={saveEdit}
          disabled={!editTitle.trim()}
        >
          Save
        </button>
        <button
          class="font-[var(--sans)] text-[13px] py-1.5 px-3.5 border-none rounded-md cursor-pointer bg-transparent hover:bg-[var(--code-bg)]"
          on:click={cancelEdit}
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <div class="flex-1 flex flex-col gap-1 min-w-0">
      <span
        class="text-[15px] font-medium break-words"
        class:line-through={task.done}
      >
        {task.title}
      </span>
      {#if task.description}
        <span class="text-[13px] break-words">{task.description}</span>
      {/if}
      {#if task.category}
        <span
          class="inline-flex items-center gap-1 text-[11px] py-[3px] px-2 rounded-[10px] text-white max-w-[150px]"
          style="background-color: {task.category.color}80"
        >
          <span class="overflow-hidden text-ellipsis whitespace-nowrap">{task.category.name}</span>
        </span>
      {/if}
    </div>
    <div class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <button
        class="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent cursor-pointer p-0 text-[var(--text)] hover:bg-[var(--accent-bg)]"
        on:click={startEdit}
        aria-label="Edit task"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button
        class="flex items-center justify-center w-8 h-8 border-none rounded-md bg-transparent cursor-pointer p-0 text-[var(--text)] hover:bg-[rgba(239,68,68,0.1)]"
        on:click={() => dispatch('delete', { id: task.id })}
        aria-label="Delete task"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  {/if}
</div>


