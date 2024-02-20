const visit = require('unist-util-visit')
const { Parser } = require('acorn')

function attributes(props) {
  return Object.entries(props).map(([key, value]) => ({
    type: 'mdxJsxAttribute',
    name: key,
    value:
      typeof value === 'string'
        ? value
        : {
            type: 'mdxJsxAttributeValueExpression',
            data: {
              estree: Parser.parse(`(${JSON.stringify(value)})`, {
                ecmaVersion: 'latest',
                sourceType: 'script',
              }),
            },
          },
  }))
}

module.exports = ({ markdownAST }) => {
  /**
   * Ordered list of reference IDs
   */
  const referenceOrder = []
  /**
   * Record of citations, organized by the corresponding reference keys.
   */
  const citations = {}

  visit(markdownAST, 'cite', (node) => {
    const { data } = node

    const citeItems = []
    data.citeItems.forEach(({ key, suppressAuthor, prefix, suffix }) => {
      const referenceId = key

      if (!referenceOrder.includes(referenceId)) {
        referenceOrder.push(referenceId)
      }

      if (!citations[referenceId]) {
        citations[referenceId] = []
      }

      const citationPosition = citations[referenceId].length
      const citationId =
        citationPosition <= 25
          ? String.fromCharCode(97 + citationPosition)
          : String(citationPosition - 25)
      citations[referenceId].push(citationId)

      const referenceNumber = referenceOrder.findIndex((id) => id === referenceId) + 1
      citeItems.push({
        id: citationId,
        referenceId,
        referenceNumber,
        suppressAuthor,
        prefix,
        suffix,
      })
    })

    node.type = 'mdxJsxFlowElement'
    node.name = 'Citation'
    node.attributes = attributes({ citeItems })
  })

  visit(markdownAST, 'mdxJsxFlowElement', (node) => {
    if (node.name === 'References') {
      node.attributes = attributes({
        order: referenceOrder,
        citations,
      })
    }
  })

  return markdownAST
}
