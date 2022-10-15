import {
  AppBar,
  Avatar,
  Box,
  Collapse,
  Drawer,
  DrawerProps,
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
import { ReactNode, useEffect, useState } from 'react'
import { Stack } from '@mui/system'
import { useCollectionStore, useUiStore, useZoomStore } from '../utils/store'
import shallow from 'zustand/shallow'
import CollectionsIcon from '@mui/icons-material/Collections'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
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
      {Object.keys(collections).map((c) => (
        <ListItem key={c} disablePadding>
          <ListItemButton
            selected={c === currentCollection}
            onClick={() => setCurrentCollection(c)}
          >
            <ListItemText
              primary={c}
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
            color='primary'
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

const Bar = ({
  showDrawerSwitch,
  onDrawerSwitchClick,
}: {
  showDrawerSwitch: boolean
  onDrawerSwitchClick: () => void
}) => {
  const onTop = useOnTop(() => window)
  const theme = useTheme()

  const [zoomLevel, zoomIn, zoomOut] = useZoomStore(
    (state) => [state.zoomLevel, state.zoomIn, state.zoomOut],
    shallow
  )

  const toolbarType = useUiStore((state) => state.toolbarType)

  return (
    <ThemeProvider theme={onTop ? theme : darkTheme}>
      <AppBar
        position='fixed'
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
          <Fade in={showDrawerSwitch}>
            <IconButton edge='start' onClick={onDrawerSwitchClick}>
              <MenuIcon />
            </IconButton>
          </Fade>

          <Box sx={{ flexGrow: 1 }} />
          {toolbarType === 'gridViewer' && (
            <>
              <IconButton onClick={zoomIn} disabled={zoomLevel <= -1}>
                <ZoomInIcon />
              </IconButton>
              <IconButton onClick={zoomOut} disabled={zoomLevel >= 3}>
                <ZoomOutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

const DrawerNav = ({
  open,
  setOpen,
  variant,
}: {
  open: boolean
  setOpen: (value: boolean) => void
} & Pick<DrawerProps, 'variant'>) => {
  const [currentCollection, setCurrentCollection] = useCollectionStore(
    (state) => [state.current, state.setCurrent]
  )

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
      variant={variant}
      anchor='left'
    >
      <Toolbar>
        <IconButton onClick={() => setOpen(!open)} edge='start'>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List dense>
        <Stack spacing={2}>
          <ListItem disablePadding>
            <ListItemButton>
              <Stack
                spacing={2}
                direction='row'
                alignItems='center'
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              >
                <Avatar>You</Avatar>
                <Typography>You</Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
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
    </Drawer>
  )
}

export const Layout = () => {
  const theme = useTheme()
  const upLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [drawerOpen, setDrawerOpen] = useState(upLg)

  useEffect(() => {
    setDrawerOpen(upLg)
  }, [upLg])

  return (
    <Stack direction='row'>
      <DrawerNav
        open={drawerOpen}
        setOpen={setDrawerOpen}
        variant={upLg ? 'persistent' : 'temporary'}
      />
      <Main open={upLg ? drawerOpen : true}>
        <Bar
          onDrawerSwitchClick={() => setDrawerOpen(!drawerOpen)}
          showDrawerSwitch={!drawerOpen}
        />
        <Outlet />
      </Main>
    </Stack>
  )
}
