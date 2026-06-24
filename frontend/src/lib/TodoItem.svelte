<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';

  const dispatch = createEventDispatcher();

  export let task;

  let editing = false;
  let editTitle = '';
  let editDesc = '';
  let editInput;
  let justStartedEdit = false;

  function startEdit() {
    editTitle = task.title;
    editDesc = task.description;
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
    dispatch('edit', { id: task.id, title: editTitle, description: editDesc });
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

<div class="todo-item" class:done={task.done}>
  <button
    class="check-btn"
    class:checked={task.done}
    on:click={() => dispatch('toggle', task.id)}
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
      <input
        type="text"
        class="edit-input"
        bind:value={editTitle}
        on:keydown={handleEditKeydown}
        bind:this={editInput}
      />
      <input
        type="text"
        class="edit-desc"
        bind:value={editDesc}
        on:keydown={handleEditKeydown}
        placeholder="Description"
      />
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
    </div>
    <div class="item-actions">
      <button class="icon-btn edit" on:click={startEdit} aria-label="Edit task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="icon-btn delete" on:click={() => dispatch('delete', task.id)} aria-label="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  {/if}
</div>
