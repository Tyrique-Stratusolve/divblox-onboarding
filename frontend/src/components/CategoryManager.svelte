<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let categories = [];

  let newName = '';
  let newColour = '#6366f1';
  let editingId = null;
  let editName = '';
  let editColour = '';

  function startEdit(category) {
    editingId = category.id;
    editName = category.name;
    editColour = category.colour;
  }

  function cancelEdit() {
    editingId = null;
  }

  function handleCreate() {
    if (!newName.trim()) return;
    dispatch('create', { name: newName, colour: newColour });
    newName = '';
    newColour = '#6366f1';
  }

  function handleUpdate() {
    if (!editName.trim()) return;
    dispatch('update', { id: editingId, name: editName, colour: editColour });
    editingId = null;
  }

  function handleDelete(categoryId) {
    if (confirm('Delete this category?')) {
      dispatch('delete', { id: categoryId });
    }
  }
</script>

<div class="cat-manager">
  <h2>Manage Categories</h2>

  <div class="cat-form">
    <input type="text" placeholder="Category name" bind:value={newName} />
    <input type="color" bind:value={newColour} />
    <button on:click={handleCreate} disabled={!newName.trim()}>Add</button>
  </div>

  <div class="cat-list">
    {#each categories as category}
      <div class="cat-row">
        {#if editingId === category.id}
          <input type="text" bind:value={editName} />
          <input type="color" bind:value={editColour} />
          <button on:click={handleUpdate}>Save</button>
          <button class="cancel" on:click={cancelEdit}>Cancel</button>
        {:else}
          <span class="badge" style="background-color: {category.colour}80; border: 0px; color: white;">
            <span class="truncate">{category.name}</span>
          </span>
          <button on:click={() => startEdit(category)}>Edit</button>
          <button class="delete" on:click={() => handleDelete(category.id)}>Delete</button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .cat-manager { margin-bottom: 24px; }
  .cat-manager h2 { font-size: 18px; margin-bottom: 12px; text-align: center; }
  .cat-form { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; justify-content: center; }
  .cat-form input[type="text"] { font-family: var(--sans); font-size: 14px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; }
  .cat-form input[type="color"] { width: 40px; height: 36px; border: 1px solid var(--border); border-radius: 6px; padding: 2px; cursor: pointer; }
  .cat-form button { padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 14px; }
  .cat-form button:disabled { opacity: 0.4; }
  .cat-list { display: flex; flex-direction: column; gap: 8px; }
  .cat-row { display: flex; gap: 8px; align-items: center; justify-content: center; }
  .cat-row input[type="text"] { font-family: var(--sans); font-size: 13px; padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; }
  .cat-row input[type="color"] { width: 36px; height: 32px; border: 1px solid var(--border); border-radius: 6px; padding: 2px; cursor: pointer; }
  .cat-row button { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 13px; background: var(--accent-bg); color: var(--accent); }
  .cat-row button.delete { background: rgba(239,68,68,0.1); color: #ef4444; }
  .cat-row button.cancel { background: transparent; }
  .badge { display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 10px; border-radius: 10px; max-width: 120px; cursor: default; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
