import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material'
import './index.css'
import App from './App.jsx'

function Root() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDark ? 'dark' : 'light',
          primary: {
            main: '#00599C',
          },
        },
        typography: {
          fontFamily: '"Google Sans", sans-serif',
        },
      }),
    [prefersDark],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
