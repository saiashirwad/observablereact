import { useState, useEffect } from "react"
import { IObservable } from "./observable"

export function useObservable<T>(observable: IObservable<T>) {
	const [value, setValue] = useState(observable.get())

	useEffect(() => {
		return observable.subscribe(() => setValue(observable.get()))
	}, [observable])

	return value
}

export function useSelector<T, R>(
	observable: IObservable<T>,
	selector: (value: T) => R,
) {
	const value = useObservable(observable)
	return selector(value)
}
