import React, { useState, useEffect } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from '../../autocomplete'
import { classnames } from '../../helpers'
import '../../css/auto_complete.css'
import TextField from '@mui/material/TextField'
import PropTypes from 'prop-types'

const SearchBar = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [address, setAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [addressComponent, setAddressComponent] = useState(null)

  const handleChange = (newAddress) => {
    setAddress(newAddress)
    setLatitude(null)
    setLongitude(null)
    setAddressComponent(null)
    setErrorMessage('')
  }

  const handleSelect = (selected) => {
    setAddress(selected)
    geocodeByAddress(selected)
      .then((res) => {
        res[0].address_components &&
          setAddressComponent(res[0].address_components)
        return getLatLng(res[0])
      })
      .then(({ lat, lng }) => {
        setLatitude(lat)
        setLongitude(lng)
      })
      .catch((error) => {
        console.error('error', error)
      })
  }

  const handleError = (status, clearSuggestions) => {
    setErrorMessage(status)
    clearSuggestions()
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }
  useEffect(() => {
    props.setLat(latitude)
    props.setAddress(addressComponent)
    props.setLong(longitude)
  }, [latitude, longitude, addressComponent, props])

  return (
    <div>
      <PlacesAutocomplete
        onChange={handleChange}
        value={address}
        onSelect={handleSelect}
        onError={handleError}
        shouldFetchSuggestions={address.length > 2}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
          return (
            <div className="Demo__search-bar-container">
              <div className="Demo__search-input-container">
                <TextField
                  id="filled-basic"
                  label="Search Location"
                  variant="filled"
                  value={inputValue}
                  onChange={handleInputChange}
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'Demo__search-input'
                  })}
                />
              </div>
              {suggestions.length > 0 && (
                <div
                  className="Demo__autocomplete-container"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    maxHeight: '70px',
                    width: '210px',
                    cursor: 'pointer'
                  }}
                >
                  {suggestions.map((suggestion) => {
                    const className = classnames('Demo__suggestion-item', {
                      'Demo__suggestion-item--active': suggestion.active
                    })
                    return (
                      <div
                        key={suggestion.placeId}
                        {...getSuggestionItemProps(suggestion, { className })}
                      >
                        <strong>
                          {suggestion.formattedSuggestion.mainText}
                        </strong>{' '}
                        <small>
                          {suggestion.formattedSuggestion.secondaryText}
                        </small>
                      </div>
                    )
                  })}

                  <div className="Demo__dropdown-footer">
                    <div>
                      <img
                        style={{ width: '2rem' }}
                        src={require('../../images/powered_by_google_default.png')}
                        className="Demo__dropdown-footer-image"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }}
      </PlacesAutocomplete>
      {errorMessage.length > 0 && (
        <div className="Demo__error-message">{errorMessage}</div>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  setLat: PropTypes.func,
  setAddress: PropTypes.func,
  setLong: PropTypes.func
}

export default SearchBar
