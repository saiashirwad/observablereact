import { createId } from "@paralleldrive/cuid2"
import { PersistentObservable } from "../store/persistentStore"

type Todo = {
	id: string
	text: string
	completed: boolean
}

export class TodoStore {
	todos = new PersistentObservable<Todo[]>([], "todos")

	addTodo(text: string) {
		this.todos.set([
			...this.todos.get(),
			{ id: createId(), text, completed: false },
		])
	}

	removeTodo(id: string) {
		this.todos.set(this.todos.get().filter((t) => t.id !== id))
	}

	clearTodos() {
		this.todos.set([])
	}

	toggleTodo(id: string) {
		this.todos.set(
			this.todos.get().map((t) => {
				if (t.id === id) {
					return { ...t, completed: !t.completed }
				}
				return t
			}),
		)
	}
}
