import { NextRequest, NextResponse } from "next/server"
import { createElement } from "react"
import { render } from "@react-email/render"
import { Resend } from "resend"
import { IndiaFossGiveawayConfirmationEmail } from "@/emails/indiafoss-giveaway-confirmation"
import {
  INDIAFOSS_DEVICE_OPTIONS,
  INDIAFOSS_GIVEAWAY_CLOSED,
  INDIAFOSS_GIVEAWAY_TRACKS,
  isIndiaFossGiveawayTrack,
  type IndiaFossGiveawayTrack,
} from "@/lib/indiafoss-giveaway"

const DEFAULT_FROM_EMAIL = "onboarding@resend.dev"
const DEFAULT_ENTRIES_EMAIL = "hello@tiles.run"
const MAX_REQUEST_BYTES = 64_000

type GiveawayEntry = {
  fullName: string
  email: string
  githubProfile: string
  osdcAffiliated: boolean
  osdcRelationship: string
  track: IndiaFossGiveawayTrack
  cpu: string
  gpu: string
  memory: string
  devices: string[]
  travelDate: string
  travelTime: string
  flightOperator: string
  travelSource: string
  travelDestination: string
  travelerAge: string
  travelerPhone: string
  travelerGender: string
  upiContact: string
  eligibilityConfirmed: boolean
  consent: boolean
}

const text = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : ""

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isGitHubProfile = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.toLowerCase() === "github.com" && /^\/[A-Za-z0-9][A-Za-z0-9-]{0,38}\/?$/.test(url.pathname)
  } catch {
    return false
  }
}

const getFromEmail = () => {
  const configured = process.env.RESEND_FROM_EMAIL?.trim()
  if (!configured) return `Tiles Privacy <${DEFAULT_FROM_EMAIL}>`
  return configured.includes("<") ? configured : `Tiles Privacy <${configured}>`
}

const getEntryItems = (entry: GiveawayEntry) => [
  { label: "Full name", value: entry.fullName },
  { label: "Email", value: entry.email },
  { label: "GitHub profile", value: entry.githubProfile },
  { label: "Affiliated with OSDC", value: entry.osdcAffiliated ? "Yes" : "No" },
  { label: "Relationship with OSDC", value: entry.osdcRelationship },
  { label: "Application track", value: INDIAFOSS_GIVEAWAY_TRACKS[entry.track].label },
  { label: "CPU", value: entry.cpu },
  { label: "GPU", value: entry.gpu },
  { label: "Memory", value: entry.memory },
  { label: "Devices and operating systems", value: entry.devices.join(", ") },
  ...(entry.track === "travel"
    ? [
        { label: "Age", value: entry.travelerAge },
        { label: "Gender as shown on travel ID", value: entry.travelerGender.charAt(0).toUpperCase() + entry.travelerGender.slice(1) },
        { label: "Phone number", value: entry.travelerPhone },
        { label: "Source", value: entry.travelSource },
        { label: "Destination", value: entry.travelDestination },
        { label: "Travel date", value: entry.travelDate },
        { label: "Travel time", value: entry.travelTime },
        { label: "Flight operator", value: entry.flightOperator },
        { label: "UPI ID or UPI-linked phone", value: entry.upiContact },
      ]
    : []),
  { label: "Requirements confirmed", value: entry.eligibilityConfirmed ? "Yes" : "No" },
  { label: "Data-use consent", value: entry.consent ? "Yes" : "No" },
]

const formatEntry = (entry: GiveawayEntry, submittedAt: string) => [
  "IndiaFOSS 2026 giveaway entry",
  "",
  `Submitted: ${submittedAt}`,
  ...getEntryItems(entry).map(({ label, value }) => `${label}: ${value}`),
].join("\n")

export async function POST(request: NextRequest) {
  if (INDIAFOSS_GIVEAWAY_CLOSED) {
    return NextResponse.json(
      { error: "All giveaway slots have been booked, so applications are closed." },
      { status: 410 },
    )
  }

  const requestOrigin = new URL(request.url).origin
  const origin = request.headers.get("origin")
  if (origin && origin !== requestOrigin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  const contentLength = Number(request.headers.get("content-length") || "0")
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Submission is too large." }, { status: 413 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 })
  }

  // Honeypot fields return a normal success response so automated submitters
  // do not learn which check caught them.
  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true })
  }

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0
  const elapsed = Date.now() - startedAt
  if (!startedAt || elapsed < 2_000 || elapsed > 2 * 60 * 60 * 1_000) {
    return NextResponse.json(
      { error: "Please reload the page and try again." },
      { status: 400 },
    )
  }

  const track = body.track
  const entry: GiveawayEntry = {
    fullName: text(body.fullName, 100),
    email: text(body.email, 254).toLowerCase(),
    githubProfile: text(body.githubProfile, 200),
    osdcAffiliated: body.osdcAffiliated === "yes",
    osdcRelationship: text(body.osdcRelationship, 600),
    track: isIndiaFossGiveawayTrack(track) ? track : "ticket",
    cpu: text(body.cpu, 160),
    gpu: text(body.gpu, 160),
    memory: text(body.memory, 100),
    devices: Array.isArray(body.devices)
      ? [...new Set(
          body.devices
            .filter((device): device is string => typeof device === "string")
            .filter((device) => (INDIAFOSS_DEVICE_OPTIONS as readonly string[]).includes(device)),
        )]
      : [],
    travelDate: text(body.travelDate, 20),
    travelTime: text(body.travelTime, 10),
    flightOperator: text(body.flightOperator, 160),
    travelSource: text(body.travelSource, 160),
    travelDestination: text(body.travelDestination, 160),
    travelerAge: text(body.travelerAge, 3),
    travelerPhone: text(body.travelerPhone, 30),
    travelerGender: text(body.travelerGender, 20),
    upiContact: text(body.upiContact, 160),
    eligibilityConfirmed: body.eligibilityConfirmed === true,
    consent: body.consent === true,
  }

  if (entry.fullName.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 })
  }
  if (!isEmail(entry.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (body.osdcAffiliated !== "yes" && body.osdcAffiliated !== "no") {
    return NextResponse.json({ error: "Please tell us whether you are affiliated with OSDC." }, { status: 400 })
  }
  if (body.osdcAffiliated === "no") {
    return NextResponse.json({ error: "This giveaway is currently limited to people affiliated with OSDC." }, { status: 400 })
  }
  if (!isGitHubProfile(entry.githubProfile)) {
    return NextResponse.json({ error: "Please enter a valid GitHub profile URL." }, { status: 400 })
  }
  if (entry.osdcRelationship.length < 10) {
    return NextResponse.json({ error: "Please describe your relationship with OSDC." }, { status: 400 })
  }
  if (!isIndiaFossGiveawayTrack(body.track)) {
    return NextResponse.json({ error: "Please choose an application track." }, { status: 400 })
  }
  if (entry.cpu.length < 2 || entry.gpu.length < 2 || entry.memory.length < 1) {
    return NextResponse.json({ error: "Please provide your CPU, GPU, and memory specifications." }, { status: 400 })
  }
  if (entry.devices.length === 0) {
    return NextResponse.json({ error: "Please select at least one device or operating system." }, { status: 400 })
  }
  if (entry.track === "travel" && !/^\d{4}-\d{2}-\d{2}$/.test(entry.travelDate)) {
    return NextResponse.json({ error: "Please choose your travel date." }, { status: 400 })
  }
  if (entry.track === "travel" && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(entry.travelTime)) {
    return NextResponse.json({ error: "Please choose your travel time." }, { status: 400 })
  }
  if (entry.track === "travel" && entry.flightOperator.length < 2) {
    return NextResponse.json({ error: "Please provide the flight operator." }, { status: 400 })
  }
  if (entry.track === "travel" && entry.travelSource.length < 2) {
    return NextResponse.json({ error: "Please provide your travel source." }, { status: 400 })
  }
  if (entry.track === "travel" && entry.travelDestination.length < 2) {
    return NextResponse.json({ error: "Please provide your travel destination." }, { status: 400 })
  }
  const travelerAge = Number(entry.travelerAge)
  if (entry.track === "travel" && (!Number.isInteger(travelerAge) || travelerAge < 1 || travelerAge > 120)) {
    return NextResponse.json({ error: "Please provide a valid age." }, { status: 400 })
  }
  if (entry.track === "travel" && !/^\+?[0-9 ()-]{7,30}$/.test(entry.travelerPhone)) {
    return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 })
  }
  if (entry.track === "travel" && !["female", "male", "other"].includes(entry.travelerGender)) {
    return NextResponse.json({ error: "Please select the gender shown on your travel ID." }, { status: 400 })
  }
  if (entry.track === "travel" && entry.upiContact.length < 5) {
    return NextResponse.json({ error: "Please provide a UPI ID or UPI-linked phone number." }, { status: 400 })
  }
  if (!entry.eligibilityConfirmed) {
    return NextResponse.json({ error: "Please confirm the giveaway entry requirements." }, { status: 400 })
  }
  if (!entry.consent) {
    return NextResponse.json({ error: "Please consent to the use of your information for this giveaway." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[IndiaFOSS giveaway] RESEND_API_KEY is not configured")
    return NextResponse.json(
      { error: "Entries are temporarily unavailable. Please try again later." },
      { status: 503 },
    )
  }

  const resend = new Resend(apiKey)
  const submittedAt = new Date().toISOString()
  const entryText = formatEntry(entry, submittedAt)
  const entryItems = getEntryItems(entry)
  const entriesEmail = process.env.GIVEAWAY_ENTRIES_EMAIL?.trim() || DEFAULT_ENTRIES_EMAIL
  const from = getFromEmail()

  const internal = await resend.emails.send({
    from,
    to: entriesEmail,
    replyTo: entry.email,
    subject: `[IndiaFOSS giveaway] ${entry.fullName} · ${INDIAFOSS_GIVEAWAY_TRACKS[entry.track].label}`,
    text: entryText,
  })

  if (internal.error) {
    console.error("[IndiaFOSS giveaway] Could not deliver entry", internal.error)
    return NextResponse.json(
      { error: "We could not save your entry. Please try again." },
      { status: 502 },
    )
  }

  // Confirmation is best-effort. The entry is already collected if this send
  // fails, so applicants should not be prompted to create duplicates.
  const confirmation = await resend.emails.send({
    from,
    to: entry.email,
    replyTo: entriesEmail,
    subject: "We received your IndiaFOSS 2026 giveaway entry",
    html: await render(createElement(IndiaFossGiveawayConfirmationEmail, {
      fullName: entry.fullName,
      trackLabel: INDIAFOSS_GIVEAWAY_TRACKS[entry.track].label,
      responseItems: entryItems,
    })),
    text: [
      `Hi ${entry.fullName},`,
      "",
      "Your IndiaFOSS 2026 giveaway entry has been received.",
      `You applied for: ${INDIAFOSS_GIVEAWAY_TRACKS[entry.track].label}.`,
      "",
      "Submitting an entry does not guarantee selection. We will contact selected applicants at this email address.",
      "If selected, your conference ticket code and, for travel-grant recipients, flight ticket will follow by email shortly, within a couple of days.",
      "",
      "Your submitted response",
      ...entryItems.map(({ label, value }) => `${label}: ${value}`),
      "",
      "If you have any questions, you can reach us anytime using the contact details below.",
      "",
      "Ankesh Bharti",
      "Founder and CEO, Tiles Privacy",
      "",
      "Tiles Privacy Technologies Pvt. Ltd.",
      "WeWork Prestige Atlanta, 80 Feet Rd, Koramangala",
      "Bengaluru, IN 560034",
      "hello@tiles.run · +91 7338014129 · https://www.tiles.run",
      "X: https://x.com/tilesprivacy",
      "Bluesky: https://bsky.app/profile/tiles.run",
      "LinkedIn: https://www.linkedin.com/company/tilesprivacy/",
      "Discord: https://go.tiles.run/discord",
      "GitHub: https://github.com/tilesprivacy",
      "Tangled: https://tangled.org/tiles.run",
      "Hugging Face: https://huggingface.co/tilesprivacy",
    ].join("\n"),
  })

  if (confirmation.error) {
    console.error("[IndiaFOSS giveaway] Could not send confirmation", confirmation.error)
  }

  return NextResponse.json({ ok: true })
}
