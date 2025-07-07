import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@mui/material";
import { getPatients } from "../utils/patientStorage";
import { getIncidents } from "../utils/incidentStorage";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Dashboard = () => {
  const navigate = useNavigate();
  const patients = getPatients();
  const incidents = getIncidents();

  const totalRevenue = incidents.reduce((acc, i) => acc + Number(i.cost || 0), 0);

  const pending = incidents.filter(i => i.status === "Pending").length;
  const completed = incidents.filter(i => i.status === "Completed").length;
  const inProgress = incidents.filter(i => i.status === "In Progress").length;

  const sortedByDate = [...incidents]
    .filter(i => i.appointmentDate)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  // Top patients by appointment count
  const topPatientsMap = {};
  incidents.forEach(i => {
    if (!topPatientsMap[i.patientId]) topPatientsMap[i.patientId] = 0;
    topPatientsMap[i.patientId]++;
  });
  const topPatients = Object.entries(topPatientsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const patient = patients.find(p => p.id === id);
      return { name: patient?.name || "Unknown", count };
    });

  const handleAddAppointment = () => {
    if (patients.length > 0) {
      const firstPatientId = patients[0].id;
      navigate(`/calendar?action=add&id=${firstPatientId}`);
    } else {
      alert("No patients available to add an appointment.");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: "5px solid #3b82f6", borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CalendarMonthIcon sx={{ fontSize: 40, color: "#3b82f6" }} />
                <Box>
                  <Typography variant="subtitle2">TOTAL APPOINTMENTS</Typography>
                  <Typography variant="h6" fontWeight="bold">{incidents.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: "5px solid #10b981", borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <MonetizationOnIcon sx={{ fontSize: 40, color: "#10b981" }} />
                <Box>
                  <Typography variant="subtitle2">TOTAL REVENUE</Typography>
                  <Typography variant="h6" fontWeight="bold">₹{totalRevenue}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: "5px solid #f97316", borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" mb={1}>TREATMENTS STATUS</Typography>
              <Typography>✅ Completed: {completed}</Typography>
              <Typography>🕓 Pending: {pending}</Typography>
              <Typography>🔄 In Progress: {inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: "5px solid #8b5cf6", borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" mb={1}>TOP PATIENTS</Typography>
              {topPatients.length === 0 ? (
                <Typography>No data</Typography>
              ) : (
                <List dense>
                  {topPatients.map((p, i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText primary={`${p.name}`} secondary={`Visits: ${p.count}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Appointments */}
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Next 10 Appointments
        </Typography>
        {sortedByDate.length === 0 ? (
          <Typography>No upcoming appointments.</Typography>
        ) : (
          <Grid container spacing={2}>
            {sortedByDate.map((a) => (
              <Grid item xs={12} md={6} lg={4} key={a.id}>
                <Card sx={{ borderLeft: "4px solid #6366f1", borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {a.title}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(a.appointmentDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Cost: ₹{a.cost}
                    </Typography>
                    <Chip label={a.status} color="primary" size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add Appointment Button */}
      <Box mt={5} display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={handleAddAppointment}
          sx={{
            background: "linear-gradient(to right, #6366f1, #8b5cf6)",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: 2
          }}
        >
          ADD APPOINTMENT
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
