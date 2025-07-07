import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent
} from "@mui/material";
import {
  getIncidents,
  addIncident,
  getIncidentsByDate,
  getStatusColor
} from "../utils/incidentStorage";
import { getPatients } from "../utils/patientStorage";
import { useNavigate, useSearchParams } from "react-router-dom";
import IncidentForm from "../components/IncidentForm";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get("action");
  const selectedPatientId = searchParams.get("id");

  const [appointments, setAppointments] = useState([]);
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterId, setFilterId] = useState(selectedPatientId || "all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month");

  useEffect(() => {
    setAppointments(getIncidents());
    setPatients(getPatients());
    buildCalendar(currentDate);
  }, [currentDate, viewMode]);

  useEffect(() => {
    if (action === "add" && selectedPatientId) {
      setOpenForm(true);
    }
  }, [action, selectedPatientId]);

  const buildCalendar = (date) => {
    if (viewMode === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const week = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return [d];
      });
      setCalendarWeeks([week.map(day => day[0])]);
    } else {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      let startDate = new Date(firstDayOfMonth);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      let endDate = new Date(lastDayOfMonth);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

      const weeks = [];
      let current = new Date(startDate);

      while (current <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
      }
      setCalendarWeeks(weeks);
    }
  };

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    const all = getIncidentsByDate(date);
    return filterId === "all" ? all : all.filter((i) => i.patientId === filterId);
  };

  const handleSave = (incident) => {
    const finalPatientId = selectedPatientId || (incident.patientId ?? "");
    if (!finalPatientId) {
      alert("Missing patient ID. Cannot save appointment.");
      return;
    }
    incident.patientId = finalPatientId;
    if (!incident.visited) incident.visited = false;
    addIncident(incident);
    setAppointments(getIncidents());
    setOpenForm(false);
    navigate("/calendar");
  };

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const handleWeekChange = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset * 7);
    setCurrentDate(newDate);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={() => viewMode === "month" ? handleMonthChange(-1) : handleWeekChange(-1)}
            variant="outlined"
          >❮</Button>
          <Typography variant="h5" fontWeight="bold">
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </Typography>
          <Button
            onClick={() => viewMode === "month" ? handleMonthChange(1) : handleWeekChange(1)}
            variant="outlined"
          >❯</Button>
        </Box>
        <Box>
          <Button
            variant={viewMode === "month" ? "contained" : "outlined"}
            onClick={() => setViewMode("month")}
            sx={{ mr: 1 }}
          >Month</Button>
          <Button
            variant={viewMode === "week" ? "contained" : "outlined"}
            onClick={() => setViewMode("week")}
          >Week</Button>
        </Box>
      </Box>

      <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
        <InputLabel>Filter by Patient</InputLabel>
        <Select
          value={filterId}
          label="Filter by Patient"
          onChange={(e) => setFilterId(e.target.value)}
        >
          <MenuItem value="all">All Patients</MenuItem>
          {patients.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" gap={4}>
        <Box flex={3}>
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
            {daysOfWeek.map((day, i) => (
              <Box key={i} textAlign="center" fontWeight="bold" py={1}>{day}</Box>
            ))}
          </Box>

          {calendarWeeks.map((week, weekIndex) => (
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" key={weekIndex} mb={1}>
              {week.map((date, index) => {
                const appts = getAppointmentsForDay(date);
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <Box
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    sx={{
                      border: "1px solid #e0e0e0",
                      minHeight: 100,
                      aspectRatio: "1 / 1",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: appts.length > 0 ? "#eef4ff" : "#fff",
                      borderColor: isToday ? "#22c55e" : "#e0e0e0",
                      borderWidth: isToday ? 2 : 1,
                      cursor: "pointer"
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={isToday ? "green" : "text.primary"}
                    >
                      {date.getDate()}
                    </Typography>
                    {appts.length > 0 && (
                      <Chip
                        label={appts.length}
                        size="small"
                        color="primary"
                        sx={{ fontSize: "0.75rem", height: 20, borderRadius: "999px" }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        <Box flex={1} mt={2}>
          {selectedDate && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Appointments for {selectedDate.toLocaleDateString()}
              </Typography>

              {getAppointmentsForDay(selectedDate).length === 0 ? (
                <Typography>No appointments found.</Typography>
              ) : (
                getAppointmentsForDay(selectedDate).map((a) => (
                  <Card key={a.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2">
                        {new Date(a.appointmentDate).toLocaleTimeString()}
                      </Typography>
                      <Typography fontWeight="bold">{a.title}</Typography>
                      <Typography>{a.description}</Typography>
                      <Chip
                        label={a.status}
                        color={getStatusColor(a.status)}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>

      <IncidentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        patientId={selectedPatientId}
      />
    </Box>
  );
};

export default Calendar;
