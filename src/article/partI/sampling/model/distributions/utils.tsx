export enum VariableType {
	Continuous = 'continuous',
	Discrete = 'discrete',
}

export enum ContinuousDistributionType {
	Normal = 'normal',
	Exponential = 'exponential',
	Gamma = 'gamma',
	Beta = 'beta',
}

export enum DiscreteDistributionType {
	Bernoulli = 'bernoulli',
	Binomial = 'binomial',
}

export type DistributionType = ContinuousDistributionType | DiscreteDistributionType

export enum ParameterType {
	Shape = 'shape',
	Location = 'location',
	Scale = 'scale',
}

export interface ParameterInfo {
	displayName: string
	description: string
	minValue?: number
	maxValue?: number
	step?: number
	type?: ParameterType
}

interface BaseDistribution {
	parameters: Record<string, ParameterInfo>
	parameterValues: Record<string, number>
	setParameterValue: (name: string, value: number) => void
	support: [number, number]
	mean: number
	mode: number
	variance: number
	sample: (n: number) => number[]
}

export interface ContinuousDistribution extends BaseDistribution {
	type: ContinuousDistributionType
	pdf: (value: number) => number
}

export interface DiscreteDistribution extends BaseDistribution {
	type: DiscreteDistributionType
	pmf: (value: number) => number
}

export type Distribution = ContinuousDistribution | DiscreteDistribution

export const isContinuousDistribution = (
	dist: ContinuousDistribution | DiscreteDistribution,
): dist is ContinuousDistribution =>
	Object.values(ContinuousDistributionType).includes(
		dist.type as ContinuousDistributionType,
	)

export const isDiscreteDistribution = (
	dist: ContinuousDistribution | DiscreteDistribution,
): dist is DiscreteDistribution =>
	Object.values(DiscreteDistributionType).includes(dist.type as DiscreteDistributionType)

export const getValueDomain = (dist: Distribution) => {
	const { support, mean, variance } = dist
	const std = Math.sqrt(variance)
	const valueDomainLower = support[0] !== -Infinity ? support[0] : mean - 4 * std
	const valueDomainUpper = support[1] !== Infinity ? support[1] : mean + 4 * std
	return [valueDomainLower, valueDomainUpper]
}
