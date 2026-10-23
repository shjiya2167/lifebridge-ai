export interface TranslationStrings {
  appName: string;
  tagline: string;
  emergencyBannerTitle: string;
  emergencyBannerSubtitle: string;
  call112: string;
  call108: string;
  inputPlaceholder: string;
  startRecording: string;
  stopRecording: string;
  recording: string;
  uploadFiles: string;
  dragDrop: string;
  submitButton: string;
  analyzingButton: string;
  demoScenariosTitle: string;
  quickExamplesTitle: string;
  privacyNotice: string;
  urgencyTitle: string;
  keyFactsTitle: string;
  actionPlanTitle: string;
  verifiedSourcesTitle: string;
  officialResourcesTitle: string;
  warningsTitle: string;
  missingInfoTitle: string;
  medicalDisclaimerTitle: string;
  markCompleted: string;
  copyPlan: string;
  copied: string;
  printPlan: string;
  newInquiry: string;
  liveVerificationUnavailable: string;
  humanConfirmationNeeded: string;
  whyThisMatters: string;
  tabs: {
    home: string;
    resources: string;
    history: string;
    about: string;
  };
}

export const translations: Record<string, TranslationStrings> = {
  en: {
    appName: 'LifeBridge AI',
    tagline: 'Gemini-Powered Universal Public Assistance Platform',
    emergencyBannerTitle: 'Immediate Life Threat or Emergency?',
    emergencyBannerSubtitle: 'Dial 112 immediately across India for Police, Fire, and Ambulance dispatch. Do not wait for AI analysis.',
    call112: 'Call 112 (National Emergency)',
    call108: 'Call 108 (Ambulance)',
    inputPlaceholder: 'Describe your situation naturally in English or your language, or upload medical reports, voice notes, accident photos, or flood alerts...',
    startRecording: 'Voice Record',
    stopRecording: 'Stop Recording',
    recording: 'Recording audio...',
    uploadFiles: 'Attach Files (Images, PDF, Audio)',
    dragDrop: 'or drag & drop lab reports, accident photos, audio recordings here',
    submitButton: 'Analyze & Generate Action Plan',
    analyzingButton: 'Interpreting with Gemini...',
    demoScenariosTitle: 'Hackathon Demo Scenarios (1-Click Test)',
    quickExamplesTitle: 'Suggested Inquiries',
    privacyNotice: 'Privacy & Ephemeral Processing: Files are analyzed in server memory and not retained. Verified facts cite official government portals.',
    urgencyTitle: 'Urgency Assessment',
    keyFactsTitle: 'Extracted Facts & Findings',
    actionPlanTitle: 'Prioritized Action Plan',
    verifiedSourcesTitle: 'Authoritative Verified Sources',
    officialResourcesTitle: 'Official Public Resources & Helplines',
    warningsTitle: 'Important Safety Warnings',
    missingInfoTitle: 'Information Needed for Full Accuracy',
    medicalDisclaimerTitle: 'Medical & Clinical Boundary Disclaimer',
    markCompleted: 'Mark Done',
    copyPlan: 'Copy Action Plan',
    copied: 'Copied to Clipboard!',
    printPlan: 'Print Plan',
    newInquiry: 'New Inquiry',
    liveVerificationUnavailable: 'Live verification unavailable (showing official standing resources)',
    humanConfirmationNeeded: 'Human confirmation recommended before proceeding',
    whyThisMatters: 'Why this matters',
    tabs: {
      home: 'Assistant & Workspace',
      resources: 'Official Directory',
      history: 'Session History',
      about: 'Safety & Architecture'
    }
  },
  hi: {
    appName: 'LifeBridge AI',
    tagline: 'जेमिनी-संचालित सार्वभौमिक जन सहायता मंच',
    emergencyBannerTitle: 'क्या यह तत्काल जीवन संकट या आपातकाल है?',
    emergencyBannerSubtitle: 'पुलिस, एम्बुलेंस और अग्निशमन सहायता के लिए पूरे भारत में तुरंत 112 डायल करें। एआई उत्तर की प्रतीक्षा न करें।',
    call112: '112 डायल करें (राष्ट्रीय आपातकाल)',
    call108: '108 डायल करें (एम्बुलेंस)',
    inputPlaceholder: 'अपनी समस्या को हिन्दी में बताएं, या मेडिकल रिपोर्ट, आवाज संदेश, दुर्घटना या बाढ़ की तस्वीरें अपलोड करें...',
    startRecording: 'आवाज रिकॉर्ड करें',
    stopRecording: 'रिकॉर्डिंग रोकें',
    recording: 'ऑडियो रिकॉर्ड हो रहा है...',
    uploadFiles: 'फाइलें जोड़ें (फोटो, पीडीएफ, ऑडियो)',
    dragDrop: 'या लैब रिपोर्ट, फोटो, वॉयस क्लिप यहां खींचें',
    submitButton: 'विश्लेषण करें एवं कार्य योजना बनाएं',
    analyzingButton: 'जेमिनी द्वारा विश्लेषण जारी...',
    demoScenariosTitle: 'हैकाथॉन डेमो परिदृश्य (एक क्लिक में टेस्ट)',
    quickExamplesTitle: 'सुझाए गए उदाहरण',
    privacyNotice: 'गोपनीयता सुरक्षा: आपकी फाइलें सुरक्षित रूप से संसाधित होती हैं और स्थायी रूप से सहेजी नहीं जातीं।',
    urgencyTitle: 'आपात स्थिति का स्तर',
    keyFactsTitle: 'निकाले गए मुख्य तथ्य एवं निष्कर्ष',
    actionPlanTitle: 'प्राथमिकता-आधारित कार्य योजना',
    verifiedSourcesTitle: 'सत्यापित आधिकारिक स्रोत',
    officialResourcesTitle: 'आधिकारिक सार्वजनिक संसाधन एवं हेल्पलाइन',
    warningsTitle: 'महत्वपूर्ण सुरक्षा चेतावनियाँ',
    missingInfoTitle: 'सटीकता के लिए आवश्यक अतिरिक्त जानकारी',
    medicalDisclaimerTitle: 'चिकित्सा एवं गैर-नैदानिक अस्वीकरण',
    markCompleted: 'पूर्ण चिह्नित करें',
    copyPlan: 'योजना कॉपी करें',
    copied: 'कॉपी हो गया!',
    printPlan: 'प्रिंट करें',
    newInquiry: 'नई समस्या दर्ज करें',
    liveVerificationUnavailable: 'लाइव सत्यापन अनुपलब्ध (स्थायी आधिकारिक स्रोत दिखाए गए हैं)',
    humanConfirmationNeeded: 'आगे बढ़ने से पहले मानवीय पुष्टि आवश्यक',
    whyThisMatters: 'यह क्यों महत्वपूर्ण है',
    tabs: {
      home: 'सहायक और कार्यक्षेत्र',
      resources: 'आधिकारिक निर्देशिका',
      history: 'सत्र इतिहास',
      about: 'सुरक्षा और तकनीक'
    }
  },
  mr: {
    appName: 'LifeBridge AI',
    tagline: 'जेमिनी-संचलित सार्वत्रिक सार्वजनिक साहाय्य व्यासपीठ',
    emergencyBannerTitle: 'तातडीचे संकट किंवा आपत्कालीन परिस्थिती आहे का?',
    emergencyBannerSubtitle: 'पोलीस आणि रुग्णवाहिकेसाठी संपूर्ण भारतात त्वरित 112 डायल करा.',
    call112: '112 डायल करा (आपत्कालीन सेवा)',
    call108: '108 डायल करा (रुग्णवाहिका)',
    inputPlaceholder: 'आपली समस्या मराठीमध्ये सांगा किंवा वैद्यकीय अहवाल, ऑडिओ, अपघाताचे फोटो जोडा...',
    startRecording: 'आवाज रेकॉर्ड करा',
    stopRecording: 'रेकॉर्डिंग थांबवा',
    recording: 'ऑडिओ रेकॉर्ड होत आहे...',
    uploadFiles: 'फाईल्स जोडा (फोटो, पीडीएफ, ऑडिओ)',
    dragDrop: 'किंवा कागदपत्रे येथे ड्रॅग करा',
    submitButton: 'विश्लेषण करा आणि कृती योजना मिळवा',
    analyzingButton: 'विश्लेषण सुरू आहे...',
    demoScenariosTitle: 'डेमो परिस्थिती (१-क्लिक चाचणी)',
    quickExamplesTitle: 'सुचवलेले प्रश्न',
    privacyNotice: 'गोपनीयता: फाईल्स तात्पुरत्या मेमरीमध्ये प्रक्रिया केल्या जातात.',
    urgencyTitle: 'तातडीची पातळी',
    keyFactsTitle: 'महत्त्वाचे तथ्य आणि निष्कर्ष',
    actionPlanTitle: 'प्राधान्य कृती योजना',
    verifiedSourcesTitle: 'सत्यापित अधिकृत स्रोत',
    officialResourcesTitle: 'अधिकृत हेल्पलाईन',
    warningsTitle: 'सुरक्षा सूचना',
    missingInfoTitle: 'आवश्यक अतिरिक्त माहिती',
    medicalDisclaimerTitle: 'वैद्यकीय अस्वीकरण',
    markCompleted: 'पूर्ण झाले',
    copyPlan: 'कॉपी करा',
    copied: 'कॉपी झाले!',
    printPlan: 'प्रिंट',
    newInquiry: 'नवीन प्रश्न',
    liveVerificationUnavailable: 'थेट पडताळणी अनुपलब्ध',
    humanConfirmationNeeded: 'मानवी खात्री आवश्यक',
    whyThisMatters: 'हे का महत्त्वाचे आहे',
    tabs: {
      home: 'साहाय्यक',
      resources: 'निर्देशिका',
      history: 'इतिहास',
      about: 'सुरक्षा'
    }
  }
};

export function getTranslation(lang: string = 'en'): TranslationStrings {
  return translations[lang] || translations.en;
}
