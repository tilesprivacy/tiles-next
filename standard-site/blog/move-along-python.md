---
title: "Move Along, Python"
description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks."
publishDate: "2026-02-17"
ogImage: "/og-image.jpg"
tags:
  - Tiles
  - Python
  - packaging
  - venvstacks
atUri: "at://did:plc:mqmcsjuerbjhu65mpmvkcuw2/site.standard.document/3mnmj3b7f5u2g"
---

We have been working on [Tiles](https://www.tiles.run/). Tiles is a local-first private AI assistant that runs on-device models with encrypted P2P sync, keeps your data and identity yours, and supports sharing chats with ATProto. To ensure its Python model server starts predictably on any machine, the runtime and dependencies must be deterministic and portable. This post walks through how we achieve that with layered venvstacks.

## The Python Problem

Right now, we have a polyglot architecture where the control plane and CLI are written in Rust, while local model inference runs through a Python server as a daemon. Ideally, when we ship Tiles, we should also ship the required artifacts needed to run Python on the user's system.

Since Python servers cannot be compiled into a single standalone binary, the user's system must have a Python runtime available. More importantly, it must be a deterministic Python runtime so that the server runs exactly on the version developers expect.

In earlier releases of Tiles (before 0.4.0), we packed the server files into the final release tarball. During installation, we extracted them to the user's system, downloaded `uv` (a Python package manager), installed Python 3.13 if it was not already present, and then ran the server as a daemon.

This approach had several issues:

- Downloading development-related tools such as `uv` onto the user's system
- Relying on `uv` at install time to manage dependencies and run the server
- Increased chances of failures due to dependency or runtime non-determinism
- Requiring internet access to download all of the above tools
- Lack of a fully deterministic runtime across operating systems

One of the long-term goals of Tiles is complete portability. The previous approach did not align with that vision.

## Portable Runtimes

To address these issues, we decided to ship the runtime along with the release tarball. We are now using [venvstacks](https://lmstudio.ai/blog/venvstacks) by [LM Studio](https://lmstudio.ai) to achieve this.

Venvstacks allows us to build a layered Python environment with three layers:

- **Runtimes**: Defines the exact Python runtime version we need.
- **Frameworks**: Specifies shared Python frameworks such as NumPy, MLX, and others.
- **Applications**: Defines the actual server application and its specific dependencies.

Similar to Docker, each layer depends on the layer beneath it. A change in any layer requires rebuilding that layer and the ones above it.

All components within a layer share the layers beneath them. For example, every framework uses the same Python runtime defined in the `runtimes` layer. Likewise, if we have multiple servers in the `applications` layer and both depend on MLX, they will share the exact deterministic MLX dependency defined in `frameworks`, as well as the same Python runtime defined in `runtimes`.

## How venvstacks is used in Tiles

We define everything inside a `venvstacks.toml` file. Here is the [venvstacks.toml](https://github.com/tilesprivacy/tiles/blob/main/server/stack/venvstacks.toml) used in Tiles.

Because we pin dependency versions in the TOML file, we eliminate non-determinism.

Internally, venvstacks uses `uv` to manage dependencies. Once the TOML file is defined, we run:

```sh
venvstacks lock venvstacks.toml
venvstacks build venvstacks.toml
venvstacks publish venvstacks.toml
```

These commands resolve dependencies, create the necessary folders, lock files, and metadata for each layer, build the Python runtime and environments based on the lock files, and produce reproducible tarballs that can be unpacked on external systems and run directly.

We bundle the venvstack runtime artifacts into the final installer using this [bundler script](https://github.com/tilesprivacy/tiles/blob/main/scripts/bundler.sh). During installation, this [installer script](https://github.com/tilesprivacy/tiles/blob/main/scripts/install.sh) extracts the venvstack tarballs into a deterministic directory.

Our Rust CLI can then predictably start the Python server using:

```sh
stack_export_prod/app-server/bin/python -m server.main
```

## What's Next

We tested version 0.4.0 on clean macOS virtual machines to verify portability, and the approach worked well.

For now, we are focusing only on macOS. When we expand support to other operating systems, we will revisit this setup and adapt it as needed.

Packaging the runtime and dependencies increases the size of the final installer. We are exploring ways to reduce that footprint.

We also observed that changes in lock files can produce redundant application tarballs when running the `publish` command. More details are tracked in this [issue](https://github.com/tilesprivacy/tiles/issues/84).

Overall, we are satisfied with this approach for now.
