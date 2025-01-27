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
    <div className="bg-white max-w-4xl mx-auto p-4 text-white rounded-lg shadow-lg">
      {/* Title and Package Type Tabs */}
      <div className="flex flex-col text-[#0055a3] md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-black mb-4 md:mb-0 font-poppins">
          {activeTab === "prepaid" ? "PREPAID" : "POSTPAID"} PACKAGES
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleTabChange("prepaid")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "prepaid"
                ? "bg-[#4fb846] text-white shadow-lg"
                : "bg-gray-700 text-gray-300"
            } hover:bg-blue-600`}
          >
            Prepaid
          </button>
          <button
            onClick={() => handleTabChange("postpaid")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "postpaid"
                ? "bg-[#4fb846] text-white shadow-lg"
                : "bg-gray-700 text-gray-300"
            } hover:bg-blue-600`}
          >
            Postpaid
          </button>
        </div>
      </div>

      {/* Platforms */}
      <div className=" rounded-lg shadow-sm p-6 space-y-4 mb-3">
        <h3 className="text-[#0A2342] font-bold text-lg  text-gray-900">
          What are your preferred platforms?
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms[activeTab].map((platform) => (
            <div key={platform} className="relative flex items-center group">
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
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                        checked:bg-blue-500 checked:border-blue-500
                        hover:border-blue-500 transition-colors cursor-pointer"
              />
              <svg
                className="absolute left-0 w-5 h-5 pointer-events-none opacity-0 
                         peer-checked:opacity-100 text-white transition-opacity"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <label
                htmlFor={platform}
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer
                         hover:text-blue-600 transition-colors"
              >
                {platform}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className=" rounded-lg shadow-sm p-6 space-y-4 mb-3">
        {/* Budget and Package Types in the same row */}
        <div className="flex flex-col md:flex-row space-x-4 mb-4">
          {/* Maximum Budget */}
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-[#0A2342] font-bold mb-2">
              Maximum Budget (Rs.)
            </h3>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter maximum budget"
              className="w-full p-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
              min="0"
              step="100"
            />
          </div>

          {/* Package Types */}
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-[#0A2342] font-bold mb-2">
              What type of packages do you prefer?
            </h3>
            <div className="flex gap-4">
              <div className="text-[#0A2342] gap-2 font-semibold mb-2 flex items-center">
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
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                        checked:bg-blue-500 checked:border-blue-500
                        hover:border-blue-500 transition-colors cursor-pointer"
                />
                <label htmlFor="voice">Voice</label>
              </div>
              <div className="text-[#0A2342] font-semibold mb-2 gap-2 flex items-center">
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
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                        checked:bg-blue-500 checked:border-blue-500
                        hover:border-blue-500 transition-colors cursor-pointer "
                />
                <label htmlFor="sms"> SMS</label>
              </div>
            </div>
          </div>
        </div>

        {/* Job Field and Age Range in the same row */}
        <div className="flex flex-col md:flex-row space-x-4 mb-4">
          {/* Job Field */}
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-[#0A2342] font-bold mb-2">
              What is your job field?
            </h3>
            <select
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
              className="w-full p-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
            >
              <option value="">Select Job Field</option>
              <option value="student">Agriculture and fisheries</option>
              <option value="professional">Education and Training</option>
              <option value="business">Healthcare</option>
              <option value="student">IT and Telecommunications</option>
              <option value="professional">Construction and Engineering</option>
              <option value="business">Transport and Logistics</option>
              <option value="student">Finance</option>
              <option value="professional">Manufacturer and Industries</option>
              <option value="business">Media and Entertainment</option>
              <option value="student">Service</option>
              <option value="professional">Business</option>
              <option value="business">Tourism</option>
            </select>
          </div>

          {/* Age Range */}
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-[#0A2342] font-bold mb-2">
              What is your age range?
            </h3>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full p-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
            >
              <option value="">Select Age Range</option>
              <option value="10 - 19">10 - 19</option>
              <option value="20 - 29">20 - 29</option>
              <option value="30 - 49">30 - 49</option>
              <option value="50 - 60">50 - 60</option>
              <option value="60+">Above 60</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="mt-6 w-full py-3 bg-[#0055a3] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
      >
        <span className="font-semibold text-lg">Find My Package</span>
        <svg
          className="w-5 h-5 ml-2 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12h3m0 0h-3m3 0l-3 3m3-3l3-3m-3 3H6m0 0h3m-3 0l-3 3m3-3l3-3"
          />
        </svg>
      </button>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="bg-[#001325FF] p-4 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-102"
            >
              <h2 className="text-2xl font-semibold text-white mb-3 hover:text-blue-500 transition-colors">
                {item["Package Name"]}
              </h2>
              <p className="text-lg text-[#006CD2FF] font-bold mb-2">
                Price: Rs.{" "}
                <span className="font-semibold">{item["Price (Rs:)"]}</span>
              </p>
              <p className="text-gray-300 mb-2">
                Validity:{" "}
                <span className="font-semibold">
                  {item["Validity days"]} days
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                Voice: <span className="font-semibold">{item["Voice"]}</span>
              </p>
              <p className="text-gray-300 mb-4">
                Preferred Platforms:{" "}
                <span className="font-semibold">
                  {platforms[activeTab]
                    .filter(
                      (platform) => item[platform]?.toLowerCase() === "yes"
                    )
                    .join(", ") || "None"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 px-4 py-4 text-center text-gray-400">
            No packages found
          </div>
        )}
      </div>

      {/* Debug information */}
      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredData.length} {activeTab} packages
      </div>
    </div>
  );
};

export default PackageFinder;
