'use client'
import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import Subjects from './Subjects'
import CreateSubject from './CreateSubject'
import useAppStore, { Subject, Topic } from '@/app/store'
import EditSubject from './EditSubject'
import api from '@/utils/api'
import { useSession } from 'next-auth/react'

export default function SubjectsMain() {
  const { value, setValue, selectedSubject, setSubjects } = useAppStore()
  const [fetched, setFetched] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('subjects', {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        })
        const subs = response.data as Subject[]

        await Promise.all(
          subs.map(async (sub: Subject) => {
            sub.Topics = await fetchTopics(sub.id)
          }),
        )

        setSubjects(subs)
        setFetched(true)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchTopics = async (id: string) => {
      try {
        const response = await api.get(`subjects/${id}/topics`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        })
        return response.data as Topic[]
      } catch (error) {
        console.error(error)
        return []
      }
    }

    if (!fetched && session?.user.token) fetchSubjects()
  }, [session?.user.token, fetched, setSubjects])

  return (
    <>
      {value === 0 ? (
        <>
          <Box
            sx={{ backgroundColor: '#0000000f' }}
            className="rounded-b-md p-2"
          >
            <Button variant="contained" onClick={() => setValue(1)}>
              Criar Matéria
            </Button>
          </Box>
          <Subjects className="mt-4" />
        </>
      ) : value === 1 ? (
        <>
          <Box
            sx={{ backgroundColor: '#0000000f' }}
            className="rounded-b-md p-2"
          >
            <Button variant="contained" onClick={() => setValue(0)}>
              Voltar
            </Button>
          </Box>
          <CreateSubject />
        </>
      ) : (
        <>
          <Box
            sx={{ backgroundColor: '#0000000f' }}
            className="rounded-b-md p-2"
          >
            <Button variant="contained" onClick={() => setValue(0)}>
              Voltar
            </Button>
          </Box>
          {selectedSubject && (
            <EditSubject
              id={selectedSubject.id}
              name={selectedSubject.name}
              description={selectedSubject.description}
              timeSpent={selectedSubject.timeSpent}
              color={selectedSubject.color}
            />
          )}
        </>
      )}
    </>
  )
}
