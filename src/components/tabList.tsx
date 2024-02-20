import { ReactNode, useRef } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useTabList } from '@react-aria/tabs'
import { Item } from '@react-stately/collections'
import { useTabListState } from '@react-stately/tabs'
import { AriaTabListProps } from '@react-types/tabs'
import styled from 'styled-components'

import Tab from '@components/tab'
import TabPanel from '@components/tabPanel'

import LocalThemeProvider from '@utils/localThemeProvider'
import useBreakpoint from '@utils/useBreakpoint'

export interface TabItem {
  key: string
  label: string
  content: ReactNode
  leadingItems?: ReactNode
  trailingItems?: ReactNode
}

interface TabListProps extends Omit<AriaTabListProps<TabItem>, 'children'> {
  items: TabItem[]
  recessedPanel?: boolean
  height?: string
  className?: string
  children?: ReactNode
}

const TabList = (props: TabListProps) => {
  return (
    <TabListInner {...props}>
      {props.items.map((item) => (
        // eslint-disable-next-line react/jsx-key
        <Item {...item}>{item.content}</Item>
      ))}
    </TabListInner>
  )
}

export default TabList

interface TabListInnerProps extends Omit<TabListProps, 'items' | 'children'> {
  children: AriaTabListProps<TabItem>['children']
}

const TabListInner = ({
  className,
  orientation = 'horizontal',
  recessedPanel = false,
  height,
  ...props
}: TabListInnerProps) => {
  const ref = useRef<HTMLUListElement>(null)
  const state = useTabListState(props)
  const { tabListProps } = useTabList({ orientation, ...props }, state, ref)

  // Force horizontal orientation on small screens
  const breakpointSmall = useBreakpoint('s')
  const modifiedOrientation = breakpointSmall ? 'horizontal' : orientation

  return (
    <Wrap className={className} orientation={modifiedOrientation} height={height}>
      <TabsWrap orientation={modifiedOrientation} ref={ref} {...tabListProps}>
        {[...state.collection].map((item) => (
          <Tab key={item.key} item={item} state={state} />
        ))}
      </TabsWrap>
      <LocalThemeProvider recessed={recessedPanel}>
        <PanelsWrap>
          <SwitchTransition>
            <CSSTransition
              timeout={{
                enter: 250,
                exit: 125,
              }}
              key={state.selectedItem?.key}
            >
              <TabPanel key={state.selectedItem?.key} state={state} />
            </CSSTransition>
          </SwitchTransition>
        </PanelsWrap>
      </LocalThemeProvider>
    </Wrap>
  )
}

const Wrap = styled.div<{ orientation: TabListProps['orientation']; height?: string }>`
  display: flex;
  gap: var(--space-2);
  contain: content;

  ${(p) => p.height && `height: ${p.height};`}
  ${(p) =>
    p.orientation === 'horizontal'
      ? `
        flex-direction: column;
        align-items: center;
        gap: var(--space-1);
      `
      : `gap: var(--space-2);`};
`

const TabsWrap = styled.ul<{ orientation: TabListProps['orientation'] }>`
  display: flex;
  gap: 1px;

  ${(p) => p.orientation === 'vertical' && `flex-direction: column;`}
`

const PanelsWrap = styled.div`
  height: 100%;
  width: 100%;
  border-radius: var(--border-radius-m);
  background: var(--color-background);
  border: solid 1px var(--color-line);
`
