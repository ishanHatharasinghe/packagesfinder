import React, { useState, useEffect } from "react";
import axios from "axios";

const PackageFinder = () => {
  const [prepaidData, setPrepaidData] = useState([]);
  const [postpaidData, setPostpaidData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("prepaid");

  // Filter states
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [budget, setBudget] = useState("");
  const [packageTypes, setPackageTypes] = useState([]);
  const [jobField, setJobField] = useState("");
  const [ageRange, setAgeRange] = useState("");

  const platforms = {
    prepaid: [
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
    ],
    postpaid: [
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
    ]
  };

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = () => {
    const prepaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1766840910&single=true&output=csv";
    const postpaidUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1U--nFdyycaRSCbEjMzQnL5yvuM9veVtjJfGqGShnOMhb7TiwIaQA0u_kqDD5AC6ZKZDfawFYtMyy/pub?gid=1415929392&single=true&output=csv";

    Promise.all([axios.get(prepaidUrl), axios.get(postpaidUrl)])
      .then(([prepaidResponse, postpaidResponse]) => {
        const prepaidParsedData = parseCSV(prepaidResponse.data);
        const postpaidParsedData = parseCSV(postpaidResponse.data);

        const prepaidWithType = prepaidParsedData.map((item) => ({
          ...item,
          planType: "prepaid"
        }));
        const postpaidWithType = postpaidParsedData.map((item) => ({
          ...item,
          planType: "postpaid"
        }));

        setPrepaidData(prepaidWithType);
        setPostpaidData(postpaidWithType);
        setFilteredData(prepaidWithType); // Set initial filtered data to prepaid
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
    const currentData = activeTab === "prepaid" ? prepaidData : postpaidData;
    let filtered = [...currentData];

    // Filter by platforms
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedPlatforms.some(
          (platform) => item[platform]?.toLowerCase() === "yes"
        );
      });
    }

    // Filter by budget
    if (budget) {
      const priceField =
        activeTab === "prepaid" ? "Price (Rs:)" : "Price (Rs:)";
      filtered = filtered.filter((item) => {
        const itemPrice = extractNumericPrice(item[priceField]);
        return itemPrice <= parseFloat(budget);
      });
    }

    // Filter by package types
    if (packageTypes.length > 0) {
      filtered = filtered.filter((item) => {
        return packageTypes.every((type) => {
          const availabilityField =
            type === "Voice" ? "Voice Availability" : "SMS Availability";
          return item[availabilityField]?.toLowerCase() === "yes";
        });
      });
    }

    // Filter by job field
    if (jobField) {
      filtered = filtered.filter((item) => {
        return (item.job_field?.toLowerCase() || "") === jobField.toLowerCase();
      });
    }

    // Filter by age range
    if (ageRange) {
      filtered = filtered.filter((item) => {
        return item.age_range === ageRange;
      });
    }

    setFilteredData(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedPlatforms([]);
    setBudget("");
    setPackageTypes([]);
    setJobField("");
    setAgeRange("");
    setFilteredData(tab === "prepaid" ? prepaidData : postpaidData);
  };

  useEffect(() => {
    console.log("Prepaid data count:", prepaidData.length);
    console.log("Postpaid data count:", postpaidData.length);
  }, [prepaidData, postpaidData]);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Package Type Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleTabChange("prepaid")}
          className={`px-4 py-2 rounded ${
            activeTab === "prepaid"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Prepaid
        </button>
        <button
          onClick={() => handleTabChange("postpaid")}
          className={`px-4 py-2 rounded ${
            activeTab === "postpaid"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Postpaid
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {activeTab === "prepaid" ? "Prepaid" : "Postpaid"} Package Finder
        </h1>

        {/* Platforms */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">What are your preferred platforms?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {platforms[activeTab].map((platform) => (
              <div key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onChange={(e) => {
                    setSelectedPlatforms((prev) =>
                      e.target.checked
                        ? [...prev, platform]
                        : prev.filter((p) => p !== platform)
                    );
                  }}
                  className="mr-2"
                />
                <label htmlFor={platform}>{platform}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">
            Maximum {activeTab === "prepaid" ? "Budget" : "Budget"} (Rs.)
          </h3>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={`Enter maximum ${
              activeTab === "prepaid" ? "budget" : "budget"
            }`}
            className="w-full p-2 border rounded"
            min="0"
            step="100"
          />
        </div>

        {/* Package Types */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Package Types</h3>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="voice"
                checked={packageTypes.includes("Voice")}
                onChange={(e) => {
                  setPackageTypes((prev) =>
                    e.target.checked
                      ? [...prev, "Voice"]
                      : prev.filter((t) => t !== "Voice")
                  );
                }}
                className="mr-2"
              />
              <label htmlFor="voice">Voice</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms"
                checked={packageTypes.includes("SMS")}
                onChange={(e) => {
                  setPackageTypes((prev) =>
                    e.target.checked
                      ? [...prev, "SMS"]
                      : prev.filter((t) => t !== "SMS")
                  );
                }}
                className="mr-2"
              />
              <label htmlFor="sms">SMS</label>
            </div>
          </div>
        </div>

        {/* Job Field */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Job Field</h3>
          <select
            value={jobField}
            onChange={(e) => setJobField(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Job Field</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Age Range */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Age Range</h3>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Age Range</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36+">36+</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Find My Package
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {filteredData[0] &&
                Object.keys(filteredData[0])
                  .filter((header) => header !== "planType")
                  .map((header, index) => (
                    <th key={index} className="px-4 py-2 border-b text-left">
                      {header}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {Object.entries(row)
                  .filter(([key]) => key !== "planType")
                  .map(([key, cell], cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debug information */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredData.length} {activeTab} packages
      </div>
    </div>
  );
};

export default PackageFinder;
