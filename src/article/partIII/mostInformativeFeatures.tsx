import { useMemo, useState } from 'react'
import styled from 'styled-components'

import SelectField, { Item } from '@components/fields/select'
import Grid from '@components/grid'
import Panel from '@components/panel'
import ShadowRoot from '@components/shadowRoot'
import { Table, TableBody, TableHead, TD, TH, TR } from '@components/table'

import { nameTags } from '../constants'

type NameTag = (typeof nameTags)[number]
const informativeFeatures: Record<NameTag, Array<string | number>[]> = {
	['O']: [
		['word=germany', 'B-LOC', 11.492],
		['word=van', 'B-PER', 8.972],
		['word=wall', 'B-ORG', 8.525],
		['word=della', 'B-PER', 7.86],
		['lowercase=della', 'B-PER', 7.86],
		['is_not_title_case', 'B-PER', -6.949],
		['word=de', 'B-PER', 6.781],
		['shape=X.X.', 'O', -6.713],
		['shape=xxxx', 'B-ORG', -6.642],
		['word=CLINTON', 'B-ORG', 6.456],
	],
	['B-ORG']: [
		['is_not_title_case', 'B-MISC', -4.967],
		['is_not_title_case', 'B-PER', -4.733],
		['is_not_uppercase', 'B-ORG', -3.36],
		['is_not_uppercase', 'B-PER', -3.244],
		['is_not_uppercase', 'B-MISC', -2.715],
		['is_not_digit', 'B-PER', -2.578],
		['shape=xxxx', 'I-ORG', -2.5],
		['is_not_title_case', 'B-ORG', -2.374],
		["word=Mar'ie", 'B-PER', 2.24],
		["lowercase=mar'ie", 'B-PER', 2.24],
	],
	['I-ORG']: [
		['is_not_uppercase', 'B-PER', -5.541],
		['is_not_uppercase', 'B-MISC', -5.541],
		['is_not_digit', 'B-ORG', -5.121],
		['is_not_digit', 'B-PER', -3.263],
		['is_not_digit', 'B-MISC', -3.261],
		['word=Tupolev', 'B-MISC', 2.593],
		['lowercase=tupolev', 'B-MISC', 2.593],
		['word=Airbus', 'B-MISC', 2.59],
		['lowercase=airbus', 'B-MISC', 2.59],
		['word=Ali', 'B-PER', 2.577],
	],
	['B-PER']: [
		['is_title_case', 'O', -8.489],
		['is_not_digit', 'B-MISC', -6.559],
		['word=Calderon', 'B-LOC', 6.437],
		['lowercase=calderon', 'B-LOC', 6.437],
		['word=Akbar', 'O', 6.334],
		['lowercase=akbar', 'O', 6.334],
		['word=Salamanca', 'B-LOC', 6.176],
		['lowercase=salamanca', 'B-LOC', 6.176],
		['is_not_uppercase', 'B-MISC', -6.087],
		['word=Sept', 'O', 5.873],
	],
	['I-PER']: [
		['is_title_case', 'O', -7.552],
		['is_not_title_case', 'I-PER', -6.266],
		['word=der', 'I-PER', 5.223],
		['word=de', 'I-PER', 4.947],
		['lowercase=de', 'I-PER', 4.947],
		['word=Ongania', 'O', 4.367],
		['lowercase=ongania', 'O', 4.367],
		['word=Meng', 'O', 4.259],
		['lowercase=meng', 'O', 4.259],
		['lowercase=der', 'I-PER', 3.913],
	],
	['B-LOC']: [
		['word=Perfetti', 'B-PER', 38.791],
		['lowercase=perfetti', 'B-PER', 38.791],
		['is_not_digit', 'B-PER', -8.739],
		['is_not_uppercase', 'B-LOC', -6.552],
		['shape=Xxxxx', 'O', -6.217],
		['is_not_uppercase', 'B-PER', -5.789],
		['word=High', 'B-LOC', 5.783],
		['lowercase=high', 'B-LOC', 5.783],
		['is_not_uppercase', 'B-ORG', -5.781],
		['word=Senate', 'B-ORG', 5.512],
	],
	['I-LOC']: [
		['word=Free', 'O', 6.04],
		['is_not_digit', 'B-ORG', -5.606],
		['is_not_uppercase', 'B-LOC', -4.703],
		['word=Daewoo', 'B-ORG', 4.614],
		['lowercase=daewoo', 'B-ORG', 4.614],
		['is_not_uppercase', 'B-ORG', -4.479],
		['word=free', 'I-LOC', 4.44],
		['word=Israel', 'B-LOC', 4.342],
		['lowercase=israel', 'B-LOC', 4.342],
		['is_not_title_case', 'B-MISC', -4.13],
	],
	['B-MISC']: [
		['is_not_title_case', 'B-PER', -7.686],
		['word=interior', 'B-ORG', 6.809],
		['word=MaliVai', 'B-PER', 4.959],
		['shape=XxxxXxx', 'B-PER', 4.959],
		['word=Russia', 'B-LOC', 4.816],
		['lowercase=russia', 'B-LOC', 4.816],
		['is_not_title_case', 'B-ORG', -4.748],
		['word=Doboj', 'B-LOC', 4.483],
		['lowercase=doboj', 'B-LOC', 4.483],
		['word=UAE', 'B-LOC', 4.482],
	],
	['I-MISC']: [
		['is_not_digit', 'B-LOC', -5.548],
		['is_not_digit', 'B-PER', -5.109],
		['is_not_digit', 'B-MISC', -4.801],
		['word=South', 'B-LOC', 4.434],
		['lowercase=south', 'B-LOC', 4.434],
		['word=division', 'I-MISC', 4.372],
		['word=Johnson', 'B-LOC', 4.222],
		['lowercase=johnson', 'B-LOC', 4.222],
		['word=convention', 'I-MISC', 4.199],
		['word=World', 'B-MISC', 4.159],
	],
}

const MEMMMostInformativeFeatures = () => {
	const [prevTag, setPrevTag] = useState<NameTag>('O')
	const features = useMemo(() => informativeFeatures[prevTag], [prevTag])

	return (
		<Grid noPaddingOnMobile>
			<Wrap raised size="m" gridColumn="wide">
				<ShadowRoot>
					<Heading>
						<HeadingText>
							Most Informative Features when Previous State is&nbsp;
						</HeadingText>
						<SelectField
							skipFieldWrapper
							value={prevTag}
							onChange={setPrevTag}
							aria-label="Previous State"
						>
							{nameTags.map((tag) => (
								<Item key={tag}>{tag}</Item>
							))}
						</SelectField>
					</Heading>
					<TableWrap>
						<StyledTable>
							<colgroup>
								<col />
								<col />
								<col />
							</colgroup>
							<TableHead>
								<TR>
									<TH scope="col">Current Word Feature</TH>
									<TH scope="col">Current State</TH>
									<TH scope="col" align="right">
										Weight
									</TH>
								</TR>
							</TableHead>
							<TableBody>
								{features.map(([feature, currentTag, weight]) => (
									<TR key={`${feature}-${currentTag}`}>
										<TD>{feature}</TD>
										<TD>{currentTag}</TD>
										<TD align="right">{weight}</TD>
									</TR>
								))}
							</TableBody>
						</StyledTable>
					</TableWrap>
				</ShadowRoot>
			</Wrap>
		</Grid>
	)
}

export default MEMMMostInformativeFeatures

const Wrap = styled(Panel)`
	margin-top: var(--adaptive-space-2);
	margin-bottom: var(--adaptive-space-4);
	overflow: auto;
`

const Heading = styled.div`
	margin-bottom: var(--space-1);

	/* Select trigger */
	div {
		display: inline-block;

		button {
			${(p) => p.theme.text.h5}
			padding: var(--space-0) var(--space-0) var(--space-0) var(--space-0-5);
			border: solid 1px var(--color-line);
		}
	}
`

const HeadingText = styled.p`
	display: inline;
	${(p) => p.theme.text.h5}
`

const TableWrap = styled.div`
	overflow: auto;

	padding-bottom: var(--space-2);
	padding-left: var(--space-2);
	margin-left: calc(var(--space-2) * -1);
	margin-right: calc(var(--space-2) * -1);
`

const StyledTable = styled(Table)`
	/* Pseudo right padding when container is scrolling */
	border-right: solid 16px transparent;

	tbody {
		${(p) => p.theme.vizText.body2}
	}

	colgroup {
		col:nth-child(1) {
			width: calc(100% - 20em);
		}
		col:nth-child(2) {
			width: 10em;
		}
		col:nth-child(3) {
			width: 10em;
		}
	}

	${(p) => p.theme.breakpoints.mobile} {
		colgroup {
			col:nth-child(1) {
				width: calc(100% - 12em);
			}
			col:nth-child(2) {
				width: 6em;
			}
			col:nth-child(3) {
				width: 6em;
			}
		}
	}
`
