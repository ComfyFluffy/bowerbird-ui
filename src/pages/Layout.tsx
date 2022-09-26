import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  Fade,
  IconButton,
  List as MuiList,
  ListItem,
  ListItemButton,
  listItemButtonClasses,
  listItemClasses,
  ListItemIcon,
  listItemIconClasses,
  ListItemText,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { ReactNode, useState } from 'react'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { Stack } from '@mui/system'
import { useCollectionStore, useZoomStore } from '../utils/store'
import shallow from 'zustand/shallow'
import CollectionsIcon from '@mui/icons-material/Collections'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import { darkTheme } from '../theme'
import { useOnTop } from '../utils/hooks'

const drawerWidth = 34 * 8

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  paddingBottom: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const List = styled(MuiList)(({ theme }) => ({
  paddingLeft: '4px',
  paddingRight: '4px',
  [`& .${listItemClasses.root}`]: {
    paddingTop: '2px',
    paddingBottom: '2px',
  },
  [`& .${listItemButtonClasses.root}`]: {
    borderRadius: theme.shape.borderRadius,
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: '36px',
    color: theme.palette.primary.main,
  },
}))

const CollectionList = () => {
  const [collections, currentCollection, setCurrentCollection] =
    useCollectionStore(
      (state) => [state.collections, state.current, state.setCurrent],
      shallow
    )

  return (
    <>
      {collections.map((c) => (
        <ListItem key={c.id} disablePadding>
          <ListItemButton
            selected={c.id === currentCollection}
            onClick={() => setCurrentCollection(c.id)}
          >
            <ListItemText
              primary={c.name}
              sx={{
                ml: 5,
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  )
}

const CollaspeListItems = ({
  others,
  icon,
}: {
  others: ReactNode
  icon: ReactNode
}) => {
  const [open, setOpen] = useState(true)

  return (
    <Box>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              COLLECTIONS
            </Typography>
          </ListItemText>
          <KeyboardArrowRightIcon
            color="primary"
            sx={{
              pb: '2px',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={open}>{others}</Collapse>
    </Box>
  )
}

export const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSwitchDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const theme = useTheme()
  const upLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [zoomLevel, zoomIn, zoomOut] = useZoomStore(
    (state) => [state.zoomLevel, state.zoomIn, state.zoomOut],
    shallow
  )

  const [currentCollection, setCurrentCollection] = useCollectionStore(
    (state) => [state.current, state.setCurrent]
  )
  const onTop = useOnTop(() => window)
  const appBar = (
    <ThemeProvider theme={onTop ? theme : darkTheme}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 'none',
          pointerEvents: 'none',
          pb: 1,
          background: onTop
            ? 'transparent'
            : 'linear-gradient(rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0) 100%)',
          '& *': {
            transition: 'color 50ms',
          },
        }}
      >
        <Toolbar
          sx={{
            '& > button': {
              pointerEvents: 'auto',
            },
          }}
        >
          <Fade in={!drawerOpen}>
            <IconButton edge="start" onClick={handleSwitchDrawer}>
              <MenuIcon />
            </IconButton>
          </Fade>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={zoomIn} disabled={zoomLevel <= -1}>
            <ZoomInIcon />
          </IconButton>
          <IconButton onClick={zoomOut} disabled={zoomLevel >= 3}>
            <ZoomOutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )

  const drawer = (
    <Box>
      <Toolbar>
        <IconButton onClick={handleSwitchDrawer} edge="start">
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List dense>
        <Stack spacing={2}>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentCollection === null}
              onClick={() => setCurrentCollection(null)}
            >
              <ListItemIcon>
                <CollectionsIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  ALL
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <CollaspeListItems
            others={<CollectionList />}
            icon={<CollectionsBookmarkIcon />}
          />
        </Stack>
      </List>
    </Box>
  )

  return (
    <Stack direction="row">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant={upLg ? 'persistent' : 'temporary'}
        anchor="left"
      >
        {drawer}
      </Drawer>

      <Main open={upLg ? drawerOpen : true}>
        {appBar}

        <Outlet />
      </Main>
    </Stack>
  )
}
