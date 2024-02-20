import { createGlobalStyle } from 'styled-components'

import globalVariables from './globalVariables'

const GlobalStyles = createGlobalStyle`
  ${globalVariables}

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--animation-medium-out), 
      border-color var(--animation-medium-out),
      box-shadow var(--animation-medium-out);
  }

  html {
    font-size: 100%;
    line-height: 1.2;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    scroll-padding-top: var(--nav-height);

    ${(p) => p.theme.breakpoints.xs} {
      scroll-behavior: auto;
    }
  }

  body {
    ${(p) => p.theme.text.body2}; 
    background: var(--color-background);
    color: var(--color-body);
    font-feature-settings: 'kern', 'liga';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    direction: ltr;
    text-align: left;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    position: relative;
    color: var(--color-heading);
    margin: 0;
  }
  h1 {${(p) => p.theme.text.h1}}
  h2 {${(p) => p.theme.text.h2}}
  h3 {${(p) => p.theme.text.h3}}
  h4 {${(p) => p.theme.text.h4}}
  h5 {${(p) => p.theme.text.h5}}
  h6 {${(p) => p.theme.text.h6}}

  p, a, li, input, label {
    ${(p) => p.theme.text.body2}; 
    color: var(--color-body);
    margin: 0;
  }

  small {
    ${(p) => p.theme.text.small}; 
    color: var(--color-label);
  }

  strong {
    color: var(--color-heading);
  }

  a {
    cursor: pointer;
    border-radius: var(--border-radius-xs);

    text-decoration-line: underline;
    text-decoration-color: transparent;
    transition: color var(--animation-v-fast-out), 
      box-shadow var(--animation-v-fast-out);
  }
  a:hover:not([data-no-underline="true"]) {
    text-decoration-color: var(--color-link-underline);
  }
  a:focus {
    outline: none;
  }
  a.focus-visible {
    ${(p) => p.theme.focusVisible}; 
  }

  button {
    margin: 0;
  }


  input {
    appearance: none;
    font-size: 1rem;
    transition: color var(--animation-v-fast-out), 
      box-shadow var(--animation-v-fast-out);
  }
  input:focus {
    outline: none;
  }
  input.focus-visible {
    ${(p) => p.theme.focusVisible}; 
  }

  ol, ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
  }

  abbr {
    text-decoration: none;
    
    @media not all and (hover: none) {
      text-decoration: underline;
      text-decoration-style: dotted;
      text-decoration-color: var(--color-content-link-underline);
      text-decoration-thickness: 0.05rem;
    }
  }

  svg {
    overflow: visible;
  }

  .tl-edges {
    overflow: initial;
  }

  .autolinked-header.before {
    ${(p) => p.theme.flexCenter};
    height: 100%;
    padding-right: var(--space-0-5);

    > div {
      ${(p) => p.theme.flexCenter};
    }

    ${(p) => p.theme.breakpoints.xs} {
      padding-right: var(--space-0);
    }
  }
  .autolinked-header svg {
    fill: var(--color-label);

    ${(p) => p.theme.breakpoints.xs} {
      width: 0.75em;
    }
  }

  .math, .math-display {
    contain: content;
  }

  .katex {
    display: inline-block;
    color: transparent;
    transition: color var(--animation-v-fast-out);
  }
  .katex-display {
    ${(p) => p.theme.text.body1}
    margin-bottom: var(--adaptive-space-3);

    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`

export default GlobalStyles
