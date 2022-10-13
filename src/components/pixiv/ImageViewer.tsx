import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Skeleton,
  Stack,
  styled,
  TextField,
  ThemeProvider,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from '@mui/material'
import { A, Img } from '../styledEl'
import { PixivIllust, PixivUser } from '../../model/pixiv'
import { MouseEvent, ReactElement, useMemo, useRef, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import CloseIcon from '@mui/icons-material/Close'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useCollectionStore, useRatingStore } from '../../utils/store'
import shallow from 'zustand/shallow'
import { darkTheme } from '../../theme'
import { useOnTop } from '../../utils/hooks'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import { srcByPath, usePost } from '../../utils/network'
import { Link as RouterLink } from 'react-router-dom'
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

const UserCard = ({ user }: { user: PixivUser }) => {
  const { data } = usePost<{ items: PixivIllust[] }>(
    '/api/v2/pixiv/illust/find',
    {
      parent_ids: [user.id],
      limit: 3,
      offset: 0,
    }
  )
  const illusts = data?.items

  return (
    <Stack spacing={1} component={Paper} elevation={12} sx={{ p: 1 }}>
      <UserLink user={user} followButton disableTooltip />
      <Stack
        direction="row"
        sx={{
          width: 1,
        }}
        spacing={0.5}
        justifyContent="center"
      >
        {illusts
          ? illusts.map((illust) => (
              <Box
                key={illust.id}
                sx={{
                  height: 8 * 12,
                  width: 8 * 12,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `url(${srcByPath(
                    illust.history.extension.image_paths?.[0],
                    200
                  )})`,
                  borderRadius: 1,
                }}
              />
            ))
          : [...Array(3).keys()].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={8 * 12}
                width={8 * 12}
              />
            ))}
      </Stack>
    </Stack>
  )
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: 0,
  },
}))

const UserLink = ({
  user,
  followButton,
  disableTooltip,
}: {
  user?: PixivUser
  followButton?: boolean
  disableTooltip?: boolean
}) => {
  if (!user) {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={100} />
      </Stack>
    )
  }

  const to = `/pixiv/user/${user.id}`

  const tooltip = (children: ReactElement) => (
    <StyledTooltip title={<UserCard user={user} />}>{children}</StyledTooltip>
  )

  const avatar = (
    <Avatar
      src={
        user.history.extension.avatar_path &&
        srcByPath(user.history.extension.avatar_path)
      }
      sx={{
        textDecoration: 'none',
      }}
      component={RouterLink}
      to={to}
    >
      {user.history.extension.name[0]}
    </Avatar>
  )
  const name = (
    <Link
      underline="hover"
      color="inherit"
      sx={{
        fontWeight: 600,
      }}
      component={RouterLink}
      to={to}
    >
      {user.history.extension.name}
    </Link>
  )
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{
          flex: followButton ? 1 : undefined,
        }}
      >
        {disableTooltip ? (
          <>
            {avatar}
            {name}
          </>
        ) : (
          <>
            {tooltip(avatar)}
            {tooltip(name)}
          </>
        )}
      </Stack>
      {followButton && (
        <Button
          size="small"
          variant={user.extension?.is_followed ? 'outlined' : 'contained'}
        >
          {user.extension?.is_followed ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </Stack>
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

  const { data: userData } = usePost<PixivUser[]>('/api/v2/pixiv/user/find', {
    ids: [illust.parent_id],
    offset: 0,
    limit: 50,
  })
  const user = userData?.[0]

  // const [commentsOpen, setCommentsOpen] = useState(true)

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
        </Stack>
      </ThemeProvider>
      <Box
        sx={{
          mt: '-16px',
        }}
      >
        <Stack spacing={2} sx={{ p: 2, pt: 0 }}>
          <UserLink user={user} />
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
          {cleanCaptionHtml && (
            <Typography
              variant="body2"
              sx={{
                '& a': {
                  color: 'inherit',
                },
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: cleanCaptionHtml }} />
            </Typography>
          )}
          {/* <Collapse in={commentsOpen}>{comments}</Collapse> */}

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
      </Box>
    </Container>
  )
}
