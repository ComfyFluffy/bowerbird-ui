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
import { srcByPath } from './ImageGrid'
import { A, Img } from '../styledEl'
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
      <IconButton title="Add to Collection..." onClick={openMenu}>
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
            label="Name"
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

export const ImageViewer = ({
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
        original: srcByPath(v),
        large: srcByPath(v, 1536, false),
        small: srcByPath(v, 512),
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
              <AddToCollection illust={illust} />
              <IconButton onClick={onClose} title="Close">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
          {illust.history.extension.title && (
            <Typography
              variant="h5"
              sx={(t) => ({
                color: t.palette.text.primary,
              })}
            >
              {illust.history.extension.title}
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
        <Stack spacing={2} alignItems="center">
          {images.map((i) => (
            <A
              href={i.original}
              target="_blank"
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
                title="Click to view original image"
              />
            </A>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
