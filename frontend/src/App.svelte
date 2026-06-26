<script>
	import './app.css';
	import { addTask, toggleTask, editTask, deleteTask, clearCompleted } from './lib/tasks.js';
	import TodoForm from './components/TodoForm.svelte';
	import TodoList from './components/TodoList.svelte';
	import TodoFilters from './components/TodoFilters.svelte';

	/** @type {Array<{title: string, description: string, done: boolean}>} */
	let tasks = [];

	let filter = 'all';

	$: filteredTasks = tasks.filter((task) => {
		if (filter === 'active') return !task.done;
		if (filter === 'completed') return task.done;

		return true;
	});

	$: activeCount = tasks.filter((task) => !task.done).length;
	$: doneCount = tasks.filter((task) => task.done).length;

	function handleAdd(event) {
		tasks = addTask(tasks, event.detail.title, event.detail.description);
	}

	function handleToggle(event) {
		tasks = toggleTask(tasks, tasks.indexOf(event.detail));
	}

	function handleEdit(event) {
		tasks = editTask(tasks, tasks.indexOf(event.detail.task), event.detail.title, event.detail.description);
	}

	function handleDelete(event) {
		tasks = deleteTask(tasks, tasks.indexOf(event.detail));
	}

	function handleClear() {
		tasks = clearCompleted(tasks);
	}
</script>

<div class="todo-app">
	<header class="app-header">
		<h1>divblox - todo</h1>
		<p class="subtitle">task manager</p>
	</header>

	<TodoForm on:add={handleAdd} />

	<TodoFilters
		filter={filter}
		activeCount={activeCount}
		doneCount={doneCount}
		on:change={(event) => filter = event.detail}
		on:clear={handleClear}
	/>

	<TodoList
		tasks={filteredTasks}
		on:toggle={handleToggle}
		on:edit={handleEdit}
		on:delete={handleDelete}
	/>
</div>
