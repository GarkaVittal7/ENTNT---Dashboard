import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip
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
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        appointments.map((a) => (
          <Card key={a.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{a.title}</Typography>
                <Chip label={a.status} color={getStatusColor(a.status)} />
              </Box>
              <Typography><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleString()}</Typography>
              <Typography><strong>Cost:</strong> ₹{a.cost}</Typography>
              {a.description && <Typography><strong>Description:</strong> {a.description}</Typography>}
              {a.comments && <Typography><strong>Comments:</strong> {a.comments}</Typography>}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyAppointments;
