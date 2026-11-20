const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Scheme = require("../models/Scheme");

dotenv.config();

const schemes = [
  {
    title: "PM-KISAN",
    description:
      "Pradhan Mantri Kisan Samman Nidhi — direct income support to small and marginal farmer families.",
    benefit:
      "₹6,000 per year in 3 equal installments of ₹2,000 directly into bank account.",
    eligibility:
      "All landholding farmer families with cultivable land. Aadhaar and bank account required.",
    category: "Central",
    state: "",
    officialLink: "https://pmkisan.gov.in",
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records"],
    image: "/images/scheme1.jpg",
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Crop insurance scheme for farmers against natural calamities, pests and diseases.",
    benefit:
      "Insurance coverage and financial support in case of crop failure.",
    eligibility:
      "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
    category: "Central",
    state: "",
    officialLink: "https://pmfby.gov.in",
    documents: ["Aadhaar Card", "Bank Passbook", "Sowing Certificate"],
    image: "/images/scheme2.jpg",
  },
  {
    title: "Kisan Credit Card (KCC)",
    description:
      "Credit card scheme for farmers to meet short-term credit requirements for crops.",
    benefit:
      "Credit up to ₹3 lakh at low interest rate for crop production and other needs.",
    eligibility:
      "All farmers — owner cultivators, tenant farmers, oral lessees and sharecroppers.",
    category: "Central",
    state: "",
    officialLink: "https://www.nabard.org",
    documents: ["Aadhaar Card", "PAN Card", "Land Documents"],
    image: "/images/scheme3.jpg",
  },
  {
    title: "Agriculture Infrastructure Fund (AIF)",
    description:
      "Financing facility for investment in agriculture infrastructure projects.",
    benefit:
      "Medium-long term debt financing with 3% interest subvention and credit guarantee.",
    eligibility:
      "Farmers, FPOs, PACS, Agri-entrepreneurs, Startups, SHGs.",
    category: "Central",
    state: "",
    officialLink: "https://agriinfra.dac.gov.in",
    documents: ["Aadhaar Card", "Project Report", "Bank Details"],
    image: "/images/scheme4.jpg",
  },
  {
    title: "e-NAM (National Agriculture Market)",
    description:
      "Online trading platform for agricultural commodities across India.",
    benefit:
      "Better price discovery, transparent auction, direct online payment.",
    eligibility:
      "Farmers, FPOs, Traders, Mandis registered under e-NAM.",
    category: "Central",
    state: "",
    officialLink: "https://enam.gov.in",
    documents: ["Aadhaar Card", "Bank Passbook", "Mobile Number"],
    image: "/images/scheme5.jpg",
  },
  {
    title: "PM Kisan Maandhan Yojana (PM-KMY)",
    description:
      "Voluntary pension scheme for small and marginal farmers.",
    benefit:
      "₹3,000 monthly pension after age 60.",
    eligibility:
      "Small and marginal farmers aged 18-40 with less than 2 hectares land.",
    category: "Central",
    state: "",
    officialLink: "https://pmkmy.gov.in",
    documents: ["Aadhaar Card", "Bank Passbook", "Land Records"],
    image: "/images/scheme6.jpg",
  },
  {
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description:
      "Scheme for irrigation and water conservation — 'Har Khet Ko Pani'.",
    benefit:
      "Subsidy for drip and sprinkler irrigation systems.",
    eligibility:
      "All farmers with agricultural land. Priority to small and marginal farmers.",
    category: "Central",
    state: "",
    officialLink: "https://pmksy.gov.in",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook"],
    image: "/images/scheme7.jpg",
  },
  {
    title: "Soil Health Card Scheme",
    description:
      "Provides soil health cards to farmers with crop-wise nutrient recommendations.",
    benefit:
      "Free soil testing and crop-wise fertilizer recommendations.",
    eligibility:
      "All farmers across India.",
    category: "Central",
    state: "",
    officialLink: "https://soilhealth.dac.gov.in",
    documents: ["Aadhaar Card", "Land Details"],
    image: "/images/scheme8.jpg",
  },
  {
    title: "Kisan Call Center (KCC)",
    description:
      "Toll-free helpline for farmers to get expert advice on farming.",
    benefit:
      "Free advisory on crop, weather, pest, market and schemes.",
    eligibility:
      "All farmers.",
    category: "Central",
    state: "",
    officialLink: "https://mkisan.gov.in",
    documents: [],
    image: "/images/scheme9.jpg",
  },
  {
    title: "National Mission on Sustainable Agriculture (NMSA)",
    description:
      "Promotes sustainable farming practices and climate-resilient agriculture.",
    benefit:
      "Support for organic farming, integrated farming, water use efficiency.",
    eligibility:
      "All farmers adopting sustainable practices.",
    category: "Central",
    state: "",
    officialLink: "https://nmsa.dac.gov.in",
    documents: ["Aadhaar Card", "Land Records"],
    image: "/images/scheme10.jpg",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);

    console.log(`${schemes.length} schemes inserted`);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDB();