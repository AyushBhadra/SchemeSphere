require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Scheme = require('./models/Scheme');
const User = require('./models/User');

const schemes = [
  {
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    department: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    description: 'A central sector scheme that provides income support to landholding farmer families across India.',
    descriptionHindi: 'यह एक केंद्रीय क्षेत्र की योजना है जो भारत भर के भूमिधारक किसान परिवारों को आय सहायता प्रदान करती है।',
    benefits: '₹6,000 per year in three instalments of ₹2,000 each, transferred directly to the farmer’s bank account.',
    benefitsHindi: 'प्रति वर्ष ₹6,000, तीन किस्तों में ₹2,000 प्रत्येक, सीधे किसान के बैंक खाते में।',
    applicationUrl: 'https://pmkisan.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 100, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Farmer', 'Farmer'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Land ownership records', 'Bank account details']
  },
  {
    title: 'Ayushman Bharat – PMJAY',
    titleHindi: 'आयुष्मान भारत – पीएमजय',
    department: 'Ministry of Health and Family Welfare',
    category: 'Healthcare',
    description: 'The world’s largest publicly funded health assurance scheme.',
    descriptionHindi: 'विश्व की सबसे बड़ी सार्वजनिक रूप से वित्तपोषित स्वास्थ्य आश्वासन योजना।',
    benefits: 'Health cover of up to ₹5 lakh per family per year for secondary and tertiary care hospitalisation.',
    benefitsHindi: 'परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य कवर।',
    applicationUrl: 'https://nha.gov.in/PM-JAY',
    deadline: null,
    criteria: { minAge: 0, maxAge: 120, gender: 'Any', maxAnnualIncome: 500000, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Ration Card']
  },
  {
    title: 'Post-Matric Scholarship',
    titleHindi: 'पोस्ट-मैट्रिक छात्रवृत्ति',
    department: 'Ministry of Social Justice and Empowerment',
    category: 'Education',
    description: 'A centrally sponsored scholarship for students from backward classes studying in post-matriculation courses.',
    descriptionHindi: 'मान्यता प्राप्त पोस्ट-मैट्रिक पाठ्यक्रमों में अध्ययनरत छात्रों के लिए केंद्र प्रायोजित छात्रवृत्ति।',
    benefits: 'Maintenance allowance, reimbursement of compulsory non-refundable fees.',
    benefitsHindi: 'रखरखाव भत्ता, अनिवार्य गैर-वापसी योग्य शुल्क की प्रतिपूर्ति।',
    applicationUrl: 'https://scholarships.gov.in/',
    deadline: null,
    criteria: { minAge: 16, maxAge: 35, gender: 'Any', maxAnnualIncome: 250000, targetOccupations: ['Student'], state: 'All-India', casteCategories: ['SC', 'ST', 'OBC'] },
    requiredDocuments: ['Aadhaar Card', 'Caste certificate', 'Income certificate', 'Marksheet']
  },
  {
    title: 'PM Awas Yojana (Urban/Gramin)',
    titleHindi: 'प्रधानमंत्री आवास योजना (शहरी/ग्रामीण)',
    department: 'Ministry of Housing',
    category: 'Housing',
    description: 'A flagship housing mission to provide pucca houses with basic amenities.',
    descriptionHindi: 'मूल सुविधाओं वाले पक्के मकान उपलब्ध कराने का प्रमुख आवास मिशन।',
    benefits: 'Interest subsidy on home loans and central assistance for construction.',
    benefitsHindi: 'गृह ऋण पर ब्याज सब्सिडी और पक्के मकान के निर्माण के लिए केंद्रीय सहायता।',
    applicationUrl: 'https://pmaymis.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 70, gender: 'Any', maxAnnualIncome: 1800000, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Income certificate', 'Bank account details']
  },
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना',
    department: 'Ministry of Finance',
    category: 'Financial',
    description: 'Provides collateral-free institutional credit to non-corporate, non-farm micro and small enterprises.',
    descriptionHindi: 'सूक्ष्म और लघु उद्यमों को बिना गारंटी संस्थागत ऋण प्रदान करती है।',
    benefits: 'Collateral-free loans up to ₹10 lakh for business activities.',
    benefitsHindi: 'व्यवसाय गतिविधियों के लिए बिना गारंटी ₹10 लाख तक का ऋण।',
    applicationUrl: 'https://www.mudra.org.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 65, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Business', 'Self-employed'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business plan']
  },
  {
    title: 'Sukanya Samriddhi Yojana',
    titleHindi: 'सुकन्या समृद्धि योजना',
    department: 'Ministry of Finance',
    category: 'Financial',
    description: 'A small-savings scheme under Beti Bachao Beti Padhao for the girl child.',
    descriptionHindi: 'बालिका के लिए लघु बचत योजना।',
    benefits: 'Attractive government-notified interest rate, tax deduction on deposits.',
    benefitsHindi: 'आकर्षक ब्याज दर, जमा पर कर कटौती।',
    applicationUrl: 'https://www.nsiindia.gov.in/',
    deadline: null,
    criteria: { minAge: 0, maxAge: 10, gender: 'Female', maxAnnualIncome: null, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Birth certificate of girl child', 'Guardian Aadhaar']
  },
  {
    title: 'Atal Pension Yojana (APY)',
    titleHindi: 'अटल पेंशन योजना',
    department: 'Ministry of Finance',
    category: 'Financial',
    description: 'Pension scheme for workers in the unorganized sector.',
    descriptionHindi: 'असंगठित क्षेत्र के श्रमिकों के लिए पेंशन योजना।',
    benefits: 'Guaranteed minimum pension of ₹1,000 to ₹5,000 per month after age 60.',
    benefitsHindi: '60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की गारंटीकृत न्यूनतम पेंशन।',
    applicationUrl: 'https://npscra.nsdl.co.in/scheme-details.php',
    deadline: null,
    criteria: { minAge: 18, maxAge: 40, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Unemployed', 'Farmer', 'Business'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Bank account details']
  },
  {
    title: 'PM Vishwakarma Kaushal Samman',
    titleHindi: 'पीएम विश्वकर्मा कौशल सम्मान',
    department: 'Ministry of MSME',
    category: 'Financial',
    description: 'Scheme for traditional artisans and craftspeople of 18 trades.',
    descriptionHindi: '18 पारंपरिक व्यवसायों के कारीगरों के लिए योजना।',
    benefits: 'Skill training, toolkit incentive, collateral-free credit.',
    benefitsHindi: 'कौशल प्रशिक्षण, टूलकिट प्रोत्साहन, बिना गारंटी ऋण।',
    applicationUrl: 'https://pmvishwakarma.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 60, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Business', 'Artisan', 'Self-employed'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Bank account details']
  },
  {
    title: 'PM SVANidhi',
    titleHindi: 'पीएम स्वनिधि',
    department: 'Ministry of Housing and Urban Affairs',
    category: 'Financial',
    description: 'Special micro-credit facility for street vendors.',
    descriptionHindi: 'स्ट्रीट वेंडरों के लिए विशेष सूक्ष्म-ऋण सुविधा।',
    benefits: 'Working capital loan up to ₹10,000 with interest subsidy.',
    benefitsHindi: 'ब्याज सब्सिडी के साथ ₹10,000 तक का कार्यशील पूंजी ऋण।',
    applicationUrl: 'https://pmsvanidhi.mohua.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 65, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Business', 'Street Vendor'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Vending Certificate']
  },
  {
    title: 'National Means-cum-Merit Scholarship',
    titleHindi: 'राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति',
    department: 'Ministry of Education',
    category: 'Education',
    description: 'Awarded to meritorious students of economically weaker sections.',
    descriptionHindi: 'आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों को प्रदान किया जाता है।',
    benefits: 'Scholarship of ₹12,000 per annum.',
    benefitsHindi: '₹12,000 प्रति वर्ष की छात्रवृत्ति।',
    applicationUrl: 'https://scholarships.gov.in/',
    deadline: null,
    criteria: { minAge: 13, maxAge: 18, gender: 'Any', maxAnnualIncome: 350000, targetOccupations: ['Student'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Income certificate', 'Marksheet']
  },
  {
    title: 'Stand-Up India Scheme',
    titleHindi: 'स्टैंड-अप इंडिया योजना',
    department: 'Ministry of Finance',
    category: 'Financial',
    description: 'Facilitates bank loans for SC/ST and Women entrepreneurs.',
    descriptionHindi: 'एससी/एसटी और महिला उद्यमियों के लिए बैंक ऋण की सुविधा।',
    benefits: 'Bank loans between ₹10 lakh and ₹1 crore for setting up a greenfield enterprise.',
    benefitsHindi: '₹10 लाख और ₹1 करोड़ के बीच का बैंक ऋण।',
    applicationUrl: 'https://www.standupmitra.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 65, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Business'], state: 'All-India', casteCategories: ['SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business plan']
  },
  {
    title: 'PM Ujjwala Yojana',
    titleHindi: 'पीएम उज्ज्वला योजना',
    department: 'Ministry of Petroleum and Natural Gas',
    category: 'Housing',
    description: 'Providing clean cooking fuel to poor households.',
    descriptionHindi: 'गरीब परिवारों को स्वच्छ खाना पकाने का ईंधन प्रदान करना।',
    benefits: 'Financial support of ₹1600 for each LPG connection to BPL households.',
    benefitsHindi: 'बीपीएल परिवारों को प्रत्येक एलपीजी कनेक्शन के लिए ₹1600 की वित्तीय सहायता।',
    applicationUrl: 'https://www.pmuy.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 80, gender: 'Female', maxAnnualIncome: 100000, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'BPL Ration Card']
  },
  {
    title: 'NSAP – IGNOAPS',
    titleHindi: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम - इग्नोएपीएस',
    department: 'Ministry of Rural Development',
    category: 'Financial',
    description: 'Pension to elderly persons belonging to Below Poverty Line households.',
    descriptionHindi: 'गरीबी रेखा से नीचे के परिवारों के वृद्ध व्यक्तियों को पेंशन।',
    benefits: 'Monthly old-age pension.',
    benefitsHindi: 'मासिक वृद्धावस्था पेंशन।',
    applicationUrl: 'https://nsap.nic.in/',
    deadline: null,
    criteria: { minAge: 60, maxAge: 120, gender: 'Any', maxAnnualIncome: 100000, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Age proof', 'BPL certificate']
  },
  {
    title: 'Janani Suraksha Yojana',
    titleHindi: 'जननी सुरक्षा योजना',
    department: 'Ministry of Health and Family Welfare',
    category: 'Healthcare',
    description: 'Safe motherhood intervention under the National Health Mission.',
    descriptionHindi: 'राष्ट्रीय स्वास्थ्य मिशन के तहत सुरक्षित मातृत्व हस्तक्षेप।',
    benefits: 'Cash assistance for delivery and post-delivery care.',
    benefitsHindi: 'प्रसव और प्रसव के बाद की देखभाल के लिए नकद सहायता।',
    applicationUrl: 'https://nhm.gov.in/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 50, gender: 'Female', maxAnnualIncome: 150000, targetOccupations: [], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'MCP Card']
  },
  {
    title: 'PM Employment Generation Programme (PMEGP)',
    titleHindi: 'पीएम रोजगार सृजन कार्यक्रम',
    department: 'Ministry of MSME',
    category: 'Financial',
    description: 'Credit-linked subsidy programme to generate employment opportunities.',
    descriptionHindi: 'रोजगार के अवसर पैदा करने के लिए क्रेडिट-लिंक्ड सब्सिडी कार्यक्रम।',
    benefits: 'Subsidy up to 35% on project cost for setting up micro-enterprises.',
    benefitsHindi: 'सूक्ष्म उद्यम स्थापित करने के लिए परियोजना लागत पर 35% तक की सब्सिडी।',
    applicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    deadline: null,
    criteria: { minAge: 18, maxAge: 65, gender: 'Any', maxAnnualIncome: null, targetOccupations: ['Business', 'Unemployed'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Project Report', 'Education Certificate']
  },
  {
    title: 'Pre-Matric Scholarship Scheme',
    titleHindi: 'प्री-मैट्रिक छात्रवृत्ति योजना',
    department: 'Ministry of Minority Affairs',
    category: 'Education',
    description: 'Scholarship for minority community students studying in classes 1 to 10.',
    descriptionHindi: 'कक्षा 1 से 10 में पढ़ने वाले अल्पसंख्यक समुदाय के छात्रों के लिए छात्रवृत्ति।',
    benefits: 'Admission fee, tuition fee, and maintenance allowance.',
    benefitsHindi: 'प्रवेश शुल्क, ट्यूशन शुल्क और रखरखाव भत्ता।',
    applicationUrl: 'https://scholarships.gov.in/',
    deadline: null,
    criteria: { minAge: 5, maxAge: 16, gender: 'Any', maxAnnualIncome: 100000, targetOccupations: ['Student'], state: 'All-India', casteCategories: ['General', 'OBC', 'SC', 'ST'] },
    requiredDocuments: ['Aadhaar Card', 'Income certificate', 'Self-declaration of minority community']
  }
];

const seedSchemes = async () => {
  try {
    await connectDB();

    await Scheme.deleteMany({});
    console.log('Existing schemes cleared');

    const created = await Scheme.insertMany(schemes);
    console.log(`Seeded ${created.length} government schemes`);

    const adminEmail = 'admin@schemesphere.gov.in';
    const adminPassword = 'Admin@123SchemeSphere';
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    const citizenEmail = 'citizen@schemesphere.gov.in';
    const citizenPassword = 'Citizen@123SchemeSphere';
    const citizenHashed = await bcrypt.hash(citizenPassword, 10);

    await User.deleteMany({ email: { $in: [adminEmail, citizenEmail] } });

    await User.create({
      name: 'SchemeSphere Admin',
      email: adminEmail,
      password: adminHashed,
      role: 'admin',
    });
    console.log(`Admin user ready: ${adminEmail}`);

    await User.create({
      name: 'Test Citizen',
      email: citizenEmail,
      password: citizenHashed,
      role: 'citizen',
    });
    console.log(`Citizen user ready: ${citizenEmail}`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedSchemes();
