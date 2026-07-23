/** Verbatim HTML body copied from the rendered Leaflet post. */
export const atmosphericSessionsBlogContent = `<p>In Tiles, the <a href="https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuY2hhdC5zZXNzaW9uU25hcHNob3QvM21xamdheHR6c3kyZA==" target="_blank" rel="noopener noreferrer">chat sessions</a> we have with local models can be shared publicly. This is similar to sharing conversations as Shared Links in <a href="https://chatgpt.com/share/6a421d4b-797c-83ee-bee4-1da04e405976" target="_blank" rel="noopener noreferrer">ChatGPT</a> or via <a href="https://pi.dev/docs/latest/usage#exporting-and-sharing-sessions" target="_blank" rel="noopener noreferrer">Pi (using GitHub Gists)</a>. Sharing our research, ideas, and musings with others is valuable. What Tiles explores is how much ownership we can retain over those shared conversations.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-public.jpg" alt="" /><figcaption>A publicly shared Tiles chat link</figcaption></figure>

<p>In Tiles, all chat sessions are completely local and stored encrypted on your device. So when we want to share those local conversations with the outside world, we should preserve the same ethos.</p>

<p>There are two ways to share sessions in Tiles. The first is to sync chats end to end encrypted, peer to peer, across your own devices, as described <a href="https://www.tiles.run/book/manual#sync" target="_blank" rel="noopener noreferrer">here</a>. That approach provides the strongest privacy and the most granular control, and deserves its own blog post.</p>

<p>But what if you simply want to share your research, ideas, or musings as a regular web link that anyone can open, even if they don't have Tiles installed, similar to ChatGPT's Shared Links, while still preserving data ownership? And what if other applications could build on those publicly shared conversations for entirely new use cases?</p>

<p>This is where <a href="https://atproto.com/" target="_blank" rel="noopener noreferrer">AT Protocol</a> comes into the picture.</p>

<h2>Reaching for the Atmosphere</h2>

<p>AT Protocol, also abbreviated as ATproto, is a decentralized social networking protocol that lets users publish and distribute self-authenticated data. That one-line description doesn't do it justice, so we highly recommend Dan Abramov's excellent explanation of it <a href="https://overreacted.io/open-social/" target="_blank" rel="noopener noreferrer">here</a>.</p>

<p>For our use case of sharing chat sessions, ATproto provides two important guarantees: a permanent identity and the ability to move your data anywhere without breaking existing shared links. Even if Tiles were to stop existing, your shared sessions would remain accessible, and anyone could build another application to display them. The data, its format, and the protocol are all open, much like Markdown.</p>

<p>Tiles doesn't own your shared sessions. They live in your PDS (Personal Data Server in the ATproto ecosystem), and you're free to move to another PDS whenever you want. When you share a session from Tiles using ATproto, the data is published to your PDS, not stored on Tiles' infrastructure. You can host your own PDS or choose one operated by someone you trust.</p>

<p>This separation of applications from identity and data is one of ATproto's core ideas. If you stop using one microblogging app and switch to another that also speaks ATproto, you don't lose your identity, your followers, or your posts. Your identity, social graph, and data move with you across applications, forming what the ATproto community calls the <a href="https://atproto.com/" target="_blank" rel="noopener noreferrer">Atmosphere</a>.</p>

<h2>Sharing sessions with Tiles</h2>

<p>To share a session from Tiles, you first need an ATproto account. The easiest way to get started is by creating a Bluesky account. Every ATproto account is associated with a PDS (Personal Data Server), which is where your data is hosted.</p>

<p>For example, you can create a Bluesky account and use <a href="https://bsky.app/" target="_blank" rel="noopener noreferrer">Bluesky's PDS</a>. There are, of course, other PDS providers as well, such as Northsky and Eurosky. The important point is that you can move your account to a different PDS later if you choose. For example, you can migrate from Bluesky's PDS to Northsky's without changing your ATproto handle or your underlying identity, both of which remain the same.</p>

<p>Once you have an ATproto account, you can sign in to it from Tiles using your ATproto handle, as described <a href="https://www.tiles.run/book/manual#atproto-tiles-at" target="_blank" rel="noopener noreferrer">here</a>. After that, you can open the Tiles CLI (with a web UI coming soon) and share either the current conversation or any existing session using the <code>/share</code> command.</p>

<p>Tiles publishes the session to your ATproto PDS and returns a public link that anyone can access. For more details, see the <a href="https://www.tiles.run/book/manual#sharing-commands" target="_blank" rel="noopener noreferrer">documentation</a>.</p>

<video controls preload="metadata" playsinline aria-label="Sharing Tiles sessions with ATproto" style="display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; margin: 2.5rem 0; border-radius: 0.5rem; object-fit: contain;"><source src="/atmospheric-sessions-demo.mp4" type="video/mp4"></video>

<h2>What about private sessions?</h2>

<p>Sometimes we want to share a session only with specific people rather than making it public to everyone. One limitation of ATproto today is that records stored in a PDS are public by design, enabling data portability, transparency, and interoperability. There is ongoing work to support <a href="https://dholms.leaflet.pub/3meluqcwky22a" target="_blank" rel="noopener noreferrer">permissioned data</a>, but that is not available yet.</p>

<p>To preserve the privacy of sensitive Tiles sessions, Tiles supports private sharing by encrypting the session locally before it is uploaded to the PDS. The encrypted data is stored in your PDS, while the encryption key is placed in the URL fragment (<code>#...</code>). Since URL fragments are never sent to the server, decryption happens entirely in the recipient's browser. This means your PDS stores only encrypted data, and only someone with the complete link can decrypt and view the session.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-private.jpg" alt="" /><figcaption>Encrypted sessions in Atproto PDS</figcaption></figure>

<p>Here's an example of a <a href="https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuY2hhdC5zZXNzaW9uU25hcHNob3QvM21xbHpta3M0ZW8yaA==#TmqE5ZwyWaCl/6wCI5R0AsCWwlg2GZ5D.vyLaXFpy6dnB6G9jbHr8aOIxg5hBNeA+KB0v0DQrUkE=" target="_blank" rel="noopener noreferrer">private shared session</a>. If you inspect the URL, you'll notice that the encoded encryption key (<code>TmqE5ZwyWaCl/6wCI5R0AsCWwlg2GZ5D.vyLaXFpy6dnB6G9jbHr8aOIxg5hBNeA+KB0v0DQrUkE=</code>) is included as a URL fragment after the <code>#</code>. You can also verify that the corresponding data stored in the PDS is encrypted by inspecting it <a href="https://atproto.at/uri/at://did:plc:mbk6wgmxiatotzy5b3q57naw/run.tiles.chat.sessionSnapshot/3mqlzmks4eo2h" target="_blank" rel="noopener noreferrer">here</a>.</p>

<p>Because the encryption key never becomes part of the data stored in the PDS, the session remains encrypted while publicly hosted. Only someone with the complete URL can decrypt and view it, since decryption happens entirely in the browser. Under the hood, Tiles uses <a href="https://en.wikipedia.org/wiki/ChaCha20-Poly1305" target="_blank" rel="noopener noreferrer">ChaCha20-Poly1305</a> for authenticated encryption.</p>

<h2>Interoperable sessions</h2>

<p>We mentioned earlier that sessions shared through Tiles can outlive Tiles itself. One reason is that the underlying data lives in a user-controlled PDS. But that alone isn't enough. If the data is stored in a proprietary format that requires reverse engineering to use outside of Tiles, then the only thing you've gained is the ability to export a data dump. <a href="https://newsletter.squishy.computer/p/credible-exit" target="_blank" rel="noopener noreferrer">Credible exit</a> requires more than that.</p>

<p>As mentioned earlier, ATproto already makes it possible to move from one social application to another without losing your identity, social graph, or data. The same principle should apply to AI conversations.</p>

<p>It's similar to how a Markdown file can be edited in Notepad and then opened in VS Code without any conversion. It would be even more powerful if we had that level of interoperability for everything, from social posts to LLM chat sessions.</p>

<p>In fact, this already exists for posts on ATproto. I can create a post in <a href="https://mu.social/" target="_blank" rel="noopener noreferrer">Mu</a>, then open and edit that same post in <a href="https://bsky.app/" target="_blank" rel="noopener noreferrer">Bluesky</a> while using the same ATproto account, the same identity, and the same underlying data storage. If I ever decide I no longer like Bluesky's interface, or simply prefer another client, I can switch to Mu without worrying about losing my followers or my content.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-mu-social.jpg" alt="" /><figcaption>Creating a post on Mu</figcaption></figure>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-bluesky.jpg" alt="" /><figcaption>Viewing the same post on Bluesky</figcaption></figure>

<p>It would be exciting to bring that same interoperability to LLM chat sessions. Imagine publishing a local conversation from Tiles and opening it in a different chat viewer. Or imagine publishing a conversation created in ChatGPT, importing it into Tiles, continuing the conversation locally, publishing the updated session, and then opening it again in another compatible application. Just like a text file, the conversation would no longer be tied to a single app.</p>

<p>ATproto enables this kind of interoperability through <strong><a href="https://atproto.com/specs/lexicon" target="_blank" rel="noopener noreferrer">Lexicons</a></strong>. A Lexicon is essentially a JSON schema, with a few ATproto-specific extensions, that defines the structure of a particular type of data so it can be understood consistently across the network.</p>

<p>As a first step toward interoperable AI conversations, Tiles defines a <a href="https://lexicon.garden/lexicon/did:plc:mqmcsjuerbjhu65mpmvkcuw2/run.tiles.chat.sessionSnapshot" target="_blank" rel="noopener noreferrer">Lexicon</a> for LLM chat sessions called <code>run.tiles.chat.sessionSnapshot</code>.</p>

<pre><code class="language-json">{
  &quot;id&quot;: &quot;run.tiles.chat.sessionSnapshot&quot;,
  &quot;$type&quot;: &quot;com.atproto.lexicon.schema&quot;,
  &quot;lexicon&quot;: 1,
  &quot;defs&quot;: {
    &quot;main&quot;: {
      &quot;key&quot;: &quot;tid&quot;,
      &quot;type&quot;: &quot;record&quot;,
      &quot;record&quot;: {
        &quot;required&quot;: [&quot;name&quot;, &quot;sessionId&quot;, &quot;createdAt&quot;, &quot;turns&quot;],
        &quot;properties&quot;: {
          &quot;name&quot;: { &quot;type&quot;: &quot;string&quot; },
          &quot;sessionId&quot;: { &quot;type&quot;: &quot;string&quot; },
          &quot;createdAt&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;format&quot;: &quot;datetime&quot; },
          &quot;turns&quot;: {
            &quot;type&quot;: &quot;array&quot;,
            &quot;items&quot;: {
              &quot;type&quot;: &quot;object&quot;,
              &quot;properties&quot;: {
                &quot;model&quot;: { &quot;type&quot;: &quot;string&quot; },
                &quot;messages&quot;: {
                  &quot;type&quot;: &quot;array&quot;,
                  &quot;items&quot;: { &quot;ref&quot;: &quot;#message&quot; }
                }
              }
            }
          }
        }
      }
    },
    &quot;message&quot;: {
      &quot;type&quot;: &quot;object&quot;,
      &quot;required&quot;: [&quot;role&quot;, &quot;content&quot;]
    },
    &quot;contentItem&quot;: {
      &quot;type&quot;: &quot;object&quot;,
      &quot;required&quot;: [&quot;type&quot;]
    }
  }
}</code></pre>

<p>All sessions published through Tiles use this <a href="https://lexicon.garden/lexicon/did:plc:mqmcsjuerbjhu65mpmvkcuw2/run.tiles.chat.sessionSnapshot" target="_blank" rel="noopener noreferrer">Lexicon</a>. In that sense, the <a href="https://chat.tiles.run/" target="_blank" rel="noopener noreferrer">Tiles session viewer</a> acts as a free viewer for any session published in <a href="https://atproto.at/uri/at://did:plc:mbk6wgmxiatotzy5b3q57naw/run.tiles.chat.sessionSnapshot/3mqlxyvfm5u2d" target="_blank" rel="noopener noreferrer">this format</a>. You don't even need Tiles to create the data. Any application can publish a session directly to a user's PDS using the ATproto APIs, and the Tiles viewer can render it.</p>

<p>This opens up some interesting possibilities. Under the hood, Tiles uses <a href="https://pi.dev/" target="_blank" rel="noopener noreferrer">Pi</a> as its agent harness, and Pi is also used by several other assistants, including <a href="https://lucumr.pocoo.org/2026/1/31/pi/" target="_blank" rel="noopener noreferrer">OpenClaw</a>. Imagine if there were a standard Lexicon for Pi sessions. The level of interoperability would be remarkable. Conversations could move seamlessly between applications built on the same underlying session format.</p>

<p>For example, if you tagged a friend in a Tiles chat session, that mention wouldn't be lost when the conversation was opened in another ATproto-compatible AI assistant application. The conversation, its metadata, and its social context could all travel together.</p>

<p>We'll continue experimenting with ATproto as we build more features in Tiles. ATproto aligns closely with the principles we care about: collaboration, credible exit, and user agency. We believe conversations should be portable, interoperable, and ultimately owned by the people who create them.</p>

<p>That's the future we're building toward, so you can truly own your sessions.</p>

`;
