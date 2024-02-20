import { randomNormal } from 'd3-random'
import { makeAutoObservable, set } from 'mobx'

import {
	ContinuousDistribution,
	ContinuousDistributionType,
	ParameterType,
} from './utils'

class NormalDistribution implements ContinuousDistribution {
	type = ContinuousDistributionType.Normal
	parameters = {
		mu: {
			displayName: '\u03bc – mu',
			description: "Location parameter, corresponds to the distribution's mean.",
			type: ParameterType.Location,
		},
		sigma: {
			displayName: '\u03c3 – sigma',
			description:
				"Scale parameter, corresponds to the distribution's standard deviation.",
			minValue: 0.1,
			step: 0.1,
			type: ParameterType.Scale,
		},
	}
	parameterValues

	constructor(mu = 0, sigma = 1) {
		makeAutoObservable(this)
		this.parameterValues = { mu, sigma }
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		return [-Infinity, Infinity]
	}

	get mean() {
		const { mu } = this.parameterValues
		return mu
	}

	get mode() {
		const { mu } = this.parameterValues
		return mu
	}

	get variance() {
		const { sigma } = this.parameterValues
		return sigma ** 2
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pdf(x: number) {
		const { mu, sigma } = this.parameterValues
		return Math.E ** (-(((x - mu) / sigma) ** 2) / 2) / (sigma * Math.sqrt(2 * Math.PI))
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { mu, sigma } = this.parameterValues
		const generateSample = randomNormal(mu, sigma)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default NormalDistribution
