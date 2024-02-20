export type Breakpoint = 'xs' | 's' | 'm' | 'l' | 'xl'
/**
 * List of breakpoints. This should be in the utils folder
 * instead of the theme folder since we may want to import it
 * into individual components too.
 */
export const breakpoints = {
	xl: '90rem', // 1440px
	l: '78rem', // 1248px
	m: '64rem', // 1024px
	s: '48rem', // 768px
	xs: '30rem', // 480px
}
/** Useful for comparing with window.innerWidth */
export const numericBreakpoints = {
	xl: 1440,
	l: 1184,
	m: 1024,
	s: 768,
	xs: 480,
}
export const orderedBreakpoints: Breakpoint[] = ['xl', 'l', 'm', 's', 'xs']
