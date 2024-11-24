import { useState, FormEvent } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material'
import useAppStore from '@/app/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import axios from 'axios'

interface Activity {
  startDate: string
  studyTime: number
  questionsDone?: number
  questionsCorrect?: number
  createReview?: boolean
  subjectId?: string
  topicId?: string
}

export default function CreateActivity() {
  const [activity, setActivity] = useState<Activity>({
    startDate: new Date().toISOString().split('T')[0],
    studyTime: 0,
    questionsDone: 0,
    questionsCorrect: 0,
    createReview: false,
    subjectId: '',
    topicId: '',
  })

  const [errors, setErrors] = useState<{ subjectId: string; topicId: string }>({
    subjectId: '',
    topicId: '',
  })

  const { subjects, setSubjects } = useAppStore()
  const { data: session } = useSession()
  const router = useRouter()
  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    let valid = true
    const newErrors: { subjectId: string; topicId: string } = {
      subjectId: '',
      topicId: '',
    }

    if (!activity.subjectId) {
      newErrors.subjectId = 'Selecione uma matéria.'
      valid = false
    }

    if (!activity.topicId) {
      newErrors.topicId = 'Selecione um tópico.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }
    if (!session) {
      router.push('/sign-in')
      return
    }

    try {
      const payload = {
        startDate: activity.startDate,
        studyTime: activity.studyTime,
      }
      const response = await api.post(
        `subjects/${activity.subjectId}/topics/${activity.topicId}/activities`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        },
      )
      const newActivity = response.data
      await api.patch(
        `subjects/${activity.subjectId}/topics/${activity.topicId}`,
        {
          timeSpent:
            newActivity.studyTime +
            subjects
              .find((subject) => subject.id === activity.subjectId)
              ?.Topics.find((topic) => topic.id === activity.topicId)
              ?.timeSpent,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        },
      )
      await api.patch(
        `subjects/${activity.subjectId}`,
        {
          timeSpent:
            newActivity.studyTime +
            subjects.find((subject) => subject.id === activity.subjectId)
              ?.timeSpent,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        },
      )
      const newSubjects = subjects.map((subject) => {
        if (subject.id === activity.subjectId) {
          const newTopics = subject.Topics.map((topic) => {
            if (topic.id === activity.topicId) {
              return {
                ...topic,
                timeSpent: newActivity.studyTime + topic.timeSpent,
              }
            }
            return topic
          })
          return { ...subject, Topics: newTopics }
        }
        return subject
      })
      setSubjects(newSubjects)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro:', error.response.data)
        if (error.response.data.statusCode === 401) {
          router.push('/sign-in')
        } else {
          alert('Servidor Indisponível')
        }
      } else {
        console.error('Erro desconhecido:', error)
      }
    }
  }

  const topics =
    subjects.find((subject) => subject.id === activity.subjectId)?.Topics || []

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '100%', lg: '80%' },
        gap: 2,
        p: 2,
        margin: { xs: '0 auto', lg: '0' },
      }}
    >
      <Typography variant="h5" component="h2">
        Criar Atividade
      </Typography>

      <TextField
        id="startDate"
        name="startDate"
        label="Data de Início"
        type="date"
        value={activity.startDate}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
        size="medium"
      />

      <FormControl fullWidth error={!!errors.subjectId}>
        <InputLabel id="subject-select-label">Matéria</InputLabel>
        <Select
          id="subjectId"
          name="subjectId"
          value={activity.subjectId}
          onChange={handleSelectChange}
          label="Matéria"
          labelId="subject-select-label"
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
        <Typography color="error" variant="caption">
          {errors.subjectId}
        </Typography>
      </FormControl>

      <FormControl
        fullWidth
        error={!!errors.topicId}
        disabled={!activity.subjectId}
      >
        <InputLabel id="topic-select-label">Tópico</InputLabel>
        <Select
          id="topicId"
          name="topicId"
          value={activity.topicId}
          onChange={handleSelectChange}
          label="Tópico"
          labelId="topic-select-label"
        >
          {topics.map((topic) => (
            <MenuItem key={topic.id} value={topic.id}>
              {topic.name}
            </MenuItem>
          ))}
        </Select>
        <Typography color="error" variant="caption">
          {errors.topicId}
        </Typography>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          id="studyTimeHours"
          name="studyTimeHours"
          label="Horas"
          type="number"
          value={Math.floor(activity.studyTime / 3600)}
          onChange={(e) => {
            const hours = parseInt(e.target.value || '0', 10)
            setActivity((prev) => ({
              ...prev,
              studyTime: hours * 3600 + (prev.studyTime % 3600),
            }))
          }}
          variant="standard"
          size="medium"
          sx={{ flex: 1 }}
        />
        <TextField
          id="studyTimeMinutes"
          name="studyTimeMinutes"
          label="Minutos"
          type="number"
          value={Math.floor((activity.studyTime % 3600) / 60)}
          onChange={(e) => {
            const minutes = parseInt(e.target.value || '0', 10)
            setActivity((prev) => ({
              ...prev,
              studyTime:
                Math.floor(prev.studyTime / 3600) * 3600 +
                minutes * 60 +
                (prev.studyTime % 60),
            }))
          }}
          variant="standard"
          size="medium"
          sx={{ flex: 1 }}
        />
        <TextField
          id="studyTimeSeconds"
          name="studyTimeSeconds"
          label="Segundos"
          type="number"
          value={activity.studyTime % 60}
          onChange={(e) => {
            const seconds = parseInt(e.target.value || '0', 10)
            setActivity((prev) => ({
              ...prev,
              studyTime:
                Math.floor(prev.studyTime / 3600) * 3600 +
                Math.floor((prev.studyTime % 3600) / 60) * 60 +
                seconds,
            }))
          }}
          variant="standard"
          size="medium"
          sx={{ flex: 1 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          id="questionsDone"
          name="questionsDone"
          label="Questões Feitas"
          type="number"
          value={activity.questionsDone}
          onChange={handleInputChange}
          variant="standard"
          size="medium"
          sx={{ flex: 1 }}
        />
        <TextField
          id="questionsCorrect"
          name="questionsCorrect"
          label="Questões Acertadas"
          type="number"
          value={activity.questionsCorrect}
          onChange={handleInputChange}
          variant="standard"
          size="medium"
          sx={{ flex: 1 }}
        />
      </Box>

      <Divider className="my-2" />
      <Box className="flex gap-4">
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
        <Button
          variant="text"
          color="error"
          sx={{ px: 2 }}
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
