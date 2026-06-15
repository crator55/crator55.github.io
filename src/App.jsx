import { useState } from "react";

import AustraliaMap from "./components/AustraliaMap";
import CsvUploader from "./components/CsvUploader";

const STATUS_OPTIONS = [
  { label: "Operational / Commissioning", color: "#22c55e" },
  { label: "In Planning", color: "#3b82f6" },
  { label: "Early Development / Concept", color: "#f59e0b" },
  { label: "Under Construction", color: "#ef4444" },
];

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredLocations =
    selectedStatuses.length === 0
      ? locations
      : locations.filter((loc) =>
          selectedStatuses.some(
            (s) => loc.status.toLowerCase() === s.toLowerCase()
          )
        );

  return (
    <div className="app">
      <header className="header">
        <h1>Australia Data Center Map</h1>
      </header>

      <CsvUploader onDataLoaded={setLocations} />

      <div className="status-filter">
        <span className="filter-label">Filter by Status:</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`status-btn ${selectedStatuses.includes(opt.label) ? "active" : ""}`}
            style={{
              borderColor: opt.color,
              backgroundColor: selectedStatuses.includes(opt.label)
                ? opt.color
                : "transparent",
              color: selectedStatuses.includes(opt.label) ? "#fff" : opt.color,
            }}
            onClick={() => toggleStatus(opt.label)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <AustraliaMap locations={filteredLocations} statusColors={STATUS_OPTIONS} />
    </div>
  );
}

export default App;