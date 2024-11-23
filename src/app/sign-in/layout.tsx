import { NextAuthProvider } from '@/app/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextAuthProvider>{children}</NextAuthProvider>
}
