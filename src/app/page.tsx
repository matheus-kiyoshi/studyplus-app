import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/header/Header'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/dashboard/Dashboard'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
    </>
  )
}
