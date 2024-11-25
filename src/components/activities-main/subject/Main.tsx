import { Box, Button } from '@mui/material'
import Subjects from './Subjects'
import CreateSubject from './CreateSubject'
import useAppStore from '@/app/store'
import EditSubject from './EditSubject'

export default function SubjectsMain() {
  const { value, setValue, selectedSubject } = useAppStore()

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
