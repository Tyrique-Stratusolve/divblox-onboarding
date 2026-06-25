/**
 * Adds a new task to the list.
 */
export function addTask(tasks, title, desc) {
  if (!title.trim()) return tasks;
  return [...tasks, { title: title.trim(), description: desc.trim(), done: false }];
}

/**
 * Toggles the done state of a task at the given index.
 */
export function toggleTask(tasks, index) {
  return tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task);
}

/**
 * Updates the title and description of a task at the given index.
 */
export function editTask(tasks, index, title, desc) {
  return tasks.map((task, i) => i === index ? { ...task, title: title.trim(), description: desc.trim() } : task);
}

/**
 * Removes the task at the given index.
 */
export function deleteTask(tasks, index) {
  return tasks.filter((_, i) => i !== index);
}

/**
 * Removes all tasks that are marked as done.
 */
export function clearCompleted(tasks) {
  return tasks.filter(task => !task.done);
}