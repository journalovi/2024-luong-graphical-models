import('citeproc-types')
import('csl-json')

declare module '*.jpg'
declare module '*.png'
declare module '*.csl.json' {
	const references: CSL.Data[]
	export default references
}
declare module 'gatsby-plugin-transition-link'
declare module 'gamma' {
	export default (val: number) => val
}
declare module 'balance-text' {
	const balanceText: (el: HTMLElement, options?: { watch: boolean }) => void
	export default balanceText
}
