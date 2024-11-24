import { Fragment } from 'react'
import { Container, Divider, Stack } from '@mui/material'
import Subject from './Subject'
import useAppStore from '@/app/store'

interface SubjectsProps {
  className: string
}

export default function Subjects({ className }: SubjectsProps) {
  const { subjects } = useAppStore()

  return (
    <Container
      sx={{ backgroundColor: '' }}
      className={`${className} w-full rounded-md p-4`}
    >
      <h1 className="text-2xl font-semibold">Matérias</h1>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2}>
        {subjects.map((subject, index) => (
          <Fragment key={index}>
            <Subject
              id={subject.id}
              name={subject.name}
              description={subject.description}
              timeSpent={subject.timeSpent}
              color={subject.color}
              Topics={subject.Topics}
            />
            <Divider />
          </Fragment>
        ))}
      </Stack>
    </Container>
  )
}
