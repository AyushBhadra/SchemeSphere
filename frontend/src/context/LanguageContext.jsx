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
      appName: 'SchemeSphere',
      home: 'Home',
      quiz: 'Find Schemes',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      heroTitle: 'Discover Government Schemes For You',
      heroSubtitle: 'Answer a few simple questions to find schemes you are eligible for, easily.',
      findSchemesCTA: 'Find My Schemes',
      categories: 'Popular Categories',
      agriculture: 'Agriculture',
      education: 'Education',
      health: 'Healthcare',
      housing: 'Housing',
      quizTitle: 'Eligibility Questionnaire',
      quizAge: 'What is your age?',
      quizGender: 'What is your gender?',
      quizIncome: 'What is your annual family income?',
      quizOccupation: 'What is your occupation?',
      quizState: 'Which state do you live in?',
      quizCategory: 'What is your social category?',
      next: 'Next',
      submit: 'Submit',
      back: 'Back',
      resultsTitle: 'Your Matched Schemes',
      matchScore: 'Match',
      benefits: 'Benefits',
      documents: 'Required Documents',
      applyNow: 'Apply Now',
      bookmark: 'Save',
      adminDashboard: 'Admin Panel',
      addScheme: 'Add New Scheme',
      email: 'Email Address',
      password: 'Password',
      role: 'Role',
      citizen: 'Citizen',
      admin: 'Admin',
      name: 'Full Name',
      welcome: 'Welcome',
      savedSchemes: 'Saved Schemes',
      noSaved: 'You have not saved any schemes yet.',
      delete: 'Delete',
      edit: 'Edit'
    },
    hi: {
      appName: 'योजनास्फीयर',
      home: 'होम',
      quiz: 'योजनाएं खोजें',
      dashboard: 'डैशबोर्ड',
      login: 'लॉग इन',
      logout: 'लॉग आउट',
      register: 'पंजीकरण',
      heroTitle: 'अपने लिए सरकारी योजनाएं खोजें',
      heroSubtitle: 'आप किन योजनाओं के पात्र हैं, यह जानने के लिए कुछ सरल प्रश्नों के उत्तर दें।',
      findSchemesCTA: 'मेरी योजनाएं खोजें',
      categories: 'लोकप्रिय श्रेणियां',
      agriculture: 'कृषि',
      education: 'शिक्षा',
      health: 'स्वास्थ्य',
      housing: 'आवास',
      quizTitle: 'पात्रता प्रश्नावली',
      quizAge: 'आपकी उम्र क्या है?',
      quizGender: 'आपका लिंग क्या है?',
      quizIncome: 'आपकी वार्षिक पारिवारिक आय क्या है?',
      quizOccupation: 'आपका व्यवसाय क्या है?',
      quizState: 'आप किस राज्य में रहते हैं?',
      quizCategory: 'आपकी सामाजिक श्रेणी क्या है?',
      next: 'अगला',
      submit: 'जमा करें',
      back: 'पीछे',
      resultsTitle: 'आपकी सुमेलित योजनाएं',
      matchScore: 'मेल',
      benefits: 'लाभ',
      documents: 'आवश्यक दस्तावेज',
      applyNow: 'अभी आवेदन करें',
      bookmark: 'सहेजें',
      adminDashboard: 'एडमिन पैनल',
      addScheme: 'नई योजना जोड़ें',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      role: 'भूमिका',
      citizen: 'नागरिक',
      admin: 'प्रशासक',
      name: 'पूरा नाम',
      welcome: 'स्वागत है',
      savedSchemes: 'सहेजी गई योजनाएं',
      noSaved: 'आपने अभी तक कोई योजना नहीं सहेजी है।',
      delete: 'हटाएं',
      edit: 'संपादित करें'
    },
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
