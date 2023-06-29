import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
import Settings from "./settings.js";
import ResetPasswordPage from "./resetPassword";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar";
function App() {
  return (
    <>
      <Navbar/>
        <Routes>
          <Route  path="/" element={<LoginPage/>} /> 
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/gps" element={<GPS/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
    </>
  );
}

export default App;
