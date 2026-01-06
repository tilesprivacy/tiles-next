
We’re building open-source technology for local-first models, enabling personalized software experiences without sacrificing accessibility or privacy. We believe identity and memory are two sides of the same coin, and Tiles makes that coin yours: your user-agent. Our first product is an on-device memory management solution for privacy-conscious users, paired with an SDK that empowers developers to securely access user memory and customize agent experiences.

We plan to offer the consumer application as a one-time license per generation, with future generations requiring a new license to unlock additional features.

---

**Philosophy**

Our goal with Tiles is to co-design both fine-tuned models and the underlying infrastructure and developer tooling to maximize efficiency in local and offline systems for inference and training.

The project is defined by four interdependent design choices¹:

1. **Device-anchored identity with keyless ops:** Clients are provisioned through the device keychain and cannot access the registry by identity alone². Keyless operations are only enabled after an identity is verified and linked to the device key, allowing third-party agent access under user-defined policies³.

2. **Immutable model builds:** Every build is version-locked and reproducible, ensuring consistency and reliability across updates and platforms.

3. **Content-hashed model layers:** Models are stored and referenced by cryptographic hashes of their layers, guaranteeing integrity and enabling efficient deduplication and sharing.

4. **Verifiable transparency and attestations:** Every signing and build event is logged in an append-only transparency log, producing cryptographic attestations that can be independently verified. This ensures accountability, prevents hidden modifications, and provides an auditable history of model provenance across devices and registries.

---

**Implementation**

Our software stack includes a macOS app and a Modelfile⁴-based SDK. The Tiles app acts as a transparent, protocol-driven proxy between the user and AI agents, leveraging a fine-tuned model to manage context and memories locally on-device with hyperlinked markdown files. Next, we are focusing on our sync system (built with Iroh) and an identity system based on public key cryptography and verifiable attestations.

---

**Tiles CLI**

Our first-generation prototype is a single-file executable CLI, complemented by a Modelfile-based SDK that lets developers customize local models and agent experiences within Tiles. We aim to evolve Modelfile in collaboration with the community, establishing it as the standard for model customization.

Through the registry, users can download open-weights models fine-tuned for memory. Currently, we use a mem-agent (from Dria, based on qwen3-4B-thinking-2507), and are in the process of training our initial in-house memory models.

These models utilize a human-readable external memory stored as markdown, and learned policies (trained via reinforcement learning on synthetically generated data) to decide when to call Python functions that retrieve, update, or clarify memory—allowing the agent to maintain and refine persistent knowledge across sessions.

We are actively adding support for memory extensions with LoRA adapters so users and organizations can bring their own data and augment the base memory models to reflect the personality they want.

On the inference side, we use LM Studio’s mlx-engine as our backend on Mac, with plans to add Linux and server-side model support.

For identity, we are building an AT Proto DID-based system, targeted for Q1 2026 (pending public/private crypto components needed for zero-knowledge security). The system keeps the unencrypted private key and chat logs client-side, following Mozilla’s architecture for their managed platform as described [here](https://example.com).

On the SDK front, we’re collaborating with the Darkshapes team to support the MIR (Machine Intelligence Resource) model naming scheme in our Modelfile implementation ([learn more](https://example.com)). We currently support Hugging Face, and plan to build our own decentralized registry, using the open-source xet-core implementation for model layering.

Our research into private software personalization infrastructure currently explores sparse memory finetuning, text diffusion models, Trusted Execution Environments (TEEs), and Per-Layer Embeddings (PLE) with flash storage offloading.

We’re seeking design partners for training workloads aligned with our goal of ensuring a verifiable privacy perimeter. Interested? Contact us: hello@tiles.run.

---

**References**

- Decentralizability, Gordon Brander
- Keybase’s New Key Model
- Sigstore: How It Works
- Ollama Modelfile
