import { CircularProgress, Container } from '@mui/material'
import { EJSON, ObjectId } from 'bson'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PixivUser } from '../../model/pixiv'
import { usePost } from '../../utils/network'

export interface Params {
  id: string
}

export const User = () => {
  const { id } = useParams()

  const oid = useMemo(() => {
    try {
      return new ObjectId(id)
    } catch (error) {
      return new ObjectId(0)
    }
  }, [id])

  const { data, error } = usePost<PixivUser[]>(
    id !== undefined ? `/api/v1/pixiv/find/user` : null,
    {
      ids: [oid],
    }
  )

  const render = () => {
    if (!id) {
      return 'User id should be given'
    }
    if (error) {
      return error
    }
    if (data && !data[0]) {
      return 'User not found'
    }
    if (!data) {
      return <CircularProgress />
    }

    return EJSON.stringify(data)
  }

  return <Container>{render()}</Container>
}
