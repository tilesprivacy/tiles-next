// Loads an external script once per page, however many components ask for it.
const loads = new Map<string, Promise<void>>()

export function loadScript(src: string, attributes: Record<string, string> = {}): Promise<void> {
  let load = loads.get(src)
  if (!load) {
    load = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.async = true
      for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value)
      script.onload = () => resolve()
      script.onerror = () => {
        // Let a later call try again, e.g. after the connection comes back.
        loads.delete(src)
        script.remove()
        reject(new Error(`Failed to load ${src}`))
      }
      document.head.appendChild(script)
    })
    loads.set(src, load)
  }
  return load
}
