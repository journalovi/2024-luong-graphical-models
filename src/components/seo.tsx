import { Fragment, ReactNode } from 'react'
import { graphql, useStaticQuery, withPrefix } from 'gatsby'

export interface SEOProps {
  title?: string
  description?: string
  type?: string
  author?: string
  authorTwitter?: string
  image?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  children?: ReactNode
}

const SEO = ({
  title,
  description,
  type,
  author,
  authorTwitter,
  image,
  children,
}: SEOProps) => {
  const data = useStaticQuery<Queries.SiteMetadataQuery>(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            description
            type
            author
            authorTwitter
            siteUrl
          }
        }
      }
    `,
  )

  const siteMetadata = data.site?.siteMetadata

  const seo = {
    title: title ?? `Graphical Models`,
    description: description ?? siteMetadata?.description,
    type: type ?? siteMetadata?.type,
    author: author ?? siteMetadata?.author,
    authorTwitter: authorTwitter ?? siteMetadata?.authorTwitter,
    image: image ?? {
      src: withPrefix('og.png'),
      alt: 'Wordmark logo with the letter G \\',
      width: 1200,
      height: 630,
    },
  }

  return (
    <Fragment>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="author" content={seo.author} />
      <meta name="image" content={seo.image.src} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:site_name" content={siteMetadata?.title} />
      <meta name="og:type" content={seo.type} />
      <meta name="og:image" content={seo.image.src} />
      <meta name="og:image:alt" content={seo.image.alt} />
      <meta name="og:image:width" content={String(seo.image.width)} />
      <meta name="og:image:height" content={String(seo.image.height)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seo.authorTwitter} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image.src} />
      <meta name="twitter:image:alt" content={seo.image.alt} />
      {children}
    </Fragment>
  )
}

export default SEO
