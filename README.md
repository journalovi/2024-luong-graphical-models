
# Learning What’s in a Name with Graphical Models

An interactive article in the [Journal of Visualization and Interaction (JoVI)](https://journalovi.org/).

## Abstract

“The UK” is a country, but “The UK Department of Transport” is an organization within that country. In a named entity recognition (NER) task, where we want to label each word with a name tag (organization/person/location/other/not a name), how can a computer model know one from the other?

In this article, we’ll explore three model families that are remarkably successful at NER: Hidden Markov Models (HMMs), Maximum-Entropy Markov Models (MEMMs), and Conditional Random Fields (CRFs). We’ll use interactive visualizations to explain the graphical structure of each. Our overarching goal is to demonstrate how visualizations can be effective tools for communicating and clarifying complex, abstract concepts. The visualizations will allow us to compare and contrast between model families, and understand how each builds on and addresses key issues affecting its predecessors.

## Repository

This is a self-contained version of "Learning What’s in a Name with Graphical Models". The HTML & JavaScript that is generated (via `yarn build`) works without needing a live backend. A pre-built version is available in `/public`.

The full version (connected to a live backend, and thus can provide predictions of arbitrary string inputs) lives on [graphical-models.netlify.app](https://graphical-models.netlify.app).

## Setup

First, to install the required packages, run the following commands in bash:

```
yarn install
yarn global add gatsby-cli
```

Then, to start a local development server, just run:

```
yarn dev
```

That's it! The site should be up and running on [localhost:8000](http://localhost:8000).

To build, just run:

```
yarn build
```

And the compiled site will be in `/public`.

## Project Structure

```
| src
    | pages
    | layouts
    | components
    | images
| public
```

In the `src` folder:

- `pages` contains files to be turned into individual pages during the Gatsby build process. This project only has a single index page, so there is only one file, `index.js` in here.

- `article` is where the article's main content (text, visualizations, etc.) lives

- `layouts` stores a global layout component that is wrapped around every page. This is useful for providing global contexts, like a theme context. Implemented using `gatsby-plugin-layout` [(view docs)](https://www.gatsbyjs.com/plugins/gatsby-plugin-layout/).

- `images` contains all raw image files that will be transformed into dynamic, efficient image formats through `gatsby-plugin-image` [(view docs)](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

- `components` is where to store the reusable React components and page-specific components.

The `public` folder contains the built website (after running `yarn build`).

## Resources

Here are some quick links to documentation for core packages:

- [Gatsby](https://www.gatsbyjs.com/docs/)

- [React](https://reactjs.org/docs/getting-started.html)

- [MDX](https://mdxjs.com) (Markdown documents with JSX support)

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

```
Authors: @vuluongj20
OC: @chatchavan
AE: @jsndyks
R1: @cy99vis
R2: @joviewer-xyz
R3: @flipz357
(also agreed : @msedl)
```
