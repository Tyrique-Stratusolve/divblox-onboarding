<script>
  import { onMount } from 'svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import { Toaster } from 'svelte-sonner';
  import { currentUser, isAdmin, fullName } from './lib/stores.js';
  import { logout, fetchMe } from './lib/api.js';
  import LoginPage from './pages/LoginPage.svelte';
  import SignupPage from './pages/SignupPage.svelte';
  import TodosPage from './pages/TodosPage.svelte';
  import CategoriesPage from './pages/CategoriesPage.svelte';

  let authChecked = false;

  onMount(async () => {
    const userData = await fetchMe();
    if (userData) {
      currentUser.set(userData);
      localStorage.setItem('divblox-user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('divblox-user');
    }
    authChecked = true;
  });

  async function handleLogout() {
    await logout();
    currentUser.set(null);
    localStorage.removeItem('divblox-user');
    push('/login');
  }

  const unauthenticatedRoutes = {
    '/login': LoginPage,
    '/signup': SignupPage,
    '*': LoginPage,
  };

  $: authenticatedRoutes = {
    '/todos': TodosPage,
    ...($isAdmin ? { '/categories': CategoriesPage } : {}),
    '*': TodosPage,
  };
</script>

<Toaster position="bottom-right" />

{#if !authChecked}
  <div class="w-full max-w-140 mx-auto text-left">
    <header class="text-center mb-7">
      <h1>divblox - todo</h1>
      <p class="text-[13px] uppercase tracking-[2px] text-[#94a3b8]">task manager</p>
    </header>
    <p class="text-center py-12 text-(--text)">Loading...</p>
  </div>
{:else if $currentUser}
  <div class="w-full max-w-140 mx-auto text-left">
    <header class="text-center mb-7">
      <h1>divblox - todo</h1>
      <p class="text-[13px] uppercase tracking-[2px] text-[#94a3b8]">task manager</p>
      <div class="flex items-center justify-center gap-4 mt-2 text-[13px]">
        <span>{$fullName}</span>
        {#if $isAdmin}
          <button
            class="bg-transparent border-none text-(--accent) cursor-pointer underline p-0 text-[13px]"
            on:click={() => push($location === '/categories' ? '/todos' : '/categories')}
          >
            {$location === '/categories' ? 'Back to tasks' : 'Manage categories'}
          </button>
        {/if}
        <button
          class="bg-transparent border-none text-(--accent) cursor-pointer underline p-0 text-[13px]"
          on:click={handleLogout}
        >
          Sign out
        </button>
      </div>
    </header>

    <Router routes={authenticatedRoutes} />
  </div>
{:else}
  <div class="w-full max-w-140 mx-auto text-left">
    <Router routes={unauthenticatedRoutes} />
  </div>
{/if}
