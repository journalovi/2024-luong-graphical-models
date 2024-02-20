import { graphql, PageProps } from 'gatsby'

import SEO from '@components/seo'

import Story from '../article'

const Component = () => {
  return <Story />
}

export default Component

export const Head = ({ pageContext }: PageProps) => (
  <SEO {...pageContext} title="Learning What’s in a Name with Graphical Models" />
)

export const query = graphql`
  query CreatePagesTOC {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/article/content.mdx$/" } } }
    ) {
      nodes {
        tableOfContents(maxDepth: 3)
      }
    }
  }
`
