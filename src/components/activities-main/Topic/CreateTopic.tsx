import { useState, FormEvent } from 'react'
import { TextField, Button, Box, Typography, Divider } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import axios from 'axios'
import useAppStore from '@/app/store'

interface Topic {
  name: string
  description: string
}

export default function CreateTopic({
  subjectId,
  handleClose,
}: {
  subjectId?: string
  handleClose: () => void
}) {
  const [topic, setTopic] = useState<Topic>({
    name: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  })
  const { subjects, setSubjects } = useAppStore()
  const { data: session } = useSession()
  const router = useRouter()

  console.log(subjects)

  const handleChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setTopic((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    let valid = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {}

    if (!topic.name) {
      newErrors.name = 'O nome é obrigatório.'
      valid = false
    } else if (topic.name.length < 4) {
      newErrors.name = 'O nome deve ter pelo menos 4 caracteres.'
      valid = false
    } else if (topic.name.length > 35) {
      newErrors.name = 'O nome pode ter no máximo 35 caracteres.'
      valid = false
    }

    if (!topic.description) {
      newErrors.description = 'A descrição é obrigatória.'
      valid = false
    } else if (topic.description.length > 255) {
      newErrors.description = 'A descrição pode ter no máximo 255 caracteres.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmitTopic = async (event: FormEvent) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }
    if (!session) {
      router.push('/sign-in')
      return
    }

    try {
      if (!subjectId) {
        console.error('ID da matéria não encontrado')
        return
      }
      const response = await api.post(`subjects/${subjectId}/topics`, topic, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      const newSubjects = subjects.map((s) => {
        if (s.id === subjectId) {
          return { ...s, Topics: [...s.Topics, response.data] }
        }
        return s
      })
      setSubjects(newSubjects)
      handleClose()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro:', error.response.data)
        if (error.response.data.statusCode === 401) {
          router.push('/sign-in')
        } else if (error.response.data.statusCode === 400) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newErrors: any = {}
          newErrors.name = 'O tópico já existe.'
          setErrors(newErrors)
          console.log('Tópico já existe')
        } else {
          alert('Servidor Indisponível')
        }
      } else {
        console.error('Erro desconhecido:', error)
      }
    }
  }

  return (
    <Box
      component="form"
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
        Criar Tópico
      </Typography>

      <TextField
        id="name"
        name="name"
        label="Nome do Tópico"
        value={topic.name}
        onChange={handleChangeTopic}
        variant="standard"
        size="medium"
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextField
        id="description"
        name="description"
        label="Descrição"
        value={topic.description}
        onChange={handleChangeTopic}
        variant="standard"
        size="medium"
        error={!!errors.description}
        helperText={errors.description}
      />
      <Divider className="my-2" />
      <Box className="flex gap-4">
        <Button onClick={handleSubmitTopic} variant="contained" color="primary">
          Salvar
        </Button>
        <Button
          variant="text"
          color="error"
          sx={{ px: 2 }}
          onClick={handleClose}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
