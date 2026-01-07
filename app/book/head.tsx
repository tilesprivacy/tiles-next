export default function Head() {
  const style = `
:root {
  --nextra-primary-hue: 212deg;
  --nextra-primary-saturation: 100%;
  --nextra-primary-lightness: 45%;
  --nextra-bg: 250,250,250;
  --nextra-content-width: 90rem;
}
.dark {
  --nextra-primary-hue: 204deg;
  --nextra-primary-saturation: 100%;
  --nextra-primary-lightness: 55%;
  --nextra-bg: 17,17,17;
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
`

  return (
    <>
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
