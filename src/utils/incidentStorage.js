// ✅ UPDATE to incidentStorage.js
// Ensure this file exports all necessary functions like getIncidents, addIncident, getIncidentsByPatient, deleteIncident

const INCIDENTS_KEY = "incidents";

export const getIncidents = () => {
  return JSON.parse(localStorage.getItem(INCIDENTS_KEY)) || [];
};

export const getIncidentsByPatient = (patientId) => {
  return getIncidents().filter((i) => i.patientId === patientId);
};

export const addIncident = (incident) => {
  console.log("✅ Saving Incident:", incident); // Debug log
  const existing = getIncidents();
  existing.push(incident);
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(existing));
};

export const deleteIncident = (id) => {
  const filtered = getIncidents().filter((i) => i.id !== id);
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(filtered));
};

export const updateIncident = (updated) => {
  const incidents = getIncidents().map((i) => (i.id === updated.id ? updated : i));
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
};

// ✅ Status color mapping function for use in Appointments, MyAppointments, Calendar, etc.
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    default:
      return "default";
  }
};

// ✅ NEW: Get incidents for specific date
export const getIncidentsByDate = (date) => {
  const all = getIncidents();
  return all.filter((i) => {
    const apptDate = new Date(i.appointmentDate);
    return (
      apptDate.getFullYear() === date.getFullYear() &&
      apptDate.getMonth() === date.getMonth() &&
      apptDate.getDate() === date.getDate()
    );
  });
};
