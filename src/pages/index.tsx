import { Container, Stack } from '@mui/material'
import { UploadDialog } from '../components/Upload'

const Index = () => {
  return (
    <Container>
      <UploadDialog open={true} onClose={() => {}} />
    </Container>
  )
}

export default Index
