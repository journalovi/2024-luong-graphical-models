type FontDefinition = {
	fontFamily: string
	fontStyle: 'normal' | 'italic' | 'oblique'
	fontWeight: string | number
	src: {
		url: string
		format: 'woff' | 'woff2' | 'opentype' | 'truetype'
	}[]
}

type FontFamily = {
	family: FontDefinition['fontFamily']
	weights: Array<FontDefinition['fontWeight']>
	weightsMap: { [key: string]: string }
	styles: Array<FontDefinition['fontStyle']>
	stylesMap: { [key: string]: string }
	formats: Array<FontDefinition['src'][number]['format']>
	subfolder: string
}

const extensionsMap = {
	woff: 'woff',
	woff2: 'woff2',
	opentype: 'otf',
	truetype: 'ttf',
}

const generateFontDefinitions = ({
	family,
	weights,
	weightsMap,
	styles,
	stylesMap,
	formats,
	subfolder,
}: FontFamily): FontDefinition[] =>
	weights
		.map((weight) =>
			styles.map((style) => ({
				fontFamily: family,
				fontStyle: style,
				fontWeight: weight,
				src: formats.map((format) => ({
					url: `fonts/${subfolder}/${family.replace(/(\s|-)/g, '')}-${
						weightsMap[weight]
					}${stylesMap[style]}.${extensionsMap[format]}`,
					format,
				})),
			})),
		)
		.flat()

const generateFontFaceAtRule = (d: FontDefinition) => `
@font-face {
  font-family: '${d.fontFamily}';
  font-weight: ${d.fontWeight};
  font-style: ${d.fontStyle};
  font-display: swap;
  src: ${d.src.map((src) => `url('${src.url}') format('${src.format}')`).join(',\n    ')};
}
`

const sohneDefinitions = generateFontDefinitions({
	family: 'Sohne',
	weights: [400, 500, 600],
	weightsMap: {
		'400': 'Buch',
		'500': 'Kraftig',
		'600': 'Halbfett',
	},
	styles: ['normal'],
	stylesMap: {
		normal: '',
	},
	formats: ['woff2', 'woff', 'opentype'],
	subfolder: 'sohne',
})

export const sohneAtRules = sohneDefinitions
	.map((d) => generateFontFaceAtRule(d))
	.join('')

const domaineDisplayNarrowDefinitions = generateFontDefinitions({
	family: 'Domaine Display Narrow',
	weights: [500, 600, 700],
	weightsMap: {
		'500': 'Medium',
		'600': 'Semibold',
		'700': 'Bold',
	},
	styles: ['normal', 'italic'],
	stylesMap: {
		normal: '',
		italic: 'Italic',
	},
	formats: ['woff2', 'woff', 'opentype'],
	subfolder: 'domaine-display-narrow',
})

export const domaineDisplayNarrowAtRules = domaineDisplayNarrowDefinitions
	.map((d) => generateFontFaceAtRule(d))
	.join('')

const domaineTextDefinitions = generateFontDefinitions({
	family: 'Domaine Text',
	weights: [400, 500, 700],
	weightsMap: {
		'400': 'Regular',
		'500': 'Medium',
		'700': 'Bold',
	},
	styles: ['normal', 'italic'],
	stylesMap: {
		normal: '',
		italic: 'Italic',
	},
	formats: ['woff2', 'woff', 'opentype'],
	subfolder: 'domaine-text',
})

export const domaineTextAtRules = domaineTextDefinitions
	.map((d) => generateFontFaceAtRule(d))
	.join('')
