import { useState } from "react"
import { createStore } from "./store/createStore"
import { useObservable } from "./store/useObservable"
import { CounterStore } from "./stores/CounterStore"
import { SettingsStore } from "./stores/SettingsStore"
import { TodoStore } from "./stores/TodoStore"

const counterStore = createStore(CounterStore)

const settingsStore = createStore(SettingsStore)

const todoStore = createStore(TodoStore)

function Settings() {
	const theme = useObservable(settingsStore.theme)

	return (
		<div>
			<div>Theme: {theme}</div>
			<button onClick={() => settingsStore.theme.set("light")}>Light</button>
			<button onClick={() => settingsStore.theme.set("dark")}>Dark</button>
		</div>
	)
}

function TodoList() {
	const [newTodo, setNewTodo] = useState("")
	const todos = useObservable(todoStore.todos)

	return (
		<div>
			<div>Total: {todos.length}</div>
			<div>Completed: {todos.filter((t) => t.completed).length}</div>
			<div>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
				<button
					onClick={() => {
						todoStore.addTodo({ id: newTodo, completed: false })
						setNewTodo("")
					}}
				>
					Add
				</button>
			</div>
			<button onClick={() => todoStore.clearTodos()}>Clear</button>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => todoStore.toggleTodo(todo)}
						/>
						{todo.id}
					</li>
				))}
			</ul>
		</div>
	)
}

function Counter() {
	const count = useObservable(counterStore.count)

	return (
		<div>
			<p>Count: {count}</p>
			<p>Count: {count}</p>
			<button
				onClick={() => {
					counterStore.increment()
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					counterStore.decrement()
				}}
			>
				-
			</button>
		</div>
	)
}

function App() {
	return (
		<div>
			<TodoList />
			<Counter />
			<Settings />
		</div>
	)
}

export default App
