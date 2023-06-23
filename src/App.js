import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    
        <Routes>
          <Route  path="/" element={<LoginPage/>} /> 
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/gps" element={<GPS/>} />
          <Route path="/logout" element={<Logout/>} />
        </Routes>
  );
}

export default App;
