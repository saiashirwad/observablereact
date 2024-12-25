export type Constructor<T> = new (...args: any[]) => T

export type Listener = () => void

export interface IObservable<T> {
	get(): T
	set(value: T): void
	subscribe(listener: Listener): () => void
}

export class Observable<T> implements IObservable<T> {
	private value: T
	private listeners = new Set<Listener>()

	constructor(initialValue: T) {
		this.value = initialValue
	}

	get() {
		return this.value
	}

	set(newValue: T) {
		if (this.value !== newValue) {
			this.value = newValue
			this.notifyListeners()
		}
	}

	subscribe(listener: Listener) {
		this.listeners.add(listener)
		return () => {
			this.listeners.delete(listener)
		}
	}

	protected notifyListeners() {
		this.listeners.forEach((listener) => listener())
	}
}

export class Store {
	protected createObservable<T>(initialValue: T): IObservable<T> {
		return new Observable<T>(initialValue)
	}
}
