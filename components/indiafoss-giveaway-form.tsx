"use client"

import { useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react"
import {
  INDIAFOSS_DEVICE_OPTIONS,
  INDIAFOSS_GIVEAWAY_TRACKS,
  type IndiaFossGiveawayTrack,
} from "@/lib/indiafoss-giveaway"

const fieldClasses =
  "mt-2 min-w-0 max-w-full w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-[0.95rem] text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-white/15 dark:bg-[#161616] dark:text-white dark:placeholder:text-white/35 dark:focus:border-white dark:focus:ring-white/10"

const labelClasses = "block min-w-0 text-sm font-medium text-foreground"

type FormStatus = "idle" | "submitting" | "success" | "error"

export function IndiaFossGiveawayForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const startedAt = useRef(Date.now())
  const [track, setTrack] = useState<IndiaFossGiveawayTrack>("travel")
  const [osdcAffiliated, setOsdcAffiliated] = useState<"" | "yes" | "no">("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")
  const isIneligible = osdcAffiliated === "no"

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting" || isIneligible) return

    const form = new FormData(event.currentTarget)
    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/indiafoss-2026-giveaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          githubProfile: form.get("githubProfile"),
          osdcAffiliated: form.get("osdcAffiliated"),
          osdcRelationship: form.get("osdcRelationship"),
          track: form.get("track"),
          cpu: form.get("cpu"),
          gpu: form.get("gpu"),
          memory: form.get("memory"),
          devices: form.getAll("devices"),
          travelDate: form.get("travelDate"),
          travelTime: form.get("travelTime"),
          flightOperator: form.get("flightOperator"),
          travelSource: form.get("travelSource"),
          travelDestination: form.get("travelDestination"),
          travelerAge: form.get("travelerAge"),
          travelerPhone: form.get("travelerPhone"),
          travelerGender: form.get("travelerGender"),
          upiContact: form.get("upiContact"),
          eligibilityConfirmed: form.get("eligibilityConfirmed") === "on",
          consent: form.get("consent") === "on",
          website: form.get("website"),
          startedAt: startedAt.current,
        }),
      })
      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error || "We could not submit your entry. Please try again.")
      }

      setStatus("success")
      formRef.current?.reset()
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "We could not submit your entry. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/10 bg-black/[0.025] p-6 dark:border-white/10 dark:bg-white/[0.035] sm:p-8" role="status">
        <CheckCircle2 className="h-9 w-9 text-black dark:text-[#f7ff61]" aria-hidden />
        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Entry received</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Thanks for applying. We sent a confirmation to your email and will contact selected applicants there.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="min-w-0 max-w-full space-y-8">
      <fieldset className="min-w-0">
        <legend className={labelClasses}>Are you affiliated with OSDC?</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ["yes", "Yes"],
            ["no", "No"],
          ].map(([value, label]) => (
            <label key={value} className="flex min-w-28 items-center gap-3 rounded-lg border border-black/10 px-3.5 py-3 text-sm dark:border-white/10">
              <input
                className="h-4 w-4 shrink-0 accent-foreground"
                type="radio"
                name="osdcAffiliated"
                value={value}
                checked={osdcAffiliated === value}
                onChange={() => setOsdcAffiliated(value as "yes" | "no")}
                required
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {isIneligible ? (
        <p className="rounded-xl border border-black/10 bg-black/[0.025] px-4 py-3 text-sm leading-6 text-muted-foreground dark:border-white/10 dark:bg-white/[0.025]" role="status">
          This giveaway is currently limited to people affiliated with OSDC, so the rest of the application has been disabled.
        </p>
      ) : null}

      <fieldset disabled={isIneligible} className="min-w-0 space-y-8 disabled:cursor-not-allowed disabled:opacity-45">
        <legend className="sr-only">IndiaFOSS giveaway application</legend>
        <fieldset className="min-w-0 space-y-5">
          <legend className="text-xl font-semibold tracking-[-0.025em]">Your details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClasses}>
              Full name
              <input className={fieldClasses} name="fullName" autoComplete="name" required minLength={2} maxLength={100} />
            </label>
            <label className={labelClasses}>
              Email
              <input className={fieldClasses} name="email" type="email" autoComplete="email" required maxLength={254} />
            </label>
            <label className={labelClasses}>
              GitHub profile
              <input
                className={fieldClasses}
                name="githubProfile"
                type="url"
                inputMode="url"
                autoComplete="url"
                required
                maxLength={200}
                placeholder="https://github.com/username"
              />
            </label>
          </div>
          <label className={labelClasses}>
            What is your relationship with OSDC?
            <textarea
              className={`${fieldClasses} min-h-24 resize-y`}
              name="osdcRelationship"
              required
              minLength={10}
              maxLength={600}
              placeholder="Tell us whether you are a member, alumnus, organizer, volunteer, community participant, or otherwise connected."
            />
          </label>
        </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="text-xl font-semibold tracking-[-0.025em]">Hardware profile</legend>
        <p className="text-sm leading-6 text-muted-foreground">
          This helps us understand the devices represented in the private testing group.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClasses}>
            CPU
            <input className={fieldClasses} name="cpu" required maxLength={160} placeholder="Apple M2, Ryzen 7…" />
          </label>
          <label className={labelClasses}>
            GPU
            <input className={fieldClasses} name="gpu" required maxLength={160} placeholder="Integrated, RTX 4060…" />
          </label>
          <label className={labelClasses}>
            Memory
            <input className={fieldClasses} name="memory" required maxLength={100} placeholder="16 GB" />
          </label>
        </div>
        <fieldset className="min-w-0">
          <legend className={labelClasses}>Devices and operating systems you use</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {INDIAFOSS_DEVICE_OPTIONS.map((device) => (
              <label key={device} className="flex items-center gap-3 rounded-lg border border-black/10 px-3.5 py-3 text-sm dark:border-white/10">
                <input className="h-4 w-4 shrink-0 accent-foreground" type="checkbox" name="devices" value={device} />
                {device}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="min-w-0 space-y-4">
        <legend className="text-xl font-semibold tracking-[-0.025em]">Choose an application track</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.entries(INDIAFOSS_GIVEAWAY_TRACKS) as Array<
            [IndiaFossGiveawayTrack, (typeof INDIAFOSS_GIVEAWAY_TRACKS)[IndiaFossGiveawayTrack]]
          >).map(([value, option]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border p-4 transition ${
                track === value
                  ? "border-foreground bg-foreground text-background"
                  : "border-black/12 bg-black/[0.02] hover:border-black/35 dark:border-white/12 dark:bg-white/[0.025] dark:hover:border-white/35"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="track"
                value={value}
                checked={track === value}
                onChange={() => setTrack(value)}
              />
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className={`mt-2 block text-xs leading-5 ${track === value ? "text-background/70" : "text-muted-foreground"}`}>
                {option.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {track === "travel" ? (
        <fieldset className="min-w-0 space-y-5">
          <legend className="text-xl font-semibold tracking-[-0.025em]">Travel details</legend>
          <div className="space-y-5 rounded-xl border border-black/15 bg-black/[0.025] p-4 dark:border-[#f7ff61]/25 dark:bg-[#f7ff61]/[0.045] sm:p-5">
            <p className="text-sm leading-6 text-muted-foreground">
              To prevent misuse, we will book the selected one-way flight directly. Any amount remaining from the US$100 grant after the booking will be sent to your personal account through UPI.
            </p>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Passenger details</h3>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <label className={labelClasses}>
                    Age
                    <input className={fieldClasses} name="travelerAge" type="number" inputMode="numeric" required min={1} max={120} step={1} placeholder="Age in years" />
                  </label>
                  <label className={labelClasses}>
                    Gender as shown on travel ID
                    <select className={fieldClasses} name="travelerGender" required defaultValue="">
                      <option value="" disabled>Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className={`${labelClasses} sm:col-span-2`}>
                    Phone number
                    <input className={fieldClasses} name="travelerPhone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={30} placeholder="+91 98765 43210" />
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Preferred flight</h3>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <label className={labelClasses}>
                Source
                <input className={fieldClasses} name="travelSource" required maxLength={160} defaultValue="Delhi" placeholder="Departure city or airport" />
              </label>
              <label className={labelClasses}>
                Destination
                <input className={fieldClasses} name="travelDestination" required maxLength={160} defaultValue="Bengaluru" placeholder="Arrival city or airport" />
              </label>
              <label className={labelClasses}>
                Travel date
                <input className={fieldClasses} name="travelDate" type="date" required />
              </label>
              <label className={labelClasses}>
                Travel time
                <input className={fieldClasses} name="travelTime" type="time" required />
              </label>
              <label className={`${labelClasses} sm:col-span-2`}>
                Flight operator
                <input className={fieldClasses} name="flightOperator" required maxLength={160} placeholder="Airline name" />
              </label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Payment details</h3>
              <label className={`${labelClasses} mt-3`}>
                UPI ID or UPI-linked phone number
                <input className={fieldClasses} name="upiContact" required maxLength={160} inputMode="text" autoComplete="off" placeholder="name@bank or phone number" />
                <span className="mt-2 block text-xs font-normal leading-5 text-muted-foreground">
                  Used only to transfer the remaining travel-grant amount if you are selected.
                </span>
              </label>
            </div>
          </div>
        </fieldset>
      ) : null}

      <div className="space-y-4 rounded-xl border border-black/10 bg-black/[0.025] p-4 dark:border-white/10 dark:bg-white/[0.025]">
        <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <input className="mt-1 h-4 w-4 shrink-0 accent-foreground" type="checkbox" name="eligibilityConfirmed" required />
          <span>
            I confirm that the information above is accurate, that I have installed the Tiles Canary version, Solstone journal, and the Solstone menu bar app, and that I am willing to privately test Tiles and the Solstone apps and provide feedback when needed.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <input className="mt-1 h-4 w-4 shrink-0 accent-foreground" type="checkbox" name="consent" required />
          <span>
            I agree that Tiles Privacy and Solstone may use this information to review my entry and contact me about this giveaway. See the{" "}
            <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>.
          </span>
        </label>
      </div>

      <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {status === "error" ? (
        <p className="rounded-lg border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting" || isIneligible}
        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {status === "submitting" ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            Submitting…
          </>
        ) : (
          <>
            Submit entry
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
      </fieldset>
    </form>
  )
}
