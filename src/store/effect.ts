import { Effect, pipe } from "effect"
import type { IObservable } from "./observable"

export type StoreEffect<R, E, A> = Effect.Effect<R, E, A>

export const updateState = <T, A, E, R>(
	observable: IObservable<T>,
	effect: Effect.Effect<A, E, R>,
	updateFn: (current: T, result: A) => T,
) => {
	return pipe(
		effect,
		Effect.flatMap((result) =>
			pipe(
				observable.get(),
				Effect.flatMap((current) => observable.set(updateFn(current, result))),
				Effect.map(() => result),
			),
		),
	)
}
