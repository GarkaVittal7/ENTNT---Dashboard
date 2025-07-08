// src/pages/MyFiles.jsx
import React, { useContext } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { getIncidents } from "../utils/incidentStorage";

const MyFiles = () => {
  const { user } = useContext(AuthContext);
  const allIncidents = getIncidents();

  const myIncidents = allIncidents.filter(
    (i) => i.patientId === user?.id && i.files && i.files.length > 0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e0f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // centered vertically
        flexDirection: "column",
        p: 4,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          My Files
        </Typography>

        {myIncidents.length === 0 ? (
          <Typography textAlign="center">No files uploaded yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {myIncidents.map((incident) =>
              incident.files.map((file, index) => (
                <Grid item xs={12} sm={6} md={4} key={`${incident.id}-${index}`}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography fontWeight="bold" gutterBottom>
                        {file.name || "Document"}
                      </Typography>
                      {file.url?.includes("data:") &&
                      file.url.startsWith("data:image") ? (
                        <CardMedia
                          component="img"
                          height="140"
                          image={file.url}
                          alt={file.name}
                          sx={{ borderRadius: 1 }}
                        />
                      ) : (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "none", color: "#3b82f6" }}
                        >
                          📎 View File
                        </a>
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={1}
                        display="block"
                      >
                        Attached to: {incident.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default MyFiles;
