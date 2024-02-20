import { SeparatorProps, useSeparator } from '@react-aria/separator'
import styled from 'styled-components'

export interface DividerProps extends SeparatorProps {
	asSpan?: boolean
}

const Divider = styled(({ orientation, asSpan, ...props }: DividerProps) => {
	const { separatorProps } = useSeparator({ orientation })

	if (asSpan) {
		return <span {...separatorProps} {...props} />
	}

	return <div {...separatorProps} {...props} />
}).withConfig({
	shouldForwardProp: (prop, defaultValidatorFn) =>
		['asSpan'].includes(prop) || defaultValidatorFn(prop),
})`
	display: block;
	border-color: var(--color-line);
	border-style: solid;
	border-width: 0;
	${(p) =>
		p.orientation === 'vertical'
			? 'border-right-width: 1px;'
			: 'border-bottom-width: 1px'}
`
export default Divider
