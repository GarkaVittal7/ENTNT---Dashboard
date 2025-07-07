// src/components/PatientForm.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";

const PatientForm = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    dob: "",
    contact: "",
    email: "",       // Added email field
    healthInfo: "",
    password: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        name: "",
        dob: "",
        contact: "",
        email: "",
        healthInfo: "",
        password: ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    const { name, dob, contact, email, password } = form;
    if (!name || !dob || !contact || !email || !password) {
      alert("Please fill in all required fields including email and password.");
      return;
    }

    onSave(form);
    onClose();

    setForm({
      id: "",
      name: "",
      dob: "",
      contact: "",
      email: "",
      healthInfo: "",
      password: ""
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{form.id ? "Edit" : "Add"} Patient</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        <TextField
          margin="dense"
          label="Full Name"
          fullWidth
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Date of Birth"
          fullWidth
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Contact"
          fullWidth
          name="contact"
          value={form.contact}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Health Info"
          fullWidth
          name="healthInfo"
          value={form.healthInfo}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Password"
          fullWidth
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientForm;
