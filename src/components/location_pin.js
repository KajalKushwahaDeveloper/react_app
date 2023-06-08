import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import "../scss/map.scss";

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)
export default LocationPin;