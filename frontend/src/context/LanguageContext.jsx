import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const translations = {
    en: {
      // Navbar
      appName: 'SchemeSphere',
      home: 'Home',
      quiz: 'Find Schemes',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      profile: 'Profile',

      // Home page
      heroTitle: 'Discover Government Schemes For You',
      heroSubtitle: 'Answer a few simple questions to find schemes you are eligible for, easily.',
      findSchemesCTA: 'Find My Schemes',
      categories: 'Popular Categories',
      agriculture: 'Agriculture',
      education: 'Education',
      health: 'Healthcare',
      housing: 'Housing',

      // Quiz page
      quizTitle: 'Eligibility Questionnaire',
      quizStep: 'Step',
      quizOf: 'of',
      quizAge: 'What is your age?',
      quizGender: 'What is your gender?',
      quizIncome: 'What is your annual family income (₹)?',
      quizOccupation: 'What is your occupation?',
      quizState: 'Which state do you live in?',
      quizCategory: 'What is your social category?',
      next: 'Next',
      submit: 'Find Schemes',
      back: 'Back',
      selectGender: 'Select Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      selectOccupation: 'Select Occupation',
      student: 'Student',
      farmer: 'Farmer',
      business: 'Business / Self-Employed',
      salaried: 'Salaried Employee',
      unemployed: 'Unemployed',
      selectState: 'Select State',
      selectCategory: 'Select Category',

      // Results page
      resultsTitle: 'Your Matched Schemes',
      resultsSubtitle: 'Based on your profile, we found {count} schemes for you.',
      noResults: 'No schemes matched your profile.',
      retakeQuiz: 'Retake Quiz',
      matchScore: 'Match',
      benefits: 'Benefits',
      documents: 'Required Documents',
      applyNow: 'Apply Now',
      bookmark: 'Save',
      saved: 'Saved',
      loginToSave: 'Please login to save schemes.',
      analyzing: 'Analyzing your profile...',

      // Auth pages
      email: 'Email Address',
      password: 'Password',
      role: 'Role',
      citizen: 'Citizen',
      admin: 'Admin',
      name: 'Full Name',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',

      // Dashboard
      welcome: 'Welcome',
      savedSchemes: 'Saved Schemes',
      noSaved: 'You have not saved any schemes yet.',
      manageSavedSchemes: 'Manage your saved government schemes.',

      // Admin Dashboard
      adminDashboard: 'Admin Panel',
      addScheme: 'Add New Scheme',
      manageSchemes: 'Manage all government schemes.',
      schemeTitle: 'Scheme Title',
      department: 'Department',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      noSchemes: 'No schemes found.',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      schemeCategory: 'Category',
      schemeBenefits: 'Benefits Description',
      schemeDescription: 'Description',
      minAge: 'Minimum Age',
      maxAge: 'Maximum Age',
      genderEligibility: 'Gender Eligibility',
      anyGender: 'Any Gender',
      maxIncome: 'Max Annual Income (₹)',
      noIncomeCap: 'Leave blank or 0 for no income cap',
      requiredDocs: 'Required Documents (comma separated)',
      applicationUrl: 'Application URL',
      confirmDelete: 'Are you sure you want to delete this scheme?',
      addSuccess: 'Scheme added successfully!',
      deleteSuccess: 'Scheme deleted successfully.',
    },
    hi: {
      // Navbar
      appName: 'स्कीमस्फीयर',
      home: 'होम',
      quiz: 'योजनाएं खोजें',
      dashboard: 'डैशबोर्ड',
      login: 'लॉग इन',
      logout: 'लॉग आउट',
      register: 'पंजीकरण',
      profile: 'प्रोफ़ाइल',

      // Home page
      heroTitle: 'अपने लिए सरकारी योजनाएं खोजें',
      heroSubtitle: 'आप किन योजनाओं के पात्र हैं, यह जानने के लिए कुछ सरल प्रश्नों के उत्तर दें।',
      findSchemesCTA: 'मेरी योजनाएं खोजें',
      categories: 'लोकप्रिय श्रेणियां',
      agriculture: 'कृषि',
      education: 'शिक्षा',
      health: 'स्वास्थ्य',
      housing: 'आवास',

      // Quiz page
      quizTitle: 'पात्रता प्रश्नावली',
      quizStep: 'चरण',
      quizOf: 'में से',
      quizAge: 'आपकी उम्र क्या है?',
      quizGender: 'आपका लिंग क्या है?',
      quizIncome: 'आपकी वार्षिक पारिवारिक आय (₹) क्या है?',
      quizOccupation: 'आपका व्यवसाय क्या है?',
      quizState: 'आप किस राज्य में रहते हैं?',
      quizCategory: 'आपकी सामाजिक श्रेणी क्या है?',
      next: 'अगला',
      submit: 'योजनाएं खोजें',
      back: 'पीछे',
      selectGender: 'लिंग चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      selectOccupation: 'व्यवसाय चुनें',
      student: 'छात्र',
      farmer: 'किसान',
      business: 'व्यवसाय / स्वरोज़गार',
      salaried: 'वेतनभोगी कर्मचारी',
      unemployed: 'बेरोज़गार',
      selectState: 'राज्य चुनें',
      selectCategory: 'श्रेणी चुनें',

      // Results page
      resultsTitle: 'आपकी मिलती-जुलती योजनाएं',
      resultsSubtitle: 'आपकी प्रोफ़ाइल के आधार पर, हमें {count} योजनाएं मिलीं।',
      noResults: 'आपकी प्रोफ़ाइल से कोई योजना मेल नहीं खाई।',
      retakeQuiz: 'फिर से प्रश्नावली भरें',
      matchScore: 'मेल',
      benefits: 'लाभ',
      documents: 'आवश्यक दस्तावेज़',
      applyNow: 'अभी आवेदन करें',
      bookmark: 'सहेजें',
      saved: 'सहेजा गया',
      loginToSave: 'योजनाएं सहेजने के लिए लॉगिन करें।',
      analyzing: 'आपकी प्रोफ़ाइल का विश्लेषण...',

      // Auth pages
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      role: 'भूमिका',
      citizen: 'नागरिक',
      admin: 'प्रशासक',
      name: 'पूरा नाम',
      noAccount: 'खाता नहीं है?',
      haveAccount: 'पहले से खाता है?',

      // Dashboard
      welcome: 'स्वागत है',
      savedSchemes: 'सहेजी गई योजनाएं',
      noSaved: 'आपने अभी तक कोई योजना नहीं सहेजी है।',
      manageSavedSchemes: 'अपनी सहेजी गई सरकारी योजनाओं का प्रबंधन करें।',

      // Admin Dashboard
      adminDashboard: 'एडमिन पैनल',
      addScheme: 'नई योजना जोड़ें',
      manageSchemes: 'सभी सरकारी योजनाओं का प्रबंधन करें।',
      schemeTitle: 'योजना शीर्षक',
      department: 'विभाग',
      status: 'स्थिति',
      actions: 'कार्यवाही',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      noSchemes: 'कोई योजना नहीं मिली।',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      schemeCategory: 'श्रेणी',
      schemeBenefits: 'लाभ विवरण',
      schemeDescription: 'विवरण',
      minAge: 'न्यूनतम आयु',
      maxAge: 'अधिकतम आयु',
      genderEligibility: 'लिंग पात्रता',
      anyGender: 'कोई भी लिंग',
      maxIncome: 'अधिकतम वार्षिक आय (₹)',
      noIncomeCap: 'कोई आय सीमा नहीं के लिए खाली छोड़ें या 0 डालें',
      requiredDocs: 'आवश्यक दस्तावेज़ (अल्पविराम से अलग)',
      applicationUrl: 'आवेदन URL',
      confirmDelete: 'क्या आप इस योजना को हटाना चाहते हैं?',
      addSuccess: 'योजना सफलतापूर्वक जोड़ी गई!',
      deleteSuccess: 'योजना सफलतापूर्वक हटाई गई।',
    },
  };

  const t = (key) => {
    try {
      return translations[language]?.[key] || translations['en']?.[key] || key;
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
