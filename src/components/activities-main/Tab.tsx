'use client'
import { useState, SyntheticEvent, ReactNode, useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Button, Container, Typography, Modal } from '@mui/material'
import SubjectsMain from './subject/Main'
import CreateActivity from './activities/CreateActivity'
import { useSession } from 'next-auth/react'
import useAppStore from '@/app/store'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

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
  const [value, setValue] = useState(0)
  const [value2, setValue2] = useState(0)
  const { data: session } = useSession()
  const { isFetched, fetchSubjects, fetchUser, user } = useAppStore()
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    if (session?.user.token && !isFetched) {
      fetchSubjects(session.user.token)
      fetchUser(session.user.token)
    }
  }, [session?.user.token, isFetched, fetchSubjects, fetchUser])

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleDateClick = (info) => {
    setSelectedDay(info.event.extendedProps.activities)
    setOpen(true)
  }

  const events = user?.Activities.reduce((acc, activity) => {
    const day = new Date(activity.startDate).toISOString().split('T')[0]
    const existingEvent = acc.find((event) => event.date === day)

    if (existingEvent) {
      existingEvent.activities.push(activity)
      existingEvent.studyTime += activity.studyTime || 0
    } else {
      acc.push({
        title: 'Atividades do dia',
        date: day,
        activities: [activity],
        studyTime: activity.studyTime || 0,
      })
    }
    return acc
  }, [])
    .map((event) => [
      {
        title: `${event.activities.length} atividades feitas`,
        date: event.date,
        extendedProps: { activities: event.activities },
      },
      {
        title: `${(event.studyTime / 3600).toFixed(1)} horas estudadas`,
        date: event.date,
        extendedProps: { activities: event.activities },
      },
    ])
    .flat()

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
            <Container>
              <Box>
                <Typography>Atividades Recentes</Typography>
                {user?.Activities &&
                  Object.entries(
                    user.Activities.reduce((acc, activity) => {
                      const utcDate = new Date(activity.startDate)
                      const day = utcDate.toISOString().split('T')[0]
                      const formattedDay = day.split('-').reverse().join('/')
                      if (!acc[formattedDay]) acc[formattedDay] = []
                      acc[formattedDay].push(activity)
                      return acc
                    }, {}),
                  )
                    .sort(([dayA], [dayB]) => {
                      const dateA = new Date(
                        dayA.split('/').reverse().join('-'),
                      )
                      const dateB = new Date(
                        dayB.split('/').reverse().join('-'),
                      )
                      return dateB - dateA
                    })
                    .map(([day, activities]) => (
                      <Box key={day} className="my-2">
                        <Typography variant="h6">
                          Atividades do dia {day}
                        </Typography>
                        {activities.map((activity) => {
                          const formattedTime = new Date(activity.startDate)
                            .toISOString()
                            .slice(11, 16)

                          const studyTimeHours = activity.studyTime
                            ? Math.floor(activity.studyTime / 3600)
                            : 0
                          const studyTimeMinutes = activity.studyTime
                            ? String(
                                Math.floor((activity.studyTime % 3600) / 60),
                              ).padStart(2, '0')
                            : '00'

                          return (
                            <Box key={activity.id} className="my-1 flex gap-2">
                              <Typography>{activity.Subject?.name}</Typography>
                              <Typography>{activity.Topic?.name}</Typography>
                              <Typography>{formattedTime}</Typography>
                              <Typography>
                                {studyTimeHours}:{studyTimeMinutes}
                              </Typography>
                            </Box>
                          )
                        })}
                      </Box>
                    ))}

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
                <Typography>Calendário</Typography>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  eventClick={handleDateClick}
                  events={events}
                />
                <Modal open={open} onClose={() => setOpen(false)}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6">Atividades do dia</Typography>
                    {selectedDay?.length ? (
                      selectedDay.map((activity) => {
                        const studyTimeHours = activity.studyTime
                          ? Math.floor(activity.studyTime / 3600)
                          : 0
                        const studyTimeMinutes = activity.studyTime
                          ? String(
                              Math.floor((activity.studyTime % 3600) / 60),
                            ).padStart(2, '0')
                          : '00'

                        return (
                          <Box
                            key={activity.id}
                            className="my-1 flex flex-col gap-2"
                          >
                            <Typography>
                              Assunto: {activity.Subject?.name}
                            </Typography>
                            <Typography>
                              Tópico: {activity.Topic?.name}
                            </Typography>
                            <Typography>
                              Horário:{' '}
                              {new Date(activity.startDate)
                                .toISOString()
                                .slice(11, 16)}
                            </Typography>
                            <Typography>
                              Tempo de estudo: {studyTimeHours} horas{' '}
                              {studyTimeMinutes} minutos
                            </Typography>
                          </Box>
                        )
                      })
                    ) : (
                      <Typography>
                        Nenhuma atividade registrada nesse dia.
                      </Typography>
                    )}
                  </Box>
                </Modal>
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
        <Box sx={{ backgroundColor: '#0000000f' }} className="rounded-b-md p-2">
          <Button variant="contained">Criar Atividade</Button>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SubjectsMain />
      </CustomTabPanel>
    </Box>
  )
}
