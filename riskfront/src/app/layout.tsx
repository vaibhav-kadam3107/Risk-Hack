import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ClientLayout } from "./client-layout"
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "HSBC DORA Metrics Assessment",
  description: "DevOps Research and Assessment Platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClerkProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ClerkProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  )
}
