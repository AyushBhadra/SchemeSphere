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
    description:
      'A central sector scheme that provides income support to landholding farmer families across India. Eligible farmers receive financial assistance in three equal instalments each year, credited directly to their bank accounts through DBT.',
    descriptionHindi:
      'यह एक केंद्रीय क्षेत्र की योजना है जो भारत भर के भूमिधारक किसान परिवारों को आय सहायता प्रदान करती है। पात्र किसानों को प्रत्येक वर्ष तीन समान किस्तों में वित्तीय सहायता उनके बैंक खातों में डीबीटी के माध्यम से दी जाती है।',
    benefits:
      '₹6,000 per year in three instalments of ₹2,000 each, transferred directly to the farmer’s bank account.',
    benefitsHindi:
      'प्रति वर्ष ₹6,000, तीन किस्तों में ₹2,000 प्रत्येक, सीधे किसान के बैंक खाते में।',
    applicationUrl: 'https://pmkisan.gov.in/',
    deadline: null,
    criteria: {
      minAge: 18,
      maxAge: 100,
      gender: 'Any',
      maxAnnualIncome: null,
      targetOccupations: ['Farmer'],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land ownership records (Khata/Khatauni)',
      'Bank account details (linked with Aadhaar)',
      'Citizenship proof',
    ],
  },
  {
    title: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    titleHindi: 'आयुष्मान भारत – प्रधानमंत्री जन आरोग्य योजना',
    department: 'National Health Authority, Ministry of Health and Family Welfare',
    category: 'Healthcare',
    description:
      'The world’s largest publicly funded health assurance scheme. It provides health cover to poor and vulnerable families identified as per SECC 2011 and state-extended beneficiary lists, covering secondary and tertiary hospitalisation at empanelled public and private hospitals.',
    descriptionHindi:
      'विश्व की सबसे बड़ी सार्वजनिक रूप से वित्तपोषित स्वास्थ्य आश्वासन योजना। यह एसईसीसी 2011 और राज्य-विस्तारित लाभार्थी सूचियों के अनुसार पहचाने गए गरीब और कमजोर परिवारों को सूचीबद्ध सरकारी और निजी अस्पतालों में द्वितीयक और तृतीयक अस्पताल में भर्ती का स्वास्थ्य कवर देती है।',
    benefits:
      'Health cover of up to ₹5 lakh per family per year for secondary and tertiary care hospitalisation, cashless and paperless at empanelled hospitals.',
    benefitsHindi:
      'परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य कवर, सूचीबद्ध अस्पतालों में कैशलेस और पेपरलेस अस्पताल में भर्ती।',
    applicationUrl: 'https://nha.gov.in/PM-JAY',
    deadline: null,
    criteria: {
      minAge: 0,
      maxAge: 120,
      gender: 'Any',
      maxAnnualIncome: 500000,
      targetOccupations: [],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / SECC beneficiary identification',
      'Ayushman card (if already issued)',
    ],
  },
  {
    title: 'Post-Matric Scholarship for SC Students',
    titleHindi: 'अनुसूचित जाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    department: 'Ministry of Social Justice and Empowerment',
    category: 'Education',
    description:
      'A centrally sponsored scholarship for Scheduled Caste students studying in recognised post-matriculation or post-secondary courses. It covers maintenance allowance, compulsory fees, and other academic expenses, subject to income ceiling and institutional recognition.',
    descriptionHindi:
      'मान्यता प्राप्त पोस्ट-मैट्रिक या पोस्ट-सेकेंडरी पाठ्यक्रमों में अध्ययनरत अनुसूचित जाति के छात्रों के लिए केंद्र प्रायोजित छात्रवृत्ति। इसमें रखरखाव भत्ता, अनिवार्य शुल्क और अन्य शैक्षणिक व्यय शामिल हैं।',
    benefits:
      'Maintenance allowance, reimbursement of compulsory non-refundable fees, book allowance and additional allowances for students with disabilities, as per Government of India norms.',
    benefitsHindi:
      'रखरखाव भत्ता, अनिवार्य गैर-वापसी योग्य शुल्क की प्रतिपूर्ति, पुस्तक भत्ता तथा दिव्यांग छात्रों के लिए अतिरिक्त भत्ते।',
    applicationUrl: 'https://scholarships.gov.in/',
    deadline: new Date('2026-12-31'),
    criteria: {
      minAge: 16,
      maxAge: 35,
      gender: 'Any',
      maxAnnualIncome: 250000,
      targetOccupations: ['Student'],
      state: 'All-India',
      casteCategories: ['SC'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Caste certificate (SC)',
      'Income certificate',
      'Previous year marksheet',
      'Bonafide certificate from institution',
      'Bank account details',
    ],
  },
  {
    title: 'Pradhan Mantri Awas Yojana – Urban (PMAY-U)',
    titleHindi: 'प्रधानमंत्री आवास योजना – शहरी',
    department: 'Ministry of Housing and Urban Affairs',
    category: 'Housing',
    description:
      'A flagship housing mission to provide pucca houses with basic amenities to eligible urban families from EWS, LIG and MIG segments through credit-linked subsidy, in-situ slum redevelopment, affordable housing in partnership, and beneficiary-led construction.',
    descriptionHindi:
      'ईडब्ल्यूएस, एलआईजी और एमआईजी वर्ग के पात्र शहरी परिवारों को मूल सुविधाओं वाले पक्के मकान उपलब्ध कराने का प्रमुख आवास मिशन।',
    benefits:
      'Interest subsidy on home loans (CLSS) and/or central assistance for construction or enhancement of a pucca house, depending on the vertical under which the beneficiary is covered.',
    benefitsHindi:
      'गृह ऋण पर ब्याज सब्सिडी (सीएलएसएस) और/या पक्के मकान के निर्माण या विस्तार के लिए केंद्रीय सहायता।',
    applicationUrl: 'https://pmaymis.gov.in/',
    deadline: null,
    criteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'Any',
      maxAnnualIncome: 1800000,
      targetOccupations: [],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Income certificate',
      'Proof of not owning a pucca house',
      'Bank account details',
      'Address proof / property documents (for BLC)',
    ],
  },
  {
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना',
    department: 'Department of Financial Services, Ministry of Finance',
    category: 'Financial',
    description:
      'Provides collateral-free institutional credit to non-corporate, non-farm micro and small enterprises under Shishu, Kishore and Tarun categories. Loans are extended by banks, NBFCs and MFIs for income-generating activities.',
    descriptionHindi:
      'शिशु, किशोर और तरुण श्रेणियों के अंतर्गत गैर-कॉर्पोरेट, गैर-कृषि सूक्ष्म और लघु उद्यमों को बिना गारंटी संस्थागत ऋण प्रदान करती है।',
    benefits:
      'Collateral-free loans up to ₹20 lakh (as per latest PMMY limits) for business/income-generating activities, classified as Shishu, Kishore and Tarun.',
    benefitsHindi:
      'व्यवसाय/आय अर्जक गतिविधियों के लिए बिना गारंटी ऋण, शिशु, किशोर और तरुण श्रेणियों में।',
    applicationUrl: 'https://www.mudra.org.in/',
    deadline: null,
    criteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'Any',
      maxAnnualIncome: null,
      targetOccupations: ['Self-employed', 'Micro entrepreneur', 'Small business owner', 'Artisan'],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'PAN Card',
      'Proof of identity and address',
      'Business plan / loan application',
      'Bank account details',
      'Photographs',
    ],
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY)',
    titleHindi: 'सुकन्या समृद्धि योजना',
    department: 'Department of Economic Affairs, Ministry of Finance (via India Post / authorised banks)',
    category: 'Financial',
    description:
      'A small-savings scheme under Beti Bachao Beti Padhao for the girl child. A parent or legal guardian can open an account in the name of a girl below 10 years. Deposits enjoy tax benefits under Section 80C, and interest is tax-exempt.',
    descriptionHindi:
      'बेटी बचाओ बेटी पढ़ाओ के अंतर्गत बालिका के लिए लघु बचत योजना। 10 वर्ष से कम आयु की बालिका के नाम पर अभिभावक खाता खोल सकते हैं। जमा पर धारा 80सी के तहत कर लाभ और ब्याज कर-मुक्त है।',
    benefits:
      'Attractive government-notified interest rate, tax deduction on deposits under Section 80C, tax-free interest and maturity proceeds; account can be operated until the girl turns 21 or on marriage after 18.',
    benefitsHindi:
      'सरकार द्वारा अधिसूचित ब्याज दर, धारा 80सी के तहत जमा पर कर कटौती, कर-मुक्त ब्याज और परिपक्वता राशि।',
    applicationUrl: 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=57',
    deadline: null,
    criteria: {
      minAge: 0,
      maxAge: 10,
      gender: 'Female',
      maxAnnualIncome: null,
      targetOccupations: [],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Birth certificate of the girl child',
      'Aadhaar of the girl child (if available) and of the guardian',
      'Address proof of guardian',
      'KYC of guardian (PAN / Aadhaar)',
    ],
  },
  {
    title: 'NSAP – Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    titleHindi: 'राष्ट्रीय सामाजिक सहायता कार्यक्रम – इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
    department: 'Ministry of Rural Development',
    category: 'Financial',
    description:
      'A component of the National Social Assistance Programme providing a monthly pension to elderly persons belonging to Below Poverty Line households. Central assistance is supplemented by many states with additional amounts.',
    descriptionHindi:
      'राष्ट्रीय सामाजिक सहायता कार्यक्रम का घटक जो गरीबी रेखा से नीचे के परिवारों के वृद्ध व्यक्तियों को मासिक पेंशन देता है। कई राज्य केंद्र सहायता के साथ अतिरिक्त राशि जोड़ते हैं।',
    benefits:
      'Monthly old-age pension as per NSAP norms (central contribution typically ₹200–₹500 depending on age band), often topped up by the state government.',
    benefitsHindi:
      'एनएसएपी मानदंडों के अनुसार मासिक वृद्धावस्था पेंशन, जिसे राज्य सरकार अक्सर बढ़ाती है।',
    applicationUrl: 'https://nsap.nic.in/',
    deadline: null,
    criteria: {
      minAge: 60,
      maxAge: 120,
      gender: 'Any',
      maxAnnualIncome: 100000,
      targetOccupations: [],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Age proof',
      'BPL / income certificate',
      'Bank or post office account details',
      'Passport-size photographs',
    ],
  },
  {
    title: 'PM Vishwakarma',
    titleHindi: 'प्रधानमंत्री विश्वकर्मा',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    category: 'Financial',
    description:
      'A central sector scheme for traditional artisans and craftspeople of 18 trades (including carpenter, blacksmith, goldsmith, potter, cobbler, tailor and others). It offers recognition through PM Vishwakarma certificate and ID, skill upgradation, toolkit incentive, credit support, and incentives for digital transactions and marketing.',
    descriptionHindi:
      '18 पारंपरिक व्यवसायों (बढ़ई, लोहार, सुनार, कुम्हार, मोची, दर्जी आदि) के कारीगरों के लिए केंद्रीय योजना। प्रमाण पत्र, कौशल उन्नयन, टूलकिट प्रोत्साहन, ऋण सहायता तथा डिजिटल लेनदेन और विपणन प्रोत्साहन प्रदान करती है।',
    benefits:
      'PM Vishwakarma certificate and ID card, basic and advanced skill training with stipend, toolkit incentive of ₹15,000, collateral-free credit at concessional interest, and support for digital payments and marketing.',
    benefitsHindi:
      'प्रमाण पत्र व पहचान पत्र, वजीफे के साथ कौशल प्रशिक्षण, ₹15,000 का टूलकिट प्रोत्साहन, रियायती ब्याज पर बिना गारंटी ऋण, डिजिटल भुगतान और विपणन सहायता।',
    applicationUrl: 'https://pmvishwakarma.gov.in/',
    deadline: null,
    criteria: {
      minAge: 18,
      maxAge: 60,
      gender: 'Any',
      maxAnnualIncome: null,
      targetOccupations: [
        'Carpenter',
        'Boat Maker',
        'Armourer',
        'Blacksmith',
        'Hammer and Tool Kit Maker',
        'Locksmith',
        'Goldsmith',
        'Potter',
        'Sculptor',
        'Stone breaker',
        'Cobbler',
        'Mason',
        'Basket/Mat/Broom Maker/Coir Weaver',
        'Doll & Toy Maker',
        'Barber',
        'Garland maker',
        'Washerman',
        'Tailor',
        'Fishing Net Maker',
      ],
      state: 'All-India',
      casteCategories: ['General', 'OBC', 'SC', 'ST'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Mobile number linked with Aadhaar',
      'Bank account details',
      'Proof of engagement in a notified traditional trade',
    ],
  },
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
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'SchemeSphere Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`Admin user ready: ${adminEmail}`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedSchemes();
