import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/header/Header'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Tracker() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <>
      <Header />
      <main className="flex h-screen w-screen items-center justify-center">
        Em Breve
      </main>
      <Footer />
    </>
  )
}
