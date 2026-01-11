import { calculateReadingTime } from "@/lib/utils"

interface ReadingTimeProps {
  content: string
  className?: string
}

export function ReadingTime({ content, className }: ReadingTimeProps) {
  const minutes = calculateReadingTime(content)
  const text = minutes === 1 ? "1 min read" : `${minutes} min read`

  return (
    <span className={className}>
      {text}
    </span>
  )
}
