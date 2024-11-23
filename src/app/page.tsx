import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/header/Header'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) console.log(session)

  return (
    <>
      <Header />
      <h1 className="h-screen w-screen">
        Hello {session ? session.user?.name : ''}
      </h1>
      <Footer />
    </>
  )
}
