import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { classnames } from '../../../../helpers'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from './autocomplete'
import './autocomplete/auto_complete.css'

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
                  label={props.label}
                  variant="filled"
                  value={inputValue}
                  onChange={handleInputChange}
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'Demo__search-input'
                  })}
                  fullWidth
                />
              </div>
              {suggestions.length > 0 && (
                <div className="Demo__autocomplete-container">
                  {suggestions.map((suggestion) => {
                    const className = classnames('Demo__suggestion-item', {
                      'Demo__suggestion-item--active': suggestion.active
                    })
                    return (
                      <div
                        key={suggestion.placeId}
                        {...getSuggestionItemProps(suggestion, { className })}
                        style={{
                          margin: '.4rem 0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start'
                        }}
                      >
                        <div>
                          <LocationOnOutlinedIcon className="location_icon" />
                        </div>
                        <div>
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>
                          <small className="small_text">
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      </div>
                    )
                  })}
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

export default SearchBar
