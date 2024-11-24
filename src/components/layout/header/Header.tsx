'use client'
import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Sitemark from '../../SitemarkIcon'
import { useState } from 'react'
import ColorModeIconDropdown from '@/shared-theme/ColorModeIconDropdown'
import NextLink from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}))

export default function Header() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                href="/"
                component={NextLink}
                variant={pathname === '/' ? 'contained' : 'text'}
                color="primary"
                size="small"
              >
                Início
              </Button>
              <Button
                href="/activities"
                component={NextLink}
                variant={pathname === '/activities' ? 'contained' : 'text'}
                color="primary"
                size="small"
              >
                Atividades
              </Button>
              <Button
                href="/tracker"
                component={NextLink}
                variant={pathname === '/tracker' ? 'contained' : 'text'}
                color="primary"
                size="small"
              >
                Acompanhamento
              </Button>
              <Button
                href="/study-plans"
                component={NextLink}
                variant={pathname === '/study-plans' ? 'contained' : 'text'}
                color="primary"
                size="small"
              >
                Planejamentos
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {session ? (
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                color="primary"
                variant="contained"
                size="small"
              >
                Sair
              </Button>
            ) : (
              <>
                <Button
                  href="/sign-in"
                  component={NextLink}
                  color="primary"
                  variant="text"
                  size="small"
                >
                  Entrar
                </Button>
                <Button
                  href="/sign-up"
                  component={NextLink}
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Cadastrar
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton
              aria-label="Menu button"
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={() => toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={() => toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem href="/" component={NextLink}>
                  Início
                </MenuItem>
                <MenuItem href="/activities" component={NextLink}>
                  Atividades
                </MenuItem>
                <MenuItem href="/tracker" component={NextLink}>
                  Acompanhamento
                </MenuItem>
                <MenuItem href="/study-plans" component={NextLink}>
                  Planejamentos
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                {session ? (
                  <MenuItem>
                    <Button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      color="primary"
                      variant="contained"
                      fullWidth
                    >
                      Sair
                    </Button>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        href="/sign-up"
                        component={NextLink}
                        color="primary"
                        variant="contained"
                        fullWidth
                      >
                        Cadastrar
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        href="/sign-in"
                        component={NextLink}
                        color="primary"
                        variant="outlined"
                        fullWidth
                      >
                        Entrar
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  )
}
