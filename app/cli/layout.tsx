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
      <section className={inter.className + " min-h-screen flex flex-col items-center w-full"}>{children}</section>
  )
}
