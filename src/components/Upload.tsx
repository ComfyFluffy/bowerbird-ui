import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  inputClasses,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DialogPaper, Img } from './etc'
import ImageUploading, {
  ImageListType,
  ImageUploadingPropsType,
} from 'react-images-uploading'
import { useState } from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { LoadingButton } from '@mui/lab'

const Uploader: ImageUploadingPropsType['children'] = ({
  imageList,
  onImageUpload,
  onImageRemoveAll,
  onImageUpdate,
  onImageRemove,
  isDragging,
  dragProps,
}) => {
  return (
    <Stack spacing={2}>
      <Stack
        sx={(t) => ({
          cursor: 'pointer',
          height: 150,
          borderRadius: 1,
          border: `2px solid ${
            isDragging ? t.palette.primary.main : 'rgba(0,0,0,0)'
          }`,
        })}
        onClick={onImageUpload}
        component={Paper}
        elevation={6}
        {...dragProps}
      >
        <Stack
          alignItems='center'
          justifyContent='center'
          sx={(t) => ({
            width: `calc(100% - ${t.spacing(2)})`,
            height: `calc(100% - ${t.spacing(2)})`,
            m: 1,
            border: `2px dashed ${
              isDragging ? t.palette.primary.main : t.palette.divider
            }`,
            borderRadius: 1,
          })}
          spacing={1}
        >
          <FileUploadIcon fontSize='large' />
          <Typography
            sx={{
              opacity: 0.7,
            }}
          >
            Drag and drop or click to upload
          </Typography>
        </Stack>
      </Stack>

      <Stack
        gap={1}
        flexDirection='row'
        flexWrap='wrap'
        sx={{
          width: 1,
        }}
      >
        {imageList.map((image, index) => (
          // TODO: switch to Grid
          <Img
            key={
              image.file
                ? image.file.name + image.file.size + index
                : image.dataURL?.slice(0, 100) || '' + index
            }
            src={image.dataURL}
            sx={{
              width: 150,
              height: 150,
              objectFit: 'cover',
            }}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export const UploadDialog = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [images, setImages] = useState<ImageListType>([])
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [rating, setRating] = useState<number | null>(null)

  const [posting, setPosting] = useState(false)

  return (
    <Dialog
      maxWidth='md'
      open={open}
      onClose={() => {
        if (title || caption || images.length) {
          return
        }
        onClose()
      }}
      PaperComponent={DialogPaper}
      fullWidth
    >
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            placeholder='Add title'
            variant='standard'
            sx={{
              [`& .${inputClasses.input}`]: {
                fontSize: '1.5em',
              },
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            placeholder='Add caption'
            variant='standard'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Box>
            <Rating value={rating} onChange={(_, v) => setRating(v)} />
          </Box>
          <ImageUploading multiple value={images} onChange={setImages}>
            {Uploader}
          </ImageUploading>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          onClick={() => {
            setPosting(true)
            setTimeout(() => {
              setPosting(false)
              onClose()
            }, 1000)
          }}
          disabled={posting}
          loading={posting}
        >
          Post
        </LoadingButton>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
