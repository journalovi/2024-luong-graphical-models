// A reusable theme provider that allows for local theming.
// This is useful for small, contained areas that need to have
// a separate appearance from the rest of the UI. One example is
// theme inversion in the footer of some pages.
import { ReactNode, useContext, useMemo } from 'react'
import deepMerge from 'deepmerge'
import { ThemeProvider, useTheme } from 'styled-components'

import { getTheme,ThemeSettings } from '@theme'
import SettingsContext from '@utils/settingsContext'

interface LocalThemeProviderProps {
	children?: ReactNode
	recessed?: boolean
	raised?: boolean
}

const LocalThemeProvider = ({ children, recessed, raised }: LocalThemeProviderProps) => {
	const {
		settings: { theme: themeSettings },
	} = useContext(SettingsContext)
	const { elevation } = useTheme()

	// Falls back to current settings if
	// appearance is not defined
	const localTheme = useMemo(() => {
		const unboundedLocalElevation = elevation + (raised ? 1 : 0) + (recessed ? -1 : 0)
		const localElevation = Math.min(5, Math.max(0, unboundedLocalElevation))

		const localThemeSettings = deepMerge(themeSettings, {
			color: { elevation: localElevation },
		}) as ThemeSettings

		return getTheme(localThemeSettings)
	}, [themeSettings, elevation, raised, recessed])

	return <ThemeProvider theme={localTheme}>{children}</ThemeProvider>
}

export default LocalThemeProvider
