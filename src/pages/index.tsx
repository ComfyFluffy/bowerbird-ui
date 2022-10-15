import {
  Container,
  IconButton,
  Paper,
  PaperProps,
  Stack,
  styled,
  Toolbar,
  Typography,
  Unstable_Grid2 as Grid,
  Avatar,
  Link,
  StackProps,
} from '@mui/material'
import { useState } from 'react'
import { UploadDialog } from '../components/Upload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import _ from 'lodash'
import { Line, Pie } from 'react-chartjs-2'
import { usePixivUserFind } from '../utils/pixiv'
import { Link as RouterLink } from 'react-router-dom'
import { srcByPath } from '../utils/network'

const labels = ['10/8', '10/9', '10/10', '10/11', '10/12', '10/13', '10/14']

const lineData = {
  labels,
  datasets: [
    {
      label: 'User Uploads',
      data: labels.map(() => _.random(0, 10)),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'pixiv',
      data: labels.map(() => _.random(10, 100)),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const data = {
  labels: ['User Uploads', 'pixiv'],
  datasets: [
    {
      label: '# of Votes',
      data: [2, 98],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

// NOTE: @mui/material/PaperProps & @mui/system/StackProps will cause the ts server entering a dead loop
const DataPaper = styled((props: PaperProps & StackProps) => (
  <Paper elevation={2} component={Stack} spacing={2} {...props} />
))(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
}))

const Index = () => {
  const [uploadOpen, setUploadOpen] = useState(false)

  const { data: users } = usePixivUserFind({
    ids: [90, 1054, 1394, 79],
  })

  return (
    <>
      <Toolbar
        sx={{
          justifyContent: 'flex-end',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1200,
          pointerEvents: 'none',
          '& > *': {
            pointerEvents: 'all',
          },
        }}
      >
        <IconButton onClick={() => setUploadOpen(true)}>
          <FileUploadIcon />
        </IconButton>
      </Toolbar>
      <Container
        sx={{
          pt: 8,
        }}
      >
        <Typography variant='h4' gutterBottom>
          Dashboard
        </Typography>
        <UploadDialog
          open={uploadOpen}
          onClose={() => {
            setUploadOpen(false)
          }}
        />
        <Grid
          container
          spacing={2}
          columns={{
            xs: 4,
            md: 12,
          }}
        >
          <Grid xs={8}>
            <DataPaper>
              <Typography variant='h6'>Recent Updates</Typography>
              <Line data={lineData} options={lineOptions} />
            </DataPaper>
          </Grid>
          <Grid xs={4}>
            <DataPaper>
              <Typography variant='h6'>Storage</Typography>
              <Stack alignItems='center' justifyContent='center'>
                <Stack
                  sx={{
                    width: 300,
                  }}
                >
                  <Pie
                    data={data}
                    options={{
                      responsive: true,
                    }}
                  />
                </Stack>
              </Stack>
              <Typography
                sx={{
                  textAlign: 'center',
                }}
              >
                Total: 49.82 GB
              </Typography>
            </DataPaper>
          </Grid>
          <Grid xs={4} md={2}>
            <DataPaper>
              <Typography variant='h5'>
                <Link component={RouterLink} to='/pixiv'>
                  pixiv
                </Link>
              </Typography>
              <Typography>Users: 3,002</Typography>
              <Typography>Saved Works: 13,522</Typography>
            </DataPaper>
          </Grid>
          <Grid xs={10}>
            <DataPaper>
              <Typography variant='h5'>Favorite users in pixiv</Typography>
              <Grid
                container
                columns={{
                  md: 4,
                  xs: 2,
                }}
              >
                {users?.items.map(
                  (
                    {
                      id,
                      history: {
                        extension: { name, avatar_path },
                      },
                    },
                    i
                  ) => (
                    <Grid xs={1}>
                      <Stack spacing={2} direction='row' alignItems='center'>
                        <Stack spacing={1} alignItems='center'>
                          <Avatar
                            sx={{
                              width: 70,
                              height: 70,
                            }}
                            src={srcByPath('pixiv', avatar_path)}
                          >
                            {name[0]}
                          </Avatar>
                        </Stack>

                        <Stack>
                          <Link component={RouterLink} to={`/pixiv/user/${id}`}>
                            {name}
                          </Link>
                          <Typography variant='body2'>
                            {136 - i * 8} Works
                          </Typography>
                          <Typography variant='body2'>
                            Like Rate: {(92.8 - i * 2.9).toFixed(1)}%
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  )
                )}
              </Grid>
            </DataPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Index
