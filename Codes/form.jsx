import { Search, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Define the form structures
const PREPAID_PLATFORMS = [
  "Facebook",
  "Whatsapp",
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
  "SLT esiphala",
  "Uber",
  "Waze",
  "Linkedin",
  "Imo",
  "Viber",
  "X"
];

const POSTPAID_PLATFORMS = [
  "Facebook",
  "Whatsapp",
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
  "SLT esiphala",
  "Google Meet",
  "Netflix",
  "Amazon",
  "Prime Video",
  "Iflix",
  "Zee5",
  "Peo TV GO"
];

const BUDGET_RANGES = [
  "Less than Rs. 100",
  "Between Rs.100 and Rs.500",
  "Between Rs.500 and Rs.1000",
  "Between Rs.1000 and Rs.3000",
  "Over Rs.3000"
];

const PACKAGE_TYPES = ["Voice", "SMS"];

const JOB_FIELDS = [
  "Agriculture and fisheries",
  "Education and Training",
  "Healthcare",
  "IT and Telecommunications",
  "Construction and Engineering",
  "Transport and Logistics",
  "Finance",
  "Manufacturer and Industries",
  "Media and Entertainment",
  "Service",
  "Business",
  "Tourism"
];

const AGE_RANGES = ["10 - 19", "20 - 29", "30 - 49", "50 - 60", "Above 60"];

const PackageRecommendationApp = () => {
  const [isPostpaid, setIsPostpaid] = useState(false);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    platforms: [],
    budget: "",
    packageTypes: [],
    jobField: "",
    ageRange: "",
    entertainmentPlatforms: [] // Only for postpaid
  });
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from Google Sheets
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Replace with your actual Google Sheets API endpoint
        const SHEET_ID = "1EOZgecGQvP5np5BBnj3YUIKtI1ip8vn8mAtVFzdpoks";
        const API_KEY = "AIzaSyBa0_eUOh7A5WgdkT-PMb6AK92yww4sW_I";
        const sheetName = isPostpaid ? "Postpaid" : "Prepaid";
        const range = `${sheetName}!A:Z`;

        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
        );

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data.values) {
          setPackages(parseSheetData(data.values));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, [isPostpaid]);

  // Parse sheet data into structured format
  const parseSheetData = (values) => {
    const [headers, ...rows] = values;
    return rows.map((row) => {
      const pkg = {};
      headers.forEach((header, index) => {
        pkg[header.toLowerCase()] = row[index];
      });
      return pkg;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const filterPackages = () => {
    return packages.filter((pkg) => {
      // Convert package price to number for comparison
      const price = parseInt(pkg.price.replace(/[^0-9]/g, ""));

      // Check budget range
      const withinBudget = (() => {
        switch (formData.budget) {
          case "Less than Rs. 100":
            return price < 100;
          case "Between Rs.100 and Rs.500":
            return price >= 100 && price <= 500;
          case "Between Rs.500 and Rs.1000":
            return price >= 500 && price <= 1000;
          case "Between Rs.1000 and Rs.3000":
            return price >= 1000 && price <= 3000;
          case "Over Rs.3000":
            return price > 3000;
          default:
            return true;
        }
      })();

      // Check if package type matches
      const hasMatchingType =
        formData.packageTypes.length === 0 ||
        formData.packageTypes.some((type) => pkg.package_type?.includes(type));

      // Check if package supports selected platforms
      const platformsSupported =
        formData.platforms.length === 0 ||
        formData.platforms.every((platform) =>
          pkg.supported_platforms
            ?.toLowerCase()
            .includes(platform.toLowerCase())
        );

      return withinBudget && hasMatchingType && platformsSupported;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredPackages = filterPackages();
    setRecommendedPackages(filteredPackages);
  };

  const handleClear = () => {
    setFormData({
      platforms: [],
      budget: "",
      packageTypes: [],
      jobField: "",
      ageRange: "",
      entertainmentPlatforms: []
    });
    setRecommendedPackages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00092C] via-[#00144A] to-[#000C1E] text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-[#000C1E]/80 backdrop-blur-xl border border-[#0A2342] rounded-3xl shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Zap className="w-10 h-10 text-blue-400 mr-3" />
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                {isPostpaid ? "Postpaid" : "Prepaid"} Package Finder
              </h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsPostpaid(!isPostpaid)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Switch to {isPostpaid ? "Prepaid" : "Postpaid"}
              </button>
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platforms Selection */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                What are your preferred platforms?
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {(isPostpaid ? POSTPAID_PLATFORMS : PREPAID_PLATFORMS).map(
                  (platform) => (
                    <label
                      key={platform}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        name="platforms"
                        value={platform}
                        checked={formData.platforms.includes(platform)}
                        onChange={handleChange}
                        className="form-checkbox text-blue-500"
                      />
                      <span>{platform}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Budget Selection */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Maximum Budget</h3>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
              >
                <option value="">Select Budget Range</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Package Types */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Package Types</h3>
              <div className="flex gap-4">
                {PACKAGE_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="packageTypes"
                      value={type}
                      checked={formData.packageTypes.includes(type)}
                      onChange={handleChange}
                      className="form-checkbox text-blue-500"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Field */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Job Field</h3>
              <select
                name="jobField"
                value={formData.jobField}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
              >
                <option value="">Select Job Field</option>
                {JOB_FIELDS.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Age Range</h3>
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg"
              >
                <option value="">Select Age Range</option>
                {AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" /> Find My Package
            </button>
          </form>

          {/* Results Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {recommendedPackages.length > 0
                ? "Recommended Packages"
                : "Complete the form to see recommendations"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="bg-[#0A2342]/70 border border-[#1A3A6C] rounded-lg p-5 hover:scale-105 transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xl font-semibold text-blue-400">
                      {pkg.name}
                    </h4>
                    <span className="text-xl font-bold text-cyan-400">
                      {pkg.price}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Data:</span> {pkg.data}
                    </p>
                    <p>
                      <span className="text-gray-400">Voice:</span> {pkg.voice}
                    </p>
                    <p>
                      <span className="text-gray-400">SMS:</span> {pkg.sms}
                    </p>
                    <p>
                      <span className="text-gray-400">Validity:</span>{" "}
                      {pkg.validity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageRecommendationApp;
