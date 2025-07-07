const STORAGE_KEY = "patients";

// Dummy data to preload if not already there
const dummyPatients = [
 {
  "id": "2",
  "role": "Patient",
  "email": "john@entnt.in",
  "password": "patient123",
  "patientId": "p1"
}
];

// Preload dummy patients only if they don't exist
const preloadDummyPatients = () => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const emails = existing.map((p) => p.email);
  const newOnes = dummyPatients.filter((p) => !emails.includes(p.email));

  if (newOnes.length > 0) {
    const updated = [...existing, ...newOnes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log(" Dummy patients loaded");
  }
};

preloadDummyPatients(); // Run once on module load

export const getPatients = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const addPatient = (patient) => {
  if (!patient.email || !patient.password) {
    console.error("❌ Missing email or password in patient object");
    return;
  }
  const all = getPatients();
  // Prevent duplicate by id or email
  if (all.some((p) => p.id === patient.id)) {
    console.error(`❌ Patient with id ${patient.id} already exists.`);
    return;
  }
  if (all.some((p) => p.email === patient.email)) {
    console.error(`❌ Patient with email ${patient.email} already exists.`);
    return;
  }
  all.push(patient);
  savePatients(all);
};

export const updatePatient = (updated) => {
  const all = getPatients().map((p) =>
    p.id === updated.id ? updated : p
  );
  savePatients(all);
};

export const deletePatient = (id) => {
  const all = getPatients().filter((p) => p.id !== id);
  savePatients(all);
};
