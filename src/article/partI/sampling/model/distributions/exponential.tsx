import { randomExponential } from 'd3-random'
import { makeAutoObservable, set } from 'mobx'

import {
	ContinuousDistribution,
	ContinuousDistributionType,
	ParameterType,
} from './utils'

class ExponentialDistribution implements ContinuousDistribution {
	type = ContinuousDistributionType.Exponential
	parameters = {
		lambda: {
			displayName: '\u03bb – lambda',
			description:
				'Rate parameter, corresponds to the rate (frequency) of Poisson events.',
			minValue: 0.01,
			step: 0.01,
			type: ParameterType.Scale,
		},
	}
	parameterValues

	constructor(lambda = 0.5) {
		makeAutoObservable(this)
		this.parameterValues = { lambda }
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		return [0, Infinity]
	}

	get mean() {
		const { lambda } = this.parameterValues
		return 1 / lambda
	}

	get mode() {
		return 0
	}

	get variance() {
		const { lambda } = this.parameterValues
		return 1 / lambda ** 2
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pdf(x: number) {
		const { lambda } = this.parameterValues
		return lambda * Math.E ** (-lambda * x)
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { lambda } = this.parameterValues
		const generateSample = randomExponential(lambda)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default ExponentialDistribution
