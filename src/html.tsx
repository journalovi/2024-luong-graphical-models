import { HTMLAttributes, ReactNode } from 'react'

interface HTMLProps {
  htmlAttributes: HTMLAttributes<HTMLHtmlElement>
  headComponents: ReactNode
  bodyAttributes: HTMLAttributes<HTMLBodyElement>
  preBodyComponents: ReactNode
  body: string
  postBodyComponents: ReactNode
}

const HTML = (props: HTMLProps) => {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <link rel="stylesheet" href="/katex.min.css" />
        {props.headComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{let e=JSON.parse(localStorage.getItem("UP")),t=e?.theme?.color?.appearance,a=e?.theme?.color?.lightPalette,l=e?.theme?.color?.darkPalette;document.documentElement.dataset.theme=t||"auto",a&&(document.documentElement.dataset.paletteLight=a),l&&(document.documentElement.dataset.paletteDark=l)}catch(m){console.warn(m)}}();`,
          }}
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

export default HTML
