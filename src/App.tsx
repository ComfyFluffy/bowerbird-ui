import { ThemeProvider } from '@emotion/react'
import { CssBaseline, useMediaQuery } from '@mui/material'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { FindPixivIllust } from './pages/FindPixivIllust'
import { NotFound } from './pages/NotFound'
import { Illust as UserIllust } from './pages/pixiv/user/Illust'

import { darkTheme, lightTheme } from './theme'

const Layout = () => {
  return <Outlet />
}

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
            <Route path="user" element={<UserIllust />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App
