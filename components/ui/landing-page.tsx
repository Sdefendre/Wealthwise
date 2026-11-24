"use client"

import Link from "next/link"
import { Wallet } from "lucide-react"

function Starscape() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(circle_at_center,_transparent_0,_transparent_10%,_black_35%)]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-900/20" />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 h-full w-full animate-pulse opacity-60 blur-[0.5px]"
          style={{
            background: "transparent",
            boxShadow:
              "8vw 12vh #ffffff, 22vw 28vh #ffffff, 40vw 18vh #ffffff, 63vw 14vh #ffffff, 81vw 24vh #ffffff, 12vw 52vh #ffffff, 31vw 44vh #ffffff, 54vw 48vh #ffffff, 72vw 36vh #ffffff, 88vw 58vh #ffffff, 14vw 78vh #ffffff, 34vw 70vh #ffffff, 52vw 82vh #ffffff, 68vw 73vh #ffffff, 86vw 88vh #ffffff, 18vw 22vh #ffffff, 28vw 60vh #ffffff, 46vw 64vh #ffffff, 60vw 32vh #ffffff, 76vw 52vh #ffffff",
          }}
        />
        <div
          className="absolute inset-0 h-full w-full animate-[twinkle_6s_ease-in-out_infinite] opacity-70"
          style={{
            background: "transparent",
            boxShadow:
              "6vw 18vh #e0f2ff, 18vw 34vh #e0f2ff, 36vw 12vh #e0f2ff, 58vw 26vh #e0f2ff, 74vw 18vh #e0f2ff, 90vw 30vh #e0f2ff, 10vw 64vh #e0f2ff, 28vw 56vh #e0f2ff, 44vw 72vh #e0f2ff, 62vw 68vh #e0f2ff, 80vw 62vh #e0f2ff, 14vw 92vh #e0f2ff, 32vw 86vh #e0f2ff, 50vw 94vh #e0f2ff, 70vw 86vh #e0f2ff, 88vw 78vh #e0f2ff",
          }}
        />
      </div>
      <div className="absolute inset-0">
        <span className="shooting-star" />
        <span className="shooting-star shooting-star-delay" />
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0F0F12] flex flex-col">
      <Starscape />
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-[#1F1F23] relative z-10 bg-white/80 backdrop-blur-md dark:bg-[#0F0F12]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-gray-900 dark:text-white" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  WealthWise
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Manage Your Wealth</span>
              <span className="block text-blue-600">With Confidence</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track your investments, monitor your portfolio, and make informed financial decisions with WealthWise.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#1F1F23] relative z-10 bg-white/80 backdrop-blur-md dark:bg-[#0F0F12]/70">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} WealthWise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 