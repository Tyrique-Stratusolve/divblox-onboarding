<script>
  import { onMount } from 'svelte';
  import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../lib/api.js';

  let categories = [];
  let newName = '';
  let newColor = '#6366f1';
  let editingId = null;
  let editName = '';
  let editColor = '';

  onMount(async () => {
    const result = await fetchCategories();
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
    const cat = await createCategory(newName, newColor);
    if (cat) {
      categories = [...categories, cat];
      newName = '';
      newColor = '#6366f1';
    }
  }

  async function handleUpdate() {
    if (!editName.trim()) return;
    const cat = await updateCategory(editingId, editName, editColor);
    if (cat) {
      categories = categories.map(c => c.id === cat.id ? cat : c);
      editingId = null;
    }
  }

  async function handleDelete(categoryId) {
    if (!confirm('Delete this category?')) return;
    await deleteCategory(categoryId);
    categories = categories.filter(c => c.id !== categoryId);
  }
</script>

<div class="mb-6">
  <h2 class="text-lg mb-3 text-center">Manage Categories</h2>

  <div class="flex gap-2 mb-4 items-center justify-center">
    <input
      type="text"
      placeholder="Category name"
      bind:value={newName}
      class="font-(--sans) text-sm py-2 px-3 border border-(--border) rounded-md"
    />
    <input type="color" bind:value={newColor} class="w-10 h-9 border border-(--border) rounded-md p-0.5 cursor-pointer" />
    <button
      on:click={handleCreate}
      disabled={!newName.trim()}
      class="py-2 px-4 bg-(--accent) text-white border-none rounded-md cursor-pointer font-(--sans) text-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {#if categories.length > 0}
    <div class="flex flex-col gap-2">
      {#each categories as category (category.id)}
        <div class="flex gap-2 items-center justify-center">
          {#if editingId === category.id}
            <input type="text" bind:value={editName} class="font-(--sans) text-sm py-2 px-3 border border-(--border) rounded-md" />
            <input type="color" bind:value={editColor} class="w-10 h-9 border border-(--border) rounded-md p-0.5 cursor-pointer" />
            <button
              on:click={handleUpdate}
              class="py-2 px-4 bg-(--accent) text-white border-none rounded-md cursor-pointer font-(--sans) text-sm"
            >
              Save
            </button>
            <button
              class="py-1.5 px-3 border-none rounded-md cursor-pointer font-(--sans) text-[13px] bg-transparent"
              on:click={cancelEdit}
            >
              Cancel
            </button>
          {:else}
            <span
              class="inline-flex items-center gap-1 text-[11px] py-0.75 px-2.5 rounded-[10px] max-w-37.5 text-white"
              style="background-color: {category.color}80"
            >
              <span class="overflow-hidden text-ellipsis whitespace-nowrap">{category.name}</span>
            </span>
            <button
              on:click={() => startEdit(category)}
              class="py-1.5 px-3 border-none rounded-md cursor-pointer font-(--sans) text-[13px] bg-(--accent-bg) text-(--accent)"
            >
              Edit
            </button>
            <button
              class="py-1.5 px-3 border-none rounded-md cursor-pointer font-(--sans) text-[13px] bg-[rgba(239,68,68,0.1)] text-[#ef4444]"
              on:click={() => handleDelete(category.id)}
            >
              Delete
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-center text-sm text-(--text) py-6">No categories yet.</p>
  {/if}
</div>
