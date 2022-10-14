import { Box, Typography } from '@mui/material'

export const NotFound = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '93vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h1'>404</Typography>
      <Typography variant='h2'>Not Found</Typography>
    </Box>
  )
}
