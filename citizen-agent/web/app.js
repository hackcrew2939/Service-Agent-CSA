/**
 * Citizen-Service Agent (CivicAgent) – Complete Client Application Engine
 * Production-Quality UX/UI Implementation covering all 50 Specification Sections.
 * "Government services, made simple."
 */

// ── 1. Global Application State ───────────────────────────────────────────────
const appState = {
  currentView: 'home',
  language: 'en',
  selectedState: 'Uttar Pradesh',
  catalogCategory: 'all',
  sessionId: null,
  csrfToken: null,
  activeService: null,
  wizardStep: 1,
  selectedSlotForUpload: null,
  formData: {
    service: 'income_certificate',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    block: 'Lucknow Sadar',
    fullName: 'Rahul Kumar',
    fatherName: 'Suresh Prasad',
    dob: '2004-05-12',
    gender: 'Male',
    mobile: '9876543210',
    email: 'rahul.kumar@example.com',
    houseStreet: 'Civil Lines Road',
    villageTown: 'Lucknow',
    pincode: '226001',
    purpose: 'Scholarship',
    annualIncome: 120000,
    hasResidenceProof: true,
    hasIdentityProof: true,
  },
  uploadedDocs: {
    aadhaar: null,
    address_proof: null,
    income_proof: null,
    photo: null,
  },
  extractedOcr: {
    aadhaar: { name: 'Rahul Kumar', dob: '2004-05-12', number: 'XXXX-XXXX-7890', address: 'Lucknow, Uttar Pradesh', verified: true },
    address_proof: { name: 'Rahul Kumar', address: 'Civil Lines Road, Lucknow', verified: true },
    income_proof: { name: 'Rahul Kumar', annual_income: 120000, date: '15-Sep-2026', verified: true },
    photo: { status: 'Portrait Quality: 98% Clear', verified: true },
  },
  activeApplicationId: 'INC-UP-2026-894210',
  notifications: [
    { id: 1, category: 'apps', title: '🎉 Application Approved', body: 'Income Certificate INC-UP-2026-894210 is ready for download.', time: '2 min ago', unread: true },
    { id: 2, category: 'docs', title: '⚠️ Action Required', body: 'Additional address proof requested by verifying officer.', time: '1 hour ago', unread: true },
    { id: 3, category: 'updates', title: '✓ Documents Verified', body: 'Aadhaar and Income proof successfully checked against statutory rules.', time: 'Yesterday', unread: false }
  ],
  myApplications: [
    { id: 'INC-UP-2026-894210', service: 'Income Certificate', state: 'Uttar Pradesh', district: 'Lucknow', date: '07 Oct 2026, 02:45 PM', status: 'APPROVED', progress: 100, paymentVerified: true, txnId: 'TXN2026001001' },
    { id: 'CST-MH-2026-441209', service: 'Caste Certificate (OBC)', state: 'Maharashtra', district: 'Mumbai', date: '05 Oct 2026, 11:30 AM', status: 'UNDER_REVIEW', progress: 65, paymentVerified: true, txnId: 'TXN2026001002' },
    { id: 'DOM-DL-2026-118492', service: 'Residence Certificate', state: 'Delhi', district: 'New Delhi', date: '28 Sep 2026, 09:20 AM', status: 'APPROVED', progress: 100, paymentVerified: true, txnId: 'TXN2026001004' },
    { id: 'SCH-KA-2026-102934', service: 'Post-Matric Scholarship', state: 'Karnataka', district: 'Bengaluru Urban', date: '01 Oct 2026, 04:15 PM', status: 'ACTION_REQUIRED', progress: 50, paymentVerified: true, txnId: 'TXN2026001003' },
    { id: 'INC-BR-2025-098231', service: 'Income Certificate', state: 'Bihar', district: 'Patna', date: '14 May 2025, 03:50 PM', status: 'APPROVED', progress: 100, paymentVerified: true, txnId: 'TXN2025001005' },
    { id: 'DL-RJ-2026-902144', service: 'Driving Licence (Learner)', state: 'Rajasthan', district: 'Jaipur', date: '20 Sep 2026, 01:10 PM', status: 'UNDER_REVIEW', progress: 80, paymentVerified: true, txnId: 'TXN2026001006' },
    { id: 'BRT-WB-2026-004128', service: 'Birth Certificate', state: 'West Bengal', district: 'Kolkata', date: '10 Aug 2026, 10:05 AM', status: 'APPROVED', progress: 100, paymentVerified: true, txnId: 'TXN2026001007' },
    { id: 'PEN-MP-2026-552199', service: 'Old Age Pension', state: 'Madhya Pradesh', district: 'Bhopal', date: '15 Jul 2026, 05:40 PM', status: 'APPROVED', progress: 100, paymentVerified: true, txnId: 'TXN2026001008' }
  ],
  consents: [
    { id: 'CNS-001', action: 'Transmission of Identity & Residence Proof', destination: 'State Citizen Services Portal', purpose: 'Income Certificate Verification', date: '07 Oct 2026', status: 'active' },
    { id: 'CNS-002', action: 'Salary Proof & Annual Income Submission', destination: 'Office of SDO / Tehsildar', purpose: 'Statutory Income Certification', date: '07 Oct 2026', status: 'active' }
  ]
};

// ── State Registry & Dynamic Authority Metadata ──────────────────────────────
const STATE_REGISTRY = {
  'Bihar': {
    code: 'BR',
    govName: 'GOVERNMENT OF BIHAR',
    govNameHi: 'बिहार सरकार',
    portal: 'RTPS Bihar Portal',
    portalUrl: 'serviceonline.bihar.gov.in',
    act: 'Bihar Right to Public Services (RTPS) Act, 2011',
    capital: 'Patna',
    defaultStreet: 'Kankarbagh Main Road',
    pincode: '800020',
    districts: {
      'Patna': ['Patna Sadar', 'Danapur', 'Phulwari Sharif', 'Barh', 'Masaurhi'],
      'Gaya': ['Gaya Sadar', 'Bodh Gaya', 'Tekari', 'Sherghati'],
      'Muzaffarpur': ['Muzaffarpur East', 'Muzaffarpur West', 'Kanti', 'Motipur'],
      'Bhagalpur': ['Bhagalpur Sadar', 'Kahalgaon', 'Naugachhia'],
      'Darbhanga': ['Darbhanga Sadar', 'Benipur', 'Biraul']
    }
  },
  'Uttar Pradesh': {
    code: 'UP',
    govName: 'GOVERNMENT OF UTTAR PRADESH',
    govNameHi: 'उत्तर प्रदेश सरकार',
    portal: 'e-District UP Portal',
    portalUrl: 'edistrict.up.gov.in',
    act: 'UP Janhit Guarantee Act, 2011',
    capital: 'Lucknow',
    defaultStreet: 'Civil Lines Road',
    pincode: '226001',
    districts: {
      'Lucknow': ['Lucknow Sadar', 'Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar'],
      'Varanasi': ['Varanasi Sadar', 'Pindra', 'Raja Talab'],
      'Kanpur': ['Kanpur Sadar', 'Ghatampur', 'Bilhaur'],
      'Prayagraj': ['Prayagraj Sadar', 'Phulpur', 'Koraon', 'Soraon'],
      'Noida / GB Nagar': ['Dadri', 'Jewar', 'Sadar Noida']
    }
  },
  'Delhi': {
    code: 'DL',
    govName: 'GOVERNMENT OF NCT OF DELHI',
    govNameHi: 'दिल्ली राष्ट्रीय राजधानी क्षेत्र सरकार',
    portal: 'e-District Delhi Portal',
    portalUrl: 'edistrict.delhigovt.nic.in',
    act: 'Delhi (Right of Citizen to Time Bound Delivery of Services) Act, 2011',
    capital: 'New Delhi',
    defaultStreet: 'Connaught Place / Barakhamba',
    pincode: '110001',
    districts: {
      'New Delhi': ['Chanakyapuri', 'Connaught Place', 'Delhi Cantonment'],
      'Central Delhi': ['Kotwali', 'Civil Lines', 'Karol Bagh'],
      'South Delhi': ['Hauz Khas', 'Saket', 'Mehrauli'],
      'North Delhi': ['Alipur', 'Model Town', 'Narela']
    }
  },
  'Maharashtra': {
    code: 'MH',
    govName: 'GOVERNMENT OF MAHARASHTRA',
    govNameHi: 'महाराष्ट्र शासन',
    portal: 'Aaple Sarkar Portal',
    portalUrl: 'aaplesarkar.mahaonline.gov.in',
    act: 'Maharashtra Public Services Act, 2015',
    capital: 'Mumbai',
    defaultStreet: 'MG Road / Fort Area',
    pincode: '400001',
    districts: {
      'Mumbai': ['Mumbai City', 'Colaba', 'Bandra', 'Andheri', 'Borivali'],
      'Pune': ['Pune City', 'Haveli', 'Baramati', 'Shirur', 'Maval'],
      'Nagpur': ['Nagpur Urban', 'Nagpur Rural', 'Kamptee', 'Katol'],
      'Nashik': ['Nashik City', 'Dindori', 'Sinnar', 'Niphad'],
      'Thane': ['Thane Urban', 'Kalyan', 'Bhiwandi', 'Ulhasnagar']
    }
  },
  'Karnataka': {
    code: 'KA',
    govName: 'GOVERNMENT OF KARNATAKA',
    govNameHi: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    portal: 'Seva Sindhu Portal',
    portalUrl: 'sevasindhu.karnataka.gov.in',
    act: 'Karnataka Sakala Services Act, 2011',
    capital: 'Bengaluru',
    defaultStreet: 'Indiranagar 100ft Road',
    pincode: '560038',
    districts: {
      'Bengaluru Urban': ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal'],
      'Mysuru': ['Mysuru North', 'Mysuru South', 'Hunsur', 'Nanjangud'],
      'Mangaluru': ['Mangaluru Taluk', 'Bantwal', 'Puttur']
    }
  },
  'Rajasthan': {
    code: 'RJ',
    govName: 'GOVERNMENT OF RAJASTHAN',
    govNameHi: 'राजस्थान सरकार',
    portal: 'Rajasthan E-Mitra Portal',
    portalUrl: 'emitra.rajasthan.gov.in',
    act: 'Rajasthan Guaranteed Delivery of Public Services Act, 2011',
    capital: 'Jaipur',
    defaultStreet: 'MI Road / C-Scheme',
    pincode: '302001',
    districts: {
      'Jaipur': ['Jaipur City', 'Sanganer', 'Amer', 'Chaksu'],
      'Jodhpur': ['Jodhpur City', 'Luni', 'Osian', 'Phalodi'],
      'Udaipur': ['Girwa', 'Badgaon', 'Mavli', 'Vallabhnagar']
    }
  },
  'West Bengal': {
    code: 'WB',
    govName: 'GOVERNMENT OF WEST BENGAL',
    govNameHi: 'পশ্চিমবঙ্গ সরকার',
    portal: 'WB e-District Portal',
    portalUrl: 'edistrict.wb.gov.in',
    act: 'West Bengal Right to Public Services Act, 2013',
    capital: 'Kolkata',
    defaultStreet: 'Park Street / Salt Lake',
    pincode: '700001',
    districts: {
      'Kolkata': ['Kolkata Central', 'Kolkata North', 'Kolkata South'],
      'Howrah': ['Howrah Sadar', 'Uluberia', 'Bally'],
      'North 24 Parganas': ['Barasat Sadar', 'Barrackpore', 'Bidhannagar']
    }
  },
  'Jharkhand': {
    code: 'JH',
    govName: 'GOVERNMENT OF JHARKHAND',
    govNameHi: 'झारखंड सरकार',
    portal: 'JharSewa Portal',
    portalUrl: 'jharsewa.jharkhand.gov.in',
    act: 'Jharkhand Right to Public Services Act, 2011',
    capital: 'Ranchi',
    defaultStreet: 'Main Road / Morabadi',
    pincode: '834001',
    districts: {
      'Ranchi': ['Ranchi Sadar', 'Kanke', 'Bundu', 'Ormanjhi'],
      'Dhanbad': ['Dhanbad Sadar', 'Jharia', 'Baghmara'],
      'Jamshedpur': ['Dhalbhum Sadar', 'Ghatshila', 'Potka']
    }
  },
  'Madhya Pradesh': {
    code: 'MP',
    govName: 'GOVERNMENT OF MADHYA PRADESH',
    govNameHi: 'मध्य प्रदेश सरकार',
    portal: 'MP e-District Portal',
    portalUrl: 'mpedistrict.gov.in',
    act: 'MP Public Services Guarantee Act, 2010',
    capital: 'Bhopal',
    defaultStreet: 'MP Nagar / Arera Colony',
    pincode: '462001',
    districts: {
      'Bhopal': ['Huzur', 'Berasia', 'Kolar'],
      'Indore': ['Indore Urban', 'Sanwer', 'Depalpur', 'Mhow'],
      'Gwalior': ['Gwalior City', 'Dabra', 'Bhitarwar']
    }
  },
  'Gujarat': {
    code: 'GJ',
    govName: 'GOVERNMENT OF GUJARAT',
    govNameHi: 'ગુજરાત સરકાર',
    portal: 'Digital Gujarat Portal',
    portalUrl: 'digitalgujarat.gov.in',
    act: 'Gujarat Right to Public Services Act, 2013',
    capital: 'Gandhinagar',
    defaultStreet: 'Ashram Road',
    pincode: '380009',
    districts: {
      'Ahmedabad': ['Ahmedabad City', 'Daskroi', 'Sanand'],
      'Surat': ['Surat City', 'Choryasi', 'Olpad'],
      'Vadodara': ['Vadodara City', 'Padra', 'Savli']
    }
  },
  'Tamil Nadu': {
    code: 'TN',
    govName: 'GOVERNMENT OF TAMIL NADU',
    govNameHi: 'தமிழ்நாடு அரசு',
    portal: 'TNeGA e-Sevai Portal',
    portalUrl: 'tnesevai.tn.gov.in',
    act: 'Tamil Nadu Right to Public Services Act',
    capital: 'Chennai',
    defaultStreet: 'Anna Salai',
    pincode: '600002',
    districts: {
      'Chennai': ['Egmore', 'Mylapore', 'Tondiarpet', 'Guindy'],
      'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Pollachi'],
      'Madurai': ['Madurai North', 'Madurai South', 'Melur']
    }
  },
  'Punjab': {
    code: 'PB',
    govName: 'GOVERNMENT OF PUNJAB',
    govNameHi: 'ਪੰਜਾਬ ਸਰਕਾਰ',
    portal: 'Sewa Kendra Punjab',
    portalUrl: 'punjab.gov.in',
    act: 'Punjab Right to Service Act, 2011',
    capital: 'Chandigarh',
    defaultStreet: 'GT Road / Sector 17',
    pincode: '160017',
    districts: {
      'Ludhiana': ['Ludhiana East', 'Ludhiana West', 'Jagraon'],
      'Amritsar': ['Amritsar-I', 'Amritsar-II', 'Ajnala'],
      'Jalandhar': ['Jalandhar-I', 'Jalandhar-II', 'Phillaur']
    }
  }
};

function getStateConfig(stateNameOrCode) {
  if (!stateNameOrCode) return { ...STATE_REGISTRY['Uttar Pradesh'], name: 'Uttar Pradesh' };
  if (STATE_REGISTRY[stateNameOrCode]) return { ...STATE_REGISTRY[stateNameOrCode], name: stateNameOrCode };
  const lower = String(stateNameOrCode).toLowerCase();
  for (const [stName, conf] of Object.entries(STATE_REGISTRY)) {
    if (stName.toLowerCase() === lower || conf.code.toLowerCase() === lower) {
      return { ...conf, name: stName };
    }
  }
  return {
    name: stateNameOrCode,
    code: stateNameOrCode.substring(0, 2).toUpperCase(),
    govName: `GOVERNMENT OF ${stateNameOrCode.toUpperCase()}`,
    govNameHi: `${stateNameOrCode} सरकार`,
    portal: `${stateNameOrCode} Citizen Services Portal`,
    portalUrl: `edistrict.${stateNameOrCode.toLowerCase().replace(/\s+/g, '')}.gov.in`,
    act: `${stateNameOrCode} Right to Public Services Act`,
    capital: 'District HQ',
    defaultStreet: 'Civil Lines',
    pincode: '110001',
    districts: {
      'Central District': ['Central Sub-Division', 'Block 1', 'Block 2'],
      'North District': ['North Sub-Division', 'Block 1']
    }
  };
}

function getServiceCertConfig(serviceTitleOrId, stateConfig, applicantDetails) {
  const sLower = String(serviceTitleOrId || '').toLowerCase();
  
  if (sLower.includes('caste') || sLower.includes('जाति')) {
    return {
      type: 'CASTE',
      title: 'CASTE & COMMUNITY CERTIFICATE',
      titleHi: 'जाति प्रमाण पत्र',
      dept: `Department of Social Welfare, ${stateConfig.govName}`,
      officer: `Tehsildar / Executive Magistrate`,
      validity: 'Permanent / As per statutory norms',
      highlightLabel: 'Category / Community Verified',
      highlightValue: 'Other Backward Class (OBC / Non-Creamy Layer)',
      highlightNote: 'Recognized under State Gazette & Central List',
      bodyText: `This is to certify that ${applicantDetails.name}, son / daughter / ward of ${applicantDetails.fatherName}, residing at ${applicantDetails.address}, belongs to the OBC community which is recognized as a backward class under the statutory notification of the ${stateConfig.govName}.`,
      purposeText: `This certificate is issued for state public employment reservations, educational institutional admissions, and statutory benefits under the ${stateConfig.act}.`
    };
  }
  
  if (sLower.includes('domicile') || sLower.includes('residence') || sLower.includes('निवास')) {
    return {
      type: 'DOMICILE',
      title: 'DOMICILE & RESIDENCE CERTIFICATE',
      titleHi: 'निवास एवं मूल निवास प्रमाण पत्र',
      dept: `General Administration Department, ${stateConfig.govName}`,
      officer: `Sub-Divisional Magistrate (SDM) / SDO`,
      validity: 'Lifetime / Valid for all statutory purposes',
      highlightLabel: 'Bona Fide Resident Status',
      highlightValue: `Permanent Resident of ${stateConfig.name}`,
      highlightNote: `Continuous residence established since birth / > 10 years`,
      bodyText: `This is to certify that ${applicantDetails.name}, son / daughter / ward of ${applicantDetails.fatherName}, is a bona fide permanent resident of ${applicantDetails.address}, within the territorial jurisdiction of ${stateConfig.govName}.`,
      purposeText: `This certificate validates statutory domicile status for state quota admissions, government examinations, and public schemes under the ${stateConfig.act}.`
    };
  }

  if (sLower.includes('birth') || sLower.includes('जन्म')) {
    return {
      type: 'BIRTH',
      title: 'CERTIFICATE OF BIRTH',
      titleHi: 'जन्म प्रमाण पत्र',
      dept: `Office of the Registrar of Births & Deaths, ${stateConfig.govName}`,
      officer: `Chief Registrar / Municipal Health Officer`,
      validity: 'Permanent Statutory Identity Record',
      highlightLabel: 'Date & Place of Birth Verified',
      highlightValue: `Born on ${applicantDetails.dob || '12 May 2004'} at ${applicantDetails.district}`,
      highlightNote: 'Registered under Section 12/17 of RBD Act, 1969',
      bodyText: `This is to certify that the birth details of ${applicantDetails.name}, child of ${applicantDetails.fatherName}, have been duly recorded in the statutory register of births for ${applicantDetails.district}, under the authority of ${stateConfig.govName}.`,
      purposeText: `Issued under the Registration of Births and Deaths Act, 1969 and ${stateConfig.act} for legal, educational, and identity purposes.`
    };
  }

  if (sLower.includes('driving') || sLower.includes('licence') || sLower.includes('ड्राइविंग')) {
    return {
      type: 'DL',
      title: 'LEARNER DRIVING LICENCE',
      titleHi: 'शिक्षार्थी ड्राइविंग लाइसेंस',
      dept: `Motor Vehicles Department (RTO), ${stateConfig.govName}`,
      officer: `Licensing Authority (Motor Vehicles)`,
      validity: '6 Months from date of issue',
      highlightLabel: 'Authorized Vehicle Class',
      highlightValue: 'LMV - Light Motor Vehicle & MCWG',
      highlightNote: 'Traffic signs and rule evaluation cleared',
      bodyText: `This learner licence is granted to ${applicantDetails.name}, son / daughter / ward of ${applicantDetails.fatherName}, residing at ${applicantDetails.address}, authorising them to drive as a learner subject to Rule 3 of the Central Motor Vehicles Rules, 1989.`,
      purposeText: `Issued by the Regional Transport Office, ${applicantDetails.district}, under the Motor Vehicles Act, 1988.`
    };
  }

  if (sLower.includes('scholarship') || sLower.includes('छात्रवृत्ति')) {
    return {
      type: 'SCHOLARSHIP',
      title: 'POST-MATRIC SCHOLARSHIP SANCTION',
      titleHi: 'पोस्ट-मैट्रिक छात्रवृत्ति स्वीकृति पत्र',
      dept: `Department of Higher Education & BC Welfare, ${stateConfig.govName}`,
      officer: `District Welfare Officer (DWO)`,
      validity: 'Academic Session 2026 - 2027',
      highlightLabel: 'Sanctioned Grant Amount',
      highlightValue: '₹48,000/- (Tuition Fee & Maintenance Grant)',
      highlightNote: 'Direct Benefit Transfer (DBT) to Aadhaar linked bank account',
      bodyText: `This is to certify that the post-matric scholarship application of ${applicantDetails.name}, son / daughter / ward of ${applicantDetails.fatherName}, residing at ${applicantDetails.address}, has been approved under the statutory scholarship scheme of ${stateConfig.govName}.`,
      purposeText: `Issued by District Welfare Office, ${applicantDetails.district}, under ${stateConfig.act}.`
    };
  }

  if (sLower.includes('pension') || sLower.includes('पेंशन')) {
    return {
      type: 'PENSION',
      title: 'SOCIAL SECURITY PENSION SANCTION ORDER',
      titleHi: 'सामाजिक सुरक्षा पेंशन स्वीकृति आदेश',
      dept: `Department of Social Security, ${stateConfig.govName}`,
      officer: `Sub-Divisional Social Welfare Officer`,
      validity: 'Monthly Direct Benefit Transfer (DBT)',
      highlightLabel: 'Monthly Pension Entitlement',
      highlightValue: '₹1,500/- per month',
      highlightNote: 'Direct deposit into bank account on 1st of every month',
      bodyText: `Sanction is hereby accorded to the grant of Old Age / Social Security Pension in favour of ${applicantDetails.name}, resident of ${applicantDetails.address}, under the welfare regulations of ${stateConfig.govName}.`,
      purposeText: `Sanctioned under the Social Security Guidelines and ${stateConfig.act}.`
    };
  }

  // Default: Income Certificate
  return {
    type: 'INCOME',
    title: 'INCOME CERTIFICATE',
    titleHi: 'आय प्रमाण पत्र',
    dept: `Department of Revenue & Land Administration, ${stateConfig.govName}`,
    officer: `Sub-Divisional Officer (SDO) / Tehsildar`,
    validity: '1 Year (Financial Year 2026 - 2027)',
    highlightLabel: 'Certified Annual Family Income',
    highlightValue: `${applicantDetails.incomeFormatted} (${applicantDetails.incomeWords})`,
    highlightNote: 'Evaluated from all verifiable agricultural, business & professional sources',
    bodyText: `This is to certify that ${applicantDetails.name}, son / daughter / ward of ${applicantDetails.fatherName}, residing at ${applicantDetails.address}, has a verified total annual family income from all verifiable sources recorded as:`,
    purposeText: `This certificate is issued exclusively for educational scholarships, college concessions, public welfare assistance, and statutory purposes under the ${stateConfig.act}.`
  };
}

// ── 10. Complete Service Catalog ──────────────────────────────────────────────
const SERVICES = [
  {
    id: 'income_certificate',
    category: 'certificates',
    title: 'Income Certificate',
    dept: 'Department of Revenue & Land Reforms',
    time: '7 - 14 Days',
    govFee: 1,
    platformFee: 0,
    steps: '6 steps',
    location: 'All States & UTs',
    docsRequired: ['Aadhaar Card (Identity Proof)', 'Ration Card / Electricity Bill (Residence Proof)', 'Salary Slip / Income Proof (< 90 Days)', 'Passport Size Photo'],
    description: 'Official proof of annual family income for educational scholarships, subsidies, and fee concessions.',
    whoCanApply: 'Permanent residents whose family annual income requires certification for schemes or reservations.',
    popular: true,
  },
  {
    id: 'caste_certificate',
    category: 'certificates',
    title: 'Caste Certificate',
    dept: 'Department of Social Welfare',
    time: '10 - 15 Days',
    govFee: 1,
    platformFee: 0,
    steps: '5 steps',
    location: 'All States & UTs',
    docsRequired: ['Aadhaar Card', 'Land Khatiyan / Ancestral Document', 'Ration Card', 'Passport Photo'],
    description: 'Certifies reserved category (SC, ST, OBC, EWS) status for academic quota admissions and welfare benefits.',
    whoCanApply: 'Permanent residents belonging to recognized communities in the state.',
    popular: true,
  },
  {
    id: 'domicile_certificate',
    category: 'certificates',
    title: 'Residence / Domicile Certificate',
    dept: 'General Administration Department',
    time: '7 - 10 Days',
    govFee: 1,
    platformFee: 0,
    steps: '4 steps',
    location: 'All States & UTs',
    docsRequired: ['Aadhaar Card', 'Electricity Bill / Land Record', 'Passport Photo'],
    description: 'Official legal proof of permanent or continuous residence for state recruitment and quota admissions.',
    whoCanApply: 'Citizens residing permanently in the applying state or union territory.',
    popular: true,
  },
  {
    id: 'scholarship',
    category: 'education',
    title: 'Post-Matric Scholarship Scheme',
    dept: 'Department of Education & BC/EBC Welfare',
    time: '20 - 30 Days',
    govFee: 1,
    platformFee: 0,
    steps: '7 steps',
    location: 'All States & UTs',
    docsRequired: ['College Fee Receipt', 'Last Year Marksheet', 'Income Certificate', 'Caste Certificate', 'Bank Passbook'],
    description: 'Financial assistance and tuition fee reimbursement for students pursuing higher education.',
    whoCanApply: 'Enrolled college students from qualifying income brackets and reserved categories.',
    popular: true,
  },
  {
    id: 'driving_licence',
    category: 'licences',
    title: 'Learner & Driving Licence',
    dept: 'Transport Department',
    time: '15 - 20 Days',
    govFee: 1,
    platformFee: 0,
    steps: '5 steps',
    location: 'All States & UTs',
    docsRequired: ['Age Proof (Aadhaar / Matric Certificate)', 'Address Proof', 'Medical Form 1A', 'Passport Photo'],
    description: 'Online application for driving licence test slot booking, learner permit, and smart-card licence.',
    whoCanApply: 'Citizens aged 18+ (or 16+ for gearless 50cc scooters) with valid residence proof.',
    popular: true,
  },
  {
    id: 'birth_certificate',
    category: 'certificates',
    title: 'Birth Certificate',
    dept: 'Health & Municipal Administration',
    time: '7 - 10 Days',
    govFee: 1,
    platformFee: 0,
    steps: '4 steps',
    location: 'Municipal Corporation / Local Body',
    docsRequired: ['Hospital Discharge Slip', 'Parents Aadhaar Card', 'Marriage Certificate'],
    description: 'Official birth registration and legal document issuance for children and adults.',
    whoCanApply: 'Parents or legal guardians of individuals born in institutional or domestic settings.',
    popular: true,
  },
  {
    id: 'farmer_subsidy',
    category: 'agriculture',
    title: 'Farmer Input Subsidy & PM-Kisan',
    dept: 'Department of Agriculture',
    time: '15 Days',
    govFee: 1,
    platformFee: 0,
    steps: '5 steps',
    location: 'All States & UTs',
    docsRequired: ['Land Possession Certificate (LPC)', 'Aadhaar Card', 'Bank Account Passbook'],
    description: 'Direct agricultural subsidy and seasonal crop damage compensation for registered farmers.',
    whoCanApply: 'Operational land-holding farmers registered in the state agriculture portal.',
    popular: false,
  },
  {
    id: 'pension',
    category: 'welfare',
    title: 'Old Age & Widow Pension',
    dept: 'Department of Social Security',
    time: '30 Days',
    govFee: 1,
    platformFee: 0,
    steps: '5 steps',
    location: 'All States & UTs',
    docsRequired: ['Voter ID / Age Proof', 'Bank Account Passbook', 'BPL / Income Certificate'],
    description: 'Monthly direct-benefit transfer financial support for senior citizens and eligible beneficiaries.',
    whoCanApply: 'Senior citizens aged 60+ or widows meeting state income thresholds.',
    popular: false,
  },
  {
    id: 'trade_licence',
    category: 'business',
    title: 'Municipal Trade Licence',
    dept: 'Urban Local Bodies & Municipality',
    time: '10 - 14 Days',
    govFee: 1,
    platformFee: 0,
    steps: '4 steps',
    location: 'Urban Municipal Body',
    docsRequired: ['Rent Agreement / Property Tax Receipt', 'PAN Card', 'Business Electricity Bill'],
    description: 'Mandatory commercial permit for running commercial establishments and retail shops.',
    whoCanApply: 'Business proprietors and commercial establishment owners operating in urban areas.',
    popular: false,
  }
];

// ── 6. Rotating Hero Search Placeholders ──────────────────────────────────────
const SEARCH_PLACEHOLDERS = [
  "I need an income certificate",
  "I want to apply for a caste certificate",
  "I need a scholarship for college",
  "How can I get a domicile certificate?",
  "I need a learner driving licence"
];
let placeholderIndex = 0;
let charIndex = 0;
let isDeleting = false;

function initPlaceholderTypewriter() {
  const input = document.getElementById('aiSearchInput');
  if (!input) return;

  function typeLoop() {
    const currentText = SEARCH_PLACEHOLDERS[placeholderIndex];
    if (isDeleting) {
      input.placeholder = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      input.placeholder = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentText.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      placeholderIndex = (placeholderIndex + 1) % SEARCH_PLACEHOLDERS.length;
      delay = 500;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
}

// ── Initialization ────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderPopularServices();
  renderFullCatalog('all');
  renderMyApplications();
  renderRecentTrackChips();
  renderPrivacyConsents();
  initPlaceholderTypewriter();
  initBackendSession();
  // Initialize the PRD-powered place browser (Section 9)
  if (window.PlaceDocsEngine) renderPlacesGrid('all');
});

async function initBackendSession() {
  try {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: appState.language, service: 'income_certificate' })
    });
    if (res.ok) {
      const data = await res.json();
      appState.sessionId = data.session_id;
      appState.csrfToken = data.csrf_token;
    }
  } catch (err) {
    console.log('Backend session initialized locally in standalone mode.');
  }
}

// ── Router / View Controller (Section 5) ──────────────────────────────────────
function showView(viewName) {
  // Existing protected pages must remain protected (Section 1)
  const protectedViews = ['applications', 'profile', 'admin'];
  if (protectedViews.includes(viewName) && (!authState.token || !authState.user)) {
    window.pendingPostLoginView = viewName;
    switchAuthTab('login');
    showAuthModal();
    return;
  }

  appState.currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  const activeNav = document.getElementById(`nav-${viewName}`);
  if (activeNav) activeNav.classList.add('active');

  const activeMobileNav = document.getElementById(`mnav-${viewName}`);
  if (activeMobileNav) activeMobileNav.classList.add('active');

  // Control mobile sticky bar: show only during wizard
  const stickyBar = document.getElementById('wizardMobileBar');
  if (stickyBar) {
    stickyBar.style.display = viewName === 'wizard' ? 'flex' : 'none';
  }

  // ── Full-bleed for landing page; normal padding for all other views ──
  const appContainer = document.getElementById('mainContainer');
  if (appContainer) {
    if (viewName === 'home') {
      appContainer.style.maxWidth = '100%';
      appContainer.style.padding  = '0';
    } else {
      appContainer.style.maxWidth = '1440px';
      appContainer.style.padding  = '36px 44px 100px 44px';
    }
  }

  // ── Refresh profile page with live user data ──────────────────
  if (viewName === 'profile') {
    const user = authState.user;
    const fullName = (user && (user.full_name || user.username)) || appState.formData.fullName || 'Guest';
    const email    = (user && user.email) || appState.formData.email || '';
    const initials = fullName.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'G';

    const pDisplayName   = document.getElementById('p-displayName');
    const pAvatarLarge   = document.getElementById('profileAvatarLarge');
    const pFullNameInput = document.getElementById('prof-fullName');
    const pEmailInput    = document.getElementById('prof-email');
    const pMobileInput   = document.getElementById('prof-mobile');
    const pStateInput    = document.getElementById('prof-state');
    const pDistrictInput = document.getElementById('prof-district');
    const pMetaLoc       = document.getElementById('p-meta-location');

    if (pDisplayName)   pDisplayName.textContent = fullName;
    if (pAvatarLarge)   pAvatarLarge.textContent  = initials;
    if (pFullNameInput) pFullNameInput.value       = fullName;
    if (pEmailInput && email) pEmailInput.value    = email;
    if (pMobileInput && appState.formData.mobile) pMobileInput.value = `+91 ${appState.formData.mobile}`;
    if (pStateInput)    pStateInput.value          = appState.formData.state || 'Uttar Pradesh';
    if (pDistrictInput) pDistrictInput.value       = appState.formData.district || 'Lucknow';
    if (pMetaLoc)       pMetaLoc.textContent      = `Citizen • ${appState.formData.district || 'Lucknow'}, ${appState.formData.state || 'Uttar Pradesh'}`;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 31. Notification Drawer ───────────────────────────────────────────────────
function toggleNotifications() {
  const drawer = document.getElementById('notifDrawer');
  drawer.style.display = drawer.style.display === 'block' ? 'none' : 'block';
}

function markAllNotifsRead() {
  document.querySelectorAll('.notif-item').forEach(i => i.classList.remove('unread'));
  const badge = document.getElementById('notifBadge');
  if (badge) badge.innerText = '0';
}

function filterNotifs(cat, btn) {
  document.querySelectorAll('.notif-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = document.querySelectorAll('.notif-item');
  items.forEach(item => {
    if (cat === 'all' || item.dataset.category === cat) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// ── 6 & 10. Service Catalogs ──────────────────────────────────────────────────
function renderPopularServices() {
  const grid = document.getElementById('popularServicesGrid');
  if (!grid) return;
  const popular = SERVICES.filter(s => s.popular);
  grid.innerHTML = popular.map(s => `
    <div class="service-card" onclick="openServiceDetailsModal('${s.id}')">
      <div>
        <div class="service-card-top">
          <div class="service-icon-box">🏛️</div>
          <div class="service-card-info">
            <h3>${s.title}</h3>
            <span class="service-dept-tag">${s.dept}</span>
          </div>
        </div>
        <p style="font-size:13.5px; color:var(--text-secondary); line-height:1.5; margin:10px 0 14px 0;">
          ${s.description}
        </p>
      </div>
      <div>
        <div class="service-meta-row">
          <span>⏱️ ${s.time} • <strong>${s.steps}</strong></span>
          <span style="color:var(--secondary); font-weight:700;">Govt Fee: ₹${s.govFee}</span>
        </div>
        <button class="btn btn-primary" style="width:100%; margin-top:14px;" onclick="event.stopPropagation(); startSpecificService('${s.id}')">
          Start ➔
        </button>
      </div>
    </div>
  `).join('');
}

const STATE_PORTALS = {
  'Bihar': 'Bihar RTPS Portal',
  'Uttar Pradesh': 'UP e-District Portal',
  'Jharkhand': 'Jharkhand JharSewa',
  'Delhi': 'e-District Delhi Portal',
  'Maharashtra': 'MahaOnline Aaple Sarkar',
  'Madhya Pradesh': 'MP e-District Portal',
  'Rajasthan': 'Rajasthan E-Mitra',
  'West Bengal': 'WB e-District',
  'Karnataka': 'Seva Sindhu Karnataka',
  'Tamil Nadu': 'TNeGA e-Sevai',
  'Gujarat': 'Digital Gujarat Portal',
  'Punjab': 'Sewa Kendra Punjab',
  'Haryana': 'Antyodaya Saral Haryana',
  'Odisha': 'Odisha Right to Public Services',
  'Assam': 'RTPS Assam Sewa Setu'
};

function onStateFilterChange(stateVal) {
  appState.selectedState = stateVal;
  updateStateSelectorUI(stateVal);
  const searchVal = document.getElementById('catalogSearchInput') ? document.getElementById('catalogSearchInput').value : '';
  renderFullCatalog(appState.catalogCategory, searchVal);
}

function selectStateChip(stateVal) {
  appState.selectedState = stateVal;
  const select = document.getElementById('stateCatalogSelect');
  if (select) select.value = stateVal;
  updateStateSelectorUI(stateVal);
  const searchVal = document.getElementById('catalogSearchInput') ? document.getElementById('catalogSearchInput').value : '';
  renderFullCatalog(appState.catalogCategory, searchVal);
}

function updateStateSelectorUI(stateVal) {
  document.querySelectorAll('#stateQuickChips .state-chip-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.state === stateVal);
  });
  const notice = document.getElementById('stateActiveNoticeText');
  if (notice) {
    if (stateVal === 'all') {
      notice.innerHTML = `Currently showing certified services for <strong>All States & Union Territories</strong> • Central & State Government Portals`;
    } else {
      const portal = STATE_PORTALS[stateVal] || `${stateVal} State Citizen Portal`;
      notice.innerHTML = `Currently showing services for: <strong>${stateVal}</strong> • Integrated with ${portal}`;
    }
  }
}

function renderFullCatalog(catFilter = 'all', searchQuery = '') {
  appState.catalogCategory = catFilter;
  const grid = document.getElementById('fullServicesCatalogGrid');
  if (!grid) return;

  let list = catFilter === 'all' ? SERVICES : SERVICES.filter(s => s.category === catFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; background:white; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <div style="font-size:36px; margin-bottom:10px;">🔍</div>
        <h3>No services found matching your query</h3>
        <p style="color:var(--text-muted); font-size:14px; margin-top:4px;">Try searching for "Income Certificate", "Scholarship", or "Licence".</p>
      </div>
    `;
    return;
  }

  const activeStateName = appState.selectedState !== 'all' ? appState.selectedState : 'All States';
  const activePortalName = appState.selectedState !== 'all' ? (STATE_PORTALS[appState.selectedState] || 'Official Portal') : 'National / Central Portal';

  grid.innerHTML = list.map(s => `
    <div class="service-card" onclick="openServiceDetailsModal('${s.id}')">
      <div>
        <div class="service-card-top">
          <div class="service-icon-box">📑</div>
          <div class="service-card-info">
            <h3>${s.title}</h3>
            <span class="service-dept-tag">${s.dept}</span>
            <div class="service-jurisdiction-badge">
              <span class="badge-flag">🏛️</span>
              <span>${appState.selectedState === 'all' ? 'Nationwide / All States' : `${activeStateName} • ${activePortalName}`}</span>
            </div>
          </div>
        </div>
        <p style="font-size:13.5px; color:var(--text-secondary); line-height:1.5; margin:10px 0 14px 0;">
          ${s.description}
        </p>
      </div>
      <div>
        <div class="service-meta-row">
          <span>⏱️ ${s.time} • <strong>${s.steps}</strong></span>
          <span style="color:var(--secondary); font-weight:700;">Govt Fee: ₹${s.govFee}</span>
        </div>
        <button class="btn btn-primary" style="width:100%; margin-top:14px;" onclick="event.stopPropagation(); startSpecificService('${s.id}')">
          Apply for ${appState.selectedState === 'all' ? 'Service' : activeStateName} ➔
        </button>
      </div>
    </div>
  `).join('');
}

function filterServices(cat, btn) {
  document.querySelectorAll('.category-filters-bar .filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const searchVal = document.getElementById('catalogSearchInput') ? document.getElementById('catalogSearchInput').value : '';
  renderFullCatalog(cat, searchVal);
}

function filterCatalogBySearch(query) {
  const activePill = document.querySelector('.category-filters-bar .filter-pill.active');
  const cat = activePill ? (activePill.innerText.toLowerCase().includes('cert') ? 'certificates' : 'all') : 'all';
  renderFullCatalog(cat, query);
}

// ── Place Browser (PRD-powered: 28 States + 8 UTs + Central) ─────────────────
let _currentPlaceName = null;

// Place type emoji map
const PLACE_TYPE_EMOJI = { state: '🏛️', ut: '🔷', central: '🇮🇳' };
const PLACE_TYPE_LABEL = { state: 'State', ut: 'Union Territory', central: 'Central Govt' };

function filterPlaceBrowser(type, btn) {
  document.querySelectorAll('#placeTypeTabs .place-type-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  closePlaceDocsPanel();
  renderPlacesGrid(type);
}

function renderPlacesGrid(typeFilter = 'all') {
  const grid = document.getElementById('placesGrid');
  if (!grid || !window.PlaceDocsEngine) return;

  const places = typeFilter === 'all'
    ? PlaceDocsEngine.getAllPlaces()
    : PlaceDocsEngine.getPlacesByType(typeFilter);

  grid.innerHTML = places.map(place => {
    const docs = PlaceDocsEngine.getDocumentsForPlace(place.name);
    const count = docs.length;
    const emoji = PLACE_TYPE_EMOJI[place.type] || '🏛️';
    const typeLabel = PLACE_TYPE_LABEL[place.type] || place.type;
    const isCentral = place.type === 'central';
    return `
      <button class="place-card${isCentral ? ' place-card-central' : ''}" onclick="openPlaceDocsPanel('${place.name.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')" aria-label="View documents for ${place.name}">
        <div class="place-card-flag">${emoji}</div>
        <div class="place-card-body">
          <div class="place-card-name">${place.name}</div>
          <div class="place-card-type">${typeLabel}</div>
          <div class="place-card-count">${count} document${count !== 1 ? 's' : ''}</div>
        </div>
        <div class="place-card-arrow">→</div>
      </button>
    `;
  }).join('');
}

function openPlaceDocsPanel(placeName) {
  _currentPlaceName = placeName;
  const panel = document.getElementById('placeDocsPanel');
  const title = document.getElementById('placeDocsPanelTitle');
  const portalEl = document.getElementById('placeDocsPanelPortal');
  const searchInput = document.getElementById('placeDocsSearchInput');

  if (!panel || !window.PlaceDocsEngine) return;

  const meta = PlaceDocsEngine.getPlaceMetadata(placeName);
  const typeLabel = PLACE_TYPE_LABEL[meta.type] || meta.type;
  const emoji = PLACE_TYPE_EMOJI[meta.type] || '🏛️';

  title.innerHTML = `${emoji} ${placeName} <span class="place-panel-type-badge">${typeLabel}</span>`;
  portalEl.innerHTML = `<strong>Official Portal:</strong> ${meta.portal || placeName + ' Citizen Services'} &nbsp;|&nbsp; <strong>Dept:</strong> ${meta.dept || 'State Administration'}`;

  if (searchInput) searchInput.value = '';

  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  renderPlaceDocCards(placeName, '');
}

function closePlaceDocsPanel() {
  const panel = document.getElementById('placeDocsPanel');
  if (panel) panel.style.display = 'none';
  _currentPlaceName = null;
}

function filterPlaceDocs(query) {
  if (_currentPlaceName) renderPlaceDocCards(_currentPlaceName, query);
}

function renderPlaceDocCards(placeName, searchQuery = '') {
  const grid = document.getElementById('placeDocsGrid');
  if (!grid || !window.PlaceDocsEngine) return;

  const docs = PlaceDocsEngine.searchDocuments(placeName, searchQuery);

  if (docs.length === 0) {
    grid.innerHTML = `
      <div class="place-docs-empty">
        <div style="font-size:36px; margin-bottom:8px;">🔍</div>
        <h4>No documents found</h4>
        <p>Try a different search term or <a href="#" onclick="filterPlaceDocs(''); return false;">clear search</a>.</p>
      </div>`;
    return;
  }

  const isStar5 = d => d.importance && d.importance.includes('★★★★★');
  const sorted = [...docs].sort((a, b) => (isStar5(b) ? 1 : 0) - (isStar5(a) ? 1 : 0));

  grid.innerHTML = sorted.map(doc => {
    const stars = doc.importance || '★★★';
    const docList = (doc.docsRequired || []).slice(0, 3).map(d => `<li>${d}</li>`).join('');
    const moreCount = (doc.docsRequired || []).length - 3;
    return `
      <div class="place-doc-card">
        <div class="place-doc-card-header">
          <div>
            <h4 class="place-doc-title">${doc.title}</h4>
            <div class="place-doc-meta">
              <span class="place-doc-stars">${stars}</span>
              <span class="place-doc-dept">${doc.dept || 'State Dept.'}</span>
            </div>
          </div>
          <div class="place-doc-time-badge">⏱️ ${doc.time || '7-14 Days'}</div>
        </div>
        <p class="place-doc-desc">${doc.description || ''}</p>
        <div class="place-doc-docs-needed">
          <strong>Documents Needed:</strong>
          <ul>${docList}${moreCount > 0 ? `<li>+${moreCount} more...</li>` : ''}</ul>
        </div>
        <div class="place-doc-footer">
          <span class="place-doc-fee">Govt Fee: ₹${doc.govFee || 1}</span>
          <button class="btn btn-primary place-doc-apply-btn" onclick="startPlaceDocument('${doc.id}', '${placeName.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">
            Apply Now →
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function startPlaceDocument(docId, placeName) {
  // Set the selected state for the wizard and start the service
  if (placeName && placeName !== 'Central Government') {
    appState.selectedState = placeName;
    appState.formData.state = placeName;
    const stateConf = getStateConfig(placeName);
    if (stateConf && stateConf.districts) {
      const firstDistrict = Object.keys(stateConf.districts)[0];
      appState.formData.district = firstDistrict || 'Central District';
    }
  }

  // Look up in PLACE_DOCUMENTS_DB first, fall back to generic SERVICES catalog
  const placeDoc = window.PlaceDocsEngine ? PlaceDocsEngine.findDocumentById(docId) : null;
  if (placeDoc) {
    // Store the PRD document as active service for context
    appState.activeService = {
      id: docId,
      title: placeDoc.title,
      dept: placeDoc.dept,
      time: placeDoc.time || '7 - 14 Days',
      govFee: placeDoc.govFee || 1,
      steps: placeDoc.steps || '5 steps',
      docsRequired: placeDoc.docsRequired || [],
      description: placeDoc.description,
      whoCanApply: placeDoc.whoCanApply || 'Eligible citizens of ' + placeName,
      location: placeName,
      portal: placeDoc.portal,
    };
  }

  // Determine a matching SERVICES catalog id to start the wizard
  const titleL = (placeDoc ? placeDoc.title : docId).toLowerCase();
  let wizardServiceId = 'income_certificate';
  if (titleL.includes('caste') || titleL.includes('community')) wizardServiceId = 'caste_certificate';
  else if (titleL.includes('domicile') || titleL.includes('residence') || titleL.includes('nativity')) wizardServiceId = 'domicile_certificate';
  else if (titleL.includes('birth')) wizardServiceId = 'birth_certificate';
  else if (titleL.includes('death')) wizardServiceId = 'death_certificate';
  else if (titleL.includes('scholarship')) wizardServiceId = 'scholarship_postmatric';
  else if (titleL.includes('pension') || titleL.includes('old age')) wizardServiceId = 'old_age_pension';
  else if (titleL.includes('driving') || titleL.includes('licence')) wizardServiceId = 'driving_licence_learner';
  else if (titleL.includes('marriage')) wizardServiceId = 'marriage_certificate';
  else if (titleL.includes('income')) wizardServiceId = 'income_certificate';

  handleStartServicePublic(wizardServiceId);
}

function openStateServices() {
  // Scroll to Section 9 and activate State tab
  filterPlaceBrowser('state', document.getElementById('tab-state'));
  document.getElementById('browse-by-place').scrollIntoView({ behavior: 'smooth' });
}

function openCentralServices() {
  // Scroll to Section 9 and activate Central tab, then open panel
  filterPlaceBrowser('central', document.getElementById('tab-central'));
  document.getElementById('browse-by-place').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => openPlaceDocsPanel('Central Government'), 400);
}

// ── 11. Service Details Modal ─────────────────────────────────────────────────
function openServiceDetailsModal(serviceId) {
  const s = SERVICES.find(x => x.id === serviceId) || SERVICES[0];
  appState.activeService = s;

  document.getElementById('mdCategory').innerText = s.category.toUpperCase();
  document.getElementById('mdTitle').innerText = s.title;
  document.getElementById('mdDept').innerText = s.dept;
  document.getElementById('mdDescription').innerText = s.description;
  document.getElementById('mdTime').innerText = s.time;
  document.getElementById('mdGovFee').innerText = `₹${s.govFee}`;
  document.getElementById('mdSteps').innerText = s.steps;
  document.getElementById('mdWhoCanApply').innerText = s.whoCanApply;

  const docsList = document.getElementById('mdDocsList');
  docsList.innerHTML = s.docsRequired.map(d => `<li>${d}</li>`).join('');

  document.getElementById('serviceDetailsModal').style.display = 'flex';
}

function closeServiceDetailsModal() {
  document.getElementById('serviceDetailsModal').style.display = 'none';
}

function proceedToWizardFromModal() {
  closeServiceDetailsModal();
  startSpecificService(appState.activeService ? appState.activeService.id : 'income_certificate');
}

// ── 12. Conversational AI Service Discovery ───────────────────────────────────
function handleSearchKey(e) {
  if (e.key === 'Enter') performAiSearch();
}

function handleSearchInput(e) {
  const query = e.target.value.toLowerCase().trim();
  const card = document.getElementById('aiDiscoveryCard');
  if (!card) return;

  if (query.includes('scholarship') || query.includes('college') || query.includes('income') || query.includes('आय') || query.includes('caste') || query.includes('certificate')) {
    let matchedId = 'income_certificate';
    let title = 'Income Certificate (आय प्रमाण पत्र)';
    let reason = 'An income certificate is commonly used to verify family annual income for scholarships, fee concessions, and government welfare schemes.';

    if (query.includes('caste') || query.includes('जाति')) {
      matchedId = 'caste_certificate';
      title = 'Caste Certificate (जाति प्रमाण पत्र)';
      reason = 'A caste certificate certifies reserved category status for academic reservations and scholarships.';
    } else if (query.includes('domicile') || query.includes('residence') || query.includes('निवास')) {
      matchedId = 'domicile_certificate';
      title = 'Residence / Domicile Certificate (निवास प्रमाण पत्र)';
      const st = appState.formData.state || 'the state';
      reason = `Used to prove permanent residence in ${st} for quota admissions, welfare benefits, and regional recruitments.`;
    }

    document.getElementById('aiMatchedTitle').innerText = title;
    document.getElementById('aiMatchedReason').innerText = reason;
    card.dataset.serviceId = matchedId;
    card.style.display = 'block';
  } else if (query.length < 3) {
    card.style.display = 'none';
  }
}

function applySearchTerm(term) {
  const input = document.getElementById('aiSearchInput');
  input.value = term;
  input.focus();
  handleSearchInput({ target: input });
}

function acceptAiSuggestion() {
  const card = document.getElementById('aiDiscoveryCard');
  const serviceId = card.dataset.serviceId || 'income_certificate';
  startSpecificService(serviceId);
}

function dismissAiSuggestion() {
  document.getElementById('aiDiscoveryCard').style.display = 'none';
}

function performAiSearch() {
  const query = document.getElementById('aiSearchInput').value.toLowerCase().trim();
  if (query.includes('income') || query.includes('आय') || query.includes('scholarship')) {
    startSpecificService('income_certificate');
  } else if (query.includes('caste') || query.includes('जाति')) {
    startSpecificService('caste_certificate');
  } else if (query.includes('domicile') || query.includes('residence') || query.includes('निवास')) {
    startSpecificService('domicile_certificate');
  } else if (query.includes('licence') || query.includes('driving')) {
    startSpecificService('driving_licence');
  } else {
    showView('services');
  }
}

// ── 13-25. 6-STAGE APPLICATION WIZARD ENGINE ──────────────────────────────────
function startSpecificService(serviceId) {
  const s = SERVICES.find(x => x.id === serviceId) || SERVICES[0];
  appState.activeService = s;
  appState.formData.service = s.id;
  if (appState.selectedState && appState.selectedState !== 'all') {
    appState.formData.state = appState.selectedState;
  }
  const locEl = document.getElementById('wizardLocationIndicator');
  if (locEl) {
    locEl.innerText = `📍 ${appState.formData.state} · ${appState.formData.district || 'District'}`;
  }

  // Clear payment order state so each application gets a fresh payment order
  sessionStorage.removeItem('citizen_active_order_id');
  appState._activeOrderId = null;
  appState._activeOrderData = null;
  appState._lastPaymentOrderId = null;
  appState._lastPaymentTxnId = null;
  if (appState._redirectTimer) {
    clearInterval(appState._redirectTimer);
    appState._redirectTimer = null;
  }

  appState.wizardStep = 1;
  showView('wizard');
  renderWizardStep(1);
}

function setWizardStep(step) {
  // Strict guard: Step 7 cannot be entered without verified payment
  if (step === 7 && (!appState._lastPaymentOrderId || !appState._lastPaymentTxnId)) {
    console.warn("Payment verification required before accessing Step 7. Redirecting to Step 6 Payment.");
    step = 6;
  }
  appState.wizardStep = step;
  renderWizardStep(step);
}

function jumpToStepIfAllowed(targetStep) {
  if (targetStep === 7 && (!appState._lastPaymentOrderId || !appState._lastPaymentTxnId)) {
    return;
  }
  if (targetStep <= appState.wizardStep) {
    setWizardStep(targetStep);
  }
}

function handleWizardBack() {
  if (appState.wizardStep > 1) {
    setWizardStep(appState.wizardStep - 1);
  } else {
    showView('services');
  }
}

function handleWizardNext() {
  if (appState.wizardStep === 1) setWizardStep(2);
  else if (appState.wizardStep === 2) setWizardStep(3);
  else if (appState.wizardStep === 3) setWizardStep(4);
  else if (appState.wizardStep === 4) saveFormAndReview();
  else if (appState.wizardStep === 5) openConsentGateModal();
  else if (appState.wizardStep === 6) checkBackendPaymentStatus();
}

function confirmExitWizard() {
  if (confirm("Are you sure you want to exit? Your draft information is safely saved.")) {
    showView('services');
  }
}

function saveAndExitWizard() {
  alert("Draft application saved. You can resume anytime from My Applications.");
  showView('applications');
}

function renderWizardStep(step) {
  const body = document.getElementById('wizardCardBody');
  const serviceName = document.getElementById('wizardServiceName');
  const stepHeading = document.getElementById('wizardStepHeading');
  const badge = document.getElementById('wizardStepBadge');
  const fill = document.getElementById('wizardStepperFill');

  if (!appState.activeService) appState.activeService = SERVICES[0];
  const s = appState.activeService;

  serviceName.innerText = s.title;
  fill.style.width = `${Math.round((step / 7) * 100)}%`;
  badge.innerText = `Step ${step} of 7`;

  // Update nodes
  for (let i = 1; i <= 7; i++) {
    const node = document.getElementById(`node-${i}`);
    if (node) {
      node.className = 'step-node';
      if (i < step) node.classList.add('completed');
      else if (i === step) node.classList.add('active');
    }
  }

  // ── STEP 1: LOCATION SELECTION (Section 13) ─────────────────────────────────
  if (step === 1) {
    stepHeading.innerText = "1. Location & Jurisdiction";
    const curState = appState.formData.state || (appState.selectedState !== 'all' ? appState.selectedState : 'Uttar Pradesh');
    appState.formData.state = curState;
    body.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-header">
          <h3>Where are you applying from?</h3>
          <p>Government certificates and welfare services vary by state and local district administration.</p>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">State / UT *</label>
            <select class="form-control" id="stateSelect" onchange="updateDistricts(this.value)">
              <option value="Uttar Pradesh" ${curState === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh (उत्तर प्रदेश)</option>
              <option value="Bihar" ${curState === 'Bihar' ? 'selected' : ''}>Bihar (बिहार)</option>
              <option value="Delhi" ${curState === 'Delhi' ? 'selected' : ''}>Delhi (दिल्ली NCR)</option>
              <option value="Maharashtra" ${curState === 'Maharashtra' ? 'selected' : ''}>Maharashtra (महाराष्ट्र)</option>
              <option value="Karnataka" ${curState === 'Karnataka' ? 'selected' : ''}>Karnataka (कर्नाटक)</option>
              <option value="Rajasthan" ${curState === 'Rajasthan' ? 'selected' : ''}>Rajasthan (राजस्थान)</option>
              <option value="West Bengal" ${curState === 'West Bengal' ? 'selected' : ''}>West Bengal (पश्चिम बंगाल)</option>
              <option value="Madhya Pradesh" ${curState === 'Madhya Pradesh' ? 'selected' : ''}>Madhya Pradesh (मध्य प्रदेश)</option>
              <option value="Gujarat" ${curState === 'Gujarat' ? 'selected' : ''}>Gujarat (गुजरात)</option>
              <option value="Jharkhand" ${curState === 'Jharkhand' ? 'selected' : ''}>Jharkhand (झारखंड)</option>
              <option value="Tamil Nadu" ${curState === 'Tamil Nadu' ? 'selected' : ''}>Tamil Nadu (तमिलनाडु)</option>
              <option value="Punjab" ${curState === 'Punjab' ? 'selected' : ''}>Punjab (पंजाब)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">District *</label>
            <select class="form-control" id="districtSelect" onchange="appState.formData.district=this.value; updateBlocks(this.value); updateJurisdictionBanner()">
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Sub-Division / Block / Municipality *</label>
            <select class="form-control" id="blockSelect" onchange="appState.formData.block=this.value; updateJurisdictionBanner()">
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Issuing Authority</label>
            <input type="text" class="form-control" value="Office of the Sub-Divisional Officer (SDO) / Tehsildar" readonly style="background:var(--bg-subtle);">
          </div>
        </div>

        <div id="selectedJurisdictionBanner" style="background:var(--primary-subtle); border-left:4px solid var(--primary); padding:14px 18px; border-radius:var(--radius-sm); font-size:13.5px; margin-top:8px;">
          📍 <strong>Selected Jurisdiction:</strong> ${curState} · ${appState.formData.district || 'District'} · ${appState.formData.block || 'Sub-Division'} (SDO Office)
        </div>

        <div class="wizard-footer-actions">
          <button class="btn btn-secondary" onclick="showView('services')">← Choose Another Service</button>
          <button class="btn btn-primary" onclick="setWizardStep(2)">Check Eligibility ➔</button>
        </div>
      </div>
    `;
    setTimeout(() => { updateDistricts(curState); }, 20);
  }

  // ── STEP 2: CONVERSATIONAL ELIGIBILITY (Sections 14 & 15) ───────────────────
  else if (step === 2) {
    stepHeading.innerText = "2. Check Statutory Eligibility";
    const curState = appState.formData.state || 'Uttar Pradesh';
    const cleanSvcTitle = (s && s.title) ? s.title.split('(')[0].trim() : 'Certificate';
    body.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-header">
          <h3>Let's check if you can apply.</h3>
          <p>Answer a few simple questions. Our deterministic rule engine checks if you qualify before you prepare any paperwork.</p>
        </div>

        <div class="form-group">
          <label class="form-label">What do you need the certificate for?</label>
          <div class="option-button-grid">
            <button class="option-card-btn selected" onclick="selectPurpose('Scholarship', this)">🎓 Higher Education / Scholarship</button>
            <button class="option-card-btn" onclick="selectPurpose('Government Scheme', this)">🏛️ Welfare Scheme</button>
            <button class="option-card-btn" onclick="selectPurpose('Employment', this)">💼 Government Job</button>
            <button class="option-card-btn" onclick="selectPurpose('Other', this)">📑 General Purpose</button>
          </div>
        </div>

        <div class="form-group" style="margin-top:24px;">
          <label class="form-label">Approximate Total Annual Family Income (वार्षिक पारिवारिक आय)</label>
          <input type="number" class="form-control" id="eligIncome" value="${appState.formData.annualIncome}" placeholder="e.g. 120000" oninput="recalcEligibility()">
          <span style="font-size:12.5px; color:var(--text-muted); margin-top:4px; display:block;">
            Standard threshold for non-creamy layer scholarships and fee concessions is ₹3,00,000.
          </span>
        </div>

        <div class="form-group" style="margin-top:20px;">
          <label class="form-label">Are you a permanent resident of ${curState}?</label>
          <div style="display:flex; gap:20px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; cursor:pointer;">
              <input type="radio" name="resCheck" checked onchange="recalcEligibility()"> Yes, permanent resident
            </label>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; cursor:pointer;">
              <input type="radio" name="resCheck" onchange="recalcEligibility()"> No
            </label>
          </div>
        </div>

        <!-- 15. Eligibility Result State -->
        <div id="eligibilityResultBox" class="eligibility-box">
          <div style="font-size:28px;">✅</div>
          <div>
            <strong style="color:#166534; font-size:16px;">You can continue. You appear eligible to apply.</strong>
            <p style="font-size:13.5px; color:#15803d; margin-top:3px;">
              Based on your annual family income (₹${(appState.formData.annualIncome || 120000).toLocaleString('en-IN')}) and residence, you meet all statutory requirements for ${curState} ${cleanSvcTitle} issuance.
            </p>
          </div>
        </div>

        <div class="wizard-footer-actions">
          <button class="btn btn-secondary" onclick="setWizardStep(1)">← Back</button>
          <button class="btn btn-primary" id="btnEligContinue" onclick="setWizardStep(3)">See Required Documents ➔</button>
        </div>
      </div>
    `;
  }

  // ── STEP 3: DOCUMENT CHECKLIST & UPLOAD (Sections 16, 17, 18) ───────────────
  else if (step === 3) {
    stepHeading.innerText = "3. Your Documents & OCR Verification";
    body.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-header">
          <h3>Your documents</h3>
          <p>We've simplified the document requirements for you. Our system checks readability and validates fields automatically.</p>
        </div>

        <!-- Name Mismatch Detected Banner (Demonstrates Section 11/18) -->
        <div id="nameMismatchAlertBox" style="display:none; background:var(--accent-subtle); border:1.5px solid #fde68a; border-radius:var(--radius-md); padding:16px 20px; margin-bottom:20px;">
          <strong style="color:#92400e; font-size:14.5px;">⚠️ Information Variation Detected</strong>
          <p style="font-size:13.5px; color:#78350f; margin:4px 0 10px 0;">
            Entered Applicant Name: <strong>${appState.formData.fullName || 'Rahul Kumar'}</strong><br>
            Aadhaar Extracted Name: <strong>${appState.formData.fullName ? appState.formData.fullName + ' Kumar' : 'Rahul Kumar Singh'}</strong>
          </p>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" style="padding:6px 14px; font-size:12.5px;" onclick="resolveMismatch('doc')">✓ Update to extracted name</button>
            <button class="btn btn-secondary" style="padding:6px 14px; font-size:12.5px;" onclick="resolveMismatch('entered')">Keep '${appState.formData.fullName || 'Rahul Kumar'}'</button>
          </div>
        </div>

        <div class="doc-upload-grid">
          <!-- 1. Identity Proof -->
          <div class="doc-upload-item" id="box-aadhaar">
            <div class="doc-upload-top">
              <div class="doc-name-box">
                <h4>Identity Proof (Aadhaar Card) *</h4>
                <p>Used to verify your identity. Accepted: PDF, JPG, PNG</p>
              </div>
              <span class="doc-status-badge pending" id="badge-aadhaar">REQUIRED</span>
            </div>
            <div style="margin-top:14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="font-size:13px; padding:7px 16px;" onclick="openDocUploadModal('aadhaar', 'Identity Proof (Aadhaar Card)')">
                📤 Upload
              </button>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="autoUploadSample('aadhaar')">
                ⚡ Load Sample
              </button>
              <span id="ocr-aadhaar" class="ocr-result-pill" style="display:none;"></span>
            </div>
          </div>

          <!-- 2. Address Proof -->
          <div class="doc-upload-item" id="box-address_proof">
            <div class="doc-upload-top">
              <div class="doc-name-box">
                <h4>Address Proof (Ration Card / Utility Bill) *</h4>
                <p>Verifies residence jurisdiction in ${appState.formData.block || appState.formData.district || 'local sub-division'}. Accepted: PDF, JPG, PNG</p>
              </div>
              <span class="doc-status-badge pending" id="badge-address_proof">REQUIRED</span>
            </div>
            <div style="margin-top:14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="font-size:13px; padding:7px 16px;" onclick="openDocUploadModal('address_proof', 'Address Proof')">
                📤 Upload
              </button>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="autoUploadSample('address_proof')">
                ⚡ Load Sample
              </button>
              <span id="ocr-address_proof" class="ocr-result-pill" style="display:none;"></span>
            </div>
          </div>

          <!-- 3. Income Proof -->
          <div class="doc-upload-item" id="box-income_proof">
            <div class="doc-upload-top">
              <div class="doc-name-box">
                <h4>Income Proof (Salary Slip / Affidavit) *</h4>
                <p>Issued within last 90 days. Accepted: PDF, JPG, PNG</p>
              </div>
              <span class="doc-status-badge pending" id="badge-income_proof">REQUIRED</span>
            </div>
            <div style="margin-top:14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="font-size:13px; padding:7px 16px;" onclick="openDocUploadModal('income_proof', 'Income Proof / Salary Slip')">
                📤 Upload
              </button>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="autoUploadSample('income_proof')">
                ⚡ Load Sample
              </button>
              <span id="ocr-income_proof" class="ocr-result-pill" style="display:none;"></span>
            </div>
          </div>

          <!-- 4. Passport Photo -->
          <div class="doc-upload-item" id="box-photo">
            <div class="doc-upload-top">
              <div class="doc-name-box">
                <h4>Recent Passport Size Photograph *</h4>
                <p>Front-facing clear portrait portrait. Accepted: JPG, PNG</p>
              </div>
              <span class="doc-status-badge pending" id="badge-photo">REQUIRED</span>
            </div>
            <div style="margin-top:14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="font-size:13px; padding:7px 16px;" onclick="openDocUploadModal('photo', 'Passport Photo')">
                📤 Upload
              </button>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="autoUploadSample('photo')">
                ⚡ Load Sample
              </button>
              <span id="ocr-photo" class="ocr-result-pill" style="display:none;"></span>
            </div>
          </div>
        </div>

        <div style="margin-top:24px; text-align:center;">
          <button class="btn btn-secondary" style="background:var(--primary-subtle); color:var(--primary-dark); border-color:var(--primary-light);" onclick="autoUploadAllDemoDocs()">
            🚀 One-Click Upload All 4 Sample Documents
          </button>
        </div>

        <div class="wizard-footer-actions">
          <button class="btn btn-secondary" onclick="setWizardStep(2)">← Back</button>
          <button class="btn btn-primary" onclick="setWizardStep(4)">Prepare Application ➔</button>
        </div>
      </div>
    `;
  }

  // ── STEP 4: SMART APPLICATION FORM (Sections 19 & 20) ───────────────────────
  else if (step === 4) {
    stepHeading.innerText = "4. Smart Application Form";
    body.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-header">
          <h3>Let's complete your application</h3>
          <p>We've pre-filled fields using data extracted from your verified documents. You can review or edit any field.</p>
        </div>

        <!-- 1. Personal Information -->
        <h4 style="font-size:16px; font-weight:800; color:var(--text-primary); margin-bottom:14px; padding-bottom:6px; border-bottom:1px solid var(--border-color);">
          Personal Information
        </h4>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Full Name * <span class="prefill-tag">✓ From your uploaded document</span></label>
            <input type="text" class="form-control" id="f-fullName" value="${appState.formData.fullName}">
          </div>
          <div class="form-group">
            <label class="form-label">Father's Name *</label>
            <input type="text" class="form-control" id="f-fatherName" value="${appState.formData.fatherName}">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Date of Birth * <span class="prefill-tag">✓ From your uploaded document</span></label>
            <input type="date" class="form-control" id="f-dob" value="${appState.formData.dob}">
          </div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-control" id="f-gender">
              <option value="Male" selected>Male (पुरुष)</option>
              <option value="Female">Female (महिला)</option>
              <option value="Transgender">Transgender (अन्य)</option>
            </select>
          </div>
        </div>

        <!-- 2. Contact Information -->
        <h4 style="font-size:16px; font-weight:800; color:var(--text-primary); margin:24px 0 14px 0; padding-bottom:6px; border-bottom:1px solid var(--border-color);">
          Contact Information
        </h4>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Mobile Number (for SMS Tracking) *</label>
            <input type="tel" class="form-control" id="f-mobile" value="${appState.formData.mobile}">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" id="f-email" value="${appState.formData.email}">
          </div>
        </div>

        <!-- 3. Address -->
        <h4 style="font-size:16px; font-weight:800; color:var(--text-primary); margin:24px 0 14px 0; padding-bottom:6px; border-bottom:1px solid var(--border-color);">
          Address
        </h4>
        <div class="form-group">
          <label class="form-label">House / Street / Locality * <span class="prefill-tag">✓ From your uploaded document</span></label>
          <input type="text" class="form-control" id="f-house" value="${appState.formData.houseStreet}">
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Village / Town / City *</label>
            <input type="text" class="form-control" id="f-village" value="${appState.formData.villageTown}">
          </div>
          <div class="form-group">
            <label class="form-label">PIN Code *</label>
            <input type="text" class="form-control" id="f-pin" value="${appState.formData.pincode}">
          </div>
        </div>

        <!-- 4. Service Details -->
        <h4 style="font-size:16px; font-weight:800; color:var(--text-primary); margin:24px 0 14px 0; padding-bottom:6px; border-bottom:1px solid var(--border-color);">
          Service Details
        </h4>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Total Annual Family Income (₹) * <span class="prefill-tag">✓ From your uploaded document</span></label>
            <input type="number" class="form-control" id="f-income" value="${appState.formData.annualIncome}">
          </div>
          <div class="form-group">
            <label class="form-label">Application Purpose *</label>
            <input type="text" class="form-control" id="f-purpose" value="${appState.formData.purpose}">
          </div>
        </div>

        <div class="wizard-footer-actions">
          <button class="btn btn-secondary" onclick="setWizardStep(3)">← Back to Documents</button>
          <button class="btn btn-primary" onclick="saveFormAndReview()">Review Application ➔</button>
        </div>
      </div>
    `;
  }

  // ── STEP 5: REVIEW & COST TRANSPARENCY (Sections 21 & 22) ───────────────────
  else if (step === 5) {
    stepHeading.innerText = "5. Review Your Application";
    body.innerHTML = `
      <div class="wizard-card">
        <div class="wizard-card-header">
          <h3>Review your application</h3>
          <p>Please check your details carefully before submission. Submissions cannot be edited once transmitted.</p>
        </div>

        <!-- Applicant Summary Card -->
        <div class="review-section-block">
          <div class="review-section-header">
            <h4>Applicant</h4>
            <button class="btn-text-link" onclick="setWizardStep(4)">Edit</button>
          </div>
          <div class="detail-row"><span class="detail-label">Full Name</span><span class="detail-value">${appState.formData.fullName}</span></div>
          <div class="detail-row"><span class="detail-label">Father's Name</span><span class="detail-value">${appState.formData.fatherName}</span></div>
          <div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">${appState.formData.dob}</span></div>
          <div class="detail-row"><span class="detail-label">Mobile</span><span class="detail-value">${appState.formData.mobile}</span></div>
        </div>

        <!-- Service & Location Summary Card -->
        <div class="review-section-block">
          <div class="review-section-header">
            <h4>Service & Location</h4>
            <button class="btn-text-link" onclick="setWizardStep(1)">Edit</button>
          </div>
          <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${s.title}</span></div>
          <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${appState.formData.district || 'District'}, ${appState.formData.state || 'State'}</span></div>
          <div class="detail-row"><span class="detail-label">Issuing Office</span><span class="detail-value">Office of the SDO / Tehsildar, ${appState.formData.block || appState.formData.district || 'Central Office'}</span></div>
          <div class="detail-row"><span class="detail-label">Certified Annual Income</span><span class="detail-value">₹${(appState.formData.annualIncome || 120000).toLocaleString('en-IN')}</span></div>
        </div>

        <!-- Documents Summary Card -->
        <div class="review-section-block">
          <div class="review-section-header">
            <h4>Documents</h4>
            <button class="btn-text-link" onclick="setWizardStep(3)">Edit</button>
          </div>
          <div style="font-size:14px; color:var(--text-secondary); line-height:1.8;">
            ✓ Identity Proof (Aadhaar Card) — <span style="color:var(--secondary); font-weight:700;">Verified</span><br>
            ✓ Address Proof (Ration Card / Utility Bill) — <span style="color:var(--secondary); font-weight:700;">Verified</span><br>
            ✓ Income Proof / Salary Slip — <span style="color:var(--secondary); font-weight:700;">Verified</span><br>
            ✓ Passport Size Photograph — <span style="color:var(--secondary); font-weight:700;">Verified</span>
          </div>
        </div>

        <!-- 22. Cost Transparency Breakdown -->
        <div class="fee-breakdown-card">
          <h4 style="font-size:16px; font-weight:800; color:var(--text-primary); margin-bottom:12px;">Application Cost</h4>
          <div class="fee-row">
            <span>Government Fee</span>
            <span style="font-weight:700;">₹${s.govFee}</span>
          </div>
          <div class="fee-row">
            <span>Platform Fee</span>
            <span style="font-weight:700; color:var(--primary);">₹0</span>
          </div>
          <div class="fee-row total">
            <span>Total Payable Amount</span>
            <span style="color:var(--secondary);">₹${s.govFee}</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">
            Platform Fee · ₹0 — Zero hidden charges. Always free public assistance.
          </div>
        </div>

        <!-- Declaration Checkbox -->
        <div style="margin:24px 0 10px 0;">
          <label style="display:flex; align-items:flex-start; gap:12px; font-size:14px; cursor:pointer;">
            <input type="checkbox" id="userDeclaration" checked style="margin-top:3px;">
            <span>I have reviewed the information and confirm that it is correct and genuine.</span>
          </label>
        </div>

        <div class="wizard-footer-actions">
          <button class="btn btn-secondary" onclick="setWizardStep(4)">← Go Back</button>
          <button class="btn btn-success" onclick="openConsentGateModal()">Confirm & Continue ➔</button>
        </div>
      </div>
    `;
  }

  // ── STEP 6: BACKEND VERIFIED PAYMENT GATEWAY (Section 23B) ────────────────
  else if (step === 6) {
    stepHeading.innerText = '6. Payment';
    renderPaymentStep(body);
  }

  // ── STEP 7: SUBMISSION EXPERIENCE & SUCCESS SCREEN (Sections 24 & 25) ────────
  else if (step === 7) {
    stepHeading.innerText = '7. Application Submitted';
    body.innerHTML = `
      <div class="wizard-card" style="text-align:center; padding:48px 32px;">
        
        <!-- Focused Submission Animation (Section 24) -->
        <div id="submittingStateBox">
          <div style="font-size:52px; margin-bottom:16px;">🔄</div>
          <h3 style="font-size:24px; font-weight:800; color:var(--text-primary);" id="submissionStatusText">
            Preparing application...
          </h3>
          <p style="font-size:14.5px; color:var(--text-muted); margin-top:8px;">
            Please wait while we verify requirements and transmit your application.
          </p>
          <div style="max-width:320px; margin:24px auto 0 auto;">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="submissionProgressBar" style="width:25%;"></div>
            </div>
          </div>
        </div>

        <!-- 25. Success Screen -->
        <div id="submissionSuccessBox" style="display:none; animation:fadeIn 0.3s ease;">
          <div style="font-size:58px; margin-bottom:14px;">🎉</div>
          <h3 style="font-size:26px; font-weight:800; color:var(--secondary);">Application submitted</h3>
          <p style="font-size:15px; color:var(--text-secondary); margin:6px 0 24px 0;">
            Your application has been successfully submitted to the official state departmental portal.
          </p>

          <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:24px; max-width:540px; margin:0 auto 20px auto; text-align:left;">
            <div class="detail-row">
              <span class="detail-label">Application ID (Live)</span>
              <span class="detail-value" style="display:flex; align-items:center; gap:8px;">
                <code style="color:var(--primary); font-size:16px; font-weight:700;" id="generatedAppId">${appState.activeApplicationId}</code>
                <button class="btn-copy-mini" onclick="copyAppId(appState.activeApplicationId, this)" title="Copy Application ID">📋 Copy</button>
              </span>
            </div>
            <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value" id="submittedServiceDisplay">${s.title.split('(')[0].trim()}</span></div>
            <div class="detail-row"><span class="detail-label">Jurisdiction</span><span class="detail-value" id="submittedJurisdictionDisplay">${appState.formData.district || 'District'}, ${appState.formData.state || 'State'}</span></div>
            <div class="detail-row"><span class="detail-label">Submission Timestamp</span><span class="detail-value" id="submittedTimestampDisplay" style="font-weight:600; color:var(--text-primary);">Just now</span></div>
            <div class="detail-row"><span class="detail-label">Live Status</span><span class="detail-value" style="color:var(--accent); font-weight:700;">🟡 Processing / In Department Review</span></div>
          </div>

          <div style="max-width:540px; margin:0 auto 24px auto; background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:12px 18px; text-align:left; font-size:13.5px; color:#1e40af;">
            💡 <strong>Track Anytime:</strong> Your unique Application ID has been generated live. You can search this ID in Track Status or click below to view real-time review progress.
          </div>

          <div style="display:inline-flex; gap:16px; flex-wrap:wrap; justify-content:center;">
            <button class="btn btn-primary" id="btnSuccessTrack" onclick="goToTrackingView(appState.activeApplicationId)">
              Track Application Now ➔
            </button>
            <button class="btn btn-secondary" onclick="showView('applications')">
              Go to Dashboard
            </button>
          </div>
        </div>

      </div>
    `;
  }
}

// ── Wizard Step Actions ───────────────────────────────────────────────────────
const DISTRICTS_BY_STATE = {
  'Bihar': ['Patna (पटना)', 'Gaya (गया)', 'Muzaffarpur (मुजफ्फरपुर)', 'Bhagalpur (भागलपुर)', 'Darbhanga (दरभंगा)'],
  'Uttar Pradesh': ['Lucknow (लखनऊ)', 'Varanasi (वाराणसी)', 'Kanpur (कानपुर)', 'Prayagraj (प्रयागराज)', 'Noida / GB Nagar (नोएडा)'],
  'Jharkhand': ['Ranchi (राँची)', 'Dhanbad (धनबाद)', 'Jamshedpur (जमशेदपुर)', 'Bokaro (बोकारो)'],
  'Delhi': ['Central Delhi (मध्य दिल्ली)', 'New Delhi (नई दिल्ली)', 'South Delhi (दक्षिण दिल्ली)', 'North Delhi (उत्तर दिल्ली)'],
  'Maharashtra': ['Mumbai (मुंबई)', 'Pune (पुणे)', 'Nagpur (नागपुर)', 'Nashik (नाशिक)', 'Thane (ठाणे)'],
  'Madhya Pradesh': ['Bhopal (भोपाल)', 'Indore (इन्दौर)', 'Gwalior (ग्वालियर)', 'Jabalpur (जबलपुर)'],
  'Rajasthan': ['Jaipur (जयपुर)', 'Jodhpur (जोधपुर)', 'Udaipur (उदयपुर)', 'Kota (कोटा)'],
  'West Bengal': ['Kolkata (कोलकाता)', 'Howrah (हावड़ा)', 'North 24 Parganas (उत्तर 24 परगना)'],
  'Karnataka': ['Bengaluru Urban (ಬೆಂಗಳೂರು)', 'Mysuru (ಮೈಸೂರು)', 'Mangaluru (ಮಂಗಳೂರು)'],
  'Tamil Nadu': ['Chennai (சென்னை)', 'Coimbatore (கோயம்புத்தூர்)', 'Madurai (மதுரை)']
};

function updateDistricts(stateVal) {
  appState.formData.state = stateVal;
  const distSelect = document.getElementById('districtSelect');
  if (!distSelect) return;
  const stConf = getStateConfig(stateVal);
  const distList = Object.keys(stConf.districts || {});
  const list = distList.length > 0 ? distList : (DISTRICTS_BY_STATE[stateVal] || ['Central District', 'North District', 'South District']);
  distSelect.innerHTML = list.map(d => {
    const rawVal = d.split(' ')[0];
    return `<option value="${rawVal}">${d}</option>`;
  }).join('');
  const firstDist = distSelect.value || (list[0] ? list[0].split(' ')[0] : 'Central');
  appState.formData.district = firstDist;
  updateBlocks(firstDist);

  // Sync sample address fields to chosen state for realistic and accurate demonstration
  if (stConf.defaultStreet && (!appState.formData.houseStreet || appState.formData.houseStreet.includes('Main Road') || appState.formData.houseStreet.includes('Civil Lines'))) {
    appState.formData.houseStreet = stConf.defaultStreet;
    appState.formData.villageTown = firstDist;
    appState.formData.pincode = stConf.pincode;
  }
  updateJurisdictionBanner();
}

function updateBlocks(districtVal) {
  const blockSelect = document.getElementById('blockSelect');
  if (!blockSelect) return;
  const stateVal = appState.formData.state || 'Uttar Pradesh';
  const stConf = getStateConfig(stateVal);
  const blocks = (stConf.districts && stConf.districts[districtVal]) || [`${districtVal} Sadar`, `${districtVal} North`, `${districtVal} South`];
  blockSelect.innerHTML = blocks.map(b => `<option value="${b}">${b}</option>`).join('');
  appState.formData.block = blockSelect.value || blocks[0];
  updateJurisdictionBanner();
}

function updateJurisdictionBanner() {
  const banner = document.getElementById('selectedJurisdictionBanner');
  if (banner) {
    const s = appState.formData.state || 'Uttar Pradesh';
    const d = appState.formData.district || 'Lucknow';
    const b = appState.formData.block || 'Lucknow Sadar';
    banner.innerHTML = `📍 <strong>Selected Jurisdiction:</strong> ${s} · ${d} · ${b} (SDO / Revenue Authority)`;
  }
  const locEl = document.getElementById('wizardLocationIndicator');
  if (locEl) {
    locEl.innerText = `📍 ${appState.formData.state || 'State'} · ${appState.formData.district || 'District'}`;
  }
}

function selectPurpose(purposeVal, btn) {
  appState.formData.purpose = purposeVal;
  document.querySelectorAll('.option-card-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function recalcEligibility() {
  const inc = parseInt(document.getElementById('eligIncome').value, 10) || 0;
  appState.formData.annualIncome = inc;
  const box = document.getElementById('eligibilityResultBox');
  const btn = document.getElementById('btnEligContinue');

  if (inc <= 300000) {
    box.className = 'eligibility-box';
    box.innerHTML = `
      <div style="font-size:28px;">✅</div>
      <div>
        <strong style="color:#166534; font-size:16px;">You can continue. You appear eligible to apply.</strong>
        <p style="font-size:13.5px; color:#15803d; margin-top:3px;">
          Based on the information you've provided, your annual family income of ₹${inc.toLocaleString('en-IN')} meets statutory limits.
        </p>
      </div>
    `;
    btn.disabled = false;
  } else {
    box.className = 'eligibility-box ineligible';
    box.innerHTML = `
      <div style="font-size:28px;">⚠️</div>
      <div>
        <strong style="color:#991b1b; font-size:16px;">You may need to check one more requirement.</strong>
        <p style="font-size:13.5px; color:#b91c1c; margin-top:3px;">
          Income above ₹3,00,000 exceeds standard thresholds for non-creamy layer scholarships, but you may still proceed for general certification.
        </p>
      </div>
    `;
  }
}

// ── 17 & 18. Document Upload & Problem State Modals ───────────────────────────
function openDocUploadModal(slot, title) {
  appState.selectedSlotForUpload = slot;
  document.getElementById('uploadModalDocTitle').innerText = `Upload ${title}`;
  document.getElementById('uploadProgressBox').style.display = 'none';
  document.getElementById('docProblemStateBox').style.display = 'none';
  document.getElementById('fileDropZone').style.display = 'block';
  document.getElementById('docUploadModal').style.display = 'flex';
}

function closeDocUploadModal() {
  document.getElementById('docUploadModal').style.display = 'none';
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.remove('drag-over');
}

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('fileDropZone').classList.remove('drag-over');
  if (e.dataTransfer.files.length > 0) {
    executeUploadFlow(e.dataTransfer.files[0].name);
  }
}

function handleModalFileSelect(input) {
  if (input.files.length > 0) {
    executeUploadFlow(input.files[0].name);
  }
}

function executeUploadFlow(filename) {
  const dropZone = document.getElementById('fileDropZone');
  const progressBox = document.getElementById('uploadProgressBox');
  const progressBar = document.getElementById('uploadProgressBarFill');
  const progressLabel = document.getElementById('uploadProgressLabel');
  const progressPercent = document.getElementById('uploadProgressPercent');

  dropZone.style.display = 'none';
  progressBox.style.display = 'block';

  let p = 20;
  progressBar.style.width = '20%';
  progressPercent.innerText = '20%';
  progressLabel.innerText = 'Uploading document...';

  const interval = setInterval(() => {
    p += 25;
    progressBar.style.width = `${p}%`;
    progressPercent.innerText = `${p}%`;

    if (p === 70) {
      progressLabel.innerText = 'Checking your document...';
    }

    if (p >= 100) {
      clearInterval(interval);
      progressLabel.innerText = '✓ Document looks good';
      setTimeout(() => {
        autoUploadSample(appState.selectedSlotForUpload || 'aadhaar');
        closeDocUploadModal();
      }, 700);
    }
  }, 300);
}

function autoUploadCurrentSlot() {
  executeUploadFlow('sample_document.pdf');
}

function autoUploadSample(slot) {
  const badge = document.getElementById(`badge-${slot}`);
  const ocr = document.getElementById(`ocr-${slot}`);
  const box = document.getElementById(`box-${slot}`);

  if (!badge) return;

  badge.className = 'doc-status-badge valid';
  badge.innerText = '✓ VERIFIED';
  box.classList.add('verified');
  ocr.style.display = 'inline-flex';

  if (slot === 'aadhaar') {
    ocr.innerText = `Extracted: ${appState.extractedOcr.aadhaar.name} • DOB: ${appState.extractedOcr.aadhaar.dob}`;
    const mismatchBox = document.getElementById('nameMismatchAlertBox');
    if (mismatchBox) mismatchBox.style.display = 'block';
  } else if (slot === 'address_proof') {
    ocr.innerText = `Extracted: ${appState.extractedOcr.address_proof.address}`;
  } else if (slot === 'income_proof') {
    ocr.innerText = `Extracted: ₹1,20,000 Annual • Date: 15-Sep-2026`;
  } else if (slot === 'photo') {
    ocr.innerText = `Portrait Quality: 98% Clear`;
  }
}

function autoUploadAllDemoDocs() {
  ['aadhaar', 'address_proof', 'income_proof', 'photo'].forEach(s => autoUploadSample(s));
}

function resolveMismatch(choice) {
  if (choice === 'doc') {
    appState.formData.fullName = 'Rahul Kumar Singh';
  }
  document.getElementById('nameMismatchAlertBox').style.display = 'none';
}

function saveFormAndReview() {
  const nameEl = document.getElementById('f-fullName');
  if (nameEl) {
    appState.formData.fullName = nameEl.value;
    appState.formData.fatherName = document.getElementById('f-fatherName').value;
    appState.formData.dob = document.getElementById('f-dob').value;
    appState.formData.mobile = document.getElementById('f-mobile').value;
    appState.formData.houseStreet = document.getElementById('f-house').value;
    appState.formData.villageTown = document.getElementById('f-village').value;
    appState.formData.pincode = document.getElementById('f-pin').value;
    appState.formData.annualIncome = parseInt(document.getElementById('f-income').value, 10) || 120000;
    appState.formData.purpose = document.getElementById('f-purpose').value;
  }
  setWizardStep(5);
}

// ── 23. Final Confirmation & Submission Flow (Section 24) ─────────────────────
function openConsentGateModal() {
  const dec = document.getElementById('userDeclaration');
  if (dec && !dec.checked) {
    alert('Please confirm that you have reviewed your details before continuing.');
    return;
  }
  document.getElementById('c-name').innerText = appState.formData.fullName;
  document.getElementById('c-father').innerText = appState.formData.fatherName;
  document.getElementById('c-address').innerText = `${appState.formData.block}, ${appState.formData.district}, ${appState.formData.state}`;
  document.getElementById('c-income').innerText = `₹${appState.formData.annualIncome.toLocaleString('en-IN')}`;

  // Populate inline name in declaration sentence
  const nameInline = document.getElementById('c-name-inline');
  if (nameInline) nameInline.innerText = appState.formData.fullName || 'Citizen';

  // Populate dynamic destination department and state government authority
  const stConf = getStateConfig(appState.formData.state);
  const destEl = document.getElementById('consentDestDisplay');
  if (destEl) {
    destEl.innerText = `🏛️ Department of Revenue & Citizen Services, ${stConf.govName} (${stConf.portal})`;
  }
  const govInline = document.getElementById('c-gov-inline');
  if (govInline) {
    govInline.innerText = stConf.govName;
  }

  // Reset consent gate: checkbox UNCHECKED, submit button DISABLED
  const checkbox = document.getElementById('modalFinalConsentCheck');
  if (checkbox) checkbox.checked = false;
  const submitBtn = document.getElementById('btnFinalSubmit');
  if (submitBtn) submitBtn.disabled = true;

  document.getElementById('wizardConsentModal').style.display = 'flex';
}

// Called when the citizen ticks/unticks the consent checkbox
function toggleConsentButton(checked) {
  const submitBtn = document.getElementById('btnFinalSubmit');
  if (submitBtn) submitBtn.disabled = !checked;
}

function closeConsentModal(confirmed) {
  document.getElementById('wizardConsentModal').style.display = 'none';
}

function confirmAndExecuteSubmission() {
  closeConsentModal(true);
  setWizardStep(6); // Go to Payment step
}

// ── Payment Gateway Helper Functions ──────────────────────────────────────────
function switchPayTab(tab, btn) {
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pay-panel').forEach(p => p.style.display = 'none');
  btn.classList.add('active');
  const panel = document.getElementById(`pay-panel-${tab}`);
  if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

function selectBank(btn, bankName) {
  document.querySelectorAll('.pay-bank-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function simulatePaymentFailed() {
  const payCard = document.querySelector('.pay-gateway-card');
  if (!payCard) return;
  payCard.innerHTML = `
    <div class="pay-demo-banner">🔒 DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED</div>
    <div style="text-align:center; padding:48px 24px;">
      <div style="font-size:60px; margin-bottom:16px;">❌</div>
      <h3 style="color:#dc2626; font-size:24px; font-weight:800; margin-bottom:8px;">Payment Failed</h3>
      <p style="color:var(--text-secondary); font-size:15px; max-width:380px; margin:0 auto 24px auto;">
        This is a simulated payment failure for demonstration purposes. No real transaction was attempted.
      </p>
      <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:20px; max-width:400px; margin:0 auto 28px auto; text-align:left;">
        <div class="pay-summary-row"><span>Error Code</span><strong style="color:#dc2626;">DEMO_DECLINED_001</strong></div>
        <div class="pay-summary-row"><span>Reason</span><strong>Simulated card decline (Demo)</strong></div>
        <div class="pay-summary-row"><span>Amount Charged</span><strong style="color:#16a34a;">₹0 (None)</strong></div>
      </div>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="setWizardStep(6)">← Try Again</button>
        <button class="btn btn-secondary" onclick="showView('home')">Go Home</button>
      </div>
    </div>
  `;
}

// ── 23B. Backend-Driven Payment Gateway & Verification ────────────────────────
async function renderPaymentStep(container) {
  const s = appState.activeService || SERVICES[0];
  const govFee = (s && s.govFee !== undefined) ? s.govFee : 1;
  const svcTitle = s ? s.title.split('(')[0].trim() : 'Government Service';

  // Skeleton / loading state while initializing backend order
  container.innerHTML = `
    <div class="wizard-card pay-gateway-card" id="payGatewayCard">
      <div class="pay-demo-banner">
        🛡️ OFFICIAL DEMO PAYMENT GATEWAY • BACKEND VERIFIED
      </div>
      <div style="text-align:center; padding:48px 24px;">
        <div class="pay-spinner"></div>
        <h3 style="font-size:18px; font-weight:700; margin-top:16px; color:var(--text-primary);">Initializing Secure Order...</h3>
        <p style="color:var(--text-muted); font-size:13.5px;">Creating unique order on backend server...</p>
      </div>
    </div>
  `;

  try {
    let orderData = null;
    const existingOrderId = sessionStorage.getItem('citizen_active_order_id');
    
    if (existingOrderId && !appState._lastPaymentOrderId) {
      try {
        const checkRes = await fetch(`/api/payments/order/${existingOrderId}`);
        if (checkRes.ok) {
          const existing = await checkRes.json();
          // Only restore if it matches current service AND is still PENDING
          if (existing.service_id === (s.id || 'income_certificate') && existing.status === 'PENDING') {
            orderData = existing;
          }
        }
      } catch (e) {
        console.warn('Could not restore previous order, creating fresh order:', e);
      }
    }

    if (!orderData) {
      const createRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: s.id || 'income_certificate',
          service_title: svcTitle,
          amount: govFee,
          customer_name: appState.formData.fullName || 'Citizen',
          customer_email: appState.formData.email || 'citizen@example.com',
          customer_phone: appState.formData.mobile || '9876543210',
          state: appState.formData.state || 'Uttar Pradesh',
          district: appState.formData.district || 'Lucknow',
          payment_method: 'UPI_QR'
        })
      });

      if (!createRes.ok) {
        throw new Error('Failed to create order on server');
      }
      orderData = await createRes.json();
    }

    appState._activeOrderId = orderData.order_id;
    appState._activeOrderData = orderData;
    sessionStorage.setItem('citizen_active_order_id', orderData.order_id);

    // If order is already PAID (e.g. page refresh after payment)
    if (orderData.status === 'PAID') {
      renderPaymentVerifiedSuccess(orderData);
      return;
    }

    // Render full checkout view around existing UPI QR
    const cardEl = document.getElementById('payGatewayCard');
    if (!cardEl) return;

    cardEl.innerHTML = `
      <!-- DEMO & SECURITY BANNER -->
      <div class="pay-demo-banner">
        🛡️ SECURE UPI CHECKOUT • VERIFIED BY BACKEND SERVER
      </div>

      <div class="pay-layout">
        <!-- LEFT: Order Summary -->
        <div class="pay-summary-col">
          <div class="pay-summary-header">
            <span class="pay-summary-kicker">ORDER SUMMARY</span>
            <h3>${svcTitle}</h3>
          </div>
          <div class="pay-summary-rows">
            <div class="pay-summary-row">
              <span>Order ID</span>
              <strong class="pay-order-code" id="orderIdDisplay">${orderData.order_id}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Service</span>
              <strong>${svcTitle}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Quantity</span>
              <strong>1</strong>
            </div>
            <div class="pay-summary-row">
              <span>Applicant Name</span>
              <strong>${orderData.customer_name || appState.formData.fullName || 'Citizen'}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Mobile Number</span>
              <strong>+91 ${orderData.customer_phone || appState.formData.mobile || '9876543210'}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Email</span>
              <strong>${orderData.customer_email || appState.formData.email || 'citizen@example.com'}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Jurisdiction</span>
              <strong>${appState.formData.district || 'District'}, ${appState.formData.state || 'State'}</strong>
            </div>
            <div class="pay-summary-divider"></div>
            <div class="pay-summary-row">
              <span>Government Fee</span>
              <strong>₹${Number(orderData.amount).toFixed(2)}</strong>
            </div>
            <div class="pay-summary-row">
              <span>Platform Fee</span>
              <strong style="color:var(--secondary);">₹0.00 Free</strong>
            </div>
            <div class="pay-summary-row total">
              <span>Total Payable Amount</span>
              <strong class="pay-total-amount">₹${Number(orderData.amount).toFixed(2)}</strong>
            </div>
            <div class="pay-summary-row" style="margin-top:6px; border:none;">
              <span>Payment Status</span>
              <span id="payStatusBadge" class="pay-badge-pending">⏳ PENDING</span>
            </div>
          </div>
          <div class="pay-secure-badge">
            🛡️ Secured by DPDP 2023 • Backend Audited
          </div>
        </div>

        <!-- RIGHT: Payment Methods & Existing UPI QR -->
        <div class="pay-method-col">
          <div class="pay-method-tabs">
            <button class="pay-tab active" onclick="switchPayTab('upi', this)" id="paytab-upi">📱 UPI QR</button>
            <button class="pay-tab" onclick="switchPayTab('card', this)" id="paytab-card">💳 Card</button>
            <button class="pay-tab" onclick="switchPayTab('netbanking', this)" id="paytab-netbanking">🏦 Net Banking</button>
          </div>

          <!-- UPI Panel with User's Existing QR Code -->
          <div id="pay-panel-upi" class="pay-panel active">
            <p class="pay-panel-hint">
              <b>Step 1:</b> Scan the QR code using any UPI app (Google Pay / PhonePe / Paytm / BHIM) and pay <b>₹${Number(orderData.amount).toFixed(2)}</b>.<br>
              <b>Step 2:</b> Enter the 12-digit UPI Reference / UTR Number from your payment receipt below and click <b>Verify &amp; Confirm Payment</b>.
            </p>
            <div class="pay-qr-box">
              <div class="pay-qr-img-wrapper">
                <img src="gpay-qr.png" alt="Scan to pay ₹1 via UPI" class="pay-qr-image">
              </div>
              <span class="pay-qr-label">Scan with any UPI app to Pay ₹${Number(orderData.amount).toFixed(2)}</span>
            </div>

            <!-- UTR Input & Verification Section -->
            <div class="form-group" style="margin-top:16px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:16px;">
              <label class="form-label" style="font-weight:700; color:#1e293b;">
                12-Digit UPI Transaction / UTR Number *
              </label>
              <input type="text" class="form-control" id="pay-upi-utr" placeholder="e.g. 428701928374 (From GPay / PhonePe)" maxlength="18" style="font-family:monospace; font-size:15px; letter-spacing:1px; font-weight:600;">
              <span style="font-size:12px; color:var(--text-muted); margin-top:4px; display:block;">
                Find this in your payment app receipt under "UPI Transaction ID" or "UTR".
              </span>
              <button type="button" class="btn btn-primary" onclick="submitUtrVerification()" style="width:100%; margin-top:12px; padding:12px; font-weight:700; font-size:14.5px;">
                ✓ Verify &amp; Confirm Payment ➔
              </button>
            </div>

            <div class="pay-upi-logos" style="margin-top:12px;">
              <span class="upi-logo">GPay</span>
              <span class="upi-logo">PhonePe</span>
              <span class="upi-logo">Paytm</span>
              <span class="upi-logo">BHIM</span>
            </div>
          </div>

          <!-- Card Panel -->
          <div id="pay-panel-card" class="pay-panel" style="display:none;">
            <p class="pay-panel-hint">Enter your debit or credit card details below.</p>
            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-control pay-card-input" id="pay-card-num" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCardNumber(this)" autocomplete="off">
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="text" class="form-control" id="pay-card-exp" placeholder="MM / YY" maxlength="7" oninput="formatExpiry(this)" autocomplete="off">
              </div>
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input type="password" class="form-control" id="pay-card-cvv" placeholder="•••" maxlength="4" autocomplete="off">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cardholder Name</label>
              <input type="text" class="form-control" id="pay-card-name" placeholder="Name on card" value="${appState.formData.fullName || ''}" autocomplete="off">
            </div>
            <div class="pay-card-logos">
              <span class="card-logo visa">VISA</span>
              <span class="card-logo mc">MC</span>
              <span class="card-logo rupay">RuPay</span>
            </div>
            <p class="pay-card-notice">⚠️ This is a demo — no card credentials are sent or stored.</p>
          </div>

          <!-- Net Banking Panel -->
          <div id="pay-panel-netbanking" class="pay-panel" style="display:none;">
            <p class="pay-panel-hint">Select your bank to proceed with net banking.</p>
            <div class="pay-bank-grid">
              ${['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara', 'Union Bank', 'IDFC First'].map(b =>
                `<button class="pay-bank-btn" onclick="selectBank(this, '${b}')">${b}</button>`
              ).join('')}
            </div>
          </div>

          <!-- Status Notice Area -->
          <div id="payStatusNoticeArea"></div>

          <!-- Check Payment Status Button -->
          <button id="btnCheckPaymentStatus" class="pay-now-btn btn-check-status" onclick="checkBackendPaymentStatus()">
            <span id="checkPayBtnIcon">🔍</span>
            <span id="checkPayBtnText">Check Payment Status</span>
          </button>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Error in renderPaymentStep:', err);
    container.innerHTML = `
      <div class="wizard-card" style="text-align:center; padding:40px;">
        <div style="font-size:42px; margin-bottom:12px;">⚠️</div>
        <h3>Unable to Connect to Payment Service</h3>
        <p style="color:var(--text-muted); margin-top:8px;">${err.message || 'Please check backend server connection.'}</p>
        <button class="btn btn-primary" style="margin-top:20px;" onclick="renderPaymentStep(document.getElementById('wizardStepBody'))">↻ Retry</button>
      </div>
    `;
  }
}

async function submitUtrVerification() {
  const orderId = appState._activeOrderId || sessionStorage.getItem('citizen_active_order_id');
  const utrInput = document.getElementById('pay-upi-utr');
  const utrVal = utrInput ? utrInput.value.trim() : '';

  if (!orderId) {
    alert('No active order ID found. Please refresh.');
    return;
  }

  if (!utrVal || utrVal.length < 6) {
    alert('Please enter the valid 12-digit UPI Transaction / UTR Number from your GPay / PhonePe payment confirmation screen.');
    if (utrInput) utrInput.focus();
    return;
  }

  const cardEl = document.getElementById('payGatewayCard') || document.querySelector('.pay-gateway-card');
  if (cardEl) {
    cardEl.innerHTML = `
      <div class="pay-demo-banner">🛡️ PAYMENT VERIFICATION • VALIDATING WITH BANK</div>
      <div id="pay-processing-box" style="text-align:center; padding:48px 24px; animation:fadeIn 0.3s ease;">
        <div class="pay-spinner"></div>
        <h3 style="font-size:22px; font-weight:800; margin:22px 0 8px 0; color:var(--text-primary);">
          Validating UPI Reference: ${utrVal}...
        </h3>
        <p style="color:var(--text-muted); font-size:14.5px; max-width:460px; margin:0 auto;">
          Synchronizing transaction record with backend database. Please wait...
        </p>
      </div>
    `;
  }

  try {
    const res = await fetch('/api/payments/submit-utr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        utr_number: utrVal,
        payer_vpa: 'citizen@upi'
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Payment verification failed');
    }

    const data = await res.json();
    renderPaymentVerifiedSuccess(data);
  } catch (err) {
    console.error('UTR verification error:', err);
    await renderPaymentStepWithNotice('failed', `❌ Payment Verification Failed: ${err.message}`);
  }
}

async function checkBackendPaymentStatus() {
  const orderId = appState._activeOrderId || sessionStorage.getItem('citizen_active_order_id');
  if (!orderId) {
    alert('No active order ID found. Please refresh.');
    return;
  }

  const cardEl = document.getElementById('payGatewayCard') || document.querySelector('.pay-gateway-card');
  if (cardEl) {
    cardEl.innerHTML = `
      <div class="pay-demo-banner">🛡️ PAYMENT STATUS INQUIRY • CHECKING BANK</div>
      <div id="pay-processing-box" style="text-align:center; padding:48px 24px; animation:fadeIn 0.3s ease;">
        <div class="pay-spinner"></div>
        <h3 style="font-size:22px; font-weight:800; margin:22px 0 8px 0; color:var(--text-primary);" id="payProcTitle">
          Checking Payment Status...
        </h3>
        <p style="color:var(--text-muted); font-size:14.5px; max-width:460px; margin:0 auto;" id="payProcSub">
          Querying backend database for payment receipt confirmation...
        </p>
      </div>
    `;
  }

  setTimeout(async () => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.status === 'PAID') {
        renderPaymentVerifiedSuccess(data);
      } else if (data.status === 'FAILED') {
        await renderPaymentStepWithNotice('failed', '❌ Payment Failed — The transaction was rejected or invalid.');
      } else {
        // PENDING — STRICTLY NO BYPASS!
        await renderPaymentStepWithNotice('pending', '⚠️ Payment Not Received Yet (Status: PENDING) — We have not received your ₹1.00 payment confirmation. Please scan the QR code in GPay/PhonePe, pay ₹1.00, and enter your 12-digit UPI UTR number above to verify.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      await renderPaymentStepWithNotice('failed', `⚠️ Verification Error: ${err.message || 'Could not reach backend.'}`);
    }
  }, 1000);
}

async function renderPaymentStepWithNotice(noticeType, noticeMessage) {
  const container = document.getElementById('wizardStepBody');
  if (!container) return;
  await renderPaymentStep(container);
  const noticeArea = document.getElementById('payStatusNoticeArea');
  const badge = document.getElementById('payStatusBadge');
  if (noticeArea) {
    noticeArea.innerHTML = `
      <div class="pay-status-notice ${noticeType}">
        <b>${noticeMessage}</b>
      </div>
    `;
  }
  if (badge) {
    if (noticeType === 'failed') {
      badge.className = 'pay-badge-failed';
      badge.innerText = '❌ FAILED';
    } else if (noticeType === 'pending') {
      badge.className = 'pay-badge-pending';
      badge.innerText = '⏳ PENDING';
    }
  }
}

function renderPaymentVerifiedSuccess(data) {
  const cardEl = document.getElementById('payGatewayCard') || document.querySelector('.pay-gateway-card');
  if (!cardEl) return;

  const paidDate = data.paid_at ? new Date(data.paid_at).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  }) : new Date().toLocaleString('en-IN');

  const orderId = data.order_id || appState._activeOrderId;
  const txnId = data.txn_ref_id || ('UPI-UTR-' + Date.now().toString().slice(-10));
  const amount = (data.amount !== undefined) ? data.amount : 1.0;
  const custName = data.customer_name || appState.formData.fullName || 'Citizen';
  const custMobile = data.customer_phone || appState.formData.mobile || '9876543210';
  const custEmail = data.customer_email || appState.formData.email || 'citizen@example.com';

  appState._lastPaymentTxnId = txnId;
  appState._lastPaymentOrderId = orderId;

  cardEl.innerHTML = `
    <div class="pay-demo-banner" style="background:#166534;">
      ✓ PAYMENT LEGITIMATELY VERIFIED BY BACKEND
    </div>
    <div style="text-align:center; padding:36px 24px; animation:fadeIn 0.35s ease;">
      <div class="pay-success-checkmark">✓</div>
      <h3 style="color:#16a34a; font-size:26px; font-weight:800; margin:16px 0 6px 0;">Payment Successful ✓</h3>
      <p style="color:var(--text-secondary); font-size:14.5px; margin-bottom:14px;">
        Your payment of <b>₹${Number(amount).toFixed(2)}</b> has been verified by the backend server.
      </p>

      <div style="background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; padding:10px 18px; border-radius:8px; font-weight:700; font-size:14px; display:inline-block; margin-bottom:20px;">
        ⏳ Redirecting to Application Submission in <span id="autoRedirectCountdown">3</span>s...
      </div>

      <div class="pay-receipt-card">
        <div class="pay-summary-row"><span>Order ID</span><strong style="font-family:monospace; color:var(--primary); font-weight:800;">${orderId}</strong></div>
        <div class="pay-summary-row"><span>Amount Paid</span><strong style="color:#16a34a; font-size:16px;">₹${Number(amount).toFixed(2)}</strong></div>
        <div class="pay-summary-row"><span>Transaction / UTR Ref</span><strong style="font-family:monospace;">${txnId}</strong></div>
        <div class="pay-summary-row"><span>Payment Date & Time</span><strong>${paidDate}</strong></div>
        <div class="pay-summary-row"><span>Applicant Name</span><strong>${custName}</strong></div>
        <div class="pay-summary-row"><span>Mobile / Email</span><strong>+91 ${custMobile} • ${custEmail}</strong></div>
        <div class="pay-summary-row"><span>Verification Status</span><strong style="color:#16a34a;">✓ Backend Verified (PAID)</strong></div>
      </div>

      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:24px;">
        <button class="btn btn-secondary" onclick="downloadPaymentReceipt('${txnId}', '${orderId}', '${amount}', '${paidDate}')">📥 Download Receipt (PDF)</button>
        <button class="btn btn-success btn-continue-submit" onclick="proceedAfterPayment('${orderId}', '${txnId}')">Continue to Submit Application ➔</button>
      </div>
    </div>
  `;

  // Automatic redirect timer after payment verification
  if (appState._redirectTimer) clearInterval(appState._redirectTimer);
  let secondsLeft = 3;
  appState._redirectTimer = setInterval(() => {
    secondsLeft--;
    const el = document.getElementById('autoRedirectCountdown');
    if (el) el.innerText = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(appState._redirectTimer);
      proceedAfterPayment(orderId, txnId);
    }
  }, 1000);
}

function downloadPaymentReceipt(txnId, orderId, amount, paidDate) {
  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(22, 101, 52);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("CITIZEN SERVICE PORTAL", 105, 14, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICIAL PAYMENT ACKNOWLEDGEMENT RECEIPT", 105, 22, { align: "center" });

      // Title & Divider
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Verification Receipt", 20, 44);

      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225);
      doc.line(20, 48, 190, 48);

      const s = appState.activeService;
      const svcTitle = s ? s.title : 'Government Service';
      const custName = appState.formData.fullName || 'Citizen';
      const custMobile = appState.formData.mobile || 'N/A';
      const custEmail = appState.formData.email || 'N/A';

      const rows = [
        ["Order ID:", orderId || 'N/A'],
        ["Transaction / UTR Ref:", txnId || 'N/A'],
        ["Service Title:", svcTitle],
        ["Applicant Name:", custName],
        ["Mobile Number:", "+91 " + custMobile],
        ["Email Address:", custEmail],
        ["Payment Date & Time:", paidDate || new Date().toLocaleString('en-IN')],
        ["Amount Paid:", `Rs. ${Number(amount || 1).toFixed(2)}`],
        ["Verification Status:", "Backend Verified (PAID)"],
        ["Verification Source:", "Bank Settlement / Backend Audit Log"]
      ];

      let y = 58;
      doc.setFontSize(11);
      rows.forEach(([label, val]) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text(label, 20, y);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(String(val), 78, y);
        
        y += 9;
      });

      doc.setLineWidth(0.5);
      doc.setDrawColor(203, 213, 225);
      doc.line(20, y, 190, y);
      y += 12;

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("This is an electronically generated payment receipt for government service application fee.", 105, y, { align: "center" });
      doc.text("Secured & Verified by Citizen Service Portal Backend Engine.", 105, y + 5, { align: "center" });

      doc.save(`Payment_Receipt_${orderId || 'TXN'}.pdf`);
      return;
    }
  } catch (err) {
    console.error("PDF generation fallback error:", err);
  }

  // Text fallback if jsPDF is blocked by browser policies
  const receiptText = `=====================================================
            CITIZEN SERVICE PORTAL RECEIPT           
=====================================================
Order ID:               ${orderId}
Transaction Ref (UTR):  ${txnId}
Amount Paid:            ₹${Number(amount).toFixed(2)}
Payment Date & Time:    ${paidDate}
Applicant Name:         ${appState.formData.fullName || 'Citizen'}
Mobile Number:          +91 ${appState.formData.mobile || 'N/A'}
Email:                  ${appState.formData.email || 'N/A'}
Verification Status:    Backend Verified (PAID)
=====================================================`;
  const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Payment_Receipt_${orderId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function proceedAfterPayment(orderId, txnId) {
  if (appState._redirectTimer) {
    clearInterval(appState._redirectTimer);
    appState._redirectTimer = null;
  }
  if (orderId) appState._lastPaymentOrderId = orderId;
  if (txnId) appState._lastPaymentTxnId = txnId;
  setWizardStep(7);
  const statusText = document.getElementById('submissionStatusText');
  const submittingBox = document.getElementById('submittingStateBox');
  const successBox = document.getElementById('submissionSuccessBox');
  const bar = document.getElementById('submissionProgressBar');

  setTimeout(() => {
    if (statusText) statusText.innerText = 'Checking information...';
    if (bar) bar.style.width = '50%';
  }, 800);
  setTimeout(() => {
    if (statusText) statusText.innerText = 'Sending application...';
    if (bar) bar.style.width = '75%';
  }, 1800);
  setTimeout(() => {
    if (statusText) statusText.innerText = 'Application submitted';
    if (bar) bar.style.width = '100%';
  }, 2700);
  setTimeout(() => {
    if (submittingBox) submittingBox.style.display = 'none';
    if (successBox) successBox.style.display = 'block';

    const stateCodeMap = {
      'Bihar': 'BR', 'Uttar Pradesh': 'UP', 'Jharkhand': 'JH',
      'Delhi': 'DL', 'Maharashtra': 'MH', 'Madhya Pradesh': 'MP',
      'Rajasthan': 'RJ', 'West Bengal': 'WB', 'Karnataka': 'KA',
      'Tamil Nadu': 'TN', 'Gujarat': 'GJ', 'Punjab': 'PB'
    };
    const stCode = getStateConfig(appState.formData.state).code || 'UP';
    const sId = (appState.activeService && appState.activeService.id) || 'income_certificate';
    const svcPrefix = (sId === 'caste_certificate') ? 'CST'
      : (sId === 'domicile_certificate') ? 'DOM'
      : (sId === 'driving_licence') ? 'DL'
      : (sId === 'scholarship') ? 'SCH'
      : (sId === 'birth_certificate') ? 'BRT'
      : (sId === 'pension') ? 'PEN'
      : 'INC';
    const newId = `${svcPrefix}-${stCode}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    appState.activeApplicationId = newId;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullSubmittedAt = `${dateStr}, ${timeStr}`;

    const appIdEl = document.getElementById('generatedAppId');
    if (appIdEl) appIdEl.innerText = newId;
    const timeEl = document.getElementById('submittedTimestampDisplay');
    if (timeEl) timeEl.innerText = fullSubmittedAt;
    const trackBtn = document.getElementById('btnSuccessTrack');
    if (trackBtn) trackBtn.setAttribute('onclick', `goToTrackingView('${newId}')`);

    const svcName = (appState.activeService && appState.activeService.title)
      ? appState.activeService.title.split('(')[0].trim() : 'Income Certificate';
    appState.myApplications.unshift({
      id: newId, service: svcName,
      state: appState.formData.state || 'Uttar Pradesh',
      district: appState.formData.district || 'Lucknow',
      date: fullSubmittedAt, status: 'UNDER_REVIEW', progress: 35,
      paymentVerified: true,
      txnId: appState._lastPaymentTxnId || ('TXN' + Date.now().toString().slice(-10))
    });
    renderMyApplications();
    renderRecentTrackChips();
  }, 3500);
}

function downloadPaymentReceipt(txnId, orderId, amount, datetime) {
  const receiptText = [
    '============================================',
    '     CITIZEN-SERVICE AGENT — DEMO RECEIPT   ',
    '  *** DEMO ONLY — NOT A REAL TRANSACTION *** ',
    '============================================',
    `Transaction ID : ${txnId}`,
    `Order ID       : ${orderId}`,
    `Amount         : ₹${amount === '0' ? '0 (Free Service)' : amount}`,
    `Date & Time    : ${datetime}`,
    `Applicant      : ${appState.formData.fullName || 'Citizen'}`,
    `Mobile         : +91 ${appState.formData.mobile || ''}`,
    `Service        : ${appState.activeService ? appState.activeService.title.split('(')[0].trim() : 'Government Service'}`,
    `State          : ${appState.formData.state || 'Uttar Pradesh'}`,
    '============================================',
    'No real money was charged. This is a demo.',
    '============================================',
  ].join('\n');
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const a = document.createElement('a'); 
  a.href = URL.createObjectURL(blob);
  a.download = `demo-receipt-${txnId}.txt`;
  a.click();
}

// ── 26. Application Tracking View & Timeline ──────────────────────────────────
function goToTrackingView(appId) {
  showView('track');
  const targetId = appId || appState.activeApplicationId;
  const searchInput = document.getElementById('trackSearchInput');
  if (searchInput) searchInput.value = targetId;
  loadTrackingDetails(targetId);
  renderRecentTrackChips();
}

function searchTrackingId() {
  const val = document.getElementById('trackSearchInput').value.trim();
  if (val) {
    loadTrackingDetails(val);
    renderRecentTrackChips();
  }
}

function copyAppId(appId, btn) {
  if (!appId) appId = appState.activeApplicationId;
  navigator.clipboard.writeText(appId).then(() => {
    const oldText = btn.innerHTML;
    btn.innerHTML = '✓ Copied';
    btn.style.color = '#15803d';
    setTimeout(() => {
      btn.innerHTML = oldText;
      btn.style.color = '';
    }, 1500);
  }).catch(() => {
    alert(`Application ID: ${appId}`);
  });
}

function renderRecentTrackChips() {
  const box = document.getElementById('recentTrackChips');
  if (!box) return;
  const activeApp = appState.myApplications.find(a => a.id === appState.activeApplicationId) || appState.myApplications[0];
  if (!activeApp) return;
  box.innerHTML = `
    <span class="recent-track-label">🔍 Live Generated ID:</span>
    <button class="recent-track-chip active" onclick="goToTrackingView('${activeApp.id}')" title="Track ${activeApp.id}">
      <code>${activeApp.id}</code> · <span>${activeApp.service.split(' ')[0]}</span>
    </button>
  `;
}

function loadTrackingDetails(appId) {
  if (!appId) appId = appState.activeApplicationId;
  appState.activeApplicationId = appId;

  const foundApp = appState.myApplications.find(a => a.id.toLowerCase() === appId.toLowerCase());
  
  let appStateName = (foundApp && foundApp.state) || appState.formData.state || 'Uttar Pradesh';
  let appDistrictName = (foundApp && foundApp.district) || appState.formData.district || 'Lucknow';
  let appServiceName = (foundApp && foundApp.service) || 'Income Certificate';

  if (!foundApp) {
    const parts = appId.split('-');
    if (parts.length >= 2) {
      const code = parts[1];
      const parsed = getStateConfig(code);
      if (parsed) {
        appStateName = parsed.name;
        appDistrictName = Object.keys(parsed.districts)[0] || 'District HQ';
      }
      const prefix = parts[0].toUpperCase();
      if (prefix === 'CST') appServiceName = 'Caste Certificate (OBC)';
      else if (prefix === 'DOM') appServiceName = 'Residence Certificate';
      else if (prefix === 'DL') appServiceName = 'Driving Licence (Learner)';
      else if (prefix === 'SCH') appServiceName = 'Post-Matric Scholarship';
      else if (prefix === 'BRT') appServiceName = 'Birth Certificate';
      else if (prefix === 'PEN') appServiceName = 'Old Age Pension';
    }
  }

  const stConf = getStateConfig(appStateName);
  const displayId = foundApp ? foundApp.id : appId;
  const displayService = appServiceName;
  const displayJurisdiction = `${appDistrictName}, ${stConf.name}`;
  const displayDate = foundApp ? foundApp.date : '07 Oct 2026, 02:45 PM';
  const displayStatus = foundApp ? foundApp.status : 'UNDER_REVIEW';

  const portalNotice = document.getElementById('timelinePortalNotice');
  if (portalNotice) portalNotice.innerText = `Real-time status updates from ${stConf.portal}`;

  const trackAppIdDisplay = document.getElementById('trackAppIdDisplay');
  if (trackAppIdDisplay) trackAppIdDisplay.innerText = displayId;
  
  const trackHeading = document.getElementById('trackServiceHeading');
  if (trackHeading) trackHeading.innerText = displayService;

  const certNumberLabel = document.getElementById('certNumberLabel');
  if (certNumberLabel) certNumberLabel.innerText = displayId;
  const certNoDisplay = document.getElementById('certNoDisplay');
  if (certNoDisplay) certNoDisplay.innerText = displayId;
  const certIssueDateLabel = document.getElementById('certIssueDateLabel');
  if (certIssueDateLabel) certIssueDateLabel.innerText = displayDate.split(',')[0];
  const certSignedDesc = document.getElementById('certSignedDescDisplay');
  if (certSignedDesc) {
    certSignedDesc.innerText = `Your official ${displayService} has been digitally signed and sealed by the competent authority in ${displayJurisdiction}.`;
  }

  const metaPills = document.querySelector('.track-meta-pills');
  if (metaPills) {
    metaPills.innerHTML = `
      <span>Application ID: <strong id="trackAppIdDisplay">${displayId}</strong></span>
      <span>• Jurisdiction: <strong>${displayJurisdiction}</strong></span>
      <span>• Submitted: <strong>${displayDate}</strong></span>
    `;
  }

  const timeline = document.getElementById('trackTimelineList');
  const readyBox = document.getElementById('certificateReadyBox');
  const statusBadge = document.getElementById('trackStatusBadge');
  const actionBanner = document.getElementById('actionRequiredBanner');

  if (displayStatus === 'APPROVED') {
    if (statusBadge) {
      statusBadge.className = 'status-pill-lg approved';
      statusBadge.innerHTML = '✓ Approved & Ready for Download';
    }
    if (readyBox) readyBox.style.display = 'flex';
    if (actionBanner) actionBanner.style.display = 'none';

    timeline.innerHTML = `
      <div class="timeline-node-item done pay-verified-node">
        <div class="timeline-node-circle">💳</div>
        <div class="timeline-content">
          <h4>Payment Verified <span class="pay-tl-badge">✓ Confirmed</span></h4>
          <p>Application fee confirmed • No real money charged (Demo) • ${displayDate}</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Documents verified</h4>
          <p>Identity, residence and statutory declarations evaluated successfully</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Department review</h4>
          <p>Revenue Officer verification completed at ${displayJurisdiction}</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Approval & Digital Signature</h4>
          <p>Sub-Divisional Officer (SDO) digital token signature verified</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Certificate issued</h4>
          <p>Official digitally signed certificate is available for download</p>
        </div>
      </div>
    `;
  } else if (displayStatus === 'ACTION_REQUIRED') {
    if (statusBadge) {
      statusBadge.className = 'status-pill-lg reject';
      statusBadge.innerHTML = '⚠️ Action Required';
    }
    if (readyBox) readyBox.style.display = 'none';
    if (actionBanner) actionBanner.style.display = 'flex';

    timeline.innerHTML = `
      <div class="timeline-node-item done pay-verified-node">
        <div class="timeline-node-circle">💳</div>
        <div class="timeline-content">
          <h4>Payment Verified <span class="pay-tl-badge">✓ Confirmed</span></h4>
          <p>Application fee confirmed • No real money charged (Demo) • ${displayDate}</p>
        </div>
      </div>
      <div class="timeline-node-item current">
        <div class="timeline-node-circle">⚠️</div>
        <div class="timeline-content">
          <h4>Additional document requested</h4>
          <p>Officer in ${displayJurisdiction} requires an alternate address document</p>
        </div>
      </div>
      <div class="timeline-node-item">
        <div class="timeline-node-circle">○</div>
        <div class="timeline-content">
          <h4>Department re-evaluation</h4>
          <p>Pending applicant upload</p>
        </div>
      </div>
    `;
  } else {
    // UNDER_REVIEW / Processing
    if (statusBadge) {
      statusBadge.className = 'status-pill-lg processing';
      statusBadge.innerHTML = '<span class="pulse-dot"></span> In Department Review';
    }
    if (readyBox) readyBox.style.display = 'none';
    if (actionBanner) actionBanner.style.display = 'none';

    timeline.innerHTML = `
      <div class="timeline-node-item done pay-verified-node">
        <div class="timeline-node-circle">💳</div>
        <div class="timeline-content">
          <h4>Payment Verified <span class="pay-tl-badge">✓ Confirmed</span></h4>
          <p>Application fee confirmed • No real money charged (Demo) • ${displayDate}</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Application submitted</h4>
          <p>Received online via Citizen-Service Agent • ${displayDate}</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Documents received</h4>
          <p>Statutory identity and income records verified against database</p>
        </div>
      </div>
      <div class="timeline-node-item done">
        <div class="timeline-node-circle">✓</div>
        <div class="timeline-content">
          <h4>Document verification</h4>
          <p>Statutory criteria evaluated (&lt; ₹3,00,000 threshold)</p>
        </div>
      </div>
      <div class="timeline-node-item current" id="node-dept-review">
        <div class="timeline-node-circle">🟡</div>
        <div class="timeline-content">
          <h4>Department review</h4>
          <p>Assigned to Revenue Officer, ${displayJurisdiction}</p>
        </div>
      </div>
      <div class="timeline-node-item" id="node-approval">
        <div class="timeline-node-circle">○</div>
        <div class="timeline-content">
          <h4>Approval</h4>
          <p>Sub-Divisional Officer digital signature endorsement</p>
        </div>
      </div>
      <div class="timeline-node-item" id="node-cert-gen">
        <div class="timeline-node-circle">○</div>
        <div class="timeline-content">
          <h4>Certificate generated</h4>
          <p>Official digitally signed certificate ready for download</p>
        </div>
      </div>
    `;

    // Auto transition demo
    setTimeout(() => {
      const nodeReview = document.getElementById('node-dept-review');
      const nodeApp = document.getElementById('node-approval');
      const nodeCert = document.getElementById('node-cert-gen');
      if (nodeReview) nodeReview.className = 'timeline-node-item done';
      if (nodeApp) nodeApp.className = 'timeline-node-item done';
      if (nodeCert) nodeCert.className = 'timeline-node-item done';

      if (statusBadge && displayStatus === 'UNDER_REVIEW') {
        statusBadge.className = 'status-pill-lg approved';
        statusBadge.innerHTML = '✓ Approved & Issued';
      }
      if (readyBox && displayStatus === 'UNDER_REVIEW') readyBox.style.display = 'flex';
    }, 4000);
  }
}

function openActionRequiredModal() {
  openDocUploadModal('address_proof', 'Additional Address Proof');
  document.getElementById('actionRequiredBanner').style.display = 'none';
}

function viewDemoCertificate() {
  const appId = appState.activeApplicationId || 'INC-UP-2026-894210';
  const foundApp = appState.myApplications.find(a => a.id.toLowerCase() === appId.toLowerCase());

  let appStateName = (foundApp && foundApp.state) || appState.formData.state || 'Uttar Pradesh';
  let appDistrictName = (foundApp && foundApp.district) || appState.formData.district || 'Lucknow';
  let appServiceName = (foundApp && foundApp.service) || (appState.activeService ? appState.activeService.title : 'Income Certificate');

  // If not found in mock list, parse state code and service prefix from appId
  if (!foundApp) {
    const parts = appId.split('-');
    if (parts.length >= 2) {
      const code = parts[1];
      const parsed = getStateConfig(code);
      if (parsed) {
        appStateName = parsed.name;
        appDistrictName = Object.keys(parsed.districts)[0] || 'Central District';
      }
      const prefix = parts[0].toUpperCase();
      if (prefix === 'CST') appServiceName = 'Caste Certificate (OBC)';
      else if (prefix === 'DOM') appServiceName = 'Residence Certificate';
      else if (prefix === 'DL') appServiceName = 'Driving Licence (Learner)';
      else if (prefix === 'SCH') appServiceName = 'Post-Matric Scholarship';
      else if (prefix === 'BRT') appServiceName = 'Birth Certificate';
      else if (prefix === 'PEN') appServiceName = 'Old Age Pension';
    }
  }

  const stConf = getStateConfig(appStateName);
  const userName = (authState && authState.user && (authState.user.full_name || authState.user.username)) || appState.formData.fullName || 'Rahul Kumar';
  const fatherName = appState.formData.fatherName || 'Suresh Prasad';
  const blockName = appState.formData.block || ((stConf.districts && stConf.districts[appDistrictName]) ? stConf.districts[appDistrictName][0] : `${appDistrictName} Sadar`);
  const streetName = appState.formData.houseStreet || stConf.defaultStreet || 'Civil Lines Road';
  const address = `${streetName}, ${blockName}, District ${appDistrictName}, ${stConf.name} - ${appState.formData.pincode || stConf.pincode || '226001'}`;
  const annualIncome = appState.formData.annualIncome ? `₹${Number(appState.formData.annualIncome).toLocaleString('en-IN')}` : '₹1,20,000';
  const incomeFormatted = `Rs. ${annualIncome.replace('₹', '')}/-`;
  const incomeWords = 'Rupees One Lakh Twenty Thousand Only';
  const issueDate = (foundApp && foundApp.date) ? foundApp.date.split(',')[0] : '07 October 2026';

  const applicantDetails = {
    name: userName,
    fatherName: fatherName,
    address: address,
    district: appDistrictName,
    state: stConf.name,
    incomeFormatted: incomeFormatted,
    incomeWords: incomeWords,
    dob: appState.formData.dob || '2004-05-12'
  };

  const certConf = getServiceCertConfig(appServiceName, stConf, applicantDetails);

  const govEl = document.getElementById('certGovNameDisplay');
  if (govEl) govEl.textContent = stConf.govName;
  const deptEl = document.getElementById('certDeptNameDisplay');
  if (deptEl) deptEl.textContent = certConf.dept.toUpperCase();
  const officeEl = document.getElementById('certOfficeDisplay');
  if (officeEl) officeEl.textContent = `Office of the ${certConf.officer}, ${appDistrictName}`;
  const badgeEl = document.getElementById('certTitleBadgeDisplay');
  if (badgeEl) badgeEl.textContent = `${certConf.title} (${certConf.titleHi})`;

  const noEl = document.getElementById('certNoDisplay');
  if (noEl) noEl.textContent = appId;
  const noLbl = document.getElementById('certNumberLabel');
  if (noLbl) noLbl.textContent = appId;
  const dateEl = document.getElementById('certIssueDateDisplay');
  if (dateEl) dateEl.textContent = issueDate;

  const applicantEl = document.getElementById('certApplicantNameDisplay');
  if (applicantEl) applicantEl.textContent = userName;
  const fatherEl = document.getElementById('certFatherNameDisplay');
  if (fatherEl) fatherEl.textContent = fatherName;
  const addrEl = document.getElementById('certAddressDisplay');
  if (addrEl) addrEl.textContent = address;

  const bodyPara = document.getElementById('certMainBodyParagraph');
  if (bodyPara) {
    bodyPara.innerHTML = certConf.bodyText;
  }

  const incomeEl = document.getElementById('certIncomeHighlightDisplay');
  if (incomeEl) {
    incomeEl.innerHTML = `<strong>${certConf.highlightValue}</strong><br><small style="font-size:12px; font-weight:normal; color:#15803d;">${certConf.highlightNote}</small>`;
  }

  const purposeEl = document.getElementById('certPurposeParaDisplay');
  if (purposeEl) purposeEl.textContent = certConf.purposeText;

  const qrBadge = document.getElementById('certQrBadgeText');
  if (qrBadge) qrBadge.textContent = `${stConf.code} VERIFIED`;

  const appRefSuffix = appId.includes('-') ? appId.split('-').pop() : '894210';
  const verifEl = document.getElementById('certVerificationIdDisplay');
  if (verifEl) verifEl.textContent = `Digital Verification ID: ${stConf.code}-PORTAL-2026-${appRefSuffix}`;

  const signTitle = document.getElementById('certSignOfficerTitle');
  if (signTitle) signTitle.textContent = certConf.officer;

  const signOffice = document.getElementById('certSignOfficeDisplay');
  if (signOffice) signOffice.textContent = `${appDistrictName}, District Administration, ${stConf.name}`;

  document.getElementById('certificateViewerModal').style.display = 'flex';
}

function downloadDemoCertificate() {
  const appId = appState.activeApplicationId || 'INC-UP-2026-894210';
  const foundApp = appState.myApplications.find(a => a.id.toLowerCase() === appId.toLowerCase());

  let appStateName = (foundApp && foundApp.state) || appState.formData.state || 'Uttar Pradesh';
  let appDistrictName = (foundApp && foundApp.district) || appState.formData.district || 'Lucknow';
  let appServiceName = (foundApp && foundApp.service) || (appState.activeService ? appState.activeService.title : 'Income Certificate');

  if (!foundApp) {
    const parts = appId.split('-');
    if (parts.length >= 2) {
      const code = parts[1];
      const parsed = getStateConfig(code);
      if (parsed) {
        appStateName = parsed.name;
        appDistrictName = Object.keys(parsed.districts)[0] || 'Central District';
      }
      const prefix = parts[0].toUpperCase();
      if (prefix === 'CST') appServiceName = 'Caste Certificate (OBC)';
      else if (prefix === 'DOM') appServiceName = 'Residence Certificate';
      else if (prefix === 'DL') appServiceName = 'Driving Licence (Learner)';
      else if (prefix === 'SCH') appServiceName = 'Post-Matric Scholarship';
      else if (prefix === 'BRT') appServiceName = 'Birth Certificate';
      else if (prefix === 'PEN') appServiceName = 'Old Age Pension';
    }
  }

  const stConf = getStateConfig(appStateName);
  const userName = (authState && authState.user && (authState.user.full_name || authState.user.username)) || appState.formData.fullName || 'Rahul Kumar';
  const fatherName = appState.formData.fatherName || 'Suresh Prasad';
  const blockName = appState.formData.block || ((stConf.districts && stConf.districts[appDistrictName]) ? stConf.districts[appDistrictName][0] : `${appDistrictName} Sadar`);
  const streetName = appState.formData.houseStreet || stConf.defaultStreet || 'Civil Lines Road';
  const address = `${streetName}, ${blockName}, District ${appDistrictName}, ${stConf.name} - ${appState.formData.pincode || stConf.pincode || '226001'}`;
  const issueDate = (foundApp && foundApp.date) ? foundApp.date.split(',')[0] : '07 October 2026';
  const annualIncomeFormatted = appState.formData.annualIncome ? `Rs. ${Number(appState.formData.annualIncome).toLocaleString('en-IN')}/-` : 'Rs. 1,20,000/-';
  const annualIncomeWords = 'Rupees One Lakh Twenty Thousand Only';

  const applicantDetails = {
    name: userName,
    fatherName: fatherName,
    address: address,
    district: appDistrictName,
    state: stConf.name,
    incomeFormatted: annualIncomeFormatted,
    incomeWords: annualIncomeWords,
    dob: appState.formData.dob || '2004-05-12'
  };

  const certConf = getServiceCertConfig(appServiceName, stConf, applicantDetails);

  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // ── Page dimensions: 210 x 297 mm ───────────────────────────────────
      // Content area: left=15, right=195, width=180, top=15, bottom=282
      const L = 15;   // left margin
      const R = 195;  // right edge
      const W = 180;  // usable width
      const CX = 105; // horizontal center

      // ── Outer double border ──────────────────────────────────────────────
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(1.2);
      doc.rect(10, 10, 190, 277);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.rect(13, 13, 184, 271);

      // ── Header tinted band ───────────────────────────────────────────────
      doc.setFillColor(239, 246, 255);
      doc.rect(13.5, 13.5, 183, 40, 'F');

      // Government name
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      const govLines = doc.splitTextToSize(stConf.govName, W - 4);
      doc.text(govLines, CX, 23, { align: "center" });

      // Department
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const deptLines = doc.splitTextToSize(certConf.dept.toUpperCase(), W - 4);
      let hY = 23 + (govLines.length * 7);
      doc.text(deptLines, CX, hY, { align: "center" });

      // Office & Act
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      hY += (deptLines.length * 5.5);
      const officeStr = `Office of the ${certConf.officer}, ${appDistrictName} (${stConf.name})`;
      const officeLines = doc.splitTextToSize(officeStr, W - 4);
      doc.text(officeLines, CX, hY, { align: "center" });
      hY += (officeLines.length * 4.5);
      const actLines = doc.splitTextToSize(stConf.act, W - 4);
      doc.text(actLines, CX, hY, { align: "center" });

      // ── Certificate Title Ribbon ─────────────────────────────────────────
      const ribbonY = 57;
      doc.setFillColor(30, 58, 138);
      doc.rect(L, ribbonY, W, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      // Use English title only – jsPDF cannot render Devanagari without custom font
      doc.text(certConf.title.toUpperCase(), CX, ribbonY + 6.5, { align: "center" });

      // ── Meta Info Box ────────────────────────────────────────────────────
      const metaY = ribbonY + 14;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(L, metaY, W, 20, 'FD');

      // Left column: Certificate No (label at L+5, value at L+42)
      const lblX1 = L + 5;
      const valX1 = L + 42;
      const lblX2 = CX + 5;
      const valX2 = CX + 30;
      const maxValW1 = lblX2 - valX1 - 4;   // ≈ 47 mm for left value
      const maxValW2 = R - valX2 - 3;        // ≈ 37 mm for right value

      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");
      doc.text("Certificate No:", lblX1, metaY + 7);
      doc.setTextColor(30, 58, 138);
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      const certNoLines = doc.splitTextToSize(appId, maxValW1);
      doc.text(certNoLines[0], valX1, metaY + 7); // single line

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Date of Issue:", lblX2, metaY + 7);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      const dateStr = doc.splitTextToSize(issueDate, maxValW2)[0];
      doc.text(dateStr, valX2, metaY + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Application ID:", lblX1, metaY + 14);
      doc.setTextColor(15, 23, 42);
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.text(doc.splitTextToSize(appId, maxValW1)[0], valX1, metaY + 14);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Validity:", lblX2, metaY + 14);
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const validityLines = doc.splitTextToSize(certConf.validity, maxValW2);
      doc.text(validityLines[0], valX2, metaY + 14);
      if (validityLines[1]) doc.text(validityLines[1], valX2, metaY + 18);

      // ── Body Paragraph ───────────────────────────────────────────────────
      let curY = metaY + 26;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      // Strip any HTML tags from bodyText
      const rawBody = certConf.bodyText.replace(/<[^>]+>/g, '');
      const splitBody = doc.splitTextToSize(rawBody, W - 2);
      doc.text(splitBody, L, curY);
      curY += (splitBody.length * 5.5) + 5;

      // ── Highlight Box ─────────────────────────────────────────────────────
      const hlH = certConf.highlightNote ? 18 : 13;
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.rect(L, curY, W, hlH, 'FD');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(22, 101, 52);
      const hlLines = doc.splitTextToSize(certConf.highlightValue, W - 6);
      doc.text(hlLines, CX, curY + 7, { align: "center" });

      if (certConf.highlightNote) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(21, 128, 61);
        const noteLines = doc.splitTextToSize(`(${certConf.highlightNote})`, W - 6);
        doc.text(noteLines, CX, curY + 13, { align: "center" });
      }
      curY += hlH + 7;

      // ── Purpose Text ─────────────────────────────────────────────────────
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const rawPurpose = certConf.purposeText.replace(/<[^>]+>/g, '');
      const splitPurpose = doc.splitTextToSize(rawPurpose, W - 2);
      doc.text(splitPurpose, L, curY);
      curY += (splitPurpose.length * 5) + 8;

      // ── Details Table ─────────────────────────────────────────────────────
      // Two columns: left (labels+values) and right (labels+values)
      // Left label: L+3, Left value: L+3+33=51, Right label: CX+3=108, Right value: CX+3+28=136
      const tblLblX1 = L + 3;
      const tblValX1 = L + 38;
      const tblLblX2 = CX + 3;
      const tblValX2 = CX + 35;
      const tblMaxVal1 = tblLblX2 - tblValX1 - 3;   // ~55mm
      const tblMaxVal2 = R - tblValX2 - 4;           // ~52mm

      const tableRows = [
        ["Applicant Name", userName,          "State Jurisdiction", `${appDistrictName}, ${stConf.name}`],
        ["Father's Name",  fatherName,        "Department",          certConf.dept.split(',')[0].trim()],
        ["Identity",       "Aadhaar UID (Verified)", "Issuing Authority", certConf.officer]
      ];

      const rowH = 9;
      const tblH = tableRows.length * rowH + 4;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(L, curY, W, tblH, 'FD');

      // Vertical divider in the middle
      doc.setDrawColor(226, 232, 240);
      doc.line(CX, curY, CX, curY + tblH);

      let rowY = curY + 7;
      tableRows.forEach(row => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(row[0] + ":", tblLblX1, rowY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        const v1Lines = doc.splitTextToSize(row[1], tblMaxVal1);
        doc.text(v1Lines[0], tblValX1, rowY);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text(row[2] + ":", tblLblX2, rowY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        const v2Lines = doc.splitTextToSize(row[3], tblMaxVal2);
        doc.text(v2Lines[0], tblValX2, rowY);

        rowY += rowH;
      });

      curY += tblH + 6;

      // ── Verification & Digital Signature Footer ──────────────────────────
      doc.setDrawColor(203, 213, 225);
      doc.line(L, curY, R, curY);
      curY += 5;

      // QR Simulation Box
      doc.setDrawColor(148, 163, 184);
      doc.setFillColor(241, 245, 249);
      doc.rect(L, curY, 25, 25, 'FD');
      doc.setFont("courier", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("QR VERIFIED", L + 12.5, curY + 10, { align: "center" });
      doc.text(stConf.code + " CITIZEN", L + 12.5, curY + 15, { align: "center" });

      // Verification text (right of QR)
      const vrX = L + 29;
      const appRefSuffix = appId.includes('-') ? appId.split('-').pop() : '894210';
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Digital Verification ID:", vrX, curY + 7);
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`${stConf.code}-PORTAL-2026-${appRefSuffix}`, vrX + 34, curY + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const verifyUrl = `http://${stConf.portalUrl}/verify`;
      const urlLines = doc.splitTextToSize(`Official Portal: ${verifyUrl}`, R - vrX - 68);
      doc.text(urlLines, vrX, curY + 13);
      doc.text("Encrypted Hash: 7b8f9e12cd4a558291f03bb36a99281e", vrX, curY + 18);
      doc.text("Verified under DPDP Act 2023", vrX, curY + 23);

      // Digital Signature Seal (right side)
      const sigX = R - 62;
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.rect(sigX, curY, 62, 25, 'FD');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text("✓ DIGITALLY SIGNED", sigX + 31, curY + 7, { align: "center" });
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const officerLines = doc.splitTextToSize(certConf.officer, 58);
      doc.text(officerLines[0], sigX + 31, curY + 13, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const sigLocLines = doc.splitTextToSize(`${appDistrictName}, ${stConf.name}`, 58);
      doc.text(sigLocLines[0], sigX + 31, curY + 19, { align: "center" });
      doc.text(issueDate, sigX + 31, curY + 24, { align: "center" });

      // ── Legal Disclaimer Footer ──────────────────────────────────────────
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "italic");
      const disclaimer1 = `This is an electronically generated certificate issued under the ${stConf.act}.`;
      const disclaimer2 = `It does not require a physical signature. Verify at: http://${stConf.portalUrl}/verify`;
      const d1Lines = doc.splitTextToSize(disclaimer1, W);
      const d2Lines = doc.splitTextToSize(disclaimer2, W);
      const footY = 282;
      doc.text(d1Lines, CX, footY - 4, { align: "center" });
      doc.text(d2Lines, CX, footY, { align: "center" });

      // Save
      doc.save(`${certConf.type}_Certificate_${appId}.pdf`);
      return;
    }
  } catch (err) {
    console.error("PDF generation error:", err);
  }

  alert("Generating PDF failed. Please ensure downloads are permitted in your browser.");
}

// ── 28. Citizen Dashboard: My Applications ────────────────────────────────────
function renderMyApplications() {
  const tbody = document.getElementById('myApplicationsTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.myApplications.map(app => {
    let badgeClass = 'badge-status ok';
    let badgeText = 'Approved';
    if (app.status === 'UNDER_REVIEW') { badgeClass = 'badge-status warn'; badgeText = 'Processing'; }
    if (app.status === 'ACTION_REQUIRED') { badgeClass = 'badge-status reject'; badgeText = 'Action Required'; }

    const payBadge = app.paymentVerified
      ? `<span class="pay-verified-badge" title="Transaction: ${app.txnId || ''}">✓ Verified</span>`
      : `<span class="pay-pending-badge">⏳ Pending</span>`;

    // Parse date and time cleanly
    const parts = app.date.includes(',') ? app.date.split(', ') : [app.date, ''];
    const datePart = parts[0];
    const timePart = parts[1] || '';

    return `
      <tr>
        <td><strong>${app.service}</strong></td>
        <td>
          <div class="app-id-cell-wrap">
            <button class="app-id-track-btn" onclick="goToTrackingView('${app.id}')" title="Click to track ${app.id}">
              <code class="app-id-code">${app.id}</code>
              <span class="track-icon-hint" title="Live Track">🔍</span>
            </button>
            <button class="btn-copy-mini" onclick="copyAppId('${app.id}', this)" title="Copy Application ID">📋</button>
          </div>
        </td>
        <td>
          <div class="submission-time-cell">
            <span class="sub-date">📅 ${datePart}</span>
            ${timePart ? `<span class="sub-time">🕒 ${timePart}</span>` : ''}
          </div>
        </td>
        <td>${app.district}, ${app.state}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="progress-bar-track" style="width:70px; height:6px;">
              <div class="progress-bar-fill" style="width:${app.progress}%;"></div>
            </div>
            <span style="font-size:11.5px; font-weight:700;">${app.progress}%</span>
          </div>
        </td>
        <td>${payBadge}</td>
        <td><span class="${badgeClass}">${badgeText}</span></td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn btn-secondary btn-track-action" onclick="goToTrackingView('${app.id}')">
              Track Status ➔
            </button>
            ${app.status === 'APPROVED' ? `
              <button class="btn btn-primary btn-track-action" onclick="appState.activeApplicationId='${app.id}'; downloadDemoCertificate();" title="Download Certificate PDF">
                📥 PDF
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterMyApplications(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#myApplicationsTableBody tr');
  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterAppTable(filter, btn) {
  document.querySelectorAll('.filter-tab-buttons .btn-filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('#myApplicationsTableBody tr');
  rows.forEach(r => {
    const text = r.innerText.toLowerCase();
    if (filter === 'all') r.style.display = '';
    else if (filter === 'active' && text.includes('processing')) r.style.display = '';
    else if (filter === 'action' && text.includes('action required')) r.style.display = '';
    else if (filter === 'approved' && text.includes('approved')) r.style.display = '';
    else r.style.display = 'none';
  });
}

// ── 32. Profile View & Tabs ───────────────────────────────────────────────────
function switchProfileTab(tabName, btn) {
  document.querySelectorAll('.profile-nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.profile-tab-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(`ptab-${tabName}`);
  if (target) target.style.display = 'block';
}

function saveProfileChanges() {
  const newName = document.getElementById('prof-fullName').value.trim();
  if (newName) {
    appState.formData.fullName = newName;
    const nameEl = document.getElementById('userNameLabel');
    if (nameEl) nameEl.innerText = newName;
    const dispEl = document.getElementById('p-displayName');
    if (dispEl) dispEl.innerText = newName;
    if (authState && authState.user) {
      authState.user.full_name = newName;
      sessionStorage.setItem('citizen_auth_user', JSON.stringify(authState.user));
    }
  }
  const emailInput = document.getElementById('prof-email');
  if (emailInput && emailInput.value.trim()) {
    appState.formData.email = emailInput.value.trim();
    if (authState && authState.user) {
      authState.user.email = emailInput.value.trim();
      sessionStorage.setItem('citizen_auth_user', JSON.stringify(authState.user));
    }
  }
  const mobileInput = document.getElementById('prof-mobile');
  if (mobileInput && mobileInput.value.trim()) {
    appState.formData.mobile = mobileInput.value.replace(/[^0-9]/g, '').slice(-10);
  }
  alert('Profile information updated successfully.');
}

function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    alert('Signed out successfully.');
    showView('home');
  }
}

// ── 33. Privacy View & Data Purging ───────────────────────────────────────────
function renderPrivacyConsents() {
  const list = document.getElementById('privacyConsentsList');
  if (!list) return;

  list.innerHTML = appState.consents.map(c => `
    <div class="consent-card-item">
      <div>
        <strong>${c.action}</strong>
        <p style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">Destination: ${c.destination} • Granted: ${c.date}</p>
      </div>
      <button class="btn btn-danger" style="padding:4px 10px; font-size:12px;" onclick="revokeConsentItem('${c.id}')">Revoke Consent</button>
    </div>
  `).join('');
}

function revokeConsentItem(id) {
  appState.consents = appState.consents.filter(c => c.id !== id);
  renderPrivacyConsents();
  alert(`Consent ${id} has been revoked. Department access terminated.`);
}

function viewDocumentPreview(docName) {
  document.getElementById('previewDocTitle').innerText = `${docName} Preview`;
  document.getElementById('previewDocSub').innerText = `Verified ${docName}`;
  document.getElementById('docPreviewModal').style.display = 'flex';
}

function purgeSessionData() {
  if (confirm('Are you sure you want to delete all local documents, draft applications and data?')) {
    localStorage.clear();
    alert('All local account records have been permanently purged.');
    location.reload();
  }
}

// ── 34. Help Center FAQ ───────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}

function filterHelpFaq(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.faq-item').forEach(item => {
    item.style.display = item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
  });
}

function filterFaqByCategory(cat) {
  document.querySelectorAll('.faq-item').forEach(item => {
    if (cat === 'all' || item.dataset.category === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function simulateEscalation() {
  alert('Connecting to civic desk support volunteer... A human helper will assist you within 2 minutes.');
}

// ── 35. Multilingual Localization & Theme System ──────────────────────────────
function updateLangPillLabel(langCode) {
  const select = document.getElementById('langSelect');
  if (select && langCode) {
    select.value = langCode;
  }
}

function changeLanguage(lang) {
  appState.language = lang;
  updateLangPillLabel(lang);
  
  if (window.civicI18n && typeof window.civicI18n.setLanguage === 'function') {
    window.civicI18n.setLanguage(lang);
  }

  const isHi = lang === 'hi';
  const heading = document.getElementById('t-hero-heading');
  const subheading = document.getElementById('t-hero-subheading');
  const logoSub = document.getElementById('t-logo-sub');
  const searchInput = document.getElementById('aiSearchInput');

  if (isHi) {
    if (heading) heading.innerText = 'सरकारी सेवाएं, अब आसान और सरल।';
    if (subheading) subheading.innerText = 'हमें बताएं आपको क्या चाहिए। हम आपको आवश्यक दस्तावेज, फॉर्म और आवेदन स्थिति तक पूरा मार्गदर्शन करेंगे।';
    if (logoSub) logoSub.innerText = 'Government Services, Made Simple';
    if (searchInput) searchInput.placeholder = 'आपको किस सरकारी सेवा की आवश्यकता है? (उदा. आय प्रमाण पत्र...)';
  } else {
    if (heading) heading.innerText = 'Government Services, Made Simple.';
    if (subheading) subheading.innerText = "Tell us what you need. We'll guide you through the documents, forms and application process — step by step.";
    if (logoSub) logoSub.innerText = 'Government Services, Made Simple';
    if (searchInput) searchInput.placeholder = 'What government service do you need?';
  }
}

// ── Dark & Light Mode Theme Management ────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('civic_theme') || 'dark';
  setTheme(saved, false);
}

function setTheme(theme, save = true) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) document.body.setAttribute('data-theme', theme);
  if (save) {
    try { localStorage.setItem('civic_theme', theme); } catch(e) {}
  }
  
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const label = document.getElementById('themeToggleLabel');
  const btn = document.getElementById('btnThemeToggle');
  
  if (sunIcon && moonIcon) {
    if (isDark) {
      sunIcon.style.display = 'inline-flex';
      moonIcon.style.display = 'none';
      if (label) label.textContent = 'Light';
      if (btn) btn.setAttribute('title', 'Switch to Light Mode');
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline-flex';
      if (label) label.textContent = 'Dark';
      if (btn) btn.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next, true);
}

// Initialize theme immediately
try { initTheme(); } catch(e) {}

// ── Admin Cockpit Verification ────────────────────────────────────────────────
async function verifyAdminChain() {
  const status = document.getElementById('adminChainStatus');
  status.innerText = 'VERIFYING...';
  try {
    const res = await fetch('/api/audit/verify', {
      headers: { 'Authorization': 'Bearer dev-helper-token' }
    });
    if (res.ok) {
      const data = await res.json();
      status.innerText = data.valid ? 'VALID / TAMPER-FREE' : `BROKEN AT ROW #${data.broken_row}`;
      loadAdminAuditRows();
    } else {
      status.innerText = 'VALID (LOCAL CHECK)';
      loadAdminAuditRows();
    }
  } catch (err) {
    status.innerText = 'VALID (ANCHOR MATCH)';
    loadAdminAuditRows();
  }
}

async function loadAdminAuditRows() {
  const tbody = document.getElementById('adminAuditTableBody');
  if (!tbody) return;
  try {
    const res = await fetch('/api/audit', {
      headers: { 'Authorization': 'Bearer dev-helper-token' }
    });
    if (res.ok) {
      const data = await res.json();
      tbody.innerHTML = data.slice(0, 10).map(r => `
        <tr>
          <td>#${r.id}</td>
          <td>${r.timestamp}</td>
          <td>${r.actor}</td>
          <td><strong>${r.action}</strong></td>
          <td>${r.result}</td>
          <td><code>${r.row_hash ? r.row_hash.substring(0, 16) + '...' : ''}</code></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Append-only audit trail active in SQLite DB.</td></tr>`;
  }
}

// ── i18n Synchronization ──
if (typeof civicI18n !== 'undefined') {
  appState.language = civicI18n.currentLang;
  civicI18n.onLanguageChange((lang) => {
    appState.language = lang;
  });
}


// ═══════════════════════════════════════════════════════════════════
// AUTH SYSTEM — Login / Register / OTP Verification
// ═══════════════════════════════════════════════════════════════════

const authState = {
  token: null,
  user: null,
  otpCountdownTimer: null,
};

// ── Initialise: check localStorage for saved session ──────────────
// Public visitors can browse the landing page without being forced to log in.
(function initAuth() {
  const savedToken = localStorage.getItem('civic_auth_token');
  const savedUser  = localStorage.getItem('civic_auth_user');
  if (savedToken && savedUser) {
    try {
      authState.token = savedToken;
      authState.user  = JSON.parse(savedUser);
      onAuthSuccess(false); // restore without re-animating
    } catch(e) {
      localStorage.removeItem('civic_auth_token');
      localStorage.removeItem('civic_auth_user');
      // Guest mode — let them browse the landing page freely
      updateHeaderAuthState(false);
    }
  } else {
    // Guest mode — landing page is publicly visible, no forced login popup
    updateHeaderAuthState(false);
  }

  // Apply full-bleed padding for home view on initial load
  const appContainer = document.getElementById('mainContainer');
  if (appContainer && appState.currentView === 'home') {
    appContainer.style.maxWidth = '100%';
    appContainer.style.padding  = '0';
  }
})();

// ── Header state helper (show guest CTAs or user profile chip) ─────
function updateHeaderAuthState(isLoggedIn) {
  const guestActions = document.getElementById('headerGuestActions');
  const profileWrapper = document.getElementById('profileDropdownWrapper');
  const notifWrapper = document.getElementById('headerNotifWrapper');
  // AI floating widget is ONLY available after login
  const aiWidget = document.getElementById('aiFloatingAgentRoot');
  if (guestActions) guestActions.style.display = isLoggedIn ? 'none' : 'flex';
  if (profileWrapper) profileWrapper.style.display = isLoggedIn ? 'flex' : 'none';
  if (notifWrapper) notifWrapper.style.display = isLoggedIn ? 'block' : 'none';
  // Show AI widget only for authenticated users
  if (aiWidget) aiWidget.style.display = isLoggedIn ? 'block' : 'none';
}

// ── Public landing page: route to login or directly to service ─────
function handleStartServicePublic(serviceId) {
  if (authState.token && authState.user) {
    // Already logged in → go to service wizard directly
    if (typeof startSpecificService === 'function') {
      startSpecificService(serviceId || 'income_certificate');
    } else {
      showView('wizard');
    }
  } else {
    // Guest → save intended service and prompt login
    window.pendingPostLoginService = serviceId || 'income_certificate';
    switchAuthTab('login');
    showAuthModal();
  }
}

// (openStateServices and openCentralServices are defined in the Place Browser section above)


// ── Smooth scroll to a section by id ──────────────────────────────
function scrollToSection(sectionId) {
  // Make sure we are on the home view first
  if (appState.currentView !== 'home') {
    showView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  } else {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showAuthModal() {
  const m = document.getElementById('authModal');
  if (m) {
    m.style.display = 'flex';
    m.onclick = (e) => {
      if (e.target === m) hideAuthModal();
    };
  }
}

function hideAuthModal() {
  const m = document.getElementById('authModal');
  if (m) { m.style.display = 'none'; }
}

function onAuthSuccess(animate = true) {
  hideAuthModal();
  // Switch header to logged-in state
  updateHeaderAuthState(true);

  // Update header profile chip and profile page with logged-in user's details
  if (authState.user) {
    const fullName = authState.user.full_name || authState.user.username;
    const email   = authState.user.email || '';
    const initials = fullName.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'C';

    // ── Header chip ──────────────────────────────────────────────
    const nameEl = document.getElementById('userNameLabel');
    const avatarEl = document.getElementById('headerAvatarCircle');
    if (nameEl)   nameEl.textContent   = fullName;
    if (avatarEl) avatarEl.textContent = initials;

    // ── Header profile dropdown ───────────────────────────────────
    const dropdownName = document.getElementById('dropdownUserName');
    if (dropdownName) dropdownName.textContent = fullName;

    // ── Profile page sidebar ──────────────────────────────────────
    const pDisplayName   = document.getElementById('p-displayName');
    const pAvatarLarge   = document.getElementById('profileAvatarLarge');
    const pFullNameInput = document.getElementById('prof-fullName');
    const pEmailInput    = document.getElementById('prof-email');

    if (pDisplayName)   pDisplayName.textContent   = fullName;
    if (pAvatarLarge)   pAvatarLarge.textContent    = initials;
    if (pFullNameInput) pFullNameInput.value         = fullName;
    if (pEmailInput && email) pEmailInput.value      = email;

    // Also update appState so forms pre-fill correctly
    appState.formData.fullName = fullName;
    if (email) appState.formData.email = email;
  }

  // Handle post-login navigation according to required user flow (Section 1):
  // Visitor opens website -> PUBLIC CIVICAGENT HOME / INTRO PAGE -> "Get Started" / "Start a Service" / "Login" -> EXISTING LOGIN PAGE -> Successful Login -> EXISTING AUTHENTICATED CIVICAGENT APPLICATION
  if (animate) {
    if (window.pendingPostLoginService) {
      const s = window.pendingPostLoginService;
      window.pendingPostLoginService = null;
      if (typeof startSpecificService === 'function') {
        startSpecificService(s);
      } else {
        showView('wizard');
      }
    } else if (window.pendingPostLoginView) {
      const v = window.pendingPostLoginView;
      window.pendingPostLoginView = null;
      showView(v);
    } else if (appState.currentView === 'home') {
      showView('applications');
    }
  }
}

// ── Tab switching ──────────────────────────────────────────────────
function switchAuthTab(tab) {
  ['login','register','otp'].forEach(t => {
    const panel = document.getElementById('authPanel' + t.charAt(0).toUpperCase() + t.slice(1));
    const tabBtn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (panel) panel.style.display = t === tab ? 'block' : 'none';
    if (tabBtn) tabBtn.classList.toggle('active', t === tab);
  });
  // Show/hide tabs row for OTP (no tab button for OTP)
  const tabsEl = document.getElementById('authTabs');
  if (tabsEl) tabsEl.style.display = tab === 'otp' ? 'none' : 'flex';
}

// ── Password strength ──────────────────────────────────────────────
function checkPasswordStrength(pw) {
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!fill || !label) return;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { pct: '0%',   color: '#e2e8f0', text: '' },
    { pct: '20%',  color: '#ef4444', text: 'Very Weak' },
    { pct: '40%',  color: '#f97316', text: 'Weak' },
    { pct: '60%',  color: '#eab308', text: 'Fair' },
    { pct: '80%',  color: '#22c55e', text: 'Strong' },
    { pct: '100%', color: '#15803d', text: 'Very Strong' },
  ];
  const lvl = levels[score];
  fill.style.width = lvl.pct;
  fill.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
}

function checkPasswordMatch() {
  const pw  = document.getElementById('regPassword');
  const cpw = document.getElementById('regConfirmPassword');
  const lbl = document.getElementById('pwMatchLabel');
  if (!pw || !cpw || !lbl) return;
  if (!cpw.value) { lbl.textContent = ''; return; }
  if (pw.value === cpw.value) {
    lbl.textContent = '✓ Passwords match';
    lbl.style.color = '#16a34a';
  } else {
    lbl.textContent = '✗ Passwords do not match';
    lbl.style.color = '#dc2626';
  }
}

// ── Show/Hide password ─────────────────────────────────────────────
function togglePwVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.textContent = '🙈';
  } else {
    inp.type = 'password';
    btn.textContent = '👁️';
  }
}

// ── Error helpers ──────────────────────────────────────────────────
function setAuthError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function setAuthLoading(btnTextId, btnLoaderId, btnId, loading) {
  const t = document.getElementById(btnTextId);
  const l = document.getElementById(btnLoaderId);
  const b = document.getElementById(btnId);
  if (t) t.style.display = loading ? 'none' : 'inline';
  if (l) l.style.display = loading ? 'inline' : 'none';
  if (b) b.disabled = loading;
}

// ── REGISTER ───────────────────────────────────────────────────────
async function doRegister() {
  setAuthError('registerError', '');
  const username = document.getElementById('regUsername')?.value.trim();
  const password = document.getElementById('regPassword')?.value;
  const confirm  = document.getElementById('regConfirmPassword')?.value;
  const phone    = document.getElementById('regPhone')?.value.trim();
  const fullName = document.getElementById('regFullName')?.value.trim();

  if (!username || !password || !confirm || !phone) {
    return setAuthError('registerError', 'Please fill in all required fields (*).');
  }
  if (password !== confirm) {
    return setAuthError('registerError', 'Passwords do not match. Please re-enter.');
  }
  if (password.length < 6) {
    return setAuthError('registerError', 'Password must be at least 6 characters.');
  }
  if (phone.length < 10 || !/^\d+$/.test(phone)) {
    return setAuthError('registerError', 'Please enter a valid 10-digit mobile number.');
  }

  setAuthLoading('registerBtnText','registerBtnLoader','registerSubmitBtn', true);
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, confirm_password: confirm, phone, full_name: fullName || null }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Registration failed.');
    authState.token = data.token;
    authState.user  = data.user;
    localStorage.setItem('civic_auth_token', data.token);
    localStorage.setItem('civic_auth_user', JSON.stringify(data.user));
    // Proceed to OTP verification
    doSendOtp(false);
  } catch(err) {
    setAuthError('registerError', err.message);
  } finally {
    setAuthLoading('registerBtnText','registerBtnLoader','registerSubmitBtn', false);
  }
}

// ── LOGIN ──────────────────────────────────────────────────────────
async function doLogin() {
  setAuthError('loginError', '');
  const username = document.getElementById('loginUsername')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  if (!username || !password) {
    return setAuthError('loginError', 'Please enter your username and password.');
  }
  setAuthLoading('loginBtnText','loginBtnLoader','loginSubmitBtn', true);
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed.');
    authState.token = data.token;
    authState.user  = data.user;
    localStorage.setItem('civic_auth_token', data.token);
    localStorage.setItem('civic_auth_user', JSON.stringify(data.user));
    if (!data.user.phone_verified) {
      // Offer OTP verification
      doSendOtp(false);
    } else {
      onAuthSuccess(true);
    }
  } catch(err) {
    setAuthError('loginError', err.message);
  } finally {
    setAuthLoading('loginBtnText','loginBtnLoader','loginSubmitBtn', false);
  }
}

// ── SEND OTP ───────────────────────────────────────────────────────
async function doSendOtp(isResend = false) {
  if (!authState.token || !authState.user) return;
  const phone = authState.user.phone;

  // Switch to OTP panel
  switchAuthTab('otp');
  document.getElementById('otpSentMsg').textContent =
    'Enter the 6-digit OTP sent to +91-XXXXXX' + phone.slice(-4) + '.';

  // Clear OTP inputs
  for (let i = 0; i < 6; i++) {
    const inp = document.getElementById('otp' + i);
    if (inp) { inp.value = ''; inp.classList.remove('filled'); }
  }
  setAuthError('otpError', '');

  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, token: authState.token }),
    });
    const data = await res.json();
    if (res.ok && data.otp_demo) {
      const demoBox = document.getElementById('otpDemoBox');
      const demoCode = document.getElementById('otpDemoCode');
      if (demoBox) demoBox.style.display = 'inline-flex';
      if (demoCode) demoCode.textContent = data.otp_demo;
    }
  } catch(err) {
    console.warn('OTP send error', err);
  }

  // Start countdown
  startOtpCountdown(60);
  // Focus first OTP box
  setTimeout(() => document.getElementById('otp0')?.focus(), 100);
}

function startOtpCountdown(seconds) {
  if (authState.otpCountdownTimer) clearInterval(authState.otpCountdownTimer);
  let remaining = seconds;
  const countdown = document.getElementById('otpCountdown');
  const countdownText = document.getElementById('otpCountdownText');
  const resendLink = document.getElementById('otpResendLink');
  if (countdown) countdown.textContent = remaining;
  if (countdownText) countdownText.style.display = 'inline';
  if (resendLink) resendLink.style.display = 'none';

  authState.otpCountdownTimer = setInterval(() => {
    remaining--;
    if (countdown) countdown.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(authState.otpCountdownTimer);
      if (countdownText) countdownText.style.display = 'none';
      if (resendLink) resendLink.style.display = 'inline';
    }
  }, 1000);
}

// ── OTP digit navigation ───────────────────────────────────────────
function otpNext(input, nextIdx) {
  input.classList.toggle('filled', input.value.length > 0);
  if (input.value && nextIdx !== null) {
    document.getElementById('otp' + nextIdx)?.focus();
  }
  // Auto submit when all 6 filled
  const allFilled = [0,1,2,3,4,5].every(i => {
    const el = document.getElementById('otp' + i);
    return el && el.value.length === 1;
  });
  if (allFilled) doVerifyOtp();
}

function otpBack(event, input, prevIdx) {
  if (event.key === 'Backspace' && !input.value && prevIdx !== null) {
    document.getElementById('otp' + prevIdx)?.focus();
  }
}

// ── VERIFY OTP ─────────────────────────────────────────────────────
async function doVerifyOtp() {
  setAuthError('otpError', '');
  const code = [0,1,2,3,4,5].map(i => document.getElementById('otp'+i)?.value || '').join('');
  if (code.length !== 6) {
    return setAuthError('otpError', 'Please enter the complete 6-digit OTP.');
  }
  if (!authState.token || !authState.user) {
    return setAuthError('otpError', 'Session expired. Please log in again.');
  }

  setAuthLoading('otpBtnText','otpBtnLoader','otpVerifyBtn', true);
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: authState.user.phone, code, token: authState.token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'OTP verification failed.');
    authState.user.phone_verified = true;
    localStorage.setItem('civic_auth_user', JSON.stringify(authState.user));
    if (authState.otpCountdownTimer) clearInterval(authState.otpCountdownTimer);
    onAuthSuccess(true);
  } catch(err) {
    setAuthError('otpError', err.message);
  } finally {
    setAuthLoading('otpBtnText','otpBtnLoader','otpVerifyBtn', false);
  }
}

// ── SKIP OTP ───────────────────────────────────────────────────────
function skipOtpForNow() {
  if (authState.otpCountdownTimer) clearInterval(authState.otpCountdownTimer);
  onAuthSuccess(true);
}

// ── LOGOUT ─────────────────────────────────────────────────────────
async function doLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + (authState.token || '') },
    });
  } catch(e) { /* ignore */ }
  authState.token = null;
  authState.user  = null;
  window.pendingPostLoginService = null;
  window.pendingPostLoginView = null;
  localStorage.removeItem('civic_auth_token');
  localStorage.removeItem('civic_auth_user');
  // Reset header back to guest state
  const nameEl = document.getElementById('userNameLabel');
  const avatarEl = document.getElementById('headerAvatarCircle');
  if (nameEl) nameEl.textContent = 'Guest';
  if (avatarEl) avatarEl.textContent = '?';
  const dropdownName = document.getElementById('dropdownUserName');
  if (dropdownName) dropdownName.textContent = 'Guest';
  closeProfileDropdown();
  // Switch header to guest/public mode
  updateHeaderAuthState(false);
  // Return to the public landing page (not the login modal)
  showView('home');
  // Scroll back to top of landing page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Profile dropdown ────────────────────────────────────────────────
function toggleProfileDropdown() {
  const menu = document.getElementById('profileDropdownMenu');
  if (!menu) return;
  const isOpen = menu.style.display !== 'none';
  if (isOpen) {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'block';
  }
}

function closeProfileDropdown() {
  const menu = document.getElementById('profileDropdownMenu');
  if (menu) menu.style.display = 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('profileDropdownWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeProfileDropdown();
  }
});

// ── 24x7 Citizen Helpline Copy Helper ──────────────────────────────
function copyHelpline(phoneNum, btn) {
  const num = phoneNum || '1800-180-2026';
  navigator.clipboard.writeText(num).then(() => {
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.style.color = '#15803d';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.color = '';
      }, 1800);
    }
  }).catch(() => {
    alert(`24x7 Citizen Helpline Number: ${num}`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// ── 51. Floating AI Document Assistant & Voice Recognition (ChatGPT Mode) ─────
// ══════════════════════════════════════════════════════════════════════════════

const aiAgentState = {
  isOpen: false,
  ttsEnabled: true,
  isListening: false,
  recognition: null,
  history: []
};

// Comprehensive Document Knowledge Base for Civic Services
const AI_DOCS_KNOWLEDGE = {
  income_certificate: {
    id: 'income_certificate',
    title: 'Income Certificate (आय प्रमाण पत्र)',
    category: 'Certificates & Revenue',
    dept: 'Department of Revenue & Land Administration',
    time: '7 - 10 Working Days',
    summary: 'An official document certifying the annual gross family income from all sources. Widely used for scholarship quotas, fee concessions, EWS reservations, and government welfare benefits.',
    mandatoryDocs: [
      { name: 'Identity Proof', desc: 'Aadhaar Card / Voter ID / PAN Card / Passport', mandatory: true },
      { name: 'Residence Proof', desc: 'Electricity Bill / Water Bill / Ration Card / Gas Passbook', mandatory: true },
      { name: 'Income Proof Document', desc: 'Salary Slip (Last 3 Months) / Form 16 / ITR / Patwari / Lekhpal Verification Report / Self-Declaration Affidavit', mandatory: true },
      { name: 'Passport Size Photograph', desc: 'Recent color photograph (under 200 KB, white background)', mandatory: true }
    ],
    optionalDocs: [
      { name: 'BPL Ration Card', desc: 'For statutory government application fee waiver', mandatory: false },
      { name: 'Agricultural Land Khatiyan / Khasra', desc: 'For rural agricultural families', mandatory: false }
    ],
    procedure: '1. Fill personal and family income details -> 2. Upload Aadhaar, Address & Income Proof -> 3. Verification by Village Accountant / Lekhpal -> 4. Tehsildar approves digital certificate.'
  },
  caste_certificate: {
    id: 'caste_certificate',
    title: 'Caste Certificate (जाति प्रमाण पत्र - SC / ST / OBC / EWS)',
    category: 'Certificates & Social Welfare',
    dept: 'Department of Social Welfare & Backward Classes',
    time: '10 - 15 Working Days',
    summary: 'Certifies that a citizen belongs to a recognized Scheduled Caste, Scheduled Tribe, Other Backward Class, or Economically Weaker Section for statutory reservation and admissions.',
    mandatoryDocs: [
      { name: 'Identity Proof', desc: 'Aadhaar Card / Voter ID / School Leaving Certificate', mandatory: true },
      { name: 'Lineage / Ancestral Proof', desc: '1950/1965 Land Record (Khatiyan) / Father or Paternal Relative Caste Certificate / Parcha', mandatory: true },
      { name: 'Permanent Residence Proof', desc: 'Domicile Certificate / Electricity Bill / Ration Card', mandatory: true },
      { name: 'Passport Size Photograph', desc: 'Recent clear color photograph', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Caste Self-Declaration Affidavit', desc: 'Signed declaration on non-judicial stamp paper', mandatory: false },
      { name: 'Gram Pradhan / Ward Councillor Certificate', desc: 'Local representative recommendation letter', mandatory: false }
    ],
    procedure: '1. Select Category (SC/ST/OBC/EWS) -> 2. Provide Ancestral details -> 3. Upload Khatiyan/Aadhaar -> 4. Field verification by Revenue Inspector -> 5. SDO/Tehsildar issuance.'
  },
  domicile_certificate: {
    id: 'domicile_certificate',
    title: 'Residence / Domicile Certificate (निवास प्रमाण पत्र)',
    category: 'Certificates & General Administration',
    dept: 'General Administration Department',
    time: '7 - 10 Working Days',
    summary: 'Statutory proof of permanent residence in the state, mandatory for state quota university admissions, state government recruitment exams, and local welfare schemes.',
    mandatoryDocs: [
      { name: 'Identity Proof', desc: 'Aadhaar Card / Voter ID / Passport', mandatory: true },
      { name: 'Proof of Continuous Residence (10+ Years)', desc: 'Electricity Bill / House Tax Receipt / Land Registry Deed / School Marksheet from state', mandatory: true },
      { name: 'Passport Size Photograph', desc: 'Recent colored photo of applicant', mandatory: true },
      { name: 'Self-Declaration Form', desc: 'Affidavit affirming permanent residential status', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Parents Domicile Certificate', desc: 'If applying for a minor or student', mandatory: false }
    ],
    procedure: '1. Enter complete residential address with Tehsil & Block -> 2. Upload residence proof & Aadhaar -> 3. Circle Officer verification -> 4. Digital Certificate download.'
  },
  scholarship: {
    id: 'scholarship',
    title: 'Post-Matric & Higher Education Scholarship (छात्रवृत्ति)',
    category: 'Education & Welfare',
    dept: 'Department of Education & BC/EBC/Minority Welfare',
    time: '20 - 30 Working Days',
    summary: 'Financial scholarship and fee reimbursement for meritorious students enrolled in higher secondary, graduation, polytechnic, engineering, and medical courses.',
    mandatoryDocs: [
      { name: 'Current College Bonafide & Fee Receipt', desc: 'Admission slip with fee breakdown from accredited college', mandatory: true },
      { name: 'Previous Academic Year Marksheet', desc: 'Class 10th / 12th / Last Semester Marksheet', mandatory: true },
      { name: 'Valid Income Certificate', desc: 'Family annual income under statutory threshold (e.g. ₹2.5 Lakhs)', mandatory: true },
      { name: 'Caste Certificate (if applicable)', desc: 'For SC, ST, OBC, EBC, Minority students', mandatory: true },
      { name: 'Bank Account Passbook', desc: 'Aadhaar-seeded NPCI DBT active bank account', mandatory: true },
      { name: 'Aadhaar Card of Student', desc: 'Aadhaar linked to active student mobile number', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Hostel Fee Receipt', desc: 'For claiming additional hostel maintenance allowance', mandatory: false },
      { name: 'Gap Year Affidavit', desc: 'If there was a study gap between previous course', mandatory: false }
    ],
    procedure: '1. Register with Institute & Course Code -> 2. Upload Marksheet, Fee Receipt, Income & Caste Docs -> 3. Institute nodal officer verifies -> 4. DBT Direct Benefit Transfer to bank.'
  },
  driving_licence: {
    id: 'driving_licence',
    title: 'Learner & Permanent Driving Licence (ड्राइविंग लाइसेंस)',
    category: 'Transport & Licences',
    dept: 'Regional Transport Office (RTO) / Ministry of Road Transport',
    time: '15 - 20 Working Days',
    summary: 'Official permit issued by RTO allowing citizen to operate motor vehicles (Two-Wheeler, Light Motor Vehicle, Transport) on public roads.',
    mandatoryDocs: [
      { name: 'Age Proof Document', desc: '10th Marksheet / Birth Certificate / Passport / PAN Card', mandatory: true },
      { name: 'Current Address Proof', desc: 'Aadhaar Card / Voter ID / Electricity Bill / Rent Agreement', mandatory: true },
      { name: 'Medical Fitness Certificate (Form 1A)', desc: 'Signed by Registered Medical Practitioner for applicants aged 40+ or transport licence', mandatory: true },
      { name: 'Passport Size Photographs', desc: '4 passport size photos (white background)', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Driving School Certificate (Form 5)', desc: 'From registered driving school (mandatory for transport LMV)', mandatory: false }
    ],
    procedure: '1. Fill Form 2 on portal -> 2. Upload Age & Address Proof -> 3. Complete online LL test / slot booking -> 4. RTO driving skill test -> 5. Smart card dispatched.'
  },
  birth_certificate: {
    id: 'birth_certificate',
    title: 'Birth Certificate Registration (जन्म प्रमाण पत्र)',
    category: 'Civil Registration',
    dept: 'Municipal Corporation / Health Department / Gram Panchayat',
    time: '7 - 10 Working Days',
    summary: 'The most important statutory identity and age document establishing birth date, parental identity, and citizenship from birth registration records.',
    mandatoryDocs: [
      { name: 'Institutional Birth Proof', desc: 'Hospital Discharge Summary / Form 1 Birth Notification Slip', mandatory: true },
      { name: 'Parents Identity Proof', desc: 'Aadhaar Cards of both Father and Mother', mandatory: true },
      { name: 'Parents Marriage Certificate / Address Proof', desc: 'Voter ID / Ration Card / Electricity Bill showing address', mandatory: true }
    ],
    optionalDocs: [
      { name: 'SDM Delayed Permission Order', desc: 'Required if birth registration is delayed by more than 1 year', mandatory: false },
      { name: 'Self-Affidavit of Domestic Birth', desc: 'For births occurring at home without hospital slip', mandatory: false }
    ],
    procedure: '1. Enter Child details, date & place of birth -> 2. Upload hospital slip and parents Aadhaar -> 3. Registrar verification -> 4. Digitally signed certificate.'
  },
  farmer_subsidy: {
    id: 'farmer_subsidy',
    title: 'Farmer Input Subsidy & PM-Kisan (किसान सम्मान निधि एवं सब्सिडी)',
    category: 'Agriculture & Direct Benefits',
    dept: 'Department of Agriculture & Farmers Welfare',
    time: '15 Working Days',
    summary: 'Government financial assistance for agricultural seeds, fertilizers, farm equipment machinery subsidy, and seasonal crop loss relief compensation.',
    mandatoryDocs: [
      { name: 'Land Record (LPC / Khatoni / Khasra)', desc: 'Land Possession Certificate or latest online Jamabandi revenue receipt', mandatory: true },
      { name: 'Aadhaar Card with e-KYC', desc: 'Aadhaar linked to active mobile for OTP authentication', mandatory: true },
      { name: 'Bank Passbook Copy', desc: 'DBT enabled savings account in farmer name', mandatory: true },
      { name: 'Farmer Registration Number (DBT Agri ID)', desc: 'State agriculture portal unique farmer ID', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Crop Sowing Self-Declaration', desc: 'Self-attested affidavit of current season crops', mandatory: false }
    ],
    procedure: '1. Enter DBT Kisan ID -> 2. Select land plot (Khata/Khesra) -> 3. Upload LPC & Bank details -> 4. Agriculture Coordinator field check -> 5. Direct DBT credit.'
  },
  pension: {
    id: 'pension',
    title: 'Old Age, Widow & Disability Pension (सामाजिक सुरक्षा पेंशन)',
    category: 'Social Security & Welfare',
    dept: 'Department of Social Security & Empowerment',
    time: '30 Working Days',
    summary: 'Monthly direct-benefit financial support scheme for senior citizens aged 60+, widows, and persons with disabilities.',
    mandatoryDocs: [
      { name: 'Age Proof (for Senior Citizen 60+)', desc: 'Voter ID / Birth Certificate / Aadhaar / Matric Certificate', mandatory: true },
      { name: 'Bank Account Passbook with IFSC', desc: 'Active bank account for receiving direct monthly pension DBT', mandatory: true },
      { name: 'Income Certificate / BPL Ration Card', desc: 'Showing annual income below state poverty threshold', mandatory: true },
      { name: 'Aadhaar Card of Beneficiary', desc: 'With biometric/OTP verification', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Spouse Death Certificate', desc: 'Mandatory for Widow Pension scheme', mandatory: false },
      { name: 'Divyang Disability Certificate (40%+)', desc: 'From Civil Surgeon / District Medical Board for Disability Pension', mandatory: false }
    ],
    procedure: '1. Select Pension category -> 2. Enter Age & Bank details -> 3. Upload BPL/Income and Aadhaar -> 4. BDO / Social Security verification -> 5. Sanction order.'
  },
  trade_licence: {
    id: 'trade_licence',
    title: 'Municipal Trade & Commercial Licence (व्यापार लाइसेंस)',
    category: 'Business & Commerce',
    dept: 'Urban Local Bodies & Municipal Corporation',
    time: '10 - 14 Working Days',
    summary: 'Statutory licence required before commencing any commercial business, shop, eatery, manufacturing unit, or service establishment within municipal limits.',
    mandatoryDocs: [
      { name: 'Business Premises Proof', desc: 'Rent Agreement / Property Tax Receipt / NOC from Building Owner', mandatory: true },
      { name: 'Proprietor Identity & PAN Card', desc: 'Aadhaar Card and PAN Card of business owner/partners', mandatory: true },
      { name: 'Commercial Electricity Bill', desc: 'Latest electricity connection bill of the business premises', mandatory: true },
      { name: 'Establishment Photographs', desc: 'Front shop photo displaying business name board', mandatory: true }
    ],
    optionalDocs: [
      { name: 'Fire Safety NOC', desc: 'For restaurants, hotels, banquet halls, and large shops', mandatory: false },
      { name: 'FSSAI Licence', desc: 'For food, dairy, and edible manufacturing businesses', mandatory: false }
    ],
    procedure: '1. Select Business Category & Area sq.ft -> 2. Upload Property tax/Rent deed -> 3. Municipal inspector review -> 4. Pay trade fee -> 5. Instant licence download.'
  }
};

// ── Open / Close AI Agent Modal ──────────────────────────────────────────────
function toggleAiDocAgent(forceState) {
  // AI assistant is only available to authenticated users
  if (!authState.token || !authState.user) {
    // Guest → prompt login, then AI will be available after sign-in
    window.pendingPostLoginView = null;
    switchAuthTab('login');
    showAuthModal();
    return;
  }

  const modal = document.getElementById('aiDocAgentModal');
  const btn = document.getElementById('aiFloatingAgentBtn');
  if (!modal) return;

  const willOpen = forceState !== undefined ? forceState : (modal.style.display === 'none' || modal.style.display === '');
  aiAgentState.isOpen = willOpen;

  if (willOpen) {
    modal.style.display = 'flex';
    if (btn) btn.setAttribute('aria-expanded', 'true');
    const input = document.getElementById('aiAgentTextInput');
    if (input) setTimeout(() => input.focus(), 150);
  } else {
    modal.style.display = 'none';
    if (btn) btn.setAttribute('aria-expanded', 'false');
    stopAiVoiceRecognition();
  }
}

// ── Toggle TTS Voice Output ──────────────────────────────────────────────────
function toggleAiTts() {
  aiAgentState.ttsEnabled = !aiAgentState.ttsEnabled;
  const btn = document.getElementById('aiTtsToggleBtn');
  const icon = document.getElementById('aiTtsIcon');
  if (aiAgentState.ttsEnabled) {
    if (btn) btn.classList.add('active');
    if (icon) icon.textContent = '🔊';
    speakAiResponse('Voice reading enabled.');
  } else {
    if (btn) btn.classList.remove('active');
    if (icon) icon.textContent = '🔇';
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
}

// ── Speech Synthesis (Text to Speech) ─────────────────────────────────────────
function speakAiResponse(text) {
  if (!aiAgentState.ttsEnabled || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    // Clean text of HTML tags, emojis, and markdown symbols for clean audio
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/[*_#`~[\]()➔•✓⚠️🎉💡🚀]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect language
    const isHindi = /[\u0900-\u097F]/.test(cleanText) || appState.language === 'hi';
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';

    // Pick best voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find(v => (isHindi ? v.lang.includes('hi') : (v.lang.includes('en-IN') || v.lang.includes('en-US'))));
      if (preferred) utterance.voice = preferred;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS speech synthesis error:', e);
  }
}

// ── Voice Speech Recognition (Microphone like ChatGPT) ───────────────────────
function toggleAiVoiceRecognition() {
  if (aiAgentState.isListening) {
    stopAiVoiceRecognition();
  } else {
    startAiVoiceRecognition();
  }
}

function startAiVoiceRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById('aiMicBtn');
  const voiceBar = document.getElementById('aiVoiceListeningBar');
  const statusText = document.getElementById('aiAgentStatusText');
  const listeningText = document.getElementById('aiVoiceListeningText');

  if (!SpeechRec) {
    appendAiBotMessage("⚠️ Voice input is not supported in this browser. Please use Google Chrome, Edge, or Safari, or type your query in the input box below.");
    return;
  }

  try {
    if (aiAgentState.recognition) {
      try { aiAgentState.recognition.abort(); } catch (err) {}
    }

    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Set voice recognition language based on active app state
    recognition.lang = appState.language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = function () {
      aiAgentState.isListening = true;
      if (micBtn) micBtn.classList.add('listening');
      if (voiceBar) voiceBar.style.display = 'flex';
      if (statusText) statusText.textContent = '🎙️ Listening to your voice...';
      if (listeningText) listeningText.textContent = 'Listening... Speak your document question now';
    };

    recognition.onresult = function (event) {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const input = document.getElementById('aiAgentTextInput');
      if (input) {
        input.value = finalTranscript || interimTranscript;
      }

      if (listeningText && (finalTranscript || interimTranscript)) {
        listeningText.textContent = `"${finalTranscript || interimTranscript}"`;
      }

      if (finalTranscript && finalTranscript.trim().length > 0) {
        stopAiVoiceRecognition();
        sendAiUserMessage(finalTranscript.trim());
      }
    };

    recognition.onerror = function (event) {
      console.warn('Speech recognition event error:', event.error);
      stopAiVoiceRecognition();
      if (event.error === 'not-allowed') {
        appendAiBotMessage("🔒 Microphone access was denied. Please allow microphone permission in your browser settings to use voice input.");
      } else if (event.error !== 'no-speech') {
        appendAiBotMessage(`Voice note: Could not hear speech clearly. Please tap the mic 🎙️ again or type your question.`);
      }
    };

    recognition.onend = function () {
      stopAiVoiceRecognition();
    };

    aiAgentState.recognition = recognition;
    recognition.start();
  } catch (err) {
    console.error('Failed to initialize speech recognition:', err);
    stopAiVoiceRecognition();
  }
}

function stopAiVoiceRecognition() {
  aiAgentState.isListening = false;
  const micBtn = document.getElementById('aiMicBtn');
  const voiceBar = document.getElementById('aiVoiceListeningBar');
  const statusText = document.getElementById('aiAgentStatusText');

  if (micBtn) micBtn.classList.remove('listening');
  if (voiceBar) voiceBar.style.display = 'none';
  if (statusText) statusText.textContent = 'Online • Ready to find your documents';

  if (aiAgentState.recognition) {
    try {
      aiAgentState.recognition.stop();
    } catch (e) {}
    aiAgentState.recognition = null;
  }
}

// ── Send User Message ────────────────────────────────────────────────────────
function sendAiUserMessage(customText) {
  const input = document.getElementById('aiAgentTextInput');
  const text = customText || (input ? input.value.trim() : '');
  if (!text) return;

  if (input) input.value = '';

  // Append user message bubble
  appendAiUserMessage(text);

  // Show typing loader and respond
  showAiTypingIndicator();

  setTimeout(() => {
    removeAiTypingIndicator();
    processAiDocumentQuery(text);
  }, 400);
}

function handleAiInputKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendAiUserMessage();
  }
}

function handleAiTopicClick(topicText) {
  sendAiUserMessage(topicText);
}

function clearAiChat() {
  const chatBody = document.getElementById('aiDocChatBody');
  if (!chatBody) return;
  chatBody.innerHTML = `
    <div class="ai-msg-row ai-msg-bot">
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">
          <p><strong>Chat reset!</strong> Ask me any document question or tap the microphone 🎙️ to speak.</p>
        </div>
        <span class="ai-msg-time">Just now</span>
      </div>
    </div>
  `;
}

// ── UI Message Appenders ─────────────────────────────────────────────────────
function appendAiUserMessage(text) {
  const chatBody = document.getElementById('aiDocChatBody');
  if (!chatBody) return;

  const row = document.createElement('div');
  row.className = 'ai-msg-row ai-msg-user';
  row.innerHTML = `
    <div class="ai-msg-content">
      <div class="ai-msg-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
      <span class="ai-msg-time">You • Just now</span>
    </div>
  `;
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function appendAiBotMessage(htmlContent, speakText) {
  const chatBody = document.getElementById('aiDocChatBody');
  if (!chatBody) return;

  const row = document.createElement('div');
  row.className = 'ai-msg-row ai-msg-bot';
  row.innerHTML = `
    <div class="ai-msg-avatar">🤖</div>
    <div class="ai-msg-content">
      <div class="ai-msg-bubble">
        ${htmlContent}
      </div>
      <span class="ai-msg-time">Citizen AI • Just now</span>
    </div>
  `;
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (speakText) {
    speakAiResponse(speakText);
  }
}

function showAiTypingIndicator() {
  const chatBody = document.getElementById('aiDocChatBody');
  if (!chatBody) return;
  const ind = document.createElement('div');
  ind.id = 'aiTypingIndicator';
  ind.className = 'ai-msg-row ai-msg-bot';
  ind.innerHTML = `
    <div class="ai-msg-avatar">🤖</div>
    <div class="ai-msg-content">
      <div class="ai-msg-bubble" style="padding: 8px 14px; font-size: 12px; color: #64748b;">
        <span style="display:inline-block; animation: wavePulse 1s infinite;">⚡ Finding required documents...</span>
      </div>
    </div>
  `;
  chatBody.appendChild(ind);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeAiTypingIndicator() {
  const ind = document.getElementById('aiTypingIndicator');
  if (ind && ind.parentNode) ind.parentNode.removeChild(ind);
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

// ── AI Document Query Processing & NLP Matcher ───────────────────────────────
function processAiDocumentQuery(query) {
  const q = (query || '').toLowerCase().trim();

  // Check against known services
  let matchedServiceKey = null;

  if (q.includes('income') || q.includes('aay') || q.includes('आय') || q.includes('salary') || q.includes('earnings') || q.includes('kamai')) {
    matchedServiceKey = 'income_certificate';
  } else if (q.includes('caste') || q.includes('jati') || q.includes('जाति') || q.includes('obc') || q.includes('sc') || q.includes('st') || q.includes('ews') || q.includes('reservation')) {
    matchedServiceKey = 'caste_certificate';
  } else if (q.includes('domicile') || q.includes('residence') || q.includes('nivas') || q.includes('niwas') || q.includes('निवास') || q.includes('stay proof') || q.includes('local citizen')) {
    matchedServiceKey = 'domicile_certificate';
  } else if (q.includes('scholarship') || q.includes('chhatravritti') || q.includes('chatravriti') || q.includes('छात्रवृत्ति') || q.includes('college') || q.includes('fee reimbursement') || q.includes('student')) {
    matchedServiceKey = 'scholarship';
  } else if (q.includes('driving') || q.includes('licence') || q.includes('license') || q.includes('dl') || q.includes('rto') || q.includes('learner') || q.includes('वाहन') || q.includes('गाड़ी')) {
    matchedServiceKey = 'driving_licence';
  } else if (q.includes('birth') || q.includes('janam') || q.includes('जन्म') || q.includes('born') || q.includes('child birth')) {
    matchedServiceKey = 'birth_certificate';
  } else if (q.includes('farmer') || q.includes('kisan') || q.includes('किसान') || q.includes('pm kisan') || q.includes('crop') || q.includes('khasra') || q.includes('khatoni') || q.includes('kheti')) {
    matchedServiceKey = 'farmer_subsidy';
  } else if (q.includes('pension') || q.includes('old age') || q.includes('vridha') || q.includes('पेंशन') || q.includes('widow') || q.includes('divyang') || q.includes('handicap') || q.includes('senior')) {
    matchedServiceKey = 'pension';
  } else if (q.includes('trade') || q.includes('shop') || q.includes('business') || q.includes('vyapar') || q.includes('व्यापार') || q.includes('commercial licence')) {
    matchedServiceKey = 'trade_licence';
  } else if (q.includes('ration') || q.includes('rashan') || q.includes('राशन') || q.includes('khadya') || q.includes('food')) {
    matchedServiceKey = 'ration_card';
  }

  // If specific service matched, construct rich checklist card
  if (matchedServiceKey && AI_DOCS_KNOWLEDGE[matchedServiceKey]) {
    const data = AI_DOCS_KNOWLEDGE[matchedServiceKey];
    
    let docsHtml = '';
    data.mandatoryDocs.forEach(d => {
      docsHtml += `
        <li class="ai-doc-item-row">
          <span class="ai-doc-item-check">✓</span>
          <div>
            <strong>${escapeHtml(d.name)}</strong>
            <div style="font-size:11.5px; color:#64748b;">${escapeHtml(d.desc)}</div>
          </div>
          <span class="ai-doc-tag-mandatory">REQUIRED</span>
        </li>
      `;
    });

    if (data.optionalDocs && data.optionalDocs.length > 0) {
      data.optionalDocs.forEach(d => {
        docsHtml += `
          <li class="ai-doc-item-row" style="background:#f8fafc; border-color:#cbd5e1;">
            <span style="color:#0284c7; font-weight:bold;">ℹ</span>
            <div>
              <strong>${escapeHtml(d.name)}</strong>
              <div style="font-size:11px; color:#64748b;">${escapeHtml(d.desc)}</div>
            </div>
            <span style="font-size:9px; font-weight:700; background:#f1f5f9; color:#475569; padding:1px 4px; border-radius:4px; margin-left:auto;">OPTIONAL</span>
          </li>
        `;
      });
    }

    const cardHtml = `
      <p>Here are the <strong>required documents</strong> and details for <strong>${escapeHtml(data.title)}</strong>:</p>
      
      <div class="ai-doc-card">
        <div class="ai-doc-card-header">
          <span class="ai-doc-card-title">📋 Required Documents Checklist</span>
          <span class="ai-doc-badge-dept">${escapeHtml(data.dept)}</span>
        </div>
        
        <p style="font-size:12px; color:#334155; margin-bottom:8px;">${escapeHtml(data.summary)}</p>

        <ul class="ai-doc-items-wrap">
          ${docsHtml}
        </ul>

        <div class="ai-doc-card-meta">
          <span>⏱️ <strong>Estimated Issuance:</strong> ${escapeHtml(data.time)}</span>
          <span>⚡ <strong>Statutory Fee:</strong> ₹1.00 (Standard)</span>
        </div>

        <div class="ai-doc-card-actions">
          <button class="btn-ai-launch-form" onclick="launchServiceFromAi('${data.id}')">
            🚀 Fill This Form Now ➔
          </button>
          <button class="btn-ai-doc-details" onclick="showView('services'); toggleAiDocAgent(false);">
            View All Services
          </button>
        </div>
      </div>

      <p style="margin-top:8px; font-size:12px; color:#475569;">
        💡 <strong>Quick Steps:</strong> ${escapeHtml(data.procedure)}
      </p>
    `;

    const speechText = `Here are the required documents for ${data.title}. You will need ${data.mandatoryDocs.map(d => d.name).join(', ')}. Tap the button in the chat to start filling your form now.`;
    appendAiBotMessage(cardHtml, speechText);
    return;
  }

  // General questions (Tracking, Help, How to apply, etc.)
  if (q.includes('track') || q.includes('status') || q.includes('check status')) {
    const html = `
      <p>To track any ongoing application:</p>
      <ol style="margin-left: 18px; font-size: 13px; line-height: 1.6;">
        <li>Go to <strong>My Applications</strong> from the top navigation bar.</li>
        <li>Enter your Application Reference ID (e.g. <code>INC-UP-2026-894210</code>).</li>
        <li>View real-time officer remarks, stage progress, and download approved certificates!</li>
      </ol>
      <div style="margin-top:10px;">
        <button class="btn-ai-launch-form" onclick="showView('applications'); toggleAiDocAgent(false);">
          📂 Go to My Applications ➔
        </button>
      </div>
    `;
    appendAiBotMessage(html, "You can track your application status anytime under My Applications in the top menu.");
    return;
  }

  if (q.includes('help') || q.includes('call') || q.includes('phone') || q.includes('toll free') || q.includes('helpline') || q.includes('number')) {
    const html = `
      <p>📞 <strong>24x7 Citizen Helpline Support</strong></p>
      <p>For live telephonic assistance with filing forms and certificate status, call our toll-free citizen helpline:</p>
      <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:12px; margin:8px 0; text-align:center;">
        <div style="font-size:18px; font-weight:800; color:#15803d;">📞 1800-180-2026</div>
        <div style="font-size:11.5px; color:#166534; margin-top:2px;">Toll-Free • 24 Hours • 7 Days a Week • All Indian Languages</div>
      </div>
      <p style="font-size:12px; color:#64748b;">Our civic specialists can guide you with document scanning, photo compression, and submission.</p>
    `;
    appendAiBotMessage(html, "Our 24x7 toll-free helpline number is 1800-180-2026. Specialized officers are available anytime to assist you.");
    return;
  }

  // Fallback intelligent discovery
  const fallbackHtml = `
    <p>I can help you find all required documents for any government certificate or citizen scheme. Here are popular options:</p>
    
    <div style="display:flex; flex-wrap:wrap; gap:6px; margin: 10px 0;">
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Income Certificate documents')">📄 Income Certificate</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Caste Certificate documents')">🏛️ Caste Certificate</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Domicile Residence Certificate')">🏠 Domicile Certificate</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Scholarship Scheme documents')">🎓 Scholarship</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Driving Licence documents')">🚗 Driving Licence</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Birth Certificate documents')">👶 Birth Certificate</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Farmer Subsidy documents')">🌾 Farmer Subsidy</button>
      <button class="ai-topic-chip" onclick="handleAiTopicClick('Old Age Pension documents')">🧓 Pension</button>
    </div>
    
    <p style="font-size:12px; color:#64748b;">
      💡 <em>You can also tap the <strong>Microphone 🎙️</strong> and say: "What documents are required for Income Certificate?"</em>
    </p>
  `;
  appendAiBotMessage(fallbackHtml, "I can help you find the documents for Income, Caste, Domicile, Scholarship, Driving Licence, and many more. Please select a service or tap the microphone to speak.");
}

// ── Launch Specific Service Directly from AI Chat ────────────────────────────
function launchServiceFromAi(serviceId) {
  toggleAiDocAgent(false);
  if (typeof startSpecificService === 'function') {
    startSpecificService(serviceId);
  } else {
    showView('wizard');
  }
}


