import { Context, Effect, Queue, Ref } from "effect"
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"

type Ctx = {
	run: <E, A>(effect: Effect.Effect<A, E, never>) => Promise<A>
	// fiber: Fiber.RuntimeFiber<unknown, never>
}

export interface StateService {
	readonly state: Ref.Ref<Record<PropertyKey, unknown>>
	readonly stateQueue: Queue.Queue<
		Effect.Effect<
			Record<PropertyKey, unknown>,
			never,
			Record<PropertyKey, unknown>
		>
	>
}

const StateService = Context.GenericTag<StateService>("@store/StateService")

export class StateServiceImpl implements StateService {
	constructor(
		readonly state: Ref.Ref<Record<PropertyKey, unknown>>,
		readonly stateQueue: Queue.Queue<
			Effect.Effect<
				Record<PropertyKey, unknown>,
				never,
				Record<PropertyKey, unknown>
			>
		>,
	) {}
}

export const StateRef = Context.GenericTag<StateService>("@store/StateService")

const makeStateService = Effect.gen(function* () {
	const state = yield* Ref.make<Record<PropertyKey, unknown>>({})
	const stateQueue =
		yield* Queue.unbounded<
			Effect.Effect<
				Record<PropertyKey, unknown>,
				never,
				Record<PropertyKey, unknown>
			>
		>()

	return new StateServiceImpl(state, stateQueue)
})

const stateManager = Effect.gen(function* () {
	const service = yield* StateRef
	while (true) {
		const updateEffect = yield* service.stateQueue.take
		const currentState = yield* Ref.get(service.state)
		const newState = yield* updateEffect
		yield* Ref.set(service.state, newState)
		yield* Effect.sync(() => {
			console.log("State updated:", newState)
		})
	}
}).pipe(Effect.catchAllCause(() => Effect.succeed(undefined)))

const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: PropsWithChildren) {
	const [ctx, setCtx] = useState<Ctx | null>(null)

	useEffect(() => {
		const setup = async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const stateService = yield* makeStateService
					return { service: stateService }
				}),
			)

			setCtx({
				run: (effect) =>
					Effect.runPromise(
						Effect.provideService(effect, StateRef, result.service),
					),
			})
		}
		setup()

		return () => {
			// if (ctx?.fiber) {
			// 	Effect.runPromise(Fiber.interrupt(ctx.fiber))
			// }
		}
	}, [])

	if (!ctx) return null
	return <StoreContext.Provider value={ctx}>{children}</StoreContext.Provider>
}

export function useStore() {
	const ctx = useContext(StoreContext)
	if (!ctx) throw new Error("useStore must be used within StoreProvider")
	return ctx
}

// Helper to create a state update effect
export const updateState = <K extends PropertyKey, V>(key: K, value: V) =>
	Effect.gen(function* (_) {
		const service = yield* _(StateRef)
		const updateEffect = Effect.gen(function* (_) {
			const currentState = yield* _(Ref.get(service.state))
			return { ...currentState, [key]: value }
		})
		yield* _(service.stateQueue.offer(updateEffect))
	})
