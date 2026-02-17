import { NextRequest } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"

export async function GET(_request: NextRequest) {
  const filePath = path.join(process.cwd(), "og-plain.png")

  try {
    const file = await fs.readFile(filePath)

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}

