import { useState, FormEvent } from 'react'
import { ColorResult } from 'react-color'
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Stack,
  Modal,
} from '@mui/material'
import { ColorPicker } from '../ColorPicker'
import useAppStore from '@/app/store'
import api from '@/utils/api'
import { useSession } from 'next-auth/react'
import CreateTopic from '@/components/activities-main/Topic/CreateTopic'

interface Subject {
  id?: string
  name: string
  description: string
  timeSpent?: number
  color: string
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function EditSubject({
  id,
  name,
  description,
  timeSpent,
  color,
}: Subject) {
  const [subject, setSubject] = useState<Subject>({
    name: name ?? '',
    description: description ?? '',
    timeSpent: timeSpent ?? 0,
    color: color ?? '#fff',
  })

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  })
  const [open, setOpen] = useState(false)
  const { subjects, setValue, setSubjects, user, setUser } = useAppStore()
  const { data: session } = useSession()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorChange = (color: ColorResult) => {
    setSubject((prev) => ({
      ...prev,
      color: color.hex,
    }))
  }

  const validateForm = (): boolean => {
    let valid = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {}

    if (!subject.name) {
      newErrors.name = 'O nome é obrigatório.'
      valid = false
    } else if (subject.name.length < 4) {
      newErrors.name = 'O nome deve ter pelo menos 4 caracteres.'
      valid = false
    } else if (subject.name.length > 35) {
      newErrors.name = 'O nome pode ter no máximo 35 caracteres.'
      valid = false
    }

    if (subject.description.length > 255) {
      newErrors.description = 'A descrição pode ter no máximo 255 caracteres.'
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

    try {
      const response = await api.patch(`subjects/${id}`, subject, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      const newSubjects = subjects.map((s) => (s.id === id ? response.data : s))
      setSubjects(newSubjects)
      if (user) {
        const newUser = {
          ...user,
          Subjects: newSubjects,
        }
        setUser(newUser)
      }
      setValue(0)
    } catch (error) {
      console.error('Erro de rede:', error)
    }
  }

  const handleDelete = async () => {
    if (!id) {
      alert('Matéria não encontrada')
      return null
    }
    try {
      await api.delete(`subjects/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      const newSubjects = subjects.filter((s) => s.id !== id)
      setSubjects(newSubjects)
      if (user) {
        const newUser = {
          ...user,
          Subjects: newSubjects,
        }
        setUser(newUser)
      }
      setValue(0)
    } catch (error) {
      console.error('Erro de rede:', error)
    }
  }

  const handleDeleteTopic = async (topicId: string | undefined) => {
    if (!topicId) {
      alert('Matéria não encontrada')
      return null
    }
    try {
      await api.delete(`subjects/${id}/topics/${topicId}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      const newSubjects = subjects.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            Topics: s.Topics?.filter((t) => t.id !== topicId),
          }
        }
        return s
      })
      setSubjects(newSubjects)
      if (user) {
        const newUser = {
          ...user,
          Subjects: newSubjects,
        }
        setUser(newUser)
      }
    } catch (error) {
      console.error('Erro de rede:', error)
    }
  }

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
        Criar Matéria
      </Typography>

      <TextField
        id="name"
        name="name"
        label="Nome da Matéria"
        value={subject.name}
        onChange={handleChange}
        variant="standard"
        size="medium"
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextField
        id="description"
        name="description"
        label="Descrição"
        value={subject.description}
        onChange={handleChange}
        variant="standard"
        size="medium"
        error={!!errors.description}
        helperText={errors.description}
      />

      <Box className="flex items-center gap-3">
        <Typography variant="body1">Cor</Typography>
        <ColorPicker color={subject.color} onChange={handleColorChange} />
      </Box>

      <Box className="mt-3 flex items-start justify-between">
        <Typography variant="h6" component="h3">
          Tópicos
        </Typography>
        {subjects ? (
          <Stack spacing={1}>
            {subjects
              .find((subject) => subject.id === id)
              ?.Topics?.map((topic, index) => (
                <Box
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <Typography variant="body1">{topic.name}</Typography>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ px: 2 }}
                    onClick={() => handleDeleteTopic(topic.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              ))}
          </Stack>
        ) : null}
        <Button
          onClick={handleOpen}
          variant="contained"
          color="primary"
          sx={{ px: 2 }}
        >
          Criar Tópico
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CreateTopic subjectId={id} handleClose={handleClose} />
          </Box>
        </Modal>
      </Box>

      <Divider className="my-2" />
      <Box className="flex items-center justify-between">
        <Button
          variant="contained"
          color="error"
          sx={{ px: 2 }}
          onClick={() => handleDelete()}
        >
          Excluir
        </Button>
        <Box className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
          <Button
            variant="text"
            color="secondary"
            sx={{ px: 2 }}
            onClick={() => setValue(0)}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
