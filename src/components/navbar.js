import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../scss/navbar.scss";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useMediaQuery } from '@mui/material';
import { CLIENT_CURRENT } from "../constants";

const drawerWidth = 240;
const navItems = ['Home', 'GPS'];


const Navbar = ({ isAdmin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [menuIcon, setMenuIcon] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchClientData = async () => {
    console.log("fetchClientData isAdmin : "  + isAdmin);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(CLIENT_CURRENT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok || response.status !== 200) {
        return { success: false, error: "Invalid credentials" };
      } else {
        const responseData = await response.text();
        console.log("responseData navbar:", responseData);
        const deserializedData = JSON.parse(responseData);
        setData(deserializedData);
        console.log("deserializedData navbar:", deserializedData);
        return { success: true, error: null };
      }
    } catch (error) {
      console.log("Data Error: " + error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const { success, error } = fetchClientData();
  }, []);

  const drawer = (
  
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
      <div className="logo">
            <img
              className="logo_image"
              src="images/logo2.png"
              alt="logo"
            />
          </div>
                </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <Button
                color="inherit"
                component={Link}
                to={`/${item.toLowerCase()}`}
                sx={{ color: '#000', textDecoration: 'none' }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item} />
              </Button>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Display user information */}
      <Typography variant="body1" color="inherit">
        {data?.firstName || "N/A"} {data?.lastName || "N/A"} ({data?.username || "N/A"})
      </Typography>
    </Box>
  );



  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar className="app_bar">
          {/* Logo */}
          <div className="logo">
            <img className="logo_image" src="images/logo2.png" alt="logo" />
          </div>
          
          {/* Menu links for large screens */}
          <Box className="menu-link" sx={{ mr: 2, display: { xs:'none', sm: 'block',lg:'block',md:'block' } }}>
            {isAdmin && (
              <Button
                color="inherit"
                component={Link}
                to="/home"
                onClick={() => setMenuIcon(false)}
              >
                Licenses
              </Button>
            )}
            <Button
              color="inherit"
              component={Link}
              to="/gps"
              onClick={() => setMenuIcon(false)}
            >
              GPS
            </Button>
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              {data?.firstName || "N/A"} {data?.lastName || "N/A"} ({data?.username || "N/A"})
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/"
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle} 
            sx={{ display: { xs:'block', sm: 'none',lg:'none',md:'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;