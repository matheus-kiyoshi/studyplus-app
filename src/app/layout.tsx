import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
import './globals.css'
import { Roboto } from 'next/font/google'
import AppTheme from '@/shared-theme/AppTheme'
import { CssBaseline } from '@mui/material'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'study+',
  description: 'Gerencie seus estudos de forma simples e eficiente.',
}

export default function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode
  disableCustomTheme?: boolean
}>) {
  return (
    <html lang="pt-BR">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            {children}
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
