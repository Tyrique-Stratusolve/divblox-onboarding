import { writable, derived } from 'svelte/store';

export const currentUser = writable(null);

export const isAdmin = derived(currentUser, ($user) =>
  $user?.roles?.includes('admin') ?? false
);

export const fullName = derived(currentUser, ($user) =>
  $user ? `${$user.firstName} ${$user.lastName}` : ''
);
