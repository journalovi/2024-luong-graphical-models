import { IGatsbyImageData } from 'gatsby-plugin-image'

export interface Page {
	readonly slug: string
	readonly title: string
	readonly path: string
}

export interface Section {
	readonly slug: string
	readonly name: string
	readonly path: string
}

export interface Author {
	readonly slug: string
	readonly name: string
	readonly path: string
}

export interface Story {
	readonly slug: string
	readonly title: string
	readonly description: string
	readonly longDescription: readonly string[]
	readonly metaInfo: readonly string[]
	readonly previewBackground: string
	readonly previews: {
		image: IGatsbyImageData
		alt: string
	}[][]
	readonly featuredIn?: readonly string[]
	readonly featuredSize: string
	readonly sections: readonly string[]
	readonly authors: readonly string[]
	readonly cover: {
		image: IGatsbyImageData
		alt: string
		colorScheme: 'light' | 'dark'
	}
	readonly path: string
	readonly buildInternalPage: boolean
	readonly externalLink?: string
	readonly sourceCodeLink?: string
}

export interface TableOfContentsItem {
	title: string
	url: string
	items?: TableOfContentsItem[]
}
