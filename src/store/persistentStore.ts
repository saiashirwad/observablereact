import { Effect, pipe } from "effect"
import { Observable } from "./observable"

export class PersistentObservable<T> extends Observable<T> {
	private key: string

	constructor(initialValue: T, storageKey: string) {
		const storedValue = localStorage.getItem(storageKey)
		super(storedValue ? JSON.parse(storedValue) : initialValue)
		this.key = storageKey
	}

	set(newValue: T) {
		return pipe(
			super.set(newValue),
			Effect.map(() =>
				localStorage.setItem(this.key, JSON.stringify(newValue)),
			),
		)
	}
}

export class SettingsStore {
	theme = new PersistentObservable<"light" | "dark">("light", "app_theme")
	volume = new PersistentObservable<number>(0.5, "app_volume")
}

export const settingsStore = new SettingsStore()
