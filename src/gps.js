import "./scss/map.scss";
import { ToastContainer, toast } from "react-toastify";
import WrappedMap from "./components/location/Map";
import GpsTable from "./components/location/map-components/gps_page_table";
import MyTable from "./components/MyTable";

const showToast = (message, type) => {
  console.log("Showing toast...");
  toast[type](message); // Use the 'type' argument to determine the toast type
};

const GPS = () => {
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB1HsnCUe7p2CE8kgBjbnG-A8v8aLUFM1E`;

  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} /> {/* to show above all */}
      <div
        className="container-fluid"
        style={{
          position: "fixed",
          top: "64px",
          zIndex: 99999,
          background: "white",
        }}
      >
        <div className="row">
          <div
            class="col-3 d-flex flex-column"
            style={{
              border: "2px solid",
              color: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>Current location</div>
          </div>

          <div
            class="col-3 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>From address</div>
          </div>
          <div
            class="col-3 d-flex flex-column"
            style={{
              border: "2px solid",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>To address</div>
          </div>

          <div class="col-3" style={{ border: "2px solid", paddingRight: 0 }}>
            <div className="d-flex justify-content-between">
              <div style={{alignSelf: "center"}}>
                Total time
                {/* Dynamic Content here */}
              </div>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-number border border-dark border-2 rounded-0"
                  data-type="plus"
                  data-field="quant[2]"
                  style={{ backgroundColor: "#ff0000", margin: 0 }}
                >
                  <i class="fa-solid fa-plus text-dark fa-lg"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-success btn-number border border-dark border-2 rounded-0"
                  data-type="minus"
                  data-field="quant[2]"
                  style={{ backgroundColor: "#39e600", margin: 0 }}
                >
                  <i class="fa-solid fa-minus text-dark fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{ width: '25%', paddingTop: 90, paddingBottom: 0}} className="table-responsive">
   <GpsTable  />
   </div> */}
      <div className="gps_page">
        <div className="gps_map">
          <WrappedMap
            showToast={showToast}
            googleMapURL={mapURL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div className="mapContainer" />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </>
  );
};
export default GPS;
