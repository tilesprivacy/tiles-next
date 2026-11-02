// Copy that only the /llms.txt and /llms-full.txt indexes use: page summaries
// written for language models rather than text lifted from a rendered page.
// Anything the site renders comes from its own module instead (product
// description, people, plugins, blog and book content).

export const MOZILLA_BACKING_LINE =
  "Backed by Mozilla Foundation: https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/cohort/"

export const MOZILLA_COHORT_LINES = [
  "We’re proud to be one of three anchor projects in the Mozilla Foundation’s new Human-Scale AI incubator cohort, backed by $300,000 in non-dilutive funding to help advance our mission.",
  "Human-Scale AI incubator cohort: https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/",
]

export const GITHUB_SPONSORS_LINE = "GitHub Sponsors: https://github.com/sponsors/tilesprivacy"
export const RECURRING_SPONSORSHIP_LINE = "Current recurring sponsorship: $1,350/month."

export const MACOS_DOWNLOAD_NOTE =
  "macOS: The network and offline installers include only the CLI. The Canary version includes a desktop app and a menu bar app."
export const LINUX_DOWNLOAD_NOTE =
  "Linux: Install the canary version with curl -LsSf https://tiles.run/install.sh | sh -s -- --canary. The offline installer for Linux is a work in progress."

export const REFUND_POLICY_SUMMARY =
  "Tiles Pro includes a 7-day money-back guarantee on the initial subscription payment."

export const LLMS_INDEX_OVERVIEW = [
  "Tiles is built by Tiles Privacy, an independent team devoted to user agency. The website focuses on the public alpha, product documentation, plugins, release notes, support, sponsorship, and legal information.",
  "Homepage feature: Use local models on remote devices with `tiles remote share`, running local models on a remote device peer-to-peer from any device.",
  "Homepage feature (coming soon): Every chat is a sandbox — resume or share chats as sandboxed environments with friends or agents across devices.",
  "Homepage use cases: Individuals (plan finances, track health notes, and journal privately with local models, device sync, and sharing only when chosen); Coworking spaces (shared compute as private AI infrastructure with local models available from members’ own devices while keeping identity and data private); Researchers (review literature, analyze datasets, and run agents in preconfigured, resumable research sandboxes); Enterprises (deploy private agentic systems powered by open frontier models, secure users and agents with zero-trust authentication and authorization, simplify team management, and reduce infrastructure and model costs).",
]

export const ABOUT_PAGE_SUMMARY =
  "Learn about Tiles Privacy, the team and advisors behind it, and how to support the project."

export const PRESS_KIT_SUMMARY =
  "Product background, company details, press contact, brand files, and current product screenshots."

export const PLUGIN_STANDARD_LINE =
  "Standard: https://agent-plugins.org/ - Tiles follows the open Agent Plugins standard for portable skills and MCP servers."

export const EXTERNAL_LINKS = [
  "These links are visible from the website footer or support page.",
  "- Discord: https://discord.gg/PPSjcpZzvt",
  "- GitHub organization: https://github.com/tilesprivacy",
  "- X / Twitter: https://x.com/tilesprivacy",
  "- Bluesky: https://bsky.app/profile/tiles.run",
  "- Tangled: https://tangled.org/tiles.run",
  "- Hugging Face: https://huggingface.co/tilesprivacy",
  "- Status page: https://status.tiles.run",
]

export const HOMEPAGE_FULL = [
  "Hero subtext: For sensitive knowledge work or personal tasks, your AI shouldn’t require trusting a third party with your conversations and intellectual property. Run models locally, sync chats P2P, and use social features built on AT Protocol. Tiles gives you user-owned keys for your digital life with DIDs and UCANs, so your data and identity truly remain yours.",
  "Current status: Public alpha for macOS and Linux.",
  "Feature: Use local models on remote devices with `tiles remote share`; start the remote inference server with `tiles server start`, generate a share ticket, then run `tiles --remote <ticket>` on the device intending to use remote inference.",
  "Feature (coming soon): Every chat is a sandbox — resume or share chats as sandboxed environments with friends or agents across devices.",
  "Why Tiles: sensitive knowledge work stays private on your machines, with secure collaboration built in; out-of-the-box on first open without API keys, model or harness selection, sync sessions and work across devices without leaking data to a cloud vendor, share chats publicly or privately without copy-pasting threads elsewhere, sovereignty over your online identity and data with DID and UCAN for local control and ATproto for social features, use models on remote machines as if they were local, Offline Installer bundles the model for air-gapped use.",
  "Use cases: Individuals plan finances, track health notes, and journal privately, run models locally, sync across devices, and share only when they choose. Coworking spaces turn shared compute into private AI infrastructure so members can use local models from their own devices while keeping identity and data private. Researchers review literature, analyze datasets, and run agents in preconfigured, resumable research sandboxes. Enterprises deploy private agentic systems powered by open frontier models, secure users and agents with zero-trust authentication and authorization, simplify team management, and reduce infrastructure and model costs.",
  "Platform support: Apple Silicon, Linux.",
]

export const PLUGINS_FULL = [
  "Tiles supports the open Agent Plugins standard for portable workflow plugins: https://agent-plugins.org/.",
  "Agent Plugins use a root plugin.json manifest and can include Agent Skills under skills/, MCP servers in mcp.json, and client-specific extensions in reverse-domain directories.",
  "Current install pattern:",
  "tiles plugin install https://download.tiles.run/plugins/caldir.zip",
  "Plugins are distributed as zip files under https://download.tiles.run/plugins/.",
]

export const MISSION_FULL = [
  "Our mission is to build software that gives people greater agency, control, and choice in their digital lives.",
  "Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you.",
  "Tiles focuses on privacy-focused engineering and practical consumer experience.",
]

export const HELP_FULL = [
  "Get help",
  "Find the shortest path from stuck to moving again.",
  "Documentation: install Tiles, read the manual, check Tilekit docs, and get unstuck on setup.",
  "GitHub Issues: report reproducible bugs, request features, and track fixes in the open.",
  "Discord: fast async help from users and maintainers when you need a quick route forward.",
  "Support FAQ: include Tiles version, operating system version, exact output, screenshots if useful, and the shortest reproduction steps for bug reports. Feature requests should include workflow context, current workaround, and the outcome you want. Discord is used because the team is doing what it can with what it has, meeting people on their level while building something better. Releases has all versions and download links. Download has the latest version. Status has service availability.",
]

export const PRESS_KIT_INTRO = [
  "Tiles press kit",
  "Editorial summary, brand files, screenshots, company details, and contact details for writing about Tiles.",
]

export const PRESS_KIT_BODY = [
  "Tiles runs open models on your own device, so your conversations and data stay with you. Peer-to-peer encrypted sync connects your devices without a central server, and social features are built on the AT Protocol. Identity is user-owned through locally generated DIDs and UCANs, so your data and identity remain yours.",
  "Tiles is in public alpha for macOS and Linux. It is built by Tiles Privacy Technologies Pvt. Ltd., an independent team based in Bengaluru, India.",
  "",
  "Company details:",
  "Legal name: Tiles Privacy Technologies Pvt. Ltd.",
  "GSTIN: 29AANCT5152A1ZB",
  "PAN: AANCT5152A",
  "CIN: U58200KA2026PTC226312",
  "TAN: BLRT28790G",
  "",
  "Contact:",
  "Press and general inquiries: hello@tiles.run",
  "Phone: +91 7338014129",
  "Address: WeWork Prestige Atlanta, 80 Feet Rd, Koramangala, Bengaluru, IN 560034",
]

export const PRESS_KIT_SCREENSHOTS =
  "Product screenshots: Tiles App, Menu bar app, shared conversation, and Tiles CLI."

export const ABOUT_FULL = [
  "About Tiles Privacy.",
  "Our mission is to build software that gives people greater agency, control, and choice in their digital lives. We believe that privacy adoption at scale must work backwards from preserving utility. This means negligible impact on user experience, model intelligence, throughput, latency, tool use & agentic capabilities, and web access.",
  ...MOZILLA_COHORT_LINES,
  "Tiles was born from the discussions in User & Agents (https://www.userandagents.org), a community focused on shaping the future of user-agent systems. We are also a signatory to the European Social Stack initiative (https://european.social/#signatories), supporting an open, interoperable, and publicly accountable digital ecosystem for Europe.",
  "Tiles Privacy is built by a small independent team of three: Ankesh Bharti, Anandu Pavanan, and Prashant Mishra.",
  "The project is advised by Boris Mann, Dietrich Ayala, and Gordon Brander.",
  "Sponsor Tiles Privacy. Support a small team building private, local-first AI that preserves user agency.",
  "We are grateful to the individuals and organizations who support our work financially, including through GitHub Sponsors and cryptocurrency donations.",
]

export const INDIA_FOSS_TALK_INTRO = [
  "Tiles at India FOSS",
  "Speaker: Ankesh Bharti",
  "Presented at IndiaFOSS 2026 in Bengaluru.",
  "Slides and speaker-note transcript:",
]

export const BLOG_INDEX_INTRO = [
  "The Tiles Blog",
  "Privacy technology for everyone.",
  "Posts here use the Standard.site lexicon for rich presentation in supported ATproto clients and are stored on a PDS hosted by Eurosky.",
]

export const RESOURCES_INTRO = [
  "A living index of resources (articles, papers, talks, videos, and tools) that inform and inspire the Tiles team's work.",
  "The list can also be viewed on Semble: https://semble.so/profile/tiles.run/collections/3mkplxagc4i2q",
]

/** Book pages listed in /llms.txt, in order. Hidden chapters stay out. */
export const LLMS_INDEX_BOOK_SLUGS = [
  "",
  "overview",
  "manual",
  "models",
  "tilekit",
  "security",
  "community",
  "opensource",
  "licenses",
] as const
