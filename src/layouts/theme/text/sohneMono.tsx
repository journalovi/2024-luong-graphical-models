import { TextScaleDefinition } from '@theme/text'

const styles = {
	fontFamily:
		'"Sohne Mono", "Roboto Mono", Courier, "Andale Mono", "Courier New", monospace',
	textDecorationThickness: '0.08em',
	textUnderlineOffset: '0.08em',
}

const sohneMono: TextScaleDefinition = {
	h1: {
		...styles,
		fontSizes: { xl: 4.75, l: 4.75, m: 3.875, s: 3, xs: 3 },
		fontWeight: 700,
		lineHeight: 1.2,
		letterSpacing: '-0.02em',
	},
	h2: {
		...styles,
		fontSizes: { xl: 3.625, l: 3.625, m: 3.125, s: 2.5, xs: 2.5 },
		fontWeight: 700,
		lineHeight: 1.2,
		letterSpacing: '-0.02em',
	},
	h3: {
		...styles,
		fontSizes: { xl: 2.75, l: 2.75, m: 2.5, s: 2.125, xs: 2.125 },
		fontWeight: 500,
		lineHeight: 1.2,
		letterSpacing: '-0.01em',
	},
	h4: {
		...styles,
		fontSizes: { xl: 2.125, l: 2.125, m: 2, s: 1.75, xs: 1.75 },
		fontWeight: 500,
		lineHeight: 1.2,
		letterSpacing: '-0.01em',
	},
	h5: {
		...styles,
		fontSizes: { xl: 1.625, l: 1.625, m: 1.625, s: 1.5, xs: 1.5 },
		fontWeight: 500,
		lineHeight: 1.2,
		letterSpacing: '-0.01em',
	},
	h6: {
		...styles,
		fontSizes: { xl: 1.125, l: 1.125, m: 1.125, s: 1.125, xs: 1.125 },
		fontWeight: 500,
		lineHeight: 1.2,
		letterSpacing: '-0.01em',
	},
	body1: {
		...styles,
		fontWeight: 400,
		fontSizes: { xl: 0.9375, l: 0.9375, m: 0.9375, s: 0.875, xs: 0.875 },
		lineHeight: 1.45,
	},
	body2: {
		...styles,
		fontWeight: 400,
		fontSizes: { xl: 0.9375, l: 0.9375, m: 0.9375, s: 0.875, xs: 0.875 },
		lineHeight: 1.2,
	},
	label: {
		...styles,
		fontSizes: { xl: 0.9375, l: 0.9375, m: 0.9375, s: 0.875, xs: 0.875 },
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: '-0.0025em',
	},
	small: {
		...styles,
		fontSizes: { xl: 0.8125, l: 0.8125, m: 0.8125, s: 0.75, xs: 0.75 },
		fontWeight: 400,
		lineHeight: 1.2,
		letterSpacing: '+0.01em',
	},
}

export default sohneMono
