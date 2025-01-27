import axios from "axios"; // Import Axios
import { useEffect, useState } from "react";

export default function FetchCSVData() {
  const [prepaidData, setPrepaidData] = useState([]); // Store the Prepaid sheet data
  const [postpaidData, setPostpaidData] = useState([]); // Store the Postpaid sheet data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    fetchCSVData(); // Fetch the CSV data when the component mounts
  }, []); // The empty array ensures that this effect runs only once, like componentDidMount

  const fetchCSVData = () => {
    const prepaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1766840910&single=true&output=csv"; // Replace with your Prepaid CSV URL
    const postpaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1415929392&single=true&output=csv"; // Replace with your Postpaid CSV URL

    // Fetch both sheets' CSV data concurrently
    Promise.all([axios.get(prepaidUrl), axios.get(postpaidUrl)])
      .then(([prepaidResponse, postpaidResponse]) => {
        const prepaidParsedData = parseCSV(prepaidResponse.data); // Parse Prepaid CSV data
        const postpaidParsedData = parseCSV(postpaidResponse.data); // Parse Postpaid CSV data

        setPrepaidData(prepaidParsedData); // Set Prepaid data
        setPostpaidData(postpaidParsedData); // Set Postpaid data
        setLoading(false); // Set loading to false when data is fetched
        console.log("Prepaid Data:", prepaidParsedData); // Log Prepaid Data
        console.log("Postpaid Data:", postpaidParsedData); // Log Postpaid Data
      })
      .catch((error) => {
        setError("Error fetching CSV data"); // Set an error message
        setLoading(false); // Set loading to false in case of an error
        console.error("Error fetching CSV data:", error);
      });
  };

  // Improved CSV parser function
  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); // Split the CSV text into rows while handling '\r'
    const headers = rows[0].split(","); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store the parsed data

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(","); // Split the row by commas
      if (rowData.length === headers.length) {
        // Ensure the row has the correct number of fields
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j]] = rowData[j];
        }
        data.push(rowObject);
      }
    }
    return data;
  }

  // Render component
  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div>
      <h1>CSV Data</h1>

      {/* Prepaid Sheet Data */}
      <h2>Prepaid Data</h2>
      {prepaidData.length === 0 ? (
        <div>No data found for Prepaid</div>
      ) : (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(prepaidData[0] || {}).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prepaidData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Postpaid Sheet Data */}
      <h2>Postpaid Data</h2>
      {postpaidData.length === 0 ? (
        <div>No data found for Postpaid</div>
      ) : (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(postpaidData[0] || {}).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {postpaidData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
