import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Spin } from 'antd'
import { toast } from 'react-toastify'
import debounce from 'lodash/debounce'

let searchData = ''
function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false)
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  const fetchRef = React.useRef(0)
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = async (value) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }
        console.log('value is', newOptions)
        if (newOptions.length == 0) {
          dispatch({ type: 'SEARCH_QUERY', payload: { text: '' } })
        }
        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  const onSelect = (data) => {
    dispatch({ type: 'SEARCH_QUERY', payload: { text: data } })
  }

  return (
    <AutoComplete
      labelInValue
      filterOption={true}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
      options={options}
      onSelect={onSelect}
    />
  )
} // Usage of DebounceSelect

async function fetchUserList(searchText) {
  console.log('fetching user', searchText)
  searchData = searchText
  console.log('Search global', searchData)
  return fetch('/api/search', {
    // Adding method type
    method: 'POST',

    // Adding body or contents to send
    body: JSON.stringify({
      searchText,
    }),

    // Adding headers to the request
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((body) =>
      body.map((product) => ({
        label: `${product.title}`,
        value: `${product.title}`,
      }))
    )
    .catch((error) => {
      console.log(error)
      return []
      toast.error('Bad query')
    })
}

const Search = () => {
  const dispatch = useDispatch()
  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search
  const [value, setValue] = useState([])
  const history = useHistory()

  const handleChange = (e) => {
    //
    dispatch({ type: 'SEARCH_QUERY', payload: { text: e.target.value } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'SEARCH_QUERY', payload: { text: searchData } })
    history.push(`/shop?${text}`)
  }

  return (
    <form className='form-inline my-2 my-lg-0' onSubmit={handleSubmit}>
      <DebounceSelect
        mode='multiple'
        value={value}
        placeholder='Search for products'
        fetchOptions={fetchUserList}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        style={{
          width: '400px',
        }}
      />

      <SearchOutlined
        onClick={handleSubmit}
        style={{ cursor: 'pointer', color: 'red' }}
      />
    </form>
  )
}

export default Search
