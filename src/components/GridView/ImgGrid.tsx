import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material'

import { useZoomStore } from '../../utils/store'
import { Img } from '../etc'

const Count = ({ count }: { count: number }) =>
  count > 1 ? (
    <Box
      sx={(t) => ({
        position: 'absolute',
        left: { xs: 4, sm: 8 },
        top: { xs: 4, sm: 8 },
        bgcolor: 'rgba(0,0,0,0.5)',
        color: 'white',
        backdropFilter: 'blur(2px)',
        width: '1.5em',
        height: '1.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.shape.borderRadius === 0 ? undefined : '25%',
      })}
    >
      <Typography
        component='span'
        variant='caption'
        sx={{ lineHeight: 'unset' }}
      >
        {count}
      </Typography>
    </Box>
  ) : null

export interface ImgGridProps {
  items: {
    id: number
    count: number
    imgSrc: string
    title?: string
    onClick: () => void
  }[]
}

export const ImgGrid = ({ items }: ImgGridProps) => {
  const columns = useZoomStore((state) => state.zoomBreakpoints)

  return (
    <Grid container columns={columns} sx={{ userSelect: 'none', width: 1 }}>
      {items.map((item) => (
        <Grid xs={1} key={item.id}>
          <Box
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              height: 1,
              p: { xs: 0.5, sm: 1 },
            }}
          >
            <Box sx={{ position: 'relative' }} onClick={item.onClick}>
              <Count count={item.count} />
              <Img
                src={item.imgSrc}
                title={item.title}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
