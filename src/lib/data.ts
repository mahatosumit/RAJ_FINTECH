import { db } from "@/db";
import { count, eq, asc, desc, and } from "drizzle-orm";
import * as s from "@/db/schema";

// In-Memory Fallback State (used if PostgreSQL connection is offline or tables not created)
const memoryStore = {
  settings: [
    { key: "organization_name", valueNe: "श्री कुशेश्वर बाबा कृषि सहकारी संस्था लिमिटेड", valueEn: "Shree Kusheshwar Baba Krishi Sahakari Sanstha Limited", group: "general" },
    { key: "tagline", valueNe: "विश्वास, बचत र समृद्धिको आधार", valueEn: "The Foundation of Trust, Savings and Prosperity", group: "general" },
    { key: "phone", valueNe: "9829458061", valueEn: "9829458061", group: "contact" },
    { key: "address", valueNe: "करैयामाई गाउँपालिका–५, ढोढिया, बारा, मधेस प्रदेश", valueEn: "Karaiyamai Rural Municipality–5, Dhodhiya, Bara, Madhesh Province", group: "contact" },
    { key: "service_center", valueNe: "करैयामाई गाउँपालिका–८, नरही बजार", valueEn: "Karaiyamai Rural Municipality–8, Narahi Bazaar", group: "contact" },
    { key: "email", valueNe: "info@kusheshwarbaba.coop.np", valueEn: "info@kusheshwarbaba.coop.np", group: "contact" },
    { key: "website", valueNe: "www.kusheshwarbaba.coop.np", valueEn: "www.kusheshwarbaba.coop.np", group: "contact" },
    { key: "est_year", valueNe: "२०६८", valueEn: "2068 B.S.", group: "general" },
    { key: "reg_no", valueNe: "१२४/०६८/०६९", valueEn: "124/068/069", group: "general" },
  ],
  sections: [
    { key: "hero", titleNe: "समयमै बचत गरौँ, भविष्यको सुरक्षा बढाऔँ।", titleEn: "Save Today, Secure Your Future.", contentNe: "विश्वास, बचत र समृद्धिको आधार", contentEn: "The Foundation of Trust, Savings and Prosperity", displayOrder: 1, enabled: true },
    { key: "about", titleNe: "हाम्रो बारेमा", titleEn: "About Us", contentNe: "श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. वि.सं. २०६८ सालमा स्थापना भई नेपाल सरकारको सहकारी ऐन, नियम तथा प्रचलित कानुनी व्यवस्थाअनुसार विधिवत् दर्ता भएर सञ्चालनमा रहेको संस्था हो। यस संस्थाले किसान, साना व्यवसायी तथा स्थानीय बासिन्दाहरूलाई सुलभ वित्तीय सेवा, बचत तथा कर्जा सुविधा प्रदान गर्दै आएको छ।", contentEn: "Shree Kusheshwar Baba Krishi Sahakari Sanstha Ltd. was established in 2068 B.S.", displayOrder: 2, enabled: true },
    { key: "chairman", titleNe: "अध्यक्षको सन्देश", titleEn: "Chairman's Message", contentNe: "आदरणीय सेयरधनी सदस्यज्यूहरू तथा महानुभावहरू,\n\nश्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. को तर्फबाट हार्दिक नमस्कार तथा न्यानो अभिवादन! कृषि क्षेत्रको विकास र स्थानीय समुदायको आर्थिक समृद्धिका लागि हामी निरन्तर प्रतिबद्ध छौँ।\n\n– राजकुमार प्रसाद पाल (अध्यक्ष)", contentEn: "Dear valued members...", displayOrder: 8, enabled: true },
    { key: "privacy", titleNe: "गोपनीयता नीति", titleEn: "Privacy Policy", contentNe: "हाम्रो सहकारी संस्था आफ्ना सदस्यहरूको व्यक्तिगत तथ्यांक तथा वित्तीय विवरणहरूको गोपनीयता र सुरक्षाप्रति पूर्ण संवेदनशील छ।", contentEn: "Our cooperative values member data privacy.", enabled: true },
    { key: "terms", titleNe: "नियम तथा सर्तहरू", titleEn: "Terms and Conditions", contentNe: "संस्थाको सदस्यता, बचत तथा कर्जा कारोबार सहकारीको विनियमावली बमोजिम हुनेछ।", contentEn: "Governed by cooperative bylaws.", enabled: true }
  ],
  serviceCenters: [
    { id: "c1", nameNe: "प्रधान कार्यालय", nameEn: "Head Office", addressNe: "करैयामाई गाउँपालिका–५, टोल ढोढिया, बारा", addressEn: "Karaiyamai Rural Municipality–5, Dhodhiya, Bara", phone: "9811841938", displayOrder: 1, active: true },
    { id: "c2", nameNe: "सेवा केन्द्र", nameEn: "Service Center", addressNe: "करैयामाई गाउँपालिका–८, नरही बजार, बारा", addressEn: "Karaiyamai Rural Municipality–8, Narahi Bazaar, Bara", openingDate: "२०८३/०५/०१", phone: "9855085395", displayOrder: 2, active: true }
  ],
  managementCommittee: [
    { positionNe: "अध्यक्ष", positionEn: "Chairperson", nameNe: "राजकुमार प्रसाद पाल", displayOrder: 1 },
    { positionNe: "उपाध्यक्ष", positionEn: "Vice Chairperson", nameNe: "सविता देवी चौधरी", displayOrder: 2 },
    { positionNe: "सचिव", positionEn: "Secretary", nameNe: "उमेश प्रसाद चौधरी", displayOrder: 3 },
    { positionNe: "कोषाध्यक्ष", positionEn: "Treasurer", nameNe: "पूजा कुमारी गुप्ता", displayOrder: 4 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "द्रोपती माझी", displayOrder: 5 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "ललिता कुमारी थरुनी", displayOrder: 6 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "लालबहादुर चौधरी", displayOrder: 7 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "सन्दिप चौधरी", displayOrder: 8 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "राकेश कुमार सर्राफ", displayOrder: 9 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "बोलेन्द्र चौधरी", displayOrder: 10 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "चन्देश्वर प्रसाद चौधरी", displayOrder: 11 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "प्रमिला कुमारी चौधरी", displayOrder: 12 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "द्वारिका प्रसाद राउत", displayOrder: 13 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "ध्यानी राउत", displayOrder: 14 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "लुटन राउत", displayOrder: 15 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "महेश बस्नेत", displayOrder: 16 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "सर्वन चौधरी", displayOrder: 17 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "बिसुनदेयल चौधरी", displayOrder: 18 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "बिरेन्द्र शाह", displayOrder: 19 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "उर्मिला कुमारी चौधरी", displayOrder: 20 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "नवलकिशोर चौधरी", displayOrder: 21 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "ललिता देवी राउत", displayOrder: 22 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "जलोदर प्रसाद चौधरी", displayOrder: 23 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "जटाधर चौधरी", displayOrder: 24 }
  ],
  loanCommittee: [
    { positionNe: "अध्यक्ष", positionEn: "Chairperson", nameNe: "राकेश कुमार सर्राफ", displayOrder: 1 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "नवलकिशोर प्रसाद चौधरी", displayOrder: 2 },
    { positionNe: "सदस्य", positionEn: "Member", nameNe: "चन्देश्वर प्रसाद चौधरी", displayOrder: 3 }
  ],
  staff: [
    { id: "s1", centerId: "c1", centerName: "प्रधान कार्यालय", nameNe: "उमेशप्रसाद चौधरी", positionNe: "प्रबन्धक", positionEn: "Manager", phone: "9811841938", displayOrder: 1, active: true },
    { id: "s2", centerId: "c1", centerName: "प्रधान कार्यालय", nameNe: "नन्दकिशोर चौधरी", positionNe: "कर्जा प्रमुख", positionEn: "Loan Officer", phone: "9746807473", displayOrder: 2, active: true },
    { id: "s3", centerId: "c1", centerName: "प्रधान कार्यालय", nameNe: "पिंकीकुमारी चौधरी", positionNe: "बजार प्रतिनिधि", positionEn: "Market Representative", phone: "9821341274", displayOrder: 3, active: true },
    { id: "s4", centerId: "c2", centerName: "सेवा केन्द्र (नरही बजार)", nameNe: "कृष्ण शाह सोनार", positionNe: "प्रबन्धक", positionEn: "Manager", phone: "9855085395", displayOrder: 1, active: true },
    { id: "s5", centerId: "c2", centerName: "सेवा केन्द्र (नरही बजार)", nameNe: "ओमप्रकाश चौधरी", positionNe: "कर्जा प्रमुख", positionEn: "Loan Officer", phone: "9763349060", displayOrder: 2, active: true },
    { id: "s6", centerId: "c2", centerName: "सेवा केन्द्र (नरही बजार)", nameNe: "उषा ठाकुर", positionNe: "बजार प्रतिनिधि", positionEn: "Market Representative", phone: "9706181245", displayOrder: 3, active: true }
  ],
  objectives: [
    { id: "o1", textNe: "सदस्यहरूलाई सहुलियतपूर्ण कर्जा उपलब्ध गराउने।", textEn: "Provide concessional loans to members.", displayOrder: 1, enabled: true },
    { id: "o2", textNe: "नियमित बचत गर्ने बानीको विकास गराउने।", textEn: "Develop a habit of regular savings.", displayOrder: 2, enabled: true },
    { id: "o3", textNe: "कृषि, व्यापार तथा उद्यममा लगानी गर्न सहयोग गर्ने।", textEn: "Support investment in agriculture, trade and enterprise.", displayOrder: 3, enabled: true },
    { id: "o4", textNe: "आर्थिक तथा सामाजिक जीवनस्तरमा सुधार ल्याउने।", textEn: "Improve economic and social living standards.", displayOrder: 4, enabled: true },
    { id: "o5", textNe: "गुणस्तरीय र विश्वसनीय वित्तीय सेवा प्रदान गर्ने।", textEn: "Provide quality and reliable financial service.", displayOrder: 5, enabled: true }
  ],
  services: [
    { id: "srv1", slug: "savings", nameNe: "बचत योजना", nameEn: "Savings Plans", icon: "PiggyBank", descriptionNe: "सदस्यहरूका लागि सुरक्षित तथा उच्च प्रतिफल दिने बचत योजनाहरू।", descriptionEn: "Secure and high yield savings plans for members.", displayOrder: 1, published: true },
    { id: "srv2", slug: "concessional-loan", nameNe: "सहुलियतपूर्ण कर्जा", nameEn: "Concessional Loan", icon: "HandCoins", descriptionNe: "कृषक तथा व्यवसायीहरूलाई न्यून ब्याजदरमा प्रदान गरिने कर्जा।", descriptionEn: "Low interest concessional loan for farmers.", displayOrder: 2, published: true },
    { id: "srv3", slug: "agriculture-loan", nameNe: "कृषि कर्जा", nameEn: "Agriculture Loan", icon: "Sprout", descriptionNe: "खेतीपाती, पशुपालन, बीउबिजन तथा कृषि औजार खरिदका लागि कर्जा।", descriptionEn: "Loans for farming, livestock and tools.", displayOrder: 3, published: true },
    { id: "srv4", slug: "women-savings", nameNe: "महिला बचत योजना", nameEn: "Women's Savings", icon: "HeartHandshake", descriptionNe: "महिला सशक्तिकरण र आत्मनिर्भरताका लागि विशेष बचत योजना।", descriptionEn: "Special plan for women empowerment.", displayOrder: 4, published: true },
    { id: "srv5", slug: "child-savings", nameNe: "बाल बचत योजना", nameEn: "Child Savings", icon: "GraduationCap", descriptionNe: "बालबालिकाको उज्ज्वल भविष्य र शिक्षाका लागि बचत।", descriptionEn: "Savings plan for children education.", displayOrder: 5, published: true },
    { id: "srv6", slug: "business-loan", nameNe: "व्यवसायिक कर्जा", nameEn: "Business Loan", icon: "Building2", descriptionNe: "साना तथा मझौला व्यापार व्यवसाय विस्तारका लागि कर्जा।", descriptionEn: "Loans for small business expansion.", displayOrder: 6, published: true }
  ],
  savingsPlans: [
    {
      id: "sav1",
      slug: "general-savings",
      nameNe: "साधारण बचत योजना",
      nameEn: "General Savings Plan",
      durationNe: "३६५ दिन (१ वर्ष)",
      durationEn: "365 Days (1 Year)",
      descriptionNe: "दैनिक नियमित बचत गरी आकर्षक लाभ प्राप्त गर्नुहोस्।",
      descriptionEn: "Save daily and get attractive returns after 1 year.",
      rates: [
        { labelNe: "दैनिक रु. १००", labelEn: "Daily Rs. 100", valueNe: "१ वर्षपछि रु. ४०,०००", valueEn: "Rs. 40,000 after 1 year" },
        { labelNe: "दैनिक रु. २५०", labelEn: "Daily Rs. 250", valueNe: "१ वर्षपछि रु. १,००,०००", valueEn: "Rs. 100,000 after 1 year" },
        { labelNe: "दैनिक रु. ५००", labelEn: "Daily Rs. 500", valueNe: "१ वर्षपछि रु. २,००,०००", valueEn: "Rs. 200,000 after 1 year" },
        { labelNe: "दैनिक रु. १,०००", labelEn: "Daily Rs. 1,000", valueNe: "१ वर्षपछि रु. ४,००,०००", valueEn: "Rs. 400,000 after 1 year" }
      ],
      displayOrder: 1,
      published: true
    },
    {
      id: "sav2",
      slug: "child-savings",
      nameNe: "बाल बचत योजना",
      nameEn: "Child Savings Plan",
      durationNe: "१ देखि ५ वर्ष",
      durationEn: "1 to 5 Years",
      descriptionNe: "बालबालिकाको शिक्षा, स्वास्थ्य तथा उज्ज्वल भविष्यका लागि विशेष बचत योजना।",
      descriptionEn: "A special savings plan for children's education and bright future.",
      rates: [
        { labelNe: "१ वर्ष", labelEn: "1 year", valueNe: "८% वार्षिक ब्याज", valueEn: "8% annual interest" },
        { labelNe: "२ वर्ष", labelEn: "2 years", valueNe: "१०% वार्षिक ब्याज", valueEn: "10% annual interest" },
        { labelNe: "३ वर्ष", labelEn: "3 years", valueNe: "११% वार्षिक ब्याज", valueEn: "11% annual interest" }
      ],
      displayOrder: 2,
      published: true
    },
    {
      id: "sav3",
      slug: "women-savings",
      nameNe: "नारी बचत योजना",
      nameEn: "Women's Savings Plan",
      durationNe: "१ देखि ३ वर्ष",
      durationEn: "1 to 3 Years",
      descriptionNe: "महिलाहरूको आर्थिक सशक्तीकरण र सुरक्षित भविष्यका लागि विशेष योजना।",
      descriptionEn: "A special plan for women's economic empowerment.",
      rates: [
        { labelNe: "१ वर्ष", labelEn: "1 year", valueNe: "८% वार्षिक ब्याज", valueEn: "8% annual interest" },
        { labelNe: "२ वर्ष", labelEn: "2 years", valueNe: "१०% वार्षिक ब्याज", valueEn: "10% annual interest" },
        { labelNe: "३ वर्ष", labelEn: "3 years", valueNe: "११% वार्षिक ब्याज", valueEn: "11% annual interest" }
      ],
      displayOrder: 3,
      published: true
    }
  ],
  loanProducts: [
    {
      id: "loan1",
      slug: "concessional-loan",
      nameNe: "सहुलियतपूर्ण कर्जा",
      nameEn: "Concessional Loan",
      descriptionNe: "कृषक तथा उद्यम गर्न चाहने सदस्यहरूका लागि विशेष सहुलियतपूर्ण कर्जा।",
      descriptionEn: "Special concessional loan for agricultural members.",
      interestRate: "९.५% देखि १०.५% वार्षिक",
      processingFee: "०.५%",
      maxAmount: "रु. ५,००,००० सम्म",
      tenure: "१ देखि ५ वर्ष",
      eligibilityNe: "संस्थाको नियमित सेयरधनी सदस्य हुनुपर्ने",
      eligibilityEn: "Must be a active shareholder member",
      documentsNe: "नागरिकताको प्रतिलिपि, जग्गाधनी प्रमाणपुर्जा, फोटो",
      documentsEn: "Citizenship copy, land ownership certificate, photos",
      published: true
    },
    {
      id: "loan2",
      slug: "agriculture-loan",
      nameNe: "कृषि कर्जा",
      nameEn: "Agriculture Loan",
      descriptionNe: "खेतीपाती, तरकारी खेती, पशुपालन तथा कृषि औजारका लागि।",
      descriptionEn: "Loans for farming, livestock and agricultural tools.",
      interestRate: "१०% वार्षिक",
      processingFee: "०.७५%",
      maxAmount: "रु. १०,००,००० सम्म",
      tenure: "१ देखि ३ वर्ष",
      eligibilityNe: "कृषि व्यवसायमा संलग्न सेयरधनी",
      eligibilityEn: "Members involved in farming",
      documentsNe: "नागरिकता, लालपुर्जा, कृषि व्यवसाय दर्ता",
      documentsEn: "Citizenship, land certificate, business registration",
      published: true
    },
    {
      id: "loan3",
      slug: "business-loan",
      nameNe: "व्यवसायिक कर्जा",
      nameEn: "Business Loan",
      descriptionNe: "व्यापार व्यवसाय सञ्चालन तथा विस्तारका लागि।",
      descriptionEn: "Loan for small and medium business expansion.",
      interestRate: "११% देखि १२% वार्षिक",
      processingFee: "१%",
      maxAmount: "रु. १५,००,००० सम्म",
      tenure: "१ देखि ५ वर्ष",
      eligibilityNe: "व्यापार व्यवसाय दर्ता प्रमाणपत्र",
      eligibilityEn: "Valid business registration certificate",
      documentsNe: "पान/भ्याट दर्ता, लालपुर्जा, व्यवसाय योजना",
      documentsEn: "PAN/VAT, land ownership, business plan",
      published: true
    }
  ],
  notices: [
    {
      id: "n1",
      slug: "service-center-opening",
      titleNe: "नयाँ सेवा केन्द्र सञ्चालन सम्बन्धी महत्वपूर्ण सूचना!",
      titleEn: "Notice regarding opening of new Service Centre!",
      summaryNe: "हाम्रो संस्थाको नयाँ सेवा केन्द्र करैयामाई गाउँपालिका–८, नरही बजारमा मिति २०८३/०५/०१ देखि औपचारिक रूपमा सञ्चालनमा आउने व्यहोरा जानकारी गराइन्छ।",
      summaryEn: "Our new service centre at Karaiyamai-8, Narahi Bazaar will be inaugurated on 2083/05/01.",
      contentNe: "श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. को नयाँ सेवा केन्द्र करैयामाई गाउँपालिका–८, नरही बजारमा स्थापना गरी मिति २०८३/०५/०१ देखि सम्पूर्ण बचत तथा कर्जा सेवाहरू सञ्चालन हुनेछ।",
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date()
    }
  ],
  documents: [
    {
      id: "doc1",
      titleNe: "संस्थाको विनियमावली २०६८",
      titleEn: "Cooperative Bylaws 2068",
      descriptionNe: "श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि. को स्वीकृत विनियमावली।",
      descriptionEn: "Official bylaws of the institution.",
      category: "bylaws",
      fileUrl: "/docs/bylaws.pdf",
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  ],
  galleryAlbums: [
    { id: "g1", titleNe: "संस्थाका गतिविधिहरू", titleEn: "Cooperative Activities", published: true }
  ],
  galleryImages: [
    { id: "img1", albumId: "g1", imageUrl: "https://images.unsplash.com/photo-1595009545055-d5ec0bb8d732?auto=format&fit=crop&w=800&q=80", captionNe: "कृषक समूह अन्तरक्रिया कार्यक्रम", displayOrder: 1 }
  ]
};

let seeded = false;
export async function ensureSeeded() {
  if (seeded) return;
  try {
    const [existing] = await db.select({ n: count() }).from(s.siteSettings);
    if (existing.n > 0) { seeded = true; return; }
    await db.transaction(async (tx) => {
      await tx.insert(s.siteSettings).values(memoryStore.settings as any);
      await tx.insert(s.pageSections).values(memoryStore.sections as any);
      const centers = await tx.insert(s.serviceCenters).values(memoryStore.serviceCenters.map(c => ({
        nameNe: c.nameNe, nameEn: c.nameEn, addressNe: c.addressNe, addressEn: c.addressEn, phone: c.phone, openingDate: c.openingDate, displayOrder: c.displayOrder
      })) as any).returning();
      await tx.insert(s.committeeMembers).values(memoryStore.managementCommittee.map(m => ({ committee: "management", ...m })) as any);
      await tx.insert(s.committeeMembers).values(memoryStore.loanCommittee.map(m => ({ committee: "loan", ...m })) as any);
      await tx.insert(s.staff).values([
        { centerId: centers[0]?.id, nameNe: "उमेशप्रсад चौधरी", positionNe: "प्रबन्धक", positionEn: "Manager", phone: "9811841938", displayOrder: 1 },
        { centerId: centers[0]?.id, nameNe: "नन्दकिशोर चौधरी", positionNe: "कर्जा प्रमुख", positionEn: "Loan Officer", phone: "9746807473", displayOrder: 2 },
        { centerId: centers[0]?.id, nameNe: "पिंकीकुमारी चौधरी", positionNe: "बजार प्रतिनिधि", positionEn: "Market Representative", phone: "9821341274", displayOrder: 3 },
        { centerId: centers[1]?.id, nameNe: "कृष्ण शाह सोनार", positionNe: "प्रबन्धक", positionEn: "Manager", phone: "9855085395", displayOrder: 1 },
        { centerId: centers[1]?.id, nameNe: "ओमप्रकाश चौधरी", positionNe: "कर्जा प्रमुख", positionEn: "Loan Officer", phone: "9763349060", displayOrder: 2 },
        { centerId: centers[1]?.id, nameNe: "उषा ठाकुर", positionNe: "बजार प्रतिनिधि", positionEn: "Market Representative", phone: "9706181245", displayOrder: 3 }
      ] as any);
      await tx.insert(s.objectives).values(memoryStore.objectives as any);
      await tx.insert(s.services).values(memoryStore.services as any);
      await tx.insert(s.savingsPlans).values(memoryStore.savingsPlans as any);
      await tx.insert(s.loanProducts).values(memoryStore.loanProducts as any);
      await tx.insert(s.documents).values(memoryStore.documents as any);
    });
    seeded = true;
  } catch (err) {
    console.warn("DB offline or tables not created yet, utilizing in-memory institutional store fallback.");
    seeded = true;
  }
}

export async function settingsMap() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(s.siteSettings);
    if (rows.length) return Object.fromEntries(rows.map((x) => [x.key, x]));
  } catch (err) {}
  return Object.fromEntries(memoryStore.settings.map((x) => [x.key, x]));
}

export async function sectionsMap() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(s.pageSections);
    if (rows.length) return Object.fromEntries(rows.map((x) => [x.key, x]));
  } catch (err) {}
  return Object.fromEntries(memoryStore.sections.map((x) => [x.key, x]));
}

export async function publicData() {
  try {
    await ensureSeeded();
    const [settings, sections, serviceRows, savings, loans, noticeRows, centers, objectivesList] = await Promise.all([
      settingsMap(),
      sectionsMap(),
      db.select().from(s.services).where(eq(s.services.published, true)).orderBy(asc(s.services.displayOrder)),
      db.select().from(s.savingsPlans).where(eq(s.savingsPlans.published, true)).orderBy(asc(s.savingsPlans.displayOrder)),
      db.select().from(s.loanProducts).where(eq(s.loanProducts.published, true)),
      db.select().from(s.notices).where(eq(s.notices.status, "PUBLISHED")).orderBy(desc(s.notices.publishedAt)).limit(6),
      db.select().from(s.serviceCenters).where(eq(s.serviceCenters.active, true)).orderBy(asc(s.serviceCenters.displayOrder)),
      db.select().from(s.objectives).where(eq(s.objectives.enabled, true)).orderBy(asc(s.objectives.displayOrder)),
    ]);
    return {
      settings,
      sections,
      services: serviceRows.length ? serviceRows : memoryStore.services,
      savings: savings.length ? savings : memoryStore.savingsPlans,
      loans: loans.length ? loans : memoryStore.loanProducts,
      notices: noticeRows.length ? noticeRows : memoryStore.notices,
      centers: centers.length ? centers : memoryStore.serviceCenters,
      objectives: objectivesList.length ? objectivesList : memoryStore.objectives,
    };
  } catch (err) {
    return {
      settings: await settingsMap(),
      sections: await sectionsMap(),
      services: memoryStore.services,
      savings: memoryStore.savingsPlans,
      loans: memoryStore.loanProducts,
      notices: memoryStore.notices,
      centers: memoryStore.serviceCenters,
      objectives: memoryStore.objectives,
    };
  }
}

export async function committee(type: string) {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(s.committeeMembers)
      .where(and(eq(s.committeeMembers.committee, type), eq(s.committeeMembers.published, true)))
      .orderBy(asc(s.committeeMembers.displayOrder));
    if (rows.length) return rows;
  } catch (err) {}
  return (type === "management" ? memoryStore.managementCommittee : memoryStore.loanCommittee) as any[];
}

export async function getAllStaff() {
  try {
    await ensureSeeded();
    const staffList = await db.select().from(s.staff).where(eq(s.staff.active, true)).orderBy(asc(s.staff.displayOrder));
    const centers = await db.select().from(s.serviceCenters);
    const centerMap = new Map(centers.map((c) => [c.id, c.nameNe]));
    if (staffList.length) {
      return staffList.map((st) => ({
        ...st,
        centerName: st.centerId ? centerMap.get(st.centerId) || "प्रधान कार्यालय" : "प्रधान कार्यालय",
      }));
    }
  } catch (err) {}
  return memoryStore.staff;
}

export async function getAllNotices() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(s.notices).orderBy(desc(s.notices.createdAt));
    if (rows.length) return rows;
  } catch (err) {}
  return memoryStore.notices;
}

export async function getAllDocuments() {
  try {
    await ensureSeeded();
    const rows = await db.select().from(s.documents).orderBy(desc(s.documents.createdAt));
    if (rows.length) return rows;
  } catch (err) {}
  return memoryStore.documents;
}

export async function getAllGallery() {
  try {
    await ensureSeeded();
    const albums = await db.select().from(s.galleryAlbums).where(eq(s.galleryAlbums.published, true));
    const images = await db.select().from(s.galleryImages).orderBy(asc(s.galleryImages.displayOrder));
    if (albums.length) return { albums, images };
  } catch (err) {}
  return { albums: memoryStore.galleryAlbums, images: memoryStore.galleryImages };
}

export async function getAdminStats() {
  try {
    await ensureSeeded();
    const [
      [{ count: pendingApps }],
      [{ count: totalNotices }],
      [{ count: totalCenters }],
      [{ count: unreadMsgs }],
      [{ count: totalStaff }],
    ] = await Promise.all([
      db.select({ count: count() }).from(s.membershipApplications).where(eq(s.membershipApplications.status, "PENDING")),
      db.select({ count: count() }).from(s.notices),
      db.select({ count: count() }).from(s.serviceCenters),
      db.select({ count: count() }).from(s.contactMessages).where(eq(s.contactMessages.status, "UNREAD")),
      db.select({ count: count() }).from(s.staff),
    ]);
    return { pendingApps, totalNotices, totalCenters, unreadMsgs, totalStaff };
  } catch (err) {
    return { pendingApps: 0, totalNotices: memoryStore.notices.length, totalCenters: memoryStore.serviceCenters.length, unreadMsgs: 0, totalStaff: memoryStore.staff.length };
  }
}
