// NilayNarayan Polychem LLP — NABL Accredited Lab Scope
// Source of truth. Update parameter lists here; the UI renders automatically.

export const ACCREDITATION = {
    laboratory: "NilayNarayan Polychem LLP",
    standard: "ISO/IEC 17025:2017",
    certificateNumber: "TC-17291",
    validFrom: "2025-12-21",
    validTo: "2029-12-20",
    totalClaim: "100+ accredited test parameters",
};

export const AIR_AMBIENT = [
    "Fine Particulate Matter (PM2.5)",
    "Particulate Matter (PM10)",
    "Sulphur Dioxide (SO2)",
    "Oxides of Nitrogen (NO2)",
    "Ozone (O3)",
    "Lead (Pb)",
];

export const STACK_EMISSION = [
    "Carbon Dioxide (CO2)",
    "Carbon Monoxide (CO)",
    "Oxides of Nitrogen (NO2)",
    "Oxygen (O2)",
    "Particulate Matter (PM)",
    "Sulphur Dioxide (SO2)",
    "Stack Emission Temperature (site testing)",
];

export const SOIL_SEDIMENT = [
    "pH",
    "Organic Carbon",
    "Electrical Conductivity (EC)",
    "Ammonia (NH3)",
    "Available Nitrogen (N)",
    "Nitrate (NO3)",
    "Phosphorous (P)",
    "Calcium (Ca)",
    "Chloride (Cl)",
    "Cadmium (Cd)",
    "Chromium (Cr)",
    "Copper (Cu)",
    "Lead (Pb)",
    "Manganese (Mn)",
];

export const WASTEWATER = [
    "pH",
    "Biochemical Oxygen Demand (BOD)",
    "Chemical Oxygen Demand (COD)",
    "Dissolved Oxygen",
    "Total Suspended Solids (TSS)",
    "Oil & Grease",
    "Fluoride",
    "Sulphide",
    "Hexavalent Chromium (Cr6+)",
    "Cadmium (Cd)",
    "Iron (Fe)",
    "Lead (Pb)",
    "Nickel (Ni)",
    "Zinc (Zn)",
];

export const WATER_MATRICES = {
    "Drinking Water": [
        "pH",
        "Acidity",
        "Total Alkalinity",
        "Total Dissolved Solids (TDS)",
        "Total Hardness",
        "Total Suspended Solids",
        "Turbidity",
        "Temperature",
        "Electrical Conductivity",
        "Chloride",
        "Sulphate",
        "Fluoride",
        "Calcium",
        "Magnesium",
        "Iron",
        "Zinc",
        "Nitrate Nitrogen",
    ],
    "Ground Water": [
        "pH",
        "Acidity",
        "Total Alkalinity",
        "Total Dissolved Solids (TDS)",
        "Total Hardness",
        "Total Suspended Solids",
        "Turbidity",
        "Temperature",
        "Electrical Conductivity",
        "Chloride",
        "Sulphate",
        "Fluoride",
        "Calcium",
        "Magnesium",
        "Iron",
        "Nitrate Nitrogen",
    ],
    "Packaged Drinking Water": [
        "pH",
        "Total Alkalinity",
        "Total Dissolved Solids (TDS)",
        "Total Hardness",
        "Total Suspended Solids",
        "Turbidity",
        "Temperature",
        "Electrical Conductivity",
        "Chloride",
        "Sulphate",
        "Fluoride",
        "Calcium",
        "Magnesium",
        "Iron",
        "Zinc",
        "Nitrate Nitrogen",
    ],
    "Surface Water": [
        "pH",
        "Dissolved Oxygen",
        "Biochemical Oxygen Demand (BOD)",
        "Total Alkalinity",
        "Total Dissolved Solids (TDS)",
        "Total Hardness",
        "Total Suspended Solids",
        "Turbidity",
        "Temperature",
        "Electrical Conductivity",
        "Chloride",
        "Sulphate",
        "Fluoride",
        "Calcium",
        "Magnesium",
    ],
};

export const WATER_REPRESENTATIVE = {
    "Drinking Water": ["pH", "TDS", "Hardness", "Alkalinity", "Turbidity", "Fluoride", "Iron"],
    "Ground Water": ["pH", "TDS", "Hardness", "EC", "Fluoride", "Iron", "Nitrate"],
    "Packaged Drinking Water": ["pH", "TDS", "Hardness", "Turbidity", "Fluoride", "Iron"],
    "Surface Water": ["pH", "DO", "BOD", "TDS", "Turbidity", "Chloride", "Sulphate"],
};

export const NOISE = [
    "Ambient Noise Levels",
    "Source Noise Levels",
];

export const SITE_TESTING = [
    "Ambient Noise Levels",
    "Source Noise Levels",
    "Stack Emission Temperature",
];
