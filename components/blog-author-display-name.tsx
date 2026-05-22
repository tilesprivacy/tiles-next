import { splitPersonDisplayName } from "@/lib/people"

/** Renders a person’s name with a visible @handle when present in `fullName`. */
export function BlogAuthorDisplayName({
  fullName,
  className,
  handleClassName,
}: {
  fullName: string
  className?: string
  handleClassName?: string
}) {
  const { nameWithoutHandle, handle } = splitPersonDisplayName(fullName)

  return (
    <span className={className}>
      {nameWithoutHandle}
      {handle ? (
        <>
          {" "}
          <span className={handleClassName}>{handle}</span>
        </>
      ) : null}
    </span>
  )
}
