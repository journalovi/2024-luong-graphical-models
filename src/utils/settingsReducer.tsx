import { ThemeSettings } from '@theme'
import { isObject } from '@utils/functions'

export interface Settings {
	theme: ThemeSettings
}

export type Action =
	| { type: 'update-color'; key: string; value: string }
	| { type: 'update-text'; key: string; value: string }

export const defaultSettings: Settings = {
	theme: {
		color: {
			appearance: 'auto',
			lightPalette: 'paper',
			darkPalette: 'charcoal',
			elevation: 3,
			increaseContrast: false,
		},
		text: {
			system: 'sohne',
			content: 'sohne',
			viz: 'sohneMono',
		},
		alwaysShowVideoCaptions: false,
	},
}

const reconcileSettings = <T extends object>(settings: T, defaultSettings: T): T => {
	if (!isObject(settings)) {
		return defaultSettings
	}

	const returnObj = defaultSettings

	;(Object.keys(returnObj) as (keyof T)[]).forEach((key) => {
		if (isObject(defaultSettings[key])) {
			returnObj[key] = reconcileSettings(settings[key], defaultSettings[key])
			return
		}

		returnObj[key] = settings[key] ?? defaultSettings[key]
	})

	return returnObj
}

export const init = (defaultSettings: Settings): Settings => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return defaultSettings
	}

	const localSettings = JSON.parse(localStorage.getItem('UP') ?? '{}') as Settings
	return reconcileSettings(localSettings, defaultSettings)
}

export const reducer = (state: Settings, action: Action): Settings => {
	switch (action.type) {
		case 'update-color':
			return {
				...state,
				theme: {
					...state.theme,
					color: {
						...state.theme.color,
						[action.key]: action.value,
					},
				},
			}
		case 'update-text':
			return {
				...state,
				theme: {
					...state.theme,
					text: {
						...state.theme.text,
						[action.key]: action.value,
					},
				},
			}
		default:
			return state
	}
}
