import LoginPage from "./login_page";
import Home from "./home";
import GPS from "./gps";
import Logout from "./logout.js";
import ResetPasswordPage from "./resetPassword";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/gps" element={<GPS />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
