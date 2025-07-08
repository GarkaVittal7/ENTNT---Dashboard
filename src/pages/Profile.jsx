import React from "react";
import { Typography, Box, Paper, Divider, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Profile = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#e0f7fa", // Light blue background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",         // Fix the page
        top: 0,
        left: 0,
        zIndex: 0
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          maxWidth: 600,
          width: "90%",
          borderRadius: 4,
          backgroundColor: "#fff"
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "#6366f1", width: 56, height: 56 }}>
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Welcome, ENTNT Care Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              This is your profile page where you can view and manage your information.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          {/* You can display patient info or contact details here */}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
