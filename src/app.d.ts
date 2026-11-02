// See https://svelte.dev/docs/kit/types#app.d.ts
// Cloudflare bindings (env.DB etc.) come from `import { env } from "cloudflare:workers"`;
// their types are generated into worker-configuration.d.ts by `wrangler types`.
declare global {
  namespace App {}
}

export {}
