<script>
  import { createEventDispatcher, tick } from 'svelte';
  import { Pencil, Trash2, Check } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let task;

  let editing = false;
  let editTitle = '';
  let editDesc = '';
  let editInput;

  async function startEdit() {
    editTitle = task.title;
    editDesc = task.description;
    editing = true;

    await tick();
    editInput.focus();
  }

  function saveEdit() {
    if (!editTitle.trim()) return;
    dispatch('edit', { task, title: editTitle, description: editDesc });
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
    on:click={() => dispatch('toggle', task)}
  >
    {#if task.done}
      <Check size={16} strokeWidth={3} />
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
      <button class="icon-btn edit" on:click={startEdit}>
        <Pencil size={16} strokeWidth={2} />
      </button>
      <button class="icon-btn delete" on:click={() => dispatch('delete', task)}>
        <Trash2 size={16} strokeWidth={2} />
      </button>
    </div>
  {/if}
</div>