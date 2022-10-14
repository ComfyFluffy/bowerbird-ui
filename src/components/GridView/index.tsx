import {
  Autocomplete,
  autocompleteClasses,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  Pagination,
  Radio,
  RadioGroup,
  Rating,
  Stack,
  SxProps,
  TextField,
  textFieldClasses,
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { useEffect, useMemo, useRef, useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ZoomInIcon from '@mui/icons-material/ZoomIn'

import { Tag } from '../../model/base'
import { PixivIllust, PixivUser } from '../../model/pixiv'
import { srcByPath, usePost } from '../../utils/network'
import {
  useCollectionStore,
  useRatingStore,
  useZoomStore,
} from '../../utils/store'
import shallow from 'zustand/shallow'
import { ImgGrid, ImgGridProps } from './ImgGrid'
import {
  pixivBase,
  PixivIllustFindOptions,
  usePixivIllustFind,
} from '../../utils/pixiv'
import { DialogViewer } from './DialogViewer'

interface AutocompleteProps<T> {
  value: T[]
  onChange: (newValue: T[]) => void
}

const AutocompleteTags = ({ value, onChange }: AutocompleteProps<Tag>) => {
  return (
    <AutocompleteOnTyping
      url={pixivBase + 'find/tag'}
      value={value}
      onChange={onChange}
      label='Tags'
      placeholder='Tags'
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(option) => option.alias.join(' / ')}
    />
  )
}

const AutocompleteUsers = ({
  value,
  onChange,
}: AutocompleteProps<PixivUser>) => {
  return (
    <AutocompleteOnTyping
      url='/api/v2/pixiv/user/find'
      value={value}
      onChange={onChange}
      label='Users'
      placeholder='Users'
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(option) =>
        option.history ? option.history.extension.name : option.source_id
      }
    />
  )
}

const AutocompleteOnTyping = <T,>({
  value,
  onChange,
  label,
  placeholder,
  isOptionEqualToValue,
  getOptionLabel,
  url,
}: {
  value: T[]
  onChange: (newValue: T[]) => void
  label: string
  placeholder: string
  isOptionEqualToValue: (a: T, b: T) => boolean
  getOptionLabel: (option: T) => string
  url: string
}) => {
  const [search, setSearch] = useState('')
  const { data } = usePost<T[]>(search === '' ? null : url, {
    search,
    offset: 0,
    limit: 50,
  })

  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size='small'
        />
      )}
      loading={!data && search !== ''}
      options={data || []}
      multiple
      value={value}
      onInputChange={(_, newInputValue) => {
        setSearch(newInputValue)
      }}
      onChange={(_, newValue) => onChange(newValue)}
      sx={{
        width: 0.95,
      }}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
    />
  )
}

interface Range<T> {
  start: T
  end: T
}

const rangeContainerStyle: SxProps = {
  [`& > .${textFieldClasses.root}`]: {
    width: { sm: 292, xs: '95%' },
  },
  [`& > .${autocompleteClasses.root}`]: {
    width: { sm: 292, xs: '95%' },
  },
  width: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1,
}

const NumberRangePicker = ({
  onChange,
  label,
}: {
  onChange: (newValue: Range<number>) => void
  label: string
}) => {
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')

  return (
    <Box sx={rangeContainerStyle}>
      <TextField
        label={`${label} From`}
        value={start}
        onChange={(e) => {
          setStart(e.target.value)
          onChange({ start: +e.target.value || 0, end: +end || 0 })
        }}
        type='number'
        size='small'
      />
      <TextField
        label={`${label} To`}
        value={end}
        onChange={(e) => {
          setEnd(e.target.value)
          onChange({ start: +start || 0, end: +e.target.value || 0 })
        }}
        type='number'
        size='small'
      />
    </Box>
  )
}

const DateRangePicker = ({
  onChange,
}: {
  onChange: (range: Range<Date | null>) => void
}) => {
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={rangeContainerStyle}>
        <DateTimePicker
          clearable
          renderInput={(props: any) => <TextField {...props} />}
          label='Date From'
          value={start}
          onChange={(newValue: Date | null) => {
            setStart(newValue)
            onChange({ start: newValue, end })
          }}
        />
        <DateTimePicker
          clearable
          renderInput={(props: any) => <TextField {...props} />}
          label='Date To'
          value={end}
          onChange={(newValue: Date | null) => {
            setEnd(newValue)
            onChange({ start, end: newValue })
          }}
        />
      </Box>
    </LocalizationProvider>
  )
}
type SortOptions = Record<string, number>
const defaultSortOptions = [
  '_id',
  'extension.total_bookmarks',
  'extension.total_view',
  'last_modified',
]
const SortByPicker = ({
  onChange,
}: {
  onChange: (options: SortOptions) => void
}) => {
  const [ordering, setOrdering] = useState<'asc' | 'desc'>('desc')
  const [key, setKey] = useState<string | null>(null)
  return (
    <Box sx={rangeContainerStyle}>
      <Autocomplete
        options={defaultSortOptions}
        renderInput={(params) => (
          <TextField {...params} label='Sort By' sx={{ width: 1 }} />
        )}
        onChange={(_, k) => {
          setKey(k)
          if (k) {
            onChange({
              [k]: ordering === 'asc' ? 1 : -1,
            })
          }
        }}
      />
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='controlled-radio-buttons-group'
          value={ordering}
          row
          onChange={(e) => {
            const s = e.target.value as 'asc' | 'desc'
            setOrdering(s)
            key &&
              onChange({
                [key]: s === 'asc' ? 1 : -1,
              })
          }}
        >
          <FormControlLabel value='asc' control={<Radio />} label='Asc' />
          <FormControlLabel value='desc' control={<Radio />} label='Desc' />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

const ZoomController = () => {
  const [zoomLevel, zoomIn, zoomOut] = useZoomStore(
    (state) => [state.zoomLevel, state.zoomIn, state.zoomOut],
    shallow
  )

  return (
    <Stack direction='row' alignItems='center'>
      <IconButton onClick={zoomIn} disabled={zoomLevel <= -1}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={zoomOut} disabled={zoomLevel >= 3}>
        <ZoomOutIcon />
      </IconButton>
    </Stack>
  )
}

export const GridView = () => {
  const [tags, setTagsOrig] = useState<Tag[]>([])
  const [users, setUsersOrig] = useState<PixivUser[]>([])
  const setTags = (v: Tag[]) => {
    setFilter({
      ...filter,
      tag_ids: v.map((t) => t.id),
    })
    setTagsOrig(v)
  }
  const setUsers = (v: PixivUser[]) => {
    setFilter({
      ...filter,
      parent_ids: v.map((u) => u.id),
    })
    setUsersOrig(v)
  }

  const [showFilter, setShowFilter] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [filter, setFilter] = useState<PixivIllustFindOptions>({})
  const [page, setPage] = useState(1)

  const imgGridRef = useRef<HTMLDivElement>(null)

  const ratingById = useRatingStore((s) => s.ratingById)

  const [collections, currentCollection] = useCollectionStore(
    (s) => [s.collections, s.current],
    shallow
  )
  useEffect(() => {
    if (currentCollection) {
      setFilter({
        ...filter,
        ids: collections[currentCollection],
      })
    }
  }, [collections, currentCollection])

  const [currentIllust, setCurrentIllust] = useState<PixivIllust | null>(null)

  const { data } = usePixivIllustFind(
    {
      ...filter,
      tag_ids: [...(filter.tag_ids || []), 154],
      tag_ids_exclude: [13, 133],
    },
    page
  )

  const imgGridItems = useMemo(() => {
    return data?.items
      .filter(
        ({
          id,
          history: {
            extension: { image_paths },
          },
        }) =>
          image_paths?.length && (rating === null || ratingById[id] === rating)
      )
      .map((illust): ImgGridProps['items'][0] => {
        const {
          id,
          history: {
            extension: { image_paths, title },
          },
        } = illust
        return {
          id,
          count: image_paths!.length,
          imgSrc: srcByPath('pixiv', image_paths?.[0], 512),
          title,
          onClick: () => {
            setCurrentIllust(illust)
          },
        }
      })
  }, [data])

  return (
    <Container maxWidth={false} sx={{ pt: 8 }}>
      <Stack direction='row'>
        <Box sx={{ flexGrow: 1 }} />
        <ZoomController />
      </Stack>
      <DialogViewer
        illust={currentIllust}
        onClose={() => setCurrentIllust(null)}
      />
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Stack
          sx={{
            width: 1,
          }}
          spacing={2}
        >
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilter(!showFilter)}
          >
            Filter
          </Button>
          <Collapse in={showFilter}>
            <Stack spacing={2} alignItems='center'>
              <AutocompleteTags value={tags} onChange={setTags} />
              <AutocompleteUsers value={users} onChange={setUsers} />
              <TextField
                placeholder='Search'
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                sx={{ maxWidth: 592, width: 0.95 }}
                size='small'
              />
              <NumberRangePicker
                onChange={(newValue) =>
                  setFilter({
                    ...filter,
                    bookmark_range: [newValue.start, newValue.end],
                  })
                }
                label='Bookmark'
              />
              <Rating
                title='Rating'
                value={rating}
                onChange={(_, v) => {
                  setRating(v)
                }}
              />
            </Stack>
          </Collapse>
        </Stack>
        {data ? (
          imgGridItems?.length ? (
            <>
              <Box
                ref={imgGridRef}
                sx={{
                  width: 1,
                }}
              >
                {<ImgGrid items={imgGridItems} />}
              </Box>
              <Pagination
                count={data.total}
                color='secondary'
                page={page}
                onChange={(_, page) => {
                  setPage(page)
                  imgGridRef.current?.scrollIntoView()
                }}
                sx={{ mb: 2, mt: 2 }}
              />
            </>
          ) : (
            <Box>No result</Box>
          )
        ) : (
          <CircularProgress />
        )}
      </Stack>
    </Container>
  )
}
