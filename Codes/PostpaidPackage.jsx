import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";

const PostpaidPackageFinder = () => {
  const [postpaidData, setPostpaidData] = useState([]);
  const [filteredPostpaidData, setFilteredPostpaidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Postpaid filter states
  const [selectedPostpaidPlatforms, setSelectedPostpaidPlatforms] = useState(
    []
  );
  const [postpaidBudget, setPostpaidBudget] = useState("");
  const [postpaidPackageTypes, setPostpaidPackageTypes] = useState([]);

  const platforms = [
    "Facebook",
    "WhatsApp",
    "YouTube",
    "Instagram",
    "Messenger",
    "Tiktok",
    "SnapChat",
    "Google Maps",
    "MS Teams",
    "Office 365",
    "Zoom",
    "mLearning",
    "SLT Lynked",
    "SLT eSiphala",
    "Google Meet",
    "Netflix",
    "Amazon",
    "Prime Video",
    "Iflix",
    "Zee5",
    "PeoTV GO"
  ];

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = () => {
    const postpaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1415929392&single=true&output=csv";

    axios
      .get(postpaidUrl)
      .then((response) => {
        const postpaidParsedData = parseCSV(response.data);
        setPostpaidData(postpaidParsedData);
        setFilteredPostpaidData(postpaidParsedData);
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
    let filtered = [...postpaidData];

    // Filter by platforms
    if (selectedPostpaidPlatforms.length > 0) {
      filtered = filtered.filter((item) =>
        selectedPostpaidPlatforms.some(
          (platform) => item[platform]?.toLowerCase() === "yes"
        )
      );
    }

    // Filter by budget
    if (postpaidBudget) {
      filtered = filtered.filter(
        (item) =>
          extractNumericPrice(item["Monthly_Rental"]) <=
          parseFloat(postpaidBudget)
      );
    }

    // Filter by package types
    if (postpaidPackageTypes.length > 0) {
      filtered = filtered.filter((item) =>
        postpaidPackageTypes.every((type) =>
          item.package_type?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    setFilteredPostpaidData(filtered);
  };

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h3>Postpaid Package Finder</h3>
      {/* Platforms, Budget, Package Types, and Search Button */}
      {/* Similar to your original implementation */}
      <button onClick={applyFilters}>
        <Search /> Find My Package
      </button>
      <div>
        {filteredPostpaidData.map((pkg, index) => (
          <div key={index}>
            <h4>{pkg["Plan Name"]}</h4>
            <p>Price: {pkg["Monthly_Rental"]}</p>
            {/* Other details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostpaidPackageFinder;
