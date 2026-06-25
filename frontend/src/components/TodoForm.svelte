<script>
  import { createEventDispatcher } from 'svelte';
  import { Plus } from 'lucide-svelte';

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
    <Plus size={20} strokeWidth={2.5} />
  </button>
</form>
