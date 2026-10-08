/**
 * translations.js – Centralized Scalable Multilingual Engine for Citizen-Service Agent
 * Supports 15 Indian & Regional Languages with dynamic real-time DOM translation.
 * Designed for DPDP & Civic Tech accessibility: "I can use this entire website in my own language."
 */

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', popular: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', script: 'Devanagari' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Arabic' }
];

const TRANSLATIONS = {
  // ── Top Announcement & Compliance Bar ──
  announcement_badge: {
    en: 'CIVIC ASSISTANCE',
    hi: 'नागरिक सहायता',
    bn: 'নাগরিক সহায়তা',
    mr: 'नागरी सहाय्य',
    ta: 'குடிமக்கள் உதவி',
    te: 'పౌర సహాయం',
    gu: 'નાગરિક સહાય',
    kn: 'ನಾಗರಿಕ ನೆರವು',
    ml: 'പൗര സഹായം',
    pa: 'ਨਾਗਰਿਕ ਸਹਾਇਤਾ',
    or: 'ନାଗରିକ ସହାୟତା',
    mai: 'नागरिक सहायता',
    bho: 'नागरिक मदद',
    as: 'নাগৰিক সাহায্য',
    ur: 'عوامی مدد'
  },
  announcement_text: {
    en: 'Citizen-Service Agent (CivicAgent) • Digital public assistance platform',
    hi: 'नागरिक सेवा सहायक (CivicAgent) • डिजिटल सार्वजनिक सहायता मंच',
    bn: 'সিটিজেন-সার্ভিস এজেন্ট (CivicAgent) • ডিজিটাল জনসেবা প্ল্যাটফর্ম',
    mr: 'नागरिक सेवा सहाय्यक (CivicAgent) • डिजिटल सार्वजनिक सहाय्य मंच',
    ta: 'குடிமக்கள் சேவை முகவர் (CivicAgent) • டிஜிட்டல் பொது உதவி தளம்',
    te: 'సిటిజెన్-సర్వీస్ ఏజెంట్ (CivicAgent) • డిజిటల్ పబ్లిక్ సహాయ వేదిక',
    gu: 'સિટિઝન-સર્વિસ એજન્ટ (CivicAgent) • ડિજિટલ જાહેર સહાય મંચ',
    kn: 'ಸಿಟಿಜನ್-ಸರ್ವೀಸ್ ಏಜೆಂಟ್ (CivicAgent) • ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ನೆರವು ವೇದಿಕೆ',
    ml: 'സിറ്റിസൺ-സർവീസ് ഏജന്റ് (CivicAgent) • ഡിജിറ്റൽ പൊതുസഹായ പ്ലാറ്റ്‌ഫോം',
    pa: 'ਸਿਟੀਜ਼ਨ-ਸਰਵਿਸ ਏਜੰਟ (CivicAgent) • ਡਿਜੀਟਲ ਜਨਤਕ ਸਹਾਇਤਾ ਮੰਚ',
    or: 'ସିଟିଜେନ୍-ସର୍ଭିସ ଏଜେଣ୍ଟ (CivicAgent) • ଡିଜିଟାଲ୍ ସାର୍ବଜନୀନ ସହାୟତା ମଞ୍ଚ',
    mai: 'नागरिक सेवा सहायक (CivicAgent) • डिजिटल लोक सहायता मंच',
    bho: 'नागरिक सेवा एजेंट (CivicAgent) • डिजिटल सरकारी मदद मंच',
    as: 'চিটিজেন-চাৰ্ভিছ এজেন্ট (CivicAgent) • ডিজিটেল জনসেৱা মঞ্চ',
    ur: 'سٹیزن سروس ایجنٹ (CivicAgent) • ڈیجیٹల్ عوامی امدادی پلیٹ فارم'
  },
  announcement_trust: {
    en: '🛡️ DPDP 2023 Compliant • 100% Consent Gated • Zero Intermediary Bribes',
    hi: '🛡️ DPDP 2023 अनुपालित • 100% सहमति आधारित • शून्य बिचौलिया शुल्क',
    bn: '🛡️ DPDP 2023 মানানসই • ১০০% সম্মতি চালিত • মধ্যস্বত্বভোগীহীন',
    mr: '🛡️ DPDP 2023 सुसंगत • १००% संमती आधारित • मध्यस्थ विरहित',
    ta: '🛡️ DPDP 2023 இணக்கமானது • 100% ஒப்புதல் அடிப்படையிலானது • இடைத்தரகர் கட்டணம் இல்லை',
    te: '🛡️ DPDP 2023 కంప్లైంట్ • 100% సమ్మతి ఆధారితం • దళారుల ప్రమేయం లేదు',
    gu: '🛡️ DPDP 2023 સુસંગત • ૧૦૦% સંમતિ આધારિત • દલાલો મુક્ત',
    kn: '🛡️ DPDP 2023 ಅನುಸರಣೆ • 100% ಒಪ್ಪಿಗೆ ಆಧಾರಿತ • ಮಧ್ಯವರ್ತಿಗಳ ಶುಲ್ಕವಿಲ್ಲ',
    ml: '🛡️ DPDP 2023 അനുസൃതമായത് • 100% സമ്മതത്തോടെ മാത്രം • ഇടനിലക്കാരില്ല',
    pa: '🛡️ DPDP 2023 ਅਨੁਕੂਲ • 100% ਸਹਿਮਤੀ ਆਧਾਰਿਤ • ਜ਼ੀਰੋ ਵਿਚੋਲਗੀ ਫੀਸ',
    or: '🛡️ DPDP 2023 ନିୟମାନୁସାରୀ • ୧୦୦% ସମ୍ମତି ଆଧାରିତ • ଦଲାଲମୁକ୍ତ',
    mai: '🛡️ DPDP 2023 सम्मत • 100% सहमति आधारित • शून्य दलाल शुल्क',
    bho: '🛡️ DPDP 2023 अनुपालित • 100% सहमति से • कवनो दलाली नाहीं',
    as: '🛡️ DPDP 2023 নিয়ম মানি চলা • ১০০% সন্মতি ভিত্তিক • মধ্যভোগী নাই',
    ur: '🛡️ DPDP 2023 کا پابند • 100% رضامندی پر مبنی • زیرو رشوت'
  },

  // ── Header & Navigation ──
  app_name: {
    en: 'Citizen-Service Agent',
    hi: 'नागरिक सेवा सहायक',
    bn: 'সিটিজেন-সার্ভিস এজেন্ট',
    mr: 'नागरिक सेवा सहाय्यक',
    ta: 'குடிமக்கள் சேவை முகவர்',
    te: 'సిటిజెన్-సర్వీస్ ఏజెంట్',
    gu: 'સિટિઝન-સર્વિસ એજન્ટ',
    kn: 'ಸಿಟಿಜನ್-ಸರ್ವೀಸ್ ಏಜೆಂಟ್',
    ml: 'സിറ്റിസൺ-സർവീസ് ഏജന്റ്',
    pa: 'ਸਿਟੀਜ਼ਨ-ਸਰਵਿਸ ਏਜੰਟ',
    or: 'ସିଟିଜେନ୍-ସର୍ଭିସ ଏଜେଣ୍ଟ',
    mai: 'नागरिक सेवा सहायक',
    bho: 'नागरिक सेवा सहायक',
    as: 'চিটিজেন-চাৰ্ভিছ এজেন্ট',
    ur: 'سٹیزن سروس ایجنٹ'
  },
  logo_tagline: {
    en: 'Government Services, Made Simple',
    hi: 'सरकारी सेवाएं, अब आसान और सुलभ',
    bn: 'সরকারি পরিষেবা, এখন সহজ ও সুন্দর',
    mr: 'सरकारी सेवा, आता अत्यंत सोप्या',
    ta: 'அரசு சேவைகள், இப்போது எளிமையாக',
    te: 'ప్రభుత్వ సేవలు, సులభతరం',
    gu: 'સરકારી સેવાઓ, હવે સરળ અને સુલભ',
    kn: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ಈಗ ಸುಲಭ',
    ml: 'സർക്കാർ സേവനങ്ങൾ, ഇപ്പോൾ ലളിതം',
    pa: 'ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਹੁਣ ਸਰਲ ਤੇ ਆਸਾਨ',
    or: 'ସରକାରୀ ସେବା, ଏବେ ସରଳ ଓ ସୁଗମ',
    mai: 'सरकारी सेवा, आब सरल आ सुलभ',
    bho: 'सरकारी सेवा, अब आसानी से',
    as: 'চৰকাৰী সেৱা, এতিয়া সহজ',
    ur: 'سرکاری خدمات، اب آسان'
  },
  nav_home: {
    en: 'Home',
    hi: 'मुख्य पृष्ठ',
    bn: 'হোম',
    mr: 'मुख्यपृष्ठ',
    ta: 'முகப்பு',
    te: 'హోమ్',
    gu: 'હોમ',
    kn: 'ಮುಖಪುಟ',
    ml: 'ഹോം',
    pa: 'ਮੁੱਖ ਪੰਨਾ',
    or: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    mai: 'मुख्य पृष्ठ',
    bho: 'होम',
    as: 'ঘৰ',
    ur: 'ہوم'
  },
  nav_services: {
    en: 'Services',
    hi: 'सेवाएं',
    bn: 'পরিষেবাসমূহ',
    mr: 'सेवा',
    ta: 'சேவைகள்',
    te: 'సేవలు',
    gu: 'સેવાઓ',
    kn: 'ಸೇವೆಗಳು',
    ml: 'സేవകൾ',
    pa: 'ਸੇਵਾਵਾਂ',
    or: 'ସେବାସମୂହ',
    mai: 'सेवा सभ',
    bho: 'सेवा सब',
    as: 'সেৱাসমূহ',
    ur: 'خدمات'
  },
  nav_applications: {
    en: 'My Applications',
    hi: 'मेरे आवेदन',
    bn: 'আমার আবেদনসমূহ',
    mr: 'माझे अर्ज',
    ta: 'எனது விண்ணப்பங்கள்',
    te: 'నా దరఖాస్తులు',
    gu: 'મારી અરજીઓ',
    kn: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    ml: 'എന്റെ അപേക്ഷകൾ',
    pa: 'ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ',
    or: 'ମୋର ଆବେଦନ',
    mai: 'हमर आवेदन',
    bho: 'हमार आवेदन',
    as: 'মোৰ আবেদনসমূহ',
    ur: 'میری درخواستیں'
  },
  nav_track: {
    en: 'Track Status',
    hi: 'स्थिति ट्रैक करें',
    bn: 'স্থিতি ট্র্যাক করুন',
    mr: 'स्थिती तपासा',
    ta: 'நிலையைக் கண்காணிக்கவும்',
    te: 'స్థితిని ట్రాక్ చేయండి',
    gu: 'સ્થિતિ ટ્રેક કરો',
    kn: 'ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    ml: 'സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക',
    pa: 'ਸਥਿਤੀ ਟਰੈਕ ਕਰੋ',
    or: 'ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ',
    mai: 'स्थिति देखू',
    bho: 'स्टेटस देखीं',
    as: 'স্থিতি নিৰীক্ষণ কৰক',
    ur: 'حالت دیکھیں'
  },
  nav_help: {
    en: 'Help & FAQ',
    hi: 'सहायता एवं प्रश्न',
    bn: 'সাহায্য ও প্রশ্নোত্তর',
    mr: 'मदत व प्रश्न',
    ta: 'உதவி மற்றும் வினாக்கள்',
    te: 'సహాయం & ప్రశ్నలు',
    gu: 'મદદ અને પ્રશ્નો',
    kn: 'ಸಹಾಯ ಮತ್ತು ಪ್ರಶ್ನೆಗಳು',
    ml: 'സഹായവും ചോദ്യങ്ങളും',
    pa: 'ਸਹਾਇਤਾ ਅਤੇ ਸਵਾਲ',
    or: 'ସହାୟତା ଓ ପ୍ରଶ୍ନୋତ୍ତର',
    mai: 'सहायता आ प्रश्नोत्तर',
    bho: 'मदद अउर सवाल',
    as: 'সহায় আৰু প্ৰশ্নোত্তৰ',
    ur: 'مدد اور سوالات'
  },
  nav_privacy: {
    en: 'Privacy & DPDP',
    hi: 'गोपनीयता नीति',
    bn: 'গোপনীয়তা নীতি',
    mr: 'गोपनीयता धोरण',
    ta: 'தனியுரிமை கொள்கை',
    te: 'గోప్యతా విధానం',
    gu: 'ગોપનીયતા નીતિ',
    kn: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    ml: 'സ്വകാര്യതാ നയം',
    pa: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ',
    or: 'ଗୋପନୀୟତା ନୀତି',
    mai: 'गोपनीयता नीति',
    bho: 'प्राइवेसी नीति',
    as: 'গোপনীয়তা নীতি',
    ur: 'رازداری کی پالیسی'
  },
  nav_admin: {
    en: 'Audit Cockpit',
    hi: 'ऑडिट कॉकपिट',
    bn: 'অডিট ককপিট',
    mr: 'ऑडिट कॉकपिट',
    ta: 'தணிக்கை பலகை',
    te: 'ఆడిట్ కాక్‌పిట్',
    gu: 'ઓડિટ કોકપિટ',
    kn: 'ಆಡಿಟ್ ಕಾಕ್‌ಪಿಟ್',
    ml: 'ഓഡിറ്റ് കോക്ക്പിറ്റ്',
    pa: 'ਆਡਿਟ ਕਾਕਪਿਟ',
    or: 'ଅଡିଟ୍ କକପିଟ୍',
    mai: 'ऑडिट कॉकपिट',
    bho: 'ऑडिट कॉकपिट',
    as: 'অডিট ককপিট',
    ur: 'آڈٹ کاک پٹ'
  },
  btn_start_service: {
    en: 'Start a Service ➔',
    hi: 'सेवा शुरू करें ➔',
    bn: 'পরিষেবা শুরু করুন ➔',
    mr: 'सेवा सुरू करा ➔',
    ta: 'சேவையைத் தொடங்கு ➔',
    te: 'సేవను ప్రారంభించండి ➔',
    gu: 'સેવા શરૂ કરો ➔',
    kn: 'ಸೇವೆ ಪ್ರಾರಂಭಿಸಿ ➔',
    ml: 'സേവനം ആരംഭിക്കുക ➔',
    pa: 'ਸੇਵਾ ਸ਼ੁਰੂ ਕਰੋ ➔',
    or: 'ସେବା ଆରମ୍ଭ କରନ୍ତୁ ➔',
    mai: 'सेवा शुरू करू ➔',
    bho: 'सेवा शुरू करीं ➔',
    as: 'সেৱা আৰম্ভ কৰক ➔',
    ur: 'سروس شروع کریں ➔'
  },
  more_languages: {
    en: 'More Languages',
    hi: 'अन्य भाषाएं',
    bn: 'আরও ভাষা',
    mr: 'इतर भाषा',
    ta: 'மேலும் மொழிகள்',
    te: 'మరిన్ని భాషలు',
    gu: 'વધુ ભાષાઓ',
    kn: 'ಇನ್ನಷ್ಟು ಭಾಷೆಗಳು',
    ml: 'കൂടുതൽ ഭാഷകൾ',
    pa: 'ਹੋਰ ਭਾਸ਼ਾਵਾਂ',
    or: 'ଅଧିକ ଭାଷା',
    mai: 'आन भाषा सभ',
    bho: 'अउर भाषा',
    as: 'অধিক ভাষা',
    ur: 'مزید زبانیں'
  },

  // ── Language Selection Modal (IRCTC Alert Inspired) ──
  modal_alert_title: {
    en: 'Alert • Language Selection',
    hi: 'सूचना • भाषा चयन',
    bn: 'সতর্কতা • ভাষা নির্বাচন',
    mr: 'सूचना • भाषा निवड',
    ta: 'எச்சரிக்கை • மொழி தேர்வு',
    te: 'హెచ్చరిక • భాష ఎంపిక',
    gu: 'ચેતવણી • ભાષા પસંદગી',
    kn: 'ಎಚ್ಚರಿಕೆ • ಭಾಷೆ ಆಯ್ಕೆ',
    ml: 'അറിയിപ്പ് • ഭാഷ തിരഞ്ഞെടുക്കൽ',
    pa: 'ਚੇਤਾਵਨੀ • ਭਾਸ਼ਾ ਚੋਣ',
    or: 'ସୂଚନା • ଭାଷା ଚୟନ',
    mai: 'सूचना • भाषा चयन',
    bho: 'सूचना • भाषा चुनीं',
    as: 'সতৰ্কবাৰ্তা • ভাষা বাছনি',
    ur: 'اطلاع • زبان کا انتخاب'
  },
  modal_welcome_title: {
    en: 'Welcome to Citizen-Service Agent',
    hi: 'नागरिक सेवा सहायक में आपका स्वागत है',
    bn: 'সিটিজেন-সার্ভিস এজেন্টে আপনাকে স্বাগতম',
    mr: 'नागरिक सेवा सहाय्यकमध्ये आपले स्वागत आहे',
    ta: 'குடிமக்கள் சேவை முகவருக்கு உங்களை வரவேற்கிறோம்',
    te: 'సిటిజెన్-సర్వీస్ ఏజెంట్‌కు స్వాగతం',
    gu: 'સિટિઝન-સર્વિસ એજન્ટમાં આપનું સ્વાગત છે',
    kn: 'ಸಿಟಿಜನ್-ಸರ್ವೀಸ್ ಏಜೆಂಟ್‌ಗೆ ಸ್ವಾಗತ',
    ml: 'സിറ്റിസൺ-സർവീസ് ഏജന്റിലേക്ക് സ്വാഗതം',
    pa: 'ਸਿਟੀਜ਼ਨ-ਸਰਵਿਸ ਏਜੰਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    or: 'ସିଟିଜେନ୍-ସର୍ଭିସ ଏଜେଣ୍ଟକୁ ସ୍ୱାଗତ',
    mai: 'नागरिक सेवा सहायक में अहाँक स्वागत अछि',
    bho: 'नागरिक सेवा सहायक में राउर स्वागत बा',
    as: 'চিটিজেন-চাৰ্ভিছ এজেন্টলৈ আপোনাক স্বাগতম',
    ur: 'سٹیزن سروس ایجنٹ میں خوش آمدید'
  },
  modal_select_prompt: {
    en: 'Please select your preferred language',
    hi: 'कृपया अपनी पसंदीदा भाषा का चयन करें',
    bn: 'অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন',
    mr: 'कृपया आपली पसंतीची भाषा निवडा',
    ta: 'தயவுசெய்து உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    te: 'దయచేసి మీకు నచ్చిన భాషను ఎంచుకోండి',
    gu: 'કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഭാഷ തിരഞ്ഞെടുക്കുക',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ',
    mai: 'कृपा क\' अपन मनपसंद भाषा चुनू',
    bho: 'कृपा क\'के आपन मनपसंद भाषा चुनीं',
    as: 'অনুগ্ৰহ কৰি আপোনাৰ পছন্দৰ ভাষা বাছক',
    ur: 'براہ کرم اپنی پسندیدہ زبان منتخب کریں'
  },
  modal_active_badge: {
    en: 'Active Language',
    hi: 'सक्रिय भाषा',
    bn: 'সক্রিয় ভাষা',
    mr: 'सक्रिय भाषा',
    ta: 'செயலில் உள்ள மொழி',
    te: 'యాక్టివ్ భాష',
    gu: 'સક્રિય ભાષા',
    kn: 'ಸಕ್ರಿಯ ಭಾಷೆ',
    ml: 'നിലവിലെ ഭാഷ',
    pa: 'ਸਰਗਰਮ ਭਾਸ਼ਾ',
    or: 'ସକ୍ରିୟ ଭାଷା',
    mai: 'सक्रिय भाषा',
    bho: 'चालू भाषा',
    as: 'সক্ৰিয় ভাষা',
    ur: 'فعال زبان'
  },
  btn_confirm_lang: {
    en: 'Continue / Apply',
    hi: 'आगे बढ़ें / लागू करें',
    bn: 'এগিয়ে যান',
    mr: 'पुढे चला',
    ta: 'தொடரவும்',
    te: 'కొనసాగించండి',
    gu: 'આગળ વધો',
    kn: 'ಮುಂದುವರಿಯಿರಿ',
    ml: 'തുടരുക',
    pa: 'ਜਾਰੀ ਰੱਖੋ',
    or: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
    mai: 'आगाँ बढ़ू',
    bho: 'आगे बढ़ीं',
    as: 'আগলৈ যাওক',
    ur: 'آگے بڑھیں'
  },
  btn_close: {
    en: 'Close',
    hi: 'बंद करें',
    bn: 'বন্ধ করুন',
    mr: 'बंद करा',
    ta: 'மூடு',
    te: 'మూసివేయి',
    gu: 'બંધ કરો',
    kn: 'ಮುಚ್ಚಿ',
    ml: 'അടയ്ക്കുക',
    pa: 'ਬੰਦ ਕਰੋ',
    or: 'ବନ୍ଦ କରନ୍ତୁ',
    mai: 'बंद करू',
    bho: 'बंद करीं',
    as: 'বন্ধ কৰক',
    ur: 'بند کریں'
  },

  // ── Hero Section ──
  hero_badge: {
    en: 'CivicAgent',
    hi: 'नागरिक सेवा साथी',
    bn: 'সিভিক এজেন্ট',
    mr: 'नागरी सहाय्यक',
    ta: 'குடிமக்கள் வழிகாட்டி',
    te: 'సివిక్ ఏజెంట్',
    gu: 'સિવિક એજન્ટ',
    kn: 'ಸಿವಿಕ್ ಏಜೆಂಟ್',
    ml: 'സിവിക് ഏജന്റ്',
    pa: 'ਸਿਵਿਕ ਏਜੰਟ',
    or: 'ସିଭିକ୍ ଏଜେଣ୍ଟ',
    mai: 'नागरिक साथी',
    bho: 'नागरिक साथी',
    as: 'চিভিক এজেন্ট',
    ur: 'عوامی ساتھی'
  },
  hero_pill_text: {
    en: 'One place to navigate government services with confidence',
    hi: 'सरकारी सेवाओं को बिना किसी परेशानी के पूरा करने का एकमात्र मंच',
    bn: 'সরকারি পরিষেবা আত্মবিশ্বাসের সাথে সম্পন্ন করার এক প্ল্যাটফর্ম',
    mr: 'शासकीय सेवा आत्मविश्वासाने पूर्ण करण्याचे एकमेव व्यासपीठ',
    ta: 'அரசு சேவைகளை நம்பிக்கையுடன் பெற ஒரே தளம்',
    te: 'ప్రభుత్వ సేవలను నమ్మకంగా పూర్తి చేసుకునే ఏకైక వేదిక',
    gu: 'સરકારી સેવાઓ આત્મવિશ્વાસ સાથે મેળવવાનું એકમાત્ર પ્લેટફોર્મ',
    kn: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಪಡೆಯಲು ಒಂದು ವೇದಿಕೆ',
    ml: 'സർക്കാർ സേവനങ്ങൾ ആത്മവിശ്വാസത്തോടെ നേടാൻ ഒരൊറ്റ ഇടം',
    pa: 'ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਪੂਰਾ ਕਰਨ ਦਾ ਸਾਂਝਾ ਮੰਚ',
    or: 'ଆତ୍ମବିଶ୍ୱାସର ସହିତ ସରକାରୀ ସେବା ପାଇବାର ଏକମାତ୍ର ମଞ୍ଚ',
    mai: 'सरकारी सेवाकेँ विश्वासपूर्वक पूरा करवाक मंच',
    bho: 'सरकारी काम बिना कवनो झंझट के पूरा करे के मंच',
    as: 'চৰকাৰী সেৱাসমূহ সহজে লাভ কৰাৰ মঞ্চ',
    ur: 'سرکاری خدمات کو اعتماد کے ساتھ مکمل کرنے کا واحد پلیٹ فارم'
  },
  hero_heading: {
    en: 'Government Services, Made Simple.',
    hi: 'सरकारी सेवाएं, अब आसान और सुगम।',
    bn: 'সরকারি পরিষেবা, এখন অত্যন্ত সহজ।',
    mr: 'शासकीय सेवा, आता सोप्या आणि सहज।',
    ta: 'அரசு சேவைகள், இனி மிக எளியது.',
    te: 'ప్రభుత్వ సేవలు, ఇప్పుడు చాలా సులభం.',
    gu: 'સરકારી સેવાઓ, હવે સાવ સરળ.',
    kn: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ಈಗ ಅತ್ಯಂತ ಸರಳ.',
    ml: 'സർക്കാർ സേവനങ്ങൾ, ഇപ്പോൾ എളുപ്പം.',
    pa: 'ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਹੁਣ ਬਹੁਤ ਆਸਾਨ।',
    or: 'ସରକାରୀ ସେବା, ଏବେ ସହଜ ଓ ସୁଲଭ।',
    mai: 'सरकारी सेवा, आब सरल आ सहज।',
    bho: 'सरकारी काम, अब बहुत आसान।',
    as: 'চৰকাৰী সেৱা, এতিয়া সহজ।',
    ur: 'سرکاری خدمات، اب انتہائی آسان۔'
  },
  hero_subheading: {
    en: "Tell us what you need. We'll guide you through the documents, forms and application process — step by step.",
    hi: 'हमें बताएं कि आपको क्या चाहिए। हम आपको आवश्यक दस्तावेज, फॉर्म और पूरी आवेदन प्रक्रिया में कदम-दर-कदम मार्गदर्शन करेंगे।',
    bn: 'আপনার কী প্রয়োজন জানান। আমরা নথি, ফর্ম এবং সম্পূর্ণ আবেদন প্রক্রিয়ায় আপনাকে ধাপে ধাপে সাহায্য করব।',
    mr: 'तुम्हाला कोणती सेवा हवी आहे ते सांगा. आम्ही कागदपत्रे, अर्ज आणि संपूर्ण प्रक्रियेत तुम्हाला मार्गदर्शन करू.',
    ta: 'உங்களுக்கு என்ன சேவை வேண்டும் என்று கூறுங்கள். ஆவணங்கள் மற்றும் விண்ணப்ப செயல்முறையில் உங்களுக்கு வழிகாட்டுவோம்.',
    te: 'మీకు ఏమి కావాలో చెప్పండి. మేము పత్రాలు, దరఖాస్తు ప్రక్రియ ద్వారా మీకు దశలవారీగా మార్గదర్శనం చేస్తాము.',
    gu: 'તમને શું જોઈએ છે તે જણાવો. અમે તમને દસ્તાવેજો અને અરજી પ્રક્રિયામાં પગલે પગલે માર્ગદર્શન આપીશું.',
    kn: 'ನಿಮಗೆ ಏನು ಬೇಕು ಎಂದು ತಿಳಿಸಿ. ನಾವು ದಾಖಲೆಗಳು ಮತ್ತು ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಹಂತ-ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇವೆ.',
    ml: 'നിങ്ങൾക്ക് എന്താണ് വേണ്ടതെന്ന് പറയുക. രേഖകളും അപേക്ഷാ പ്രക്രിയയും ഘട്ടം ഘട്ടമായി ഞങ്ങൾ നിങ്ങളെ നയിക്കും.',
    pa: 'ਦੱਸੋ ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ। ਅਸੀਂ ਦਸਤਾਵੇਜ਼ਾਂ ਅਤੇ ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਕਦਮ-ਦਰ-ਕਦਮ ਤੁਹਾਡੀ ਅਗਵਾਈ ਕਰਾਂਗੇ।',
    or: 'ଆପଣଙ୍କର କଣ ଆବଶ୍ୟକ କୁହନ୍ତୁ। ଆମେ ଦଲିଲ ଏବଂ ଆବେଦନ ପ୍ରକ୍ରିୟାରେ ପ୍ରତି ପଦକ୍ଷେପରେ ସହାୟତା କରିବୁ।',
    mai: 'अहाँकेँ की चाही से कहू। हम कागजात आ आवेदन प्रक्रियामे पाइल-पाइल मदद करब।',
    bho: 'बताईं रउवा के का चाहीं। हम दस्तावेज अउर फॉर्म भरे में एक-एक कदम पर मदद करब।',
    as: 'আপোনাক কি প্ৰয়োজন কওক। আমি প্ৰতিটো পদক্ষেপতে আপোনাক সহায় কৰিম।',
    ur: 'ہمیں بتائیں آپ کو کیا چاہیے۔ ہم دستاویزات اور درخواست کے عمل میں مرحلہ وار آپ کی رہنمائی کریں گے۔'
  },
  search_placeholder: {
    en: 'What government service do you need? (e.g. Income Certificate, Scholarship)',
    hi: 'आपको किस सरकारी सेवा की आवश्यकता है? (उदा. आय प्रमाण पत्र, छात्रवृत्ति)',
    bn: 'আপনার কোন সরকারি পরিষেবা দরকার? (যেমন: আয়ের প্রশংসাপত্র, স্কলারশিপ)',
    mr: 'तुम्हाला कोणती सरकारी सेवा हवी आहे? (उदा. उत्पन्न प्रमाणपत्र, शिष्यवृत्ती)',
    ta: 'உங்களுக்கு என்ன அரசு சேவை தேவை? (எ.கா: வருமானச் சான்றிதழ், உதவித்தொகை)',
    te: 'మీకు ఏ ప్రభుత్వ సేవ కావాలి? (ఉదా. ఆదాయ ధృవీకరణ పత్రం, స్కాలర్‌షిప్)',
    gu: 'તમને કઈ સરકારી સેવાની જરૂર છે? (દા.ત. આવકનો દાખલો, શિષ્યવૃત્તિ)',
    kn: 'ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಸೇವೆ ಬೇಕು? (ಉದಾ. ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ವಿದ್ಯಾರ್ಥಿವೇತನ)',
    ml: 'നിങ്ങൾക്ക് ഏത് സർക്കാർ സേവനമാണ് വേണ്ടത്? (ഉദാ: വരുമാന സർട്ടിഫിക്കറ്റ്)',
    pa: 'ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਸਰਕਾਰੀ ਸੇਵਾ ਦੀ ਲੋੜ ਹੈ? (ਜਿਵੇਂ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ)',
    or: 'ଆପଣଙ୍କୁ କେଉଁ ସରକାରୀ ସେବା ଦରକାର? (ଯଥା: ଆୟ ପ୍ରମାଣପତ୍ର, ବୃତ୍ତି)',
    mai: 'अहाँकेँ कोण सरकारी सेवा चाही? (उदा. आय प्रमाण पत्र, छात्रवृत्ति)',
    bho: 'रउवा कवन सरकारी सेवा चाहीं? (जैसे आय प्रमाण पत्र, छात्रवृत्ति)',
    as: 'আপোনাক কি চৰকাৰী সেৱা প্ৰয়োজন? (যেনে: আয়ৰ প্ৰমাণপত্ৰ, জলপানী)',
    ur: 'آپ کو کس سرکاری سروس کی ضرورت ہے؟ (جیسے آمدنی سرٹیفکیٹ، اسکالرشپ)'
  },
  search_btn: {
    en: 'Start ➔',
    hi: 'शुरू करें ➔',
    bn: 'শুরু ➔',
    mr: 'सुरू करा ➔',
    ta: 'தொடங்கு ➔',
    te: 'ప్రారంభం ➔',
    gu: 'શરૂ કરો ➔',
    kn: 'ಪ್ರಾರಂಭ ➔',
    ml: 'തുടങ്ങുക ➔',
    pa: 'ਸ਼ੁਰੂ ➔',
    or: 'ଆରମ୍ଭ ➔',
    mai: 'शुरू करू ➔',
    bho: 'शुरू करीं ➔',
    as: 'আৰম্ভ ➔',
    ur: 'شروع ➔'
  },
  popular_searches: {
    en: 'Popular searches:',
    hi: 'लोकप्रिय खोजें:',
    bn: 'জনপ্রিয় অনুসন্ধান:',
    mr: 'लोकप्रिय शोध:',
    ta: 'பிரபலமான தேடல்கள்:',
    te: 'ప్రజాదరణ పొందిన శోధనలు:',
    gu: 'લોકપ્રિય શોધો:',
    kn: 'ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು:',
    ml: 'ജനപ്രിയ തിരച്ചിലുകൾ:',
    pa: 'ਪ੍ਰਸਿੱਧ ਖੋਜਾਂ:',
    or: 'ଲୋକପ୍ରିୟ ସନ୍ଧାନ:',
    mai: 'लोकप्रिय खोज सभ:',
    bho: 'ज्यादा खोजल जाए वाला:',
    as: 'জনপ্ৰিয় সন্ধান:',
    ur: 'مقبول تلاشیں:'
  },

  // ── Services Section ──
  sec_popular_title: {
    en: 'Popular Citizen Services',
    hi: 'लोकप्रिय नागरिक सेवाएं',
    bn: 'জনপ্রিয় নাগরিক পরিষেবা',
    mr: 'लोकप्रिय नागरी सेवा',
    ta: 'பிரபலமான குடிமக்கள் சேவைகள்',
    te: 'ప్రజాదరణ పొందిన పౌర సేవలు',
    gu: 'લોકપ્રિય નાગરિક સેવાઓ',
    kn: 'ಜನಪ್ರಿಯ ನಾಗರಿಕ ಸೇವೆಗಳು',
    ml: 'ജനപ്രിയ പൗര സേവനങ്ങൾ',
    pa: 'ਪ੍ਰਸਿੱਧ ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ',
    or: 'ଲୋକପ୍ରିୟ ନାଗରିକ ସେବାସମୂହ',
    mai: 'लोकप्रिय नागरिक सेवा सभ',
    bho: 'लोकप्रिय नागरिक सेवा',
    as: 'জনপ্ৰিয় নাগৰিক সেৱাসমূহ',
    ur: 'مقبول عوامی خدمات'
  },
  sec_popular_sub: {
    en: 'Direct government welfare schemes with zero intermediary fees and statutory pre-validation',
    hi: 'शून्य बिचौलिया शुल्क और वैधानिक पूर्व-सत्यापन के साथ सीधी सरकारी कल्याणकारी योजनाएं',
    bn: 'কোনো দালালি ফি ছাড়া সরাসরি সরকারি কল্যাণমূলক পরিষেবা',
    mr: 'कोणतेही मध्यस्थ शुल्क नसलेल्या थेट शासकीय कल्याणकारी योजना',
    ta: 'இடைத்தரகர் கட்டணமின்றி நேரடி அரசு நலத்திட்டங்கள்',
    te: 'దళారీ రుసుము లేకుండా ప్రత్యక్ష ప్రభుత్వ సంక్షేమ పథకాలు',
    gu: 'કોઈપણ દલાલી ફી વિના સીધી સરકારી યોજનાઓ',
    kn: 'ಮಧ್ಯವರ್ತಿ ಶುಲ್ಕವಿಲ್ಲದೆ ನೇರ ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
    ml: 'ഇടനിലക്കാരില്ലാതെ നേരിട്ടുള്ള സർക്കാർ ക്ഷേമ പദ്ധതികൾ',
    pa: 'ਜ਼ੀਰੋ ਵਿਚੋਲਗੀ ਫੀਸ ਨਾਲ ਸਿੱਧੀਆਂ ਸਰਕਾਰੀ ਭਲਾਈ ਸਕੀਮਾਂ',
    or: 'ବିନା ଦଲାଲ ଫି ରେ ପ୍ରତ୍ୟକ୍ଷ ସରକାରୀ ଯୋଜନା',
    mai: 'बिना ककरो दलाली शुल्क के प्रत्यक्ष सरकारी योजना',
    bho: 'बिना कवनो दलाली के सरकारी योजना',
    as: 'কোনো মধ্যভোগী নোহোৱাকৈ চৰকাৰী আঁচনি',
    ur: 'بغیر کسی رشوت کے براہ راست سرکاری فلاحی اسکیمیں'
  },
  apply_now: {
    en: 'Apply with AI Agent ➔',
    hi: 'AI सहायक से आवेदन करें ➔',
    bn: 'AI এজেন্টের মাধ্যমে আবেদন ➔',
    mr: 'AI सहाय्यकासह अर्ज करा ➔',
    ta: 'AI உதவியுடன் விண்ணப்பிக்கவும் ➔',
    te: 'AI ఏజెంట్‌తో దరఖాస్తు చేయండి ➔',
    gu: 'AI એજન્ટ સાથે અરજી કરો ➔',
    kn: 'AI ಏಜೆಂಟ್‌ನೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ➔',
    ml: 'AI ഏജന്റ് വഴി അപേക്ഷിക്കുക ➔',
    pa: 'AI ਏਜੰਟ ਨਾਲ ਅਰਜ਼ੀ ਦਿਓ ➔',
    or: 'AI ଏଜେଣ୍ଟ ସହାୟତାରେ ଆବେଦନ କରନ୍ତୁ ➔',
    mai: 'AI सहायक सँ आवेदन करू ➔',
    bho: 'AI एजेंट से फॉर्म भरीं ➔',
    as: 'AI এজেন্টৰ দ্বাৰা আবেদন কৰক ➔',
    ur: 'AI ایجنٹ کے ساتھ اپلائی کریں ➔'
  },
  service_income_title: {
    en: 'Income Certificate (आय प्रमाण पत्र)',
    hi: 'आय प्रमाण पत्र (Income Certificate)',
    bn: 'আয়ের প্রশংসাপত্র (Income Certificate)',
    mr: 'उत्पन्न प्रमाणपत्र (Income Certificate)',
    ta: 'வருமானச் சான்றிதழ் (Income Certificate)',
    te: 'ఆదాయ ధృవీకరణ పత్రం (Income Certificate)',
    gu: 'આવકનો દાખલો (Income Certificate)',
    kn: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (Income Certificate)',
    ml: 'വരുമാന സർട്ടിഫിക്കറ്റ് (Income Certificate)',
    pa: 'ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ (Income Certificate)',
    or: 'ଆୟ ପ୍ରମାଣପତ୍ର (Income Certificate)',
    mai: 'आय प्रमाण पत्र (Income Certificate)',
    bho: 'आय प्रमाण पत्र (Income Certificate)',
    as: 'আয়ৰ প্ৰমাণপত্ৰ (Income Certificate)',
    ur: 'آمدنی سرٹیفکیٹ (Income Certificate)'
  },
  service_scholarship_title: {
    en: 'Post-Matric Scholarship (छात्रवृत्ति)',
    hi: 'पोस्ट-मैट्रिक छात्रवृत्ति (Scholarship)',
    bn: 'পোস্ট-ম্যাট্রিক স্কলারশিপ (Scholarship)',
    mr: 'मॅट्रिकोत्तर शिष्यवृत्ती (Scholarship)',
    ta: 'மெಟ್ರிக் பிந்தைய உதவித்தொகை',
    te: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్',
    gu: 'પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ',
    kn: 'ಮೆಟ್ರಿಕ್ ನಂತರದ ವಿದ್ಯಾರ್ಥಿವೇತನ',
    ml: 'പോസ്റ്റ്-മെട്രിക് സ്കോളർഷിപ്പ്',
    pa: 'ਪੋਸਟ-ਮੈਟ੍ਰਿਕ ਸਕਾਲਰਸ਼ਿਪ',
    or: 'ପୋଷ୍ଟ-ମାଟ୍ରିକ ବୃତ୍ତି',
    mai: 'पोस्ट-मैट्रिक छात्रवृत्ति',
    bho: 'छात्रवृत्ति (Scholarship)',
    as: 'মেট্ৰিক উত্তৰ জলপানী',
    ur: 'پوسٹ میٹرک اسکالرشپ'
  },

  // ── Document Checklist & Uploads ──
  doc_verification_title: {
    en: 'Document Verification',
    hi: 'दस्तावेज सत्यापन',
    bn: 'নথি যাচাইকরণ',
    mr: 'कागदपत्र पडताळणी',
    ta: 'ஆவண சரிபார்ப்பு',
    te: 'పత్రాల పరిశీలన',
    gu: 'દસ્તાવેજ ચકાસણી',
    kn: 'ದಾಖಲೆ ಪರಿಶೀಲನೆ',
    ml: 'രേഖകളുടെ പരിശോധന',
    pa: 'ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ',
    or: 'ଦଲିଲ ଯାଞ୍ଚ',
    mai: 'कागजात सत्यापन',
    bho: 'दस्तावेज जांच',
    as: 'নথি সত্যাপন',
    ur: 'دستاویزات کی تصدیق'
  },
  doc_upload_btn: {
    en: 'Upload Document 📷',
    hi: 'दस्तावेज अपलोड करें 📷',
    bn: 'নথি আপলোড করুন 📷',
    mr: 'कागदपत्र अपलोड करा 📷',
    ta: 'ஆவணத்தைப் பதிவேற்றவும் 📷',
    te: 'పత్రాన్ని అప్‌లోడ్ చేయండి 📷',
    gu: 'દસ્તાવેજ અપલોડ કરો 📷',
    kn: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ 📷',
    ml: 'രേഖ അപ്‌ലോഡ് ചെയ്യുക 📷',
    pa: 'ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ 📷',
    or: 'ଦଲିଲ ଅପଲୋଡ୍ କରନ୍ତୁ 📷',
    mai: 'कागजात अपलोड करू 📷',
    bho: 'दस्तावेज अपलोड करीं 📷',
    as: 'নথি আপলোড কৰক 📷',
    ur: 'دستاویز اپ لوڈ کریں 📷'
  },

  // ── Consent & Trust ──
  consent_modal_header: {
    en: 'Explicit Citizen Consent Required',
    hi: 'नागरिक की स्पष्ट सहमति आवश्यक है',
    bn: 'নাগরিকের স্পষ্ট সম্মতি প্রয়োজন',
    mr: 'नागरिकांची स्पष्ट संमती आवश्यक',
    ta: 'குடிமக்களின் தெளிவான ஒப்புதல் தேவை',
    te: 'పౌరుడి స్పష్టమైన సమ్మతి అవసరం',
    gu: 'નાગરિકની સ્પષ્ટ સંમતિ જરૂરી છે',
    kn: 'ನಾಗರಿಕರ ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ',
    ml: 'പൗരന്റെ വ്യക്തമായ സമ്മതം ആവശ്യമാണ്',
    pa: 'ਨਾਗਰਿਕ ਦੀ ਸਪੱਸ਼ਟ ਸਹਿਮਤੀ ਲੋੜੀਂਦੀ ਹੈ',
    or: 'ନାଗରିକଙ୍କ ସ୍ପଷ୍ଟ ସମ୍ମତି ଆବଶ୍ୟକ',
    mai: 'नागरिकक स्पष्ट सहमति आवश्यक अछि',
    bho: 'नागरिक के साफ़ सहमति जरूरी बा',
    as: 'নাগৰিকৰ স্পষ্ট সন্মতি প্ৰয়োজন',
    ur: 'شہری کی واضح رضامندی درکار ہے'
  },
  consent_give_btn: {
    en: 'I Grant Consent / सहमति दें',
    hi: 'मैं सहमति देता हूँ (स्वीकार करें)',
    bn: 'আমি সম্মতি দিচ্ছি',
    mr: 'मी संमती देतो',
    ta: 'நான் ஒப்புதல் அளிக்கிறேன்',
    te: 'నేను సమ్మతి ఇస్తున్నాను',
    gu: 'હું સંમતિ આપું છું',
    kn: 'ನಾನು ಒಪ್ಪಿಗೆ ನೀಡುತ್ತೇನೆ',
    ml: 'ഞാൻ സമ്മതം നൽകുന്നു',
    pa: 'ਮੈਂ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ',
    or: 'ମୁଁ ସମ୍ମତି ଦେଉଛି',
    mai: 'हम सहमति दैत छी',
    bho: 'हम सहमति देत बानी',
    as: 'মই সন্মতি জনালোঁ',
    ur: 'میں رضامندی دیتا ہوں'
  },
  consent_deny_btn: {
    en: 'Deny Consent / अस्वीकार करें',
    hi: 'सहमति अस्वीकार करें',
    bn: 'অস্বীকার করুন',
    mr: 'संमती नाकारा',
    ta: 'நிராகரி',
    te: 'తిరస్కరించండి',
    gu: 'અસ્વીકાર કરો',
    kn: 'ತಿರಸ್ಕರಿಸಿ',
    ml: 'നിരസിക്കുക',
    pa: 'ਇਨਕਾਰ ਕਰੋ',
    or: 'ଅସ୍ୱୀକାର କରନ୍ତୁ',
    mai: 'अस्वीकार करू',
    bho: 'इनकार करीं',
    as: 'অস্বীকাৰ কৰক',
    ur: 'رد کریں'
  }
};

// ── i18n Engine ──────────────────────────────────────────────────────────────
class CivicI18n {
  constructor() {
    this.currentLang = this.getSavedLanguage() || 'en';
    this.listeners = [];
  }

  getSavedLanguage() {
    try {
      return localStorage.getItem('civic_agent_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  }

  setLanguage(langCode) {
    const valid = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (!valid) {
      console.warn(`[i18n] Unknown language code: ${langCode}, fallback to 'en'`);
      langCode = 'en';
    }
    this.currentLang = langCode;
    try {
      localStorage.setItem('civic_agent_lang', langCode);
    } catch (e) {}

    // Update document attributes
    document.documentElement.lang = langCode;
    if (langCode === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Apply translations to the entire DOM
    this.translateDOM();
    this.updateHeaderLanguageUI();
    this.updateLanguageModalUI();

    // Trigger registered callback listeners
    this.listeners.forEach(fn => {
      try { fn(langCode); } catch (err) { console.error('[i18n] listener err', err); }
    });

    console.log(`[i18n] Language switched to: ${valid ? valid.name : langCode} (${langCode})`);
  }

  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  t(key, params = {}) {
    const entry = TRANSLATIONS[key];
    let text = '';
    if (entry) {
      text = entry[this.currentLang] || entry['en'] || key;
    } else {
      text = key;
    }

    // Interpolate {param}
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      });
    }
    return text;
  }

  translateDOM() {
    // 1. Text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // 2. Input placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = this.t(key);
      }
    });

    // 3. Titles / Aria labels with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = this.t(key);
        el.setAttribute('aria-label', this.t(key));
      }
    });

    // 4. Update specific well-known IDs
    this.updateKnownElements();
  }

  updateKnownElements() {
    // Announcement bar
    const annText = document.getElementById('t-announcement-text');
    if (annText) annText.textContent = this.t('announcement_text');

    const logoSub = document.getElementById('t-logo-sub');
    if (logoSub) logoSub.textContent = this.t('logo_tagline');

    const heroHead = document.getElementById('t-hero-heading');
    if (heroHead) heroHead.textContent = this.t('hero_heading');

    const heroSub = document.getElementById('t-hero-subheading');
    if (heroSub) heroSub.textContent = this.t('hero_subheading');

    const searchInp = document.getElementById('aiSearchInput');
    if (searchInp) searchInp.placeholder = this.t('search_placeholder');

    const navHome = document.getElementById('nav-home');
    if (navHome) navHome.textContent = this.t('nav_home');

    const navServices = document.getElementById('nav-services');
    if (navServices) navServices.textContent = this.t('nav_services');

    const navApps = document.getElementById('nav-applications');
    if (navApps) navApps.textContent = this.t('nav_applications');

    const navTrack = document.getElementById('nav-track');
    if (navTrack) navTrack.textContent = this.t('nav_track');

    const navHelp = document.getElementById('nav-help');
    if (navHelp) navHelp.textContent = this.t('nav_help');

    const navPrivacy = document.getElementById('nav-privacy');
    if (navPrivacy) navPrivacy.textContent = this.t('nav_privacy');

    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) navAdmin.textContent = this.t('nav_admin');
  }

  updateHeaderLanguageUI() {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang) || SUPPORTED_LANGUAGES[0];
    
    // Update header active language button text
    const activeBtn = document.getElementById('currentLangBtnText');
    if (activeBtn) {
      activeBtn.textContent = `${langObj.nativeName} (${langObj.code.toUpperCase()})`;
    }

    const moreBtn = document.getElementById('moreLangBtnText');
    if (moreBtn) {
      moreBtn.textContent = this.t('more_languages');
    }

    // Keep language select pill in sync if present
    const legacySelect = document.getElementById('langSelect');
    if (legacySelect && legacySelect.value !== this.currentLang) {
      legacySelect.value = this.currentLang;
    }
    if (typeof updateLangPillLabel === 'function') {
      updateLangPillLabel(this.currentLang);
    }
  }

  updateLanguageModalUI() {
    // Bilingual modal headings: Native/Hindi on top, English below
    const titleHi = document.getElementById('langModalTitleHi');
    if (titleHi) {
      const hiEntry = TRANSLATIONS['modal_welcome_title'];
      titleHi.textContent = (hiEntry && (hiEntry[this.currentLang] || hiEntry['hi'])) || 'नागरिक सेवा सहायक में आपका स्वागत है';
    }

    const promptHi = document.getElementById('langModalPromptHi');
    if (promptHi) {
      const promptEntry = TRANSLATIONS['modal_select_prompt'];
      promptHi.textContent = (promptEntry && (promptEntry[this.currentLang] || promptEntry['hi'])) || 'कृपया अपनी पसंदीदा भाषा का चयन करें';
    }

    // Update active highlight in the modal cards
    document.querySelectorAll('.lang-grid-card').forEach(card => {
      const cardLang = card.getAttribute('data-lang-code');
      if (cardLang === this.currentLang) {
        card.classList.add('active');
        const badge = card.querySelector('.lang-active-check');
        if (badge) badge.style.display = 'inline-flex';
      } else {
        card.classList.remove('active');
        const badge = card.querySelector('.lang-active-check');
        if (badge) badge.style.display = 'none';
      }
    });

    // Update quick buttons
    document.querySelectorAll('.quick-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang-code');
      if (btnLang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Global instance
const civicI18n = new CivicI18n();

// ── Global Helper Functions for Window Scope ─────────────────────────────────
function t(key, params) {
  return civicI18n.t(key, params);
}

function changeLanguage(langCode) {
  civicI18n.setLanguage(langCode);
}

function toggleMoreLanguages() {
  const section = document.getElementById('moreLanguagesSection');
  const title = document.getElementById('moreLangBtnTitle');
  const sub = document.getElementById('moreLangBtnSub');
  const btn = document.getElementById('btnToggleMoreLang');
  if (!section) return;

  const isHidden = section.style.display === 'none' || section.style.display === '';
  if (isHidden) {
    section.style.display = 'block';
    if (title) title.textContent = '▲ Less';
    if (sub) sub.textContent = 'Languages';
    if (btn) btn.classList.add('active');
  } else {
    section.style.display = 'none';
    if (title) title.textContent = '🌐 More';
    if (sub) sub.textContent = 'Languages ▾';
    if (btn) btn.classList.remove('active');
  }
}

function openLanguageModal() {
  const modal = document.getElementById('languageSelectionModal');
  if (modal) {
    // Reset more languages collapsible section on open
    const section = document.getElementById('moreLanguagesSection');
    const title = document.getElementById('moreLangBtnTitle');
    const sub = document.getElementById('moreLangBtnSub');
    const btn = document.getElementById('btnToggleMoreLang');
    if (section) section.style.display = 'none';
    if (title) title.textContent = '🌐 More';
    if (sub) sub.textContent = 'Languages ▾';
    if (btn) btn.classList.remove('active');

    modal.style.display = 'flex';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    civicI18n.updateLanguageModalUI();
  }
}

function closeLanguageModal() {
  const modal = document.getElementById('languageSelectionModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function selectLanguageAndClose(langCode) {
  civicI18n.setLanguage(langCode);
  closeLanguageModal();
  
  // Show brief toast confirmation in native language
  if (typeof showToast === 'function') {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    showToast(`🌐 ${langObj ? langObj.nativeName : langCode} selected / चयनित`, 'success');
  }
}

// Auto-initialize language on website open without blocking modal popup
document.addEventListener('DOMContentLoaded', () => {
  civicI18n.setLanguage(civicI18n.currentLang);

  // Keyboard listener: Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLanguageModal();
    }
  });
});

