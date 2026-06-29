<script>
  import { onMount } from 'svelte';
  import { login, signup, logout, fetchTasks, createTask, updateTask, deleteTask, fetchCategories, createCategory, updateCategory, deleteCategory } from './lib/api.js';
  import LoginForm from './components/LoginForm.svelte';
  import SignupForm from './components/SignupForm.svelte';
  import TodoForm from './components/TodoForm.svelte';
  import TodoList from './components/TodoList.svelte';
  import TodoFilters from './components/TodoFilters.svelte';
  import CategoryManager from './components/CategoryManager.svelte';

  let page = 'todos';
  let user = null;
  let tasks = [];
  let categories = [];
  let filter = 'all';
  let categoryFilter = null;
  let loading = true;

  onMount(() => {
    const saved = localStorage.getItem('divblox-user');
    if (saved) {
      user = JSON.parse(saved);
      page = 'todos';
      loadData();
    } else {
      page = 'login';
      loading = false;
    }
  });

  $: isAdmin = user?.roles?.includes('admin');
  $: filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  }).filter(task => {
    if (!categoryFilter) return true;
    return task.categories?.some(c => c.id === categoryFilter);
  });

  $: activeCount = tasks.filter(t => !t.done).length;
  $: doneCount = tasks.filter(t => t.done).length;

  async function loadData() {
    loading = true;
    try {
      const [fetchedTasks, fetchedCategories] = await Promise.all([
        fetchTasks(),
        fetchCategories(),
      ]);
      tasks = fetchedTasks;
      categories = fetchedCategories;
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    loading = false;
  }

  async function handleLogin(event) {
    try {
      const result = await login(event.detail.username, event.detail.password);
      user = result.user;
      localStorage.setItem('divblox-user', JSON.stringify(result.user));
      page = 'todos';
      loadData();
    } catch (error) {
      loginForm?.setError(error.message);
    }
  }

  async function handleSignup(event) {
    try {
      const result = await signup(event.detail.firstName, event.detail.lastName, event.detail.username, event.detail.password);
      user = result.user;
      localStorage.setItem('divblox-user', JSON.stringify(result.user));
      page = 'todos';
      loadData();
    } catch (error) {
      signupForm?.setError(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (e) { /* ignore */ }
    user = null;
    tasks = [];
    categories = [];
    localStorage.removeItem('divblox-user');
    page = 'login';
  }

  let loginForm;
  let signupForm;

  async function handleAddTask(event) {
    try {
      const task = await createTask(event.detail.title, event.detail.description, event.detail.category_ids || []);
      tasks = [task, ...tasks];
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }

  async function handleToggleTask(event) {
    try {
      const updated = await updateTask(event.detail.id, { done: event.detail.done ? 0 : 1 });
      tasks = tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  }

  async function handleEditTask(event) {
    try {
      const fields = { title: event.detail.title, description: event.detail.description };
      if (event.detail.category_ids !== undefined) {
        fields.category_ids = event.detail.category_ids;
      }
      const updated = await updateTask(event.detail.id, fields);
      tasks = tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  }

  async function handleDeleteTask(event) {
    try {
      await deleteTask(event.detail.id);
      tasks = tasks.filter(t => t.id !== event.detail.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  async function handleClearCompleted() {
    const completed = tasks.filter(t => t.done);
    await Promise.all(completed.map(t => deleteTask(t.id)));
    tasks = tasks.filter(t => !t.done);
  }

  async function handleCategoryCreated(event) {
    try {
      const cat = await createCategory(event.detail.name, event.detail.colour);
      categories = [...categories, cat];
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  }

  async function handleCategoryUpdated(event) {
    try {
      const cat = await updateCategory(event.detail.id, event.detail.name, event.detail.colour);
      categories = categories.map(c => c.id === cat.id ? cat : c);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  }

  async function handleCategoryDeleted(event) {
    try {
      await deleteCategory(event.detail.id);
      categories = categories.filter(c => c.id !== event.detail.id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }
</script>

{#if page === 'login'}
  <div class="todo-app">
    <header class="app-header">
      <h1>divblox - todo</h1>
      <p class="subtitle">task manager</p>
    </header>

    <LoginForm
      on:login={handleLogin}
      on:switch={() => page = 'signup'}
      bind:this={loginForm}
    />
  </div>
{:else if page === 'signup'}
  <div class="todo-app">
    <header class="app-header">
      <h1>divblox - todo</h1>
      <p class="subtitle">task manager</p>
    </header>

    <SignupForm
      on:signup={handleSignup}
      on:switch={() => page = 'login'}
      bind:this={signupForm}
    />
  </div>
{:else}
  <div class="todo-app">
    <header class="app-header">
      <h1>divblox - todo</h1>
      <p class="subtitle">task manager</p>
      <div class="user-bar">
        <span>{user?.firstName} {user?.lastName}</span>
        {#if isAdmin}
          <button class="link-btn" on:click={() => page = page === 'categories' ? 'todos' : 'categories'}>
            {page === 'categories' ? 'Back to tasks' : 'Manage categories'}
          </button>
        {/if}
        <button class="link-btn" on:click={handleLogout}>Sign out</button>
      </div>
    </header>

    {#if page === 'categories'}
      <CategoryManager
        {categories}
        on:create={handleCategoryCreated}
        on:update={handleCategoryUpdated}
        on:delete={handleCategoryDeleted}
      />
    {:else}
      {#if loading}
        <p class="loading-text">Loading...</p>
      {:else}
        <TodoForm
          {categories}
          on:add={handleAddTask}
        />

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
    {/if}
  </div>
{/if}

<style>
  .user-bar { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 8px; font-size: 13px; }
  .link-btn { background: none; border: none; color: var(--accent); cursor: pointer; font: inherit; padding: 0; text-decoration: underline; }
  .loading-text { text-align: center; padding: 48px; color: var(--text-muted, #94a3b8); }
</style>
