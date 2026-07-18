/** Verbatim HTML body copied from the rendered Leaflet post. */
export const atmosphericSessionsBlogContent = `<p>In Tiles, the <a href="https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuY2hhdC5zZXNzaW9uU25hcHNob3QvM21xamdheHR6c3kyZA==" target="_blank" rel="noopener noreferrer">chat sessions</a> we have with the LLMs can be shared publicly. This is similar to how we can share the chats we had with <a href="https://chatgpt.com/share/6a421d4b-797c-83ee-bee4-1da04e405976" target="_blank" rel="noopener noreferrer">chatGPT</a> or <a href="https://pi.dev/docs/latest/usage#exporting-and-sharing-sessions" target="_blank" rel="noopener noreferrer">Pi (via github gists</a>). It is cool to share our musings/research with others. What Tiles explores here is how much ownership we can have over our own shared sessions.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-public.jpg" alt="" /><figcaption>A public Tiles session in Tiles chat session viewer</figcaption></figure>

<p>In Tiles all the sessions we do are completely local and stored on-device encrypted. So even when we want to share the local sessions to the outer world we need to try to hold on to the same ethos.There are 2 ways one can share sessions in Tiles. We can sync the chats peer to peer encrypted to another device as mentioned <a href="https://www.tiles.run/book/manual#sync" target="_blank" rel="noopener noreferrer">here</a> (which will be a topic for another blog)which is for ultimate privacy with more granular controls. But what if we need to just share our musings as a normal web link so can be consumed by those who don't have Tiles installed just like Chatgpt does, but also holding the ethos of data ownership? and what if other apps can even use our publicly shared chat sessions for different use-cases as they wish? This is where <a href="https://atproto.com/" target="_blank" rel="noopener noreferrer">ATproto</a> comes into the picture.</p>

<h2>Reaching for the Atmosphere</h2>

<p>ATproto is a decentralized protocol for social networking upon which we can publish and distribute self-authenticated data. This one-liner won't do much justice to what Atproto is, so we highly recommend Dan Abramov's excellent explanation on it <a href="https://overreacted.io/open-social/" target="_blank" rel="noopener noreferrer">here</a>. But for our usecase of sharing chat sessions what Atproto provides is a permanent identity and ability to move our data to anywhere we want later and the shared link still works as it is. So even if Tiles stopped working, we can have our data and also somebody can just build another app to show the sessions. The data, the format everything is open just like markdown. Tiles doesn't own the shared session, its in user's PDS (Personal Data Server in Atproto world) which we can change wherever whenever we want. So when we &quot;share&quot; a session via Atproto from Tiles, the shared data is stored in our PDS and not in Tiles infrastructure. Yes we can host our own PDS or assign some other PDS which we trust. So if we don't like a microblogging site A and want to move to another one B assuming both uses ATproto, we don't have to worry about losing our friends and posts. Our user identity, social graph and user data storage is shared between all of these apps thus forming the <a href="https://atproto.com/" target="_blank" rel="noopener noreferrer">ATmosphere</a>.</p>

<h2>Sharing sessions with Tiles</h2>

<p>For sharing a session in Tiles, first we need an ATproto account (for starters simply creating an account in Bluesky would do it). An account is linked with PDS we choose to host our data. For example we can choose <a href="https://bsky.app/" target="_blank" rel="noopener noreferrer">bluesky's</a> (A microblogging site like Twitter/X built on Atproto) PDS and create a bluesky account. There are ofcourse other options like northsky, eurosky etc. One important point here is we can move our account later to northsky for example, but that doesn't change our Atproto handle or the underlying identity (which is immutable).</p>

<p>Once we have an Atproto account we can login to it from Tiles using our handle as described <a href="https://www.tiles.run/book/manual#atproto-tiles-at" target="_blank" rel="noopener noreferrer">here</a>. After that we can get into the tiles repl (soon via web UI too ;))and share an ongoing session or a particular session using <code>/share</code>, which will write the session to Atproto PDS and returns a public link, for more details see the <a href="https://www.tiles.run/book/manual#sharing-commands" target="_blank" rel="noopener noreferrer">docs</a>.</p>

<iframe class="w-full h-auto" src="https://drive.google.com/file/d/15NuVP7QWSv2Ij1i8TZfX5QRUCVI7zlhP/preview?parts.page.embed.ctx.mode=edit&amp;parts.page.embed.ctx.bgColor=%23FDFCFA&amp;parts.page.embed.ctx.primaryColor=%23272727" allow="fullscreen" loading="lazy" referrerpolicy="no-referrer" style="aspect-ratio: 16 / 9;"></iframe>

<h2>What about private sessions?</h2>

<p>Sometimes we want to share a session to only people we intend to and not to all.But one constraint currently in ATproto is that all records in PDS are public by design to provide data portability, transparency etc. There are on-going developments to add <a href="https://dholms.leaflet.pub/3meluqcwky22a" target="_blank" rel="noopener noreferrer">permissioned data</a> though. But for now we don't want our secret Tiles sessions to be in plaintext in the public PDS. So for that Tiles support private sessions by storing the data in PDS encrypted where encryption happens on user's local Tiles.The encryption key is then passed as a url fragment such that the decryption can only be done on the user's local browser.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-private.jpg" alt="" /><figcaption>Encrypted sessions in Atproto PDS</figcaption></figure>

<p>Here's a sample <a href="https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuY2hhdC5zZXNzaW9uU25hcHNob3QvM21xbHpta3M0ZW8yaA==#TmqE5ZwyWaCl/6wCI5R0AsCWwlg2GZ5D.vyLaXFpy6dnB6G9jbHr8aOIxg5hBNeA+KB0v0DQrUkE=" target="_blank" rel="noopener noreferrer">private session</a>. If we observe the url we can see the encoded encryption key ( <code>TmqE5ZwyWaCl/6wCI5R0AsCWwlg2GZ5D.vyLaXFpy6dnB6G9jbHr8aOIxg5hBNeA+KB0v0DQrUkE=</code> ) travels along with the link as an url fragment after <code>#</code>, and we can validate it by checking the data in PDS <a href="https://atproto.at/uri/at://did:plc:mbk6wgmxiatotzy5b3q57naw/run.tiles.chat.sessionSnapshot/3mqlzmks4eo2h" target="_blank" rel="noopener noreferrer">here</a>.So the chat session will only be rendered correctly to whomever we send and it stays encrypted publicly too. Underneath we use <a href="https://en.wikipedia.org/wiki/ChaCha20-Poly1305" target="_blank" rel="noopener noreferrer">ChaChaPoly1305</a> for the encryption.</p>

<h2>Interoperable sessions</h2>

<p>We mentioned before that the sessions shared via Tiles can outlive Tiles itself. One reason is ofcourse the raw data is in user controlled PDS. But what's the point if the data itself is in a certain format that if we actually want to use it outside Tiles we need to reverse engineer the format. So <a href="https://newsletter.squishy.computer/p/credible-exit" target="_blank" rel="noopener noreferrer">credible exit</a> but with a data dump is not enough. As mentioned above, Atproto makes it easy to exit from one social media app to another without losing our social graph and data.</p>

<p>Its similar to how we can edit a markdown in notepad and then open it in VScode. But it would be darn cool if we have this ability for everything from from our posts to our LLM chat sessions. Infact we can do this now for posts in Atproto. I can create a post in <a href="https://mu.social/" target="_blank" rel="noopener noreferrer">mu.social</a> and then open it and update it in <a href="https://mu.social" target="_blank" rel="noopener noreferrer">bluesky</a> with same Atproto account, same single identity, same data storage. Someday if i don't like how bluesky's UI or for any reasons, i can just start using mu.social without the fear of losing my followers.</p>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-mu-social.jpg" alt="" /><figcaption>creating a post in mu.social</figcaption></figure>

<figure class="atmospheric-session-figure"><img src="/blog-atmospheric-sessions-bluesky.jpg" alt="" /><figcaption>viewing it in Bluesky</figcaption></figure>

<p>So it will be cool to do that for LLM chat sessions too. We could just publish our local session from Tiles and maybe open it in some other session viewer or think about this we could just publish the chat sessions created in ChatGPT, open it in Tiles chat viewer, import it to Tiles, resume the session in Tiles, publish and then open it in chatGPT. Just like a text file.</p>

<p>To provide this interoperability Atproto provides <a href="https://atproto.com/specs/lexicon" target="_blank" rel="noopener noreferrer">Lexicons</a>. Lexicons are basically JSON schemas (with some Atproto twist) of a particular data which is then published across the <a href="https://lexicon.garden/" target="_blank" rel="noopener noreferrer">Atproto network</a>. To that end, as a start Tiles LLM chat sessions also has a <a href="https://lexicon.garden/lexicon/did:plc:mqmcsjuerbjhu65mpmvkcuw2/run.tiles.chat.sessionSnapshot" target="_blank" rel="noopener noreferrer">lexicon</a> called <code>run.tiles.chat.sessionSnapshot</code>.</p>

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

<p>All the sessions published via Tiles are in this <a href="https://atproto.at/uri/at://did:plc:mbk6wgmxiatotzy5b3q57naw/run.tiles.chat.sessionSnapshot/3mqlxyvfm5u2d" target="_blank" rel="noopener noreferrer">format</a>. In a way <a href="https://chat.tiles.run/" target="_blank" rel="noopener noreferrer">Tiles session viewer</a> now acts as a free viewer for anybody who publishes their data in this lexicon format. We even don't need Tiles to create that data, one can directly publish the data to their PDS with Atproto apis. Another wild idea is that Tiles underneath use <a href="https://pi.dev/" target="_blank" rel="noopener noreferrer">Pi</a> as the harness. Pi is used as harness by many assistants including <a href="https://lucumr.pocoo.org/2026/1/31/pi/" target="_blank" rel="noopener noreferrer">openclaw</a>. Imagine if we can have a lexicon for the Pi sessions, the level of interoperability we can achieve is insane. If we tag our friend in a Tiles chat session, it won't get lost in another LLM based chat apps if it uses Atproto.</p>

<p>We will surely experiment more on ATproto as we go and build more features in Tiles to support it since ATproto helps in collaboration, credible exit and user-agency, so that we can <strong>OWN OUR SESSIONS.</strong></p>

`
