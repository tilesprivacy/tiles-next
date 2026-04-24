import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { type DownloadLinkEmailVariables } from "@/lib/download-link-email"
import {
  getDownloadPageNetworkArtifact,
  OFFLINE_INSTALLER,
  OFFLINE_MODEL_NAME,
} from "@/lib/download-page-data"

const SENDER_NAME = "Tiles Privacy"
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev"
const DEFAULT_DOWNLOAD_LINK_TEMPLATE_ID = "04ef0847-0028-47cf-b0f2-595f7418c2a1"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(apiKey)
}

function getFromEmailAddress(): string {
  const raw = process.env.RESEND_FROM_EMAIL
  if (!raw?.trim()) return DEFAULT_FROM_EMAIL
  const match = raw.trim().match(/<([^>]+)>/)
  if (match) return match[1].trim()
  return raw.trim()
}

function getFromEmail(): string {
  return `${SENDER_NAME} <${getFromEmailAddress()}>`
}

function getDownloadLinkTemplateId(): string {
  return (
    process.env.RESEND_DOWNLOAD_LINK_TEMPLATE_ID?.trim() ||
    DEFAULT_DOWNLOAD_LINK_TEMPLATE_ID
  )
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function extractVersionFromFileName(fileName: string | undefined): string {
  const match = fileName?.match(/tiles-(\d+\.\d+\.\d+)(?:[.-]|$)/i)
  return match?.[1] ?? "Unavailable"
}

function shortenSha256(sha256: string): string {
  if (!sha256 || sha256 === "Unavailable") {
    return "Unavailable"
  }
  return `${sha256.slice(0, 12)}...${sha256.slice(-12)}`
}

function resolveFileName(fileName: string | undefined, downloadUrl: string): string {
  const explicit = fileName?.trim()
  if (explicit) return explicit

  const fromUrl = downloadUrl.split("/").filter(Boolean).pop()
  return fromUrl?.trim() || "Unavailable"
}

function buildDownloadLinkVariables(
  artifact: Awaited<ReturnType<typeof getDownloadPageNetworkArtifact>>,
): DownloadLinkEmailVariables {
  const networkVersion =
    extractVersionFromFileName(artifact.fileName) || artifact.version
  const networkShaShort = shortenSha256(artifact.sha256)
  const offlineVersion = extractVersionFromFileName(OFFLINE_INSTALLER.fileName)
  const offlineShaShort = shortenSha256(OFFLINE_INSTALLER.sha256)
  const networkFileName = resolveFileName(artifact.fileName, artifact.downloadUrl)
  const offlineFileName = resolveFileName(
    OFFLINE_INSTALLER.fileName,
    OFFLINE_INSTALLER.downloadUrl,
  )

  return {
    DOWNLOAD_URL: artifact.downloadUrl,
    DOWNLOAD_FILE_NAME: networkFileName,
    DOWNLOAD_VERSION: networkVersion,
    DOWNLOAD_SIZE: artifact.binarySizeLabel,
    DOWNLOAD_SHA_SHORT: networkShaShort,
    NETWORK_VERSION: networkVersion,
    NETWORK_SIZE: artifact.binarySizeLabel,
    NETWORK_SHA_SHORT: networkShaShort,
    OFFLINE_DOWNLOAD_URL: OFFLINE_INSTALLER.downloadUrl,
    OFFLINE_FILE_NAME: offlineFileName,
    OFFLINE_DOWNLOAD_VERSION: offlineVersion,
    OFFLINE_DOWNLOAD_SIZE: OFFLINE_INSTALLER.binarySizeLabel,
    OFFLINE_DOWNLOAD_SHA_SHORT: offlineShaShort,
    OFFLINE_MODEL_NAME,
    OFFLINE_VERSION: offlineVersion,
    OFFLINE_SIZE: OFFLINE_INSTALLER.binarySizeLabel,
    OFFLINE_SHA_SHORT: offlineShaShort,
  }
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }
  return null
}

function getUserFacingError(error: unknown): string {
  const rawMessage = getErrorMessage(error)
  if (!rawMessage) {
    return "Unable to send the download link. Please try again."
  }

  const message = rawMessage.toLowerCase()
  if (message.includes("domain") || message.includes("not verified")) {
    return "Email domain is not verified. Please contact support."
  }
  if (message.includes("invalid") || message.includes("malformed")) {
    return "Invalid email address or email configuration."
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many requests. Please try again later."
  }
  if (message.includes("unauthorized") || message.includes("api key")) {
    return "Email service configuration error. Please contact support."
  }
  return "Unable to send the download link. Please try again."
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured. Please contact support." },
      { status: 503 },
    )
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON." },
      { status: 400 },
    )
  }

  const email = body.email?.trim()
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    )
  }

  try {
    const artifact = await getDownloadPageNetworkArtifact()
    const variables = buildDownloadLinkVariables(artifact)
    const resend = getResendClient()
    const templateId = getDownloadLinkTemplateId()

    const result = await resend.emails.send({
      from: getFromEmail(),
      to: email,
      template: {
        id: templateId,
        variables,
      },
    })

    if (result.error) {
      console.error(
        "[DownloadLinkEmail] Resend API error:",
        JSON.stringify(result.error, null, 2),
      )
      return NextResponse.json(
        {
          error: getUserFacingError(result.error),
          ...(process.env.NODE_ENV === "development" && {
            details: result.error,
          }),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Download link sent.",
      id: result.data?.id,
    })
  } catch (error) {
    console.error("[DownloadLinkEmail] Unexpected error:", error)
    return NextResponse.json(
      {
        error: getUserFacingError(error),
        ...(process.env.NODE_ENV === "development" && {
          details: getErrorMessage(error) || String(error),
        }),
      },
      { status: 500 },
    )
  }
}
