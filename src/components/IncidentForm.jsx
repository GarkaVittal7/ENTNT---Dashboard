import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

const statuses = ["Pending", "Completed", "In Progress"];

const initialFormState = {
  title: "",
  description: "",
  comments: "",
  appointmentDate: new Date().toISOString().slice(0, 16),
  cost: "",
  treatment: "",
  status: "Pending",
  nextDate: "",
  files: []
};

const IncidentForm = ({ open, onClose, onSave, patientId }) => {
  const [form, setForm] = useState(initialFormState);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ name: file.name, url: reader.result });
            reader.readAsDataURL(file);
          })
      )
    );
    setForm((prev) => ({ ...prev, files: base64Files }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Form fields:", {
      title: form.title,
      appointmentDate: form.appointmentDate,
      cost: form.cost,
      typeofCost: typeof form.cost
    });

    // ✅ Validation check
    if (
      !form.title?.trim() ||
      !form.appointmentDate?.trim() ||
      form.cost === "" ||
      isNaN(form.cost)
    ) {
      alert("Please fill all required fields (Title, Appointment Date, Cost).");
      return;
    }

    const newIncident = {
      ...form,
      id: "i" + new Date().getTime(),
      patientId
    };

    console.log("Saving incident:", newIncident);
    onSave(newIncident);
    onClose();
    setForm(initialFormState);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Appointment</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="dense"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          label="Comments"
          name="comments"
          fullWidth
          margin="dense"
          value={form.comments}
          onChange={handleChange}
        />
        <TextField
          label="Appointment Date & Time"
          name="appointmentDate"
          type="datetime-local"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={form.appointmentDate}
          onChange={handleChange}
          required
        />
        <TextField
          label="Treatment"
          name="treatment"
          fullWidth
          margin="dense"
          value={form.treatment}
          onChange={handleChange}
        />
        <TextField
          label="Cost"
          name="cost"
          type="number"
          fullWidth
          margin="dense"
          value={form.cost}
          onChange={handleChange}
          required
        />
        <TextField
          label="Status"
          name="status"
          select
          fullWidth
          margin="dense"
          value={form.status}
          onChange={handleChange}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Next Appointment"
          name="nextDate"
          type="datetime-local"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={form.nextDate}
          onChange={handleChange}
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ marginTop: 16 }}
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

export default IncidentForm;
