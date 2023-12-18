import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life CLI',
  description: 'An Idea Nexus Ventures Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html  className="h-full bg-gray-900" lang="en">
      {/*<html class="h-full bg-gray-900">
        <body class="h-full">*/}
      <body className={`${inter.className} h-full`}>{children}</body>
      </html>
  )
}
