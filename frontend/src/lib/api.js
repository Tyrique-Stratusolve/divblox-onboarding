import { toast } from 'svelte-sonner';

const BASE = '/api';

function onSessionExpired() {
  localStorage.removeItem('divblox-user');
  window.location.hash = '#/login';
}

async function request(endpoint, options = {}) {
  const { silent, successMessage, ...fetchOptions } = options;

  const response = await fetch(`${BASE}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...fetchOptions,
  });

  if (response.status === 401) {
    onSessionExpired();
    return undefined;
  }

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    if (!silent) {
      toast.error(data.error || 'Request failed');
    }
    return undefined;
  }

  if (successMessage) {
    toast.success(successMessage);
  }

  return data;
}

export function signup(firstName, lastName, username, password) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, username, password }),
  });
}

export function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export function fetchMe() {
  return request('/auth/me', { silent: true });
}

export function fetchTasks(categoryId = null) {
  const query = categoryId ? `?category_id=${categoryId}` : '';
  return request(`/tasks${query}`);
}

export function createTask(title, description, categoryId) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, category_id: categoryId || null }),
    successMessage: 'Task created',
  });
}

export function updateTask(id, fields) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
    successMessage: 'Task updated',
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE', successMessage: 'Task deleted' });
}

export function fetchCategories() {
  return request('/categories');
}

export function createCategory(name, color) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify({ name, color }),
    successMessage: 'Category created',
  });
}

export function updateCategory(id, name, color) {
  return request(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name, color }),
    successMessage: 'Category updated',
  });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE', successMessage: 'Category deleted' });
}
