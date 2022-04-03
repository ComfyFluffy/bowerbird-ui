import {
  Autocomplete,
  autocompleteClasses,
  Box,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Pagination,
  Radio,
  RadioGroup,
  Stack,
  SxProps,
  TextField,
  textFieldClasses,
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { useEffect, useState } from 'react'
import { Tag } from '../model/base'
import { ObjectId } from 'bson'
import { PixivIllust, PixivUser } from '../model/pixiv'
import { ImgGrid } from '../components/pixiv/ImageGrid'
import { post, usePost } from '../utils/network'

interface AutocompleteProps<T> {
  value: T[]
  onChange: (newValue: T[]) => void
}

const AutocompleteTags = ({ value, onChange }: AutocompleteProps<Tag>) => {
  return (
    <AutocompleteOnTyping
      url="/api/v1/pixiv/find/tag"
      value={value}
      onChange={onChange}
      label="Tags"
      placeholder="Tags"
      isOptionEqualToValue={(a, b) => a._id.equals(b._id)}
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
      url="/api/v1/pixiv/find/user"
      value={value}
      onChange={onChange}
      label="Users"
      placeholder="Users"
      isOptionEqualToValue={(a, b) => a._id.equals(b._id)}
      getOptionLabel={(option) =>
        option.history[0] ? option.history[0].extension.name : option.source_id
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
    limit: 100,
  })

  return (
    <Autocomplete
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
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
        type="number"
      />
      <TextField
        label={`${label} To`}
        value={end}
        onChange={(e) => {
          setEnd(e.target.value)
          onChange({ start: +start || 0, end: +e.target.value || 0 })
        }}
        type="number"
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
          renderInput={(props) => <TextField {...props} />}
          label="Date From"
          value={start}
          onChange={(newValue) => {
            setStart(newValue)
            onChange({ start: newValue, end })
          }}
        />
        <DateTimePicker
          clearable
          renderInput={(props) => <TextField {...props} />}
          label="Date To"
          value={end}
          onChange={(newValue) => {
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
          <TextField {...params} label="Sort By" sx={{ width: 1 }} />
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
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
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
          <FormControlLabel value="asc" control={<Radio />} label="Asc" />
          <FormControlLabel value="desc" control={<Radio />} label="Desc" />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export const FindPixivIllust = () => {
  const [tags, setTags] = useState([] as Tag[])
  const [users, setUsers] = useState([] as PixivUser[])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [bookmarkRange, setBookmarkRange] = useState<[number, number]>([0, 0])
  const [sort, setSort] = useState<SortOptions>({ _id: -1 })
  const [data, setData] = useState<PixivIllust[]>()

  // data =
  //   data &&
  //   data.filter((m) => m.history[m.history.length - 1]?.extension.image_urls[0])

  // const { data } = usePost<PixivIllust[]>('/api/v1/pixiv/find/illust', {
  //   tags: tagIds,
  //   search: search || null,
  //   date_range: dateRange,
  //   bookmark_range: bookmarkRange,
  //   sort_by: sort,
  // })

  useEffect(() => {
    setPage(1)
    setData(undefined)

    const tagIds = tags.map((t) => t._id)
    if (tagIds.length === 0) {
      tagIds.push(new ObjectId('5f290463a7fe4ae39a0d0877'))
    }
    ;(async () => {
      setData(
        await post<PixivIllust[]>('/api/v1/pixiv/find/illust', {
          tags: tagIds,
          search: search || null,
          date_range: dateRange,
          bookmark_range: bookmarkRange,
          sort_by: sort,
          parent_ids: users.map((u) => u._id),
        })
      )
    })()
  }, [tags, search, dateRange, bookmarkRange, sort, users])

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Stack gap={2} sx={{ alignItems: 'center' }}>
        <AutocompleteTags
          value={tags}
          onChange={(t) => {
            setTags(t)
          }}
        />
        <AutocompleteUsers
          value={users}
          onChange={(u) => {
            setUsers(u)
          }}
        />
        <TextField
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: 0.95, sm: 592 } }}
        />
        <DateRangePicker onChange={(ra) => setDateRange([ra.start, ra.end])} />
        <NumberRangePicker
          onChange={(newValue) =>
            setBookmarkRange([newValue.start, newValue.end])
          }
          label="Bookmark"
        />
        <SortByPicker onChange={setSort} />
        {data ? (
          data.length ? (
            <>
              <ImgGrid illusts={data.slice((page - 1) * 30, page * 30)} />
              <Pagination
                count={Math.floor(data.length / 30) + 1}
                color="secondary"
                page={page}
                onChange={(_, page) => setPage(page)}
                sx={{ mb: 2, mt: 2 }}
              />
            </>
          ) : (
            'No result'
          )
        ) : (
          <CircularProgress />
        )}
      </Stack>
    </Container>
  )
}
