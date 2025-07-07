// src/pages/MyAppointments.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Divider
} from "@mui/material";
import { getIncidentsByPatient } from "../utils/incidentStorage";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user?.role === "Patient") {
      setAppointments(getIncidentsByPatient(user.patientId));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "info";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        appointments.map((appt) => (
          <Card key={appt.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{appt.title}</Typography>
                <Chip label={appt.status} color={getStatusColor(appt.status)} />
              </Box>

              <Typography><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</Typography>
              <Typography><strong>Cost:</strong> ₹{appt.cost}</Typography>
              {appt.treatment && <Typography><strong>Treatment:</strong> {appt.treatment}</Typography>}
              {appt.description && <Typography><strong>Description:</strong> {appt.description}</Typography>}
              {appt.comments && <Typography><strong>Comments:</strong> {appt.comments}</Typography>}
              <Typography>
                <strong>Visited:</strong>{" "}
                <Chip
                  label={appt.visited ? "Visited" : "Not Visited"}
                  size="small"
                  color={appt.visited ? "success" : "error"}
                />
              </Typography>

              {/* Files */}
              {appt.files?.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight="bold">Files:</Typography>
                  {appt.files.map((file, idx) => (
                    <Link
                      key={idx}
                      href={file.url}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      display="block"
                      variant="body2"
                    >
                      📎 {file.name}
                    </Link>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyAppointments;
