import { randomGamma } from 'd3-random'
import gamma from 'gamma'
import { makeAutoObservable, set } from 'mobx'

import {
	ContinuousDistribution,
	ContinuousDistributionType,
	ParameterType,
} from './utils'

class GammaDistribution implements ContinuousDistribution {
	type = ContinuousDistributionType.Gamma
	parameters = {
		k: {
			displayName: 'k',
			description: 'Shape parameter.',
			minValue: 0.1,
			step: 0.1,
			type: ParameterType.Shape,
		},
		theta: {
			displayName: '\u03b8 – theta',
			description: 'Scale parameter.',
			minValue: 0.1,
			step: 0.1,
			type: ParameterType.Scale,
		},
	}
	parameterValues

	constructor(k = 2, theta = 5) {
		makeAutoObservable(this)
		this.parameterValues = { k, theta }
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		// The support is actually [0, Infinity), but at 0 the pdf can approach
		// Infinity, so we'll return [0.001, Infinity].
		return [0.001, Infinity]
	}

	get mean() {
		const { k, theta } = this.parameterValues
		return k * theta
	}

	get mode() {
		const { k, theta } = this.parameterValues

		if (k >= 1) return (k - 1) * theta

		// The mode is 0, but at 0 the pdf can approach Infinity, so we'll return
		// 0.001.
		return 0.001
	}

	get variance() {
		const { k, theta } = this.parameterValues
		return k * theta ** 2
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pdf(x: number) {
		const { k, theta } = this.parameterValues
		return (1 / (gamma(k) * theta ** k)) * x ** (k - 1) * Math.E ** (-x / theta)
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { k, theta } = this.parameterValues
		const generateSample = randomGamma(k, theta)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default GammaDistribution
