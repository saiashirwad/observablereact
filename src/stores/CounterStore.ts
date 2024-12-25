import { Store } from "../store/observable"
import { createStore } from "../store/createStore"

export class CounterStore extends Store {
	count = this.createObservable<number>(0)

	increment() {
		this.count.set(this.count.get() + 1)
	}

	decrement() {
		this.count.set(this.count.get() - 1)
	}
}

export const counterStore = createStore(CounterStore)
