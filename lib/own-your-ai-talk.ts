export interface OwnYourAiSlide {
  number: number
  transcript: string[]
  media: "image" | "video"
}

export const ownYourAiTalkIntroParagraphs = [
  'This post is adapted from a talk I gave at <a href="https://www.localfirstconf.com/" target="_blank" rel="noopener noreferrer">Local-First Conf</a> in Berlin in July 2026. It was written for the <a href="https://www.inkandswitch.com/local-first/" target="_blank" rel="noopener noreferrer">local-first</a> community, but it is relevant to anyone involved in building software.',
  'As AI becomes central to how we work and communicate, I believe we are seeing a new form of technological feudalism, where a handful of platforms control the models, identities, data, and distribution channels people depend on. Local-first AI offers an alternative, but many tools still lack the identity, sync, and collaboration features people expect.',
  'In the talk, I shared what I have learned building Tiles, a local-first private AI assistant. I discussed the tradeoffs I have encountered while combining local models with decentralized identity, peer-to-peer encrypted sync, and AT Protocol based collaboration. I also covered exploratory research we are conducting to bring the convenience of modern AI services to a user-owned stack.',
]

export const ownYourAiTalkIntro = ownYourAiTalkIntroParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n")

export const ownYourAiSlides: OwnYourAiSlide[] = [
  {
    number: 1,
    media: "image",
    transcript: [
      'Thank you, Adam, for the introduction, and thank you to the Local-First Conf team for organizing this event.',
      'Hi everyone, I am Ankesh. Usually I go by feynon on the internet.',
      'I was here in the audience last year, and it genuinely changed the direction of my work, so it is an honor to be back as a speaker.',
      'I consider myself a technologist, and my mission is to build a decentralized stack that gives people more agency over their digital lives.',
      'Today I want to share one small piece of that vision through my work with Tiles.',
    ],
  },
  {
    number: 2,
    media: "image",
    transcript: [
      'Today, I want to talk about reclaiming control of our digital lives in the age of AI.',
      'I think that starts by running AI locally, on our own devices.',
      'And it continues by building on open protocols instead of closed platforms.',
      'Together, those two ideas let us own our data, our identity, and how our AI works.',
    ],
  },
  {
    number: 3,
    media: "image",
    transcript: [
      'I love ChatGPT, and I’ve been using its products since they launched.',
      'What keeps me coming back isn\'t just the models. It\'s the consistency of the user experience and the continuity that memory provides across its product surfaces.',
      'It feels less like using a chatbot and more like using an app that knows me.',
      'It started feeling more like a relationship.',
      'And that made me ask a different question: what kind of relationship do I actually have with these systems?',
    ],
  },
  {
    number: 4,
    media: "image",
    transcript: [
      "That's when I realized the relationship had become one-sided.",
      'The more ChatGPT learned about me, the more power it held over my digital life.',
      'If I stop paying the rent, part of my digital memory disappears with it.',
      'And because I don’t fully trust who can access what I share, I can’t always express myself freely.',
      'I love using AI.',
      "I just don't love depending on something I don't own or control.",
    ],
  },
  {
    number: 5,
    media: "image",
    transcript: [
      'I needed healthier boundaries.',
      'I want to keep the same convenience without depending on blind trust.',
      'I want my identity and memory to stay with me across every app I use, with trust that I can verify computationally.',
      'I still want the relationship. I just want it to be on my terms.',
    ],
  },
  {
    number: 6,
    media: "image",
    transcript: [
      'That naturally led me to one question.',
      'Can we actually build AI like this today?',
      'I think we finally can, with the technology we have available today.',
      'Three things have changed.',
    ],
  },
  {
    number: 7,
    media: "image",
    transcript: [
      'First, the frontier AI is no longer locked behind proprietary APIs.',
      'For many practical workloads, frontier-level capabilities are already available in open-weight models such as GLM 5.2, as shown in this chart by Artificial Analysis.',
    ],
  },
  {
    number: 8,
    media: "image",
    transcript: [
      'The second change is the amount of compute we now have in consumer devices.',
      'Technologies like UltraFusion combine two Apple Silicon Max chips into a single Ultra chip, enabling medium-class local models to run on device.',
    ],
  },
  {
    number: 9,
    media: "image",
    transcript: [
      'It’s not just about running frontier models on expensive on-device setups.',
      'As frontier open-weight models improve, techniques like distillation rapidly transfer those gains to smaller local models.',
      'Small models are delivering significantly more intelligence per watt.',
    ],
  },
  {
    number: 10,
    media: "image",
    transcript: [
      'We’re also finding smarter ways to run larger models at the edge.',
      'Apple’s upcoming Siri in iOS 27 is powered by Foundation Model 3, a distilled version of Gemini, and runs a 20B Mixture-of-Experts model directly on the iPhone.',
      'It loads expert weights from fast flash storage instead of keeping the entire model in memory, and by loading them once per prompt rather than once per token, it largely compensates for the higher latency of flash storage.',
    ],
  },
  {
    number: 11,
    media: "image",
    transcript: [
      'The third change is the growing adoption of open protocols like ATproto and ActivityPub among others.',
      'Bluesky, built on ATproto, has grown to over 45 million users, with a thriving developer ecosystem building user-owned applications.',
    ],
  },
  {
    number: 12,
    media: "image",
    transcript: [
      'We now have the models.',
      'We now have the compute.',
      'And we now have the protocols.',
      'The technology is finally here.',
      'But products haven’t caught up yet.',
    ],
  },
  {
    number: 13,
    media: "image",
    transcript: [
      'Today’s local AI tools are technically excellent.',
      'They’re built around private, personal use, and local AI is naturally great for that.',
      'But privacy doesn’t mean I don’t want to collaborate.',
      'I still want to share, work together, and move between my own devices, just on my own terms.',
      'Most local AI products simply don’t support that.',
    ],
  },
  {
    number: 14,
    media: "image",
    transcript: [
      'And when they do, they still depend on platforms.',
      'Collaboration features usually require a centralized login, like “Sign in with Google.”',
      'So instead of owning my identity, I’m still relying on someone else’s platform.',
      'I just traded one platform dependency for another, even with supposedly private local AI tools.',
    ],
  },
  {
    number: 15,
    media: "image",
    transcript: [
      'So I started thinking about what my dream local AI tool would look like.',
      'Everything on this slide comes down to one idea.',
      'I wanted all the polish of modern AI products, but working for me instead of the platform.',
      'And that means polished on-device models, peer-to-peer sync, user-owned identity, shared links, and developer tools that make local AI feel just as seamless as the cloud.',
    ],
  },
  {
    number: 16,
    media: "image",
    transcript: [
      "And it's not just my dream, it's a shared one.",
      'This post, shared earlier today by Eileen, describes a similar vision of an open, local setup.',
    ],
  },
  {
    number: 17,
    media: "image",
    transcript: [
      'That led me to build Tiles, a local-first private AI assistant.',
      'Today it’s in alpha with a CLI-only experience.',
      'Tiles is built to make ownership the default, without compromising on convenience.',
    ],
  },
  {
    number: 18,
    media: "image",
    transcript: [
      'The architecture follows one simple principle.',
      'Keep ownership on the device. Use the network only where it adds value.',
      'The app, models, and your data live on your local devices.',
      'The cloud is only used for collaboration. The ATproto PDS powers social features, while end-to-end encrypted peer-to-peer sync is done with Iroh relays.',
    ],
  },
  {
    number: 19,
    media: "image",
    transcript: [
      'The technical architecture is split across three layers: Rust handles the core systems, Python powers inference, and TypeScript runs the agent runtime, which embeds Pi as a Bun binary. If you’d like to explore any particular module, I’d be happy to discuss it in more detail after the talk.',
      'Next, here’s what that looks like across Tiles’ various features.',
    ],
  },
  {
    number: 20,
    media: "image",
    transcript: [
      'Tiles includes gpt-oss-20b by default. It uses the Modelfile format, a plain-text blueprint for building and customizing local AI models.',
    ],
  },
  { number: 21, media: "image", transcript: ['Plugins let users extend Tiles with reusable workflows by installing SKILL.md files.'] },
  { number: 22, media: "image", transcript: ['Tiles securely connects to local models running on remote machines over a peer-to-peer network, giving you access to your ambient AI compute wherever you are.'] },
  { number: 23, media: "image", transcript: ['That same peer-to-peer foundation enables encrypted chat synchronization across linked devices, using locally generated DIDs and UCANs for zero-trust identity and authorization.'] },
  { number: 24, media: "image", transcript: ['Finally, chat sessions can be shared through public or private links and published as ATproto Lexicon records.'] },
  {
    number: 25,
    media: "image",
    transcript: [
      'Now, with that overview, let’s move on to a demo I recorded yesterday after being delighted by Tristan’s demo of Caldir CLI.',
    ],
  },
  {
    number: 26,
    media: "video",
    transcript: [
      'This recorded demo shows Caldir running as a Tiles plugin with remote inference.',
      'I’ll ask it to find events, then create an event. Finally, I’ll share the chat and show the saved ATProto PDS record as a Tiles lexicon.',
      'What impressed me is that this speed was possible locally because of caldir’s simple, plaintext-first design, combined with the vertical integration we’ve built into Tiles across the inference stack.',
    ],
  },
  {
    number: 27,
    media: "image",
    transcript: [
      'The three of us have been working full-time on maintaining Tiles for the past six months.',
    ],
  },
  {
    number: 28,
    media: "image",
    transcript: [
      'I’m grateful for the guidance of Boris Mann, Dietrich Ayala, and Gordon Brander on this project.',
    ],
  },
  {
    number: 29,
    media: "image",
    transcript: [
      'Tiles is really a product of the local-first community, and many of the technologies we use in Tiles came directly from the work of people in this room.',
      'User & Agents has been an incredible community partner where many of these ideas took shape.',
      'Darkshapes, our design partner, designed the Tiles logo and helped turn our ideas into the visual identity of Tiles.',
    ],
  },
  {
    number: 30,
    media: "image",
    transcript: [
      'Special thanks to Dietrich and Luke, my co-founders at User & Agents.',
      'Thank you to Boris, Xi Zhang, Hugo, and everyone who sponsored Tiles, shared advice, or helped along the way. I genuinely wouldn’t be standing here today without you.',
      'If you’re interested in sponsoring Tiles, providing funding, or exploring collaboration opportunities, please come talk to me afterwards.',
    ],
  },
  {
    number: 31,
    media: "image",
    transcript: [
      'To recap: I love ChatGPT, but I don’t want to compromise on convenience or control. Local AI and open protocols let us keep the convenience while making our data, identity, and memory portable—and truly ours.',
      'I’d love for you to try Tiles on Mac or Linux and tell me what you think.',
      'If you’d like to contribute or chat about local-first AI, please come find me afterwards.',
      'Thank you.',
    ],
  },
]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function ownYourAiSlideSrc(number: number): string {
  return `/lofi-talk/slide ${number}.png`
}

export function ownYourAiVideoSrc(): string {
  return "/lofi-talk/demo.webm"
}

export const ownYourAiBlogContent = `${ownYourAiTalkIntro}

${ownYourAiSlides
  .map((slide) => {
    const transcript = slide.transcript.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")

    const media = slide.media === "video"
      ? `<video controls preload="metadata" src="${ownYourAiVideoSrc()}" aria-label="Slide ${slide.number} demo video"></video>`
      : `<img src="${ownYourAiSlideSrc(slide.number)}" alt="Slide ${slide.number}" />`

    return `<figure>${media}</figure>${transcript}`
  })
  .join("\n\n")}`
