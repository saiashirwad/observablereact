import { PersistentObservable } from "../store/persistentStore"

export class SettingsStore {
	theme = new PersistentObservable<"light" | "dark">("light", "app_theme")
	volume = new PersistentObservable<number>(0.5, "app_volume")
}
