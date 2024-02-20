import { GatsbyNode } from 'gatsby'
import { RelativeCiAgentWebpackPlugin } from '@relative-ci/agent'

import graphQLTypes from './src/types/graphql'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  stage,
  actions,
}) => {
  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      plugins: [
        new RelativeCiAgentWebpackPlugin({
          enabled: process.env.NODE_ENV === 'production' && !!process.env.RELATIVE_CI,
        }),
      ],
    })
  }
}

export const onCreateBabelConfig: GatsbyNode['onCreateBabelConfig'] = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-transform-react-jsx',
    options: {
      runtime: 'automatic',
    },
  })
}

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}) => {
  actions.createTypes(graphQLTypes)
}
