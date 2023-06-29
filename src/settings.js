import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import GpsTable from "./components/table";
import CurrentLocation from "./components/current_location";
import "./scss/map.scss";
import CreateTable from "./components/create_table";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Settings = () => {
  const [userAssingedEmulator, setUserAssingedEmulator] = useState(null);

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <>

      <div className="gps_page">
        <div className="gps_tables">
          <GpsTable />

          <CurrentLocation />

          <CreateTable />

          <button className="login_button">START</button>
        </div>
        <div className="gps_map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </div>
    </>
  );
};
export default Settings;

// import React, { useState } from "react";
// import "./scss/map.scss";
// import "./scss/login.scss";
// import GoogleMapReact from "google-map-react";
// import LocationPin from "./components/location_pin";

// const Settings = ({ location, zoomLevel }) => {
//   const [search, setSearch] = useState("");

//   const handleChange = (e) => {
//     e.preventDefault();
//     setSearch(e.target.value);
//     console.log(e.target.value);
//   };

//   if (!location) {
//     return null; // Return null or handle the case when location is undefined
//   }

//   return (
//     <>
//       <div className="map">
//         {/* <h2 className="map-h2">Come Visit Us At Our Campus</h2> */}
//         <input
//           type="text"
//           className="content_input"
//           placeholder="search here"
//           value={search}
//           onChange={handleChange}
//         />
//         <div className="google-map">
//           <GoogleMapReact
//             bootstrapURLKeys={{ key: "YOUR_API_KEY" }} // Replace with your Google Maps API key
//             defaultCenter={location}
//             defaultZoom={zoomLevel}
//           >
//             <LocationPin lat={location.lat} lng={location.lng} text={location.address} />
//           </GoogleMapReact>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Settings;
