import { useState, MouseEvent } from 'react'
import { SketchPicker, ColorResult } from 'react-color'
import { Box, Button, Popover } from '@mui/material'

export const ColorPicker = ({
  color,
  onChange,
}: {
  color: string
  onChange: (color: ColorResult) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        variant="text"
        onClick={handleOpen}
        sx={{
          backgroundColor: color,
          color: color === '#fff' ? '#000 !important' : '#fff !important',
          border: color === '#fff' ? '1px solid #000' : '1px solid #fff',
          '&:hover': {
            backgroundColor: color,
            opacity: 0.9,
          },
          padding: '0.5rem 1rem',
        }}
      >
        Escolher Cor
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <SketchPicker color={color} onChangeComplete={onChange} />
      </Popover>
    </Box>
  )
}
