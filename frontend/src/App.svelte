<script>
  import { onMount } from 'svelte';
  import { Toaster } from 'svelte-sonner';
  import { route, navigate } from './lib/router.js';
  import { logout } from './lib/api.js';
  import LoginPage from './pages/LoginPage.svelte';
  import SignupPage from './pages/SignupPage.svelte';
  import TodosPage from './pages/TodosPage.svelte';
  import CategoriesPage from './pages/CategoriesPage.svelte';

  export let user = null;
  export let isAdmin = false;
  export let userName = '';

  onMount(() => {
    const saved = localStorage.getItem('divblox-user');
    if (saved) {
      const parsed = JSON.parse(saved);
      user = parsed;
      isAdmin = parsed.roles?.includes('admin');
      userName = `${parsed.firstName} ${parsed.lastName}`;
      if ($route === '/login' || $route === '/signup') {
        navigate('/todos');
      }
    } else if ($route !== '/login' && $route !== '/signup') {
      navigate('/login');
    }
  });

  function onLogin(event) {
    const { user: u } = event.detail;
    user = u;
    isAdmin = u.roles?.includes('admin');
    userName = `${u.firstName} ${u.lastName}`;
    localStorage.setItem('divblox-user', JSON.stringify(u));
    navigate('/todos');
  }

  function onSignup(event) {
    const { user: u } = event.detail;
    user = u;
    isAdmin = u.roles?.includes('admin');
    userName = `${u.firstName} ${u.lastName}`;
    localStorage.setItem('divblox-user', JSON.stringify(u));
    navigate('/todos');
  }

  async function handleLogout() {
    try { await logout(); } catch (e) { /* ignore */ }
    user = null;
    isAdmin = false;
    userName = '';
    localStorage.removeItem('divblox-user');
    navigate('/login');
  }

  $: routeValue = $route;
</script>

<Toaster position="bottom-right" />

{#if !user && routeValue !== '/login' && routeValue !== '/signup'}
  <div class="todo-app">
    <header class="app-header">
      <h1>divblox - todo</h1>
      <p class="subtitle">task manager</p>
    </header>
    <p class="loading-text">Loading...</p>
  </div>
{:else if routeValue === '/login'}
  <LoginPage on:login={onLogin} />
{:else if routeValue === '/signup'}
  <SignupPage on:signup={onSignup} />
{:else}
  <div class="todo-app">
    <header class="app-header">
      <h1>divblox - todo</h1>
      <p class="subtitle">task manager</p>
      <div class="user-bar">
        <span>{userName}</span>
        {#if isAdmin}
          <button class="link-btn" on:click={() => navigate(routeValue === '/categories' ? '/todos' : '/categories')}>
            {routeValue === '/categories' ? 'Back to tasks' : 'Manage categories'}
          </button>
        {/if}
        <button class="link-btn" on:click={handleLogout}>Sign out</button>
      </div>
    </header>

    {#if routeValue === '/categories'}
      <CategoriesPage />
    {:else}
      <TodosPage />
    {/if}
  </div>
{/if}

<style>
  .user-bar { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 8px; font-size: 13px; }
  .link-btn { background: none; border: none; color: var(--accent); cursor: pointer; font: inherit; padding: 0; text-decoration: underline; }
  .loading-text { text-align: center; padding: 48px; color: var(--text-muted, #94a3b8); }
</style>
