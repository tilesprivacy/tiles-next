<script lang="ts" module>
  // Lucide icons as the viewer drew them (lucide-react 0.454); newer Lucide
  // releases changed some of these shapes, so they're pinned here.
  type Shape = ["path", { d: string }] | ["rect", Record<string, string>] | ["circle", Record<string, string>] | ["line", Record<string, string>] | ["polyline", { points: string }]

  const ICONS: Record<string, Shape[]> = {
    brain: [
      ["path", { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }],
      ["path", { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" }],
      ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }],
      ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375" }],
      ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
      ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }],
      ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396" }],
      ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }],
      ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18" }],
    ],
    "calendar-days": [
      ["path", { d: "M8 2v4" }],
      ["path", { d: "M16 2v4" }],
      ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
      ["path", { d: "M3 10h18" }],
      ["path", { d: "M8 14h.01" }],
      ["path", { d: "M12 14h.01" }],
      ["path", { d: "M16 14h.01" }],
      ["path", { d: "M8 18h.01" }],
      ["path", { d: "M12 18h.01" }],
      ["path", { d: "M16 18h.01" }],
    ],
    check: [["path", { d: "M20 6 9 17l-5-5" }]],
    "chevron-down": [["path", { d: "m6 9 6 6 6-6" }]],
    "circle-alert": [
      ["circle", { cx: "12", cy: "12", r: "10" }],
      ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
      ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
    ],
    copy: [
      ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
      ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
    ],
    download: [
      ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
      ["polyline", { points: "7 10 12 15 17 10" }],
      ["line", { x1: "12", x2: "12", y1: "15", y2: "3" }],
    ],
    "file-text": [
      ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
      ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
      ["path", { d: "M10 9H8" }],
      ["path", { d: "M16 13H8" }],
      ["path", { d: "M16 17H8" }],
    ],
    terminal: [
      ["polyline", { points: "4 17 10 11 4 5" }],
      ["line", { x1: "12", x2: "20", y1: "19", y2: "19" }],
    ],
    wrench: [
      [
        "path",
        {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
        },
      ],
    ],
  }

  export type ChatIconName = keyof typeof ICONS
</script>

<script lang="ts">
  let { name, class: className = "" }: { name: ChatIconName; class?: string } = $props()
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
>
  {#each ICONS[name] as [tag, attributes], index (index)}
    {#if tag === "path"}<path {...attributes} />
    {:else if tag === "rect"}<rect {...attributes} />
    {:else if tag === "circle"}<circle {...attributes} />
    {:else if tag === "line"}<line {...attributes} />
    {:else}<polyline {...attributes} />{/if}
  {/each}
</svg>
