import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalHospital as IncidentIcon
} from "@mui/icons-material";

import PatientForm from "../components/PatientForm";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient
} from "../utils/patientStorage";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleSave = (data) => {
    if (data.id) {
      updatePatient(data);
    } else {
      data.id = "p" + new Date().getTime();
      addPatient(data);
    }
    setPatients(getPatients());
  };

  const handleEdit = (patient) => {
    setEditData(patient);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this patient?")) {
      deletePatient(id);
      setPatients(getPatients());
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Search + Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search patients by name, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#10b981",
            "&:hover": { backgroundColor: "#059669" },
            fontWeight: "bold"
          }}
          onClick={handleAdd}
        >
          + Add New Patient
        </Button>
      </Box>

      {/* Table with 4 Columns Only */}
      <Table sx={{ borderRadius: "10px", overflow: "hidden" }}>
        <TableHead sx={{ backgroundColor: "#f9fafb" }}>
          <TableRow>
            <TableCell><strong>Full Name</strong></TableCell>
            <TableCell><strong>Date of Birth</strong></TableCell>
            <TableCell><strong>Contact Info</strong></TableCell>
            <TableCell><strong>Health Info</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPatients.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Typography fontWeight="bold">{p.name}</Typography>
              </TableCell>
              <TableCell>{p.dob}</TableCell>
              <TableCell>{p.contact}</TableCell>
              <TableCell>{p.healthInfo}</TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    startIcon={<IncidentIcon />}
                    sx={{ textTransform: "none", fontWeight: "bold", px: 1.5 }}
                  >
                    Incidents
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(p)}
                    sx={{ textTransform: "none", fontWeight: "bold", px: 1.5 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(p.id)}
                    sx={{ textTransform: "none", fontWeight: "bold", px: 1.5 }}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {filteredPatients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No matching patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Patient Form Modal */}
      <PatientForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        initialData={editData}
      />
    </Box>
  );
};

export default Patients;
