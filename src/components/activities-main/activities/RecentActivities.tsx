'use client'
import React from 'react'
import Box from '@mui/material/Box'
import { Typography, Divider } from '@mui/material'
import useAppStore, { Activity } from '@/app/store'
import { GiStopwatch } from 'react-icons/gi'
import { FaClock } from 'react-icons/fa'

export default function RecentActivities() {
  const { user } = useAppStore()

  return (
    <>
      <Typography variant="h3">Atividades Recentes</Typography>
      {user?.Activities &&
        Object.entries(
          user.Activities.reduce(
            (acc: { [key: string]: Activity[] }, activity) => {
              const utcDate = new Date(activity.startDate)
              const day = utcDate.toISOString().split('T')[0]
              const formattedDay = day.split('-').reverse().join('/')
              const oneWeekAgo = new Date()
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
              if (utcDate >= oneWeekAgo) {
                if (!acc[formattedDay]) acc[formattedDay] = []
                acc[formattedDay].push(activity)
              }

              return acc
            },
            {},
          ),
        )
          .sort(([dayA], [dayB]) => {
            const dateA = new Date(dayA.split('/').reverse().join('-'))
            const dateB = new Date(dayB.split('/').reverse().join('-'))
            return dateB.getTime() - dateA.getTime()
          })
          .map(([day, activities]) => (
            <Box key={day} className="my-2">
              <Typography variant="h6">Atividades do dia {day}</Typography>
              {(activities as Activity[]).map((activity: Activity) => {
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
                  <React.Fragment key={activity.id}>
                    <Box className="my-1 flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
                      <div className="flex w-full items-center justify-between gap-4 sm:w-min sm:justify-normal">
                        <Typography
                          variant="subtitle1"
                          className="flex items-center gap-1"
                        >
                          <span
                            className="h-4 w-4 rounded-full"
                            style={{
                              backgroundColor:
                                activity.Subject?.color || '#fff',
                            }}
                          ></span>
                          {activity.Subject?.name}
                        </Typography>
                        <Typography variant="subtitle2" className="mt-1">
                          {activity.Topic?.name}
                        </Typography>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 sm:w-min sm:justify-normal">
                        <Typography className="flex items-center gap-1">
                          <FaClock />
                          {formattedTime}
                        </Typography>
                        <Typography className="flex items-center gap-1">
                          <GiStopwatch />
                          {studyTimeHours}:{studyTimeMinutes}
                        </Typography>
                      </div>
                    </Box>
                    <Divider />
                  </React.Fragment>
                )
              })}
            </Box>
          ))}
    </>
  )
}
