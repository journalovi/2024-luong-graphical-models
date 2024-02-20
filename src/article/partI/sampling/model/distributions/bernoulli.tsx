import { randomBernoulli } from 'd3-random'
import { makeAutoObservable, set } from 'mobx'

import { DiscreteDistribution, DiscreteDistributionType } from './utils'

class BernoulliDistribution implements DiscreteDistribution {
	type = DiscreteDistributionType.Bernoulli
	parameters = {
		p: {
			displayName: 'p',
			description: 'Probability of success.',
			minValue: 0,
			maxValue: 1,
			step: 0.01,
		},
	}
	parameterValues

	constructor(p = 0.8) {
		makeAutoObservable(this)
		this.parameterValues = { p }
	}

	setParameterValue(name: string, value: number) {
		set(this.parameterValues, name, value)
	}

	get support(): [number, number] {
		return [0, 1]
	}

	get mean() {
		const { p } = this.parameterValues
		return p
	}

	get mode() {
		const { p } = this.parameterValues
		if (p <= 0.5) return 0
		return 1
	}

	get variance() {
		const { p } = this.parameterValues
		return p * (1 - p)
	}

	/**
	 * Returns the probability density at point x of the current distribution
	 * with the current parameters. To change a parameter value, use
	 * setParameterValue().
	 */
	pmf(x: number) {
		const { p } = this.parameterValues
		if (x === 1) return p
		return 1 - p
	}

	/**
	 * Returns an array of n samples, generated with the current distribution
	 * parameters. To change a parameter value, use setParameterValue().
	 */
	sample(numSamples = 1) {
		const { p } = this.parameterValues
		const generateSample = randomBernoulli(p)

		const samples = []
		for (let x = 0; x < numSamples; x++) {
			samples.push(generateSample())
		}
		return samples
	}
}

export default BernoulliDistribution
