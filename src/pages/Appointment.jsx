import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getIncidentsByPatient,
  addIncident,
  getIncidents,
  deleteIncident,
} from "../utils/incidentStorage";
import IncidentForm from "../components/IncidentForm";

const Appointments = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const patientId = params.get("id");

  const [incidents, setIncidents] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (patientId) {
      setIncidents(getIncidentsByPatient(patientId));
    } else {
      setIncidents(getIncidents()); // Show all if no patientId
    }
  }, [patientId, openForm]);
  
  
  const handleSave = (incident) => {
    incident.patientId = patientId; // ✅ Always attach from query param
    addIncident(incident);
    setIncidents(getIncidentsByPatient(patientId)); // ✅ Refresh data
    setOpenForm(false);
    navigate("/appointments?id=" + patientId, { replace: true });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this appointment?")) {
      deleteIncident(id);
      setIncidents(getIncidentsByPatient(patientId));
    }
  };

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
  {patientId ? `Appointments for Patient ID: ${patientId}` : "All Appointments"}
</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{
            background: "linear-gradient(to right, #10b981, #22c55e)",
            fontWeight: "bold",
          }}
        >
          Add Appointment
        </Button>
      </Box>

      {incidents.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        incidents.map((i) => (
          <Card key={i.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  {i.title}
                </Typography>
                <Chip label={i.status} color={getStatusColor(i.status)} />
              </Box>

              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(i.appointmentDate).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Cost:</strong> ₹{i.cost}
              </Typography>
              {i.description && (
                <Typography>
                  <strong>Description:</strong> {i.description}
                </Typography>
              )}
              {i.comments && (
                <Typography>
                  <strong>Comments:</strong> {i.comments}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(i.id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}

      <IncidentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        patientId={patientId}
      />
    </Box>
  );
};

export default Appointments;
