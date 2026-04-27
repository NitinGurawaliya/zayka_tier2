import type React from "react"
import { CustomSidebar } from "@/components/custom-sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <CustomSidebar />
      <main className="flex-1 md:ml-64">{children}</main>
    </div>
  )
}

