---
name: tiles-uninstaller-skill
description: Uninstall Tiles on macOS by stopping services and removing installed files while preserving user config and data by default. Optionally clear config, wipe user data, receipts, and keychain entries when explicitly requested. Use when asked to uninstall, remove, cleanly wipe, or troubleshoot leftover Tiles installation state.
compatibility: macOS shell environments with standard command-line tools (rm, pkgutil).
---

# Tiles Uninstall Skill (macOS)

Use this skill for manual Tiles uninstallation on macOS.

## Default behavior

The default uninstall removes only installed binaries and shared payloads under `/usr/local`. It **does not** delete user config or data, so chats, memory, databases, logs, and settings remain for a later reinstall.

Default paths left intact on macOS:

- Config: `~/.config/tiles` (or `${XDG_CONFIG_HOME}/tiles`)
- Data: `~/.local/share/tiles` (or `${XDG_DATA_HOME}/tiles`)

Remove config or wipe user data only when the user explicitly asks.

## When to use

- User asks to uninstall or remove Tiles.
- User wants a clean reinstall and needs old files removed first.
- User reports leftover Tiles binaries, data, or installer receipts.

## Default workflow (checklist)

- [ ] Stop running Tiles processes.
- [ ] Remove installer payload files from `/usr/local`.
- [ ] Confirm removals with verification commands.
- [ ] Optionally remove user config, wipe user data, clear installer receipts, or keychain entries.

## Uninstall procedure

### 1) Stop Tiles services

```bash
tiles server stop
tiles daemon stop
```

If `tiles` is missing, continue and stop any remaining Tiles processes manually.

### 2) Remove installer payload files

```bash
sudo rm -f /usr/local/bin/tiles
sudo rm -rf /usr/local/share/tiles
```

### 3) Optional cleanup

Forget receipts (metadata only; does not delete files):

```bash
sudo pkgutil --forget com.tilesprivacy.tiles
sudo pkgutil --forget com.tilesprivacy.tiles_models
```

Keychain cleanup: open Keychain Access, search for `tiles`, and delete matching entries if credentials should be removed.

Remove user config only when the user explicitly wants settings cleared:

```bash
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/tiles"
```

Wipe user data only when the user explicitly asks for a full data wipe (chats, memory, databases, logs):

```bash
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/tiles"
```

If a custom `[data] path` was set in `config.toml`, remove that directory only during an explicit data wipe.

### 4) Verify uninstall state

```bash
command -v tiles || echo "tiles binary not found"
ls -la /usr/local/share/tiles
pkgutil --pkgs | grep tilesprivacy
```

Expected outcome:

- `tiles` command is absent.
- `/usr/local/share/tiles` no longer exists.
- User config and data paths remain unless explicitly removed.
- No `com.tilesprivacy.*` receipt remains if optional forget was run.

## Gotchas

- `com.tilesprivacy.tiles_models` may not exist on network-installer-only setups.
- `pkgutil --forget` removes receipts only; run file deletion first.
- Default uninstall preserves user config and data under XDG defaults (and any custom `[data] path` in `config.toml`).
- Removing `~/.cache/huggingface/hub` impacts other apps, not just Tiles.
- `rm -rf` is destructive and irreversible.

## Agent behavior guidelines

1. Show the planned delete paths before running destructive commands.
2. Ask for confirmation before `sudo rm -rf` operations.
3. Prefer the default workflow above; only add optional steps when requested.
4. End by reporting exactly what was removed, that user config and data were preserved unless explicitly cleared or wiped, and what remains optional.
