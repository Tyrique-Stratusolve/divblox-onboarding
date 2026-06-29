<script>
  import { onMount } from 'svelte';
  import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../lib/api.js';
  import { withErrorToast } from '../lib/utils.js';

  let categories = [];
  let newName = '';
  let newColor = '#6366f1';
  let editingId = null;
  let editName = '';
  let editColor = '';

  onMount(async () => {
    const result = await withErrorToast(fetchCategories(), 'Failed to load categories');
    if (result) categories = result;
  });

  function startEdit(category) {
    editingId = category.id;
    editName = category.name;
    editColor = category.color;
  }

  function cancelEdit() {
    editingId = null;
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    const cat = await withErrorToast(createCategory(newName, newColor), 'Failed to create category');
    if (cat) {
      categories = [...categories, cat];
      newName = '';
      newColor = '#6366f1';
    }
  }

  async function handleUpdate() {
    if (!editName.trim()) return;
    const cat = await withErrorToast(
      updateCategory(editingId, editName, editColor),
      'Failed to update category'
    );
    if (cat) {
      categories = categories.map(c => c.id === cat.id ? cat : c);
      editingId = null;
    }
  }

  async function handleDelete(categoryId) {
    if (!confirm('Delete this category?')) return;
    await withErrorToast(deleteCategory(categoryId), 'Failed to delete category');
    categories = categories.filter(c => c.id !== categoryId);
  }
</script>

<div class="cat-manager">
  <h2>Manage Categories</h2>

  <div class="cat-form">
    <input
      type="text"
      placeholder="Category name"
      bind:value={newName}
      class="cat-name-input"
    />
    <input type="color" bind:value={newColor} class="cat-color-input" />
    <button on:click={handleCreate} disabled={!newName.trim()} class="cat-add-btn">Add</button>
  </div>

  {#if categories.length > 0}
    <div class="cat-list">
      {#each categories as category (category.id)}
        <div class="cat-row">
          {#if editingId === category.id}
            <input type="text" bind:value={editName} class="cat-name-input" />
            <input type="color" bind:value={editColor} class="cat-color-input" />
            <button on:click={handleUpdate} class="cat-save-btn">Save</button>
            <button class="cat-cancel-btn" on:click={cancelEdit}>Cancel</button>
          {:else}
            <span class="badge" style="background-color: {category.color}80; color: white;">
              <span class="truncate">{category.name}</span>
            </span>
            <button on:click={() => startEdit(category)} class="cat-edit-btn">Edit</button>
            <button class="cat-delete-btn" on:click={() => handleDelete(category.id)}>Delete</button>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p class="empty-text">No categories yet.</p>
  {/if}
</div>

<style>
  .cat-manager { margin-bottom: 24px; }
  .cat-manager h2 { font-size: 18px; margin-bottom: 12px; text-align: center; }
  .cat-form { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; justify-content: center; }
  .cat-name-input { font-family: var(--sans); font-size: 14px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; }
  .cat-color-input { width: 40px; height: 36px; border: 1px solid var(--border); border-radius: 6px; padding: 2px; cursor: pointer; }
  .cat-add-btn, .cat-save-btn { padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 14px; }
  .cat-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cat-list { display: flex; flex-direction: column; gap: 8px; }
  .cat-row { display: flex; gap: 8px; align-items: center; justify-content: center; }
  .cat-edit-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 13px; background: var(--accent-bg); color: var(--accent); }
  .cat-delete-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 13px; background: rgba(239,68,68,0.1); color: #ef4444; }
  .cat-cancel-btn { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-family: var(--sans); font-size: 13px; background: transparent; }
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 10px; border-radius: 10px; max-width: 150px; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .empty-text { text-align: center; font-size: 14px; color: var(--text); padding: 24px; }
</style>
