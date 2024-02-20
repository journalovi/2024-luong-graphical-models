/** Check if current environment is development */
export const isDev = false
// process.env.NODE_ENV === 'development' && !process.env.GATSBY_LOCAL_SERVER

export const isDefined = <T,>(item: T): item is NonNullable<T> =>
	typeof item !== 'undefined' && item !== null

export const decimal = (number: number, decimalPlaces = 2) =>
	number.toLocaleString('en-US', { maximumFractionDigits: decimalPlaces })

export const decimalFlex = (number: number, decimalPlaces = 2) => {
	// Show more digits if fractional part begins with lots of zeros, e.g. 1.0038
	const leadingZerosMatch = number
		.toLocaleString('en-US', { maximumFractionDigits: 20 })
		.split('.')[1]
		?.match(/^0+/)
	if (leadingZerosMatch) {
		const adjustedDecimalPlaces = leadingZerosMatch[0].length + decimalPlaces
		return decimal(number, adjustedDecimalPlaces)
	}

	return decimal(number, decimalPlaces)
}

/** Check if an item is an object */
export const isObject = (item: unknown) =>
	!!item && typeof item === 'object' && !Array.isArray(item)

/** Simple array summation */
export const sum = (arr: number[]) => arr.reduce((acc, cur) => acc + cur, 0)

export const debounce = <FunctionArguments extends Array<unknown>>(
	func: (...args: FunctionArguments) => void,
	wait: number,
) => {
	let timeout: NodeJS.Timeout | undefined
	return (...args: FunctionArguments) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}

export const throttle = <FunctionArguments extends Array<unknown>>(
	func: (...args: FunctionArguments) => void,
	wait: number,
	options: { leading?: boolean; trailing?: boolean } = { leading: false, trailing: true },
) => {
	let pause: boolean
	const { leading, trailing } = options

	return (...args: FunctionArguments) => {
		if (pause) {
			return
		}

		pause = true
		leading && func.apply(this, args)

		setTimeout(() => {
			trailing && func.apply(this, args)
			pause = false
		}, wait)
	}
}

/**
 * Creates a cancelable Promise. Useful for dealing with React memory leak
 * warnings.
 */
export function makeCancelable<ReturnType>(promise: Promise<ReturnType>) {
	let isCanceled = false

	const wrappedPromise = new Promise<ReturnType>((resolve, reject) => {
		promise
			.then((val) => (isCanceled ? reject({ isCanceled }) : resolve(val)))
			.catch((error) => (isCanceled ? reject({ isCanceled }) : reject(error)))
	})

	return {
		promise: wrappedPromise,
		cancel() {
			isCanceled = true
		},
	}
}
