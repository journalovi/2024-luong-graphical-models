import { randomBeta } from 'd3-random'
import gamma from 'gamma'
import { makeAutoObservable, set } from 'mobx'

import {
	ContinuousDistribution,
	ContinuousDistributionType,
	ParameterType,
} from './utils'

class BetaDistribution implements ContinuousDistribution {
	type = ContinuousDistributionType.Beta
	parameters = {
		alpha: {
			displayName: '\u03b1 – alpha',
			description: 'Shape parameter.',
			minValue: 0.1,
			step: 0.1,
			type: ParameterType.Shape,
		},
		beta: {
			displayName: '\u03b2 – beta',
			description: 'Shape parameter.',
			minValue: 0.1,
			step: 0.1,
			type: ParameterType.Shape,
		},
	}
	parameterValues

	constructor(alpha = 2, beta = 5) {
		makeAutoObservable(this)
		this.parameterValues = { alpha, beta }
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		// The support is actually [0, 1], but at the extremities the pdf can approach
		// Infinity, so we'll return [0.001, 0.999].
		return [0.001, 0.999]
	}

	get mean() {
		const { alpha, beta } = this.parameterValues
		return alpha / (alpha + beta)
	}

	get mode() {
		const { alpha, beta } = this.parameterValues

		if (alpha > 1 && beta > 1) return (alpha - 1) / (alpha + beta - 2)

		// If either alpha or beta is <= 1, then the mode can be either 0 or 1, but
		// at 0 or 1 the pdf can approach Infinity, so we'll return 0.001 or 0.999.
		if (alpha > 1) return 0.999
		if (beta > 1) return 0.001
		return alpha >= beta ? 0.999 : 0.001
	}

	get variance() {
		const { alpha, beta } = this.parameterValues
		return (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pdf(x: number) {
		const { alpha, beta } = this.parameterValues
		const B = (gamma(alpha) * gamma(beta)) / gamma(alpha + beta)
		return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / B
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { alpha, beta } = this.parameterValues
		const generateSample = randomBeta(alpha, beta)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default BetaDistribution
