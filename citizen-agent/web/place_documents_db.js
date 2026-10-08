/**
 * place_documents_db.js
 * Official India Government Documents & Certificates Database (PRD Master Data)
 * Covers: 28 States + 8 Union Territories + Central Government
 * Enables citizens to browse, filter, and apply for documents strictly according to their location.
 */

// ── 1. Core Universal Documents ───────────────────────────────────────────────
const CORE_DOCUMENTS_PRD = [
  {
    "name": "Birth Certificate",
    "importance": "★★★★★",
    "use": "Age/date-of-birth proof, school admissions, passport, government services",
    "category": "Civil Registration"
  },
  {
    "name": "Aadhaar Card",
    "importance": "★★★★★",
    "use": "Universal identity/address verification and all digital government services",
    "category": "Identity & Citizenship"
  },
  {
    "name": "PAN Card",
    "importance": "★★★★★",
    "use": "Income tax, banking, financial KYC and high-value transactions",
    "category": "Financial"
  },
  {
    "name": "Voter ID / EPIC",
    "importance": "★★★★★",
    "use": "Electoral identification and statutory address proof",
    "category": "Identity & Citizenship"
  },
  {
    "name": "Passport",
    "importance": "★★★★★",
    "use": "International travel, nationality, and primary citizenship proof",
    "category": "Identity & Citizenship"
  },
  {
    "name": "Driving Licence",
    "importance": "★★★★★",
    "use": "Motor vehicle operation + national photo identity/address proof",
    "category": "Vehicle"
  },
  {
    "name": "Death Certificate",
    "importance": "★★★★★",
    "use": "Inheritance, pension transfer, insurance claims, legal succession",
    "category": "Civil Registration"
  },
  {
    "name": "Marriage Certificate",
    "importance": "★★★★★",
    "use": "Legal proof of marriage, spouse visas, joint property and bank accounts",
    "category": "Civil Registration"
  },
  {
    "name": "Domicile / Residence Certificate",
    "importance": "★★★★★",
    "use": "State residency proof for government recruitment, university quotas & local schemes",
    "category": "State Residency"
  },
  {
    "name": "Caste Certificate",
    "importance": "★★★★★",
    "use": "Statutory reservation (SC/ST/OBC) and eligible affirmative action benefits",
    "category": "Social Category"
  },
  {
    "name": "Income Certificate",
    "importance": "★★★★★",
    "use": "Scholarships, tuition fee waivers, welfare subsidies, EWS eligibility",
    "category": "Financial"
  },
  {
    "name": "EWS Certificate",
    "importance": "★★★★★",
    "use": "10% Economically Weaker Section reservation in education and central/state jobs",
    "category": "Social Category"
  },
  {
    "name": "Disability Certificate / UDID",
    "importance": "★★★★★",
    "use": "Accessible benefits, travel concessions, reservation, and welfare schemes",
    "category": "Social Category"
  },
  {
    "name": "Character Certificate",
    "importance": "★★★★",
    "use": "Government & private employment, police verification, college admissions",
    "category": "Employment"
  },
  {
    "name": "Nationality / Citizenship Proof",
    "importance": "★★★★",
    "use": "Statutory citizenship-related requirements and government appointments",
    "category": "Identity & Citizenship"
  },
  {
    "name": "Land / Property Documents (RoR/Mutation)",
    "importance": "★★★★",
    "use": "Ownership title, property mutations, agricultural subsidies, bank loans",
    "category": "Property & Land"
  },
  {
    "name": "Family / Legal Heir Certificate",
    "importance": "★★★★",
    "use": "Property succession, transfer of deceased savings, family pensions",
    "category": "Civil Registration"
  },
  {
    "name": "Solvency Certificate",
    "importance": "★★★",
    "use": "Financial surety proof for government tenders, contracts, and court bails",
    "category": "Financial"
  },
  {
    "name": "Income & Asset Certificate",
    "importance": "★★★★",
    "use": "Comprehensive asset and income validation for statutory quotas",
    "category": "Financial"
  }
];

// ── 2. Master Places Metadata (28 States + 8 UTs + Central) ───────────────────
const PLACES_DIRECTORY = [
  // Central Level
  { name: 'Central Government', type: 'central', code: 'IN', portal: 'National Government Services Portal (services.india.gov.in)', dept: 'Government of India' },

  // 28 States
  { name: 'Andhra Pradesh', type: 'state', code: 'AP', portal: 'MeeSeva / Meebhoomi AP', dept: 'Revenue & Social Welfare' },
  { name: 'Arunachal Pradesh', type: 'state', code: 'AR', portal: 'e-District Arunachal / ServicePlus', dept: 'District Administration' },
  { name: 'Assam', type: 'state', code: 'AS', portal: 'Sewa Setu (RTPS Assam)', dept: 'Revenue & Disaster Management' },
  { name: 'Bihar', type: 'state', code: 'BR', portal: 'RTPS Bihar (ServicePlus)', dept: 'General Administration Department' },
  { name: 'Chhattisgarh', type: 'state', code: 'CG', portal: 'e-District Chhattisgarh (CG Choice)', dept: 'Revenue & Disaster Management' },
  { name: 'Goa', type: 'state', code: 'GA', portal: 'Goa Online Citizen Portal', dept: 'Collectorate & Civil Administration' },
  { name: 'Gujarat', type: 'state', code: 'GJ', portal: 'Digital Gujarat Portal', dept: 'Social Justice & Revenue' },
  { name: 'Haryana', type: 'state', code: 'HR', portal: 'Antyodaya SARAL Haryana', dept: 'Revenue & Citizen Resources Information' },
  { name: 'Himachal Pradesh', type: 'state', code: 'HP', portal: 'e-District Himachal Pradesh', dept: 'Revenue Department' },
  { name: 'Jharkhand', type: 'state', code: 'JH', portal: 'JharSewa (e-District Jharkhand)', dept: 'Personnel & Administrative Reforms' },
  { name: 'Karnataka', type: 'state', code: 'KA', portal: 'Seva Sindhu Karnataka / Nadakacheri', dept: 'Revenue & Social Welfare' },
  { name: 'Kerala', type: 'state', code: 'KL', portal: 'e-District Kerala / Akshaya Centers', dept: 'Revenue Department' },
  { name: 'Madhya Pradesh', type: 'state', code: 'MP', portal: 'MP e-District / Samagra Portal', dept: 'Public Service Management' },
  { name: 'Maharashtra', type: 'state', code: 'MH', portal: 'Aaple Sarkar / MahaOnline', dept: 'Revenue & Social Justice Department' },
  { name: 'Manipur', type: 'state', code: 'MN', portal: 'e-District Manipur', dept: 'District Administration' },
  { name: 'Meghalaya', type: 'state', code: 'ML', portal: 'ServicePlus Meghalaya', dept: 'General Administration' },
  { name: 'Mizoram', type: 'state', code: 'MZ', portal: 'e-District Mizoram', dept: 'District Administration & Revenue' },
  { name: 'Nagaland', type: 'state', code: 'NL', portal: 'e-District Nagaland', dept: 'Home & Personnel Department' },
  { name: 'Odisha', type: 'state', code: 'OD', portal: 'Odisha Right to Public Services (ORTPSA)', dept: 'Revenue & Disaster Management' },
  { name: 'Punjab', type: 'state', code: 'PB', portal: 'Sewa Kendra Punjab (e-Sewa)', dept: 'Governance Reforms & Revenue' },
  { name: 'Rajasthan', type: 'state', code: 'RJ', portal: 'e-Mitra Rajasthan', dept: 'DoIT&C & Revenue Department' },
  { name: 'Sikkim', type: 'state', code: 'SK', portal: 'e-District Sikkim', dept: 'Land Revenue & Disaster Management' },
  { name: 'Tamil Nadu', type: 'state', code: 'TN', portal: 'TNeGA e-Sevai Portal', dept: 'Revenue & Disaster Management' },
  { name: 'Telangana', type: 'state', code: 'TG', portal: 'MeeSeva Telangana', dept: 'Revenue & Social Welfare' },
  { name: 'Tripura', type: 'state', code: 'TR', portal: 'e-District Tripura (e-Seva)', dept: 'Revenue Department' },
  { name: 'Uttar Pradesh', type: 'state', code: 'UP', portal: 'e-District UP / Jan Seva Kendra', dept: 'Revenue Department & Board of Revenue' },
  { name: 'Uttarakhand', type: 'state', code: 'UK', portal: 'e-District Uttarakhand / Apuni Sarkar', dept: 'Revenue Department' },
  { name: 'West Bengal', type: 'state', code: 'WB', portal: 'WB e-District Portal', dept: 'Personnel & Administrative Reforms' },

  // 8 Union Territories
  { name: 'Andaman & Nicobar Islands', type: 'ut', code: 'AN', portal: 'e-District Andaman', dept: 'Revenue Administration' },
  { name: 'Chandigarh', type: 'ut', code: 'CH', portal: 'e-District Chandigarh / Sampark', dept: 'Chandigarh Administration' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'ut', code: 'DN', portal: 'e-District DNH & DD', dept: 'UT Administration' },
  { name: 'Delhi', type: 'ut', code: 'DL', portal: 'e-District Delhi', dept: 'Revenue Department, Govt of NCT of Delhi' },
  { name: 'Jammu & Kashmir', type: 'ut', code: 'JK', portal: 'e-UNNAT Jammu & Kashmir', dept: 'Revenue Department' },
  { name: 'Ladakh', type: 'ut', code: 'LA', portal: 'e-District Ladakh', dept: 'UT Administration of Ladakh' },
  { name: 'Lakshadweep', type: 'ut', code: 'LD', portal: 'e-District Lakshadweep', dept: 'Directorate of Planning & Statistics' },
  { name: 'Puducherry', type: 'ut', code: 'PY', portal: 'e-District Puducherry', dept: 'Department of Revenue & Disaster Management' },
];

// ── 3. Place-wise Documents Database (28 States + 8 UTs + Central) ──────
const PLACE_DOCUMENTS_DB = {
  "Andhra Pradesh": [
    {
      "id": "andhra_pradesh_integrated_caste_certificate",
      "title": "Integrated / Caste Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Integrated / Caste Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_income_certificate",
      "title": "Income Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_residence_certificate",
      "title": "Residence Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_family_member_certificate",
      "title": "Family Member Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Family Member Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_nativity_certificate",
      "title": "Nativity Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Nativity Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_birth_certificate",
      "title": "Birth Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_death_certificate",
      "title": "Death Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_local_candidate_study_related_certificates",
      "title": "Local Candidate / Study-related certificates",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Local Candidate / Study-related certificates under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_agricultural_land_related_certificates",
      "title": "Agricultural / land-related certificates",
      "place": "Andhra Pradesh",
      "category": "agriculture",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Agricultural / land-related certificates under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_legal_heir_family_certificates",
      "title": "Legal heir/family certificates",
      "place": "Andhra Pradesh",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal heir/family certificates under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    },
    {
      "id": "andhra_pradesh_revenue_certificates",
      "title": "Revenue certificates",
      "place": "Andhra Pradesh",
      "category": "agriculture",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva / Meebhoomi AP",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Revenue certificates under Andhra Pradesh jurisdiction via MeeSeva / Meebhoomi AP.",
      "whoCanApply": "Eligible residents/citizens in Andhra Pradesh meeting statutory rules."
    }
  ],
  "Arunachal Pradesh": [
    {
      "id": "arunachal_pradesh_permanent_resident_certificate_prc",
      "title": "Permanent Resident Certificate (PRC)",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Permanent Resident Certificate (PRC) under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_income_certificate",
      "title": "Income Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_st_certificate",
      "title": "ST Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for ST Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_residence_related_certificate",
      "title": "Residence-related certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence-related certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_character_certificate",
      "title": "Character Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_birth_certificate",
      "title": "Birth Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_death_certificate",
      "title": "Death Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Arunachal Pradesh",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    },
    {
      "id": "arunachal_pradesh_land_revenue_related_documents",
      "title": "Land/revenue-related documents",
      "place": "Arunachal Pradesh",
      "category": "agriculture",
      "dept": "District Administration",
      "portal": "e-District Arunachal / ServicePlus",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue-related documents under Arunachal Pradesh jurisdiction via e-District Arunachal / ServicePlus.",
      "whoCanApply": "Eligible residents/citizens in Arunachal Pradesh meeting statutory rules."
    }
  ],
  "Assam": [
    {
      "id": "assam_prc_permanent_resident_certificate",
      "title": "PRC / Permanent Resident Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for PRC / Permanent Resident Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_caste_certificate",
      "title": "Caste Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_obc_mobc_certificate",
      "title": "OBC/MOBC Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC/MOBC Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_income_certificate",
      "title": "Income Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_ews_certificate",
      "title": "EWS Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_birth_certificate",
      "title": "Birth Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_death_certificate",
      "title": "Death Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_residence_related_documents",
      "title": "Residence-related documents",
      "place": "Assam",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence-related documents under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    },
    {
      "id": "assam_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Assam",
      "category": "agriculture",
      "dept": "Revenue & Disaster Management",
      "portal": "Sewa Setu (RTPS Assam)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Assam jurisdiction via Sewa Setu (RTPS Assam).",
      "whoCanApply": "Eligible residents/citizens in Assam meeting statutory rules."
    }
  ],
  "Bihar": [
    {
      "id": "bihar_residential_residence_certificate",
      "title": "Residential / Residence Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residential / Residence Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_caste_certificate",
      "title": "Caste Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_income_certificate",
      "title": "Income Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_ews_certificate",
      "title": "EWS Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_obc_bc_ebc_certificate",
      "title": "OBC / BC / EBC Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC / BC / EBC Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_non_creamy_layer_certificate_where_applicable",
      "title": "Non-Creamy Layer Certificate, where applicable",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate, where applicable under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_character_certificate",
      "title": "Character Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_birth_certificate",
      "title": "Birth Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_death_certificate",
      "title": "Death Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_domicile_residence_related_proof",
      "title": "Domicile/residence-related proof",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/residence-related proof under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_family_member_certificate",
      "title": "Family Member Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Family Member Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_land_possession_revenue_documents",
      "title": "Land possession/revenue documents",
      "place": "Bihar",
      "category": "agriculture",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land possession/revenue documents under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_mutation_related_documents",
      "title": "Mutation-related documents",
      "place": "Bihar",
      "category": "agriculture",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Mutation-related documents under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_land_records",
      "title": "Land records",
      "place": "Bihar",
      "category": "agriculture",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land records under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_agricultural_certificates",
      "title": "Agricultural certificates",
      "place": "Bihar",
      "category": "agriculture",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Land Possession Certificate (LPC)",
        "Bank Account Passbook",
        "Aadhaar Card"
      ],
      "description": "Official application for Agricultural certificates under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_disability_certificate_udid",
      "title": "Disability certificate/UDID",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Disability certificate/UDID under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    },
    {
      "id": "bihar_marriage_related_certificates",
      "title": "Marriage-related certificates",
      "place": "Bihar",
      "category": "certificates",
      "dept": "General Administration Department",
      "portal": "RTPS Bihar (ServicePlus)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Marriage Invitation Card",
        "Age Proofs of Both Spouses",
        "Three Witnesses Aadhaar Cards",
        "Joint Photo"
      ],
      "description": "Official application for Marriage-related certificates under Bihar jurisdiction via RTPS Bihar (ServicePlus).",
      "whoCanApply": "Eligible residents/citizens in Bihar meeting statutory rules."
    }
  ],
  "Chhattisgarh": [
    {
      "id": "chhattisgarh_domicile_residence_certificate",
      "title": "Domicile/Residence Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/Residence Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_caste_certificate",
      "title": "Caste Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_income_certificate",
      "title": "Income Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_birth_certificate",
      "title": "Birth Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_death_certificate",
      "title": "Death Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_character_certificate",
      "title": "Character Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Chhattisgarh",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Chhattisgarh",
      "category": "agriculture",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    },
    {
      "id": "chhattisgarh_farmer_agriculture_related_certificates",
      "title": "Farmer/agriculture-related certificates",
      "place": "Chhattisgarh",
      "category": "agriculture",
      "dept": "Revenue & Disaster Management",
      "portal": "e-District Chhattisgarh (CG Choice)",
      "importance": "★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Land Possession Certificate (LPC)",
        "Bank Account Passbook",
        "Aadhaar Card"
      ],
      "description": "Official application for Farmer/agriculture-related certificates under Chhattisgarh jurisdiction via e-District Chhattisgarh (CG Choice).",
      "whoCanApply": "Eligible residents/citizens in Chhattisgarh meeting statutory rules."
    }
  ],
  "Goa": [
    {
      "id": "goa_residence_domicile_certificate",
      "title": "Residence/Domicile Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence/Domicile Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_income_certificate",
      "title": "Income Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_caste_certificate",
      "title": "Caste Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_birth_certificate",
      "title": "Birth Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_death_certificate",
      "title": "Death Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_character_certificate",
      "title": "Character Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_marriage_certificate",
      "title": "Marriage Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Marriage Invitation Card",
        "Age Proofs of Both Spouses",
        "Three Witnesses Aadhaar Cards",
        "Joint Photo"
      ],
      "description": "Official application for Marriage Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Goa",
      "category": "certificates",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    },
    {
      "id": "goa_land_property_certificates",
      "title": "Land/property certificates",
      "place": "Goa",
      "category": "agriculture",
      "dept": "Collectorate & Civil Administration",
      "portal": "Goa Online Citizen Portal",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/property certificates under Goa jurisdiction via Goa Online Citizen Portal.",
      "whoCanApply": "Eligible residents/citizens in Goa meeting statutory rules."
    }
  ],
  "Gujarat": [
    {
      "id": "gujarat_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_caste_certificate",
      "title": "Caste Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_non_creamy_layer_certificate",
      "title": "Non-Creamy Layer Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_income_certificate",
      "title": "Income Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_ews_certificate",
      "title": "EWS Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_birth_certificate",
      "title": "Birth Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_death_certificate",
      "title": "Death Certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_widow_related_certificates",
      "title": "Widow-related certificates",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Widow-related certificates under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_legal_heir_certificate",
      "title": "Legal heir certificate",
      "place": "Gujarat",
      "category": "certificates",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal heir certificate under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Gujarat",
      "category": "agriculture",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    },
    {
      "id": "gujarat_farmer_certificates",
      "title": "Farmer certificates",
      "place": "Gujarat",
      "category": "agriculture",
      "dept": "Social Justice & Revenue",
      "portal": "Digital Gujarat Portal",
      "importance": "★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Land Possession Certificate (LPC)",
        "Bank Account Passbook",
        "Aadhaar Card"
      ],
      "description": "Official application for Farmer certificates under Gujarat jurisdiction via Digital Gujarat Portal.",
      "whoCanApply": "Eligible residents/citizens in Gujarat meeting statutory rules."
    }
  ],
  "Haryana": [
    {
      "id": "haryana_resident_domicile_certificate",
      "title": "Resident/Domicile Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Resident/Domicile Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_caste_certificate",
      "title": "Caste Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_obc_bc_certificate",
      "title": "OBC/BC Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC/BC Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_income_certificate",
      "title": "Income Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_ews_certificate",
      "title": "EWS Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_character_certificate",
      "title": "Character Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_family_id_parivar_related_records",
      "title": "Family ID/Parivar-related records",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Family ID/Parivar-related records under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Haryana",
      "category": "certificates",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    },
    {
      "id": "haryana_land_revenue_records",
      "title": "Land/revenue records",
      "place": "Haryana",
      "category": "agriculture",
      "dept": "Revenue & Citizen Resources Information",
      "portal": "Antyodaya SARAL Haryana",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue records under Haryana jurisdiction via Antyodaya SARAL Haryana.",
      "whoCanApply": "Eligible residents/citizens in Haryana meeting statutory rules."
    }
  ],
  "Himachal Pradesh": [
    {
      "id": "himachal_pradesh_bonafide_himachali_certificate",
      "title": "Bonafide Himachali Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Bonafide Himachali Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_domicile_residence_certificate",
      "title": "Domicile/Residence Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/Residence Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_caste_certificate",
      "title": "Caste Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_income_certificate",
      "title": "Income Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_obc_certificate",
      "title": "OBC Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_character_certificate",
      "title": "Character Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Himachal Pradesh",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    },
    {
      "id": "himachal_pradesh_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Himachal Pradesh",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-District Himachal Pradesh",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Himachal Pradesh jurisdiction via e-District Himachal Pradesh.",
      "whoCanApply": "Eligible residents/citizens in Himachal Pradesh meeting statutory rules."
    }
  ],
  "Jharkhand": [
    {
      "id": "jharkhand_local_resident_certificate",
      "title": "Local Resident Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Local Resident Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_caste_certificate",
      "title": "Caste Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_income_certificate",
      "title": "Income Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_ews_certificate",
      "title": "EWS Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_residential_certificate",
      "title": "Residential Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residential Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_birth_certificate",
      "title": "Birth Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_death_certificate",
      "title": "Death Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_character_certificate",
      "title": "Character Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Jharkhand",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    },
    {
      "id": "jharkhand_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Jharkhand",
      "category": "agriculture",
      "dept": "Personnel & Administrative Reforms",
      "portal": "JharSewa (e-District Jharkhand)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Jharkhand jurisdiction via JharSewa (e-District Jharkhand).",
      "whoCanApply": "Eligible residents/citizens in Jharkhand meeting statutory rules."
    }
  ],
  "Karnataka": [
    {
      "id": "karnataka_residence_domicile_related_certificate",
      "title": "Residence/Domicile-related certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence/Domicile-related certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_caste_certificate",
      "title": "Caste Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_income_certificate",
      "title": "Income Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_obc_category_certificate",
      "title": "OBC/Category Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC/Category Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_ews_certificate",
      "title": "EWS Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_non_creamy_layer_certificate",
      "title": "Non-Creamy Layer Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_birth_certificate",
      "title": "Birth Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_death_certificate",
      "title": "Death Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_character_certificate",
      "title": "Character Certificate",
      "place": "Karnataka",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    },
    {
      "id": "karnataka_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Karnataka",
      "category": "agriculture",
      "dept": "Revenue & Social Welfare",
      "portal": "Seva Sindhu Karnataka / Nadakacheri",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Karnataka jurisdiction via Seva Sindhu Karnataka / Nadakacheri.",
      "whoCanApply": "Eligible residents/citizens in Karnataka meeting statutory rules."
    }
  ],
  "Kerala": [
    {
      "id": "kerala_nativity_certificate",
      "title": "Nativity Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Nativity Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_domicile_residence_certificate",
      "title": "Domicile/Residence Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/Residence Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_community_caste_certificate",
      "title": "Community/Caste Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Community/Caste Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_income_certificate",
      "title": "Income Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_non_creamy_layer_certificate",
      "title": "Non-Creamy Layer Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_ews_certificate",
      "title": "EWS Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_birth_certificate",
      "title": "Birth Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_death_certificate",
      "title": "Death Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Kerala",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_possession_certificate",
      "title": "Possession Certificate",
      "place": "Kerala",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Possession Certificate under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    },
    {
      "id": "kerala_land_related_certificates",
      "title": "Land-related certificates",
      "place": "Kerala",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-District Kerala / Akshaya Centers",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land-related certificates under Kerala jurisdiction via e-District Kerala / Akshaya Centers.",
      "whoCanApply": "Eligible residents/citizens in Kerala meeting statutory rules."
    }
  ],
  "Madhya Pradesh": [
    {
      "id": "madhya_pradesh_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_caste_certificate",
      "title": "Caste Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_income_certificate",
      "title": "Income Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_obc_certificate",
      "title": "OBC Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_birth_certificate",
      "title": "Birth Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_death_certificate",
      "title": "Death Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_character_certificate",
      "title": "Character Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Madhya Pradesh",
      "category": "certificates",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    },
    {
      "id": "madhya_pradesh_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Madhya Pradesh",
      "category": "agriculture",
      "dept": "Public Service Management",
      "portal": "MP e-District / Samagra Portal",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Madhya Pradesh jurisdiction via MP e-District / Samagra Portal.",
      "whoCanApply": "Eligible residents/citizens in Madhya Pradesh meeting statutory rules."
    }
  ],
  "Maharashtra": [
    {
      "id": "maharashtra_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_caste_certificate",
      "title": "Caste Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_caste_validity_certificate",
      "title": "Caste Validity Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Validity Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_non_creamy_layer_certificate",
      "title": "Non-Creamy Layer Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_income_certificate",
      "title": "Income Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_ews_certificate",
      "title": "EWS Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_birth_certificate",
      "title": "Birth Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_death_certificate",
      "title": "Death Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_nationality_certificate",
      "title": "Nationality Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Nationality Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_resident_certificate",
      "title": "Resident Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Resident Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Maharashtra",
      "category": "certificates",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    },
    {
      "id": "maharashtra_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Maharashtra",
      "category": "agriculture",
      "dept": "Revenue & Social Justice Department",
      "portal": "Aaple Sarkar / MahaOnline",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Maharashtra jurisdiction via Aaple Sarkar / MahaOnline.",
      "whoCanApply": "Eligible residents/citizens in Maharashtra meeting statutory rules."
    }
  ],
  "Manipur": [
    {
      "id": "manipur_permanent_resident_residence_certificate",
      "title": "Permanent Resident/Residence Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Permanent Resident/Residence Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_scheduled_tribe_caste_certificate",
      "title": "Scheduled Tribe/Caste Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Scheduled Tribe/Caste Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_obc_related_certificate",
      "title": "OBC-related certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC-related certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_income_certificate",
      "title": "Income Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_ews_certificate",
      "title": "EWS Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_character_certificate",
      "title": "Character Certificate",
      "place": "Manipur",
      "category": "certificates",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    },
    {
      "id": "manipur_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Manipur",
      "category": "agriculture",
      "dept": "District Administration",
      "portal": "e-District Manipur",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Manipur jurisdiction via e-District Manipur.",
      "whoCanApply": "Eligible residents/citizens in Manipur meeting statutory rules."
    }
  ],
  "Meghalaya": [
    {
      "id": "meghalaya_permanent_resident_certificate",
      "title": "Permanent Resident Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Permanent Resident Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_scheduled_tribe_certificate",
      "title": "Scheduled Tribe Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Scheduled Tribe Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_income_certificate",
      "title": "Income Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_residence_certificate",
      "title": "Residence Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_birth_certificate",
      "title": "Birth Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_death_certificate",
      "title": "Death Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_character_certificate",
      "title": "Character Certificate",
      "place": "Meghalaya",
      "category": "certificates",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    },
    {
      "id": "meghalaya_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Meghalaya",
      "category": "agriculture",
      "dept": "General Administration",
      "portal": "ServicePlus Meghalaya",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Meghalaya jurisdiction via ServicePlus Meghalaya.",
      "whoCanApply": "Eligible residents/citizens in Meghalaya meeting statutory rules."
    }
  ],
  "Mizoram": [
    {
      "id": "mizoram_permanent_residential_certificate",
      "title": "Permanent Residential Certificate",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Permanent Residential Certificate under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_scheduled_tribe_certificate",
      "title": "Scheduled Tribe Certificate",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Scheduled Tribe Certificate under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_income_certificate",
      "title": "Income Certificate",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_residence_related_documents",
      "title": "Residence-related documents",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence-related documents under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_character_certificate",
      "title": "Character Certificate",
      "place": "Mizoram",
      "category": "certificates",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    },
    {
      "id": "mizoram_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Mizoram",
      "category": "agriculture",
      "dept": "District Administration & Revenue",
      "portal": "e-District Mizoram",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Mizoram jurisdiction via e-District Mizoram.",
      "whoCanApply": "Eligible residents/citizens in Mizoram meeting statutory rules."
    }
  ],
  "Nagaland": [
    {
      "id": "nagaland_indigenous_inhabitant_certificate",
      "title": "Indigenous Inhabitant Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Indigenous Inhabitant Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_indigenous_tribal_certificate",
      "title": "Indigenous/Tribal Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Indigenous/Tribal Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_permanent_residence_related_certificate",
      "title": "Permanent Residence-related certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Permanent Residence-related certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_income_certificate",
      "title": "Income Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_birth_certificate",
      "title": "Birth Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_death_certificate",
      "title": "Death Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_character_certificate",
      "title": "Character Certificate",
      "place": "Nagaland",
      "category": "certificates",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    },
    {
      "id": "nagaland_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Nagaland",
      "category": "agriculture",
      "dept": "Home & Personnel Department",
      "portal": "e-District Nagaland",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Nagaland jurisdiction via e-District Nagaland.",
      "whoCanApply": "Eligible residents/citizens in Nagaland meeting statutory rules."
    }
  ],
  "Odisha": [
    {
      "id": "odisha_resident_certificate",
      "title": "Resident Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Resident Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_caste_certificate",
      "title": "Caste Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_obc_sebc_certificate",
      "title": "OBC/SEBC Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC/SEBC Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_income_certificate",
      "title": "Income Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_ews_certificate",
      "title": "EWS Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_birth_certificate",
      "title": "Birth Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_death_certificate",
      "title": "Death Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_character_certificate",
      "title": "Character Certificate",
      "place": "Odisha",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    },
    {
      "id": "odisha_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Odisha",
      "category": "agriculture",
      "dept": "Revenue & Disaster Management",
      "portal": "Odisha Right to Public Services (ORTPSA)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Odisha jurisdiction via Odisha Right to Public Services (ORTPSA).",
      "whoCanApply": "Eligible residents/citizens in Odisha meeting statutory rules."
    }
  ],
  "Punjab": [
    {
      "id": "punjab_residence_domicile_certificate",
      "title": "Residence/Domicile Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence/Domicile Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_caste_certificate",
      "title": "Caste Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_backward_class_certificate",
      "title": "Backward Class Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Backward Class Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_income_certificate",
      "title": "Income Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_ews_certificate",
      "title": "EWS Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_birth_certificate",
      "title": "Birth Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_death_certificate",
      "title": "Death Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_character_certificate",
      "title": "Character Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Punjab",
      "category": "certificates",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    },
    {
      "id": "punjab_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Punjab",
      "category": "agriculture",
      "dept": "Governance Reforms & Revenue",
      "portal": "Sewa Kendra Punjab (e-Sewa)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Punjab jurisdiction via Sewa Kendra Punjab (e-Sewa).",
      "whoCanApply": "Eligible residents/citizens in Punjab meeting statutory rules."
    }
  ],
  "Rajasthan": [
    {
      "id": "rajasthan_domicile_bonafide_certificate",
      "title": "Domicile/Bonafide Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/Bonafide Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_caste_certificate",
      "title": "Caste Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_obc_mbc_certificate",
      "title": "OBC/MBC Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC/MBC Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_non_creamy_layer_certificate",
      "title": "Non-Creamy Layer Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Non-Creamy Layer Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_income_certificate",
      "title": "Income Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_ews_certificate",
      "title": "EWS Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_birth_certificate",
      "title": "Birth Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_death_certificate",
      "title": "Death Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_character_certificate",
      "title": "Character Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Rajasthan",
      "category": "certificates",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    },
    {
      "id": "rajasthan_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Rajasthan",
      "category": "agriculture",
      "dept": "DoIT&C & Revenue Department",
      "portal": "e-Mitra Rajasthan",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Rajasthan jurisdiction via e-Mitra Rajasthan.",
      "whoCanApply": "Eligible residents/citizens in Rajasthan meeting statutory rules."
    }
  ],
  "Sikkim": [
    {
      "id": "sikkim_sikkim_subject_certificate",
      "title": "Sikkim Subject Certificate",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Sikkim Subject Certificate under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_certificate_of_identification",
      "title": "Certificate of Identification",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Certificate of Identification under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_residential_certificate",
      "title": "Residential Certificate",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residential Certificate under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_caste_certificate",
      "title": "Caste Certificate",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_income_certificate",
      "title": "Income Certificate",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Sikkim",
      "category": "certificates",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    },
    {
      "id": "sikkim_land_property_related_documents",
      "title": "Land/property-related documents",
      "place": "Sikkim",
      "category": "agriculture",
      "dept": "Land Revenue & Disaster Management",
      "portal": "e-District Sikkim",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/property-related documents under Sikkim jurisdiction via e-District Sikkim.",
      "whoCanApply": "Eligible residents/citizens in Sikkim meeting statutory rules."
    }
  ],
  "Tamil Nadu": [
    {
      "id": "tamil_nadu_nativity_certificate",
      "title": "Nativity Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Nativity Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_community_certificate",
      "title": "Community Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Community Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_income_certificate",
      "title": "Income Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_ews_certificate",
      "title": "EWS Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_residence_certificate",
      "title": "Residence Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_birth_certificate",
      "title": "Birth Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_death_certificate",
      "title": "Death Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_first_graduate_certificate",
      "title": "First Graduate Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for First Graduate Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_solvency_certificate",
      "title": "Solvency Certificate",
      "place": "Tamil Nadu",
      "category": "certificates",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Solvency Certificate under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    },
    {
      "id": "tamil_nadu_agricultural_revenue_certificates",
      "title": "Agricultural/revenue certificates",
      "place": "Tamil Nadu",
      "category": "agriculture",
      "dept": "Revenue & Disaster Management",
      "portal": "TNeGA e-Sevai Portal",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Agricultural/revenue certificates under Tamil Nadu jurisdiction via TNeGA e-Sevai Portal.",
      "whoCanApply": "Eligible residents/citizens in Tamil Nadu meeting statutory rules."
    }
  ],
  "Telangana": [
    {
      "id": "telangana_integrated_certificate",
      "title": "Integrated Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Integrated Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_residence_certificate",
      "title": "Residence Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_income_certificate",
      "title": "Income Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_caste_certificate",
      "title": "Caste Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_ews_certificate",
      "title": "EWS Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_birth_certificate",
      "title": "Birth Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_death_certificate",
      "title": "Death Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_family_member_certificate",
      "title": "Family Member Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Family Member Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Telangana",
      "category": "certificates",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    },
    {
      "id": "telangana_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Telangana",
      "category": "agriculture",
      "dept": "Revenue & Social Welfare",
      "portal": "MeeSeva Telangana",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Telangana jurisdiction via MeeSeva Telangana.",
      "whoCanApply": "Eligible residents/citizens in Telangana meeting statutory rules."
    }
  ],
  "Tripura": [
    {
      "id": "tripura_permanent_resident_of_tripura_certificate_prtc",
      "title": "Permanent Resident of Tripura Certificate (PRTC)",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Permanent Resident of Tripura Certificate (PRTC) under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_caste_tribe_certificate",
      "title": "Caste/Tribe Certificate",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste/Tribe Certificate under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_income_certificate",
      "title": "Income Certificate",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_residence_certificate",
      "title": "Residence Certificate",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_birth_death_certificate",
      "title": "Birth/Death Certificate",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth/Death Certificate under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_character_certificate",
      "title": "Character Certificate",
      "place": "Tripura",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    },
    {
      "id": "tripura_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Tripura",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-District Tripura (e-Seva)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Tripura jurisdiction via e-District Tripura (e-Seva).",
      "whoCanApply": "Eligible residents/citizens in Tripura meeting statutory rules."
    }
  ],
  "Uttar Pradesh": [
    {
      "id": "uttar_pradesh_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_caste_certificate",
      "title": "Caste Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_income_certificate",
      "title": "Income Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_birth_certificate",
      "title": "Birth Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_death_certificate",
      "title": "Death Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_character_certificate",
      "title": "Character Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_residence_certificate",
      "title": "Residence Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_family_register_related_documents",
      "title": "Family Register-related documents",
      "place": "Uttar Pradesh",
      "category": "certificates",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Family Register-related documents under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    },
    {
      "id": "uttar_pradesh_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "Uttar Pradesh",
      "category": "agriculture",
      "dept": "Revenue Department & Board of Revenue",
      "portal": "e-District UP / Jan Seva Kendra",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under Uttar Pradesh jurisdiction via e-District UP / Jan Seva Kendra.",
      "whoCanApply": "Eligible residents/citizens in Uttar Pradesh meeting statutory rules."
    }
  ],
  "Uttarakhand": [
    {
      "id": "uttarakhand_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_caste_certificate",
      "title": "Caste Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_income_certificate",
      "title": "Income Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_ews_certificate",
      "title": "EWS Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_permanent_residence_related_certificate",
      "title": "Permanent Residence-related certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Permanent Residence-related certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_character_certificate",
      "title": "Character Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_hill_area_certificate",
      "title": "Hill Area Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Hill Area Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_birth_certificate",
      "title": "Birth Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_death_certificate",
      "title": "Death Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_legal_heir_varisan_certificate",
      "title": "Legal Heir/Varisan Certificate",
      "place": "Uttarakhand",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir/Varisan Certificate under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    },
    {
      "id": "uttarakhand_land_revenue_certificates",
      "title": "Land/revenue certificates",
      "place": "Uttarakhand",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-District Uttarakhand / Apuni Sarkar",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue certificates under Uttarakhand jurisdiction via e-District Uttarakhand / Apuni Sarkar.",
      "whoCanApply": "Eligible residents/citizens in Uttarakhand meeting statutory rules."
    }
  ],
  "West Bengal": [
    {
      "id": "west_bengal_domicile_residential_certificate",
      "title": "Domicile/Residential Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile/Residential Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_caste_certificate",
      "title": "Caste Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_obc_certificate",
      "title": "OBC Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for OBC Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_income_certificate",
      "title": "Income Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_ews_certificate",
      "title": "EWS Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_birth_certificate",
      "title": "Birth Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_death_certificate",
      "title": "Death Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_character_certificate",
      "title": "Character Certificate",
      "place": "West Bengal",
      "category": "certificates",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    },
    {
      "id": "west_bengal_land_revenue_documents",
      "title": "Land/revenue documents",
      "place": "West Bengal",
      "category": "agriculture",
      "dept": "Personnel & Administrative Reforms",
      "portal": "WB e-District Portal",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land/revenue documents under West Bengal jurisdiction via WB e-District Portal.",
      "whoCanApply": "Eligible residents/citizens in West Bengal meeting statutory rules."
    }
  ],
  "Andaman & Nicobar Islands": [
    {
      "id": "andaman_nicobar_islands_local_resident_certificate",
      "title": "Local Resident Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Local Resident Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    },
    {
      "id": "andaman_nicobar_islands_tribal_certificate",
      "title": "Tribal Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Tribal Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    },
    {
      "id": "andaman_nicobar_islands_income_certificate",
      "title": "Income Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    },
    {
      "id": "andaman_nicobar_islands_ews_certificate",
      "title": "EWS Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    },
    {
      "id": "andaman_nicobar_islands_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    },
    {
      "id": "andaman_nicobar_islands_character_certificate",
      "title": "Character Certificate",
      "place": "Andaman & Nicobar Islands",
      "category": "certificates",
      "dept": "Revenue Administration",
      "portal": "e-District Andaman",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Andaman & Nicobar Islands jurisdiction via e-District Andaman.",
      "whoCanApply": "Eligible residents/citizens in Andaman & Nicobar Islands meeting statutory rules."
    }
  ],
  "Chandigarh": [
    {
      "id": "chandigarh_residence_certificate",
      "title": "Residence Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Residence Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_caste_obc_certificate",
      "title": "Caste / OBC Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste / OBC Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_income_certificate",
      "title": "Income Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_senior_citizen_card",
      "title": "Senior Citizen Card",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Senior Citizen Card under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    },
    {
      "id": "chandigarh_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Chandigarh",
      "category": "certificates",
      "dept": "Chandigarh Administration",
      "portal": "e-District Chandigarh / Sampark",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Chandigarh jurisdiction via e-District Chandigarh / Sampark.",
      "whoCanApply": "Eligible residents/citizens in Chandigarh meeting statutory rules."
    }
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_domicile_residence_certificate",
      "title": "Domicile / Residence Certificate",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "certificates",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile / Residence Certificate under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    },
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_caste_tribe_certificate",
      "title": "Caste / Tribe Certificate",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "certificates",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Caste / Tribe Certificate under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    },
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_income_certificate",
      "title": "Income Certificate",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "certificates",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    },
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_ews_certificate",
      "title": "EWS Certificate",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "certificates",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    },
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "certificates",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    },
    {
      "id": "dadra_and_nagar_haveli_and_daman_and_diu_land_revenue_certificates",
      "title": "Land / Revenue Certificates",
      "place": "Dadra and Nagar Haveli and Daman and Diu",
      "category": "agriculture",
      "dept": "UT Administration",
      "portal": "e-District DNH & DD",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land / Revenue Certificates under Dadra and Nagar Haveli and Daman and Diu jurisdiction via e-District DNH & DD.",
      "whoCanApply": "Eligible residents/citizens in Dadra and Nagar Haveli and Daman and Diu meeting statutory rules."
    }
  ],
  "Delhi": [
    {
      "id": "delhi_domicile_certificate",
      "title": "Domicile Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_sc_st_obc_certificate",
      "title": "SC / ST / OBC Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for SC / ST / OBC Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_income_certificate",
      "title": "Income Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_ews_certificate",
      "title": "EWS Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_birth_certificate",
      "title": "Birth Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_death_certificate",
      "title": "Death Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_lal_dora_certificate",
      "title": "Lal Dora Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Lal Dora Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_delayed_birth_death_order",
      "title": "Delayed Birth/Death Order",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Delayed Birth/Death Order under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_surviving_member_certificate",
      "title": "Surviving Member Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Surviving Member Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    },
    {
      "id": "delhi_disability_certificate",
      "title": "Disability Certificate",
      "place": "Delhi",
      "category": "certificates",
      "dept": "Revenue Department, Govt of NCT of Delhi",
      "portal": "e-District Delhi",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Disability Certificate under Delhi jurisdiction via e-District Delhi.",
      "whoCanApply": "Eligible residents/citizens in Delhi meeting statutory rules."
    }
  ],
  "Jammu & Kashmir": [
    {
      "id": "jammu_kashmir_domicile_certificate_j_k",
      "title": "Domicile Certificate (J&K)",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Domicile Certificate (J&K) under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_category_caste_certificate_rba_alc_ib_sc_st_osc",
      "title": "Category / Caste Certificate (RBA, ALC/IB, SC, ST, OSC)",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Category / Caste Certificate (RBA, ALC/IB, SC, ST, OSC) under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_income_certificate",
      "title": "Income Certificate",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_ews_certificate",
      "title": "EWS Certificate",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_dependent_certificate",
      "title": "Dependent Certificate",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Dependent Certificate under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_revenue_land_extracts_fard_jamabandi",
      "title": "Revenue / Land Extracts (Fard, Jamabandi)",
      "place": "Jammu & Kashmir",
      "category": "agriculture",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Revenue / Land Extracts (Fard, Jamabandi) under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    },
    {
      "id": "jammu_kashmir_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Jammu & Kashmir",
      "category": "certificates",
      "dept": "Revenue Department",
      "portal": "e-UNNAT Jammu & Kashmir",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Jammu & Kashmir jurisdiction via e-UNNAT Jammu & Kashmir.",
      "whoCanApply": "Eligible residents/citizens in Jammu & Kashmir meeting statutory rules."
    }
  ],
  "Ladakh": [
    {
      "id": "ladakh_resident_certificate_ladakh",
      "title": "Resident Certificate (Ladakh)",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Resident Certificate (Ladakh) under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_st_certificate",
      "title": "ST Certificate",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for ST Certificate under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_income_certificate",
      "title": "Income Certificate",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_ews_certificate",
      "title": "EWS Certificate",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_character_certificate",
      "title": "Character Certificate",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Ladakh",
      "category": "certificates",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    },
    {
      "id": "ladakh_land_record_revenue_documents",
      "title": "Land Record / Revenue Documents",
      "place": "Ladakh",
      "category": "agriculture",
      "dept": "UT Administration of Ladakh",
      "portal": "e-District Ladakh",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land Record / Revenue Documents under Ladakh jurisdiction via e-District Ladakh.",
      "whoCanApply": "Eligible residents/citizens in Ladakh meeting statutory rules."
    }
  ],
  "Lakshadweep": [
    {
      "id": "lakshadweep_permanent_resident_certificate",
      "title": "Permanent Resident Certificate",
      "place": "Lakshadweep",
      "category": "certificates",
      "dept": "Directorate of Planning & Statistics",
      "portal": "e-District Lakshadweep",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Permanent Resident Certificate under Lakshadweep jurisdiction via e-District Lakshadweep.",
      "whoCanApply": "Eligible residents/citizens in Lakshadweep meeting statutory rules."
    },
    {
      "id": "lakshadweep_st_certificate",
      "title": "ST Certificate",
      "place": "Lakshadweep",
      "category": "certificates",
      "dept": "Directorate of Planning & Statistics",
      "portal": "e-District Lakshadweep",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for ST Certificate under Lakshadweep jurisdiction via e-District Lakshadweep.",
      "whoCanApply": "Eligible residents/citizens in Lakshadweep meeting statutory rules."
    },
    {
      "id": "lakshadweep_income_certificate",
      "title": "Income Certificate",
      "place": "Lakshadweep",
      "category": "certificates",
      "dept": "Directorate of Planning & Statistics",
      "portal": "e-District Lakshadweep",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Lakshadweep jurisdiction via e-District Lakshadweep.",
      "whoCanApply": "Eligible residents/citizens in Lakshadweep meeting statutory rules."
    },
    {
      "id": "lakshadweep_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Lakshadweep",
      "category": "certificates",
      "dept": "Directorate of Planning & Statistics",
      "portal": "e-District Lakshadweep",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Lakshadweep jurisdiction via e-District Lakshadweep.",
      "whoCanApply": "Eligible residents/citizens in Lakshadweep meeting statutory rules."
    },
    {
      "id": "lakshadweep_inter_island_permit",
      "title": "Inter-Island Permit",
      "place": "Lakshadweep",
      "category": "agriculture",
      "dept": "Directorate of Planning & Statistics",
      "portal": "e-District Lakshadweep",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Inter-Island Permit under Lakshadweep jurisdiction via e-District Lakshadweep.",
      "whoCanApply": "Eligible residents/citizens in Lakshadweep meeting statutory rules."
    }
  ],
  "Puducherry": [
    {
      "id": "puducherry_nativity_residence_certificate",
      "title": "Nativity / Residence Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Continuous Stay Proof (10-15 Years)",
        "Electricity Bill / Ration Card",
        "Passport Photo"
      ],
      "description": "Official application for Nativity / Residence Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    },
    {
      "id": "puducherry_community_certificate",
      "title": "Community Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Community Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    },
    {
      "id": "puducherry_income_certificate",
      "title": "Income Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    },
    {
      "id": "puducherry_ews_certificate",
      "title": "EWS Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for EWS Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    },
    {
      "id": "puducherry_birth_death_certificate",
      "title": "Birth / Death Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth / Death Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    },
    {
      "id": "puducherry_legal_heir_certificate",
      "title": "Legal Heir Certificate",
      "place": "Puducherry",
      "category": "certificates",
      "dept": "Department of Revenue & Disaster Management",
      "portal": "e-District Puducherry",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir Certificate under Puducherry jurisdiction via e-District Puducherry.",
      "whoCanApply": "Eligible residents/citizens in Puducherry meeting statutory rules."
    }
  ],
  "Central Government": [
    {
      "id": "central_government_aadhaar_card",
      "title": "Aadhaar Card",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Aadhaar Card under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_pan_card",
      "title": "PAN Card",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for PAN Card under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_passport",
      "title": "Passport",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Passport under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_voter_id_epic_card",
      "title": "Voter ID / EPIC Card",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Voter ID / EPIC Card under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_government_employee_id",
      "title": "Government Employee ID",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Government Employee ID under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_citizenship_certificate",
      "title": "Citizenship Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Citizenship Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Identity & Citizenship"
    },
    {
      "id": "central_government_birth_certificate",
      "title": "Birth Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Discharge Card / Doctor Slip",
        "Parents Aadhaar Card",
        "Marriage Certificate"
      ],
      "description": "Official application for Birth Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Civil Registration"
    },
    {
      "id": "central_government_death_certificate",
      "title": "Death Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Hospital Death Summary / Cremation Slip",
        "Applicant Aadhaar Card",
        "Deceased Aadhaar Card"
      ],
      "description": "Official application for Death Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Civil Registration"
    },
    {
      "id": "central_government_marriage_certificate",
      "title": "Marriage Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Marriage Invitation Card",
        "Age Proofs of Both Spouses",
        "Three Witnesses Aadhaar Cards",
        "Joint Photo"
      ],
      "description": "Official application for Marriage Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Civil Registration"
    },
    {
      "id": "central_government_adoption_deed_certificate",
      "title": "Adoption Deed / Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Adoption Deed / Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Civil Registration"
    },
    {
      "id": "central_government_legal_heir_succession_certificate",
      "title": "Legal Heir / Succession Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★",
      "time": "15 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Deceased Death Certificate",
        "Legal Heirs Aadhaar Cards",
        "Ration Card",
        "Notarized Family Affidavit"
      ],
      "description": "Official application for Legal Heir / Succession Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Civil Registration"
    },
    {
      "id": "central_government_central_sc_certificate",
      "title": "Central SC Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Central SC Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_central_st_certificate",
      "title": "Central ST Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Central ST Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_central_obc_non_creamy_layer_certificate",
      "title": "Central OBC Non-Creamy Layer Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Central OBC Non-Creamy Layer Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_central_ews_certificate",
      "title": "Central EWS Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Income Certificate",
        "Land / Property Holding Declaration",
        "Family Photo"
      ],
      "description": "Official application for Central EWS Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_disability_certificate",
      "title": "Disability Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Disability Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_udid_smart_card",
      "title": "UDID Smart Card",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for UDID Smart Card under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Social Category"
    },
    {
      "id": "central_government_pan_card",
      "title": "PAN Card",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for PAN Card under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_income_certificate",
      "title": "Income Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_income_asset_certificate",
      "title": "Income & Asset Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 10 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ration Card / Electricity Bill",
        "Salary Slip / Patwari Income Report",
        "Passport Photo"
      ],
      "description": "Official application for Income & Asset Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_bank_account_passbook_statement",
      "title": "Bank Account Passbook / Statement",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Bank Account Passbook / Statement under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_form_16_itr_acknowledgement",
      "title": "Form 16 / ITR Acknowledgement",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Form 16 / ITR Acknowledgement under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_gst_registration_business",
      "title": "GST Registration (Business)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for GST Registration (Business) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_udyam_registration_msme",
      "title": "Udyam Registration (MSME)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Udyam Registration (MSME) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Financial"
    },
    {
      "id": "central_government_10th_marksheet_passing_certificate",
      "title": "10th Marksheet & Passing Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for 10th Marksheet & Passing Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_12th_marksheet_passing_certificate",
      "title": "12th Marksheet & Passing Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for 12th Marksheet & Passing Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_graduation_degree_certificate",
      "title": "Graduation Degree Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Graduation Degree Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_diploma_certificate",
      "title": "Diploma Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Diploma Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_transfer_certificate_tc",
      "title": "Transfer Certificate (TC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Transfer Certificate (TC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_migration_certificate",
      "title": "Migration Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Migration Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_college_bonafide_certificate",
      "title": "College Bonafide Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for College Bonafide Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_scholarship_eligibility_proof",
      "title": "Scholarship Eligibility Proof",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Scholarship Eligibility Proof under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Education"
    },
    {
      "id": "central_government_employment_experience_certificate",
      "title": "Employment / Experience Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Employment / Experience Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_character_certificate",
      "title": "Character Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★",
      "time": "5 - 7 Days",
      "govFee": 1,
      "steps": "3 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Local Police Verification / Gazetted Officer Attestation",
        "Passport Photo"
      ],
      "description": "Official application for Character Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_police_verification_certificate_pcc",
      "title": "Police Verification Certificate (PCC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Police Verification Certificate (PCC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_skill_apprenticeship_certificate",
      "title": "Skill & Apprenticeship Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Skill & Apprenticeship Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_employment_exchange_registration",
      "title": "Employment Exchange Registration",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Employment Exchange Registration under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_noc_no_objection_certificate",
      "title": "NOC (No Objection Certificate)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for NOC (No Objection Certificate) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Employment"
    },
    {
      "id": "central_government_registered_sale_deed",
      "title": "Registered Sale Deed",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Registered Sale Deed under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_title_deed",
      "title": "Title Deed",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Title Deed under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_encumbrance_certificate_ec",
      "title": "Encumbrance Certificate (EC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Encumbrance Certificate (EC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_land_record_ror_khasra_khatauni",
      "title": "Land Record / RoR (Khasra/Khatauni)",
      "place": "Central Government",
      "category": "agriculture",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Land Record / RoR (Khasra/Khatauni) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_mutation_certificate",
      "title": "Mutation Certificate",
      "place": "Central Government",
      "category": "agriculture",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Mutation Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_property_tax_receipt",
      "title": "Property Tax Receipt",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Property Tax Receipt under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_possession_certificate",
      "title": "Possession Certificate",
      "place": "Central Government",
      "category": "agriculture",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★",
      "time": "14 - 21 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Sale Deed / Title Document",
        "Current Khatauni / RoR Copy",
        "Latest Land Revenue Receipt",
        "Aadhaar Card"
      ],
      "description": "Official application for Possession Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_sanctioned_building_plan",
      "title": "Sanctioned Building Plan",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Sanctioned Building Plan under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Property & Land"
    },
    {
      "id": "central_government_registration_certificate_rc",
      "title": "Registration Certificate (RC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Registration Certificate (RC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_driving_licence_smart_card",
      "title": "Driving Licence (Smart Card)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Driving Licence (Smart Card) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_learner_s_licence_ll",
      "title": "Learner's Licence (LL)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Learner's Licence (LL) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_vehicle_insurance_policy",
      "title": "Vehicle Insurance Policy",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Vehicle Insurance Policy under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_pollution_under_control_puc",
      "title": "Pollution Under Control (PUC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Pollution Under Control (PUC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_commercial_fitness_certificate",
      "title": "Commercial Fitness Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Commercial Fitness Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Vehicle"
    },
    {
      "id": "central_government_business_pan",
      "title": "Business PAN",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Business PAN under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_gst_registration_certificate",
      "title": "GST Registration Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for GST Registration Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_udyam_registration_certificate",
      "title": "Udyam Registration Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Udyam Registration Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_shop_establishment_licence",
      "title": "Shop & Establishment Licence",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Shop & Establishment Licence under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_fssai_food_licence_registration",
      "title": "FSSAI Food Licence / Registration",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for FSSAI Food Licence / Registration under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_professional_tax_registration",
      "title": "Professional Tax Registration",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "10 - 15 Days",
      "govFee": 1,
      "steps": "5 steps",
      "docsRequired": [
        "Aadhaar Card",
        "Ancestral Record (Pre-1950/1967/Land Record)",
        "Affidavit",
        "Passport Photo"
      ],
      "description": "Official application for Professional Tax Registration under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_import_export_code_iec",
      "title": "Import Export Code (IEC)",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Import Export Code (IEC) under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    },
    {
      "id": "central_government_company_llp_incorporation_certificate",
      "title": "Company / LLP Incorporation Certificate",
      "place": "Central Government",
      "category": "certificates",
      "dept": "Government of India",
      "portal": "National Government Services Portal (services.india.gov.in)",
      "importance": "★★★★★",
      "time": "7 - 14 Days",
      "govFee": 1,
      "steps": "4 steps",
      "docsRequired": [
        "Aadhaar Card (Identity Proof)",
        "Address Proof (Ration Card/Electricity Bill)",
        "Passport Size Photo"
      ],
      "description": "Official application for Company / LLP Incorporation Certificate under Central Government jurisdiction via National Government Services Portal (services.india.gov.in).",
      "whoCanApply": "Eligible residents/citizens in Central Government meeting statutory rules.",
      "central_category": "Business"
    }
  ]
};

// ── 4. Central Documents by PRD Functional Domains ──────────────────
const CENTRAL_DOCUMENTS_BY_DOMAIN = {
  "Identity & Citizenship": [
    "Aadhaar Card",
    "PAN Card",
    "Passport",
    "Voter ID / EPIC Card",
    "Government Employee ID",
    "Citizenship Certificate"
  ],
  "Civil Registration": [
    "Birth Certificate",
    "Death Certificate",
    "Marriage Certificate",
    "Adoption Deed / Certificate",
    "Legal Heir / Succession Certificate"
  ],
  "Social Category": [
    "Central SC Certificate",
    "Central ST Certificate",
    "Central OBC Non-Creamy Layer Certificate",
    "Central EWS Certificate",
    "Disability Certificate",
    "UDID Smart Card"
  ],
  "Financial": [
    "PAN Card",
    "Income Certificate",
    "Income & Asset Certificate",
    "Bank Account Passbook / Statement",
    "Form 16 / ITR Acknowledgement",
    "GST Registration (Business)",
    "Udyam Registration (MSME)"
  ],
  "Education": [
    "10th Marksheet & Passing Certificate",
    "12th Marksheet & Passing Certificate",
    "Graduation Degree Certificate",
    "Diploma Certificate",
    "Transfer Certificate (TC)",
    "Migration Certificate",
    "College Bonafide Certificate",
    "Scholarship Eligibility Proof"
  ],
  "Employment": [
    "Employment / Experience Certificate",
    "Character Certificate",
    "Police Verification Certificate (PCC)",
    "Skill & Apprenticeship Certificate",
    "Employment Exchange Registration",
    "NOC (No Objection Certificate)"
  ],
  "Property & Land": [
    "Registered Sale Deed",
    "Title Deed",
    "Encumbrance Certificate (EC)",
    "Land Record / RoR (Khasra/Khatauni)",
    "Mutation Certificate",
    "Property Tax Receipt",
    "Possession Certificate",
    "Sanctioned Building Plan"
  ],
  "Vehicle": [
    "Registration Certificate (RC)",
    "Driving Licence (Smart Card)",
    "Learner's Licence (LL)",
    "Vehicle Insurance Policy",
    "Pollution Under Control (PUC)",
    "Commercial Fitness Certificate"
  ],
  "Business": [
    "Business PAN",
    "GST Registration Certificate",
    "Udyam Registration Certificate",
    "Shop & Establishment Licence",
    "FSSAI Food Licence / Registration",
    "Professional Tax Registration",
    "Import Export Code (IEC)",
    "Company / LLP Incorporation Certificate"
  ]
};

// ── 5. Place Documents Query & Application Engine ───────────────────────────
const PlaceDocsEngine = {
  // Get all registered places (States, UTs, Central)
  getAllPlaces() {
    return PLACES_DIRECTORY;
  },

  // Get places filtered by type ('state', 'ut', 'central', 'all')
  getPlacesByType(type = 'all') {
    if (type === 'all') return PLACES_DIRECTORY;
    return PLACES_DIRECTORY.filter(p => p.type === type);
  },

  // Get documents list for a specific place
  getDocumentsForPlace(placeName) {
    if (!placeName || placeName === 'all' || placeName === 'All States & UTs') {
      // Return combined popular documents across places + core docs
      return PLACE_DOCUMENTS_DB['Central Government'] || [];
    }
    return PLACE_DOCUMENTS_DB[placeName] || [];
  },

  // Find specific document by ID across all places
  findDocumentById(docId) {
    for (const place in PLACE_DOCUMENTS_DB) {
      const match = PLACE_DOCUMENTS_DB[place].find(d => d.id === docId);
      if (match) return match;
    }
    return null;
  },

  // Search documents within a place or nationwide
  searchDocuments(placeName, query, category = 'all') {
    let docs = this.getDocumentsForPlace(placeName);
    if (category && category !== 'all') {
      docs = docs.filter(d => d.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) ||
        d.dept.toLowerCase().includes(q)
      );
    }
    return docs;
  },

  // Get metadata for a place
  getPlaceMetadata(placeName) {
    return PLACES_DIRECTORY.find(p => p.name === placeName) || {
      name: placeName,
      type: 'state',
      portal: `${placeName} Citizen Portal`,
      dept: 'State Administration'
    };
  }
};

// Export to window scope for seamless global access
if (typeof window !== 'undefined') {
  window.CORE_DOCUMENTS_PRD = CORE_DOCUMENTS_PRD;
  window.PLACES_DIRECTORY = PLACES_DIRECTORY;
  window.PLACE_DOCUMENTS_DB = PLACE_DOCUMENTS_DB;
  window.CENTRAL_DOCUMENTS_BY_DOMAIN = CENTRAL_DOCUMENTS_BY_DOMAIN;
  window.PlaceDocsEngine = PlaceDocsEngine;
}
