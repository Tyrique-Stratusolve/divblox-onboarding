<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let categories = [];

  let title = '';
  let description = '';
  let selectedCategoryIds = [];
  let dropdownOpen = false;

  function toggleCategory(categoryId) {
    if (selectedCategoryIds.includes(categoryId)) {
      selectedCategoryIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
      selectedCategoryIds = [...selectedCategoryIds, categoryId];
    }
  }

  function removeCategory(categoryId) {
    selectedCategoryIds = selectedCategoryIds.filter(id => id !== categoryId);
  }

  $: selectedCategories = categories.filter(c => selectedCategoryIds.includes(c.id));

  function handleSubmit() {
    if (!title.trim()) return;
    dispatch('add', { title, description, category_ids: selectedCategoryIds });
    title = '';
    description = '';
    selectedCategoryIds = [];
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<form class="todo-form" on:submit|preventDefault={handleSubmit}>
  <div class="input-group">
    <input
      type="text"
      class="title-input"
      placeholder="What needs to be done?"
      bind:value={title}
      on:keydown={handleKeydown}
    />
    <input
      type="text"
      class="desc-input"
      placeholder="Add a description (optional)"
      bind:value={description}
      on:keydown={handleKeydown}
    />
    <div class="tags-row">
      {#if selectedCategories.length > 0}
        <div class="tags-wrap">
          {#each selectedCategories as category}
            <span
              class="badge"
              style="background-color: {category.colour}80; border: 0px; color: white;"
            >
              <span class="truncate">{category.name}</span>
              <button type="button" class="badge-remove" on:click={() => removeCategory(category.id)}>&times;</button>
            </span>
          {/each}
        </div>
      {/if}

      {#if categories.length > 0}
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
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    on:change={() => toggleCategory(category.id)}
                  />
                  <span class="tag-dot" style="background: {category.colour}"></span>
                  {category.name}
                </label>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <button type="submit" class="add-btn" disabled={!title.trim()}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
</form>

<style>
  .todo-form { display: flex; gap: 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 8px; margin-bottom: 16px; box-shadow: var(--shadow); }
  .input-group { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .title-input, .desc-input { font-family: var(--sans); font-size: 15px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; outline: none; transition: border-color 0.15s; }
  .title-input:focus, .desc-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
  .desc-input { font-size: 13px; padding: 8px 14px; }
  .add-btn { display: flex; align-items: center; justify-content: center; width: 44px; min-height: 44px; align-self: center; border: none; border-radius: 8px; background: var(--accent); color: #fff; cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
  .add-btn:hover:not(:disabled) { opacity: 0.9; }
  .add-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .tags-row { display: flex; flex-direction: column; gap: 6px; }
  .tags-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
  .badge { display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 8px; border-radius: 10px; max-width: 120px; cursor: default; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .badge-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: 0.7; }
  .badge-remove:hover { opacity: 1; }

  .tags-dropdown-wrap { position: relative; }
  .tags-btn { display: inline-flex; align-items: center; gap: 6px; font-family: var(--sans); font-size: 12px; padding: 5px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); cursor: pointer; transition: all 0.15s; }
  .tags-btn:hover { border-color: var(--accent); }
  .tags-dropdown { position: absolute; top: 100%; left: 0; margin-top: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow); z-index: 10; min-width: 200px; max-height: 200px; overflow-y: auto; }
  .tag-option { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; font-size: 13px; font-family: var(--sans); transition: background 0.1s; }
  .tag-option:hover { background: var(--accent-bg); }
  .tag-option input { accent-color: var(--accent); }
  .tag-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
</style>
