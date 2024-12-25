import { Observable } from "../store/observable"

type Todo = {
	id: string
	completed: boolean
}

export class TodoStore {
	todos = new Observable<Todo[]>([])

	addTodo(todo: Todo) {
		this.todos.set([...this.todos.get(), todo])
	}

	removeTodo(todo: Todo) {
		this.todos.set(this.todos.get().filter((t) => t.id !== todo.id))
	}

	clearTodos() {
		this.todos.set([])
	}

	toggleTodo(todo: Todo) {
		this.todos.set(
			this.todos.get().map((t) => {
				if (t.id === todo.id) {
					return { ...t, completed: !t.completed }
				}
				return t
			}),
		)
	}
}
