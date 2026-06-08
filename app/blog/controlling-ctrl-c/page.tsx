'use client'

import { useMemo, type ReactNode } from "react"
import { blogPosts } from "@/lib/blog-posts"
import { BlogPostContent } from "@/components/blog-post-content"

function ArticleImage({
  src,
  srcDark,
  alt = "",
}: {
  src: string
  srcDark?: string
  alt?: string
}) {
  return (
    <div className="my-6 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
      {srcDark ? (
        <>
          <img src={src} alt={alt} className="block h-auto w-full dark:hidden" />
          <img src={srcDark} alt={alt} className="hidden h-auto w-full dark:block" />
        </>
      ) : (
        <img src={src} alt={alt} className="block h-auto w-full" />
      )}
    </div>
  )
}

const rustKeywordPattern =
  /^(?:as|async|await|break|const|continue|crate|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while)$/

const rustTokenPattern =
  /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|[A-Za-z_][A-Za-z0-9_]*!|\b[A-Za-z_][A-Za-z0-9_]*\b)/g

function rustTokenClass(token: string, nextText = ""): string | null {
  if (token.startsWith("//")) return "rust-comment"
  if (token.startsWith('"')) return "rust-string"
  if (token.endsWith("!")) return "rust-macro"
  if (rustKeywordPattern.test(token)) return "rust-keyword"
  if (/^[A-Z]/.test(token)) return "rust-type"
  if (/^[a-z_][A-Za-z0-9_]*$/.test(token) && /^\s*\(/.test(nextText)) return "rust-fn"
  return null
}

function renderRustCode(code: string) {
  const nodes: ReactNode[] = []
  let lastIndex = 0

  code.replace(rustTokenPattern, (token, _match, offset: number) => {
    if (offset > lastIndex) {
      nodes.push(code.slice(lastIndex, offset))
    }

    const className = rustTokenClass(token, code.slice(offset + token.length))
    nodes.push(
      className ? (
        <span className={className} key={`${offset}-${token}`}>
          {token}
        </span>
      ) : (
        token
      )
    )
    lastIndex = offset + token.length
    return token
  })

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex))
  }

  return nodes
}

function RustCodeBlock({ code }: { code: string }) {
  return (
    <pre>
      <code className="language-rust">{renderRustCode(code)}</code>
    </pre>
  )
}

export default function ControllingCtrlCPage() {
  const post = blogPosts.find((p) => p.slug === "controlling-ctrl-c")

  const formattedDate = useMemo(() => {
    if (!post) return ""
    return post.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [post])

  if (!post) {
    return null
  }

  return (
    <BlogPostContent
      title={post.title}
      description={post.description}
      date={formattedDate}
      authorId={post.author}
      standardSiteDocumentUri={post.standardSiteDocumentUri}
      content={post.content}
    >
      <h2>The REPL UI issue</h2>

      <p>
        As a local AI assistant, Tiles embeds{" "}
        <a href="https://github.com/earendil-works/pi" target="_blank" rel="noopener noreferrer">
          Pi agent
        </a>{" "}
        for agent harness. Since the REPL is written in Rust and Pi is in TypeScript, we embed the Pi Bun binary and use
        it via Pi&apos;s RPC mode, spawn a headless Pi binary as a child process, and communicate with it via{" "}
        <a href="https://en.wikipedia.org/wiki/Standard_streams" target="_blank" rel="noopener noreferrer">
          standard streams (stdin/stdout/stderr)
        </a>{" "}
        in JSON format. The user input to the model and the streamed output from the model come and go through Pi. It
        sits between the REPL and the inference system.
      </p>

      <ArticleImage
        src="/repl_flow.png"
        srcDark="/repl_flow_dark.png"
        alt="Tiles REPL request and response flow"
      />

      <p>
        As with any LLM inference interface, Tiles REPL must stop the output streaming from the model as soon as the user
        presses Ctrl-C and the REPL should return to prompt state, ideally like this.
      </p>

      <ArticleImage src="https://bdefzwcumgzjwllsnaej.supabase.co/storage/v1/render/image/public/minilink-user-assets/019ea633-afad-7ee6-bc6d-5306a2993311.gif?width=1920&quality=75&resize=contain" />

      <p>
        But in the versions before v0.4.11, although the streaming ends and REPL returns to prompt state, on the next
        user input we were greeted with a broken pipe error like{" "}
        <code>Err value: Os {"{ code: 32, kind: BrokenPipe, message: \"Broken pipe\" }"}</code>. Because of this, users
        had to restart the REPL to continue. More details are in this{" "}
        <a href="https://github.com/tilesprivacy/tiles/issues/146" target="_blank" rel="noopener noreferrer">
          issue
        </a>
        .
      </p>

      <ArticleImage src="https://bdefzwcumgzjwllsnaej.supabase.co/storage/v1/render/image/public/minilink-user-assets/019ea63c-6a20-7ee6-bc6d-c821c4bce207.gif?width=1920&quality=75&resize=contain" />

      <h2>The broken pipes</h2>

      <p>
        As mentioned, we spawn the Pi process as a child process and communicate through its stdin and stdout. For this
        reason the streams are connected via pipes rather than the child inheriting the parent&apos;s streams (which is
        the default behavior). If the child inherited the parent&apos;s streams, communication would be messy and
        processes would have to filter what they need from the shared stream, which would introduce race conditions.
      </p>

      <p>
        When piped, the parent can write to the child&apos;s stdin; the child writes to its own stdout, which the parent
        can then read, giving a clear separation of concerns. This is how we explicitly set the streams to be piped in
        Rust.
      </p>

      <RustCodeBlock code={`let pi_process =
    Command::new(pi_exec_path)
        .arg("--mode")
        .arg("rpc")
        // default is Stdio::inherit
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("failed to run Pi");`} />

      <p>
        So when we press Ctrl-C, the SIGINT (signal interrupt) event is propagated to the child processes, and if they
        don&apos;t handle it then the default behavior is to exit. To monitor this, we can use the following commands on
        Unix systems.
      </p>

      <RustCodeBlock code={`ps -o pid,ppid,pgid,sid,command | grep tiles

88068 65985 88608 target/debug/tiles`} />

      <p>
        Here the processId is 7011, the parent&apos;s processId is 65985 (system root is parent), and the
        process&apos;s groupId is 7011. To inspect the children, we can use:
      </p>

      <RustCodeBlock code={`// where 88068 is pid for tiles

pstree -p 88068

\\-+= 88068 tiles target/debug/tiles
  |--= 88098 tiles target/debug/tiles daemon
  \\--= 88099 tiles /Users/tiles/tiles/.tiles_dev/tiles/pi/pi --mode rpc`} />

      <p>We can see the Pi process is running as a child of Tiles with PID 88099.</p>

      <p>We can use lsof to further monitor their relationship as follows:</p>

      <RustCodeBlock code={`➜ lsof -p 88099 // Pi's PID (child)
COMMAND   PID  USER   FD     TYPE             DEVICE   SIZE/OFF   NODE NAME
pi      88099 tiles    0     PIPE 0xd5c96c81e3aec5c2      16384   ->0xa95f7f46dfb5efe6
pi      88099 tiles    1     PIPE 0x745d3d0e7a7709aa      16384   ->0x27aceab27161a82

➜ lsof -p 88429 // Tile's PID (parent)
COMMAND   PID  USER   FD     TYPE             DEVICE   SIZE/OFF   NODE NAME
tiles   88068 tiles   16     PIPE 0xa95f7f46dfb5efe6      16384   ->0xd5c96c81e3aec5c2
tiles   88068 tiles   17     PIPE  0x27aceab27161a82      16384   ->0x745d3d0e7a7709aa`} />

      <p>Here we can see Pi&apos;s stdin (FD=0) is connected to Tiles stdout (FD=16) and vice versa.</p>

      <p>
        So when we press Ctrl-C to stop a streaming response, the signal propagates to the Pi process and Pi exits. When
        we try a new user prompt next time in the REPL, unbeknownst to the REPL that such a process does not exist, it
        still tries to write to Pi&apos;s non-existent stdin, which gives us a broken pipe, aka a broken connection.
      </p>

      <h2>Letting them go</h2>

      <p>
        Since by default a child process is in the same process group (pgid) as the parent, the SIGINT event is
        propagated to all the processes in the group. One way is to remove the child from the same group as the parent.
        This means they still have a parent-child relationship, but the parent is no longer in direct control of the
        children. On Unix we can use{" "}
        <a href="https://www.man7.org/linux/man-pages/man2/setsid.2.html" target="_blank" rel="noopener noreferrer">
          setsid
        </a>{" "}
        for this to create a new session and set the current process as the leader of it.
      </p>

      <p>
        But to do that in Rust is an{" "}
        <a href="https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html" target="_blank" rel="noopener noreferrer">
          unsafe
        </a>{" "}
        operation (where we lose safety assurance from the compiler), as setsid is only available in the{" "}
        <a href="https://doc.rust-lang.org/beta/std/os/unix/process/trait.CommandExt.html" target="_blank" rel="noopener noreferrer">
          nightly version
        </a>{" "}
        as of now, so we need to call it via C{" "}
        <a href="https://en.wikipedia.org/wiki/Foreign_function_interface" target="_blank" rel="noopener noreferrer">
          FFI
        </a>
        . So setsid is achieved via other libraries such as{" "}
        <a href="https://docs.rs/libc/latest/libc/" target="_blank" rel="noopener noreferrer">
          libc
        </a>
        ,{" "}
        <a href="https://docs.rs/nix/latest/nix/" target="_blank" rel="noopener noreferrer">
          nix
        </a>
        , etc., of course colored by the unsafe keyword.
      </p>

      <RustCodeBlock code={`let pi_process = unsafe {
    Command::new(pi_exec_path)
        .arg("--mode")
        .arg("rpc")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        // runs the below closure before executing the
        // command function, here we run setsid for the
        // spawned process.
        .pre_exec(|| {
            if libc::setsid() == -1 {
                return Err(std::io::Error::last_os_error());
            }
            Ok(())
        })
        .spawn()
        .expect("failed to run Pi")
};`} />

      <p>
        This resolves our broken pipe issue, as the SIGINT is never reaching the Pi process. But now we have another
        issue on hand: the model streaming is non-stoppable via Ctrl-C, and the REPL is completely unresponsive during
        the entire time we are streaming the output from Pi&apos;s stdout. It&apos;s no longer respecting SIGINT.
      </p>

      <h2>Controlling the Control-C</h2>

      <p>
        Thanks to a serendipitous moment while surfing the{" "}
        <a href="https://github.com/kkawakam/rustyline" target="_blank" rel="noopener noreferrer">
          rustyline
        </a>{" "}
        repo, which we use for building a nice UX for our REPL, we found that the version we were using (v17) had a{" "}
        <a href="https://github.com/kkawakam/rustyline/issues/929" target="_blank" rel="noopener noreferrer">
          bug
        </a>{" "}
        which masks the SIGINT event. So we upgraded to the latest version, and now we are receiving SIGINT while the
        model is streaming, but the SIGINT exits the program altogether instead of stopping the stream and returning to
        the user prompt.
      </p>

      <p>
        This is in fact expected, as normally programs should handle SIGINT themselves if they want to do cleanups,
        graceful shutdowns, etc. So we use the{" "}
        <a href="https://docs.rs/ctrlc/latest/ctrlc/" target="_blank" rel="noopener noreferrer">
          ctrlc
        </a>{" "}
        library to handle SIGINT, which uses a dedicated thread for handling the event.
      </p>

      <RustCodeBlock code={`let is_running = Arc::new(AtomicBool::new(true));
let is_running_ref = is_running.clone();
ctrlc::set_handler(move || {
    is_running_ref.store(false, std::sync::atomic::Ordering::SeqCst);
})
....
....
while is_running.load(std::sync::atomic::Ordering::SeqCst) {
 // loop breaks when SIGINT is fired and above handler toggles
 // is_running to false
}`} />

      <p>
        But again, for some reason we are back to square one where the REPL is non-responsive to Ctrl-C when it&apos;s
        streaming the output.
      </p>

      <p>
        Turns out the way we read from Pi&apos;s stdout is a synchronous, blocking operation. So we tried converting all the
        functions related to this to async using the corresponding async functions provided by{" "}
        <a href="https://tokio.rs/" target="_blank" rel="noopener noreferrer">
          tokio
        </a>{" "}
        (an async runtime library for Rust). For example, the core operation here is using a buffered reader to read from
        Pi&apos;s stdout efficiently, so we replace the{" "}
        <a href="https://doc.rust-lang.org/stable/std/io/struct.BufReader.html" target="_blank" rel="noopener noreferrer">
          BufReader
        </a>{" "}
        from the std library with the async{" "}
        <a href="https://docs.rs/tokio/latest/tokio/io/struct.BufReader.html" target="_blank" rel="noopener noreferrer">
          BufReader
        </a>{" "}
        provided by the Tokio runtime.
      </p>

      <blockquote>
        <p>
          Tokio uses co-operative scheduling to switch between its tasks, so when we use an async function, it will
          yield frequently instead of blocking throughout the process.
        </p>
      </blockquote>

      <p>
        Once we refactored the codebase to be async, we started getting SIGINT events in the handler we set using the
        ctrlc library before, and the program no longer exits either. Now all we have to do is abort the Pi session by
        sending an abort event to Pi and do the cleanup from our side.
      </p>

      <RustCodeBlock code={`while let Some(line) = reader.next_line().await? {
   if !is_running.load(std::sync::atomic::Ordering::SeqCst) {
      info!("Ctrlc detected, aborting Pi ops");
      let end_payload = json!({
          "type": "abort",
       });
       // sending abort event to Pi
       send_to_pi(pi_stdin, end_payload).await?;
       // toggling is_running back to true, once we handled
       // the ctrl-c
       is_running.store(true, std::sync::atomic::Ordering::SeqCst);
       continue;
}`} />

      <p>
        For more details on the sync-async conversion, see the{" "}
        <a
          href="https://github.com/tilesprivacy/tiles/pull/152/changes#diff-684db0fd5a4dc082dd110af19d9451265fb5fbf03ce2dfe62127cf5ee8194be4"
          target="_blank"
          rel="noopener noreferrer"
        >
          PR diff
        </a>
        .
      </p>

      <h2>Unexpected entry of SIGPIPE</h2>

      <p>
        The interesting thing now is that when we exit the main REPL program, the Pi process also exits, which
        shouldn&apos;t be the case as both are now in different process groups, right? Could this be related to the pipes
        getting closed on one end?
      </p>

      <p>
        Although this is fine for us, as we don&apos;t want the Pi process to be a background daemon and go rogue,
        it&apos;s important to understand what&apos;s happening under the hood, as we also have a Tiles daemon process
        (which is a background headless Tiles HTTP server) that is still alive even after the main REPL program closes,
        as it&apos;s supposed to be (this was also spawned in a different process group).
      </p>

      <RustCodeBlock code={`// where 88068 is pid for tiles

pstree -p 88068

\\-+= 88068 tiles target/debug/tiles
  |--= 88098 tiles target/debug/tiles daemon
  \\--= 88099 tiles /Users/tiles/tiles/.tiles_dev/tiles/pi/pi --mode rpc`} />

      <p>PID=88098 is our daemon.</p>

      <p>
        Why the dual behavior for the same action? For that we can live-debug the Pi program using lldb (LLVM debugger) to
        see what happens when the parent exits. We will attach the Pi process to lldb, add a breakpoint for SIGPIPE,
        then step through to see if Pi is handling SIGPIPE or not. The actions we take are commented with numbered index.
      </p>

      <RustCodeBlock code={`// (1) Starting lldb for the Pi process
➜ sudo lldb -p 88099

No entry for terminal type "xterm-ghostty";
using dumb terminal settings.
// (2) Attaching Pi PID to the debugger
(lldb) process attach --pid 88099

Process 88099 stopped
Target 0: (pi) stopped.
Executable binary set to "/Users/tiles/tiles/.tiles_dev/tiles/pi/pi".
Architecture set to: arm64-apple-macosx-.
No entry for terminal type "xterm-ghostty";
using dumb terminal settings.

// (3) Adding a breakpoint for SIGPIPE and notify us
(lldb) break set -n write
Breakpoint 1: 19 locations.
(lldb) process handle SIGPIPE --pass false --stop true --notify true
NAME         PASS   STOP   NOTIFY
===========  =====  =====  ======
SIGPIPE      false  true   true

// (4) Resuming the debugger
(lldb) process continue

// At this point we exit the Tiles repl and debugger pauses
// Pi
Process 88099 resuming
Process 88099 stopped
// (5) At this point, Tiles repl already exit, and now we
// remove the SIGPIPE breakpoint
(lldb) process handle SIGPIPE --pass true --stop false --notify true

NAME         PASS   STOP   NOTIFY
===========  =====  =====  ======
SIGPIPE      true   false  true

// (6) and continue the Pi program after removing the breakpoint
(lldb) process continue
// We can see that Pi program exits as soon as it
// receives SIGPIPE
Process 88099 resuming
Process 88099 exited with status = 0 (0x00000000)`} />

      <p>
        As seen in the lldb logs, the program exits as soon as it receives SIGPIPE, so Pi doesn&apos;t have a handler for
        SIGPIPE, which causes it to exit.
      </p>

      <h2>Conclusion</h2>

      <p>
        Debugging a seemingly trivial terminal UI issue led us into a rabbit hole of standard streams, pipes, Unix
        processes, and their dynamic behavior on system signals with respect to their parent, and finally to the problems
        caused by blocking I/O in a UI and how async Rust can fix it.
      </p>
    </BlogPostContent>
  )
}
