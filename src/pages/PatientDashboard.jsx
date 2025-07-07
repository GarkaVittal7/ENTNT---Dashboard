// src/pages/PatientDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Link
} from "@mui/material";
import { getPatients } from "../utils/patientStorage";
import { AuthContext } from "../context/AuthContext";
import { getIncidentsByPatient } from "../utils/incidentStorage";

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.role === "Patient") {
      const patientList = getPatients();
      const profile = patientList.find((p) => p.id === user.patientId);
      setPatient(profile);

      const appts = getIncidentsByPatient(user.patientId);
      setAppointments(appts);
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>Welcome, {patient?.name}</Typography>

      <Grid container spacing={2}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Info</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography><strong>DOB:</strong> {patient?.dob}</Typography>
              <Typography><strong>Contact:</strong> {patient?.contact}</Typography>
              <Typography><strong>Health Info:</strong> {patient?.healthInfo}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">My Appointments</Typography>
              <Divider sx={{ my: 1 }} />

              {appointments.length === 0 ? (
                <Typography>No appointments yet.</Typography>
              ) : (
                <List>
                  {appointments.map((appt) => (
                    <ListItem key={appt.id} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <>
                            {appt.title} –{" "}
                            {new Date(appt.appointmentDate).toLocaleString()}
                          </>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              Treatment: {appt.treatment}
                            </Typography>
                            <Typography variant="body2">
                              Status: <Chip label={appt.status} size="small" color="primary" />
                            </Typography>
                            <Typography variant="body2">
                              Visit Status:{" "}
                              <Chip
                                label={appt.visited ? "Visited" : "Not Visited"}
                                size="small"
                                color={appt.visited ? "success" : "error"}
                              />
                            </Typography>
                            <Typography variant="body2">
                              Cost: ₹{appt.cost}
                            </Typography>

                            {appt.files?.length > 0 && (
                              <Box mt={1}>
                                <Typography variant="body2" fontWeight="bold">Files:</Typography>
                                {appt.files.map((file, i) => (
                                  <Link
                                    key={i}
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
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
