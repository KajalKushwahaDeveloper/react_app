import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "../../autocomplete";
import TextField from "@material-ui/core/TextField";
import { classnames } from "../../helpers";
import "../../css/auto_complete.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue:"",
      address: "",
      errorMessage: "",
      latitude: null,
      longitude: null,
      addressComponent: null,
      isGeocoding: false,
    };
  }

  handleChange = (address) => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      addressComponent: null,
      errorMessage: "",
    });
  };


  handleSelect = (selected) => {
    this.setState({ isGeocoding: true, address: selected });
    geocodeByAddress(selected)
      .then((res) => {
        console.log(res[0].address_components);
        res[0].address_components &&
          this.setState({ addressComponent: res[0].address_components }); // Save addressComponent in state
        return getLatLng(res[0]);
      })
      .then(({ lat, lng }) => {
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false,
        });
      })
      .catch((error) => {
        this.setState({ isGeocoding: false });
        console.log("error", error);
      });
  };

  handleCloseClick = () => {
    this.setState({
      address: "",
      latitude: null,
      longitude: null,
      addressComponent: null,
    });
  };

  handleError = (status, clearSuggestions) => {
    console.log("Error from Google Maps API", status);
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };
  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    const {
      inputValue,
      address,
      errorMessage,
      latitude,
      longitude,
      addressComponent,
      isGeocoding,
    } = this.state;

    console.log("CHECK : ", latitude);
    this.props.setLat(latitude);
    this.props.setAddress(addressComponent);
    this.props.setLong(longitude);
    
    
    return (
      <div>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
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
                    onChange={this.handleInputChange}
                    {...getInputProps({
                      placeholder: "Search Places...",
                      className: "Demo__search-input",
                    })}
                  />
                </div>
               
                
                {suggestions.length > 0 && (
                  <div
                    className="Demo__autocomplete-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      overflowY: "scroll",
                      maxHeight: "100px",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    {suggestions.map((suggestion) => {
                      const className = classnames("Demo__suggestion-item", {
                        "Demo__suggestion-item--active": suggestion.active,
                      });

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>{" "}
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      );
                    })}

                    <div className="Demo__dropdown-footer">
                      <div>
                        <img
                          style={{ width: "2rem" }}
                          src={require("../../images/powered_by_google_default.png")}
                          className="Demo__dropdown-footer-image"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        </PlacesAutocomplete>
        {errorMessage.length > 0 && (
          <div className="Demo__error-message">{this.state.errorMessage}</div>
        )}

    
      </div>
    );
  }
}

export default SearchBar;
