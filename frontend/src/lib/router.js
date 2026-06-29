import { writable } from 'svelte/store';

function currentHash() {
  return window.location.hash.slice(1) || '/todos';
}

export const route = writable(currentHash());

window.addEventListener('hashchange', () => {
  route.set(currentHash());
});

export function navigate(path) {
  window.location.hash = '#' + path;
}
