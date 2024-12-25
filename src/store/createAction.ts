import { Effect } from "effect"

export const createAction = <T>(
	effect: () => Effect.Effect<T, never, never>,
) => {
	return () => Effect.runSync(effect())
}
