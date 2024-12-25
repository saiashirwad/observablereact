import { Effect, pipe } from "effect"
import { useEffect, useState } from "react"
import type { IObservable } from "./observable"

export function useObservable<T>(observable: IObservable<T>) {
	const [value, setValue] = useState<T>()

	useEffect(() => {
		const getValue = pipe(observable.get(), Effect.map(setValue))

		const subscription = pipe(
			observable.subscribe(() => Effect.runSync(getValue)),
			Effect.map((unsubscribe) => {
				Effect.runSync(getValue)
				return unsubscribe
			}),
		)

		return () => {
			const unsubscribe = Effect.runSync(subscription)
			unsubscribe()
		}
	}, [observable])

	return value
}
