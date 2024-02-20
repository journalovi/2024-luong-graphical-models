import { HTMLAttributes, useEffect, useRef } from 'react'
import balanceText from 'balance-text'

const BalancedText = ({
	children,
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>) => {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		if (!ref.current) return
		balanceText(ref.current, { watch: true })
	})

	return (
		<span ref={ref} className={className} {...props}>
			{children}
		</span>
	)
}

export default BalancedText
