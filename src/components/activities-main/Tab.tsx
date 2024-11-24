'use client'
import { useState, SyntheticEvent, ReactNode } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import SubjectsMain from './subject/Main'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs() {
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Atividades">
          <Tab label="Calendário" {...a11yProps(0)} />
          <Tab label="Histórico" {...a11yProps(1)} />
          <Tab label="Matérias" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ backgroundColor: '#0000000f' }} className="rounded-b-md p-2">
          <Button variant="contained">Criar Atividade</Button>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ backgroundColor: '#0000000f' }} className="rounded-b-md p-2">
          <Button variant="contained">Criar Atividade</Button>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SubjectsMain />
      </CustomTabPanel>
    </Box>
  )
}
