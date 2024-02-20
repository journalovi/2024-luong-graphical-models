// A React context for global user settings.
// This context is provided in layouts/index.tsx and is available
// globally to all pages and components vis useContext().
import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react'

import { Action, defaultSettings, init, reducer,Settings } from '@utils/settingsReducer'

interface _SettingsContext {
	settings: Settings
	dispatch: Dispatch<Action>
}

const SettingsContext = createContext<_SettingsContext>({
	settings: defaultSettings,
	dispatch: () => false,
})

interface SettingsProviderProps {
	children: ReactNode
}

const SettingsProvider = ({ children }: SettingsProviderProps) => {
	const [settings, dispatch] = useReducer(reducer, defaultSettings, init)

	// Update local storage on state change
	useEffect(() => {
		localStorage.setItem('UP', JSON.stringify(settings))
	}, [settings])

	return (
		<SettingsContext.Provider value={{ settings, dispatch }}>
			{children}
		</SettingsContext.Provider>
	)
}

export { SettingsContext as default, SettingsProvider }
