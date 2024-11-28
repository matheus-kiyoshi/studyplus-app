import { useState } from 'react'
import {
  Select,
  MenuItem,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  SelectChangeEvent,
} from '@mui/material'
import useAppStore from '@/app/store'

interface Filter {
  startDate: string
  finalDate: string
  subjectId?: string
  topicId?: string
}

const oneWeekAgo = new Date()
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

export default function Historic() {
  const [filter, setFilter] = useState<Filter>({
    subjectId: '',
    topicId: '',
    startDate: oneWeekAgo.toISOString().split('T')[0],
    finalDate: new Date().toISOString().split('T')[0],
  })

  const { subjects, user } = useAppStore()

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const topics =
    subjects.find((subject) => subject.id === filter.subjectId)?.Topics || []

  // TODO: needs to be refactored (filtering logic)
  const filteredActivities = user?.Activities.filter((activity) => {
    const activityDate = new Date(activity.startDate)
      .toISOString()
      .split('T')[0]

    const isWithinDateRange =
      activityDate >= filter.startDate && activityDate <= filter.finalDate

    const isSubjectMatch =
      filter.subjectId === 'all' || activity.subjectId === filter.subjectId

    const isTopicMatch =
      filter.topicId === 'all' || activity.topicId === filter.topicId

    return isWithinDateRange && isSubjectMatch && isTopicMatch
  })

  return (
    <div>
      <h1 className="text-xl font-bold">Histórico</h1>
      <Divider className="pt-4" />
      <Box className="flex flex-col items-start gap-4 md:flex-row">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', md: '36%' },
            gap: 2,
            pt: 4,
            pr: { xs: 0, md: 4 },
            borderRight: { xs: '0', md: '1px solid #0000000f' },
            margin: { xs: '0 auto', md: '0' },
          }}
        >
          <div className="flex flex-col gap-4">
            <FormControl fullWidth>
              <InputLabel id="subject-select-label">Matéria</InputLabel>
              <Select
                id="subjectId"
                name="subjectId"
                value={filter.subjectId}
                onChange={handleSelectChange}
                label="Matéria"
                labelId="subject-select-label"
              >
                <MenuItem value="all">Todas as matérias</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!filter.subjectId}>
              <InputLabel id="topic-select-label">Tópico</InputLabel>
              <Select
                id="topicId"
                name="topicId"
                value={filter.topicId}
                onChange={handleSelectChange}
                label="Tópico"
                labelId="topic-select-label"
              >
                <MenuItem value="all">Todos os tópicos</MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider className="my-2" />

            <Typography variant="subtitle1">Filtrar por período</Typography>
            <Box className="flex items-center justify-center gap-4">
              <TextField
                id="startDate"
                name="startDate"
                label="Início"
                type="date"
                variant="standard"
                size="medium"
                sx={{ width: '50%' }}
                value={filter.startDate}
                onChange={handleInputChange}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                id="finalDate"
                name="finalDate"
                label="Final"
                type="date"
                variant="standard"
                size="medium"
                sx={{ width: '50%' }}
                value={filter.finalDate}
                onChange={handleInputChange}
                slotProps={{
                  htmlInput: {
                    max: new Date().toISOString().split('T')[0],
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>
            <Divider className="my-2" />
          </div>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Atividades Filtradas
          </Typography>
          {filteredActivities && filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Box key={activity.id} mb={2}>
                <Typography variant="subtitle2">
                  {activity.Subject?.name ?? 'Sem matéria'} -{' '}
                  {activity.Topic?.name ?? 'Sem tópico'}
                </Typography>
                <Typography variant="body2">
                  Data: {new Date(activity.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Estudo:{' '}
                  {activity.studyTime
                    ? (activity.studyTime / 3600).toFixed(1)
                    : '0'}{' '}
                  hrs
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhuma atividade encontrada com os filtros aplicados.
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  )
}
