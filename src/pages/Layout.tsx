import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <>
      <Box sx={{ height: 16 }} />
      <Outlet />
    </>
  )
}
