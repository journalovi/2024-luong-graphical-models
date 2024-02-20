import { useRef } from 'react'
import { useTabPanel } from '@react-aria/tabs'
import { TabListState } from '@react-stately/tabs'
import { AriaTabPanelProps } from '@react-types/tabs'
import styled from 'styled-components'

import { TabItem } from '@components/tabList'

interface TabPanelProps extends AriaTabPanelProps {
  state: TabListState<TabItem>
}

const TabPanel = ({ state, ...props }: TabPanelProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { tabPanelProps } = useTabPanel(props, state, ref)

  return (
    <Wrap {...tabPanelProps} ref={ref}>
      {state.selectedItem?.rendered}
    </Wrap>
  )
}

export default TabPanel

const Wrap = styled.div`
  padding: var(--space-2) var(--space-3);
  ${(p) => p.theme.transitionGroupFade}
  transition: opacity var(--animation-fast-out);
`
