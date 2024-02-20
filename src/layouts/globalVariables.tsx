import { css } from 'styled-components'

import { charcoalPalette, colorDeclarations, paperPalette } from './globalBaseColors'

export const navHeight = 48

const globalVariables = css`
  :root {
    /* Colors */
    --color-white: #f1f2f4;
    --color-black: #212529;

    /* Paper palette */
    ${paperPalette}

    /* Charcoal palette */
    ${charcoalPalette}

    /* Semantic colors */
    --color-heading: var(--color-scale-gray2);
    --color-body: var(--color-scale-gray2);
    --color-label: var(--color-scale-gray5);
    --color-bar: var(--color-scale-gray7);
    --color-surface-border: var(--color-scale-gray9);
    --color-focus: var(--color-scale-red3);
    --color-button-label: var(--color-scale-gray1);
    --color-button-label-hover: var(--color-scale-gray3);
    --color-primary-text: var(--color-scale-red1);
    --color-primary-background: var(--color-scale-red2);
    --color-primary-opaque-background: var(--color-scale-red6);
    --color-primary-border: var(--color-scale-red5);
    --color-secondary-text: var(--color-scale-gray1);
    --color-secondary-background: var(--color-scale-gray8);
    --color-secondary-opaque-background: var(--color-scale-gray8);
    --color-secondary-border: var(--color-scale-gray9);
    --color-on-primary-background: var(--color-white);
    --color-active-text: var(--color-scale-red1);
    --color-active-background: var(--color-scale-red2);
    --color-active-border: var(--color-scale-red5);
    --color-on-active-background: var(--color-white);
    --color-success-text: var(--color-scale-red1);
    --color-success-background: var(--color-scale-red2);
    --color-on-success-background: var(--color-white);
    --color-error-text: var(--color-scale-red1);
    --color-error-background: var(--color-scale-red2);
    --color-on-error-background: var(--color-white);
    --color-link-text: var(--color-scale-gray1);
    --color-link-underline: var(--color-scale-gray7);
    --color-link-underline-hover: var(--color-scale-gray5);
    --color-content-link-text: var(--color-scale-gray1);
    --color-content-link-underline: var(--color-scale-gray6);
    --color-content-link-underline-hover: var(--color-scale-gray5);
    --color-primary-link-text: var(--color-scale-red1);
    --color-primary-link-underline: var(--color-scale-red4);

    /* Light box shadows */
    --box-shadow-light-s: 0 1px 2px rgb(33 37 41 / 4%);
    --box-shadow-light-m: 0 1px 4px rgb(33 37 41 / 6%);
    --box-shadow-light-l: 0 4px 32px rgb(33 37 41 / 8%);
    --box-shadow-light-text: 0 1px 8px rgb(33 37 41 / 16%);

    /* Light active box shadows */
    --box-shadow-light-active-s: 0 1px 2px rgb(164 77 55 / 4%);
    --box-shadow-light-active-m: 0 1px 4px rgb(164 77 55 / 6%);
    --box-shadow-light-active-l: 0 4px 32px rgb(164 77 55 / 8%);
    --box-shadow-light-active-text: 0 1px 8px rgb(164 77 55 / 16%);

    /* Dark box shadows */
    --box-shadow-dark-s: 0 1px 2px rgb(25 25 25);
    --box-shadow-dark-m: 0 1px 4px rgb(25 25 25);
    --box-shadow-dark-l: 0 4px 32px rgb(25 25 25);
    --box-shadow-dark-text: 0 1px 12px rgb(25 25 25 / 32%);

    /* Dark active box shadows */
    --box-shadow-dark-active-s: 0 1px 2px rgb(77 35 25 / 6%);
    --box-shadow-dark-active-m: 0 1px 4px rgb(77 35 25 / 8%);
    --box-shadow-dark-active-l: 0 4px 32px rgb(77 35 25 / 12%);
    --box-shadow-dark-active-text: 0 1px 12px rgb(77 35 25 / 20%);

    /* Page margins */
    --page-margin-left: max(4rem, var(--sal, 0px));
    --page-margin-right: max(4rem, var(--sar, 0px));

    /* Grid gaps */
    --grid-column-gap: var(--space-3);

    /* Sizes */
    --size-xs: 30rem;
    --size-s: 48rem;
    --size-m: 64rem;
    --size-l: 78rem;
    --size-xl: 90rem;

    /* Max site width */
    --max-site-width: 90rem;

    /* Nav sizes */
    --nav-width: 100%;
    --nav-height: ${navHeight}px;

    /* Z-indices */
    --z-index-popover: 10;
    --z-index-tooltip: 10;
    --z-index-dialog: 11;
    --z-index-nav: 20;
    --z-index-toc: 21;

    /* Border radii */
    --border-radius-xs: 0.25rem;
    --border-radius-s: 0.375rem;
    --border-radius-m: 0.5rem;
    --border-radius-l: 0.75rem;

    /* Animation easings */
    --ease-in-sine: cubic-bezier(0.12, 0, 0.39, 0);
    --ease-out-sine: cubic-bezier(0.61, 1, 0.88, 1);
    --ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);
    --ease-in-quad: cubic-bezier(0.11, 0, 0.5, 0);
    --ease-out-quad: cubic-bezier(0.5, 1, 0.89, 1);
    --ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1);
    --ease-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);
    --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
    --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
    --ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
    --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
    --ease-in-quint: cubic-bezier(0.64, 0, 0.78, 0);
    --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
    --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
    --ease-in-circ: cubic-bezier(0.55, 0, 1, 0.45);
    --ease-out-circ: cubic-bezier(0, 0.55, 0.45, 1);
    --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
    --ease-in-back: cubic-bezier(0.36, 0, 0.66, -0.56);
    --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-in-out-back: cubic-bezier(0.68, -0.6, 0.32, 1.6);

    /* Animations */
    --animation-v-fast-in: 0.125s var(--ease-in-quad);
    --animation-v-fast-out: 0.125s var(--ease-out-quad);
    --animation-v-fast-in-out: 0.125s var(--ease-in-out-quad);
    --animation-fast-in: 0.25s var(--ease-in-quart);
    --animation-fast-out: 0.25s var(--ease-out-quart);
    --animation-fast-in-out: 0.25s var(--ease-in-out-quart);
    --animation-medium-in: 0.5s var(--ease-in-quart);
    --animation-medium-out: 0.5s var(--ease-out-quart);
    --animation-medium-in-out: 0.5s var(--ease-in-out-quart);
    --animation-slow-in: 0.75s var(--ease-in-cubic);
    --animation-slow-out: 0.75s var(--ease-out-cubic);
    --animation-slow-in-out: 0.75s var(--ease-in-out-cubic);

    /* Space */
    --space-0: 4px;
    --space-0-5: 6px;
    --space-1: 8px;
    --space-1-5: 12px;
    --space-2: 16px;
    --space-3: 24px;
    --space-4: 32px;
    --space-5: 48px;
    --space-6: 64px;
    --space-7: 96px;
    --space-8: 128px;

    /* Adaptive space */
    --adaptive-space-0: var(--space-0);
    --adaptive-space-0-5: var(--space-0-5);
    --adaptive-space-1: var(--space-1);
    --adaptive-space-1-5: var(--space-1-5);
    --adaptive-space-2: var(--space-2);
    --adaptive-space-3: var(--space-3);
    --adaptive-space-4: var(--space-4);
    --adaptive-space-5: var(--space-5);
    --adaptive-space-6: var(--space-6);
    --adaptive-space-7: var(--space-7);
    --adaptive-space-8: var(--space-8);

    ${(p) => p.theme.breakpoints.xl} {
      --adaptive-space-0: var(--space-0);
      --adaptive-space-0-5: var(--space-0-5);
      --adaptive-space-1: var(--space-1);
      --adaptive-space-1-5: var(--space-1-5);
      --adaptive-space-2: var(--space-2);
      --adaptive-space-3: var(--space-3);
      --adaptive-space-4: var(--space-4);
      --adaptive-space-5: var(--space-5);
      --adaptive-space-6: var(--space-6);
      --adaptive-space-7: var(--space-7);
      --adaptive-space-8: var(--space-8);
    }

    ${(p) => p.theme.breakpoints.l} {
      --adaptive-space-0: var(--space-0);
      --adaptive-space-0-5: var(--space-0-5);
      --adaptive-space-1: var(--space-1);
      --adaptive-space-1-5: var(--space-1-5);
      --adaptive-space-2: var(--space-2);
      --adaptive-space-3: var(--space-3);
      --adaptive-space-4: var(--space-4);
      --adaptive-space-5: var(--space-5);
      --adaptive-space-6: var(--space-6);
      --adaptive-space-7: var(--space-7);
      --adaptive-space-8: var(--space-8);
    }

    ${(p) => p.theme.breakpoints.m} {
      --adaptive-space-0: var(--space-0);
      --adaptive-space-0-5: var(--space-0-5);
      --adaptive-space-1: var(--space-1);
      --adaptive-space-1-5: var(--space-1);
      --adaptive-space-2: var(--space-1-5);
      --adaptive-space-3: var(--space-2);
      --adaptive-space-4: var(--space-3);
      --adaptive-space-5: var(--space-4);
      --adaptive-space-6: var(--space-5);
      --adaptive-space-7: var(--space-6);
      --adaptive-space-8: var(--space-7);
    }

    ${(p) => p.theme.breakpoints.s} {
      --grid-column-gap: var(--space-2);
      --adaptive-space-0: var(--space-0);
      --adaptive-space-0-5: var(--space-0-5);
      --adaptive-space-1: var(--space-1);
      --adaptive-space-1-5: var(--space-1);
      --adaptive-space-2: var(--space-1-5);
      --adaptive-space-3: var(--space-2);
      --adaptive-space-4: var(--space-3);
      --adaptive-space-5: var(--space-4);
      --adaptive-space-6: var(--space-5);
      --adaptive-space-7: var(--space-6);
      --adaptive-space-8: var(--space-7);
    }

    ${(p) => p.theme.breakpoints.mobile} {
      --page-margin-left: max(2rem, var(--sal, 0px));
      --page-margin-right: max(2rem, var(--sar, 0px));
    }

    ${(p) => p.theme.breakpoints.xs} {
      --page-margin-left: max(1rem, var(--sal, 0px));
      --page-margin-right: max(1rem, var(--sar, 0px));
      --grid-column-gap: var(--space-1);
      --adaptive-space-0: var(--space-0);
      --adaptive-space-0-5: var(--space-0);
      --adaptive-space-1: var(--space-0-5);
      --adaptive-space-1-5: var(--space-0-5);
      --adaptive-space-2: var(--space-1);
      --adaptive-space-3: var(--space-1-5);
      --adaptive-space-4: var(--space-2);
      --adaptive-space-5: var(--space-2);
      --adaptive-space-6: var(--space-3);
      --adaptive-space-7: var(--space-4);
      --adaptive-space-8: var(--space-5);
    }

    /* Safe areas */
    @supports (padding-top: env(safe-area-inset-top)) {
      --sat: env(safe-area-inset-top);
      --sar: env(safe-area-inset-right);
      --sab: env(safe-area-inset-bottom);
      --sal: env(safe-area-inset-left);
    }
  }

  html {
    &[data-theme='auto'] {
      @media (prefers-color-scheme: light) {
        --box-shadow-s: var(--box-shadow-light-s);
        --box-shadow-m: var(--box-shadow-light-m);
        --box-shadow-l: var(--box-shadow-light-l);
        --box-shadow-active-s: var(--box-shadow-light-active-s);
        --box-shadow-active-m: var(--box-shadow-light-active-m);
        --box-shadow-active-l: var(--box-shadow-light-active-l);
        ${colorDeclarations('paper')}
      }

      @media (prefers-color-scheme: dark) {
        --box-shadow-s: var(--box-shadow-dark-s);
        --box-shadow-m: var(--box-shadow-dark-m);
        --box-shadow-l: var(--box-shadow-dark-l);
        --box-shadow-active-s: var(--box-shadow-dark-active-s);
        --box-shadow-active-m: var(--box-shadow-dark-active-m);
        --box-shadow-active-l: var(--box-shadow-dark-active-l);
        ${colorDeclarations('charcoal')}
      }
    }

    &[data-theme='light'] {
      --box-shadow-s: var(--box-shadow-light-s);
      --box-shadow-m: var(--box-shadow-light-m);
      --box-shadow-l: var(--box-shadow-light-l);
      --box-shadow-active-s: var(--box-shadow-light-active-s);
      --box-shadow-active-m: var(--box-shadow-light-active-m);
      --box-shadow-active-l: var(--box-shadow-light-active-l);
      ${colorDeclarations('paper')}
    }

    &[data-theme='dark'] {
      --box-shadow-s: var(--box-shadow-dark-s);
      --box-shadow-m: var(--box-shadow-dark-m);
      --box-shadow-l: var(--box-shadow-dark-l);
      --box-shadow-active-s: var(--box-shadow-dark-active-s);
      --box-shadow-active-m: var(--box-shadow-dark-active-m);
      --box-shadow-active-l: var(--box-shadow-dark-active-l);
      ${colorDeclarations('charcoal')}
    }
  }

  .surface-1 {
    --color-line: var(--color-scale-gray9);
    --color-line-subtle: var(--color-scale-gray9);
    ${generateSurfaceAliases(1)}
  }

  .surface-2 {
    --color-line: var(--color-scale-gray9);
    --color-line-subtle: var(--color-scale-gray9);
    ${generateSurfaceAliases(2)}
  }

  html,
  .surface-3 {
    --color-line: var(--color-scale-gray9);
    --color-line-subtle: var(--color-scale-gray9);
    ${generateSurfaceAliases(3)}
  }

  .surface-4 {
    --color-line: var(--color-scale-gray8);
    --color-line-subtle: var(--color-scale-gray9);
    ${generateSurfaceAliases(4)}
  }

  .surface-5 {
    --color-line: var(--color-scale-gray8);
    --color-line-subtle: var(--color-scale-gray9);
    ${generateSurfaceAliases(5)}
  }
`

// prettier-ignore
function generateSurfaceAliases(level: number) {
  const current = level
  const raised = Math.min(5, level + 1)
  const raisedHigher = Math.min(5, level + 2)
  const recessed = Math.max(0, level - 1)
  const recessedLower = Math.max(0, level - 2)

  return css`
    --color-background: var(--color-scale-surface${current});
    --color-background-alpha-transparent: var(--color-scale-surface${current}-alpha-transparent);
    --color-background-alpha-translucent: var(--color-scale-surface${current}-alpha-translucent);
    --color-background-alpha-backdrop: var(--color-scale-surface${current}-alpha-backdrop);
    --color-background-raised: var(--color-scale-surface${raised});
    --color-background-raised-alpha-transparent: var(
      --color-scale-surface${raised}-alpha-transparent
    );
    --color-background-raised-alpha-translucent: var(
      --color-scale-surface${raised}-alpha-translucent
    );
    --color-background-raised-alpha-backdrop: var(--color-scale-surface${raised}-alpha-backdrop);
    --color-background-raised-higher: var(--color-scale-surface${raisedHigher});
    --color-background-recessed: var(--color-scale-surface${recessed});
    --color-background-recessed-lower: var(--color-scale-surface${recessedLower});
  `
}
/* stylelint-enable custom-property-pattern */

export default globalVariables
