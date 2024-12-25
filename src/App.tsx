import { useState } from "react"
import { createStore } from "./store/createStore"
import { useObservable } from "./store/useObservable"
import { TodoStore } from "./stores/TodoStore"

const todoStore = createStore(TodoStore)

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
						todoStore.addTodo(newTodo)
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
							onChange={() => todoStore.toggleTodo(todo.id)}
						/>
						{todo.text}
					</li>
				))}
			</ul>
		</div>
	)
}

function App() {
	return (
		<div>
			<TodoList />
		</div>
	)
}

export default App
