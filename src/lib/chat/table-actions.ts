// The copy, download and fullscreen controls on markdown tables. The tables
// are server-rendered HTML, so one delegated click handler on the transcript
// drives every table's buttons (see tableWrapper in markdown.ts).

interface TableData {
  headers: string[]
  rows: string[][]
}

function tableData(table: HTMLTableElement): TableData {
  const cell = (node: Element) => node.textContent?.trim() ?? ""
  return {
    headers: [...table.querySelectorAll("thead th")].map(cell),
    rows: [...table.querySelectorAll("tbody tr")].map((row) => [...row.querySelectorAll("td")].map(cell)),
  }
}

function toCsv({ headers, rows }: TableData): string {
  const escape = (value: string) =>
    value.includes('"') ? `"${value.replace(/"/g, '""')}"` : /[,\n]/.test(value) ? `"${value}"` : value
  return [...(headers.length ? [headers] : []), ...rows].map((row) => row.map(escape).join(",")).join("\n")
}

function toTsv({ headers, rows }: TableData): string {
  const escape = (value: string) => value.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r")
  return [...(headers.length ? [headers] : []), ...rows].map((row) => row.map(escape).join("\t")).join("\n")
}

function toMarkdown({ headers, rows }: TableData): string {
  if (!headers.length) return ""
  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|")
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`
  return [
    line(headers.map(escape)),
    line(headers.map(() => "---")),
    ...rows.map((row) => line(row.length < headers.length ? headers.map((_, i) => escape(row[i] ?? "")) : row.map(escape))),
  ].join("\n")
}

const FORMATS: Record<string, (data: TableData) => string> = { csv: toCsv, tsv: toTsv, md: toMarkdown }

export function downloadFile(filename: string, content: string, type: string) {
  // Excel needs the BOM to read UTF-8 CSV.
  const blob = new Blob([type.startsWith("text/csv") ? `﻿${content}` : content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const CHECK_ICON =
  '<svg color="currentColor" height="14" stroke-linejoin="round" viewBox="0 0 16 16" width="14" aria-hidden="true"><path clip-rule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z" fill="currentColor" fill-rule="evenodd"></path></svg>'

async function copyTable(table: HTMLTableElement, format: string, toggle: HTMLElement | null) {
  const text = FORMATS[format]?.(tableData(table)) ?? ""
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/plain": new Blob([text], { type: "text/plain" }),
      "text/html": new Blob([table.outerHTML], { type: "text/html" }),
    }),
  ])
  if (!toggle) return
  // A check mark for two seconds, as before.
  const icon = toggle.innerHTML
  toggle.innerHTML = CHECK_ICON
  setTimeout(() => (toggle.innerHTML = icon), 2000)
}

export function closeTableMenus(except?: Element | null) {
  for (const menu of document.querySelectorAll<HTMLElement>("[data-table-menu]")) {
    if (menu !== except) menu.hidden = true
  }
}

/** Handles a click anywhere in the transcript; returns the table to show fullscreen, if asked. */
export function handleTableClick(event: MouseEvent): HTMLTableElement | null {
  const target = event.target instanceof Element ? event.target : null
  const button = target?.closest<HTMLElement>("[data-table-menu-toggle], [data-table-action]")
  if (!button) return null

  const scope = button.closest('[data-streamdown="table-wrapper"], [data-streamdown="table-fullscreen"]')
  const table = scope?.querySelector("table")
  if (!table) return null

  const toggle = button.dataset.tableMenuToggle
  if (toggle) {
    const menu = button.parentElement?.querySelector<HTMLElement>(`[data-table-menu="${toggle}"]`)
    closeTableMenus(menu)
    if (menu) menu.hidden = !menu.hidden
    return null
  }

  const action = button.dataset.tableAction
  const format = button.dataset.format ?? "md"
  closeTableMenus()
  if (action === "fullscreen") return table
  if (action === "copy") {
    const menuToggle = button.closest(".relative")?.querySelector<HTMLElement>("[data-table-menu-toggle]") ?? null
    copyTable(table, format, menuToggle).catch(() => {})
  } else if (action === "download") {
    const data = tableData(table)
    if (format === "csv") downloadFile("table.csv", toCsv(data), "text/csv")
    else downloadFile("table.md", toMarkdown(data), "text/markdown")
  }
  return null
}
