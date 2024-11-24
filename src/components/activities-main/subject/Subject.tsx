import { Button } from '@mui/material'
import useAppStore from '@/app/store'
import { IoSettingsSharp } from 'react-icons/io5'
import { TiStopwatch } from 'react-icons/ti'

interface SubjectProps {
  id: string
  color: string
  name: string
  description: string
  timeSpent: number
}

export default function Subject({
  id,
  color,
  name,
  description,
  timeSpent,
}: SubjectProps) {
  const { setSelectedSubject, setValue } = useAppStore()
  const hours = Math.floor(timeSpent / 3600)
  const minutes = Math.floor((timeSpent % 3600) / 60)

  return (
    <Button
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      onClick={() => {
        setSelectedSubject({ id, name, description, timeSpent, color })
        setValue(2)
      }}
    >
      <div className="flex items-center justify-center gap-1">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <h2 className="text-lg font-medium">{name}</h2>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center justify-between gap-1">
          <TiStopwatch className="h-4 w-4 text-black" />
          <p className="text-base">
            {hours}h {minutes}m
          </p>
        </div>
        <IoSettingsSharp
          title="Editar matéria"
          className="h-6 w-6 hover:text-black"
        />
      </div>
    </Button>
  )
}
