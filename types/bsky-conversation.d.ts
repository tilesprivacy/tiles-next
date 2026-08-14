import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * JSX typing for the <bsky-conversation> custom element registered by
 * lib/vendor/bsky-conversation.js.
 */
interface BskyConversationAttributes
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  /** bsky.app post URL whose conversation is rendered. */
  uri: string;
  /** Reply nesting levels before a "continue on Bluesky" link (default 3). */
  "max-depth"?: string | number;
  /** Call-to-action link text; empty string hides it. */
  "engage-text"?: string;
  /** Template for the stats header line. */
  "header-template"?: string;
  /** Set to "true" to include the original post in the timeline. */
  "show-original-post"?: string;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "bsky-conversation": BskyConversationAttributes;
    }
  }
}
