import { CircularProgress, Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { PixivUser } from '../../../model/pixiv'
import { usePost } from '../../../utils/network'

export interface Params {
  id: string
}

export const User = () => {
  const { id } = useParams()

  const { data, error } = usePost<PixivUser[]>(
    id !== undefined ? `/api/v2/pixiv/find/user` : null,
    {
      ids: [id],
    }
  )

  const render = () => {
    if (!id) {
      return 'User id should be given'
    }
    if (error) {
      return error
    }
    if (!data) {
      return <CircularProgress />
    }
    if (!data[0]) {
      return 'User not found'
    }

    return JSON.stringify(data)
  }

  return <Container>{render()}</Container>
}
