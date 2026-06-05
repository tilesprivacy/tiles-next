---
title: Ship it up
description: How we package and ship Tiles
date: 2026-04-05
coverImage: shipitup.png
tags:
  - tiles
  - packaging
  - macos
draft: false
atUri: "at://did:plc:mqmcsjuerbjhu65mpmvkcuw2/site.standard.document/3mnl4nj55n22l"
---

We ship Tiles as a `tar.gz` tarball and as a native macOS `.pkg`. Either format follows the same broad steps:

- Assemble the deliverable by packaging the Tiles binary and the Python venvstack artifacts into one installer payload.
- Run the installer to copy the Tiles binary and Python artifacts into the correct locations on disk.
- Run postinstall scripts.

In early releases, the tarball was the only install path. It served us well, but it had clear limits.

- Because the release artifact is a gzip tarball, we cannot codesign, notarize, and staple the archive itself the way we can a full installer. We run those steps on the Tiles binary only, not on the entire `.gz` file.
- Installation relies on a curl-based script. That is workable for developers and rougher for everyone else.
- The flow leaves little room to tailor copy, branding, or steps in the installer UI.

We wanted a path that fits Apple's signing and notarization story and feels native on macOS. Installers ship as `.dmg` or `.pkg` bundles; we chose `.pkg` because it can run scripts, uses a familiar installer UI, and supports customization with simple HTML. What follows is how we build that `.pkg` for Tiles.

## Install file structure

The layout matches the directory tree shown in the website post. When we build the package, we point the tooling at this `pkgroot` directory as the install root. The installer copies that tree onto the destination volume and creates intermediate directories as needed.

For each release, we build a fresh Tiles binary into `pkgroot/usr/local/bin` and place the remaining updated artifacts under `pkgroot/usr/local/share/tiles/`.

The [build script](https://github.com/tilesprivacy/tiles/blob/main/pkg/build.sh) in the repo has the full sequence.

## Code signing the Tiles binary

Code signing gives us:

- A signed Tiles binary that cannot be altered without invalidating the signature.
- A signature from a developer certificate that Apple trusts.

You need an Apple Developer account and two certificate types: **DEVELOPER ID APPLICATION** for the binary and **DEVELOPER ID INSTALLER** for the `.pkg`. The finished installer wraps the signed binary and the other artifacts in one compressed package.

For creating and exporting those certificates, the CodeVamping [macOS pkg installer article](https://www.codevamping.com/2023/11/macos-pkg-installer/) covers the details.

```bash
codesign --force \
  --sign "$DEVELOPER_ID_APPLICATION" \
  --options runtime \
  --timestamp \
  --strict \
  "${CLI_BIN_PATH}/tiles"
```

The snippet signs the Tiles CLI. `$DEVELOPER_ID_APPLICATION` is an environment variable that holds the common name of the Developer ID Application certificate.

## Scripts

Bash scripts can run before and after the payload is laid down. We keep **preinstall** and **postinstall** scripts in a directory and pass that path into `pkgbuild`.

The Tiles repo has [those scripts](https://github.com/tilesprivacy/tiles/tree/main/pkg/scripts); they handle cleanup and internal setup.

## Building the Tiles package

With the signed Tiles binary and the rest of the install tree under `pkgroot`, we run:

```bash
pkgbuild --root pkgroot --scripts \
  pkg/scripts --identifier com.tilesprivacy.tiles --version "$VERSION" \
  pkg/tiles-unsigned.pkg
```

`--root` is `pkgroot`; `--scripts` points at the directory from the previous section.

## Customizing the installer

Opening the unsigned package from the previous step shows Apple's default, minimal flow. We layer on welcome and conclusion screens, a logo, and other panels with an Apple distribution file.

The result is still a normal macOS package, but it reads more like a Tiles installer and less like a generic payload.

