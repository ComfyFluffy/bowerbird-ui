import { createTheme, ThemeOptions } from '@mui/material'

const baseTheme: ThemeOptions = {
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
        thickness: 4,
      },
      styleOverrides: {
        root: {
          animationDuration: '550ms',
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ffe57f',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#42a5f5',
    },
    success: {
      main: '#66bb6a',
    },
    background: {
      default: '#000',
    },
  },
  ...baseTheme,
})
