import {
  Avatar,
  Box,
  Button,
  Link,
  Paper,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import { ReactElement } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { GeneralUser } from '../model/base'

const UserCard = ({ user }: { user: GeneralUser }) => {
  const { previewUrls } = user

  return (
    <Stack spacing={1} component={Paper} elevation={12} sx={{ p: 1 }}>
      <UserLink user={user} followButton />
      <Stack
        direction='row'
        sx={{
          width: 1,
        }}
        spacing={0.5}
        justifyContent='center'
      >
        {previewUrls &&
          previewUrls.map((url) => (
            <Box
              key={url}
              sx={{
                height: 8 * 12,
                width: 8 * 12,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${url})`,
                borderRadius: 1,
              }}
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
export interface UserLinkProps {
  user: GeneralUser
  followButton?: boolean // TODO: Remove Follow
  tooltip?: boolean
}

export const UserLink = ({ user, followButton, tooltip }: UserLinkProps) => {
  const tooltipFn = (children: ReactElement) => (
    <StyledTooltip title={<UserCard user={user} />}>{children}</StyledTooltip>
  )

  const to = `/${user.source}}/user/${user.id}`

  const avatar = (
    <Avatar
      src={user.avatarUrl}
      sx={{
        textDecoration: 'none',
      }}
      component={RouterLink}
      to={to}
    >
      {user.name[0]}
    </Avatar>
  )
  const name = (
    <Link
      underline='hover'
      color='inherit'
      sx={{
        fontWeight: 600,
      }}
      component={RouterLink}
      to={to}
    >
      {user.name}
    </Link>
  )
  return (
    <Stack spacing={2} direction='row' alignItems='center'>
      <Stack
        spacing={1}
        direction='row'
        alignItems='center'
        sx={{
          flex: followButton ? 1 : undefined,
        }}
      >
        {tooltip ? (
          <>
            {tooltipFn(avatar)}
            {tooltipFn(name)}
          </>
        ) : (
          <>
            {avatar}
            {name}
          </>
        )}
      </Stack>
      {followButton && <Button size='small'>Unfollow</Button>}
    </Stack>
  )
}

UserLink.Skeleton = ({ textWidth = 100 }: { textWidth?: number }) => (
  <Stack direction='row' alignItems='center' spacing={2}>
    <Skeleton variant='circular' width={40} height={40} />
    <Skeleton variant='text' width={textWidth} />
  </Stack>
)
