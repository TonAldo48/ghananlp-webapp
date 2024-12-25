import "@/styles/globals.css"
import { Metadata, Viewport } from "next"
import { Toaster } from "sonner"

import { META_THEME_COLORS, siteConfig } from "@/config/site"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-svh bg-background font-sans antialiased",
        fontSans.variable,
        fontMono.variable
      )}>
        <div className="relative flex min-h-svh flex-col bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}