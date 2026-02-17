'use client'

import { useMemo } from "react"
import { blogPosts } from "@/lib/blog-posts"
import { BlogPostContent } from "@/components/blog-post-content"

export default function MoveAlongPythonPage() {
  const post = blogPosts.find((p) => p.slug === "move-along-python")

  const formattedDate = useMemo(() => {
    if (!post) return ""
    return post.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [post])

  if (!post) {
    return null
  }

  return (
    <BlogPostContent
      title={post.title}
      description={post.description}
      date={formattedDate}
      authorId={post.author}
      coverImage={post.coverImage ?? "/og-image.jpg"}
      coverAlt={post.coverAlt ?? post.title}
      content={post.content}
    >
      <p>
        We have been working on{" "}
        <a href="https://www.tiles.run/" target="_blank" rel="noopener noreferrer">
          Tiles
        </a>
        , a private and secure AI assistant for everyday use.
      </p>

      <h2>The Python Problem</h2>

      <p>
        Right now, we have a polyglot architecture where the control plane and CLI are written in Rust, while local
        model inference runs through a Python server as a daemon. Ideally, when we ship Tiles, we should also ship the
        required artifacts needed to run Python on the user’s system.
      </p>

      <p>
        Since Python servers cannot be compiled into a single standalone binary, the user’s system must have a Python
        runtime available. More importantly, it must be a deterministic Python runtime so that the server runs exactly
        on the version developers expect.
      </p>

      <p>
        In earlier releases of Tiles (before 0.4.0), we packed the server files into the final release tarball. During
        installation, we extracted them to the user’s system, downloaded <code>uv</code> (a Python package manager),
        installed Python 3.13 if it was not already present, and then ran the server as a daemon.
      </p>

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

      <p>
        To address these issues, we decided to ship the runtime along with the release tarball. We are now using{" "}
        <a href="https://lmstudio.ai/blog/venvstacks" target="_blank" rel="noopener noreferrer">
          venvstacks
        </a>{" "}
        by LM Studio to achieve this.
      </p>

      <p>Venvstacks allows us to build a layered Python environment with three layers:</p>

      <ul>
        <li>
          <strong>Runtimes</strong>
          <br />
          Defines the exact Python runtime version we need.
        </li>
        <li>
          <strong>Frameworks</strong>
          <br />
          Specifies shared Python frameworks such as NumPy, MLX, and others.
        </li>
        <li>
          <strong>Applications</strong>
          <br />
          Defines the actual server application and its specific dependencies.
        </li>
      </ul>

      <p>
        Similar to Docker, each layer depends on the layer beneath it. A change in any layer requires rebuilding that
        layer and the ones above it.
      </p>

      <p>
        All components within a layer share the layers beneath them. For example, every framework uses the same Python
        runtime defined in the <code>runtimes</code> layer. Likewise, if we have multiple servers in the{" "}
        <code>applications</code> layer and both depend on MLX, they will share the exact deterministic MLX dependency
        defined in <code>frameworks</code>, as well as the same Python runtime defined in <code>runtimes</code>.
      </p>

      <h2>How venvstacks is used in Tiles</h2>
      <p>
        We define everything inside a <code>venvstacks.toml</code> file. Here is the{" "}
        <a
          href="https://github.com/tilesprivacy/tiles/blob/main/server/stack/venvstacks.toml"
          target="_blank"
          rel="noopener noreferrer"
        >
          venvstacks.toml
        </a>{" "}
        used in Tiles.
      </p>

      <p>Because we pin dependency versions in the TOML file, we eliminate non-determinism.</p>

      <p>
        Internally, venvstacks uses <code>uv</code> to manage dependencies. Once the TOML file is defined, we run:
      </p>

      <pre>
        <code>
          {"venvstacks lock venvstacks.toml\nvenvstacks build venvstacks.toml\nvenvstacks publish venvstacks.toml"}
        </code>
      </pre>

      <p>
        These commands resolve dependencies, create the necessary folders, lock files, and metadata for each layer,
        build the Python runtime and environments based on the lock files, and produce reproducible tarballs that can
        be unpacked on external systems and run directly.
      </p>

      <p>
        We bundle the venvstack runtime artifacts into the final installer using this{" "}
        <a
          href="https://github.com/tilesprivacy/tiles/blob/main/scripts/bundler.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          bundler script
        </a>
        . During installation, this{" "}
        <a
          href="https://github.com/tilesprivacy/tiles/blob/main/scripts/install.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          installer script
        </a>{" "}
        extracts the venvstack tarballs into a deterministic directory.
      </p>

      <p>Our Rust CLI can then predictably start the Python server using:</p>

      <pre>
        <code>stack_export_prod/app-server/bin/python -m server.main</code>
      </pre>

      <h2>What’s Next</h2>

      <p>
        We tested version 0.4.0 on clean macOS virtual machines to verify portability, and the approach worked well.
      </p>

      <p>
        For now, we are focusing only on macOS. When we expand support to other operating systems, we will revisit this
        setup and adapt it as needed.
      </p>

      <p>
        Packaging the runtime and dependencies increases the size of the final installer. We are exploring ways to
        reduce that footprint.
      </p>

      <p>
        We also observed that changes in lock files can produce redundant application tarballs when running the{" "}
        <code>publish</code> command. More details are tracked in this{" "}
        <a href="https://github.com/tilesprivacy/tiles/issues/84" target="_blank" rel="noopener noreferrer">
          issue
        </a>
        .
      </p>

      <p>Overall, we are satisfied with this approach for now.</p>

      <p>Till then, keep on tiling.</p>
    </BlogPostContent>
  )
}

