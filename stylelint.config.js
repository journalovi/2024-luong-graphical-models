module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-recommended'],
	customSyntax: 'postcss-styled-syntax',
	rules: {
		'declaration-empty-line-before': null,
		'rule-empty-line-before': null,
		'no-empty-source': null,
		'no-descending-specificity': null,
		'keyframes-name-pattern': null,
		'value-keyword-case': ['lower', { ignoreKeywords: ['dummyValue'] }],
		'selector-type-no-unknown': [
			true,
			{
				ignoreTypes: ['/-styled-mixin/', '$dummyValue'],
			},
		],
	},
}
