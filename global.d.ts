declare global {
	interface Window {
		applyFocusVisiblePolyfill?: (root?: ShadowRoot | null | undefined) => void
	}
}

export {}
