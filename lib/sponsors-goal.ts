export interface SponsorsGoalData {
  goalAmountMonthly: string | null
  progressPercent: string | null
}

const SPONSORS_PROGRESS_PERCENT_FALLBACK = "90%"
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

    const parsedGoalAmountMonthly = goalMatch ? `$${goalMatch[1]} per month` : null
    const goalAmountMonthly = parsedGoalAmountMonthly ?? SPONSORS_GOAL_AMOUNT_MONTHLY

    return {
      goalAmountMonthly,
      progressPercent: SPONSORS_PROGRESS_PERCENT_FALLBACK,
    }
  } catch {
    return {
      goalAmountMonthly: SPONSORS_GOAL_AMOUNT_MONTHLY,
      progressPercent: SPONSORS_PROGRESS_PERCENT_FALLBACK,
    }
  }
}
