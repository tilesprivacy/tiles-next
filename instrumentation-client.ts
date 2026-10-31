import { initBotId } from "botid/client/core"

// Attaches Vercel BotID challenge headers to these requests; the routes verify
// them with checkBotId() in lib/email-request-guard.ts.
initBotId({
  protect: [{ path: "/api/subscribe", method: "POST" }],
})
