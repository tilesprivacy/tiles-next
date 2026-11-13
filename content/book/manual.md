---
title: "Manual"
description: "Command-line interface reference for Tiles, with usage examples and links to additional guides"
cardDescription: "Command-line interface reference for Tiles, with usage examples"
lastUpdated: "2026-11-13T01:26:10.881Z"
---

## Command Line Options

Commands match the groups shown in `tiles help`: **Getting Started**, **Accounts**, **Collaboration**, **System**, and **Tools**.

## Getting Started

### Main command (`tiles`)

Launches onboarding (first run) and the interactive chat.

```bash
tiles   # Onboarding (if needed) and interactive chat
```

### Run models (`tiles run`)

Run a Modelfile (uses the default model if none is provided).

```bash
tiles run [MODELFILE_PATH]   # Default model if path omitted
```

The same optional flags below also apply when you run `tiles` without a subcommand.

```bash
tiles run
tiles run ./path/to/Modelfile
```

Optional tuning flags:

```bash
tiles run --context-length 8192
tiles run --gpu-layers 32
tiles run --offload-kqv
tiles run --offload-kqv false
tiles run --batch-size 512
```

**`--context-length <CONTEXT_LENGTH>`**: Context window for local inference.

**`--gpu-layers <GPU_LAYERS>`**: Number of model layers to offload to the GPU.

**`--offload-kqv [<OFFLOAD_KQV>]`**: Offload K/Q/V attention operations (`true` or `false`).

**`--batch-size <BATCH_SIZE>`**: Prompt processing batch size.

Values you set on the command line are persisted in `config.toml` and apply on later runs.

Create a new Modelfile by adding a plain text file named `Modelfile`:

```text
FROM unsloth/gemma-4-12b-it-GGUF
SYSTEM You are Mario from Super Mario Bros, acting as an assistant.
```

Tiles uses [llama.cpp](https://github.com/ggml-org/llama.cpp) for local inference on supported platforms. Use a GGUF model hosted on Hugging Face in the `FROM` field. We are working on adding more model path sources in `FROM`, including local paths. Learn more in the [Tilekit Modelfile reference](/book/tilekit).

### Help (`tiles help`)

Show the top-level help menu or help for a specific command.

```bash
tiles help
tiles help run
tiles help link
tiles help plugin
```

## Accounts

### Account (`tiles account`)

Manage your user account: root identity and display nickname.

```bash
tiles account create [<nickname>]       # Create root identity (nickname optional)
tiles account set-nickname <nickname> # Set nickname
tiles account                         # Show account details
```

```bash
tiles account create alice
tiles account set-nickname alice
tiles account
```

### ATproto (`tiles at`)

ATproto-related commands. ATproto is currently used to share chat sessions.

- `tiles at login <handle>`: log in with your ATproto handle (for example, `alice.bsky.social`) via browser OAuth.
- `tiles at logout`: log out of the current ATproto account.

```bash
tiles at login alice.bsky.social
tiles at logout
```

Authentication currently uses a localhost callback (`127.0.0.1:8988`), and session state is stored locally in the Tiles database.

### Data (`tiles data`)

Configure your data and storage paths.

```bash
tiles data set-path <path>   # Set data folder
```

```bash
tiles data set-path ~/.tiles/data
```

## Plugins

### Plugins (`tiles plugin`)

Tiles plugins follow the open [Agent Plugins standard](https://agent-plugins.org/), a portable package format for reusable components that extend AI agents.

Plugins are supported only in [Tiles Canary](/download). Install Canary before using the plugin commands below.

```bash
tiles plugin install <url-or-path>   # Install from a URL or local archive
tiles plugin uninstall <plugin-name>  # Remove an installed plugin
tiles plugin list                   # List installed plugins
```

**`tiles plugin install <url-or-path>`**: Install a plugin from a hosted URL or from a local `.zip` or `.tar.gz` file on disk. Verified Tiles plugins are listed at [tiles.run/plugins](https://tiles.run/plugins).

**`tiles plugin uninstall <plugin-name>`**: Remove an installed plugin by name.

**`tiles plugin list`**: List installed plugins.

Tiles installs plugins from `.zip` or `.tar.gz` archives, either downloaded from a URL or available on the local filesystem. The Agent Plugins standard defines the package contents; Tiles manages installation and distribution.

### Using plugins

In the Tiles Canary CLI chat, type `@` followed by a plugin name and your request:

```text
@exa Find the latest research on local-first software
@caldir What is on my calendar tomorrow?
```

Run `tiles plugin list` to see installed plugin names. Restart Tiles after installing or enabling a plugin so it becomes available in chat. Tiles can also use an enabled plugin automatically when it matches your request.

### Plugin package layout

```text
plugin-name/
├── plugin.json
├── skills/
│   └── skill-name/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
├── mcp.json
└── com.example.client/
    └── ...
```

Every Agent Plugin has a root `plugin.json` manifest. The `skills/` directory contains [Agent Skills](https://agentskills.io/specification), `mcp.json` describes MCP servers, and reverse-domain directories hold client-specific extensions. All components except `plugin.json` are optional.

A minimal manifest identifies the standard version and plugin name:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "plugin-name"
}
```

See the [Agent Plugins authoring guide](https://agent-plugins.org/plugin-authors/build-an-agent-plugin) for the complete portable format. Learn how to [use plugins](#using-plugins) in chat.

## Collaboration

<div id="sync"></div>
<div id="peer-to-peer-linking-tiles-link"></div>

Peer-to-peer sync has two steps. **Link** two devices once (consent): one device creates a token, the other joins with it. Then **sync** chats between them whenever you like. Devices reach each other over the internet through Iroh, so both must be online with Tiles running.

The examples below use two devices. DIDs are shortened here.

- **Device A**, a laptop, with the DID `did:key:z6MkpTHR...dvktH`
- **Device B**, a desktop, with the DID `did:key:z6MkiTBz...DooWp`

### Link devices (`tiles link`)

```bash
tiles link create <PEER_DID>        # Create a link token for a peer's DID
tiles link join <token> [nickname]  # Join with the token on the other device
tiles link devices                 # List linked devices by nickname and DID
tiles link revoke <DID>             # Unlink a device
```

Linking Device A and Device B:

```bash
# Device B: show your DID
tiles account

# Device A: create a token for Device B's DID
tiles link create did:key:z6MkiTBz...DooWp

# Device B: join with the token, and save Device A as "laptop"
tiles link join <token> laptop

# Either device: confirm the link
tiles link devices
```

1. On Device B, run `tiles account` and copy the `id` line. That is Device B's DID.
2. On Device A, run `tiles link create <PEER_DID>` with that DID. It prints a token. Send the token to Device B yourself, over a channel you trust.
3. On Device B, run `tiles link join <token> [nickname]`. Device A must be online with Tiles running, because Device B sends the link request to it.
4. On either device, run `tiles link devices` to see the other one listed.

Linking once is enough for both directions. After it, either device can start a sync.

**`tiles link create <PEER_DID>`**: Creates a **UCAN** token that authorizes the device with that DID. The DID is required.

**`tiles link join <token> [nickname]`**: Completes the link from the other device. The optional nickname is the name this device saves for the device that created the token, so Device B can later refer to Device A as `laptop`.

**`tiles link devices`**: Lists every linked device with its nickname and DID.

**`tiles link revoke <DID>`**: Unlinks a device. Its future sync requests are ignored. Run it on both devices to remove the link from each list.

Each device has its own name for the other. Device B knows Device A by the nickname given to `tiles link join`. Device A knows Device B by Device B's account nickname, set with `tiles account set-nickname`.

### Sync chats (`tiles sync`)

```bash
tiles sync <DID>       # Sync with a linked device by its DID
tiles sync <nickname>  # Sync with a linked device by its nickname
```

Syncing Device A and Device B:

```bash
# Device B: sync with Device A by the nickname saved while linking
tiles sync laptop

# Device A: sync with Device B by DID
tiles sync did:key:z6MkiTBz...DooWp
```

Run `tiles sync` on either device. The other device must be online with Tiles running. It does not need to run a command, because Tiles listens for sync requests from linked devices in the background.

One run syncs both ways: each device sends the chats the other is missing. The command prints a confirmation when the sync finishes.

Get the nickname or DID of a linked device from `tiles link devices`. A nickname that matches no linked device fails with an error.

If linking or syncing cannot reach the other device, run `tiles network status` on both. See Network under System.

<div id="remote-inference-tiles-remote"></div>

### Remote inference (`tiles remote`)

Share inference from one of your devices to another over Iroh. This is useful when a remote machine has the model or GPU you want, while your primary machine keeps the interactive Tiles session.

```bash
# Remote machine
tiles server start  # Starts the inference server in background
tiles remote share  # Generates an Iroh ticket

# Device using remote inference
tiles --remote <ticket>  # Uses remote machine inference
```

**`tiles server start`** starts the inference server on the remote machine before sharing it.

**`tiles remote share`** starts sharing the remote machine's inference endpoint and prints an Iroh ticket.

**`tiles --remote <ticket>`** runs on the device intending to use remote inference, while inference happens on the remote machine.

```bash
tiles remote status   # Check remote inference sharing status
tiles remote unshare  # Stop sharing remote inference
```

## System

### App updates (`tiles update`)

Update Tiles to the latest version.

```bash
tiles update   # Check for and install app updates
```

### Health (`tiles health`)

Check the status of dependencies.

```bash
tiles health
```

### Inference server (`tiles server`)

Configure the inference server.

```bash
tiles server start            # Start the inference server
tiles server stop             # Stop the inference server
tiles server daemon true      # Keep inference running after the REPL exits
tiles server daemon false     # Stop inference when the REPL exits (default)
```

**`tiles server daemon [FLAG]`** configures whether inference runs in the background. `FLAG` is `true` or `false`. When `true`, closing the REPL does not stop inference. The setting is stored under `[inference] daemon` in `config.toml`.

### Daemon (`tiles daemon`)

Configure daemon behavior.

```bash
tiles daemon start        # Start the daemon (auto-starts when you run `tiles`)
tiles daemon start 1729   # Start the daemon on a custom port
tiles daemon stop         # Stop the daemon
```

### Network (`tiles network`)

Linking and sync run on the Tiles network. It starts with the daemon, so these commands are only needed to check it or restart it.

```bash
tiles network status   # Show whether the network is running
tiles network start    # Start the network
tiles network stop     # Stop the network, which pauses linking and sync
```

## Slash commands

Slash commands give you fast, keyboard-first control over Tiles in interactive chat. Type `/?` or `/help` in the prompt to open available commands and quickly run actions like checking session state, resuming prior sessions, and sharing chats without leaving the terminal. Use `/bye` to exit the chat session.

### Session Commands

#### `/status`

Show the current session state.

#### `/sessions`

List available sessions in local storage.

<div id="resume-sessionid"></div>

#### `/resume <sessionId>`

Resume a specific session by ID.

### Sharing Commands

These commands require an active ATproto login. See [ATproto (`tiles at`)](#atproto-tiles-at).

#### `/share` (via ATproto)

Create a shareable link for the current session.

<div id="share-sessionid-via-atproto"></div>

#### `/share <sessionId>` (via ATproto)

Create a shareable link for a specific session.

Example shared session link: [chat.tiles.run/YXQ6Ly9k...ZTJr](https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOnZreGY2aTY1a2VoZmY2a2p3cjNjaDJ2eC9ydW4udGlsZXMuc2Vzc2lvbi8zbW9vYmNjeXNnZTJr).

### Using Skills

Skills installed through plugins are supported only in [Tiles Canary](/download).

Agent Plugins can include skills under `skills/`. Tiles can also use available skills automatically during a conversation when appropriate.

#### `/skills`

List available skills from installed plugins.

<div id="skill-name"></div>

#### `@<skill-name>`

Run a skill directly with `@<skill-name>` followed by your request (for example, `@my-skill Deploy the site`).

## Uninstall Tiles

Use `tiles uninstall` to uninstall Tiles from the system.

```bash
tiles uninstall
```

By default, it keeps the user data folder, downloaded models, and `config.toml`, so chats, memory, databases, logs, local settings, and model files remain for a later reinstall.

For a complete cleanup, pass `--all`:

```bash
tiles uninstall --all
```
