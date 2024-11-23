import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/header/Header'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import BasicTabs from '@/components/activities-main/Tab'
import Wrapper from '@/components/activities-main/Wrapper'

export default async function Activities() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <>
      <Header />
      <Wrapper>
        <BasicTabs />
      </Wrapper>
      <Footer />
    </>
  )
}