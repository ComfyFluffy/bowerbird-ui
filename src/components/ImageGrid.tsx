import { Box, Dialog, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { PixivIllust } from '../model/pixiv'
import { Img } from './styledEl'
import { ImageViewer } from './ImageViewer'

export const srcByUrl = (url: string, size?: number, crop_to_center = true) => {
  const params: any = {
    url,
  }
  if (size !== undefined) {
    params.size = size.toString()
    params.crop_to_center = crop_to_center
  }

  return `/api/v1/pixiv/media-by-url?${new URLSearchParams(params)}`
}

export const ImgGrid = ({ illusts }: { illusts: PixivIllust[] }) => {
  const [showViewer, setShowViewer] = useState(false)
  const [viewerIllust, setViewerIllust] = useState<PixivIllust>()

  const handleImageClick = (illust: PixivIllust) => {
    setViewerIllust(illust)
    setShowViewer(true)
  }
  const handleViewerClose = () => setShowViewer(false)

  return (
    <>
      <Dialog
        open={showViewer}
        onClose={handleViewerClose}
        maxWidth="lg"
        fullScreen
      >
        {viewerIllust && (
          <ImageViewer illust={viewerIllust} onClose={handleViewerClose} />
        )}
      </Dialog>
      <Grid
        container
        columns={{ xl: 12, sm: 6, xs: 4, md: 8, lg: 10 }}
        sx={{ userSelect: 'none' }}
      >
        {illusts.map((c, i) => {
          const h = c.history[c.history.length - 1]
          const pages = h.extension.image_urls.length
          return (
            <Grid item xs={2} key={i}>
              <Box
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  height: 1,
                  p: { xs: 0.5, sm: 1 },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {pages > 1 && (
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
                        borderRadius:
                          t.shape.borderRadius === 0 ? undefined : '25%',
                      })}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ lineHeight: 'unset' }}
                      >
                        {pages}
                      </Typography>
                    </Box>
                  )}
                  <Img
                    src={srcByUrl(h.extension.image_urls[0], 512)}
                    title={h.extension.title}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleImageClick(c)}
                  />
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
