<script>
  import { onMount } from 'svelte';
  import TodoForm from './lib/TodoForm.svelte';
  import TodoList from './lib/TodoList.svelte';
  import TodoFilters from './lib/TodoFilters.svelte';

  /** @type {Array<{id: number, title: string, description: string, done: boolean}>} */
  let tasks = [];
  let nextId = 1;
  let filter = 'all';

  onMount(() => {
    const saved = localStorage.getItem('divblox-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      tasks = parsed.tasks || [];
      nextId = parsed.nextId || tasks.length + 1;
    }
  });

  $: if (typeof window !== 'undefined') {
    localStorage.setItem('divblox-todos', JSON.stringify({ tasks, nextId }));
  }

  $: filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  });

  $: activeCount = tasks.filter(task => !task.done).length;
  $: doneCount = tasks.filter(task => task.done).length;

  function addTask(title, desc) {
    if (!title.trim()) return;
    tasks = [...tasks, { id: nextId++, title: title.trim(), description: desc.trim(), done: false }];
  }

  function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
  }

  function editTask(id, title, desc) {
    tasks = tasks.map(task => task.id === id ? { ...task, title: title.trim(), description: desc.trim() } : task);
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
  }

  function clearCompleted() {
    tasks = tasks.filter(task => !task.done);
  }
</script>

<div class="todo-app">
  <header class="app-header">
    <h1>divblox</h1>
    <p class="subtitle">task manager</p>
  </header>

  <TodoForm on:add={event => addTask(event.detail.title, event.detail.description)} />

  {#if tasks.length > 0}
    <TodoFilters
      {filter}
      {activeCount}
      {doneCount}
      on:change={event => filter = event.detail}
      on:clear={clearCompleted}
    />

    <TodoList
      tasks={filteredTasks}
      on:toggle={event => toggleTask(event.detail)}
      on:edit={event => editTask(event.detail.id, event.detail.title, event.detail.description)}
      on:delete={event => deleteTask(event.detail)}
    />
  {:else}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <p class="empty-text">No tasks yet. Add one above!</p>
    </div>
  {/if}

  <footer class="app-footer">
    <p>Your tasks are saved locally</p>
  </footer>
</div>
