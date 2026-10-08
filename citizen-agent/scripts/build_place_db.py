# -*- coding: utf-8 -*-
"""
build_place_db.py
Parses the official India State and Central Government Documents PRD
and generates place_documents_db.js for Citizen-Service Agent.
"""

import json
import re

def main():
    with open('citizen-agent/data/extracted_prd.txt', 'r', encoding='utf-8') as f:
        raw = f.read()

    # Portals map for all 28 states and 8 UTs
    portals = {
        'Andhra Pradesh': {'portal': 'MeeSeva / Meebhoomi AP', 'code': 'AP', 'dept': 'Revenue & Social Welfare'},
        'Arunachal Pradesh': {'portal': 'e-District Arunachal / ServicePlus', 'code': 'AR', 'dept': 'District Administration'},
        'Assam': {'portal': 'Sewa Setu (RTPS Assam)', 'code': 'AS', 'dept': 'Revenue & Disaster Management'},
        'Bihar': {'portal': 'RTPS Bihar (ServicePlus)', 'code': 'BR', 'dept': 'General Administration Department'},
        'Chhattisgarh': {'portal': 'e-District Chhattisgarh (CG Choice)', 'code': 'CG', 'dept': 'Revenue & Disaster Management'},
        'Goa': {'portal': 'Goa Online Citizen Portal', 'code': 'GA', 'dept': 'Collectorate & Civil Administration'},
        'Gujarat': {'portal': 'Digital Gujarat Portal', 'code': 'GJ', 'dept': 'Social Justice & Revenue'},
        'Haryana': {'portal': 'Antyodaya SARAL Haryana', 'code': 'HR', 'dept': 'Revenue & Citizen Resources Information'},
        'Himachal Pradesh': {'portal': 'e-District Himachal Pradesh', 'code': 'HP', 'dept': 'Revenue Department'},
        'Jharkhand': {'portal': 'JharSewa (e-District Jharkhand)', 'code': 'JH', 'dept': 'Personnel & Administrative Reforms'},
        'Karnataka': {'portal': 'Seva Sindhu Karnataka / Nadakacheri', 'code': 'KA', 'dept': 'Revenue & Social Welfare'},
        'Kerala': {'portal': 'e-District Kerala / Akshaya Centers', 'code': 'KL', 'dept': 'Revenue Department'},
        'Madhya Pradesh': {'portal': 'MP e-District / Samagra Portal', 'code': 'MP', 'dept': 'Public Service Management'},
        'Maharashtra': {'portal': 'Aaple Sarkar / MahaOnline', 'code': 'MH', 'dept': 'Revenue & Social Justice Department'},
        'Manipur': {'portal': 'e-District Manipur', 'code': 'MN', 'dept': 'District Administration'},
        'Meghalaya': {'portal': 'ServicePlus Meghalaya', 'code': 'ML', 'dept': 'General Administration'},
        'Mizoram': {'portal': 'e-District Mizoram', 'code': 'MZ', 'dept': 'District Administration & Revenue'},
        'Nagaland': {'portal': 'e-District Nagaland', 'code': 'NL', 'dept': 'Home & Personnel Department'},
        'Odisha': {'portal': 'Odisha Right to Public Services (ORTPSA)', 'code': 'OD', 'dept': 'Revenue & Disaster Management'},
        'Punjab': {'portal': 'Sewa Kendra Punjab (e-Sewa)', 'code': 'PB', 'dept': 'Governance Reforms & Revenue'},
        'Rajasthan': {'portal': 'e-Mitra Rajasthan', 'code': 'RJ', 'dept': 'DoIT&C & Revenue Department'},
        'Sikkim': {'portal': 'e-District Sikkim', 'code': 'SK', 'dept': 'Land Revenue & Disaster Management'},
        'Tamil Nadu': {'portal': 'TNeGA e-Sevai Portal', 'code': 'TN', 'dept': 'Revenue & Disaster Management'},
        'Telangana': {'portal': 'MeeSeva Telangana', 'code': 'TG', 'dept': 'Revenue & Social Welfare'},
        'Tripura': {'portal': 'e-District Tripura (e-Seva)', 'code': 'TR', 'dept': 'Revenue Department'},
        'Uttar Pradesh': {'portal': 'e-District UP / Jan Seva Kendra', 'code': 'UP', 'dept': 'Revenue Department & Board of Revenue'},
        'Uttarakhand': {'portal': 'e-District Uttarakhand / Apuni Sarkar', 'code': 'UK', 'dept': 'Revenue Department'},
        'West Bengal': {'portal': 'WB e-District Portal', 'code': 'WB', 'dept': 'Personnel & Administrative Reforms'},
        'Andaman & Nicobar Islands': {'portal': 'e-District Andaman', 'code': 'AN', 'dept': 'Revenue Administration'},
        'Chandigarh': {'portal': 'e-District Chandigarh / Sampark', 'code': 'CH', 'dept': 'Chandigarh Administration'},
        'Dadra and Nagar Haveli and Daman and Diu': {'portal': 'e-District DNH & DD', 'code': 'DN', 'dept': 'UT Administration'},
        'Delhi': {'portal': 'e-District Delhi', 'code': 'DL', 'dept': 'Revenue Department, Govt of NCT of Delhi'},
        'Jammu & Kashmir': {'portal': 'e-UNNAT Jammu & Kashmir', 'code': 'JK', 'dept': 'Revenue Department'},
        'Ladakh': {'portal': 'e-District Ladakh', 'code': 'LA', 'dept': 'UT Administration of Ladakh'},
        'Lakshadweep': {'portal': 'e-District Lakshadweep', 'code': 'LD', 'dept': 'Directorate of Planning & Statistics'},
        'Puducherry': {'portal': 'e-District Puducherry', 'code': 'PY', 'dept': 'Department of Revenue & Disaster Management'},
        'Central Government': {'portal': 'National Government Services Portal (services.india.gov.in)', 'code': 'IN', 'dept': 'Government of India'}
    }

    # Extract state-wise document list
    state_section_match = re.search(r'2\.\s+State-wise Documents(.*?)3\.\s+Union Territories', raw, re.DOTALL)
    state_dict = {}
    if state_section_match:
        state_text = state_section_match.group(1)
        # Match each state block: number, state name, docs
        matches = list(re.finditer(r'(\d+)\.\s+([A-Za-z\s]+)\n', state_text))
        for i, match in enumerate(matches):
            num = match.group(1)
            name = match.group(2).strip()
            start_pos = match.end()
            end_pos = matches[i+1].start() if i+1 < len(matches) else len(state_text)
            block = state_text[start_pos:end_pos]
            
            doc_items = []
            for line in block.split('\n'):
                line = line.strip().replace('\x7f', '').strip()
                if line.startswith('===') or not line:
                    continue
                # Clean up bullet characters or leading symbols
                line = re.sub(r'^[•\-\*\s]+', '', line).strip()
                if line and len(line) > 2:
                    doc_items.append(line)
            state_dict[name] = doc_items

    print('Parsed states count:', len(state_dict))

    # Parse UTs
    ut_list = [
        'Andaman & Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi',
        'Jammu & Kashmir',
        'Ladakh',
        'Lakshadweep',
        'Puducherry'
    ]

    # Specific documents for UTs
    ut_docs_map = {
        'Delhi': [
            'Domicile Certificate',
            'SC / ST / OBC Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Birth Certificate',
            'Death Certificate',
            'Lal Dora Certificate',
            'Delayed Birth/Death Order',
            'Surviving Member Certificate',
            'Disability Certificate'
        ],
        'Jammu & Kashmir': [
            'Domicile Certificate (J&K)',
            'Category / Caste Certificate (RBA, ALC/IB, SC, ST, OSC)',
            'Income Certificate',
            'EWS Certificate',
            'Dependent Certificate',
            'Revenue / Land Extracts (Fard, Jamabandi)',
            'Legal Heir Certificate',
            'Birth / Death Certificate'
        ],
        'Ladakh': [
            'Resident Certificate (Ladakh)',
            'ST Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Character Certificate',
            'Birth / Death Certificate',
            'Land Record / Revenue Documents'
        ],
        'Chandigarh': [
            'Residence Certificate',
            'Caste / OBC Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Senior Citizen Card',
            'Birth / Death Certificate',
            'Legal Heir Certificate'
        ],
        'Puducherry': [
            'Nativity / Residence Certificate',
            'Community Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Birth / Death Certificate',
            'Legal Heir Certificate'
        ],
        'Andaman & Nicobar Islands': [
            'Local Resident Certificate',
            'Tribal Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Birth / Death Certificate',
            'Character Certificate'
        ],
        'Dadra and Nagar Haveli and Daman and Diu': [
            'Domicile / Residence Certificate',
            'Caste / Tribe Certificate',
            'Income Certificate',
            'EWS Certificate',
            'Birth / Death Certificate',
            'Land / Revenue Certificates'
        ],
        'Lakshadweep': [
            'Permanent Resident Certificate',
            'ST Certificate',
            'Income Certificate',
            'Birth / Death Certificate',
            'Inter-Island Permit'
        ]
    }

    # Core 19 Documents
    core_docs = [
        {"name": "Birth Certificate", "importance": "★★★★★", "use": "Age/date-of-birth proof, school admissions, passport, government services", "category": "Civil Registration"},
        {"name": "Aadhaar Card", "importance": "★★★★★", "use": "Universal identity/address verification and all digital government services", "category": "Identity & Citizenship"},
        {"name": "PAN Card", "importance": "★★★★★", "use": "Income tax, banking, financial KYC and high-value transactions", "category": "Financial"},
        {"name": "Voter ID / EPIC", "importance": "★★★★★", "use": "Electoral identification and statutory address proof", "category": "Identity & Citizenship"},
        {"name": "Passport", "importance": "★★★★★", "use": "International travel, nationality, and primary citizenship proof", "category": "Identity & Citizenship"},
        {"name": "Driving Licence", "importance": "★★★★★", "use": "Motor vehicle operation + national photo identity/address proof", "category": "Vehicle"},
        {"name": "Death Certificate", "importance": "★★★★★", "use": "Inheritance, pension transfer, insurance claims, legal succession", "category": "Civil Registration"},
        {"name": "Marriage Certificate", "importance": "★★★★★", "use": "Legal proof of marriage, spouse visas, joint property and bank accounts", "category": "Civil Registration"},
        {"name": "Domicile / Residence Certificate", "importance": "★★★★★", "use": "State residency proof for government recruitment, university quotas & local schemes", "category": "State Residency"},
        {"name": "Caste Certificate", "importance": "★★★★★", "use": "Statutory reservation (SC/ST/OBC) and eligible affirmative action benefits", "category": "Social Category"},
        {"name": "Income Certificate", "importance": "★★★★★", "use": "Scholarships, tuition fee waivers, welfare subsidies, EWS eligibility", "category": "Financial"},
        {"name": "EWS Certificate", "importance": "★★★★★", "use": "10% Economically Weaker Section reservation in education and central/state jobs", "category": "Social Category"},
        {"name": "Disability Certificate / UDID", "importance": "★★★★★", "use": "Accessible benefits, travel concessions, reservation, and welfare schemes", "category": "Social Category"},
        {"name": "Character Certificate", "importance": "★★★★", "use": "Government & private employment, police verification, college admissions", "category": "Employment"},
        {"name": "Nationality / Citizenship Proof", "importance": "★★★★", "use": "Statutory citizenship-related requirements and government appointments", "category": "Identity & Citizenship"},
        {"name": "Land / Property Documents (RoR/Mutation)", "importance": "★★★★", "use": "Ownership title, property mutations, agricultural subsidies, bank loans", "category": "Property & Land"},
        {"name": "Family / Legal Heir Certificate", "importance": "★★★★", "use": "Property succession, transfer of deceased savings, family pensions", "category": "Civil Registration"},
        {"name": "Solvency Certificate", "importance": "★★★", "use": "Financial surety proof for government tenders, contracts, and court bails", "category": "Financial"},
        {"name": "Income & Asset Certificate", "importance": "★★★★", "use": "Comprehensive asset and income validation for statutory quotas", "category": "Financial"}
    ]

    # Central Documents categorized
    central_docs = {
        "Identity & Citizenship": [
            "Aadhaar Card", "PAN Card", "Passport", "Voter ID / EPIC Card", "Government Employee ID", "Citizenship Certificate"
        ],
        "Civil Registration": [
            "Birth Certificate", "Death Certificate", "Marriage Certificate", "Adoption Deed / Certificate", "Legal Heir / Succession Certificate"
        ],
        "Social Category": [
            "Central SC Certificate", "Central ST Certificate", "Central OBC Non-Creamy Layer Certificate", "Central EWS Certificate", "Disability Certificate", "UDID Smart Card"
        ],
        "Financial": [
            "PAN Card", "Income Certificate", "Income & Asset Certificate", "Bank Account Passbook / Statement", "Form 16 / ITR Acknowledgement", "GST Registration (Business)", "Udyam Registration (MSME)"
        ],
        "Education": [
            "10th Marksheet & Passing Certificate", "12th Marksheet & Passing Certificate", "Graduation Degree Certificate", "Diploma Certificate", "Transfer Certificate (TC)", "Migration Certificate", "College Bonafide Certificate", "Scholarship Eligibility Proof"
        ],
        "Employment": [
            "Employment / Experience Certificate", "Character Certificate", "Police Verification Certificate (PCC)", "Skill & Apprenticeship Certificate", "Employment Exchange Registration", "NOC (No Objection Certificate)"
        ],
        "Property & Land": [
            "Registered Sale Deed", "Title Deed", "Encumbrance Certificate (EC)", "Land Record / RoR (Khasra/Khatauni)", "Mutation Certificate", "Property Tax Receipt", "Possession Certificate", "Sanctioned Building Plan"
        ],
        "Vehicle": [
            "Registration Certificate (RC)", "Driving Licence (Smart Card)", "Learner's Licence (LL)", "Vehicle Insurance Policy", "Pollution Under Control (PUC)", "Commercial Fitness Certificate"
        ],
        "Business": [
            "Business PAN", "GST Registration Certificate", "Udyam Registration Certificate", "Shop & Establishment Licence", "FSSAI Food Licence / Registration", "Professional Tax Registration", "Import Export Code (IEC)", "Company / LLP Incorporation Certificate"
        ]
    }

    # Generate document items with metadata
    def enrich_doc(doc_name, place_name):
        doc_lower = doc_name.lower()
        
        category = 'certificates'
        time = '7 - 14 Days'
        govFee = 1
        steps = '4 steps'
        importance = '★★★★★'
        proofs = ['Aadhaar Card (Identity Proof)', 'Address Proof (Ration Card/Electricity Bill)', 'Passport Size Photo']

        if 'income' in doc_lower or 'asset' in doc_lower:
            category = 'certificates'
            time = '7 - 10 Days'
            steps = '4 steps'
            importance = '★★★★★'
            proofs = ['Aadhaar Card', 'Ration Card / Electricity Bill', 'Salary Slip / Patwari Income Report', 'Passport Photo']
        elif 'caste' in doc_lower or 'tribe' in doc_lower or 'st' in doc_lower or 'sc' in doc_lower or 'obc' in doc_lower or 'community' in doc_lower:
            category = 'certificates'
            time = '10 - 15 Days'
            steps = '5 steps'
            importance = '★★★★★'
            proofs = ['Aadhaar Card', 'Ancestral Record (Pre-1950/1967/Land Record)', 'Affidavit', 'Passport Photo']
        elif 'validity' in doc_lower:
            category = 'certificates'
            time = '15 - 20 Days'
            steps = '5 steps'
            importance = '★★★★★'
            proofs = ['Original Caste Certificate', 'School Leaving Certificate', 'Affidavit in Form 3', 'Genealogy Tree']
        elif 'domicile' in doc_lower or 'residence' in doc_lower or 'prc' in doc_lower or 'residential' in doc_lower or 'nativity' in doc_lower or 'himachali' in doc_lower:
            category = 'certificates'
            time = '7 - 10 Days'
            steps = '4 steps'
            importance = '★★★★★'
            proofs = ['Aadhaar Card', 'Continuous Stay Proof (10-15 Years)', 'Electricity Bill / Ration Card', 'Passport Photo']
        elif 'ews' in doc_lower:
            category = 'certificates'
            time = '10 - 15 Days'
            steps = '4 steps'
            importance = '★★★★★'
            proofs = ['Aadhaar Card', 'Income Certificate', 'Land / Property Holding Declaration', 'Family Photo']
        elif 'birth' in doc_lower:
            category = 'certificates'
            time = '7 Days'
            steps = '3 steps'
            importance = '★★★★★'
            proofs = ['Hospital Discharge Card / Doctor Slip', 'Parents Aadhaar Card', 'Marriage Certificate']
        elif 'death' in doc_lower:
            category = 'certificates'
            time = '7 Days'
            steps = '3 steps'
            importance = '★★★★★'
            proofs = ['Hospital Death Summary / Cremation Slip', 'Applicant Aadhaar Card', 'Deceased Aadhaar Card']
        elif 'heir' in doc_lower or 'varisan' in doc_lower or 'family' in doc_lower:
            category = 'certificates'
            time = '15 - 21 Days'
            steps = '5 steps'
            importance = '★★★★'
            proofs = ['Deceased Death Certificate', 'Legal Heirs Aadhaar Cards', 'Ration Card', 'Notarized Family Affidavit']
        elif 'land' in doc_lower or 'revenue' in doc_lower or 'possession' in doc_lower or 'mutation' in doc_lower or 'khatiyan' in doc_lower:
            category = 'agriculture'
            time = '14 - 21 Days'
            steps = '5 steps'
            importance = '★★★★'
            proofs = ['Sale Deed / Title Document', 'Current Khatauni / RoR Copy', 'Latest Land Revenue Receipt', 'Aadhaar Card']
        elif 'farmer' in doc_lower or 'agri' in doc_lower:
            category = 'agriculture'
            time = '10 - 15 Days'
            steps = '4 steps'
            importance = '★★★★'
            proofs = ['Land Possession Certificate (LPC)', 'Bank Account Passbook', 'Aadhaar Card']
        elif 'character' in doc_lower:
            category = 'certificates'
            time = '5 - 7 Days'
            steps = '3 steps'
            importance = '★★★★'
            proofs = ['Aadhaar Card', 'Local Police Verification / Gazetted Officer Attestation', 'Passport Photo']
        elif 'marriage' in doc_lower:
            category = 'certificates'
            time = '10 - 15 Days'
            steps = '4 steps'
            importance = '★★★★★'
            proofs = ['Marriage Invitation Card', 'Age Proofs of Both Spouses', 'Three Witnesses Aadhaar Cards', 'Joint Photo']
        elif 'first graduate' in doc_lower:
            category = 'education'
            time = '10 Days'
            steps = '4 steps'
            importance = '★★★★'
            proofs = ['Self Marksheets (10th/12th)', 'Parents/Siblings Educational Proofs', 'Tahsildar Declaration']

        slug = re.sub(r'[^a-z0-9]+', '_', doc_name.lower()).strip('_')
        place_slug = re.sub(r'[^a-z0-9]+', '_', place_name.lower()).strip('_')
        doc_id = f'{place_slug}_{slug}'

        portal_info = portals.get(place_name, {'portal': f'{place_name} Citizen Portal', 'dept': 'State Administration'})

        return {
            'id': doc_id,
            'title': doc_name,
            'place': place_name,
            'category': category,
            'dept': portal_info['dept'],
            'portal': portal_info['portal'],
            'importance': importance,
            'time': time,
            'govFee': govFee,
            'steps': steps,
            'docsRequired': proofs,
            'description': f'Official application for {doc_name} under {place_name} jurisdiction via {portal_info["portal"]}.',
            'whoCanApply': f'Eligible residents/citizens in {place_name} meeting statutory rules.'
        }

    # Build entire JavaScript database structure
    output_js = """/**
 * place_documents_db.js
 * Official India Government Documents & Certificates Database (PRD Master Data)
 * Covers: 28 States + 8 Union Territories + Central Government
 * Enables citizens to browse, filter, and apply for documents strictly according to their location.
 */

// ── 1. Core Universal Documents ───────────────────────────────────────────────
const CORE_DOCUMENTS_PRD = """ + json.dumps(core_docs, indent=2, ensure_ascii=False) + """;

// ── 2. Master Places Metadata (28 States + 8 UTs + Central) ───────────────────
const PLACES_DIRECTORY = [
  // Central Level
  { name: 'Central Government', type: 'central', code: 'IN', portal: 'National Government Services Portal (services.india.gov.in)', dept: 'Government of India' },

  // 28 States
"""

    for state_name in sorted(state_dict.keys()):
        pinfo = portals.get(state_name, {'portal': f'{state_name} Citizen Portal', 'code': 'ST', 'dept': 'State Government'})
        output_js += f"  {{ name: '{state_name}', type: 'state', code: '{pinfo['code']}', portal: '{pinfo['portal']}', dept: '{pinfo['dept']}' }},\n"

    output_js += "\n  // 8 Union Territories\n"
    for ut_name in sorted(ut_list):
        pinfo = portals.get(ut_name, {'portal': f'{ut_name} e-District', 'code': 'UT', 'dept': 'UT Administration'})
        output_js += f"  {{ name: '{ut_name}', type: 'ut', code: '{pinfo['code']}', portal: '{pinfo['portal']}', dept: '{pinfo['dept']}' }},\n"

    output_js += "];\n\n"

    # Build State Documents Dictionary
    state_enriched = {}
    for state_name, doc_list in state_dict.items():
        state_enriched[state_name] = [enrich_doc(d, state_name) for d in doc_list]

    for ut_name in ut_list:
        doc_list = ut_docs_map.get(ut_name, ['Domicile / Residence Certificate', 'Caste Certificate', 'Income Certificate', 'Birth Certificate', 'Death Certificate'])
        state_enriched[ut_name] = [enrich_doc(d, ut_name) for d in doc_list]

    # Central documents list enriched
    central_flat_docs = []
    for cat_name, doc_list in central_docs.items():
        for d in doc_list:
            item = enrich_doc(d, 'Central Government')
            item['central_category'] = cat_name
            central_flat_docs.append(item)
    state_enriched['Central Government'] = central_flat_docs

    output_js += "// ── 3. Place-wise Documents Database (28 States + 8 UTs + Central) ──────\n"
    output_js += "const PLACE_DOCUMENTS_DB = " + json.dumps(state_enriched, indent=2, ensure_ascii=False) + ";\n\n"

    # Central Documents grouped by PRD categories
    output_js += "// ── 4. Central Documents by PRD Functional Domains ──────────────────\n"
    output_js += "const CENTRAL_DOCUMENTS_BY_DOMAIN = " + json.dumps(central_docs, indent=2, ensure_ascii=False) + ";\n\n"

    # Add Helper Utility API functions
    output_js += """// ── 5. Place Documents Query & Application Engine ───────────────────────────
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
"""

    with open('citizen-agent/web/place_documents_db.js', 'w', encoding='utf-8') as out:
        out.write(output_js)

    print('Generated citizen-agent/web/place_documents_db.js successfully!')

if __name__ == '__main__':
    main()
