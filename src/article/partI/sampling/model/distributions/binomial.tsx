import { randomBinomial } from 'd3-random'
import { makeAutoObservable, set } from 'mobx'

import { factorial } from '@utils/math'

import { DiscreteDistribution, DiscreteDistributionType } from './utils'

class BinomialDistribution implements DiscreteDistribution {
	type = DiscreteDistributionType.Binomial
	parameters = {
		n: {
			displayName: 'n',
			description: 'Number of trials.',
			minValue: 0,
			defaultValue: 10,
		},
		p: {
			displayName: 'p',
			description: 'Probability of success in each trial.',
			minValue: 0,
			maxValue: 1,
			step: 0.1,
			defaultValue: 0.5,
		},
	}
	parameterValues: Record<string, number> = {}

	constructor() {
		makeAutoObservable(this)
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		const { n } = this.parameterValues
		return [0, n]
	}

	get mean() {
		const { n, p } = this.parameterValues
		return n * p
	}

	get mode() {
		const { n, p } = this.parameterValues
		return Math.floor((n + 1) * p)
	}

	get variance() {
		const { n, p } = this.parameterValues
		return n * p * (1 - p)
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pmf(x: number) {
		const { n, p } = this.parameterValues
		const nPickX = factorial(n) / (factorial(x) * factorial(n - x))
		return nPickX * p ** x * (1 - p) ** (n - x)
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { p } = this.parameterValues
		const generateSample = randomBinomial(p)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default BinomialDistribution
