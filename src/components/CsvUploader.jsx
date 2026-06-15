import Papa from "papaparse";

function isValidLatitude(lat) {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng) {
  return !isNaN(lng) && lng >= -180 && lng <= 180;
}

function CsvUploader({ onDataLoaded }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,

      complete: (results) => {
        const requiredColumns = [
          "Company",
          "Facility Name",
          "Location",
          "Address",
          "Power capacity (IT Load)(MW) (speculative)",
          "Y (Latitude)",
          "X (Longitude)",
          "Notes/explanation of expansion and what is involved? "
        ];

        const headers = results.meta.fields || [];

        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          alert(
            "The CSV file is missing these required columns:\n\n" +
              missingColumns.join("\n")
          );
          return;
        }

        const locations = [];
        const errors = [];

        results.data.forEach((row, index) => {
          const rowNumber = index + 2; // +2 because row 1 is the header

          const latitude = Number(row["Y (Latitude)"]);
          const longitude = Number(row["X (Longitude)"]);

          if (!isValidLatitude(latitude)) {
            errors.push(
              `Row ${rowNumber}: Invalid latitude (${row["Y (Latitude)"]})`
            );
            return;
          }

          if (!isValidLongitude(longitude)) {
            errors.push(
              `Row ${rowNumber}: Invalid longitude (${row["X (Longitude)"]})`
            );
            return;
          }

          locations.push({
            id: index + 1,

            company: row["Company"] || "",

            facility: row["Facility"] || "",

            location: row["Location"] || "",

            address: row["Address"] || "",

            powerCapacityMW:
              row["Power capacity (IT Load)(MW)"] || "",

            latitude,

            longitude,

            status: row["Development Stage (Status)"] || row["Status"] || "Unknown",

            notes:
              row[
                "Notes/explanation of expansion and what is involved?"
              ] || ""
          });
        });

        console.clear();

        console.log("Locations Loaded");
        console.table(locations);

        if (errors.length > 0) {
          console.warn(errors);

          alert(
            `Loaded ${locations.length} locations.\n\n` +
              `${errors.length} row(s) were skipped because of invalid coordinates.\n\n` +
              errors.slice(0, 10).join("\n") +
              (errors.length > 10
                ? "\n\n...and more."
                : "")
          );
        } else {
          alert(`Successfully loaded ${locations.length} locations.`);
        }

        onDataLoaded(locations);
      },

      error: (error) => {
        console.error(error);

        alert("Unable to read the CSV file.");
      }
    });
  };

  return (
    <div className="toolbar">
      <label>
        <strong>Load CSV:</strong>
      </label>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default CsvUploader;