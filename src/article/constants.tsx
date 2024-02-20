export enum MODEL {
	HMM = 'hmm',
	MEMM = 'memm',
	CRF_UNARY = 'crf-unary',
	CRF = 'crf',
}

/**
 * Subset of models available for live prediction
 */
export enum PREDICTION_MODEL {
	HMM = 'hmm',
	MEMM = 'memm',
	CRF = 'crf',
}

export const MODEL_SHORT = {
	[MODEL.HMM]: 'HMM',
	[MODEL.MEMM]: 'MEMM',
	[MODEL.CRF_UNARY]: 'CRF (Unary)',
	[MODEL.CRF]: 'CRF',
}

export const MODEL_FULL = {
	[MODEL.HMM]: 'Hidden Markov Model',
	[MODEL.MEMM]: 'Maximum-Entropy Markov Model',
	[MODEL.CRF_UNARY]: 'Conditional Random Field',
	[MODEL.CRF]: 'Conditional Random Field',
}

export const nameTags = [
	'B-ORG',
	'I-ORG',
	'B-PER',
	'I-PER',
	'B-LOC',
	'I-LOC',
	'B-MISC',
	'I-MISC',
	'O',
] as const

export const entityNameCategories = ['ORG', 'PER', 'LOC', 'MISC', 'ALL']
