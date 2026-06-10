# Tiles Uninstall Skill (macOS)

This guide describes a manual uninstall flow for Tiles on macOS, including installed files, optional config and data cleanup, optional installer receipts, and optional keychain cleanup.

## Default behavior

The default uninstall removes only installed binaries and shared payloads under `/usr/local`. It does **not** delete user config or data, so chats, memory, databases, logs, and settings remain for a later reinstall.

Default paths left intact on macOS:

- Config: `~/.config/tiles` (or `${XDG_CONFIG_HOME}/tiles`)
- Data: `~/.local/share/tiles` (or `${XDG_DATA_HOME}/tiles`)

Remove config or wipe user data only when you explicitly want those cleared.

## Scope

- Platform: macOS
- Install types: network installer and Offline Installer
- Result: remove Tiles binaries and shared payloads; preserve local user config and data by default

## What this skill includes

1. Stop running Tiles services and daemons safely.
2. Remove installer-managed files in `/usr/local`.
3. Optionally clear installer receipts from `pkgutil`.
4. Optionally remove Tiles config or wipe user data paths (including XDG-aware paths) when explicitly requested.
5. Optional cleanup for Hugging Face cache and Keychain entries.
6. Notes for custom data paths and development builds.

## Uninstall steps

### 1) Stop Tiles

```bash
tiles server stop
tiles daemon stop
```

If `tiles` is already removed, skip this and stop any leftover Tiles processes in Activity Monitor.

### 2) Remove installed files under `/usr/local`

```bash
sudo rm -f /usr/local/bin/tiles
sudo rm -rf /usr/local/share/tiles
```

Optional verification:

```bash
pkgutil --pkgs | grep tilesprivacy
pkgutil --files com.tilesprivacy.tiles
pkgutil --files com.tilesprivacy.tiles_models
```

### 3) Optional: forget installer receipts

```bash
sudo pkgutil --forget com.tilesprivacy.tiles
sudo pkgutil --forget com.tilesprivacy.tiles_models
```

Use `--forget` only after payload files are removed.

### 4) Optional: remove user config

Default config path on macOS: `~/.config/tiles`

```bash
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/tiles"
```

Only run this when you explicitly want settings cleared.

### 5) Optional: wipe user data

Default data path on macOS: `~/.local/share/tiles`

```bash
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/tiles"
```

Only run this when you explicitly want chats, memory, databases, and logs removed. If you set a custom `[data] path` in `config.toml`, remove that directory during a data wipe as well.

### 6) Optional: Hugging Face cache

Tiles may use `~/.cache/huggingface/hub`. Deleting it affects other apps that share that cache.

### 7) Optional: Keychain cleanup

Open Keychain Access, search for `tiles`, and delete matching entries to remove stored credentials and identity material.

### 8) Optional: development build cleanup

If you used source-tree debug builds, remove `.tiles_dev/tiles` next to that project.

## Safety warning

`rm -rf` permanently deletes data, including chats, local memory, databases, and logs under removed paths. The default uninstall flow preserves user config and data; confirm backups before any optional config removal or data wipe.
