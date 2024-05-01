import { GatsbyConfig } from 'gatsby'
import { citePlugin } from '@benrbray/remark-cite'
import dotenv from 'dotenv'
import path from 'path'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? ''}`,
})

const config: GatsbyConfig = {
  pathPrefix: '/2024-luong-graphical-models',
  siteMetadata: {
    lang: 'en-US',
    dir: 'ltr',
    siteUrl: 'https://www.journalovi.org/2024-luong-graphical-models',
    title: 'Learning What’s in a Name with Graphical Models',
    description:
      'We explore three sequence models that are remarkably successful at named entity recognition: Hidden markov Models (HMMs), Maximum-Entropy Markov Models (MEMMs), and Conditional Random Fields (CRFs)',
    type: 'website',
    author: 'Vu Luong',
    authorTwitter: '@vuluongj20',
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-layout',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "Learning What's in a Name with Graphical Models",
        short_name: 'Graphical Models',
        start_url: '/',
        display: 'standalone',
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkMath, [citePlugin, {}]],
          rehypePlugins: [[rehypeKatex, { strict: 'ignore' }]],
        },
        gatsbyRemarkPlugins: [
          'gatsby-remark-references',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              className: 'autolinked-header',
              elements: ['h2', 'h3'],
            },
          },
        ],
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'stories',
        path: './src/article/',
      },
      __key: 'stories',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    'gatsby-transformer-json',

    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@icons': path.resolve(__dirname, 'src/icons'),
          '@types': path.resolve(__dirname, 'src/types'),
          '@layouts': path.resolve(__dirname, 'src/layouts'),
          '@theme': path.resolve(__dirname, 'src/layouts/theme'),
          '@images': path.resolve(__dirname, 'src/images'),
        },
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      },
    },
    {
      resolve: 'gatsby-plugin-gatsby-cloud',
      options: {
        headers: {
          'fonts/*': [
            'Cache-Control: public,max-age=31536000,s-maxage=31536000,immutable',
          ],
        },
      },
    },
  ],
}

export default config
