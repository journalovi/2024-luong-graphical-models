import { TextScaleDefinition } from '@theme/text'

const heading = {
	fontFamily:
		'"Founders Grotesque X-Cond", "Helvetica Neue", Helvetica, Tahoma, sans-serif',
	textDecorationThickness: '0.04em',
	textUnderlineOffset: '0.04em',
}

const body = {
	fontFamily: 'Sohne, "Helvetica Neue", Helvetica, Tahoma, sans-serif',
	textDecorationThickness: '0.08em',
	textUnderlineOffset: '0.08em',
}

const sohne: TextScaleDefinition = {
	h1: {
		...heading,
		fontSizes: { xl: 5.5, l: 5.5, m: 3.875, s: 3, xs: 3 },
		fontWeight: 700,
		lineHeight: 0.9,
		letterSpacing: '-0.0025em',
	},
	h2: {
		...heading,
		fontSizes: { xl: 4.375, l: 4.375, m: 3.125, s: 2.5, xs: 2.5 },
		fontWeight: 700,
		lineHeight: 0.9,
		letterSpacing: '-0.0025em',
	},
	h3: {
		...heading,
		fontSizes: { xl: 3.25, l: 3.25, m: 2.5, s: 2, xs: 2 },
		fontWeight: 600,
		lineHeight: 0.9,
		letterSpacing: '-0.00125em',
	},
	h4: {
		...heading,
		fontSizes: { xl: 2.375, l: 2.375, m: 2, s: 1.75, xs: 1.75 },
		fontWeight: 600,
		lineHeight: 0.9,
		letterSpacing: '-0.00125em',
	},
	h5: {
		...heading,
		fontSizes: { xl: 1.75, l: 1.75, m: 1.625, s: 1.5, xs: 1.5 },
		fontWeight: 600,
		lineHeight: 1,
		letterSpacing: '0',
	},
	h6: {
		...heading,
		fontSizes: { xl: 1.325, l: 1.325, m: 1.125, s: 1.125, xs: 1.125 },
		fontWeight: 600,
		lineHeight: 1,
		letterSpacing: '0',
	},
	body1: {
		...body,
		fontWeight: 400,
		fontSizes: { xl: 1.0625, l: 1.0625, m: 1.0625, s: 1, xs: 1 },
		lineHeight: 1.45,
	},
	body2: {
		...body,
		fontWeight: 400,
		fontSizes: { xl: 0.9375, l: 0.9375, m: 0.9375, s: 0.875, xs: 0.875 },
		lineHeight: 1.2,
	},
	label: {
		...body,
		fontSizes: { xl: 0.9375, l: 0.9375, m: 0.9375, s: 0.875, xs: 0.875 },
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: '-0.0025em',
	},
	small: {
		...body,
		fontSizes: { xl: 0.8125, l: 0.8125, m: 0.8125, s: 0.75, xs: 0.75 },
		fontWeight: 400,
		lineHeight: 1.2,
		letterSpacing: '+0.01em',
	},
}

export default sohne
