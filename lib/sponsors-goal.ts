export interface SponsorsGoalData {
  goalAmountMonthly: string | null
  progressPercent: string | null
}

const SPONSORS_PROGRESS_PERCENT_FALLBACK = "20%"
const SPONSORS_GOAL_AMOUNT_MONTHLY = "$1,500 per month"

export async function getGithubSponsorsGoalData(): Promise<SponsorsGoalData> {
  try {
    const response = await fetch("https://github.com/sponsors/tilesprivacy", {
      next: { revalidate: 21600 },
      headers: {
        "User-Agent": "Tiles Website",
      },
    })

    if (!response.ok) {
      return { goalAmountMonthly: null, progressPercent: null }
    }

    const html = await response.text()
    const goalMatch =
      html.match(/earn\s+\$([0-9,]+)\s+per month/i) ??
      html.match(/towards\s+\$([0-9,]+)\s+per month/i)
    const progressMatch =
      html.match(/<p class="f5 text-bold mb-2">[\s\S]*?<span[^>]*>\s*([0-9]{1,3})%\s*<\/span>/i) ??
      html.match(/width:\s*([0-9]{1,3})%;[^>]*sponsors-goal-progress-bar/i)

    const parsedGoalAmountMonthly = goalMatch ? `$${goalMatch[1]} per month` : null
    const parsedProgressPercent = progressMatch ? Number.parseInt(progressMatch[1], 10) : null
    const goalAmountMonthly = parsedGoalAmountMonthly ?? SPONSORS_GOAL_AMOUNT_MONTHLY
    const fallbackProgressPercent = Number.parseInt(SPONSORS_PROGRESS_PERCENT_FALLBACK, 10)
    const shouldUseParsedProgress =
      parsedProgressPercent !== null &&
      (parsedGoalAmountMonthly === goalAmountMonthly || parsedGoalAmountMonthly === SPONSORS_GOAL_AMOUNT_MONTHLY)
    const normalizedProgressPercent = shouldUseParsedProgress ? parsedProgressPercent : fallbackProgressPercent

    return {
      goalAmountMonthly,
      progressPercent: `${normalizedProgressPercent}%`,
    }
  } catch {
    return {
      goalAmountMonthly: SPONSORS_GOAL_AMOUNT_MONTHLY,
      progressPercent: SPONSORS_PROGRESS_PERCENT_FALLBACK,
    }
  }
}
