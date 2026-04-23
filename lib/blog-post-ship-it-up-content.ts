/** Full HTML body for RSS and reading time; mirrors `app/blog/ship-it-up/page.tsx` (Leaflet source). */
export const shipItUpBlogContent = `<p>We ship Tiles as a <code>tar.gz</code> tarball and as a native macOS <code>.pkg</code>. Either format follows the same broad steps.</p>

<ul>
<li><p>Assemble the deliverable:</p><ul><li><p>Package the Tiles binary and the Python <a href="https://www.tiles.run/blog/move-along-python" target="_blank" rel="noopener noreferrer">venvstack</a> artifacts into one installer payload.</p></li></ul></li>
<li><p>Run the installer:</p><ul><li><p>Copy the Tiles binary and Python artifacts into the correct locations on disk.</p></li></ul></li>
<li><p>Run postinstall scripts.</p></li>
</ul>

<p>In early releases, the tarball was the only install path. It served us well, but it had clear limits.</p>

<ul>
<li><p>Because the release artifact is a gzip tarball, we cannot codesign, notarize, and staple the archive itself the way we can a full installer. We run those steps on the Tiles binary only, not on the entire <code>.gz</code> file.</p></li>
<li><p>Installation relies on a curl-based script. That is workable for developers and rougher for everyone else.</p></li>
<li><p>The flow leaves little room to tailor copy, branding, or steps in the installer UI.</p></li>
</ul>

<p>We wanted a path that fits Apple's signing and notarization story and feels native on macOS. Installers ship as <code>.dmg</code> or <code>.pkg</code> bundles; we chose <code>.pkg</code> because it can run scripts, uses a familiar installer UI, and supports customization with simple HTML. What follows is how we build that <code>.pkg</code> for Tiles.</p>

<h2>Install file structure</h2>

<img src="/blog-ship-it-up-pkgroot-structure.jpg" alt="" style="width: 100%; height: auto; margin: 2rem 0;" />

<p>The layout matches the directory tree above. When we build the package, we point the tooling at this <code>pkgroot</code> directory as the install root. The installer copies that tree onto the destination volume and creates intermediate directories as needed.</p>

<p>For each release, we build a fresh Tiles binary into <code>pkgroot/usr/local/bin</code> and place the remaining updated artifacts under <code>pkgroot/usr/local/share/tiles/</code>.</p>

<p>The <a href="https://github.com/tilesprivacy/tiles/blob/main/pkg/build.sh" target="_blank" rel="noopener noreferrer">build script</a> in the repo has the full sequence.</p>

<h2>Code signing the Tiles binary</h2>

<p>Code signing gives us:</p>

<ul>
<li><p>A signed Tiles binary that cannot be altered without invalidating the signature.</p></li>
<li><p>A signature from a developer certificate that Apple trusts.</p></li>
</ul>

<p>You need an Apple Developer account and two certificate types: <strong>DEVELOPER ID APPLICATION</strong> for the binary and <strong>DEVELOPER ID INSTALLER</strong> for the <code>.pkg</code>. The finished installer wraps the signed binary and the other artifacts in one compressed package.</p>

<p>For creating and exporting those certificates, the CodeVamping <a href="https://www.codevamping.com/2023/11/macos-pkg-installer/" target="_blank" rel="noopener noreferrer">macOS pkg installer article</a> covers the details.</p>

<pre><code># Signing the Tiles binary
codesign --force \\
  --sign "$DEVELOPER_ID_APPLICATION"\\
  --options runtime \\
  --timestamp \\
  --strict \\
  "\${CLI_BIN_PATH}/tiles"
</code></pre>

<p>The snippet signs the Tiles CLI. <code>$DEVELOPER_ID_APPLICATION</code> is an environment variable that holds the common name of the Developer ID Application certificate.</p>

<h2>Scripts</h2>

<p>Bash scripts can run before and after the payload is laid down. We keep <strong>preinstall</strong> and <strong>postinstall</strong> scripts in a directory and pass that path into <code>pkgbuild</code>.</p>

<p>The Tiles repo has <a href="https://github.com/tilesprivacy/tiles/tree/main/pkg/scripts" target="_blank" rel="noopener noreferrer">those scripts</a>; they handle cleanup and internal setup.</p>

<h2>Building the Tiles package</h2>

<p>With the signed Tiles binary and the rest of the install tree under <code>pkgroot</code>, we run:</p>

<pre><code>pkgbuild --root pkgroot --scripts \\
 pkg/scripts --identifier com.tilesprivacy.tiles --version "$VERSION" \\
 pkg/tiles-unsigned.pkg
</code></pre>

<p><code>--root</code> is <code>pkgroot</code>; <code>--scripts</code> points at the directory from the previous section.</p>

<h2>Customizing the installer</h2>

<img src="/blog-ship-it-up-installer-custom-1.jpg" alt="" style="width: 100%; height: auto; margin: 2rem 0;" />

<p>Opening the unsigned package from the previous step shows Apple's default, minimal flow. We layer on welcome and conclusion screens, a logo, and other panels with an Apple <a href="https://developer.apple.com/library/archive/documentation/DeveloperTools/Reference/DistributionDefinitionRef/Chapters/Introduction.html#//apple_ref/doc/uid/TP40005370-CH1-SW1" target="_blank" rel="noopener noreferrer" style="font-weight:700">distribution</a> definition in XML. That file references HTML for the welcome, conclusion, and other supported steps. Our <a href="https://github.com/tilesprivacy/tiles/blob/main/pkg/distribution_network.xml" target="_blank" rel="noopener noreferrer">distribution_network.xml</a> is the working example. Elements such as <code>&lt;welcome/&gt;</code> and <code>&lt;conclusion/&gt;</code> point at resources we keep alongside the definition and pass into the final <code>productbuild</code> invocation.</p>

<pre><code>productbuild \\
  --distribution pkg/distribution_network.xml \\
  --resources pkg/resources \\
  --package-path pkg/  \\
  pkg/tiles-dist-unsigned.pkg
</code></pre>

<p><code>productbuild</code> reads the unsigned package and writes a distributable installer with those customizations baked in.</p>

<img src="/blog-ship-it-up-installer-custom-2.jpg" alt="" style="width: 100%; height: auto; margin: 2rem 0;" />

<img src="/blog-ship-it-up-installer-custom-3.jpg" alt="" style="width: 100%; height: auto; margin: 2rem 0;" />

<h2>Code signing the complete installer</h2>

<pre><code>productsign \\
  --sign "$DEVELOPER_ID_INSTALLER" \\
  pkg/tiles-dist-unsigned.pkg \\
  pkg/tiles.pkg
</code></pre>

<p>That signs the <code>.pkg</code> itself. The Tiles binary is already signed; signing a macOS binary and signing an installer package are different operations.</p>

<p>The main difference is <code>productsign</code> instead of <code>codesign</code>, and the certificate we use is <code>DEVELOPER ID INSTALLER</code> instead of <code style="white-space: pre-wrap">DEVELOPER  ID APPLICATION</code>.</p>

<h2>Notarizing the installer</h2>

<p>Notarization lets Apple scan the payload for malware. We upload the installer; when processing finishes, the service returns acceptance or rejection.</p>

<p>Submission looks like this:</p>

<pre><code>xcrun notarytool submit pkg/tiles.pkg \\
  --keychain-profile "tiles-notary-profile" \\
  --wait
</code></pre>

<p><code>tiles-notary-profile</code> is the keychain entry name so we do not pass Apple ID details on every run. Store the profile once with:</p>

<pre><code>xcrun notarytool store-credentials \\
  "tiles-notary-profile" \\
  --apple-id "john.doe@gmail.com" \\
  --team-id "X********4" \\
  --password "****-****-****-****"</code></pre>

<h2>Stapling the installer</h2>

<p>Stapling embeds the notarization ticket in the installer file so Gatekeeper needs fewer round trips to Apple when a user opens the package.</p>

<pre><code>xcrun stapler staple pkg/tiles.pkg
</code></pre>

<h2>What's next</h2>

<p>We also ship a fully offline installer that bundles OpenAI's gpt-oss 20B model, so Tiles can be installed without an internet connection. We are working toward making Tiles itself portable, allowing users to carry their model and data and run it from a flash drive on any compatible system.</p>

<p>The installer requires Rosetta; on Apple Silicon Macs, it is not included by default and must be installed separately. Rosetta translates Intel binaries to run on Apple Silicon. There is a workaround for this, described in the <a href="https://github.com/tilesprivacy/tiles/issues/105" target="_blank" rel="noopener noreferrer">linked GitHub issue</a>.</p>`
