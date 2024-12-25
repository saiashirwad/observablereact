import { Effect, pipe } from "effect"
import { Store } from "../store/observable"

export class CounterStore extends Store {
	count = this.createObservable<number>(0)

	increment() {
		return pipe(
			this.count.get(),
			Effect.map((count) => count + 1),
			Effect.flatMap((newCount) => this.count.set(newCount)),
		)
	}

	decrement() {
		return pipe(
			this.count.get(),
			Effect.map((count) => count - 1),
			Effect.flatMap((newCount) => this.count.set(newCount)),
		)
	}
}
