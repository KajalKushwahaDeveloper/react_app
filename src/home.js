import React from 'react';
import Navbar from './components/navbar.js';
import MapSection from './components/map.js' ;
import "./scss/home.scss";

const location = {
  address: '1600 Amphitheatre Parkway, Mountain View, california.',
  lat: 37.42216,
  lng: -122.08427,
} // our location object from earlier

const Home = () => {
  return (
   <>
    <Navbar/>
    <div className='home_div'>
      <img src="images/home_img.png" style={{width:"20%", height:"40%"}}/>
      <MapSection location={location} zoomLevel={17} />
    </div>
   </>
  )
}

export default Home;