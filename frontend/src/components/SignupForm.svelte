<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let firstName = '';
  let lastName = '';
  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    if (!firstName || !lastName || !username || !password) return;
    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }
    loading = true;
    error = '';
    dispatch('signup', { firstName, lastName, username, password });
  }

  export function setError(msg) {
    error = msg;
    loading = false;
  }
</script>

<form class="auth-form" on:submit|preventDefault={handleSubmit}>
  <h2>Create account</h2>

  {#if error}
    <p class="auth-error">{error}</p>
  {/if}

  <input type="text" placeholder="First name" bind:value={firstName} disabled={loading} />
  <input type="text" placeholder="Last name" bind:value={lastName} disabled={loading} />
  <input type="text" placeholder="Username" bind:value={username} disabled={loading} />
  <input type="password" placeholder="Password (min 6 chars)" bind:value={password} disabled={loading} />
  <button type="submit" disabled={loading || !firstName || !lastName || !username || !password}>
    {loading ? 'Creating...' : 'Sign up'}
  </button>

  <p class="auth-switch">
    Already have an account?
    <button type="button" class="link-btn" on:click={() => dispatch('switch')}>Sign in</button>
  </p>
</form>

<style>
  .auth-form { max-width: 360px; margin: 60px auto; display: flex; flex-direction: column; gap: 12px; }
  .auth-form h2 { text-align: center; }
  .auth-form input { padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font: 15px var(--sans); }
  .auth-form button[type="submit"] { padding: 10px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font: 15px var(--sans); cursor: pointer; }
  .auth-form button[type="submit"]:disabled { opacity: 0.4; }
  .auth-error { color: #ef4444; font-size: 14px; text-align: center; }
  .auth-switch { text-align: center; font-size: 14px; }
  .link-btn { background: none; border: none; color: var(--accent); cursor: pointer; font: inherit; padding: 0; text-decoration: underline; }
</style>
