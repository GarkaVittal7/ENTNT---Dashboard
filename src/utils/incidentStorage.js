const INCIDENTS_KEY = "incidents";

// ✅ Get all incidents
export const getIncidents = () => {
  return JSON.parse(localStorage.getItem(INCIDENTS_KEY)) || [];
};

// ✅ Get incidents by patientId
export const getIncidentsByPatient = (patientId) => {
  return getIncidents().filter((i) => i.patientId === patientId);
};

// ✅ Add a new incident
export const addIncident = (incident) => {
  console.log("✅ Saving Incident:", incident); // Debug log
  const existing = getIncidents();
  existing.push(incident);
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(existing));
};

// ✅ Delete an incident by ID
export const deleteIncident = (id) => {
  const filtered = getIncidents().filter((i) => i.id !== id);
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(filtered));
};

// ✅ Update an existing incident
export const updateIncident = (updated) => {
  const incidents = getIncidents().map((i) =>
    i.id === updated.id ? updated : i
  );
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
};

// ✅ Get status chip color for MUI based on status
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

// ✅ Get incidents on a specific date (for calendar view)
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

// ✅ NEW: Get upcoming incidents (sorted by date ascending)
export const getUpcomingIncidents = (limit = 10) => {
  const now = new Date();
  return getIncidents()
    .filter((i) => new Date(i.appointmentDate) >= now)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, limit);
};

// ✅ NEW: Get top patients by number of incidents
export const getTopPatients = () => {
  const all = getIncidents();
  const countMap = {};

  all.forEach((i) => {
    countMap[i.patientId] = (countMap[i.patientId] || 0) + 1;
  });

  const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
  return sorted.map(([patientId, count]) => ({ patientId, count }));
};

// NEW: Get revenue total from all completed incidents
export const getTotalRevenue = () => {
  return getIncidents()
    .filter((i) => i.status === "Completed")
    .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
};
