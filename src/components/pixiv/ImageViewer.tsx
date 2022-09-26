import {
  Box,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Rating,
  Stack,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material'
import { srcByPath } from './ImageGrid'
import { A, Img } from '../styledEl'
import { PixivIllust } from '../../model/pixiv'
import { useMemo, useRef, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import CloseIcon from '@mui/icons-material/Close'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useRatingStore } from '../../utils/store'
import shallow from 'zustand/shallow'
import { darkTheme } from '../../theme'
import { useOnTop } from '../../utils/hooks'

export const ImageViewer = ({
  illust,
  onClose,
}: {
  illust: PixivIllust
  onClose: () => void
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchor)
  const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const [ratingById, setRating] = useRatingStore(
    (state) => [state.ratingById, state.setRating],
    shallow
  )
  const onMenuClose = () => {
    setMenuAnchor(null)
  }

  const h = illust.history

  const images =
    h.extension.image_paths?.map((v) => ({
      original: srcByPath(v),
      large: srcByPath(v, 1536, false),
      small: srcByPath(v, 512),
    })) || []

  const cleanCaptionHtml = useMemo(
    () => sanitizeHtml(h.extension.caption_html),
    [illust]
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const onTop = useOnTop(() => containerRef.current?.parentElement)

  // const { data: user } = usePost<PixivUser[]>('/api/v1/pixiv/find/user', {
  //   ids: [illust?.parent_id],
  //   limit: 1,
  // })
  // const userHistory = user && user[0].history

  const menu = (
    <Menu open={menuOpen} anchorEl={menuAnchor} onClose={onMenuClose}>
      <MenuItem onClick={onMenuClose}>
        <ListItemIcon>
          <LibraryAddIcon />
        </ListItemIcon>
        Add to Collection...
      </MenuItem>
    </Menu>
  )
  const theme = useTheme()

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: '0px !important',
        height: 1,
      }}
      ref={containerRef}
    >
      <ThemeProvider theme={onTop ? theme : darkTheme}>
        <Stack
          sx={{
            backgroundImage: onTop
              ? undefined
              : 'linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            pl: 2,
            pr: 2,
            pt: 0,
            pb: 5,
            '& *': {
              transition: 'color 50ms',
            },
            pointerEvents: 'none',
            '& span, button': {
              pointerEvents: 'auto',
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              height: 64,
              width: 1,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ width: 1 }}
            >
              <Rating
                value={ratingById[illust.id] || null}
                onChange={(_, v) => {
                  setRating(illust.id, v)
                }}
              />
              <Box sx={{ flex: 1 }} />
              <IconButton onClick={onMenuOpen}>
                <MoreHorizIcon />
              </IconButton>
              {menu}
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
          {h.extension.title && (
            <Typography
              variant="h5"
              sx={(t) => ({
                color: t.palette.text.primary,
              })}
            >
              {h.extension.title}
            </Typography>
          )}
        </Stack>
      </ThemeProvider>
      {/* <Stack spacing={2}>
        {userHistory && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={
                userHistory.extension.avatar_url &&
                srcByPath(userHistory.extension.avatar_url)
              }
            >
              {userHistory.extension.name[0]}
            </Avatar>
            <Typography>{userHistory.extension.name}</Typography>
          </Box>
        )}
      </Stack> */}
      <Stack spacing={2} sx={{ p: 2, pt: 0, mt: -2 }}>
        {cleanCaptionHtml && (
          <Typography
            variant="body2"
            sx={{
              '& a': {
                color: 'inherit',
              },
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: cleanCaptionHtml }} />
          </Typography>
        )}
        <Stack spacing={1} alignItems="center">
          {images.map((i) => (
            <A href={i.original} target="_blank" key={i.original}>
              <Img
                src={i.large}
                sx={{ maxHeight: '85vh', maxWidth: 1 }}
                title="Click to view original image"
              />
            </A>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
