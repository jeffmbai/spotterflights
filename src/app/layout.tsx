import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AirportProvider } from "../lib/context/airport-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkySearch - Find Your Perfect Flight",
  description: "Search and compare flights from hundreds of airlines worldwide",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AirportProvider>{children}</AirportProvider>
      </body>
    </html>
  )
}
