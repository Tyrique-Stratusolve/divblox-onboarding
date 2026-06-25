<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let title = '';
  let description = '';

  function handleSubmit() {
    if (!title.trim()) return;
    dispatch('add', { title, description });
    title = '';
    description = '';
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
  </div>
  <button type="submit" class="add-btn" disabled={!title.trim()}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
</form>
