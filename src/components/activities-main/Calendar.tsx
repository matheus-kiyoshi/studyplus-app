'use client'
import { useState } from 'react'
import useAppStore, { Activity } from '@/app/store'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg } from '@fullcalendar/core/index.js'
import { Box, Divider, Modal, Typography } from '@mui/material'

export default function Calendar() {
  const [open, setOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Activity[] | null>(null)
  const { user } = useAppStore()

  const handleDateClick = (info: EventClickArg) => {
    const activities = (info.event.extendedProps as { activities: Activity[] })
      .activities
    setSelectedDay(activities)
    setOpen(true)
  }

  const events = user?.Activities.reduce(
    (
      acc: { date: string; activities: Activity[]; studyTime: number }[],
      activity,
    ) => {
      const day = new Date(activity.startDate).toISOString().split('T')[0]
      const existingEvent = acc.find(
        (event: { date: string }) => event.date === day,
      )

      if (existingEvent) {
        existingEvent.activities.push(activity)
        existingEvent.studyTime += activity.studyTime || 0
      } else {
        acc.push({
          date: day,
          activities: [activity],
          studyTime: activity.studyTime || 0,
        })
      }
      return acc
    },
    [],
  )
    .map((event) => [
      {
        title: `${event.activities.length} atividades feitas`,
        date: event.date,
        extendedProps: { activities: event.activities },
      },
      {
        title: `${(event.studyTime / 3600).toFixed(1)} hrs estudadas`,
        date: event.date,
        extendedProps: { activities: event.activities },
      },
    ])
    .flat()

  return (
    <>
      <Typography variant="h3" className="pt-6">
        Calendário
      </Typography>
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
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Atividades do dia</Typography>
          {selectedDay?.length ? (
            selectedDay.map((activity: Activity) => {
              const studyTimeHours = activity.studyTime
                ? Math.floor(activity.studyTime / 3600)
                : 0
              const studyTimeMinutes = activity.studyTime
                ? String(Math.floor((activity.studyTime % 3600) / 60)).padStart(
                    2,
                    '0',
                  )
                : '00'

              return (
                <Box
                  key={activity.id}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 1,
                    itemsAlign: 'start',
                    justifyContent: 'start',
                  }}
                >
                  <div className="flex w-full justify-between gap-8">
                    <Typography className="flex items-center gap-1">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: activity.Subject?.color || '#fff',
                        }}
                      ></span>
                      Assunto: {activity.Subject?.name}
                    </Typography>
                    <Typography>Tópico: {activity.Topic?.name}</Typography>
                  </div>
                  <div className="flex w-full justify-between gap-8">
                    <Typography>
                      Horário:{' '}
                      {new Date(activity.startDate).toISOString().slice(11, 16)}
                    </Typography>
                    <Typography className="flex gap-1">
                      Tempo de estudo:
                      <span>
                        {studyTimeHours} horas {studyTimeMinutes} minutos
                      </span>
                    </Typography>
                  </div>
                  <Divider />
                </Box>
              )
            })
          ) : (
            <Typography>Nenhuma atividade registrada nesse dia.</Typography>
          )}
        </Box>
      </Modal>
    </>
  )
}
