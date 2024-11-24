'use client'
import { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import Subjects from './Subjects'
import CreateSubject from './CreateSubject'
import useAppStore from '@/app/store'
import EditSubject from './EditSubject'
import api from '@/utils/api'
import { useSession } from 'next-auth/react'

export default function SubjectsMain() {
  const { value, setValue, selectedSubject } = useAppStore()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('subjects', {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        })
        useAppStore.getState().setSubjects(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSubjects()
  }, [session])

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
