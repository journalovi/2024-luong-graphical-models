// Theme provider for the entire app. This consumes the
// user settings context.
import { ReactNode, useContext, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { getTheme } from '@theme'
import SettingsContext from '@utils/settingsContext'

interface GlobalThemeProviderProps {
	children: ReactNode
}

const GlobalThemeProvider = ({ children }: GlobalThemeProviderProps) => {
	const {
		settings: { theme: themeSettings },
	} = useContext(SettingsContext)
	const theme = useMemo(() => getTheme(themeSettings), [themeSettings])

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default GlobalThemeProvider
