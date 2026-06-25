<script>
  import TodoForm from './components/TodoForm.svelte';
  import TodoList from './components/TodoList.svelte';
  import TodoFilters from './components/TodoFilters.svelte';

  /** @type {Array<{title: string, description: string, done: boolean}>} */
  let tasks = [];
  let filter = 'all';

  $: filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  });

  $: activeCount = tasks.filter(task => !task.done).length;
  $: doneCount = tasks.filter(task => task.done).length;

  function addTask(title, desc) {
    if (!title.trim()) return;
    tasks = [...tasks, { title: title.trim(), description: desc.trim(), done: false }];
  }

  function toggleTask(targetTask) {
    tasks = tasks.map(task => task === targetTask ? { ...task, done: !task.done } : task);
  }

  function editTask(targetTask, title, desc) {
    tasks = tasks.map(
      task => task === targetTask
        ? { ...task, title: title.trim(), description: desc.trim() }
        : task
    );
  }

  function deleteTask(targetTask) {
    tasks = tasks.filter(task => task !== targetTask);
  }

  function clearCompleted() {
    tasks = tasks.filter(task => !task.done);
  }
</script>

<div class="todo-app">
  <header class="app-header">
    <h1>divblox - todo</h1>
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
      on:edit={event => editTask(event.detail.task, event.detail.title, event.detail.description)}
      on:delete={event => deleteTask(event.detail)}
    />
  {:else}
    <div class="empty-state">
      <p class="empty-text">No tasks yet. Add one above!</p>
    </div>
  {/if}
</div>
