# Tiles Pro License Activation

Draft implementation spec for `tiles activate` and `tiles deactivate`, plus the
post-checkout handoff from the website.

**Status: draft.** Nothing here is implemented yet. The CLI work lands in
`tilesprivacy/tiles`; the website side lands in `tilesprivacy/tiles-next` and is
partly built already (see [Website handoff](#website-handoff)).

## Background

Tiles Pro is $10 USD per user, per month, sold through Polar. Entitlement is
carried by a **license key** issued by a Polar License Key benefit, not by an
account system. Polar issues a key at checkout and revokes it when the
subscription ends.

This means the CLI talks to Polar directly and there is no Tiles backend, no
user table, and no session to manage.

### Identifiers

All three are public and safe to commit. They mirror the constants in
`tiles-next/lib/polar.ts`.

| Name | Value |
| --- | --- |
| Organization ID | `028ca25d-5316-46a1-8771-28c6403d8348` |
| License Key benefit ID | `c9ebdd84-854f-44ef-a27f-7b729dd1840e` |
| Tiles Pro product ID | `98d19697-7811-437f-933e-c5a55caa9362` |
| Checkout link | `https://buy.polar.sh/polar_cl_3LyXhxgqyNTiHERg0sdzEzKM7Z7jRxsFFH24d3asCns` |
| Customer portal | `https://polar.sh/tilesprivacy/portal/` |

## Polar API

The three endpoints live under Polar's **customer portal** namespace and are
**unauthenticated**. No access token ships in the binary.

Verified against the live API: a nonexistent key returns `404 ResourceNotFound`,
and a malformed organization ID returns `422 RequestValidationError`.

### Validate

```
POST https://api.polar.sh/v1/customer-portal/license-keys/validate
```

```json
{
  "key": "TILES-XXXX-XXXX-XXXX",
  "organization_id": "028ca25d-5316-46a1-8771-28c6403d8348",
  "benefit_id": "c9ebdd84-854f-44ef-a27f-7b729dd1840e",
  "activation_id": "<optional, validates a specific activation>"
}
```

Passing `benefit_id` scopes validation to Tiles Pro, so a key from some other
Polar product on the same organization will not pass. Always send it.

Optional fields: `customer_id`, `increment_usage`, and a `conditions` map.

### Activate

```
POST https://api.polar.sh/v1/customer-portal/license-keys/activate
```

```json
{
  "key": "TILES-XXXX-XXXX-XXXX",
  "organization_id": "028ca25d-5316-46a1-8771-28c6403d8348",
  "label": "<device label>",
  "meta": { "os": "macos", "version": "0.5.0" }
}
```

Returns an **activation record whose `id` must be persisted** — deactivation is
impossible without it. Fails once the benefit's activation limit is reached,
which is how the device cap is enforced.

### Deactivate

```
POST https://api.polar.sh/v1/customer-portal/license-keys/deactivate
```

```json
{
  "key": "TILES-XXXX-XXXX-XXXX",
  "organization_id": "028ca25d-5316-46a1-8771-28c6403d8348",
  "activation_id": "<id returned by activate>"
}
```

`activation_id` is required; omitting it returns `422`.

## How the CLI is structured today

Observed at `23b50d4`, so re-check before implementing.

- **Command tree**: `enum Commands` in `tiles/src/main.rs` flattens groups with
  `#[command(flatten, next_help_heading = "…")]`. Current headings are Getting
  Started, Accounts, Sync, System, and Plugins. Each group is its own
  `#[derive(Subcommand)]` enum; commands with their own subcommands use an
  `…Args` struct holding `#[command(subcommand)]`, as `AccountArgs` does.
- **Dispatch**: one `match` arm per command in `main.rs`, delegating to a
  `pub async fn` in `tiles/src/commands/mod.rs`, which is flat (~430 lines) and
  re-exports from `tiles/src/core/…`.
- **Errors**: `anyhow::Result`, with `anyhow!` for user-facing failures. See
  `uninstall_tiles` for the tone: state what is wrong and name the command that
  fixes it.
- **Colour**: `owo-colors`.
- **HTTP**: `reqwest` 0.12 with the `json` feature.
- **Secrets**: `keyring-core` with per-platform stores, wired in
  `tiles/src/core/account/mod.rs`. `keyring_entry(app, key)` calls
  `ensure_keyring_store()` and returns an `Entry`; the store is
  `apple-native-keyring-store` on macOS, `dbus-secret-service-keyring-store` on
  Linux, and anything else bails. Service name comes from
  `utils::config::get_app_name()`, which is `tiles` in release and `tiles_dev`
  in debug.
- **Config**: TOML at `DefaultProvider.get_config_dir()/config.toml`, read and
  written via `get_or_create_config()` / `save_config()` in
  `tiles/src/utils/config.rs`.

## Proposed commands

Both are top level, matching how `tiles run` and `tiles sync` read. Suggested
help heading: **Accounts**, since this is entitlement rather than system state.

### `tiles activate <LICENSE_KEY>`

1. Trim the argument and reject an obviously empty value before any network call.
2. `POST /validate` with `benefit_id`. On `404`, fail with a clear message
   rather than surfacing the raw API error.
3. `POST /activate` with a device label. Default the label to the machine
   hostname, overridable with `--label`.
4. Persist the key and the returned `activation_id` (see [Storage](#storage)).
5. Print the plan, the device label, and remaining activations if the response
   exposes them.

Re-running on an already-activated device should detect the stored
`activation_id`, re-validate it, and report "already active" instead of burning
a second activation slot.

### `tiles deactivate`

1. Load the stored key and `activation_id`. If either is missing, say the device
   is not activated and exit non-zero.
2. `POST /deactivate`.
3. Clear the stored credentials **only after** the API confirms, so a network
   failure cannot orphan an activation slot.
4. Add `--force` to clear local state regardless, for the case where the key was
   already revoked server side.

### Sketch

```rust
// tiles/src/main.rs
#[derive(Debug, Subcommand)]
enum AccountCommandsGroup {
    /// Manage your user account
    Account(AccountArgs),

    /// ATProto-related commands
    At(AtArgs),

    /// Configure your data and storage
    Data(DataArgs),

    /// Activate Tiles Pro on this device with a license key
    Activate {
        /// License key from your receipt email or the Polar customer portal
        license_key: String,

        /// Label for this device (defaults to the hostname)
        #[arg(long)]
        label: Option<String>,
    },

    /// Deactivate Tiles Pro on this device, freeing an activation slot
    Deactivate {
        /// Clear local state even if Polar cannot be reached
        #[arg(long)]
        force: bool,
    },
}
```

```rust
// dispatch, alongside the other Accounts arms
Some(Commands::Accounts(AccountCommandsGroup::Activate { license_key, label })) => {
    commands::activate_license(&license_key, label.as_deref()).await?
}
Some(Commands::Accounts(AccountCommandsGroup::Deactivate { force })) => {
    commands::deactivate_license(force).await?
}
```

## Storage

The license key is a bearer credential: anyone holding it can consume an
activation slot. Store it in the keyring, not in `config.toml`.

- **Keyring** (service = `get_app_name()`): the key under `pro-license-key`, and
  the activation ID under `pro-activation-id`. Reuse `keyring_entry` from
  `core/account/mod.rs` rather than opening a second store.
- **Config** (`config.toml`, new `[pro]` table): non-secret cache only, so
  startup can show entitlement without a network call. Suggested fields:
  `activated_at`, `last_validated_at`, `device_label`, `status`.

Never log the key. Redact to the last four characters in any output.

## Runtime entitlement checks

The four Pro services (private web search, private cloud models, managed public
relays, backup and key recovery) should read one cached entitlement rather than
each calling Polar.

- Re-validate on a schedule, roughly daily, not per request.
- Cache the result in the `[pro]` config table.
- Allow a **grace period** when validation fails for network reasons, so an
  offline user does not silently lose Pro. Only a definitive `404` or a revoked
  response should drop entitlement.
- Tiles is local-first: a failed check must never block local features. It only
  gates the hosted services.

## Website handoff

Already live in `tilesprivacy/tiles-next`:

- `/pricing` opens Polar's embedded checkout via
  `components/polar-subscribe-button.tsx`.
- `/pricing/success` is the post-checkout page (`PRICING_SUCCESS` in
  `lib/pricing-plans.ts`), currently a three-step flow: find your key, install
  Tiles, activate your key.
- `/book/licenses` documents the license key under **Your license key**.

**Still to do, once the CLI ships:** step 3 of `PRICING_SUCCESS` says activation
arrives with the 0.5.0 Private Beta. Replace that with the real command:

```
tiles activate <your-license-key>
```

Keep these in sync when the copy changes, per `tiles-next/AGENTS.md`:

- `lib/pricing-plans.ts` — `PRICING_SUCCESS` steps and the "How do I get access
  after paying?" FAQ
- `content/licenses.mdx` — the **Your license key** section
- `content/manual.mdx` — add the command to the CLI reference under Accounts, so
  it matches `tiles help` grouping

The Checkout Link's success URL must be set to
`https://www.tiles.run/pricing/success` in the Polar dashboard. The `successUrl`
committed in the API routes only applies to the session and redirect flows, not
to a dashboard-created Checkout Link.

## Open questions

1. **Activation limit.** What is the benefit's limit set to? The website says
   "a limited number of devices" because the number is not settled. Fix the
   number and put it in the pricing copy.
2. **Sandbox testing.** Polar sandbox is a separate host
   (`sandbox-api.polar.sh`) with its own organization and product IDs. Worth a
   `--sandbox` flag or an env override for development.
3. **Key entry UX.** Argument only, or also an interactive prompt when the
   argument is omitted, so the key stays out of shell history?
4. **`tiles account` overlap.** Should Pro status surface in `tiles account`
   output, and should `tiles health` report entitlement?
5. **Uninstall.** Should `tiles uninstall` deactivate first, so a reinstall does
   not consume a second slot?

## Implementation checklist

- [ ] Add `Activate` and `Deactivate` to `AccountCommandsGroup` in `main.rs`
- [ ] Add dispatch arms delegating to `commands::activate_license` / `deactivate_license`
- [ ] Add a Polar client module (`reqwest`) with validate, activate, deactivate
- [ ] Store key and activation ID via `keyring_entry`, add the `[pro]` config table
- [ ] Add the cached entitlement check with a grace period
- [ ] Gate the four hosted services on that check
- [ ] Update `content/manual.mdx` in tiles-next with the new commands
- [ ] Update `PRICING_SUCCESS` step 3 with the real command
- [ ] Set the Checkout Link success URL in the Polar dashboard
