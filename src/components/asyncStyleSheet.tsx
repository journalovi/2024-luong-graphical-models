import { Fragment, useRef, useState } from 'react'

interface AsyncStylesheetProps {
	href: string
}

const AsyncStylesheet = ({ href }: AsyncStylesheetProps) => {
	const linkRef = useRef<HTMLLinkElement>(null)
	const [loaded, setLoaded] = useState(false)

	return (
		<Fragment>
			<link
				ref={linkRef}
				href={href}
				rel="stylesheet"
				media={loaded ? 'print' : 'all'}
				onLoad={() => setLoaded(true)}
			/>
			<noscript>
				<link rel="stylesheet" href={href} />
			</noscript>
		</Fragment>
	)
}

export default AsyncStylesheet
