import { useState, useEffect } from "react"
import { IObservable } from "./observable"

export function useObservable<T>(observable: IObservable<T>) {
	const [value, setValue] = useState(observable.get())

	useEffect(() => {
		return observable.subscribe(() => setValue(observable.get()))
	}, [observable])

	return value
}
