'use client'
import React, { useState, SyntheticEvent, ReactNode, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Button, Container } from '@mui/material'
import SubjectsMain from './subject/Main'
import CreateActivity from './activities/CreateActivity'
import { useSession } from 'next-auth/react'
import useAppStore from '@/app/store'
import RecentActivities from './activities/RecentActivities'
import Calendar from './Calendar'
import Historic from './Historic/Historic'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs() {
  const { data: session } = useSession()
  const {
    isFetched,
    fetchSubjects,
    fetchUser,
    isUserFetched,
    user,
    setValue2,
    value2,
  } = useAppStore()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (session?.user.token && !isFetched && !isUserFetched) {
      fetchSubjects(session.user.token)
      fetchUser(session.user.token)
    }
  }, [session?.user.token, isFetched, fetchSubjects, fetchUser, isUserFetched])

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue2(0)
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Atividades">
          <Tab label="Calendário" {...a11yProps(0)} />
          <Tab label="Histórico" {...a11yProps(1)} />
          <Tab label="Matérias" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {value2 === 0 ? (
          <>
            <Box
              sx={{ backgroundColor: '#0000000f' }}
              className="rounded-b-md p-2"
            >
              <Button variant="contained" onClick={() => setValue2(1)}>
                Criar Atividade
              </Button>
            </Box>
            <Container className="mt-4 !px-2">
              <Box>
                <RecentActivities />

                {user?.Activities?.length === 0 && (
                  <Box>
                    Você ainda não tem atividades recentes.
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setValue2(1)}
                    >
                      Iniciar uma nova atividade
                    </Button>
                  </Box>
                )}
              </Box>
              <Box>
                <Calendar />
              </Box>
            </Container>
          </>
        ) : (
          <>
            <Box
              sx={{ backgroundColor: '#0000000f' }}
              className="rounded-b-md p-2"
            >
              <Button variant="contained" onClick={() => setValue2(0)}>
                Voltar
              </Button>
            </Box>
            <CreateActivity />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {value2 === 0 ? (
          <>
            <Box
              sx={{ backgroundColor: '#0000000f' }}
              className="rounded-b-md p-2"
            >
              <Button
                variant="contained"
                onClick={() => {
                  setValue2(1)
                  setValue(0)
                }}
              >
                Criar Atividade
              </Button>
            </Box>
            <Container className="mt-4 !px-0">
              <Historic />
            </Container>
          </>
        ) : (
          <>
            <Box
              sx={{ backgroundColor: '#0000000f' }}
              className="rounded-b-md p-2"
            >
              <Button variant="contained" onClick={() => setValue2(0)}>
                Voltar
              </Button>
            </Box>
            <CreateActivity />
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SubjectsMain />
      </CustomTabPanel>
    </Box>
  )
}
