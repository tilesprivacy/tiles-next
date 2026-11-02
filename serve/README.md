# Serve Utility

On-demand utility for uploading files into the `tilesprivacy` Cloudflare R2 bucket.

It supports:
- Syncing the latest `.pkg` from GitHub Releases (`tilesprivacy/tiles` by default).
- Uploading any custom local file path to the bucket.

## Architecture

- Cloudflare Worker with an R2 binding: `env.TILESPRIVACY`
- Token-protected Worker endpoints:
  - `POST /sync/latest-pkg`
  - `POST /sync/upload-file?key=<r2-key>`
- Local CLI script that calls the Worker

## Credentials and secrets

### `SYNC_TRIGGER_TOKEN` (required)

`SYNC_TRIGGER_TOKEN` is a random secret string that **you generate**.
It is used like a shared password between your CLI and Worker.

- CLI sends: `Authorization: Bearer <token>`
- Worker verifies the token before uploading

Generate one:

```bash
openssl rand -hex 32
```

### `GITHUB_TOKEN` (optional for this repo)

- Repo default is public (`tilesprivacy/tiles`), so this is optional.
- Recommended if you want to reduce GitHub API rate-limit risk.

### Cloudflare auth for Wrangler

Use one of:
- Interactive: `npx wrangler login`
- Non-interactive/CI: set `CLOUDFLARE_API_TOKEN`

## Setup

Run these inside `serve/`.

1) Install:

```bash
npm install
```

2) Confirm defaults in `wrangler.jsonc`:
- bucket: `tilesprivacy`
- repo: `tilesprivacy/tiles`

3) Set Worker secrets:

```bash
npm run secret:sync-token
# paste your generated token
```

Optional:

```bash
npm run secret:github-token
```

4) Deploy:

```bash
npm run deploy
```

5) Create local env for CLI trigger:

```bash
cp .env.example .env
```

Set in `.env`:
- `TILES_SYNC_WORKER_URL` = deployed Worker URL (for example `https://tiles-release-sync.<subdomain>.workers.dev`)
- `TILES_SYNC_TRIGGER_TOKEN` = exact same value as Worker secret `SYNC_TRIGGER_TOKEN`

## Usage

### Upload latest release `.pkg`

```bash
npm run upload:latest-pkg
```

Uploads to:
- bucket root as `<asset-name>.pkg` (example: `tiles-0.4.3-signed.pkg`)
- `checksums/<asset-name>.sha256` with SHA256 fetched from GitHub release metadata

### Upload a custom local file

```bash
npm run upload:file -- "/absolute/or/relative/path/to/file.pkg"
```

Optional custom key:

```bash
npm run upload:file -- "/path/to/file.pkg" "manual/custom-name.pkg"
```

If key is omitted, default is:
- `manual/<local-file-name>`

Large file behavior:
- Files larger than ~95MB are uploaded through Worker-backed R2 multipart upload.
- This avoids Worker request body limits for big files (for example `.gguf`).

## Run from repo root

You can also use root package scripts:

```bash
npm run serve:install
npm run serve:deploy
npm run serve:upload-latest-pkg
npm run serve:upload-file -- "/path/to/file.pkg" "manual/custom-name.pkg"
```
