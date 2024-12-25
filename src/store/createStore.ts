import { Constructor } from "./observable"

export function createStore<T>(StoreClass: Constructor<T>): T {
	let store: T

	if (import.meta.hot) {
		const hot = import.meta.hot
		const storeId = StoreClass.name

		if (!hot.data[storeId]) {
			hot.data[storeId] = new StoreClass()
		}

		store = hot.data[storeId]

		hot.dispose(() => {
			hot.data[storeId] = store
		})
	} else {
		store = new StoreClass()
	}

	return store
}
