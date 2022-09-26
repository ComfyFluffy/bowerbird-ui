import { Box, Dialog, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { PixivIllust } from '../../model/pixiv'
import { Img } from '../styledEl'
import { ImageViewer } from './ImageViewer'
import { useZoomStore } from '../../utils/store'

export const srcByPath = (
  path?: string | null,
  size?: number,
  crop_to_center = true
) =>
  size
    ? `/api/v2/pixiv/thumbnail/${path}?${new URLSearchParams({
        size: size.toString(),
        crop_to_center: crop_to_center.toString(),
      })}`
    : `/api/v2/pixiv/storage/${path}`

export const ImgGrid = ({ illusts }: { illusts: PixivIllust[] }) => {
  const [showViewer, setShowViewer] = useState(false)
  const [viewerIllust, setViewerIllust] = useState<PixivIllust>()

  const handleImageClick = (illust: PixivIllust) => {
    setViewerIllust(illust)
    setShowViewer(true)
  }
  const handleViewerClose = () => setShowViewer(false)

  const columns = useZoomStore((state) => state.zoomBreakpoints)

  return (
    <>
      <Dialog open={showViewer} onClose={handleViewerClose} maxWidth="lg">
        {viewerIllust && (
          <ImageViewer illust={viewerIllust} onClose={handleViewerClose} />
        )}
      </Dialog>
      <Grid container columns={columns} sx={{ userSelect: 'none', width: 1 }}>
        {illusts.map((c, i) => {
          const h = c.history
          const pages = h.extension.image_paths?.length ?? 0
          return (
            <Grid item xs={1} key={i}>
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
                    src={srcByPath(h.extension.image_paths?.at(0), 512)}
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
