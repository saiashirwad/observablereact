import { useState } from "react"
import { createStore } from "./store/createStore"
import { useObservable } from "./store/useObservable"
import { CounterStore } from "./stores/CounterStore"
import { SettingsStore } from "./stores/SettingsStore"
import { TodoStore } from "./stores/TodoStore"
import { Effect } from "effect"

const counterStore = createStore(CounterStore)

const settingsStore = createStore(SettingsStore)

const todoStore = createStore(TodoStore)

function Settings() {
	const theme = useObservable(settingsStore.theme)

	return (
		<div>
			<div>Theme: {theme}</div>
			<button onClick={() => Effect.runSync(settingsStore.theme.set("light"))}>
				Light
			</button>
			<button onClick={() => Effect.runSync(settingsStore.theme.set("dark"))}>
				Dark
			</button>
		</div>
	)
}

function TodoList() {
	const [newTodo, setNewTodo] = useState("")
	const todos = useObservable(todoStore.todos)

	return (
		<div>
			<div>Total: {todos?.length ?? 0}</div>
			<div>Completed: {todos?.filter((t) => t.completed).length ?? 0}</div>
			<div>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
				<button
					onClick={() => {
						Effect.runSync(todoStore.addTodo({ id: newTodo, completed: false }))
						setNewTodo("")
					}}
				>
					Add
				</button>
			</div>
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id}>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => Effect.runSync(todoStore.toggleTodo(todo.id))}
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
			<button onClick={() => Effect.runSync(counterStore.increment())}>
				+
			</button>
			<button onClick={() => Effect.runSync(counterStore.decrement())}>
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
