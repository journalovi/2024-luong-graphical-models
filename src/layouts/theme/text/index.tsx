import { CSSObject } from 'styled-components'

import { Breakpoint, breakpoints, orderedBreakpoints } from '@theme/breakpoints'
import sohne from '@theme/text/sohne'
import sohneMono from '@theme/text/sohneMono'

type TextCategoryStyles = {
	fontFamily: string
	fontWeight: number
	lineHeight: number
	fontSize?: string
	letterSpacing?: string
	textTransform?: 'capitalize' | 'uppercase' | 'lowercase'
}

type TextCategoryDefinition = TextCategoryStyles & {
	fontSizes: Record<Breakpoint, number>
}

type TextCategory = CSSObject

type TextCategoryName =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'body1'
	| 'body2'
	| 'label'
	| 'small'

export type TextScaleDefinition = Record<TextCategoryName, TextCategoryDefinition>

export type TextScale = Record<TextCategoryName, TextCategory>

const getCSSStyleObject = (scale: TextScaleDefinition): TextScale => {
	const result: Partial<TextScale> = {}

	;(Object.keys(scale) as TextCategoryName[]).map((key) => {
		const { fontSizes, ...rest } = scale[key]
		const scaleCSS: CSSObject = {
			...rest,
			fontSize: `${fontSizes.xl}rem`,
		}

		orderedBreakpoints.forEach((breakpoint, i) => {
			if (
				// Skip 'xs' as mobile styles will be added together below
				breakpoint === 'xs' ||
				// Skip this breakpoint if the font size is the same
				(i > 0 && fontSizes[breakpoint] === fontSizes[orderedBreakpoints[i - 1]])
			) {
				return
			}

			scaleCSS[`@media only screen and (max-width: ${breakpoints[breakpoint]})`] = {
				fontSize: `${fontSizes[breakpoint]}rem`,
			}
		})

		// Mobile styles
		scaleCSS[
			`@media only screen and (max-width: ${breakpoints.xs}), only screen and (max-height: ${breakpoints.s})`
		] = {
			fontSize: `${fontSizes.xs}rem`,
		}

		result[key] = scaleCSS
	})

	return result as TextScale
}

export const textScales = {
	sohne: getCSSStyleObject(sohne),
	sohneMono: getCSSStyleObject(sohneMono),
}
