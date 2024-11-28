'use client'
import useAppStore from '@/app/store'
import { Box, Container, Typography } from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import RecentActivities from '../activities-main/activities/RecentActivities'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Wrapper from '../activities-main/Wrapper'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, isUserFetched, fetchUser } = useAppStore()
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/sign-in')
    }
  }, [session, router])

  useEffect(() => {
    if (session?.user.token && !isUserFetched) {
      fetchUser(session.user.token)
    }
  }, [session?.user.token, fetchUser, isUserFetched])

  const sampleData = [
    { day: 'Seg', hours: 3 },
    { day: 'Ter', hours: 4 },
    { day: 'Qua', hours: 2 },
    { day: 'Qui', hours: 5 },
    { day: 'Sex', hours: 1 },
    { day: 'Sáb', hours: 4 },
    { day: 'Dom', hours: 3 },
  ]

  return (
    <Wrapper>
      <Container className="flex w-full flex-col gap-4">
        <Typography variant="h2">Olá, {user?.name}</Typography>
        <Box className="w-full flex-1">
          <Box className="rounded-lg border px-8 py-4 shadow-md">
            <RecentActivities />
          </Box>
          <Box className="flex w-full flex-nowrap justify-between gap-8 pt-6">
            <Box className="flex w-full flex-col gap-4 rounded-lg border p-4 shadow-md">
              <Typography variant="h4">Últimos 7 dias</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis
                    label={{
                      value: 'Horas',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip />
                  <Bar type="monotone" dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box className="flex w-full flex-col gap-4 rounded-lg border p-4 shadow-md">
              <Typography variant="h4">Matérias mais estudadas</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Wrapper>
  )
}
