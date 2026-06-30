<script>
  import { push } from "svelte-spa-router";
  import { login } from "../lib/api.js";
  import { currentUser } from "../lib/stores.js";

  let username = "";
  let password = "";
  let loading = false;

  async function handleSubmit() {
    if (!username || !password) return;
    loading = true;
    const result = await login(username, password);
    if (result) {
      currentUser.set(result.user);
      localStorage.setItem("divblox-user", JSON.stringify(result.user));
      push("/todos");
    }
    loading = false;
  }
</script>

<div class="w-full max-w-140` mx-auto text-left">
  <header class="text-center mb-7">
    <h1>divblox - todo</h1>
    <p class="text-[13px] uppercase tracking-[2px] text-[#94a3b8]">
      task manager
    </p>
  </header>

  <form
    class="max-w-90 mx-auto mt-15 flex flex-col gap-3"
    on:submit|preventDefault={handleSubmit}
  >
    <h2 class="text-center">Sign in</h2>

    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-(--border) rounded-lg text-[15px] font-(--sans) outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    <input
      type="password"
      placeholder="Password"
      bind:value={password}
      disabled={loading}
      class="w-full px-3.5 py-2.5 border border-(--border) rounded-lg text-[15px] font-(--sans) outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-bg)]"
    />
    <button
      type="submit"
      disabled={loading || !username || !password}
      class="w-full py-2.5 bg-(--accent) text-white border-none rounded-lg text-[15px] font-(--sans) cursor-pointer disabled:opacity-40"
    >
      {loading ? "Signing in..." : "Sign in"}
    </button>

    <p class="text-center text-sm">
      No account?
      <button
        type="button"
        class="bg-transparent border-none text-(--accent) cursor-pointer underline p-0 text-[14px]"
        on:click={() => push("/signup")}
      >
        Sign up
      </button>
    </p>
  </form>
</div>
