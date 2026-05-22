---
name: tiles-uninstaller-skill
description: Uninstall Tiles on macOS by stopping services, removing installed files and user data, and optionally clearing receipts and keychain entries. Use when asked to uninstall, remove, cleanly wipe, or troubleshoot leftover Tiles installation state.
compatibility: macOS shell environments with standard command-line tools (rm, pkgutil).
---

# Tiles Uninstall Skill (macOS)

Use this skill for manual Tiles uninstallation on macOS.

## When to use

- User asks to uninstall or remove Tiles.
- User wants a clean reinstall and needs old files removed first.
- User reports leftover Tiles binaries, data, or installer receipts.

## Default workflow (checklist)

- [ ] Stop running Tiles processes.
- [ ] Remove installer payload files from `/usr/local`.
- [ ] Remove user config/data paths.
- [ ] Confirm removals with verification commands.
- [ ] Optionally clear installer receipts and keychain entries.

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

### 3) Remove user config and data

Use XDG-aware paths (works for defaults and custom XDG env values):

```bash
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/tiles"
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/tiles"
```

### 4) Optional cleanup

Forget receipts (metadata only; does not delete files):

```bash
sudo pkgutil --forget com.tilesprivacy.tiles
sudo pkgutil --forget com.tilesprivacy.tiles_models
```

Keychain cleanup: open Keychain Access, search for `tiles`, and delete matching entries if credentials should be removed.

### 5) Verify uninstall state

```bash
command -v tiles || echo "tiles binary not found"
ls -la /usr/local/share/tiles
pkgutil --pkgs | grep tilesprivacy
```

Expected outcome:

- `tiles` command is absent.
- `/usr/local/share/tiles` no longer exists.
- No `com.tilesprivacy.*` receipt remains if optional forget was run.

## Gotchas

- `com.tilesprivacy.tiles_models` may not exist on network-installer-only setups.
- `pkgutil --forget` removes receipts only; run file deletion first.
- A custom `[data] path` in `config.toml` may leave data outside XDG defaults.
- Removing `~/.cache/huggingface/hub` impacts other apps, not just Tiles.
- `rm -rf` is destructive and irreversible.

## Agent behavior guidelines

1. Show the planned delete paths before running destructive commands.
2. Ask for confirmation before `sudo rm -rf` operations.
3. Prefer the default workflow above; only add optional steps when requested.
4. End by reporting exactly what was removed and what remains optional.
