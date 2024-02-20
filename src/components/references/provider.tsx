import { createContext,ReactNode } from 'react'

export const ReferencesContext = createContext<CSL.Data[]>([])

interface ReferencesProps {
	references: CSL.Data[]
	children?: ReactNode
}

export const ReferencesProvider = ({ references, children }: ReferencesProps) => {
	return (
		<ReferencesContext.Provider value={references}>{children}</ReferencesContext.Provider>
	)
}
