import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { GridView } from '../../../components/GridView'
import { Img } from '../../../components/etc'
import { PixivUser } from '../../../model/pixiv'
import { useToolbarType } from '../../../utils/hooks'
import { srcByPath } from '../../../utils/network'
import { usePixivUserFind } from '../../../utils/pixiv'

const User = ({
  user: {
    history: {
      extension: { avatar_path, background_path, name, comment },
    },
  },
}: {
  user: PixivUser
}) => {
  return (
    <Stack>
      {background_path && (
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
          }}
        >
          <Img
            src={srcByPath('pixiv', background_path)}
            sx={{
              maxHeight: '40vh',
              width: 1,
              borderRadius: 0,
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: 8 * 15,
              background:
                'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </Box>
      )}
      <Container maxWidth='md'>
        <Stack spacing={2}>
          <Avatar
            src={srcByPath('pixiv', avatar_path)}
            sx={(t) => ({
              mt: background_path ? '-64px' : 8,
              width: 128,
              height: 128,
              border: `4px solid ${t.palette.background.paper}`,
            })}
          >
            {name[0]}
          </Avatar>
          <Stack spacing={3} direction='row' alignItems='center'>
            <Typography variant='h5'>{name}</Typography>
          </Stack>
          <Typography>{comment}</Typography>
        </Stack>
      </Container>
    </Stack>
  )
}

const UserPageParsed = ({ id }: { id: number }) => {
  useToolbarType('zoom')

  const { data, error } = usePixivUserFind({ ids: [id] }, 1, 1)
  if (error) {
    return <Typography variant='h5'>{error.message}</Typography>
  }
  if (!data) {
    return null
  }

  const user = data.items[0]
  if (!user) {
    return <Typography variant='h5'>User not found</Typography>
  }

  return (
    <Stack spacing={4}>
      <User user={user} />
      <GridView
        defaultFilter={{
          parent_ids: [user.id],
        }}
        disabledFilter={{
          user: true,
        }}
      />
    </Stack>
  )
}

export interface Params {
  id: string
}
export const UserPage = () => {
  const { id } = useParams()
  if (!id) {
    return <Typography variant='h5'>User id should be given</Typography>
  }

  return <UserPageParsed id={parseInt(id)} />
}
