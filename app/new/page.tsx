import type { Metadata } from "next"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Tiles for Co-Working Spaces | Tiles Privacy",
  description: "Transform your co-working space with intelligent tiling and organization. The future of workspace management.",
  openGraph: {
    title: "Tiles for Co-Working Spaces",
    description: "Transform your co-working space with intelligent tiling and organization.",
    type: "website",
  },
}

export default function CoworkingPage() {
  return (
    <main className="minimal-product-page">
      <MinimalTopbar />
      
      {/* Hero Section */}
      <section className="minimal-inner-page">
        <div className="minimal-inner-content">
          <div className="minimal-page-intro">
            <p className="minimal-eyebrow">For Co-Working Spaces</p>
            <h1>Create the perfect workspace layout</h1>
            <p>
              Tiles helps co-working spaces organize, manage, and maximize their physical environments. 
              From booking systems to member coordination, everything tiles together seamlessly.
            </p>
          </div>

          {/* Main Features */}
          <div className="minimal-section">
            <div className="minimal-section-heading">
              <h2>Why Tiles for Your Co-Working Space</h2>
              <p>Purpose-built for modern shared workspaces</p>
            </div>
            
            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="minimal-option">
                <h3>Smart Room Booking</h3>
                <p>
                  Coordinate room reservations with your team in real time. Members see availability instantly, 
                  reducing scheduling conflicts and maximizing utilization of meeting rooms, private offices, and event spaces.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="minimal-option">
                <h3>Member Collaboration Hub</h3>
                <p>
                  Create a central place for member interaction. Share events, announcements, and opportunities. 
                  Foster community through integrated communication that keeps everyone connected and engaged.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="minimal-option">
                <h3>Space Utilization Insights</h3>
                <p>
                  Understand how your space is being used. Track peak hours, identify underutilized areas, 
                  and make data-driven decisions about layout, amenities, and future expansions.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="minimal-option">
                <h3>Desk & Office Management</h3>
                <p>
                  Assign hot desks, manage dedicated offices, and handle member onboarding seamlessly. 
                  Keep track of who's using what, when they're coming in, and what amenities they need.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="minimal-option">
                <h3>Member Directory & Networking</h3>
                <p>
                  Help members discover each other and collaborate. A built-in directory connects complementary 
                  businesses, creators, and founders within your community.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="minimal-option">
                <h3>Event & Workshop Coordination</h3>
                <p>
                  Host events, workshops, and community gatherings with built-in ticketing, registration, and 
                  logistics. Make every event a community-building opportunity.
                </p>
              </div>
            </div>
          </div>

          {/* Space Types Section */}
          <div className="minimal-section">
            <div className="minimal-section-heading">
              <h2>Built for Every Space Type</h2>
              <p>Whether you&apos;re starting or scaling, Tiles adapts to your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Startup Hub */}
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Startup Hubs</h3>
                <p className="text-sm text-muted-foreground">
                  Connect founders, accelerate growth, and build a thriving ecosystem of early-stage companies.
                </p>
              </div>

              {/* Creative Spaces */}
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Creative Spaces</h3>
                <p className="text-sm text-muted-foreground">
                  Coordinate studios, galleries, and collaborative maker spaces with flexible room configurations.
                </p>
              </div>

              {/* Tech Communities */}
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Tech Communities</h3>
                <p className="text-sm text-muted-foreground">
                  Manage hackerspaces, dev communities, and tech meetups with integrated tooling for collaboration.
                </p>
              </div>

              {/* Wellness Centers */}
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Wellness & Labs</h3>
                <p className="text-sm text-muted-foreground">
                  Organize shared facilities, equipment booking, and member wellness programs with precision.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="minimal-section">
            <div className="minimal-section-heading">
              <h2>What Members Say</h2>
              <p>Hear from community managers and space operators</p>
            </div>

            <div className="space-y-6 mt-8">
              {/* Testimonial 1 */}
              <div className="p-6 border border-border rounded-lg">
                <p className="italic mb-4">
                  "Tiles transformed how we manage our 15 offices and hot desks. 
                  What used to take hours of manual coordination now works in minutes."
                </p>
                <p className="font-semibold text-sm">Sarah Chen, Community Manager</p>
                <p className="text-xs text-muted-foreground">Tech Innovation Hub, Vancouver</p>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 border border-border rounded-lg">
                <p className="italic mb-4">
                  "Our members love the built-in directory. We&apos;ve seen 3x more collaboration 
                  and partnerships since implementing Tiles."
                </p>
                <p className="font-semibold text-sm">Marcus Johnson, Space Operator</p>
                <p className="text-xs text-muted-foreground">Downtown Creative Commons, Portland</p>
              </div>

              {/* Testimonial 3 */}
              <div className="p-6 border border-border rounded-lg">
                <p className="italic mb-4">
                  "Event management became so much easier. From registration to day-of coordination, 
                  everything is in one place."
                </p>
                <p className="font-semibold text-sm">Alex Rivera, Community Lead</p>
                <p className="text-xs text-muted-foreground">Founder&apos;s Quarter, Austin</p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="minimal-section">
            <div className="minimal-section-heading">
              <h2>How It Works</h2>
              <p>Get started in minutes</p>
            </div>

            <div className="space-y-6 mt-8">
              <div className="flex gap-4">
                <div className="flex-none text-muted-foreground font-mono text-sm w-6 text-center">01</div>
                <div>
                  <h3 className="font-semibold mb-1">Set Up Your Space</h3>
                  <p className="text-sm text-muted-foreground">
                    Define your rooms, desks, amenities, and capacity. Tiles learns your space in minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none text-muted-foreground font-mono text-sm w-6 text-center">02</div>
                <div>
                  <h3 className="font-semibold mb-1">Invite Your Members</h3>
                  <p className="text-sm text-muted-foreground">
                    Add members to your workspace. They get instant access to booking, directory, and community features.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-none text-muted-foreground font-mono text-sm w-6 text-center">03</div>
                <div>
                  <h3 className="font-semibold mb-1">Organize & Collaborate</h3>
                  <p className="text-sm text-muted-foreground">
                    Your space runs itself. Members book, coordinate, and connect while you gain insights into utilization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="minimal-section">
            <div className="minimal-section-heading">
              <h2>Simple, Transparent Pricing</h2>
              <p>Scale with your space, no hidden fees</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Starter</h3>
                <p className="text-2xl font-bold mb-4">$49<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Up to 10 members</li>
                  <li>• 3 spaces/rooms</li>
                  <li>• Basic booking</li>
                  <li>• Community features</li>
                </ul>
              </div>

              <div className="p-6 border-2 border-foreground rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground mb-2">POPULAR</div>
                <h3 className="font-semibold mb-2">Pro</h3>
                <p className="text-2xl font-bold mb-4">$149<span className="text-sm text-muted-foreground">/mo</span></p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Up to 50 members</li>
                  <li>• Unlimited spaces</li>
                  <li>• Advanced booking</li>
                  <li>• Events & workshops</li>
                  <li>• Analytics</li>
                </ul>
              </div>

              <div className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-2xl font-bold mb-4">Custom</p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Unlimited everything</li>
                  <li>• White-label options</li>
                  <li>• API access</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="minimal-section text-center">
            <h2 className="mb-4">Ready to transform your space?</h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of co-working spaces using Tiles to build stronger communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:hello@tiles.run" className="minimal-primary-button">
                Get Started Today
              </a>
              <a href="#" className="minimal-secondary-button">
                Schedule a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
