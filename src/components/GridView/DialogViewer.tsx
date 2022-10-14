import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Rating,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material'
import { A, Img } from '../styled'
import { PixivIllust } from '../../model/pixiv'
import { MouseEvent, useMemo, useRef, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import CloseIcon from '@mui/icons-material/Close'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useCollectionStore, useRatingStore } from '../../utils/store'
import shallow from 'zustand/shallow'
import { darkTheme } from '../../theme'
import { useOnTop } from '../../utils/hooks'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import { srcByPath } from '../../utils/network'
import { UserLink } from '../User'
import { usePixivGeneralUser } from '../../utils/pixiv'
const AddToCollection = ({ illust }: { illust: PixivIllust }) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(menuAnchor)
  const [dialogOpen, setDialogOpen] = useState(false)
  const closeMenu = () => setMenuAnchor(null)
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const [collections, updateCollection] = useCollectionStore(
    (s) => [s.collections, s.updateCollection],
    shallow
  )

  const [newCollectionName, setNewCollectionName] = useState('')
  const [error, setError] = useState('')

  const collectionDuplicate = (name: string) => {
    if (
      Object.keys(collections)
        .map((k) => k.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      setError('Collection already exists')
      return true
    }
    setError('')
    return false
  }

  return (
    <>
      <IconButton title='Add to Collection...' onClick={openMenu}>
        <CollectionsBookmarkIcon />
      </IconButton>
      <Menu anchorEl={menuAnchor} open={menuOpen} onClose={closeMenu}>
        {Object.entries(collections).map(([name, ids]) => (
          <MenuItem
            key={name}
            onClick={() => {
              updateCollection(name, [...new Set([...ids, illust.id])])
              closeMenu()
            }}
          >
            {name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <ListItemIcon>
            <LibraryAddIcon />
          </ListItemIcon>
          New Collection...
        </MenuItem>
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!newCollectionName) {
            setDialogOpen(false)
          }
        }}
      >
        <DialogTitle>New Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label='Name'
            sx={{
              width: 8 * 32,
              maxWidth: '100%',
              mt: 1,
            }}
            value={newCollectionName}
            onChange={(e) => {
              collectionDuplicate(e.target.value)
              setNewCollectionName(e.target.value)
            }}
            error={!!error}
            helperText={error}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!newCollectionName) {
                setError('Collection name is required')
                return
              }
              if (collectionDuplicate(newCollectionName)) {
                return
              }
              updateCollection(newCollectionName, [illust.id])
            }}
          >
            Create and Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export const Viewer = ({
  illust,
  onClose,
}: {
  illust: PixivIllust
  onClose: () => void
}) => {
  const [ratingById, setRating] = useRatingStore(
    (state) => [state.ratingById, state.setRating],
    shallow
  )

  const images = useMemo(
    () =>
      illust.history.extension.image_paths?.map((v) => ({
        original: srcByPath('pixiv', v),
        large: srcByPath('pixiv', v, 1536, false),
      })) || [],
    [illust]
  )

  const cleanCaptionHtml = useMemo(
    () =>
      sanitizeHtml(illust.history.extension.caption_html, {
        allowedTags: ['p', 'br', 'a', 'b', 'i', 'u', 's', 'strong', 'em'],
      }),
    [illust]
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const onTop = useOnTop(() => containerRef.current?.parentElement)

  const theme = useTheme()

  const { data: user } = usePixivGeneralUser(illust.parent_id)

  return (
    <Container
      maxWidth='lg'
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
              : 'linear-gradient(rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0) 100%)',
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            p: 2,
            pt: 0,
            '& *': {
              transition: 'color 50ms',
            },
            pointerEvents: 'none',
            '& span, button': {
              pointerEvents: 'auto',
            },
            zIndex: 10,
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            sx={{
              height: 64,
              width: 1,
            }}
          >
            <Stack
              direction='row'
              alignItems='center'
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
              <AddToCollection illust={illust} />
              <IconButton onClick={onClose} title='Close'>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </ThemeProvider>
      <Box
        sx={{
          mt: '-16px',
        }}
      >
        <Stack spacing={2} sx={{ p: 2, pt: 0 }}>
          {user ? <UserLink user={user} tooltip /> : <UserLink.Skeleton />}
          {illust.history.extension.title && (
            <Typography
              variant='h5'
              sx={(t) => ({
                color: t.palette.text.primary,
              })}
            >
              {illust.history.extension.title}
            </Typography>
          )}
          {cleanCaptionHtml && (
            <Typography
              variant='body2'
              sx={{
                '& a': {
                  color: 'inherit',
                },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: cleanCaptionHtml }} />
            </Typography>
          )}
          {/* <Collapse in={commentsOpen}>{comments}</Collapse> */}

          <Stack spacing={2} alignItems='center'>
            {images.map((i) => (
              <A
                href={i.original}
                target='_blank'
                key={i.original}
                sx={{
                  display: 'flex',
                }}
              >
                <Img
                  src={i.large}
                  sx={{
                    maxWidth: 1,
                    maxHeight: '80vh',
                  }}
                  title='Click to view original image'
                />
              </A>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Container>
  )
}

export const DialogViewer = ({
  illust,
  onClose,
}: {
  illust: PixivIllust | null
  onClose: () => void
}) => {
  return (
    <Dialog open={illust !== null} onClose={onClose} maxWidth='lg'>
      {illust && <Viewer illust={illust} onClose={onClose} />}
    </Dialog>
  )
}
