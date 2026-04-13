# Tiles Uninstall Skill (macOS)

This guide describes a complete manual uninstall flow for Tiles on macOS, including installed files, local data, optional installer receipts, and optional keychain cleanup.

## Scope

- Platform: macOS
- Install types: network installer and Offline Installer
- Result: remove Tiles binaries, shared payloads, and local user data

## What this skill includes

1. Stop running Tiles services and daemons safely.
2. Remove installer-managed files in `/usr/local`.
3. Optionally clear installer receipts from `pkgutil`.
4. Remove Tiles config and data paths (including XDG-aware paths).
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

### 4) Remove user config and data

Default paths on macOS:

- Config: `~/.config/tiles`
- Data: `~/.local/share/tiles`

```bash
rm -rf ~/.config/tiles
rm -rf ~/.local/share/tiles
```

XDG-aware cleanup:

```bash
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/tiles"
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/tiles"
```

### 5) Optional: remove custom data path contents

If you set a custom `[data] path` in `config.toml`, remove that directory too.

### 6) Optional: Hugging Face cache

Tiles may use `~/.cache/huggingface/hub`. Deleting it affects other apps that share that cache.

### 7) Optional: Keychain cleanup

Open Keychain Access, search for `tiles`, and delete matching entries to remove stored credentials and identity material.

### 8) Optional: development build cleanup

If you used source-tree debug builds, remove `.tiles_dev/tiles` next to that project.

## Safety warning

`rm -rf` permanently deletes data, including chats, local memory, databases, and logs under removed paths. Confirm backups before running destructive commands.
