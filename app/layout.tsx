import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { getPublicEnv } from '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WealthWise',
  description: 'Modern financial management dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv()
  const supabase = createServerClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    WealthWise
                  </Link>
                </div>
                {session && (
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/transactions"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Transactions
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {session ? (
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign out
                    </button>
                  </form>
                ) : (
                  <div className="space-x-4">
                    <Link
                      href="/auth/login"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}



import './globals.css'