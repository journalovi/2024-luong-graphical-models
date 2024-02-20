/* eslint-disable @typescript-eslint/no-empty-interface */
import { Theme } from '@theme'

import 'styled-components'

/** Add type checking to theme prop */
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
