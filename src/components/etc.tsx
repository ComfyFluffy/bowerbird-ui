import { DialogProps, Paper, styled } from '@mui/material'

export const Img = styled('img')((t) => ({
  borderRadius: t.theme.shape.borderRadius,
  color: 'inherit',
}))
export const A = styled('a')({ color: 'inherit' })

export const DialogPaper: DialogProps['PaperComponent'] = (props) => (
  <Paper {...props} elevation={3} />
)
