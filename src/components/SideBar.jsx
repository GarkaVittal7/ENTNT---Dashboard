// src/components/Sidebar.jsx
import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import { Dashboard, Person, CalendarMonth, FileCopy } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const adminLinks = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Patients", icon: <Person />, path: "/patients" },
    { text: "Appointments", icon: <CalendarMonth />, path: "/appointments" },
    { text: "Calendar", icon: <CalendarMonth />, path: "/calendar" }
  ];

  const patientLinks = [
    { text: "Profile", icon: <Person />, path: "/profile" },
    { text: "My Appointments", icon: <CalendarMonth />, path: "/my-appointments" },
    { text: "My Files", icon: <FileCopy />, path: "/my-files" }
  ];

  const links = user?.role === "Admin" ? adminLinks : patientLinks;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <List>
        {links.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
