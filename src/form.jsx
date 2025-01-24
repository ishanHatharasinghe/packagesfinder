import React, { useState } from "react";
import { Package, User, Filter, X, Search, Zap } from "lucide-react";
import "./index.css";
const packages = [
  {
    name: "Aviator Plan",
    keywords: ["aviator", "1.5GB", "unlimited calls"],
    ageRange: [18, 50],
    occupations: ["Student", "Young Professional"],
    hobbies: ["Travel", "Social Media"],
    price: "Rs. 98",
    validity: "1 Day",
    data: "1.5GB",
    voice: "Unlimited",
    sms: "30 SMS"
  },
  {
    name: "Aviator Pro Plan",
    keywords: ["aviator pro", "45GB", "unlimited calls"],
    ageRange: [18, 50],
    occupations: ["Professional", "Entrepreneur"],
    hobbies: ["Work", "Travel"],
    price: "Rs. 1,555",
    validity: "30 Days",
    data: "45GB (1.5GB/day)",
    voice: "Unlimited",
    sms: "1,000 SMS"
  },
  {
    name: "Aviator Pro Max",
    keywords: ["aviator pro max", "90GB", "unlimited calls"],
    ageRange: [18, 50],
    occupations: ["Entrepreneur", "Manager"],
    hobbies: ["Technology", "Business"],
    price: "Rs. 2,999",
    validity: "30 Days",
    data: "90GB (3GB/day)",
    voice: "Unlimited",
    sms: "1,000 SMS"
  },
  {
    name: "1.5GB Plan",
    keywords: ["1.5GB", "100 minutes", "7 days"],
    ageRange: [18, 35],
    occupations: ["Student", "Young Professional"],
    hobbies: ["Gaming", "Social Media"],
    price: "Rs. 187",
    validity: "7 Days",
    data: "1.5GB",
    voice: "100 Minutes",
    sms: "100 SMS"
  },
  {
    name: "7GB Plan",
    keywords: ["7GB", "500 minutes", "30 days"],
    ageRange: [18, 45],
    occupations: ["Professional", "Student"],
    hobbies: ["Movies", "Streaming"],
    price: "Rs. 555",
    validity: "30 Days",
    data: "7GB",
    voice: "500 Minutes",
    sms: "500 SMS"
  },
  {
    name: "30-Day Pocket Pack",
    keywords: ["pocket pack", "512MB", "30 days"],
    ageRange: [18, 40],
    occupations: ["Student", "Teacher"],
    hobbies: ["Reading", "Writing"],
    price: "Rs. 198",
    validity: "30 Days",
    data: "512MB",
    voice: "250 Minutes",
    sms: "400 SMS"
  },
  {
    name: "Booster 542",
    keywords: ["booster", "2GB", "30 days"],
    ageRange: [25, 50],
    occupations: ["Entrepreneur", "Professional"],
    hobbies: ["Business", "Technology"],
    price: "Rs. 542",
    validity: "30 Days",
    data: "2GB",
    voice: "1,000 Minutes",
    sms: "1,000 SMS"
  },
  {
    name: "Rs. 555 Anytime Combo Plan",
    keywords: ["combo", "7GB", "30 days"],
    ageRange: [18, 45],
    occupations: ["Young Professional", "Entrepreneur"],
    hobbies: ["Streaming", "Social Media"],
    price: "Rs. 555",
    validity: "30 Days",
    data: "7GB",
    voice: "500 Minutes",
    sms: "500 SMS"
  }
];

const occupations = [
  "Student",
  "Young Professional",
  "Entrepreneur",
  "Professional",
  "Manager",
  "Teacher",
  "Doctor",
  "Engineer"
];

const hobbies = [
  "Photography",
  "Travel",
  "Fitness",
  "Dance",
  "Gaming",
  "Technology",
  "Social Media",
  "Music",
  "Reading",
  "Work"
];

const PackageRecommendationApp = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    occupation: "",
    hobbies: [],
    gender: ""
  });

  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = parseInt(formData.age, 10);

    const suitablePackages = packages.filter((pkg) => {
      const isInAgeRange = age >= pkg.ageRange[0] && age <= pkg.ageRange[1];
      const isOccupationMatch = pkg.occupations.includes(formData.occupation);
      const isHobbyMatch = formData.hobbies.some((h) =>
        pkg.hobbies.includes(h)
      );

      return isInAgeRange && isOccupationMatch && isHobbyMatch;
    });

    setRecommendedPackages(suitablePackages);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      age: "",
      email: "",
      occupation: "",
      hobbies: [],
      gender: ""
    });
    setRecommendedPackages([]);
  };

  const hasFormData = () => {
    return (
      formData.name ||
      formData.age ||
      formData.email ||
      formData.occupation ||
      formData.hobbies.length > 0 ||
      formData.gender
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00092C] via-[#00144A] to-[#000C1E] text-white p-4 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-[#000C1E]/80 backdrop-blur-xl border border-[#0A2342] rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Form Section */}
          <div className="p-8 border-r border-[#0A2342]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Zap className="w-10 h-10 text-blue-400 mr-3" />
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Package Finder
                </h2>
              </div>
              {hasFormData() && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Clear Form"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              />

              <div className="flex items-center">
                <h3 className="text-lg font-semibold mr-4">Advanced Filters</h3>
                <button
                  type="button"
                  onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {isAdvancedFilterOpen && (
                <div className="space-y-4">
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#0A2342] border border-[#1A3A6C] rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="" className="bg-[#0A2342]">
                      Select Occupation
                    </option>
                    {occupations.map((occ, idx) => (
                      <option key={idx} value={occ} className="bg-[#0A2342]">
                        {occ}
                      </option>
                    ))}
                  </select>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Select Hobbies
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {hobbies.map((hobby, idx) => (
                        <label key={idx} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value={hobby}
                            checked={formData.hobbies.includes(hobby)}
                            onChange={handleChange}
                            className="form-checkbox text-blue-500 bg-[#0A2342] border-[#1A3A6C]"
                          />
                          <span className="ml-2 text-sm">{hobby}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      {["Male", "Female"].map((gender, idx) => (
                        <label key={idx} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleChange}
                            className="form-radio text-blue-500 bg-[#0A2342] border-[#1A3A6C]"
                          />
                          <span className="ml-2">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" /> Find My Package
              </button>
            </form>
          </div>

          {/* Recommended Packages Section */}
          <div className="p-8 bg-[#00144A]/40">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
              {recommendedPackages.length > 0
                ? "Your Perfect Packages"
                : "Packages Will Appear Here"}
            </h3>

            {recommendedPackages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Package className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-center">
                  Fill out the form to get personalized package recommendations
                </p>
              </div>
            )}

            <div className="space-y-4">
              {recommendedPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="bg-[#0A2342]/70 border border-[#1A3A6C] rounded-lg p-5 transform transition hover:scale-105 hover:shadow-2xl hover:border-blue-500"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xl font-semibold text-blue-400">
                      {pkg.name}
                    </h4>
                    <Package className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-400">Price:</span>
                      <p className="text-white">{pkg.price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">
                        Validity:
                      </span>
                      <p className="text-white">{pkg.validity}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Data:</span>
                      <p className="text-white">{pkg.data}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Voice:</span>
                      <p className="text-white">{pkg.voice}</p>
                    </div>
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
