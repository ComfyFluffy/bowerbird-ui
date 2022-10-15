import { Box } from '@mui/material'
import { GridView } from '../../components/GridView'
import { useToolbarType } from '../../utils/hooks'

export const PixivPage = () => {
  useToolbarType('zoom')
  return (
    <Box sx={{ pt: 8 }}>
      <GridView />
    </Box>
  )
}
