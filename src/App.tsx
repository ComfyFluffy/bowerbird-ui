import { ThemeProvider } from '@emotion/react'
import { CssBaseline, useMediaQuery } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FindPixivIllust } from './pages/FindPixivIllust'
import { Layout } from './pages/Layout'
import { NotFound } from './pages/NotFound'
import { User as User } from './pages/pixiv/User'

import { darkTheme, lightTheme } from './theme'

const App = () => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<FindPixivIllust />} />
            {/* <Route path="pixiv" element={<FindPixivIllust />} /> */}
            <Route path="user/:id" element={<User />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
