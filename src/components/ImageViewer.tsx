import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { srcByUrl } from './ImageGrid'
import { A, Img } from './styledEl'
import { PixivIllust, PixivUser } from '../model/pixiv'
import { useMemo } from 'react'
import sanitizeHtml from 'sanitize-html'
import { usePost } from '../utils/network'
export const ImageViewer = ({
  illust,
  onClose,
}: {
  illust: PixivIllust
  onClose: () => void
}) => {
  const h = illust.history[illust.history.length - 1]

  const images = h.extension.image_urls.map((v) => ({
    original: srcByUrl(v),
    large: srcByUrl(v, 1536, false),
    small: srcByUrl(v, 512),
  }))

  const clean_caption_html = useMemo(
    () => sanitizeHtml(h.extension.caption_html),
    [illust]
  )

  const { data: user } = usePost<PixivUser[]>('/api/v1/pixiv/find/user', {
    ids: [illust?.parent_id],
  })
  const userHistory = user && user[0].history[0]
  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pt: { xs: 9, sm: 10 } }}>
        <Stack sx={{ mb: 2 }} gap={2}>
          {userHistory && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={
                  userHistory.extension.avatar_url &&
                  srcByUrl(userHistory.extension.avatar_url)
                }
              >
                {userHistory.extension.name[0]}
              </Avatar>
              <Typography>{userHistory.extension.name}</Typography>
            </Box>
          )}
          {h.extension.title && (
            <Typography variant="h5">{h.extension.title}</Typography>
          )}
          {clean_caption_html && (
            <Typography
              variant="body2"
              sx={{
                '& a': {
                  color: 'inherit',
                },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: clean_caption_html }} />
            </Typography>
          )}
        </Stack>
        {images.map((i) => (
          <Box sx={{ textAlign: 'center' }}>
            <A href={i.original} target="_blank" key={i.original}>
              <Img
                src={i.large}
                sx={{ maxHeight: '85vh', maxWidth: 1 }}
                title="Click to view original image"
              />
            </A>
          </Box>
        ))}
      </Container>
    </>
  )
}
