import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { Img } from '../../../components/styled'
import { PixivUser } from '../../../model/pixiv'
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
              maxHeight: '60vh',
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
      <Container>
        <Stack spacing={2}>
          <Avatar
            src={srcByPath('pixiv', avatar_path)}
            sx={(t) => ({
              mt: background_path ? '-64px' : undefined,
              width: 128,
              height: 128,
              border: `4px solid ${t.palette.background.paper}`,
            })}
          >
            {name[0]}
          </Avatar>
          <Stack spacing={3} direction='row' alignItems='center'>
            <Typography variant='h6'>{name}</Typography>
            <Button>Unfollow</Button>
          </Stack>
          <Typography>{comment}</Typography>
        </Stack>
      </Container>
    </Stack>
  )
}

const UserPageParsed = ({ id }: { id: number }) => {
  const { data, error } = usePixivUserFind({ ids: [id] }, 1, 1)
  if (error) {
    return <Typography variant='h5'>{error.message}</Typography>
  }
  if (!data) {
    return <CircularProgress />
  }

  const user = data.items[0]
  if (!user) {
    return <Typography variant='h5'>User not found</Typography>
  }

  return <User user={user} />
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
