"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fallback if view transitions not supported
    if (!(document).startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark")
      return
    }

    const x = e.clientX
    const y = e.clientY
    document.documentElement.style.setProperty("--x", `${x}px`)
    document.documentElement.style.setProperty("--y", `${y}px`)

      // Start view transition
      ; (document).startViewTransition(() => {
        setTheme(theme === "dark" ? "light" : "dark")
      })
  }

  return (
    <div
      onClick={handleToggle}
      className="bg-secondary-light text-secondary-dark dark:text-secondary-light 
                 dark:bg-secondary-dark rounded-full p-1.5 cursor-pointer flex items-center justify-center"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] animate-pulse dark:hidden" />
      <Moon className="h-[1.2rem] w-[1.2rem] animate-pulse hidden dark:block" />
    </div>
  )
}
