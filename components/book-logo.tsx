'use client'

import Image from 'next/image'

export function BookLogo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Image
        src="/light.png"
        alt="Tiles"
        width={120}
        height={40}
        className="h-6 w-auto sm:h-8 dark:hidden"
        priority
      />
      <Image
        src="/grey.png"
        alt="Tiles"
        width={120}
        height={40}
        className="hidden h-6 w-auto sm:h-8 dark:block"
        priority
      />
      <span className="hidden sm:inline text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        Tiles Book
      </span>
    </div>
  )
}
