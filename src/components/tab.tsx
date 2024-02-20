import { useRef } from 'react'
import { useTab } from '@react-aria/tabs'
import { TabListState } from '@react-stately/tabs'
import { Node } from '@react-types/shared'
import { AriaTabProps } from '@react-types/tabs'
import styled from 'styled-components'

import { TabItem } from '@components/tabList'

interface TabProps extends AriaTabProps {
  item: Node<TabItem>
  state: TabListState<TabItem>
}

const Tab = ({ item, state }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null)
  const { key } = item

  const isDisabled = state.disabledKeys.has(key)
  const isSelected = state.selectedKey === key

  const { tabProps } = useTab({ key, isDisabled }, state, ref)

  const { label, leadingItems, trailingItems } = item.props as TabItem

  return (
    <Wrap isSelected={isSelected} isDisabled={isDisabled} {...tabProps} ref={ref}>
      {leadingItems && <LeadingWrap aria-hidden="true">{leadingItems}</LeadingWrap>}
      <LabelWrap>{label}</LabelWrap>
      {trailingItems && <TrailingWrap>{trailingItems}</TrailingWrap>}
    </Wrap>
  )
}

export default Tab

const Wrap = styled.li<{ isSelected: boolean; isDisabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  padding-right: var(--space-3);
  border-radius: var(--border-radius-m);
  cursor: pointer;

  &:focus {
    outline: none;
  }
  &.focus-visible {
    ${(p) => p.theme.focusVisible};
  }

  ${(p) =>
    p.isSelected &&
    `
    color: var(--color-active-text);
  `}
`

const LabelWrap = styled.span``

const LeadingWrap = styled.div`
  ${(p) => p.theme.flexCenter};
  height: ${(p) => p.theme.lineHeight};
  gap: var(--space-1);
`

const TrailingWrap = styled.div`
  ${(p) => p.theme.flexCenter};
  height: ${(p) => p.theme.lineHeight};
  gap: var(--space-1);
`
