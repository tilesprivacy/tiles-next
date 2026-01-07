export default function Head() {
  const style = `
:root {
  --nextra-primary-hue: 357deg;
  --nextra-primary-saturation: 67%;
  --nextra-primary-lightness: 45%;
  --nextra-bg: 250,250,250;
  --pagefind-ui-text: #0f172a;
  --pagefind-ui-background: #ffffff;
  --pagefind-ui-border: #e2e8f0;
}
.dark {
  --nextra-primary-hue: 357deg;
  --nextra-primary-saturation: 67%;
  --nextra-primary-lightness: 55%;
  --nextra-bg: 17,17,17;
  --pagefind-ui-text: #f1f5f9;
  --pagefind-ui-background: #1e293b;
  --pagefind-ui-border: #334155;
}
::selection {
  background: hsla(
    var(--nextra-primary-hue),
    var(--nextra-primary-saturation),
    var(--nextra-primary-lightness),
    0.3
  );
}
html {
  background: rgb(var(--nextra-bg));
}

[class*="nextra-content"] a,
[data-pagefind-body] a,
article a {
  color: #2563eb;
  text-decoration: none;
}

[class*="nextra-content"] a:hover,
[data-pagefind-body] a:hover,
article a:hover {
  color: #1d4ed8;
  text-decoration: none;
}

.dark [class*="nextra-content"] a,
.dark [data-pagefind-body] a,
.dark article a {
  color: #3b82f6;
}

.dark [class*="nextra-content"] a:hover,
.dark [data-pagefind-body] a:hover,
.dark article a:hover {
  color: #60a5fa;
}
`

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <style>{style.trim()}</style>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="rgb(250,250,250)"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="rgb(17,17,17)"
      />
    </>
  )
}
