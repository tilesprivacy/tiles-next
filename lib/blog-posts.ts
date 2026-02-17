export interface BlogPost {
  slug: string
  title: string
  description: string
  date: Date
  /** Person ID from `lib/people.ts` (sourced from homepage identities). */
  author?: string
  coverImage?: string
  coverAlt?: string
  content: string // Full HTML content for RSS feed
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-tiles-public-alpha",
    title: "Introducing Tiles Public Alpha",
    description: "Announcing Tiles Public Alpha: our first release of a privacy-first AI assistant with local models, a CLI app for Apple Silicon, and a Modelfile-based SDK for developers.",
    date: new Date("2026-01-02"),
    author: "ankesh-bharti",
    coverImage: "/kingston.webp",
    coverAlt: "Cover image for Introducing Tiles Public Alpha",
    content: `<img src="/kingston.webp" alt="Cover image for Introducing Tiles Public Alpha" style="width: 100%; height: auto; margin-bottom: 2rem;" />

<p>We're thrilled to launch Tiles Public Alpha, our first public release of a privacy-first AI assistant. Tiles brings together local-first models, personalized experiences, and verifiable privacy—all running on your device, with your data staying yours. We believe identity and memory are two sides of the same coin, and Tiles makes that coin yours: your user-agent.</p>

<p>Our first alpha is a CLI assistant app for Apple Silicon devices, and a Modelfile<a href="#ref-1">¹</a> based SDK that lets developers customize local models and agent experiences within Tiles. We aim to evolve Modelfile in collaboration with the community, establishing it as the standard for model customization.</p>

<h2>Philosophy</h2>

<p>The project is defined by four interdependent design choices<a href="#ref-2">²</a>:</p>

<ol>
  <li>
    <strong>Device-anchored identity with keyless ops:</strong> Clients are provisioned through the device keychain and cannot access the registry by identity alone<a href="#ref-3">³</a>. Keyless operations are only enabled after an identity is verified and linked to the device key, allowing third-party agent access under user-defined policies<a href="#ref-4">⁴</a>.
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
    <strong>MIR in Modelfile:</strong> Work with the <a href="https://darkshapes.org/" target="_blank" rel="noopener noreferrer">Darkshapes</a> team to support the <a href="https://huggingface.co/darkshapes/MIR_" target="_blank" rel="noopener noreferrer">MIR</a> (Machine Intelligence Resource) naming scheme in our Modelfile implementation.
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
    <a href="https://docs.ollama.com/modelfile" target="_blank" rel="noopener noreferrer">Ollama Modelfile</a> is the blueprint to create and share customized models using Ollama.
  </li>
  <li id="ref-2">
    <a href="https://newsletter.squishy.computer/p/decentralizability" target="_blank" rel="noopener noreferrer">Decentralizability</a> (Gordon Brander): Immutable data, universal IDs, user-controlled keys… and just using HTTP. I think this is probably minimum viable decentralizability.
  </li>
  <li id="ref-3">
    <a href="https://keybase.io/blog/keybase-new-key-model" target="_blank" rel="noopener noreferrer">Keybase's New Key Model</a>
  </li>
  <li id="ref-4">
    <a href="https://www.sigstore.dev/how-it-works" target="_blank" rel="noopener noreferrer">Sigstore: How It Works</a>
  </li>
</ol>`,
  },
  {
    slug: "move-along-python",
    title: "Move Along, Python",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
    date: new Date("2026-02-17"),
    author: "anandu-pavanan",
    coverImage: "/og-plain.png",
    coverAlt: "Move Along, Python – deterministic, portable Python runtimes for Tiles using layered venvstacks",
    content: `<p>We have been working on <a href="https://www.tiles.run/" target="_blank" rel="noopener noreferrer">Tiles</a>, a private and secure AI assistant for everyday use.</p>

<h2>The Python Problem</h2>

<p>Right now, we have a polyglot architecture where the control pane and CLI are written in Rust, while local model inference runs through a Python server as a daemon. Ideally, when we ship Tiles, we should also ship the required artifacts needed to run Python on the user’s system.</p>

<p>Since Python servers cannot be compiled into a single standalone binary, the user’s system must have a Python runtime available. More importantly, it must be a deterministic Python runtime so that the server runs exactly on the version developers expect.</p>

<p>In earlier releases of Tiles (before 0.4.0), we packed the server files into the final release tarball. During installation, we extracted them to the user’s system, downloaded <code>uv</code> (a Python package manager), installed Python 3.13 if it was not already present, and then ran the server as a daemon.</p>

<p>This approach had several issues:</p>

<ul>
  <li>Downloading development-related tools such as <code>uv</code> onto the user’s system</li>
  <li>Relying on <code>uv</code> at install time to manage dependencies and run the server</li>
  <li>Increased chances of failures due to dependency or runtime non-determinism</li>
  <li>Requiring internet access to download all of the above tools</li>
  <li>Lack of a fully deterministic runtime across operating systems</li>
</ul>

<p>One of the long-term goals of Tiles is complete portability. The previous approach did not align with that vision.</p>

<h2>Portable Runtimes</h2>

<p>To address these issues, we decided to ship the runtime along with the release tarball. We are now using <a href="https://lmstudio.ai/blog/venvstacks" target="_blank" rel="noopener noreferrer">venvstacks</a> by LM Studio to achieve this.</p>

<p>Venvstacks allows us to build a layered Python environment with three layers:</p>

<ul>
  <li><strong>Runtimes</strong><br />
  Defines the exact Python runtime version we need.</li>
  <li><strong>Frameworks</strong><br />
  Specifies shared Python frameworks such as NumPy, MLX, and others.</li>
  <li><strong>Applications</strong><br />
  Defines the actual server application and its specific dependencies.</li>
</ul>

<p>Similar to Docker, each layer depends on the layer beneath it. A change in any layer requires rebuilding that layer and the ones above it.</p>

<p>All components within a layer share the layers beneath them. For example, every framework uses the same Python runtime defined in the <code>runtimes</code> layer. Likewise, if we have multiple servers in the <code>applications</code> layer and both depend on MLX, they will share the exact deterministic MLX dependency defined in <code>frameworks</code>, as well as the same Python runtime defined in <code>runtimes</code>.</p>

<p>We define everything inside a <code>venvstacks.toml</code> file. Here is the <a href="https://github.com/tilesprivacy/tiles/blob/main/server/stack/venvstacks.toml" target="_blank" rel="noopener noreferrer">venvstacks.toml</a> used in Tiles.</p>

<p>Because we pin dependency versions in the TOML file, we eliminate non-determinism.</p>

<p>Internally, venvstacks uses <code>uv</code> to manage dependencies. Once the TOML file is defined, we run:</p>

<pre><code>venvstacks lock venvstacks.toml</code></pre>

<p>This resolves dependencies and creates the necessary folders, lock files, and metadata for each layer.</p>

<p>Next:</p>

<pre><code>venvstacks build venvstacks.toml</code></pre>

<p>This builds the Python runtime and environments based on the lock files.</p>

<p>Finally:</p>

<pre><code>venvstacks publish venvstacks.toml</code></pre>

<p>This produces reproducible tarballs for each layer. These tarballs can be unpacked on external systems and run directly.</p>

<p>We bundle the venvstack runtime artifacts into the final installer using this <a href="https://github.com/tilesprivacy/tiles/blob/main/scripts/bundler.sh" target="_blank" rel="noopener noreferrer">bundler script</a>. During installation, this <a href="https://github.com/tilesprivacy/tiles/blob/main/scripts/install.sh" target="_blank" rel="noopener noreferrer">installer script</a> extracts the venvstack tarballs into a deterministic directory.</p>

<p>Our Rust CLI can then predictably start the Python server using:</p>

<pre><code>stack_export_prod/app-server/bin/python -m server.main
</code></pre>

<h2>What’s Next</h2>

<p>We tested version 0.4.0 on clean macOS virtual machines to verify portability, and the approach worked well.</p>

<p>For now, we are focusing only on macOS. When we expand support to other operating systems, we will revisit this setup and adapt it as needed.</p>

<p>Packaging the runtime and dependencies increases the size of the final installer. We are exploring ways to reduce that footprint.</p>

<p>We also observed that changes in lock files can produce redundant application tarballs when running the <code>publish</code> command. More details are tracked in this <a href="https://github.com/tilesprivacy/tiles/issues/84" target="_blank" rel="noopener noreferrer">issue</a>.</p>

<p>Overall, we are satisfied with this approach for now.</p>

<p>Till then, keep on tiling.</p>`,
  },
]
