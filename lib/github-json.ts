import { get } from "node:https"

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "tiles.run",
}

export function fetchGithubJson<T, R = T>(
  url: string,
  transform?: (data: T) => R
): Promise<R> {
  return new Promise((resolve, reject) => {
    const request = get(url, { headers: githubHeaders }, (response) => {
      const statusCode = response.statusCode ?? 0
      let body = ""

      response.setEncoding("utf8")
      response.on("data", (chunk) => {
        body += chunk
      })
      response.on("end", () => {
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`GitHub request failed: ${statusCode}`))
          return
        }

        try {
          const data = JSON.parse(body) as T
          resolve(transform ? transform(data) : (data as unknown as R))
        } catch (error) {
          reject(error)
        }
      })
    })

    request.on("error", reject)
    request.end()
  })
}
