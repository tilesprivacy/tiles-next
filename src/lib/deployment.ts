import { PUBLIC_DEPLOYMENT } from "$app/env/public"

// True in PR preview builds (.github/workflows/preview.yml). Previews show the
// branch's own blog files and drafts, stay out of search, and serve the chat
// viewer on their own address instead of sending it to chat.tiles.run.
export const preview = PUBLIC_DEPLOYMENT === "preview"
