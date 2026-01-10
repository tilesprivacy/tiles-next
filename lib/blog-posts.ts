export interface BlogPost {
  slug: string
  title: string
  description: string
  date: Date
  content: string // Full HTML content for RSS feed
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-tiles-alpha",
    title: "Introducing Tiles Alpha",
    description: "We're building open-source technology for local-first models, enabling personalized software experiences without sacrificing accessibility or privacy.",
    date: new Date("2026-01-02"),
    content: `<img src="/kingston.webp" alt="Cover image for Introducing Tiles Alpha" style="width: 100%; height: auto; margin-bottom: 2rem;" />

<p>We're building open-source technology for local-first models, enabling personalized software experiences without sacrificing accessibility or privacy. We believe identity and memory are two sides of the same coin, and Tiles makes that coin yours: your user-agent. Our first product is an on-device memory management solution for privacy-conscious users, paired with an SDK that empowers developers to securely access user memory and customize agent experiences.</p>

<h2>Philosophy</h2>

<p>Our goal with Tiles is to co-design both fine-tuned models and the underlying infrastructure and developer tooling to maximize efficiency in local and offline systems for inference and training.</p>

<p>The project is defined by four interdependent design choices<a href="#ref-1">¹</a>:</p>

<ol>
  <li>
    <strong>Device-anchored identity with keyless ops:</strong> Clients are provisioned through the device keychain and cannot access the registry by identity alone<a href="#ref-2">²</a>. Keyless operations are only enabled after an identity is verified and linked to the device key, allowing third-party agent access under user-defined policies<a href="#ref-3">³</a>.
  </li>
  <li>
    <strong>Immutable model builds:</strong> Every build is version-locked and reproducible, ensuring consistency and reliability across updates and platforms.
  </li>
  <li>
    <strong>Content-hashed model layers:</strong> Models are stored and referenced by cryptographic hashes of their layers, guaranteeing integrity and enabling efficient deduplication and sharing.
  </li>
  <li>
    <strong>Verifiable transparency and attestations:</strong> Every signing and build event is logged in an append-only transparency log, producing cryptographic attestations that can be independently verified. This ensures accountability, prevents hidden modifications, and provides an auditable history of model provenance across devices and registries.
  </li>
</ol>

<h2>Implementation</h2>

<p>Our first alpha is a CLI assistant app for Apple Silicon devices, complemented by a Modelfile<a href="#ref-4">⁴</a> based SDK that lets developers customize local models and agent experiences within Tiles. We aim to evolve Modelfile in collaboration with the community, establishing it as the standard for model customization.</p>

<img src="/tilescli.png" alt="Tiles CLI" style="width: 100%; height: auto; margin: 2rem 0;" />

<p>Tiles bundles a fine-tuned model to manage context and memories locally on-device with hyperlinked markdown files. Currently, we use <a href="https://huggingface.co/driaforall/mem-agent" target="_blank" rel="noopener noreferrer">mem-agent</a> model (from <a href="https://dria.co/" target="_blank" rel="noopener noreferrer">Dria</a>, based on <code>qwen3-4B-thinking-2507</code>), and are in the process of training our initial in-house memory models.</p>

<p>These models utilize a human-readable external memory stored as markdown, and learned policies (trained via reinforcement learning on synthetically generated data) to decide when to call Python functions that retrieve, update, or clarify memory, allowing the assistant to maintain and refine persistent knowledge across sessions.</p>

<h2>Looking forward</h2>

<p>We're building the next layer of private personalization: customizable memory, private sync, verifiable identity, and a more open model ecosystem.</p>

<ul>
  <li>
    <strong>Memory extensions:</strong> Add support for LoRA-based memory extensions so individuals and organizations can bring their own data and shape the assistant's behavior and tone on top of the base memory model.
  </li>
  <li>
    <strong>Sync:</strong> Build a reliable, peer-to-peer sync layer using <a href="https://www.iroh.computer/" target="_blank" rel="noopener noreferrer">Iroh</a> for private, device-to-device state sharing.
  </li>
  <li>
    <strong>Identity:</strong> Ship a portable identity system using <a href="https://atproto.com/specs/did" target="_blank" rel="noopener noreferrer">AT Protocol DIDs</a>, designed for device-anchored trust.
  </li>
  <li>
    <strong>SDK and standards:</strong> Work with the <a href="https://darkshapes.org/" target="_blank" rel="noopener noreferrer">Darkshapes</a> team to support the <a href="https://huggingface.co/darkshapes/MIR_" target="_blank" rel="noopener noreferrer">MIR</a> (Machine Intelligence Resource) naming scheme in our Modelfile implementation.
  </li>
  <li>
    <strong>Registry:</strong> Continue supporting Hugging Face, while designing a decentralized registry for versioned, composable model layers using the open-source <a href="https://github.com/huggingface/xet-core" target="_blank" rel="noopener noreferrer">xet-core</a> client tech.
  </li>
  <li>
    <strong>Research roadmap:</strong> As part of our research on private software personalization infrastructure, we are investigating sparse memory finetuning, text diffusion models, Trusted Execution Environments (TEEs), and Per-Layer Embeddings (PLE) with offloading to flash storage.
  </li>
</ul>

<p>We are seeking design partners for training workloads that align with our goal of ensuring a verifiable privacy perimeter. If you're interested, please reach out to us at <a href="mailto:hello@tiles.run">hello@tiles.run</a>.</p>

<h2>References</h2>

<ol>
  <li id="ref-1">
    <a href="https://newsletter.squishy.computer/p/decentralizability" target="_blank" rel="noopener noreferrer">Decentralizability, Gordon Brander</a>
  </li>
  <li id="ref-2">
    <a href="https://keybase.io/blog/keybase-new-key-model" target="_blank" rel="noopener noreferrer">Keybase's New Key Model</a>
  </li>
  <li id="ref-3">
    <a href="https://www.sigstore.dev/how-it-works" target="_blank" rel="noopener noreferrer">Sigstore: How It Works</a>
  </li>
  <li id="ref-4">
    <a href="https://docs.ollama.com/modelfile" target="_blank" rel="noopener noreferrer">Ollama Modelfile</a>
  </li>
</ol>`,
  },
]
