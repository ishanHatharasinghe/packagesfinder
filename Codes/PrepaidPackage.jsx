import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";

const PrepaidPackageFinder = () => {
  const [prepaidData, setPrepaidData] = useState([]);
  const [filteredPrepaidData, setFilteredPrepaidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prepaid filter states
  const [selectedPrepaidPlatforms, setSelectedPrepaidPlatforms] = useState([]);
  const [prepaidBudget, setPrepaidBudget] = useState("");
  const [prepaidPackageTypes, setPrepaidPackageTypes] = useState([]);

  const platforms = [
    "Facebook",
    "WhatsApp",
    "YouTube",
    "Instagram",
    "FB Messenger",
    "Tiktok",
    "SnapChat",
    "Google Maps",
    "MS Teams",
    "Office 365",
    "Zoom",
    "mLearning",
    "SLT Lynked",
    "SLT eSiphala",
    "Uber",
    "Waze",
    "Linkedin",
    "Imo",
    "Viber",
    "X"
  ];

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = () => {
    const prepaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1766840910&single=true&output=csv";

    axios
      .get(prepaidUrl)
      .then((response) => {
        const prepaidParsedData = parseCSV(response.data);
        setPrepaidData(prepaidParsedData);
        setFilteredPrepaidData(prepaidParsedData);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching CSV data");
        setLoading(false);
        console.error("Error fetching CSV data:", error);
      });
  };

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/);
    const headers = rows[0].split(",");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      if (rowData.length === headers.length) {
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j].trim()] = rowData[j].trim();
        }
        data.push(rowObject);
      }
    }
    return data;
  }

  const extractNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^\d.]/g, "");
    return parseFloat(numericStr) || 0;
  };

  const applyFilters = () => {
    let filtered = [...prepaidData];

    // Filter by platforms
    if (selectedPrepaidPlatforms.length > 0) {
      filtered = filtered.filter((item) =>
        selectedPrepaidPlatforms.some(
          (platform) => item[platform]?.toLowerCase() === "yes"
        )
      );
    }

    // Filter by budget
    if (prepaidBudget) {
      filtered = filtered.filter(
        (item) =>
          extractNumericPrice(item["Price(Rs:)"]) <= parseFloat(prepaidBudget)
      );
    }

    // Filter by package types
    if (prepaidPackageTypes.length > 0) {
      filtered = filtered.filter((item) =>
        prepaidPackageTypes.every((type) =>
          item.package_type?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    setFilteredPrepaidData(filtered);
  };

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h3>Prepaid Package Finder</h3>
      {/* Platforms, Budget, Package Types, and Search Button */}
      {/* Similar to your original implementation */}
      <button onClick={applyFilters}>
        <Search /> Find My Package
      </button>
      <div>
        {filteredPrepaidData.map((pkg, index) => (
          <div key={index}>
            <h4>{pkg["Plan Name"]}</h4>
            <p>Price: {pkg["Price(Rs:)"]}</p>
            {/* Other details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrepaidPackageFinder;
