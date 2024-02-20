import { ReactNode } from 'react'

import useMatchMedia from '@utils/useMatchMedia'

const getReadableList = (list: ReactNode[]) => {
	if (list.length === 0) return []
	if (list.length === 1) return [list[0]]
	if (list.length === 2) return [list[0], ' and ', list[1]]
	return [
		...[...list.slice(0, -1).map((item) => [item, ', '])].flat(),
		'and ',
		...list.slice(-1),
	]
}

export const tl = (string: string, ...args: ReactNode[][]) => {
	let returnArray: ReactNode[] = [string]

	args.forEach((list, i) => {
		// Replace "$1", "$2",… with human-readable, comma-separated lists ("a, b, and c").
		const readableList = getReadableList(list)
		returnArray = returnArray
			.map<ReactNode | ReactNode[]>((item) => {
				if (typeof item === 'string') {
					return (
						item
							.split(`$${i + 1}`)
							// Add the readable list in between each split item
							.map((substr) => (substr ? [substr, ...readableList] : substr))
							.flat()
							// Remove extraneous list at the end, unless the item ends with a $ marker.
							.slice(0, item.endsWith(`$${i + 1}`) ? -1 : -readableList.length)
					)
				}
				return item
			})
			.flat()

		// Replace plurality groups ("{x, is, are}") with the appropriate version (e.g. if
		// list x has more than one item, use "are", otherwise use "is").
		returnArray = returnArray.map((item) => {
			if (typeof item === 'string') {
				let returnString = item
				let match
				while (
					(match = new RegExp(`{${i + 1},[^}]+}`, 'g').exec(returnString)) !== null
				) {
					// Get the plurality options from the matched substring. E.g. if the mathced
					// substring is "{1, is, are}", then options = ["is", "are"].
					const options = match[0].slice(3, -1).split(',')
					// We want the first option if `list` has 1 item (so "is" in the example
					// above), the second option if it has 2 items ("are"), the third if 3,
					// and so on. The upper limit is the length of `options`. If there are only
					// 2 options, then we'll use the second option even if `list` has 3 or more
					// items.
					const replacementOption = options[Math.min(list.length, options.length) - 1]
					// `#` is a special symbol that means "replace with the length of the list".
					const replacementString =
						replacementOption === '#' ? list.length : replacementOption

					returnString = [
						returnString.slice(0, match.index),
						replacementString,
						returnString.slice(match.index + match[0].length),
					].join('')
				}
				return returnString
			}
			return item
		})
	})
	return returnArray
}

export const usePointerAction = (capitalize = false) => {
	const isTouch = useMatchMedia('(pointer: coarse)')
	return isTouch ? (capitalize ? 'Tap' : 'tap') : capitalize ? 'Click' : 'click'
}
