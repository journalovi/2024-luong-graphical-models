import { ForwardedRef, forwardRef, HTMLAttributes, useRef } from 'react'
import root from 'react-shadow/styled-components'
import { mergeRefs } from '@react-aria/utils'

import GlobalStyles from '@layouts/globalStyles'
import useMountEffect from '@utils/useMountEffect'

const BaseShadowRoot = (
	{ children, ...props }: HTMLAttributes<HTMLDivElement>,
	forwardedRef: ForwardedRef<HTMLDivElement>,
) => {
	const internalRef = useRef<HTMLDivElement>(null)

	useMountEffect(() => {
		if (!window) return

		if (window.applyFocusVisiblePolyfill != null) {
			window.applyFocusVisiblePolyfill(internalRef.current?.shadowRoot)
			return
		}

		window.addEventListener(
			'focus-visible-polyfill-ready',
			() => window.applyFocusVisiblePolyfill?.(internalRef.current?.shadowRoot),
			{ once: true },
		)
	})

	return (
		<root.div ref={mergeRefs(forwardedRef, internalRef)} {...props}>
			<GlobalStyles />
			{children}
		</root.div>
	)
}

const ShadowRoot = forwardRef(BaseShadowRoot)

export default ShadowRoot
