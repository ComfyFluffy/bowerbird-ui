import { ThemeProvider } from '@emotion/react'
import { Button, createTheme, CssBaseline } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Button variant="contained">WWW</Button>
    </ThemeProvider>
  )
}

export default App
