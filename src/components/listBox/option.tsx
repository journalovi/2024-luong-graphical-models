import { useRef } from 'react'
import { AriaOptionProps, useOption } from '@react-aria/listbox'
import { mergeProps } from '@react-aria/utils'
import { ListState } from '@react-stately/list'
import { Node } from '@react-types/shared'
import styled from 'styled-components'

import StateLayer from '@components/stateLayer'
import IconDone from '@icons/done'

interface ListBoxOptionProps extends AriaOptionProps {
  item: Node<unknown>
  state: ListState<unknown>
  small: boolean
}

const Option = (props: ListBoxOptionProps) => {
  const ref = useRef<HTMLLIElement>(null)
  const { item, state, small } = props
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref,
  )

  const showCheck = state.selectionManager.selectionMode !== 'none'
  return (
    <Wrap
      {...mergeProps(optionProps)}
      isSelected={isSelected}
      isDisabled={isDisabled}
      small={small}
      ref={ref}
    >
      <StateLayer isHovered={isFocused} opacityFactor={isSelected ? 1.4 : 1} />
      {showCheck && (
        <CheckIndent aria-hidden="true" visible={isSelected}>
          <IconDone />
        </CheckIndent>
      )}
      <Label>{item.rendered}</Label>
    </Wrap>
  )
}

export default Option

const Wrap = styled.li<{
  isSelected: boolean
  isDisabled: boolean
  small: boolean
}>`
  position: relative;
  display: flex;
  align-items: center;

  padding: ${(p) =>
    p.small ? `var(--space-0) var(--space-1)` : `var(--space-0-5) var(--space-1-5)`};
  padding-left: var(--space-1);
  border-radius: var(--border-radius-s);
  outline: none;
  white-space: nowrap;
  cursor: pointer;
  transition: ${(p) => p.theme.defaultTransitions}, background-color 0s,
    color var(--animation-medium-in);

  && {
    margin: 0;
  }

  ${(p) => p.isSelected && `color: var(--color-active-text);`}
`

const CheckIndent = styled.div<{ visible: boolean }>`
  ${(p) => p.theme.flexCenter};
  width: 1.2rem;
  height: 1.2rem;
  margin-right: var(--space-0);
  opacity: 0;
  transition: opacity var(--animation-medium-in);

  ${(p) => p.visible && `opacity:100%;`};
`

const Label = styled.span``
