import { forwardRef, ForwardRefRenderFunction, HTMLAttributes } from 'react'
import { AriaListBoxOptions, useListBox } from '@react-aria/listbox'
import { useObjectRef } from '@react-aria/utils'
import { ListState } from '@react-stately/list'
import styled from 'styled-components'

import Option from '@components/listBox/option'
import Section from '@components/listBox/section'

interface ListBoxProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'onBlur' | 'onFocus' | 'autoFocus'>,
    AriaListBoxOptions<unknown> {
  state: ListState<unknown>
  small?: boolean
}

const BaseListBox: ForwardRefRenderFunction<HTMLUListElement, ListBoxProps> = (
  { state, small = false, ...props },
  forwardedRef,
) => {
  const ref = useObjectRef(forwardedRef)
  const { listBoxProps } = useListBox(props, state, ref)

  return (
    <StyledListBox ref={ref} {...listBoxProps}>
      {[...state.collection].map((el) => {
        if (el.type === 'section') {
          return <Section key={el.key} section={el} state={state} small={small} />
        }
        return <Option key={el.key} item={el} state={state} small={small} />
      })}
    </StyledListBox>
  )
}

const ListBox = forwardRef(BaseListBox)

export default ListBox

const StyledListBox = styled.ul`
  padding: 0;
  margin: 0;
  min-width: 8rem;
  border-radius: var(--border-radius-m);
  list-style-type: none;

  :focus {
    outline: none;
  }
  :focus-visible {
    outline: none;
  }
`
