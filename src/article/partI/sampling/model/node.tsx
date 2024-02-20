import { action, makeObservable, observable } from 'mobx'

import Node from '../../../graph/model/node'

import BernoulliDistribution from './distributions/bernoulli'
import BetaDistribution from './distributions/beta'
import BinomialDistribution from './distributions/binomial'
import ExponentialDistribution from './distributions/exponential'
import GammaDistribution from './distributions/gamma'
import NormalDistribution from './distributions/normal'
import {
	ContinuousDistributionType,
	DiscreteDistributionType,
	Distribution,
	DistributionType,
} from './distributions/utils'

type SamplingNodeProps = ConstructorParameters<typeof Node>[0] & {
	distribution?: Distribution
}

class SamplingNode extends Node {
	distribution: Distribution

	constructor(props: SamplingNodeProps) {
		super(props)
		makeObservable(this, { distribution: observable, setDistribution: action })
		this.distribution = props.distribution ?? new NormalDistribution()
	}

	// removeIncomingEdge(edge: string) {
	// 	super.removeIncomingEdge(edge)
	// 	this.setDistribution(ContinuousDistributionType.Normal)
	// }

	setDistribution(dist: DistributionType) {
		switch (dist) {
			case ContinuousDistributionType.Normal:
				this.distribution = new NormalDistribution()
				break
			case ContinuousDistributionType.Exponential:
				this.distribution = new ExponentialDistribution()
				break
			case ContinuousDistributionType.Beta:
				this.distribution = new BetaDistribution()
				break
			case ContinuousDistributionType.Gamma:
				this.distribution = new GammaDistribution()
				break
			case DiscreteDistributionType.Bernoulli:
				this.distribution = new BernoulliDistribution()
				break
			case DiscreteDistributionType.Binomial:
				this.distribution = new BinomialDistribution()
				break
		}
	}

	sample(n = 1) {
		return this.distribution.sample(n)
	}
}

export default SamplingNode
