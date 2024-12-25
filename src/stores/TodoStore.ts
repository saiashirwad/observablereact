import { Effect } from "effect"
import { updateState } from "../store/effect"
import { Observable } from "../store/observable"

type Todo = {
	id: string
	completed: boolean
}

export class TodoStore {
	todos = new Observable<Todo[]>([])

	addTodo(todo: Todo) {
		return updateState(
			this.todos,
			Effect.try({
				try: () => todo,
				catch: (error) => ({
					type: "UpdateError",
					message: String(error),
				}),
			}),
			(todos, newTodo) => [...todos, newTodo],
		)
	}

	toggleTodo(todoId: string) {
		return updateState(
			this.todos,
			Effect.try({
				try: () => undefined,
				catch: (error) => ({
					type: "UpdateError",
					message: String(error),
				}),
			}),
			(todos) =>
				todos.map((todo) =>
					todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
				),
		)
	}
}
