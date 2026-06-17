import {
  LINUX_INSTALL_COMMAND,
  LINUX_INSTALL_SCRIPT_URL,
  LINUX_INSTALL_VERSION,
  LINUX_MODEL_NAME,
  LINUX_MODEL_URL,
  OFFLINE_MODEL_NAME,
  OFFLINE_MODEL_URL,
} from "@/lib/download-page-data"
import {
  DOWNLOAD_PLATFORM_LINUX_LABEL,
  DOWNLOAD_PLATFORM_MACOS_LABEL,
  TILES_PRODUCT_DESCRIPTION_SHORT,
} from "@/lib/product-description"

export interface DownloadLinkEmailVariables extends Record<string, string> {
  CURRENT_BUILD_VERSION: string
  DOWNLOAD_URL: string
  DOWNLOAD_FILE_NAME: string
  DOWNLOAD_VERSION: string
  DOWNLOAD_SIZE: string
  DOWNLOAD_SHA_SHORT: string
  DOWNLOAD_CHECKSUM_URL: string
  NETWORK_VERSION: string
  NETWORK_SIZE: string
  NETWORK_SHA_SHORT: string
  NETWORK_CHECKSUM_URL: string
  OFFLINE_DOWNLOAD_URL: string
  OFFLINE_FILE_NAME: string
  OFFLINE_DOWNLOAD_VERSION: string
  OFFLINE_DOWNLOAD_SIZE: string
  OFFLINE_DOWNLOAD_SHA_SHORT: string
  OFFLINE_DOWNLOAD_CHECKSUM_URL: string
  OFFLINE_VERSION: string
  OFFLINE_SIZE: string
  OFFLINE_SHA_SHORT: string
  OFFLINE_CHECKSUM_URL: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export const downloadLinkEmailTemplateHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="dark light">
    <meta name="supported-color-schemes" content="dark light">
    <title>Your Tiles download link</title>
    <style type="text/css">
      body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      table { border-collapse: collapse !important; }
      img { -ms-interpolation-mode: bicubic; border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background: #000000 !important; }
      a { color: inherit; }
      .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; mso-hide: all; }
      .download-cta-shell { color-scheme: light only; supported-color-schemes: light; }
      .download-cta-cell {
        background-color: #f5f5f5 !important;
        background: #f5f5f5 !important;
        border: 1px solid #d4d4d4 !important;
      }
      .download-cta-link {
        color: #111111 !important;
        -webkit-text-fill-color: #111111 !important;
      }
      @media (prefers-color-scheme: dark) {
        .download-cta-cell {
          background-color: #f5f5f5 !important;
          background: #f5f5f5 !important;
          border-color: #d4d4d4 !important;
        }
        .download-cta-link {
          color: #111111 !important;
          -webkit-text-fill-color: #111111 !important;
        }
      }
      @media only screen and (max-width: 600px) {
        .page-pad { padding: 22px 24px 52px 24px !important; }
        .container { width: 100% !important; max-width: 100% !important; }
        .title { font-size: 34px !important; line-height: 1.12 !important; }
        .body-copy { font-size: 16px !important; line-height: 1.65 !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; width:100%; min-width:100%; background-color:#000000;">
    <div class="preheader">Open this email on desktop to download Tiles Alpha for macOS or Linux.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background-color:#000000;">
      <tr>
        <td align="center" class="page-pad" style="padding:20px 24px 72px 24px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" class="container" style="width:560px; max-width:560px;">
            <tr>
              <td style="padding:0 0 134px 0;">
                <a href="https://www.tiles.run" style="display:inline-block; text-decoration:none;">
                  <img src="https://www.tiles.run/grey.png" width="44" height="44" alt="Tiles" style="width:44px; max-width:44px; height:44px;">
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 21px 0;">
                <h1 class="title" style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:38px; line-height:1.14; font-weight:650; letter-spacing:0;">
                  Download Tiles Alpha
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 18px 0;">
                <p class="body-copy" style="margin:0 0 12px 0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  You were sent this email because you requested a download link from the Tiles mobile website.
                </p>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  You can also visit <a href="https://www.tiles.run/download" style="color:#e5e5e5; text-decoration:underline; text-decoration-color:#737373;">tiles.run/download</a> on desktop.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 23px 0; border-bottom:1px solid #262626;"></td>
            </tr>
            <tr>
              <td style="padding:23px 0 12px 0;">
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Public alpha for macOS and Linux. Choose your platform below.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 40px 0;">
                <p style="margin:0; color:#9ca3af; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.5; font-weight:400;">
                  Current build: v{{{CURRENT_BUILD_VERSION}}}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 8px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding:0 10px 0 0; line-height:0;">
                      <img src="https://tiles.run/icon-apple-9ca3af.svg" width="20" height="20" alt="" aria-hidden="true" style="display:block; width:20px; height:20px;" />
                    </td>
                    <td valign="middle">
                      <h2 style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:500; letter-spacing:0;">
                        macOS
                      </h2>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 18px 0;">
                <p class="body-copy" style="margin:0 0 12px 0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  ${DOWNLOAD_PLATFORM_MACOS_LABEL}.
                </p>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Uses <a href="${OFFLINE_MODEL_URL}" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;"><span style="display:inline-block; color:#f5f5f5; background-color:#171717; border:1px solid #3f3f46; border-radius:4px; padding:1px 7px; font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace; font-size:14px; line-height:20px;"><img src="https://tiles.run/openai-logo.svg" width="14" height="14" alt="" aria-hidden="true" style="display:inline-block; width:14px; height:14px; margin-right:6px; vertical-align:-2px;" />${OFFLINE_MODEL_NAME}</span></a> as the default model.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 13px 0;">
                <p style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:17px; line-height:1.45; font-weight:500;">
                  Network installer
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 9px 0;">
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Small package that includes the required runtime. You will be prompted to download the model during onboarding.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 7px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                  Release: v{{{NETWORK_VERSION}}}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 18px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                  Size: {{{NETWORK_SIZE}}} | SHA256: <a href="{{{NETWORK_CHECKSUM_URL}}}" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">{{{NETWORK_SHA_SHORT}}}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 32px 0;">
                <div class="download-cta-shell" style="color-scheme:light only; supported-color-schemes:light;">
                  <table role="presentation" cellpadding="0" cellspacing="0" class="button download-cta">
                    <tr>
                      <td bgcolor="#f5f5f5" class="download-cta-cell" style="border-radius:3px; background-color:#f5f5f5 !important; border:1px solid #d4d4d4 !important;">
                        <a href="{{{DOWNLOAD_URL}}}" class="download-cta-link" style="display:inline-block; padding:11px 20px; color:#111111 !important; -webkit-text-fill-color:#111111 !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:18px; font-weight:500; text-decoration:none; border-radius:3px;">
                          <img src="https://tiles.run/icon-apple-111111.svg" width="14" height="14" alt="" aria-hidden="true" style="display:inline-block; width:14px; height:14px; margin-right:8px; vertical-align:-2px;" />
                          Download network installer
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 0 13px 0; border-top:1px solid #262626;">
                <p style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:17px; line-height:1.45; font-weight:500;">
                  Offline installer
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 9px 0;">
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Full installer with the default model bundled for air-gapped use.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 7px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                  Release: v{{{OFFLINE_VERSION}}}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 18px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                  Size: {{{OFFLINE_SIZE}}} | SHA256: <a href="{{{OFFLINE_CHECKSUM_URL}}}" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">{{{OFFLINE_SHA_SHORT}}}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 24px 0;">
                <div class="download-cta-shell" style="color-scheme:light only; supported-color-schemes:light;">
                  <table role="presentation" cellpadding="0" cellspacing="0" class="button download-cta">
                    <tr>
                      <td bgcolor="#f5f5f5" class="download-cta-cell" style="border-radius:3px; background-color:#f5f5f5 !important; border:1px solid #d4d4d4 !important;">
                        <a href="{{{OFFLINE_DOWNLOAD_URL}}}" class="download-cta-link" style="display:inline-block; padding:11px 20px; color:#111111 !important; -webkit-text-fill-color:#111111 !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:18px; font-weight:500; text-decoration:none; border-radius:3px;">
                          <img src="https://tiles.run/icon-apple-111111.svg" width="14" height="14" alt="" aria-hidden="true" style="display:inline-block; width:14px; height:14px; margin-right:8px; vertical-align:-2px;" />
                          Download offline installer
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 40px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6; font-weight:400;">
                  Offline installer builds aren't published for every release. Check the release version above to confirm which build each installer includes.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 0 8px 0; border-top:1px solid #262626;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="padding:0 10px 0 0; line-height:0;">
                      <img src="https://tiles.run/icon-linux-9ca3af.svg" width="20" height="20" alt="" aria-hidden="true" style="display:block; width:20px; height:20px;" />
                    </td>
                    <td valign="middle">
                      <h2 style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:500; letter-spacing:0;">
                        Linux
                      </h2>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 0 18px 0;">
                <p class="body-copy" style="margin:0 0 12px 0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  ${DOWNLOAD_PLATFORM_LINUX_LABEL}.
                </p>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Uses <a href="${LINUX_MODEL_URL}" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;"><span style="display:inline-block; color:#f5f5f5; background-color:#171717; border:1px solid #3f3f46; border-radius:4px; padding:1px 7px; font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace; font-size:14px; line-height:20px;"><img src="https://tiles.run/openai-logo.svg" width="14" height="14" alt="" aria-hidden="true" style="display:inline-block; width:14px; height:14px; margin-right:6px; vertical-align:-2px;" />${LINUX_MODEL_NAME}</span></a> as the default model.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 13px 0;">
                <p style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:17px; line-height:1.45; font-weight:500;">
                  Network installer
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 9px 0;">
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  About 1 GB download with CUDA bundled. The script also downloads the default model. Requires NVIDIA compute capability 5.0+ and driver 531+ (570+ for CC 5.0 through 6.2). Check your <a href="https://developer.nvidia.com/cuda-gpus" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">compute compatibility</a> to see if your card is supported.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 12px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                  Release: v${LINUX_INSTALL_VERSION}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 8px 0;">
                <p style="margin:0; color:#f5f5f5; font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace; font-size:14px; line-height:1.5; background-color:#171717; border:1px solid #3f3f46; border-radius:8px; padding:12px 14px; word-break:break-all;">
                  ${LINUX_INSTALL_COMMAND}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 40px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6; font-weight:400;">
                  <a href="${LINUX_INSTALL_SCRIPT_URL}" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">View script source</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 40px 0;">
                <p style="margin:0; color:#a3a3a3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6; font-weight:400;">
                  By downloading and using Tiles, you agree to the <a href="https://tiles.run/terms" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">terms</a> and <a href="https://tiles.run/privacy" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px;">privacy statement</a>.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:40px 0 28px 0; border-top:1px solid #262626;">
                <h2 style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:30px; line-height:1.2; font-weight:500; letter-spacing:0;">
                  Resources
                </h2>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 34px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">
                  <tr>
                    <td align="center" valign="middle" width="24" height="24" style="width:24px; height:24px; border-radius:6px; background-color:#171717;">
                      <img src="https://tiles.run/icon-manual-d4d4d8.svg" width="14" height="14" alt="" aria-hidden="true" style="display:block; margin:5px auto; width:14px; height:14px;" />
                    </td>
                  </tr>
                </table>
                <h3 style="margin:0 0 8px 0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:18px; line-height:1.35; font-weight:500;">Manual</h3>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Need usage instructions? Check out the <a href="https://tiles.run/book/manual" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;">Manual</a> in the book for step-by-step guidance.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 34px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">
                  <tr>
                    <td align="center" valign="middle" width="24" height="24" style="width:24px; height:24px; border-radius:6px; background-color:#171717;">
                      <img src="https://tiles.run/icon-discord-d4d4d8.svg" width="14" height="14" alt="" aria-hidden="true" style="display:block; margin:5px auto; width:14px; height:14px;" />
                    </td>
                  </tr>
                </table>
                <h3 style="margin:0 0 8px 0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:18px; line-height:1.35; font-weight:500;">Join Discord</h3>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Chat with the team and other users, get help, and share feedback. Join us in the #tiles channel hosted by the <a href="https://go.tiles.run/discord" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;">User &amp; Agents community</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 44px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">
                  <tr>
                    <td align="center" valign="middle" width="24" height="24" style="width:24px; height:24px; border-radius:6px; background-color:#171717;">
                      <img src="https://tiles.run/icon-releases-d4d4d8.svg" width="14" height="14" alt="" aria-hidden="true" style="display:block; margin:5px auto; width:14px; height:14px;" />
                    </td>
                  </tr>
                </table>
                <h3 style="margin:0 0 8px 0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:18px; line-height:1.35; font-weight:500;">Releases</h3>
                <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                  Need an older build? Browse the <a href="https://tiles.run/releases#releases" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;">releases page</a> to download previous versions.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px 0 0 0; border-top:1px solid #262626;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:14px;">
                  <tr>
                    <td align="center" style="padding:0 0 14px 0;">
                      <a href="https://www.tiles.run" style="display:inline-block; text-decoration:none;">
                        <img src="https://www.tiles.run/grey.png" width="28" height="28" alt="Tiles" style="width:28px; max-width:28px; height:28px;">
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 0 18px 0;">
                      <p style="margin:0; color:#d4d4d8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                        ${TILES_PRODUCT_DESCRIPTION_SHORT}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 0 18px 0;">
                      <a href="https://x.com/tilesprivacy" aria-label="X (Twitter)" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-x-9ca3af.svg" width="16" height="16" alt="X" style="display:block; width:16px; height:16px;">
                      </a>
                      <a href="https://bsky.app/profile/tiles.run" aria-label="Bluesky" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-bluesky-9ca3af.svg" width="16" height="16" alt="Bluesky" style="display:block; width:16px; height:16px;">
                      </a>
                      <a href="https://go.tiles.run/discord" aria-label="Discord" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-discord-9ca3af.svg" width="16" height="16" alt="Discord" style="display:block; width:16px; height:16px;">
                      </a>
                      <a href="https://github.com/tilesprivacy" aria-label="GitHub" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-github-9ca3af.svg" width="16" height="16" alt="GitHub" style="display:block; width:16px; height:16px;">
                      </a>
                      <a href="https://tangled.org/tiles.run" aria-label="Tangled" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-tangled-9ca3af.svg" width="16" height="16" alt="Tangled" style="display:block; width:16px; height:16px;">
                      </a>
                      <a href="https://huggingface.co/tilesprivacy" aria-label="Hugging Face" style="display:inline-block; margin:0 6px; text-decoration:none;">
                        <img src="https://tiles.run/icon-huggingface-9ca3af.svg" width="16" height="16" alt="Hugging Face" style="display:block; width:16px; height:16px;">
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 0 4px 0;">
                      <a href="mailto:hello@tiles.run?subject=Unsubscribe%20from%20Tiles%20emails" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6;">
                        Unsubscribe
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

export function renderDownloadLinkEmailHtml(
  variables: DownloadLinkEmailVariables,
): string {
  return Object.entries(variables).reduce(
    (html, [key, value]) =>
      html.replaceAll(`{{{${key}}}}`, escapeHtml(String(value))),
    downloadLinkEmailTemplateHtml,
  )
}
