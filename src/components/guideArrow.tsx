import { forwardRef, ForwardRefRenderFunction, SVGAttributes, useMemo } from 'react'
import { nanoid } from 'nanoid'
import styled from 'styled-components'

type Position = 'top' | 'bottom' | 'left' | 'right'

const getPoint = (width: number, height: number, position: Position) => {
  switch (position) {
    case 'top':
      return `${width / 2} 0`
    case 'bottom':
      return `${width / 2} ${height}`
    case 'left':
      return `0 ${height / 2}`
    case 'right':
      return `${width} ${height / 2}`
  }
}

const controlRatio = 0.75
const getControlPoint = (width: number, height: number, position: Position) => {
  switch (position) {
    case 'top':
      return `${width / 2} ${(height / 2) * controlRatio}`
    case 'bottom':
      return `${width / 2} ${height - (height / 2) * controlRatio}`
    case 'left':
      return `${(width / 2) * controlRatio} ${height / 2}`
    case 'right':
      return `${width - (width / 2) * controlRatio} ${height / 2}`
  }
}

interface GuideArrowProps extends SVGAttributes<SVGSVGElement> {
  from: Position
  to: Position
  width?: number
  height?: number
}

const GuideArrow: ForwardRefRenderFunction<SVGSVGElement, GuideArrowProps> = (
  { width = 48, height = 48, from, to, ...props },
  ref,
) => {
  const arrowMarkerId = useMemo(() => nanoid(), [])

  const linePath = useMemo(() => {
    return [
      'M',
      getPoint(width, height, from),
      'C',
      getControlPoint(width, height, from),
      ',',
      getControlPoint(width, height, to),
      ',',
      getPoint(width, height, to),
    ].join('')
  }, [from, to, width, height])

  const arrowMarkerSize = useMemo(
    () => Math.max(Math.min(width, height) / 4, 8),
    [width, height],
  )
  const arrowMarkerPath = useMemo(
    () =>
      [
        'M',
        arrowMarkerSize * 0.2,
        ' ',
        arrowMarkerSize * 0.2,
        'L',
        arrowMarkerSize * 0.8,
        ' ',
        arrowMarkerSize * 0.5,
        'L',
        arrowMarkerSize * 0.2,
        ' ',
        arrowMarkerSize * 0.8,
      ].join(''),
    [arrowMarkerSize],
  )

  return (
    <SVG
      ref={ref}
      overflow="visible"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      {...props}
    >
      <defs>
        <marker
          id={`arrow-marker-${arrowMarkerId}`}
          viewBox={`0 0 ${arrowMarkerSize} ${arrowMarkerSize}`}
          markerWidth={arrowMarkerSize}
          markerHeight={arrowMarkerSize}
          markerUnits="userSpaceOnUse"
          refX={arrowMarkerSize * 0.8}
          refY={arrowMarkerSize * 0.5}
          orient="auto-start-reverse"
        >
          <path d={arrowMarkerPath} />
        </marker>
      </defs>

      <path
        d={linePath}
        markerEnd={`url(#arrow-marker-${arrowMarkerId})`}
        vectorEffect="non-scaling-stroke"
      />
    </SVG>
  )
}

export default forwardRef(GuideArrow)

const SVG = styled.svg`
  flex-shrink: 0;
  fill: none;
  stroke: var(--color-bar);
  stroke-linecap: round;
  stroke-linejoin: round;
`
