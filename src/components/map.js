import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "../scss/map.scss"

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  return (
    <div className="map">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
        />
      )}
    </div>
  );
};

export default Map;

// import React, { useState } from "react";
// import "../scss/map.scss";
// import "../scss/login.scss";
// import GoogleMapReact from "google-map-react";
// import LocationPin from "./location_pin";

// const Map = ({ location, zoomLevel }) => {
//   const [search, setSearch] = useState("");

//   const handleChange = (e) => {
//     e.preventDefault();
//     setSearch(e.target.value);
//     console.log(e.target.value);
//   };
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
//             bootstrapURLKeys={{ 
//                 key: "" 
//             }}
//             defaultCenter={location}
//             defaultZoom={zoomLevel}
//           >
//             <LocationPin
//               lat={location.lat}
//               lng={location.lng}
//               text={location.address}
//             />
//           </GoogleMapReact>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Map;
