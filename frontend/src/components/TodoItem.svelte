<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  const dispatch = createEventDispatcher();

  export let task;
  export let categories = [];

  let editing = false;
  let editTitle = '';
  let editDesc = '';
  let editCategoryIds = [];
  let editInput;
  let justStartedEdit = false;
  let dropdownOpen = false;

  function startEdit() {
    editTitle = task.title;
    editDesc = task.description;
    editCategoryIds = (task.categories || []).map(c => c.id);
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
    dispatch('edit', { id: task.id, title: editTitle, description: editDesc, category_ids: editCategoryIds });
    editing = false;
  }

  function cancelEdit() {
    editing = false;
  }

  function toggleCategory(categoryId) {
    if (editCategoryIds.includes(categoryId)) {
      editCategoryIds = editCategoryIds.filter(id => id !== categoryId);
    } else {
      editCategoryIds = [...editCategoryIds, categoryId];
    }
  }

  function removeCategory(categoryId) {
    editCategoryIds = editCategoryIds.filter(id => id !== categoryId);
  }

  $: editCategories = categories.filter(c => editCategoryIds.includes(c.id));

  function handleEditKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    }
    if (event.key === 'Escape') cancelEdit();
  }
</script>

<div class="todo-item" class:done={task.done}>
  <button
    class="check-btn"
    class:checked={task.done}
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
    <div class="edit-area">
      <input type="text" class="edit-input" bind:value={editTitle} on:keydown={handleEditKeydown} bind:this={editInput} />
      <input type="text" class="edit-desc" bind:value={editDesc} on:keydown={handleEditKeydown} placeholder="Description" />

      {#if categories.length > 0}
        <div class="tags-row">
          {#if editCategories.length > 0}
            <div class="tags-wrap">
              {#each editCategories as category}
                <span class="badge" style="background-color: {category.colour}80; border: 0px; color: white;">
                  <span class="truncate">{category.name}</span>
                  <button type="button" class="badge-remove" on:click={() => removeCategory(category.id)}>&times;</button>
                </span>
              {/each}
            </div>
          {/if}

          <div class="tags-dropdown-wrap">
            <button type="button" class="tags-btn" on:click={() => dropdownOpen = !dropdownOpen} >
              <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
              </svg>
              Add Tags
            </button>

            {#if dropdownOpen}
              <div class="tags-dropdown">
                {#each categories as category}
                  <label class="tag-option">
                    <input type="checkbox" checked={editCategoryIds.includes(category.id)} on:change={() => toggleCategory(category.id)} />
                    <span class="tag-dot" style="background: {category.colour}"></span>
                    {category.name}
                  </label>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <div class="edit-actions">
        <button class="save-btn" on:click={saveEdit} disabled={!editTitle.trim()}>Save</button>
        <button class="cancel-btn" on:click={cancelEdit}>Cancel</button>
      </div>
    </div>
  {:else}
    <div class="task-body">
      <span class="task-title">{task.title}</span>
      {#if task.description}
        <span class="task-desc">{task.description}</span>
      {/if}
      {#if task.categories && task.categories.length > 0}
        <div class="tags-wrap">
          {#each task.categories as category}
            <span class="badge" style="background-color: {category.colour}80; border: 0px; color: white;">
              <span class="truncate">{category.name}</span>
            </span>
          {/each}
        </div>
      {/if}
    </div>
    <div class="item-actions">
      <button class="icon-btn edit" on:click={startEdit} aria-label="Edit task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="icon-btn delete" on:click={() => dispatch('delete', { id: task.id })} aria-label="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  {/if}
</div>

<style>
  .todo-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; transition: border-color 0.15s, box-shadow 0.15s; }
  .todo-item:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
  .todo-item.done { opacity: 0.65; }
  .todo-item.done .task-title { text-decoration: line-through; }
  .check-btn { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0; border: 2px solid var(--border); border-radius: 50%; background: transparent; cursor: pointer; margin-top: 1px; transition: all 0.15s; color: #fff; padding: 0; }
  .check-btn:hover { border-color: var(--accent); background: var(--accent-bg); }
  .check-btn.checked { background: var(--accent); border-color: var(--accent); }
  .task-body { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .task-title { font-size: 15px; font-weight: 500; word-break: break-word; }
  .task-desc { font-size: 13px; word-break: break-word; }
  .item-actions { display: flex; gap: 4px; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; }
  .todo-item:hover .item-actions { opacity: 1; }
  .icon-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 6px; background: transparent; cursor: pointer; transition: all 0.15s; padding: 0; color: var(--text); }
  .icon-btn.edit:hover { background: var(--accent-bg); }
  .icon-btn.delete:hover { background: rgba(239, 68, 68, 0.1); }
  .edit-area { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .edit-input, .edit-desc { font-family: var(--sans); font-size: 14px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; outline: none; transition: border-color 0.15s; }
  .edit-input:focus, .edit-desc:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
  .edit-desc { font-size: 13px; }
  .edit-actions { display: flex; gap: 6px; }
  .save-btn, .cancel-btn { font-family: var(--sans); font-size: 13px; padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; }
  .save-btn { background: var(--accent); color: #fff; }
  .save-btn:hover:not(:disabled) { opacity: 0.9; }
  .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cancel-btn { background: transparent; }
  .cancel-btn:hover { background: var(--code-bg); }

  .tags-row { display: flex; flex-direction: column; gap: 6px; }
  .tags-wrap { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
  .badge { display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 8px; border-radius: 10px; max-width: 120px; cursor: default; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .badge-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: 0.7; }
  .badge-remove:hover { opacity: 1; }

  .tags-dropdown-wrap { position: relative; display: inline-block; }
  .tags-btn { display: inline-flex; align-items: center; gap: 6px; font-family: var(--sans); font-size: 12px; padding: 5px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); cursor: pointer; transition: all 0.15s; }
  .tags-btn:hover { border-color: var(--accent); }
  .tags-dropdown { position: absolute; top: 100%; left: 0; margin-top: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow); z-index: 10; min-width: 200px; max-height: 200px; overflow-y: auto; }
  .tag-option { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; font-size: 13px; font-family: var(--sans); transition: background 0.1s; }
  .tag-option:hover { background: var(--accent-bg); }
  .tag-option input { accent-color: var(--accent); }
  .tag-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
</style>
