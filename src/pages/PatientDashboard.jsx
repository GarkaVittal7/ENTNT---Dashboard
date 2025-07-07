import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Link,
  Button,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../utils/patientStorage";
import { AuthContext } from "../context/AuthContext";
import { getIncidentsByPatient } from "../utils/incidentStorage";

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Patient") {
      const patientList = getPatients();
      const profile = patientList.find((p) => p.id === user.patientId);
      setPatient(profile);

      const appts = getIncidentsByPatient(user.patientId);
      setAppointments(appts);
    }
  }, [user]);

  if (!user) return <Typography>Loading user...</Typography>;
  if (!patient) return <Typography>Loading patient data...</Typography>;

  const allFiles = appointments.flatMap((appt) =>
    (appt.files || []).map((file) => ({
      ...file,
      appointmentTitle: appt.title,
      appointmentDate: appt.appointmentDate
    }))
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome, {patient?.name}
      </Typography>

      <Grid container spacing={2}>
        {/* Patient Info Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><strong>DOB:</strong> {patient?.dob}</Typography>
              <Typography><strong>Contact:</strong> {patient?.contact}</Typography>
              <Typography><strong>Health Info:</strong> {patient?.healthInfo}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* My Appointments Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">My Appointments</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate("/my-appointments")}>
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {appointments.length === 0 ? (
                <Typography>No appointments yet.</Typography>
              ) : (
                <List>
                  {appointments.map((appt) => (
                    <ListItem key={appt.id} alignItems="flex-start" sx={{ mb: 2 }}>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold">
                            {appt.title} – {new Date(appt.appointmentDate).toLocaleString()}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Box mt={1}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Treatment:
                              </Typography>{" "}
                              {appt.treatment || "—"}
                            </Box>

                            <Box mt={1}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Status:
                              </Typography>{" "}
                              <Chip label={appt.status || "Pending"} size="small" color="primary" />
                            </Box>

                            <Box mt={1}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Visit Status:
                              </Typography>{" "}
                              <Chip
                                label={appt.visited ? "Visited" : "Not Visited"}
                                size="small"
                                color={appt.visited ? "success" : "error"}
                              />
                            </Box>

                            <Box mt={1}>
                              <Typography variant="body2" component="span" fontWeight="bold">
                                Cost:
                              </Typography>{" "}
                              ₹{appt.cost || "0"}
                            </Box>

                            {appt.files?.length > 0 && (
                              <Box mt={2}>
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
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Uploaded Files Section */}
        {allFiles.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>My Uploaded Files</Typography>
                <Divider sx={{ mb: 2 }} />
                {allFiles.map((file, index) => (
                  <Box key={index} mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {file.appointmentTitle} – {new Date(file.appointmentDate).toLocaleString()}
                    </Typography>
                    <Link
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
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
