<script>
  import { createEventDispatcher } from 'svelte';
  import { signup } from '../lib/api.js';
  import { toast } from 'svelte-sonner';
  import { navigate } from '../lib/router.js';

  const dispatch = createEventDispatcher();

  let firstName = '';
  let lastName = '';
  let username = '';
  let password = '';
  let loading = false;

  async function handleSubmit() {
    if (!firstName || !lastName || !username || !password) return;
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    loading = true;
    try {
      const result = await signup(firstName, lastName, username, password);
      dispatch('signup', result);
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    }
    loading = false;
  }
</script>

<div class="todo-app">
  <header class="app-header text-center mb-7">
    <h1>divblox - todo</h1>
    <p class="subtitle">task manager</p>
  </header>

  <form class="auth-form" on:submit|preventDefault={handleSubmit}>
    <h2>Create account</h2>

    <input
      type="text"
      placeholder="First name"
      bind:value={firstName}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[15px] font-[var(--sans)]"
    />
    <input
      type="text"
      placeholder="Last name"
      bind:value={lastName}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[15px] font-[var(--sans)]"
    />
    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[15px] font-[var(--sans)]"
    />
    <input
      type="password"
      placeholder="Password (min 6 chars)"
      bind:value={password}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-lg text-[15px] font-[var(--sans)]"
    />
    <button
      type="submit"
      disabled={loading || !firstName || !lastName || !username || !password}
      class="w-full py-2.5 bg-[var(--accent)] text-white border-none rounded-lg text-[15px] font-[var(--sans)] cursor-pointer disabled:opacity-40"
    >
      {loading ? 'Creating...' : 'Sign up'}
    </button>

    <p class="text-center text-sm">
      Already have an account?
      <button type="button" class="link-btn" on:click={() => navigate('/login')}>Sign in</button>
    </p>
  </form>
</div>

<style>
  .auth-form { max-width: 360px; margin: 60px auto; display: flex; flex-direction: column; gap: 12px; }
  .auth-form h2 { text-align: center; }
  .link-btn { background: none; border: none; color: var(--accent); cursor: pointer; font: inherit; padding: 0; text-decoration: underline; }
  .text-center { text-align: center; }
  .mb-7 { margin-bottom: 28px; }
  .text-sm { font-size: 14px; }
</style>
