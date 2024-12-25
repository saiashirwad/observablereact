import { Effect } from "effect"

export type Constructor<T> = new (...args: any[]) => T

export type Listener = () => void

export interface IObservable<T> {
	get(): Effect.Effect<T, never, never>
	set(value: T): Effect.Effect<void, never, never>
	subscribe(listener: Listener): Effect.Effect<() => void, never, never>
}

export class Observable<T> implements IObservable<T> {
	private value: T
	private listeners = new Set<Listener>()

	constructor(initialValue: T) {
		this.value = initialValue
	}

	get(): Effect.Effect<T, never, never> {
		return Effect.sync(() => this.value)
	}

	set(newValue: T): Effect.Effect<void, never, never> {
		return Effect.sync(() => {
			if (this.value !== newValue) {
				this.value = newValue
				this.notifyListeners()
			}
		})
	}

	subscribe(listener: Listener): Effect.Effect<() => void, never, never> {
		return Effect.sync(() => {
			this.listeners.add(listener)
			return () => {
				this.listeners.delete(listener)
			}
		})
	}

	protected notifyListeners(): Effect.Effect<void, never, never> {
		return Effect.sync(() => {
			this.listeners.forEach((listener) => listener())
		})
	}
}

export class Store {
	protected createObservable<T>(initialValue: T): IObservable<T> {
		return new Observable<T>(initialValue)
	}
}
