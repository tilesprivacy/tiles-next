export interface OwnYourAiSlide {
  number: number
  transcript: string[]
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
    transcript: [
      'Today, I want to talk about reclaiming control of our digital lives in the age of AI.',
      'I think that starts by running AI locally, on our own devices.',
      'And it continues by building on open protocols instead of closed platforms.',
      'Together, those two ideas let us own our data, our identity, and how our AI works.',
    ],
  },
  {
    number: 3,
    transcript: [
      'I love ChatGPT, and I have been using both ChatGPT and Atlas browser since they launched.',
      'What keeps me coming back is not just the models. It is the consistency of the user experience and the continuity that memory provides across its product surfaces.',
      'It feels less like using a chatbot and more like using an app that knows me.',
      'It started feeling more like a relationship.',
      'And that made me ask a different question: what kind of relationship do I actually have with these systems?',
    ],
  },
  {
    number: 4,
    transcript: [
      'That is when I realized the relationship had become one-sided.',
      'The more ChatGPT learned about me, the more power it held over my digital life.',
      'If I stop paying the rent, part of my digital memory disappears with it.',
      'And because I do not fully trust who can access what I share, I cannot always express myself freely.',
      'I love using AI.',
      'I just do not love depending on something I do not own or control.',
    ],
  },
  {
    number: 5,
    transcript: [
      'This made me realize I needed healthier boundaries.',
      'I want to keep the same convenience without depending on blind trust.',
      'I want my identity and memory to stay with me across every app I use, with trust that I can verify computationally.',
      'I still want the relationship. I just want it to be on my terms.',
    ],
  },
  {
    number: 6,
    transcript: [
      'That naturally led me to one question.',
      'Can we actually build AI like this today?',
      'I think we finally can, with the technology we have available today.',
      'Three things have changed.',
    ],
  },
  {
    number: 7,
    transcript: [
      'First, the frontier AI is no longer locked behind proprietary APIs.',
      'For many practical workloads, frontier capability is already available as open weight models as seen in this chart by Artificial Analysis.',
    ],
  },
  {
    number: 8,
    transcript: [
      'Southbridge AI, an AI data infrastructure company compared Claude Opus 4.8 with the open-weight GLM 5.2 model on 50 real production pull requests, and GLM 5.2 performed better, becoming the model they shipped in for their app.',
    ],
  },
  {
    number: 9,
    transcript: [
      'The second change is the amount of compute we now have in consumer devices.',
      'Technologies like UltraFusion combine two Apple Silicon Max chips into a single Ultra chip, enabling medium-class local models to run on device.',
    ],
  },
  {
    number: 10,
    transcript: [
      'With RDMA over Thunderbolt 5 in macOS 26, Apple Silicon Macs can share a unified memory pool with dramatically lower latency, making distributed local AI workloads practical and enabling even the largest frontier-class open-weight models to run locally.',
    ],
  },
  {
    number: 11,
    transcript: [
      'It is not just about running frontier models on expensive on-device setups.',
      'Small models are delivering significantly more intelligence per watt.',
      'And as frontier open-weight models improve, techniques like distillation rapidly transfer those gains to smaller local models.',
    ],
  },
  {
    number: 12,
    transcript: [
      'We are also finding smarter ways to run larger models at the edge.',
      'Apple’s upcoming Siri in iOS 27 is powered by Foundation Model 3, a distilled version of Gemini, and runs a 20B Mixture-of-Experts model directly on the iPhone.',
      'It loads expert weights from fast flash storage instead of keeping the entire model in memory, and by loading them once per prompt rather than once per token, it largely compensates for the higher latency of flash storage.',
    ],
  },
  {
    number: 13,
    transcript: [
      'The third change is the growing adoption of open protocols like ATproto and ActivityPub among others.',
      'Bluesky, built on ATproto, has grown to over 45 million users, with a thriving developer ecosystem building user-owned applications.',
    ],
  },
  {
    number: 14,
    transcript: [
      'We now have the models.',
      'We now have the compute.',
      'And we now have the protocols.',
      'The technology is finally here.',
      'But products have not caught up yet.',
    ],
  },
  {
    number: 15,
    transcript: [
      'Today’s local AI tools are technically excellent.',
      'They are built around private, personal use, and local AI is naturally great for that.',
      'But privacy does not mean I do not want to collaborate.',
      'I still want to share, work together, and move between my own devices, just on my own terms.',
      'Most local AI products simply do not support that.',
    ],
  },
  {
    number: 16,
    transcript: [
      'And when they do, they still depend on platforms.',
      'Collaboration features usually require a centralized login, like “Sign in with Google.”',
      'So instead of owning my identity, I am still relying on someone else’s platform.',
      'I just traded one platform dependency for another, even with supposedly private local AI tools.',
    ],
  },
  {
    number: 17,
    transcript: [
      'So I started thinking about what my dream local AI tool would look like.',
      'Everything on this slide comes down to one idea.',
      'I wanted all the polish of modern AI products, but working for me instead of the platform.',
      'And that means polished on-device models, peer-to-peer sync, user-owned identity, shared links, and developer tools that make local AI feel just as seamless as the cloud.',
    ],
  },
  {
    number: 18,
    transcript: [
      'That led me to build Tiles.',
      'It is a local-first private AI assistant.',
      'Today it is in alpha with a CLI-only experience.',
      'We are actively optimizing inference performance, and within the next month I expect Tiles to be ready for daily use.',
      'Tiles is built to make ownership the default, without compromising on convenience.',
      'Let me show you how it works.',
    ],
  },
  {
    number: 19,
    transcript: [
      'The architecture follows one simple principle.',
      'Keep ownership on the device. Use the network only where it adds value.',
      'Apps, models, and your data live on your local devices.',
      'The cloud is only used for collaboration. The ATproto PDS powers social features, while end-to-end encrypted peer-to-peer sync is supported by public relays.',
    ],
  },
  {
    number: 20,
    transcript: [
      'Before I jump into the demo, I want to spend just a few minutes showing what this looks like under the hood.',
      'The architecture is split into three layers, built with Rust for the core systems, Python for inference, and TypeScript for the agent runtime.',
      'The REPL is what you interact with today. The CLI acts as the control plane, while Pi is embedded as a Bun binary that runs the agentic loop.',
      'Inside the core, we have a Modelfile parser for declaratively configuring models and a plugin system that lets developers add new capabilities like skills without changing the core runtime.',
      'For local storage, we use SQLCipher for encrypted SQLite storage.',
      'The collaboration layer uses Iroh for peer to peer networking, powering features like chat sync and remote links, with DID and UCAN providing zero trust authentication and authorization.',
      'For social features, shared chats are represented as Tiles lexicon records in the user’s ATproto PDS, while privately shared chats are encrypted and stored in the user’s PDS, with the decryption key embedded in the URL itself.',
      'We built the inference stack around gpt-oss-20b, using Harmony Renderer and the Open Responses API, with mlx-lm on Apple Silicon and llama.cpp on Linux.',
      'Now, with that overview, let’s move on to the demos.',
    ],
  },
  { number: 21, transcript: [] },
  { number: 22, transcript: [] },
  { number: 23, transcript: [] },
  { number: 24, transcript: [] },
  {
    number: 25,
    transcript: [
      'Tiles is maintained by the three of us.',
      'I lead product and research, while Anandu and Prashant lead engineering.',
    ],
  },
  {
    number: 26,
    transcript: ['Tiles is fortunate to be advised by Boris Mann, Dietrich Ayala, and Gordon Brander.'],
  },
  {
    number: 27,
    transcript: [
      'Tiles is really a product of the local-first community, and many of the technologies we use in Tiles came directly from the work of people in this room.',
      'User & Agents has been an incredible community partner where many of these ideas took shape.',
      'Darkshapes, our design partner, helped turn those ideas into the visual identity of Tiles.',
    ],
  },
  {
    number: 28,
    transcript: [
      'Special thanks to Dietrich and Luke, my co-founders of User & Agents, along with Boris, Xi Zhang, Hugo, and everyone who sponsored Tiles, shared advice, or helped along the way.',
      'I genuinely would not be standing here today without all of you.',
    ],
  },
  {
    number: 29,
    transcript: [
      'That is all I wanted to share.',
      'I would love for you to try Tiles on Mac or Linux and tell me what you think.',
      'If you would like to contribute or chat about local-first AI, please come find me afterwards.',
      'I also brought some Tiles swag, so if you would like one, come grab it from me after the talk.',
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

export const ownYourAiBlogContent = `${ownYourAiTalkIntro}

${ownYourAiSlides
  .map((slide) => {
    const transcript = slide.transcript.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")

    return `<figure><img src="${ownYourAiSlideSrc(slide.number)}" alt="Slide ${slide.number}" /></figure>${transcript}`
  })
  .join("\n\n")}`
