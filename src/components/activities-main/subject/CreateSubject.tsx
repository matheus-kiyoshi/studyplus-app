import { useState, FormEvent } from 'react'
import { ColorResult } from 'react-color'
import { TextField, Button, Box, Typography, Divider } from '@mui/material'
import { ColorPicker } from '../ColorPicker'
import useAppStore from '@/app/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import axios from 'axios'

interface Subject {
  name: string
  description: string
  color: string
}

export default function CreateSubject() {
  const [subject, setSubject] = useState<Subject>({
    name: '',
    description: '',
    color: '#fff',
  })
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  })
  const { subjects, setValue, setSubjects } = useAppStore()
  const { data: session } = useSession()
  const router = useRouter()

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
    if (!session) {
      router.push('/sign-in')
      return
    }

    try {
      const response = await api.post('/subjects', subject, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      setSubjects([...subjects, response.data])
      setValue(0)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro:', error.response.data)
        if (error.response.data.statusCode === 401) {
          router.push('/sign-in')
        } else if (error.response.data.statusCode === 400) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newErrors: any = {}
          newErrors.name = 'A matéria já existe.'
          setErrors(newErrors)
          console.log('Matéria já existe')
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
      <Divider className="my-2" />
      <Box className="flex gap-4">
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
        <Button
          variant="text"
          color="error"
          sx={{ px: 2 }}
          onClick={() => setValue(0)}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
