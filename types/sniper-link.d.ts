// TypeScript declarations for Sniper Link custom element
declare namespace JSX {
  interface IntrinsicElements {
    'sniper-link': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        recipient: string
        sender: string
        template?: string
      },
      HTMLElement
    >
  }
}
