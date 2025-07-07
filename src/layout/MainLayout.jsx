// src/layout/MainLayout.jsx
import React from "react";
import { Box, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // spacing below navbar
          ml: 28 // spacing beside sidebar
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
