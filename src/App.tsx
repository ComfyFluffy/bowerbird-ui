import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages'
import { Layout } from './pages/Layout'
import { NotFound } from './pages/NotFound'
import { UserPage } from './pages/pixiv/user'
import { PixivPage } from './pages/pixiv'

import { darkTheme, lightTheme } from './theme'

const App = () => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Index />} />
            <Route path='pixiv' element={<PixivPage />} />
            <Route path='pixiv/user/:id' element={<UserPage />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
