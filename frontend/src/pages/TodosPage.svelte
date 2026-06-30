<script>
  import { onMount } from 'svelte';
  import { fetchTasks, createTask, updateTask, deleteTask, fetchCategories } from '../lib/api.js';
  import TodoForm from '../components/TodoForm.svelte';
  import TodoList from '../components/TodoList.svelte';
  import TodoFilters from '../components/TodoFilters.svelte';

  let tasks = [];
  let categories = [];
  let filter = 'all';
  let categoryFilter = null;
  let loading = true;

  onMount(loadData);

  $: filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  }).filter(task => {
    if (!categoryFilter) return true;
    return task.category?.id === categoryFilter;
  });

  $: activeCount = tasks.filter(task => !task.done).length;
  $: doneCount = tasks.filter(task => task.done).length;

  async function loadData() {
    loading = true;
    const result = await Promise.all([fetchTasks(), fetchCategories()]);
    if (result) { [tasks, categories] = result; }
    loading = false;
  }

  async function handleAddTask(event) {
    const task = await createTask(event.detail.title, event.detail.description, event.detail.category_id);
    if (task) tasks = [task, ...tasks];
  }

  async function handleToggleTask(event) {
    const updated = await updateTask(event.detail.id, { done: !event.detail.done });
    if (updated) tasks = tasks.map(task => task.id === updated.id ? updated : task);
  }

  async function handleEditTask(event) {
    const fields = {};
    if (event.detail.title !== undefined) fields.title = event.detail.title;
    if (event.detail.description !== undefined) fields.description = event.detail.description;
    if (event.detail.category_id !== undefined) fields.category_id = event.detail.category_id;
    const updated = await updateTask(event.detail.id, fields);
    if (updated) tasks = tasks.map(task => task.id === updated.id ? updated : task);
  }

  async function handleDeleteTask(event) {
    await deleteTask(event.detail.id);
    tasks = tasks.filter(task => task.id !== event.detail.id);
  }

  async function handleClearCompleted() {
    const completed = tasks.filter(task => task.done);
    if (completed.length === 0) return;
    await Promise.all(completed.map(task => deleteTask(task.id)));
    tasks = tasks.filter(task => !task.done);
  }
</script>

{#if loading}
  <p class="loading-text">Loading...</p>
{:else}
  <TodoForm {categories} on:add={handleAddTask} />

  {#if tasks.length > 0}
    <TodoFilters
      {filter}
      {activeCount}
      {doneCount}
      {categories}
      {categoryFilter}
      on:change={event => filter = event.detail}
      on:clear={handleClearCompleted}
      on:categoryFilter={event => categoryFilter = event.detail}
    />
  {/if}

  <TodoList
    tasks={filteredTasks}
    {categories}
    on:toggle={handleToggleTask}
    on:edit={handleEditTask}
    on:delete={handleDeleteTask}
  />
{/if}

<style>
  .loading-text { text-align: center; padding: 48px; color: var(--text); }
</style>
