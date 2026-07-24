import type { Metadata } from "next"
import { MessageSquare, Lock, Users, Zap, GitBranch, Server } from "lucide-react"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Community Chat with Local AI | Tiles",
  description: "A Slack alternative for coworking spaces. Run local AI models, keep data private, collaborate securely.",
}

const features = [
  {
    title: "Local AI Collaboration",
    description: "Run AI models on-device within your coworking community. No data leaves your space.",
    icon: Zap,
  },
  {
    title: "End-to-End Encrypted",
    description: "Private conversations between you and your teammates. Full encryption by default.",
    icon: Lock,
  },
  {
    title: "Built for Communities",
    description: "Designed for coworking spaces. Organize by communities, rooms, and projects effortlessly.",
    icon: Users,
  },
  {
    title: "Self-Hosted",
    description: "Deploy on your own infrastructure. You control the servers, the data, and the future.",
    icon: Server,
  },
  {
    title: "Own Your Data",
    description: "No vendor lock-in. Export everything. Your conversations belong to you forever.",
    icon: MessageSquare,
  },
  {
    title: "Open Source",
    description: "Transparent, auditable code. Community-driven development you can trust.",
    icon: GitBranch,
  },
]

const testimonials = [
  {
    quote: "Finally a communication tool built for our community, not against it. Data stays with us.",
    author: "Sarah Chen",
    role: "Community Manager",
  },
  {
    quote: "Local AI collaboration changed how we brainstorm. No privacy concerns, all benefits.",
    author: "Marcus Johnson",
    role: "Space Founder",
  },
  {
    quote: "Our members appreciate owning their data. It makes a difference in how they engage.",
    author: "Elena Rodriguez",
    role: "Operations Lead",
  },
]

export default function CoworkingPage() {
  return (
    <main className="minimal-product-page">
      <MinimalTopbar />

      {/* Hero Section */}
      <section aria-labelledby="hero-title" className="border-b border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 py-24 md:py-40 space-y-8">
          <div className="space-y-6">
            <h1 id="hero-title" className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Community chat,<br />built for coworking.
            </h1>
            <p className="text-xl leading-relaxed text-foreground/70 max-w-2xl">
              A Slack alternative where your community owns the conversation. Run local AI models, keep data private, and build deeper connections.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="rounded-lg bg-foreground px-8 py-3 font-medium text-background hover:bg-foreground/90 transition-colors">
              Get Started
            </button>
            <button className="rounded-lg border border-foreground/20 px-8 py-3 font-medium hover:border-foreground/40 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Why Tiles Section */}
      <section aria-labelledby="why-heading" className="border-b border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 py-24 md:py-32 space-y-16">
          <div className="space-y-4">
            <h2 id="why-heading" className="text-4xl font-semibold">
              Why coworking spaces choose Tiles
            </h2>
            <p className="text-lg text-foreground/70">
              Traditional chat apps weren&apos;t built for communities. We are.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="space-y-4">
                <feature.icon className="h-8 w-8 text-foreground/60" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section aria-labelledby="how-heading" className="border-b border-foreground/10 bg-foreground/2">
        <div className="mx-auto max-w-4xl px-4 py-24 md:py-32 space-y-16">
          <div className="space-y-4">
            <h2 id="how-heading" className="text-4xl font-semibold">
              How it works
            </h2>
            <p className="text-lg text-foreground/70">
              Set up in minutes. Built for teams of any size.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Deploy",
                description: "Run Tiles on your own server or peer-to-peer. You control the infrastructure.",
              },
              {
                step: "02",
                title: "Invite",
                description: "Add community members with a single link. No data harvesting, no sign-up hassles.",
              },
              {
                step: "03",
                title: "Collaborate",
                description: "Chat, share, run local AI, and build your community—all with end-to-end encryption.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-8">
                <div className="text-5xl font-bold text-foreground/10 shrink-0 w-20">{item.step}</div>
                <div className="space-y-2 pt-2">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-lg text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section aria-labelledby="testimonials-heading" className="border-b border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 py-24 md:py-32 space-y-16">
          <div className="space-y-4">
            <h2 id="testimonials-heading" className="text-4xl font-semibold">
              Loved by community leaders
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.author} className="space-y-4 rounded-lg border border-foreground/5 bg-background p-8">
                <p className="text-lg leading-relaxed text-foreground/80">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="space-y-1 border-t border-foreground/10 pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section aria-labelledby="comparison-heading" className="border-b border-foreground/10 bg-foreground/2">
        <div className="mx-auto max-w-4xl px-4 py-24 md:py-32 space-y-16">
          <div className="space-y-4">
            <h2 id="comparison-heading" className="text-4xl font-semibold">
              How we&apos;re different
            </h2>
            <p className="text-lg text-foreground/70">
              Built on principles of ownership, privacy, and community.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Tiles</th>
                  <th className="px-6 py-4 text-center font-semibold">Other Chat Apps</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Local AI Models", tiles: true, other: false },
                  { feature: "End-to-End Encryption", tiles: true, other: "Limited" },
                  { feature: "Self-Hosted", tiles: true, other: false },
                  { feature: "Open Source", tiles: true, other: false },
                  { feature: "Data Export", tiles: true, other: "Limited" },
                  { feature: "Zero Data Collection", tiles: true, other: false },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-foreground/5">
                    <td className="px-6 py-4">{row.feature}</td>
                    <td className="px-6 py-4 text-center font-medium">
                      {row.tiles === true ? "✓" : "—"}
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      {row.other === true ? "✓" : row.other === false ? "—" : row.other}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing-heading" className="border-b border-foreground/10">
        <div className="mx-auto max-w-5xl px-4 py-24 md:py-32 space-y-16">
          <div className="space-y-4">
            <h2 id="pricing-heading" className="text-4xl font-semibold">
              Forever license, no subscriptions
            </h2>
            <p className="text-lg text-foreground/70">
              One-time payment. Unlimited future updates included.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Community",
                price: "Free",
                description: "Perfect for small coworking spaces",
                features: [
                  "Up to 50 members",
                  "Local AI models",
                  "End-to-end encryption",
                  "Self-hosted",
                  "Community support",
                  "Forever free, no limits",
                ],
              },
              {
                name: "Professional",
                price: "$599",
                period: "one-time",
                description: "For growing communities",
                featured: true,
                features: [
                  "Unlimited members",
                  "Advanced AI features",
                  "Priority support",
                  "Analytics dashboard",
                  "Custom branding",
                  "Lifetime updates included",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "one-time",
                description: "For large networks",
                features: [
                  "Everything in Professional",
                  "Dedicated support",
                  "Custom integrations",
                  "Multi-space management",
                  "Source code access",
                  "Lifetime updates included",
                ],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`space-y-6 rounded-lg border p-8 ${
                  plan.featured
                    ? "border-foreground bg-foreground/5"
                    : "border-foreground/10"
                }`}
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-foreground/60 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-bold">{plan.price}</div>
                  {plan.period && <div className="text-foreground/60 text-sm">{plan.period}</div>}
                </div>

                <button
                  className={`w-full rounded-lg py-2 font-medium transition-colors ${
                    plan.featured
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border border-foreground/20 hover:border-foreground/40"
                  }`}
                >
                  Get License
                </button>

                <ul className="space-y-3 border-t border-foreground/10 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="text-foreground/60 font-medium">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-heading" className="border-t border-foreground/10 bg-foreground/2">
        <div className="mx-auto max-w-3xl px-4 py-24 md:py-32 space-y-8 text-center">
          <div className="space-y-4">
            <h2 id="cta-heading" className="text-4xl md:text-5xl font-semibold">
              Ready to own your community chat?
            </h2>
            <p className="text-lg text-foreground/70">
              Join coworking spaces building private, collaborative communities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="rounded-lg bg-foreground px-8 py-3 font-medium text-background hover:bg-foreground/90 transition-colors">
              Start Free
            </button>
            <button className="rounded-lg border border-foreground/20 px-8 py-3 font-medium hover:border-foreground/40 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
