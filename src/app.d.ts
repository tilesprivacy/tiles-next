// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Platform {
      env: Env
      ctx: ExecutionContext
      caches: CacheStorage & { default: Cache }
      cf?: IncomingRequestCfProperties
    }
  }
}

export {}
