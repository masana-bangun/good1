import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import NumerologyResults from "./NumerologyResults";
import { Picker } from "@react-native-picker/picker";
import {
  normalisasiNama,
  hitungNilaiNumerologi,
  reduksiAngka,
  generateComplexNames,
  generateCombiNames,
  generateBalancedNames,
  generateSynchronizedNames,
  getPola,
  calculateGrafologiIndex,
  languageDatabases,
  complexState,
  resetComplexState,
  generateNameVariations,
  calculateMetricsForNameBasic,
  getDatabaseKeysForComplex,
  ComplexSearchState,
  combiState,
  resetCombiState,
  getDatabasePairsForCombi,
  CombiState,
  searchNameDictionary,
  getAvailableLanguages,
} from "../utils/numerologyUtils";
import { useTranslation } from "./MainApp";

// Vlookup table for G1-G9 descriptions (extracted from NumerologyResults)
const vlookupTable: { [key: number]: { [lang: string]: string } } = {
  1: {
    id: "😎 Mengembangkan Hobi dan kegemaran, hobi yang menghasilkan (keuangan, pujian) serta kehormatan",
    en: "😎 Develop hobbies and hobbies, hobbies that produce (financial, praise) and honor",
    fr: "😎 Développer des passe-temps et des passe-temps, des passe-temps qui produisent (financiers, louanges) et honorent",
    es: "😎 Desarrollar pasatiempos y aficiones, pasatiempos que produzcan (financieros, elogios) y honor.",
    ar: "😎 تنمية الهوايات والهوايات، هوايات تنتج (مالية، مديحاً) وتكريماً",
    zh: "😎 培养爱好和爱好，产生（财务、表扬）和荣誉的爱好",
    hi: "😎 शौक और शौक विकसित करें, ऐसे शौक जो (वित्तीय, प्रशंसा) और सम्मान पैदा करें",
  },
  3: {
    id: "😇 Senantiasalah ingat pada tuhan, Agamais, percaya pada kekuatan ruh, rohani dan spiritual",
    en: "😇 Always remember God, be religious, believe in the power of the spirit, spirit and spirit",
    fr: "😇 Souvenez-vous toujours de Dieu, soyez religieux, croyez en la puissance de l'esprit, de l'esprit et de l'esprit",
    es: "😇 Recuerda siempre a Dios, sé religioso, cree en el poder del espíritu, espíritu y espíritu.",
    ar: "😇 اذكر الله دائمًا، وكن متدينًا، وآمن بقوة الروح والروح والروح",
    zh: "😇 永远记住上帝，虔诚，相信精神、精神和精神的力量",
    hi: "😇 सदैव ईश्वर को याद रखें, धार्मिक बनें, आत्मा, आत्मा और आत्मा की शक्ति पर विश्वास रखें",
  },
  4: {
    id: "👮 Mengembangkan keteguhan, tegas berpengaruh, tetap bijaksana dalam kekuasaan",
    en: "👮 Develop firmness, be firm in influence, remain wise in power",
    fr: "👮 Développer la fermeté, être ferme en influence, rester sage en puissance",
    es: "👮 Desarrolla firmeza, sé firme en la influencia, permanece sabio en el poder.",
    ar: "👮 كن حازمًا، حازمًا في التأثير، حافظًا على الحكمة في السلطة",
    zh: "👮 培养坚定性，坚定影响力，保持明智的权力",
    hi: "👮 दृढ़ता विकसित करो, प्रभाव में दृढ़ रहो, शक्ति में बुद्धिमान रहो",
  },
  5: {
    id: "💑 Menjaga kehormatan diri/keluarga agar meraih kebahagiaan, kehormatan dan pernikahan",
    en: "💑 Maintain self/family honor in order to achieve happiness, honor and marriage",
    fr: "💑 Maintenir l'honneur de soi et de sa famille afin d'atteindre le bonheur, l'honneur et le mariage",
    es: "💑 Mantener el honor propio y familiar para lograr la felicidad, el honor y el matrimonio.",
    ar: "💑 الحفاظ على شرف الذات/العائلة لتحقيق السعادة والشرف والزواج",
    zh: "💑 维护自我/家庭荣誉，以获得幸福、荣誉和婚姻",
    hi: "💑खुशी, सम्मान और विवाह की प्राप्ति के लिए अपना/पारिवारिक सम्मान बनाए रखें",
  },
  6: {
    id: "🤹 Tetap berusaha melakukan yang terbaik, sepenuh hati hingga mudah meraih kesempurnaan",
    en: "🤹 Keep trying to do your best, wholeheartedly until you can easily achieve perfection",
    fr: "🤹 Continuez à essayer de faire de votre mieux, de tout cœur, jusqu'à ce que vous puissiez facilement atteindre la perfection.",
    es: "🤹 Sigue intentando hacer lo mejor que puedas, de todo corazón hasta que puedas alcanzar fácilmente la perfección.",
    ar: "🤹 استمر في محاولة بذل قصارى جهدك بكل إخلاص حتى تتمكن من تحقيق الكمال بسهولة",
    zh: "🤹 不断努力，全心全意，直到轻松达到完美",
    hi: "🤹जब तक आप आसानी से पूर्णता प्राप्त नहीं कर लेते, तब तक पूरे दिल से अपना सर्वश्रेष्ठ करने का प्रयास करते रहें",
  },
  7: {
    id: "😁 Teruslah mencari jalan kehidupan yang tentram, kebebasan, merdeka, bahagia dan kesempurnaan",
    en: "😁 Continue to look for a path of life that is peaceful, freedom, independence, happiness and perfection",
    fr: "😁 Continuez à chercher un chemin de vie paisible, libre, indépendant, heureux et parfait.",
    es: "😁 Sigue buscando un camino de vida que sea pacífico, libertad, independencia, felicidad y perfección.",
    ar: "😁 استمر في البحث عن طريق حياة يسوده السلام والحرية والاستقلال والسعادة والكمال",
    zh: "😁 继续寻找平静、自由、独立、幸福、完美的人生之路",
    hi: "😁जीवन के ऐसे मार्ग की तलाश जारी रखें जो शांतिपूर्ण, स्वतंत्रता, स्वतंत्रता, खुशी और पूर्णता हो",
  },
  10: {
    id: "🙃 Berlatih tekun dan beribadah/puasa agar berhasil baik, pintar dan beruntung",
    en: "🙃 Practice diligently and worship/fast to be successful, smart and lucky",
    fr: "🙃 Pratiquez avec diligence et adorez/jeûnez pour réussir, être intelligent et chanceux",
    es: "🙃 Practica diligentemente y adora/ayuna para tener éxito, ser inteligente y tener suerte.",
    ar: "🙃 تدرب باجتهاد وعبادة/سريعًا لتحقيق الرخاء والذكاء والحظ",
    zh: "🙃 勤奋修行，膜拜/斋戒，获得成功、聪明和幸运",
    hi: "🙃 सफल, चतुर और भाग्यशाली बनने के लिए लगन से अभ्यास करें और पूजा/उपवास करें",
  },
  12: {
    id: "🙂 Berusaha menjadi lebih bermanfaat dalam hal baik dan berguna",
    en: "🙂 Try to be more useful in good and useful ways",
    fr: "🙂 Essayez d'être plus utile de manière bonne et utile",
    es: "🙂 Trate de ser más útil de maneras buenas y útiles.",
    ar: "🙂 حاول أن تكون أكثر فائدة بطرق جيدة ومفيدة",
    zh: "🙂 尝试以好的和有用的方式变得更有用",
    hi: "🙂 अच्छे और उपयोगी तरीकों से अधिक उपयोगी बनने का प्रयास करें",
  },
  15: {
    id: "👳 Tetap menjaga ketaatan dalam ibadah, berperilaku baik budi dan sopan",
    en: "👳 Continue to maintain obedience in worship, behave kindly and politely",
    fr: "👳 Continuez à maintenir l'obéissance dans l'adoration, comportez-vous avec gentillesse et politesse",
    es: "👳 Continúe manteniendo la obediencia en la adoración, compórtese con amabilidad y cortesía.",
    ar: "👳المداومة على الطاعة في العبادة والتصرف بلطف وأدب",
    zh: "👳 继续保持敬拜中的服从，表现得友善和有礼貌",
    hi: "👳पूजा में आज्ञाकारिता बनाए रखें, नम्रता एवं नम्रता से व्यवहार करें",
  },
  16: {
    id: "👫 Tebarkan rasa Kecintaan dan teruslah berusaha meraih kebahagiaan",
    en: "👫 Spread love and keep trying to achieve happiness",
    fr: "👫 Répandez l'amour et continuez à essayer d'atteindre le bonheur",
    es: "👫 Difunde amor y sigue intentando alcanzar la felicidad.",
    ar: "👫 انشر الحب واستمر في المحاولة لتحقيق السعادة",
    zh: "👫 传播爱，不断努力获得幸福",
    hi: "👫 प्यार फैलाएं और खुशियां हासिल करने की कोशिश करते रहें",
  },
  21: {
    id: "🕵️ Penuhi diri dengan Semangat dalam hidup, bergerak, aktif, pengetahuan dan keindahan",
    en: "🕵️ Fill yourself with enthusiasm for life, movement, activity, knowledge and beauty",
    fr: "🕵️ Remplissez-vous d'enthousiasme pour la vie, le mouvement, l'activité, la connaissance et la beauté",
    es: "🕵️ Llénate de entusiasmo por la vida, el movimiento, la actividad, el conocimiento y la belleza.",
    ar: "🕵️ املأ نفسك بالحماس للحياة والحركة والنشاط والمعرفة والجمال",
    zh: "🕵️ 让自己充满对生活、运动、活动、知识和美的热情",
    hi: "🕵️जीवन, गति, गतिविधि, ज्ञान और सौंदर्य के प्रति अपने आप को उत्साह से भरें",
  },
  24: {
    id: "👣 Nikmati situasi wara-wiri, petualangan dan travelling",
    en: "👣 Enjoy the atmosphere of war, adventure and traveling",
    fr: "👣 Profitez de l'atmosphère de guerre, d'aventure et de voyage",
    es: "👣 Disfruta del ambiente de guerra, aventura y viajes.",
    ar: "👣 استمتع بأجواء الحرب والمغامرة والسفر",
    zh: "👣享受战争、冒险和旅行的氛围",
    hi: "👣 युद्ध, रोमांच और यात्रा के माहौल का आनंद लें",
  },
  25: {
    id: "🕌 Berupaya adil dalam memiliki pengaruh, pemerintahan dan kekuasaan",
    en: "🕌 Striving to be fair in having influence, government and power",
    fr: "🕌 S'efforcer d'être juste en matière d'influence, de gouvernement et de pouvoir",
    es: "🕌 Organice cuidadosamente su estilo de vida y sus patrones comerciales para lograr la prosperidad",
    ar: "🕌 رتب نمط حياتك وأنماط عملك بعناية لتحقيق الرخاء",
    zh: "🕌 精心安排你的生活方式和商业模式，实现繁荣",
    hi: "🕌समृद्धि प्राप्त करने के लिए अपनी जीवनशैली और व्यवसाय पैटर्न को सावधानीपूर्वक व्यवस्थित करें",
  },
  26: {
    id: "👩‍🔧 Jadikan sikap menjadi alamat baik dan berfaedah, berguna bagi banyak orang",
    en: "👩‍🔧 Turn your attitude into a good and useful address, useful for many people",
    fr: "👩‍🔧 Transformez votre attitude en une bonne adresse utile, utile à de nombreuses personnes",
    es: "👩‍🔧 Convierte tu actitud en un discurso bueno y útil, útil para muchas personas.",
    ar: "👩‍🔧 حول سلوكك إلى خطاب طيب ومفيد، مفيد لكثير من الناس",
    zh: "👩‍🔧 把你的态度变成一个好的有用的地址，对很多人有用",
    hi: "👩‍🔧अपने दृष्टिकोण को एक अच्छे और उपयोगी संबोधन में बदलें, जो कई लोगों के लिए उपयोगी हो",
  },
  27: {
    id: "💪 Kendalikan mental. Berjiwa gagah, kuat dan bersifat tabah",
    en: "💪 Control your mentality. Brave, strong and steadfast",
    fr: "💪 Contrôlez votre mentalité. Courageux, fort et inébranlable",
    es: "💪 Controla tu mentalidad. Valiente, fuerte y firme",
    ar: "💪 تحكم في عقليتك. شجاع وقوي وصامد",
    zh: "💪控制你的心态。勇敢、坚强、坚定",
    hi: "💪अपनी मानसिकता पर नियंत्रण रखें। बहादुर, मजबूत और दृढ़",
  },
  28: {
    id: "💞 Upayakan sikap kecintaan, ramah dan bijaklah. Tetap tidak berlebihan",
    en: "💞 Strive for an attitude of love, kindness and wisdom. Still don't overdo it",
    fr: "💞 Efforcez-vous d'adopter une attitude d'amour, de gentillesse et de sagesse. N'en faites toujours pas trop",
    es: "💞 Esfuérzate por tener una actitud de amor, bondad y sabiduría. Todavía no te excedas",
    ar: "💕اجتهد في التحلي بموقف الحب واللطف والحكمة. لا تزال لا تبالغي في ذلك",
    zh: "💞 努力追求爱、仁慈和智慧的态度。还是不要太过分",
    hi: "💞 प्रेम, दया और ज्ञान के दृष्टिकोण के लिए प्रयास करें। फिर भी इसे ज़्यादा मत करो",
  },
  29: {
    id: "✍️ Sepenuh hatilah ketika bergelut dalam administrasi dan surat-menyurat, analisis, sastrawan, content creator/ media",
    en: "✍️ Be wholehearted when working in administration and correspondence, analysis, writers, content creators/media",
    fr: "✍️ Soyez sans réserve lorsque vous travaillez dans l'administration et la correspondance, l'analyse, les rédacteurs, les créateurs de contenu/médias",
    es: "✍️ Sea incondicional cuando trabaje en administración y correspondencia, análisis, escritores, creadores de contenido/medios.",
    ar: "✍️ كن مخلصًا عند العمل في الإدارة والمراسلات والتحليل والكتاب ومنشئي المحتوى / الوسائط",
    zh: "✍️从事行政和通信、分析、作家、内容创作者/媒体工作时要全心全意",
    hi: "✍️ प्रशासन और पत्राचार, विश्लेषण, लेखक, सामग्री निर्माता/मीडिया में काम करते समय पूरे दिल से काम करें",
  },
  30: {
    id: "🤠 Berada dalam dunia sendiri, menata dunianya sendiri (nyata)/maya (meditasi, kontemplasi, spiritual)",
    en: "🤠 Being in your own world, organizing your own world (real)/virtual (meditation, contemplation, spiritual)",
    fr: "🤠 Être dans son propre monde, organiser son propre monde (réel)/virtuel (méditation, contemplation, spirituel)",
    es: "🤠 Estar en tu propio mundo, organizar tu propio mundo (real)/virtual (meditación, contemplación, espiritual)",
    ar: "🤠 أن تكون في عالمك الخاص، تنظم عالمك الخاص (الحقيقي)/الافتراضي (التأمل، التأمل، الروحي)",
    zh: "🤠 活在自己的世界里，组织自己的世界（真实）/虚拟（冥想、沉思、精神）",
    hi: "🤠अपनी दुनिया में रहना, अपनी दुनिया को व्यवस्थित करना (वास्तविक)/आभासी (ध्यान, चिंतन, आध्यात्मिक)",
  },
  31: {
    id: "🤗 Tanamkan sifat baik hati, kasih sayang dan berlatih menghasilkan kesempurnaan",
    en: "🤗 Cultivate kindness, compassion and practice to produce perfection",
    fr: "🤗 Cultivez la gentillesse, la compassion et la pratique pour produire la perfection",
    es: "🤗 Cultive la bondad, la compasión y practique para producir la perfección.",
    ar: "🤗 زراعة اللطف والرحمة والممارسة لإنتاج الكمال",
    zh: "🤗 培养慈悲心和修行以达到完美",
    hi: "🤗 दया, करुणा का विकास करें और पूर्णता उत्पन्न करने का अभ्यास करें",
  },
  32: {
    id: "💪 Potensi berfisik prima, bertenaga dan kekuatan (daya pengaruh besar)",
    en: "💪 Excellent physical potential, energy and strength (great influence)",
    fr: "💪 Excellent potentiel physique, énergie et force (grande influence)",
    es: "💪 Excelente potencial físico, energía y fuerza (gran influencia)",
    ar: "💪 إمكانات بدنية وطاقة وقوة ممتازة (تأثير كبير)",
    zh: "💪 出色的身体潜力、精力和力量（影响力很大）",
    hi: "💪 उत्कृष्ट शारीरिक क्षमता, ऊर्जा और शक्ति (महान प्रभाव)",
  },
  33: {
    id: "🙇 Cara atau ketelitian yang amat sangat, namun jaga keseimbangan perilaku dan pola",
    en: "🙇 Extremely thorough, but maintain a balance in behavior and patterns",
    fr: "🙇 Extrêmement minutieux, mais maintenir un équilibre dans les comportements et les modèles",
    es: "🙇 Extremadamente minucioso, pero mantiene un equilibrio en el comportamiento y los patrones.",
    ar: "🙇 دقيق للغاية، ولكن يحافظ على التوازن في السلوك والأنماط",
    zh: "🙇 非常彻底，但在行为和模式上保持平衡",
    hi: "🙇 अत्यंत गहन, लेकिन व्यवहार और पैटर्न में संतुलन बनाए रखें",
  },
  35: {
    id: "💞 Upayakan sikap kecintaan, ramah dan bijaklah. Tetap tidak berlebihan",
    en: "💞 Strive for an attitude of love, kindness and wisdom. Still don't overdo it",
    fr: "💞 Efforcez-vous d'adopter une attitude d'amour, de gentillesse et de sagesse. N'en faites toujours pas trop",
    es: "💞 Esfuérzate por tener una actitud de amor, bondad y sabiduría. Todavía no te excedas",
    ar: "💞اجتهد في التحلي بموقف الحب واللطف والحكمة. لا تزال لا تبالغي في ذلك",
    zh: "💞 努力追求爱、仁慈和智慧的态度。还是不要太过分",
    hi: "💞 प्रेम, दया और ज्ञान के दृष्टिकोण के लिए प्रयास करें। फिर भी इसे ज़्यादा मत करो",
  },
  36: {
    id: "👨‍👩‍👧‍👦 Ciptakan jalan hidup manis, hidup rukun dalam berumahtangga. Komunikasi intens",
    en: "👨‍👩‍👧‍👦 Create a sweet way of life, live in harmony in a household. Intense communication",
    fr: "👨‍👩‍👧‍👦 Créer une douceur de vivre, vivre en harmonie dans un foyer. Communication intense",
    es: "👨‍👩‍👧‍👦 Crea una dulce forma de vida, vive en armonía en un hogar. comunicación intensa",
    ar: "👨‍👩‍👧‍👦 اصنع أسلوب حياة جميل، وعش في وئام في المنزل. التواصل المكثف",
    zh: "👨‍👩‍👧‍👦创造甜蜜生活方式，和睦相处。密切沟通",
    hi: "👨‍👩‍👧‍👦 मधुर जीवन शैली बनाएं, घर-परिवार में सद्भाव से रहें। गहन संचार",
  },
  40: {
    id: "🕌 Potensi berpengaruh dalam lingkungan agamais, tokoh agama",
    en: "🕌 Potential influence in religious circles, religious figures",
    fr: "🕌 Influence potentielle dans les milieux religieux, personnalités religieuses",
    es: "🕌 Influencia potencial en círculos religiosos, figuras religiosas.",
    ar: "🕌 التأثير المحتمل في الأوساط الدينية والشخصيات الدينية",
    zh: "🕌 在宗教界、宗教人士中的潜在影响力",
    hi: "🕌धार्मिक मंडलियों, धार्मिक हस्तियों में संभावित प्रभाव",
  },
  43: {
    id: "💎 Jagalah selalu kebersihan dan kesucian diri baik jasmani maupun rohani",
    en: "💎 Always keep yourself clean and pure, both physically and spiritually",
    fr: "💎 Gardez-vous toujours propre et pur, tant physiquement que spirituellement",
    es: "💎 Mantente siempre limpio y puro, tanto física como espiritualmente.",
    ar: "💎 حافظ دائمًا على نظافتك ونقائك جسديًا وروحيًا",
    zh: "💎 始终保持自己身体和精神上的清洁和纯洁",
    hi: "💎खुद को हमेशा शारीरिक और आध्यात्मिक रूप से स्वच्छ और शुद्ध रखें",
  },
  44: {
    id: "🤗 Tanamkan sifat baik hati, kasih sayang dan berlatih menghasilkan kesempurnaan",
    en: "🤗 Cultivate kindness, compassion and practice to produce perfection",
    fr: "🤗 Cultivez la gentillesse, la compassion et la pratique pour produire la perfection",
    es: "🤗 Cultive la bondad, la compasión y practique para producir la perfección.",
    ar: "🤗 زراعة اللطف والرحمة والممارسة لإنتاج الكمال",
    zh: "🤗 培养慈悲心和修行以达到完美",
    hi: "🤗 दया, करुणा का विकास करें और पूर्णता उत्पन्न करने का अभ्यास करें",
  },
  45: {
    id: "💪 Potensi berfisik prima, bertenaga dan kekuatan (daya pengaruh besar)",
    en: "💪 Excellent physical potential, energy and strength (great influence)",
    fr: "💪 Excellent potentiel physique, énergie et force (grande influence)",
    es: "💪 Excelente potencial físico, energía y fuerza (gran influencia)",
    ar: "💪 إمكانات بدنية وطاقة وقوة ممتازة (تأثير كبير)",
    zh: "💪 出色的身体潜力、精力和力量（影响力很大）",
    hi: "💪 उत्कृष्ट शारीरिक क्षमता, ऊर्जा और शक्ति (महान प्रभाव)",
  },
  46: {
    id: "🤠 Keangkeran, memiliki pengaruh, pemerintahan dan potensi kekuasaan",
    en: "🤠 Awesomeness, having influence, governance and potential power",
    fr: "🤠 Génialité, avoir de l'influence, de la gouvernance et du pouvoir potentiel",
    es: "🤠 Genialidad, tener influencia, gobernanza y poder potencial.",
    ar: "🤠 الروعة وامتلاك النفوذ والحكم والقوة المحتملة",
    zh: "🤠 令人敬畏，有影响力、治理力和潜在权力",
    hi: "🤠अद्भुतता, प्रभाव, शासन और संभावित शक्ति से युक्त",
  },
  47: {
    id: "☺️ Berkasih sayang, sangat pengasih, pengampunan",
    en: "☺️ Compassionate, very loving, forgiving",
    fr: "☺️ Compatissant, très aimant, indulgent",
    es: "☺️ Compasivo, muy cariñoso, perdonador.",
    ar: "☺️ رحيم، محب للغاية، متسامح",
    zh: "☺️富有同情心，非常有爱心，宽容",
    hi: "☺️ दयालु, अत्यंत प्रेममय, क्षमाशील",
  },
  50: {
    id: "🙏 Yakinlah dengan tuhan atas pengampunan, kebebasan dan kemerdekaan",
    en: "🙏 Have faith in God for forgiveness, freedom and liberty",
    fr: "🙏 Ayez foi en Dieu pour le pardon, la liberté et la liberté",
    es: "🙏 Ten fe en Dios para el perdón, la libertad y la independencia.",
    ar: "🙏ثق بالله من أجل المغفرة والحرية والاستقلال",
    zh: "🙏 相信上帝的宽恕、自由和独立",
    hi: "🙏 क्षमा, मुक्ति और स्वतंत्रता के लिए ईश्वर पर विश्वास रखें",
  },
  70: {
    id: "🧗 Penuhi diri dengan Semangat dalam hidup, bergerak, aktif, pengetahuan dan keindahan",
    en: "🧗 Fill yourself with enthusiasm for life, movement, activity, knowledge and beauty",
    fr: "🧗 Remplissez-vous d'enthousiasme pour la vie, le mouvement, l'activité, la connaissance et la beauté",
    es: "🧗 Llénate de entusiasmo por la vida, el movimiento, la actividad, el conocimiento y la belleza.",
    ar: "🧗 املأ نفسك بالحماس للحياة والحركة والنشاط والمعرفة والجمال",
    zh: "🧗 让自己充满对生活、运动、活动、知识和美的热情",
    hi: "🧗जीवन, गति, गतिविधि, ज्ञान और सौंदर्य के प्रति अपने आप को उत्साह से भरें",
  },
  75: {
    id: "🏇 Berada dalam dunia sendiri, menata dunianya sendiri (nyata)/maya (meditasi, kontemplasi, spiritual)",
    en: "🏇 Being in your own world, organizing your own world (real)/virtual (meditation, contemplation, spiritual)",
    fr: "🏇 Être dans son propre monde, organiser son propre monde (réel)/virtuel (méditation, contemplation, spirituel)",
    es: "🏇 Estar en tu propio mundo, organizar tu propio mundo (real)/virtual (meditación, contemplación, espiritual)",
    ar: "🏇 أن تكون في عالمك الخاص، تنظم عالمك الخاص (الحقيقي)/الافتراضي (التأمل، التأمل، الروحي)",
    zh: "🏇 活在自己的世界里，组织自己的世界（真实）/虚拟（冥想、沉思、精神）",
    hi: "🏇 अपनी दुनिया में रहना, अपनी दुनिया को व्यवस्थित करना (वास्तविक)/आभासी (ध्यान, चिंतन, आध्यात्मिक)",
  },
  81: {
    id: "💃 Latih diri dalam Keahlian dalam ilmu seni, artistik, berjiwa seni",
    en: "💃 Train yourself in skills in art, artistic knowledge, artistic spirit",
    fr: "💃 Formez-vous aux compétences en art, aux connaissances artistiques, à l'esprit artistique",
    es: "💃 Fórmate en habilidades en el arte, conocimientos artísticos, espíritu artístico.",
    ar: "💃 درب نفسك على مهارات الفن والمعرفة الفنية والروح الفنية",
    zh: "💃 训练自己的艺术技能、艺术知识、艺术精神",
    hi: "💃 कला, कलात्मक ज्ञान, कलात्मक भावना में कौशल में खुद को प्रशिक्षित करें",
  },
  100: {
    id: "😇 Taatlah agar mendapat keberkahan yang maha Agung",
    en: "😇 Be obedient to get the greatest blessings",
    fr: "😇 Soyez obéissant pour obtenir les plus grandes bénédictions",
    es: "😇 Se obediente para obtener las mayores bendiciones.",
    ar: "😇 كن على طاعة لتحصل على أعظم النعم",
    zh: "😇 顺服才能得到最大的福报",
    hi: "😇सबसे बड़ा आशीर्वाद पाने के लिए आज्ञाकारी बनें",
  },
  120: {
    id: "🏝️ Semangat cinta negeri kampung halaman, gemar melakukan kebaikan",
    en: "🏝️ Spirit of love for your hometown, likes to do good",
    fr: "🏝️ Esprit d'amour pour ta ville natale, aime faire le bien",
    es: "🏝️Espíritu de amor por tu ciudad natal, le gusta hacer el bien",
    ar: "🏝️ روح محبة لمسقط رأسك، تحب فعل الخير",
    zh: "🏝️热爱家乡、喜欢行善的精神",
    hi: "🏝️ अपने गृहनगर के प्रति प्रेम की भावना, अच्छा करना पसंद करती है",
  },
  300: {
    id: "👼 Potensi hidup sentausa, kepercayaan dan sifat suka ilmu pengetahuan",
    en: "👼 Potential for eternal life, trust and love of knowledge",
    fr: "👼 Potentiel de vie éternelle, de confiance et d'amour de la connaissance",
    es: "👼 Potencial de vida eterna, confianza y amor al conocimiento.",
    ar: "👼إمكانية الحياة الأبدية والثقة وحب المعرفة",
    zh: "👼 永生的潜力、对知识的信任和热爱",
    hi: "👼अनन्त जीवन, विश्वास और ज्ञान के प्रेम की संभावना",
  },
  318: {
    id: "😇 Titah utusan yang maha Agung, menjaga amanah",
    en: "😇 The command of the Almighty Messenger, guarding the trust",
    fr: "😇 Le commandement du Messager Tout-Puissant, gardant la confiance",
    es: "😇 La orden del Mensajero Todopoderoso, guardando la confianza",
    ar: "😇امر الرسول تعالى بحراسة الأمانة",
    zh: "😇 全能使者的命令，守护信任",
    hi: "😇 सर्वशक्तिमान दूत का आदेश, अमानत की रखवाली",
  },
  360: {
    id: "🤝 Potensi pada lingkungan rumah, rombongan dan suka berkawan, bentuk komunitas",
    en: "🤝 Potential in the home environment, groups and friends, forming a community",
    fr: "🤝 Potentiel dans l'environnement familial, les groupes et les amis, formant une communauté",
    es: "🤝 Potencial en el entorno hogareño, grupos y amigos, formando comunidad",
    ar: "🤝الإمكانات في البيئة المنزلية والمجموعات والأصدقاء وتكوين مجتمع",
    zh: "🤝 家庭环境、团体和朋友的潜力，形成社区",
    hi: "🤝घरेलू माहौल, समूहों और दोस्तों में एक समुदाय बनाने की क्षमता",
  },
  365: {
    id: "👁️ Berpotensi menyukai dan mengamati alam, suka ilmu bintang (ilmu fisika alam)",
    en: "👁️ Potential to like and observe nature, likes star science (natural physics)",
    fr: "👁️ Potentiel d'aimer et d'observer la nature, aime la science des étoiles (physique naturelle)",
    es: "👁️ Potencial para gustarle y observar la naturaleza, le gusta la ciencia estelar (física natural)",
    ar: "👁️ إمكانية الإعجاب بالطبيعة ومراقبتها، يحب علم النجوم (الفيزياء الطبيعية)",
    zh: "👁️ 有喜欢和观察自然的潜力，喜欢明星科学（自然物理）",
    hi: "👁️ प्रकृति को पसंद करने और उसका अवलोकन करने की क्षमता, तारा विज्ञान (प्राकृतिक भौतिकी) पसंद है",
  },
  490: {
    id: "🕌 Potensi berpengaruh dalam lingkungan agamais, tokoh agama",
    en: "🕌 Potential influence in religious circles, religious figures",
    fr: "🕌 Influence potentielle dans les milieux religieux, personnalités religieuses",
    es: "🕌 Influencia potencial en círculos religiosos, figuras religiosas.",
    ar: "🕌 التأثير المحتمل في الأوساط الدينية والشخصيات الدينية",
    zh: "🕌 在宗教界、宗教人士中的潜在影响力",
    hi: "🕌धार्मिक मंडलियों, धार्मिक हस्तियों में संभावित प्रभाव",
  },
  500: {
    id: "💎 Jagalah selalu kebersihan dan kesucian diri baik jasmani maupun rohani",
    en: "💎 Always keep yourself clean and pure, both physically and spiritually",
    fr: "💎 Gardez-vous toujours propre et pur, tant physiquement que spirituellement",
    es: "💎 Mantente siempre limpio y puro, tanto física como espiritualmente.",
    ar: "💎 حافظ دائمًا على نظافتك ونقائك جسديًا وروحيًا",
    zh: "💎 始终保持自己身体和精神上的清洁和纯洁",
    hi: "💎खुद को हमेशा शारीरिक और आध्यात्मिक रूप से स्वच्छ और शुद्ध रखें",
  },
  600: {
    id: "🤗 Tanamkan sifat baik hati, kasih sayang dan berlatih menghasilkan kesempurnaan",
    en: "🤗 Cultivate kindness, compassion and practice to produce perfection",
    fr: "🤗 Cultivez la gentillesse, la compassion et la pratique pour produire la perfection",
    es: "🤗 Cultive la bondad, la compasión y practique para producir la perfección.",
    ar: "🤗 زراعة اللطف والرحمة والممارسة لإنتاج الكمال",
    zh: "🤗 培养慈悲心和修行以达到完美",
    hi: "🤗 दया, करुणा का विकास करें और पूर्णता उत्पन्न करने का अभ्यास करें",
  },
  700: {
    id: "💪 Potensi berfisik prima, bertenaga dan kekuatan (daya pengaruh besar)",
    en: "💪 Excellent physical potential, energy and strength (great influence)",
    fr: "💪 Excellent potentiel physique, énergie et force (grande influence)",
    es: "💪 Excelente potencial físico, energía y fuerza (gran influencia)",
    ar: "💪 إمكانات بدنية وطاقة وقوة ممتازة (تأثير كبير)",
    zh: "💪 出色的身体潜力、精力和力量（影响力很大）",
    hi: "💪 उत्कृष्ट शारीरिक क्षमता, ऊर्जा और शक्ति (महान प्रभाव)",
  },
  800: {
    id: "🤠 Keangkeran, memiliki pengaruh, pemerintahan dan potensi kekuasaan",
    en: "🤠 Awesomeness, having influence, governance and potential power",
    fr: "🤠 Génialité, avoir de l'influence, de la gouvernance et du pouvoir potentiel",
    es: "🤠 Genialidad, tener influencia, gobernanza y poder potencial.",
    ar: "🤠 الروعة وامتلاك النفوذ والحكم والقوة المحتملة",
    zh: "🤠 令人敬畏，有影响力、治理力和潜在权力",
    hi: "🤠अद्भुतता, प्रभाव, शासन और संभावित शक्ति से युक्त",
  },
  1000: {
    id: "👨‍👩‍👧‍👦 Ciptakan jalan hidup manis, hidup rukun dalam berumahtangga. Komunikasi intens",
    en: "👨‍👩‍👧‍👦 Create a sweet way of life, live in harmony in a household. Intense communication",
    fr: "👨‍👩‍👧‍👦 Créer une douceur de vivre, vivre en harmonie dans un foyer. Communication intense",
    es: "👨‍👩‍👧‍👦 Crea una dulce forma de vida, vive en armonía en un hogar. comunicación intensa",
    ar: "👨‍👩‍👧‍👦 اصنع أسلوب حياة جميل، وعش في وئام في المنزل. التواصل المكثف",
    zh: "👨‍👩‍👧‍👦创造甜蜜生活方式，和睦相处。密切沟通",
    hi: "👨‍👩‍👧‍👦 मधुर जीवन शैली बनाएं, घर-परिवार में सद्भाव से रहें। गहन संचार",
  },
};

// Available ANGKA values for dropdown
const AVAILABLE_ANGKA_VALUES = [
  1, 3, 4, 5, 6, 7, 10, 12, 15, 16, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
  35, 36, 37, 40, 43, 44, 45, 46, 47, 50, 70, 75, 81, 100, 120, 300, 318, 360,
  365, 490, 500, 600, 700, 800, 1000,
];

interface NameGeneratorProps {
  isPremium?: boolean;
  nameDatabase?: string[];
  analysisName?: string;
  analysisBirthdate?: Date;
  analysisGender?: "Male" | "Female";
}

// Sample name database for demonstration
const SAMPLE_NAMES = [
  "Aditya",
  "Budi",
  "Citra",
  "Dewi",
  "Eka",
  "Farhan",
  "Gita",
  "Hadi",
  "Indah",
  "Joko",
  "Kartika",
  "Lina",
  "Mira",
  "Nadia",
  "Oscar",
  "Putri",
  "Qori",
  "Rini",
  "Surya",
  "Tono",
  "Utami",
  "Vina",
  "Wayan",
  "Xavier",
  "Yanti",
  "Zainal",
  "Anisa",
  "Bayu",
  "Cahya",
  "Dian",
  "Emma",
  "Fajar",
  "Gading",
  "Hana",
  "Irfan",
  "Julia",
  "Krisna",
  "Laras",
  "Maya",
  "Nina",
];

// Sample language options with flag emojis
const LANGUAGE_OPTIONS = [
  { id: "id", name: "Indonesian", flag: "🇮🇩", countryName: "Indonesia" },
  { id: "en", name: "English", flag: "🇺🇸", countryName: "United States" },
  { id: "ar", name: "Arabic", flag: "🇸🇦", countryName: "Saudi Arabia" },
  { id: "jp", name: "Japanese", flag: "🇯🇵", countryName: "Japan" },
  { id: "cn", name: "Chinese", flag: "🇨🇳", countryName: "China" },
];

export default function NameGenerator({
  isPremium = true,
  nameDatabase = SAMPLE_NAMES,
  analysisName = "",
  analysisBirthdate = null,
  analysisGender = "Male",
}: NameGeneratorProps) {
  const [baseFirstName, setBaseFirstName] = useState(analysisName || "");
  const [targetNumber, setTargetNumber] = useState("1");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(["id"]);
  const [nameType, setNameType] = useState("personal"); // 'personal' or 'baby'
  const [generationMode, setGenerationMode] = useState<"combi" | "advanced">(
    "advanced",
  );

  // Advanced search states
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [userBirthdate, setUserBirthdate] = useState(
    analysisBirthdate
      ? `${analysisBirthdate.getDate().toString().padStart(2, "0")}/${(analysisBirthdate.getMonth() + 1).toString().padStart(2, "0")}/${analysisBirthdate.getFullYear()}`
      : "",
  );
  const [userGender, setUserGender] = useState<"Male" | "Female">(
    analysisGender || "Male",
  );
  const [targetHara, setTargetHara] = useState<string>("all");
  const [targetCoherence, setTargetCoherence] = useState("70");
  const [targetMomenSukses, setTargetMomenSukses] = useState("80");
  const [targetDeskripsi, setTargetDeskripsi] = useState("");
  const [startingLetter, setStartingLetter] = useState("");
  const [firstWordFilter, setFirstWordFilter] = useState("");
  const [secondWordFilter, setSecondWordFilter] = useState("");
  const [advancedResults, setAdvancedResults] = useState<any[]>([]);
  const [searchProgress, setSearchProgress] = useState("");
  const [isAdvancedSearching, setIsAdvancedSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Full screen and analysis states
  const [showFullScreenResults, setShowFullScreenResults] = useState(false);
  const [selectedNameForAnalysis, setSelectedNameForAnalysis] = useState<
    string | null
  >(null);
  const [selectedNameBirthdate, setSelectedNameBirthdate] =
    useState<Date | null>(null);
  const [selectedNameGender, setSelectedNameGender] = useState<
    "Male" | "Female"
  >("Male");

  // Combi search states
  const [combiResults, setCombiResults] = useState<any[]>([]);
  const [combiProgress, setCombiProgress] = useState("");
  const [isCombiSearching, setIsCombiSearching] = useState(false);
  const combiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Combi mode states
  const [targetPatterns, setTargetPatterns] = useState<{
    [key: string]: number;
  }>({});
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedPatternValue, setSelectedPatternValue] = useState<number>(1);

  // Target description dropdown states
  const [selectedTargetDescription, setSelectedTargetDescription] = useState<
    number | null
  >(null);
  const { t, language } = useTranslation();

  const toggleLanguage = (langId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langId)
        ? prev.filter((id) => id !== langId)
        : [...prev, langId],
    );
  };

  // Function to get description based on ANGKA value and language
  const getVlookupDescription = (value: number): string => {
    const entry = vlookupTable[value];
    if (!entry) return `G${value}: ${value}`;

    const langKey =
      language === "id"
        ? "id"
        : language === "en"
          ? "en"
          : language === "fr"
            ? "fr"
            : language === "es"
              ? "es"
              : language === "ar"
                ? "ar"
                : language === "zh"
                  ? "zh"
                  : language === "hi"
                    ? "hi"
                    : "en";
    return entry[langKey] || entry["en"] || `G${value}: ${value}`;
  };

  // Get dropdown options for target descriptions
  const getTargetDescriptionOptions = () => {
    return AVAILABLE_ANGKA_VALUES.map((value) => ({
      value,
      label: `${value} - ${getVlookupDescription(value).substring(0, 50)}...`,
      fullDescription: getVlookupDescription(value),
    }));
  };

  const handleAddTargetPattern = () => {
    if (selectedPattern && selectedPatternValue) {
      setTargetPatterns({
        ...targetPatterns,
        [selectedPattern]: selectedPatternValue,
      });
      setSelectedPattern(null);
      setSelectedPatternValue(1);
    }
  };

  const handleRemoveTargetPattern = (key: string) => {
    const newPatterns = { ...targetPatterns };
    delete newPatterns[key];
    setTargetPatterns(newPatterns);
  };

  const generateNames = () => {
    if (!baseFirstName.trim()) return;

    setIsGenerating(true);

    // Simulate processing time
    setTimeout(() => {
      let results: string[] = [];

      if (generationMode === "combi") {
        // For Combi mode, we'll use the advanced search modal instead
        setShowAdvancedModal(true);
        setIsGenerating(false);
        return;
      } else {
        // Generate names based on selected languages
        results = generateNamesForSelectedLanguages();
      }

      setGeneratedNames(results);
      setIsGenerating(false);
    }, 1000);
  };

  const generateNamesForSelectedLanguages = (): string[] => {
    const results: string[] = [];
    const targetNum = parseInt(targetNumber);

    // Generate names based on selected languages
    selectedLanguages.forEach((langId) => {
      const langOption = LANGUAGE_OPTIONS.find((opt) => opt.id === langId);
      if (langOption) {
        // Filter names from database based on language
        const filteredNames = nameDatabase.filter((name) => {
          // Simple logic to associate names with languages
          // This can be enhanced with actual language-specific databases
          if (langId === "id") return true; // Indonesian names (default)
          if (langId === "en") return /^[A-Za-z]+$/.test(name); // English names
          if (langId === "ar") return name.length > 4; // Arabic-style names
          if (langId === "jp") return name.length <= 5; // Japanese-style names
          if (langId === "cn") return name.length <= 4; // Chinese-style names
          return true;
        });

        // Generate variations with the base name
        filteredNames.slice(0, 5).forEach((name) => {
          if (baseFirstName.trim()) {
            results.push(`${baseFirstName.trim()} ${name}`);
            results.push(`${name} ${baseFirstName.trim()}`);
          } else {
            results.push(name);
          }
        });
      }
    });

    // Remove duplicates and limit results
    return [...new Set(results)].slice(0, 20);
  };

  const runAdvancedSearch = () => {
    if (generationMode === "combi") {
      runCombiSearch();
      return;
    }

    if (!baseFirstName.trim() || !userBirthdate.trim()) {
      alert("Nama dan Tanggal Lahir wajib diisi untuk pencarian lanjutan.");
      return;
    }

    // Calculate initial Life Path and Expression
    try {
      const [day, month, year] = userBirthdate.split("/").map(Number);
      if (!day || !month || !year) {
        alert("Format tanggal lahir tidak valid. Gunakan DD/MM/YYYY");
        return;
      }

      const birthdateObj = new Date(year, month - 1, day);
      const patterns = getPola(baseFirstName, birthdateObj, userGender);
      const initialLifePath = patterns.time;
      const initialExpression = patterns.destiny;

      if (!initialLifePath || !initialExpression) {
        alert("Gagal menghitung Life Path dan Expression. Periksa input Anda.");
        return;
      }

      setIsAdvancedSearching(true);
      setSearchProgress("Mempersiapkan pencarian lanjutan...");

      // Only reset results and state if this is a new search (not continuing)
      if (
        !complexState.isInitialized ||
        complexState.isFinishedCurrentSequence
      ) {
        setAdvancedResults([]);
        // Get database keys based on LP and Expression
        const dbKeys = getDatabaseKeysForComplex(
          initialLifePath,
          initialExpression,
        );
        if (dbKeys.length === 0) {
          setSearchProgress(
            `Tidak ada database yang sesuai untuk LP ${initialLifePath} & Exp ${initialExpression}`,
          );
          setIsAdvancedSearching(false);
          return;
        }

        // Reset complex state for new search
        resetComplexState();
        complexState.currentDatabaseList = [...dbKeys];
        // Map selected languages to language database keys
        const getLanguageKey = (langId: string) => {
          switch (langId) {
            case "id":
              return "id";
            case "en":
              return "en";
            case "ar":
              return "id"; // Arabic uses Indonesian database for now
            case "jp":
              return "id"; // Japanese uses Indonesian database for now
            case "cn":
              return "id"; // Chinese uses Indonesian database for now
            default:
              return "id";
          }
        };
        // Use the first selected language or default to "id"
        complexState.language = getLanguageKey(
          selectedLanguages.length > 0 ? selectedLanguages[0] : "id",
        );
        complexState.isInitialized = true;
      } else {
        // Continue from where we left off
        setSearchProgress("Melanjutkan pencarian dari posisi sebelumnya...");
      }

      // Start batch processing
      processAdvancedSearchBatch();
    } catch (error) {
      alert("Terjadi kesalahan dalam memproses data. Periksa input Anda.");
      setIsAdvancedSearching(false);
    }
  };

  const runCombiSearch = () => {
    if (!baseFirstName.trim() || !userBirthdate.trim()) {
      alert("Nama dan Tanggal Lahir wajib diisi untuk pencarian Combi.");
      return;
    }

    try {
      const [day, month, year] = userBirthdate.split("/").map(Number);
      if (!day || !month || !year) {
        alert("Format tanggal lahir tidak valid. Gunakan DD/MM/YYYY");
        return;
      }

      const birthdateObj = new Date(year, month - 1, day);
      const patterns = getPola(baseFirstName, birthdateObj, userGender);
      const initialLifePath = patterns.time;
      const initialExpression = patterns.destiny;

      if (!initialLifePath || !initialExpression) {
        alert("Gagal menghitung Life Path dan Expression. Periksa input Anda.");
        return;
      }

      setIsCombiSearching(true);
      setCombiProgress("Mempersiapkan pencarian Combi...");

      // Get database pairs for Combi
      const dbPairs = getDatabasePairsForCombi(
        initialLifePath,
        initialExpression,
      );
      if (dbPairs.length === 0) {
        setCombiProgress(
          `Tidak ada pasangan database Exp untuk LP ${initialLifePath} & Exp ${initialExpression}`,
        );
        setIsCombiSearching(false);
        return;
      }

      // Check if we need to reset or continue
      const currentDbPairListString = dbPairs
        .map((p) => `${p.db1Key}-${p.db2Key}`)
        .join(",");
      const previousDbPairListString = combiState.currentDatabasePairList
        .map((p) => `${p.db1Key}-${p.db2Key}`)
        .join(",");

      if (
        currentDbPairListString !== previousDbPairListString ||
        combiState.isFinishedCurrentPairSequence
      ) {
        resetCombiState();
        combiState.currentDatabasePairList = [...dbPairs];
        // Map selected languages to language database keys
        const getLanguageKey = (langId: string) => {
          switch (langId) {
            case "id":
              return "id";
            case "en":
              return "en";
            case "ar":
              return "id"; // Arabic uses Indonesian database for now
            case "jp":
              return "id"; // Japanese uses Indonesian database for now
            case "cn":
              return "id"; // Chinese uses Indonesian database for now
            default:
              return "id";
          }
        };
        // Use the first selected language or default to "id"
        combiState.language = getLanguageKey(
          selectedLanguages.length > 0 ? selectedLanguages[0] : "id",
        );
        combiState.isFinishedCurrentPairSequence = false;
        // Don't reset combiResults here to accumulate results
        // setCombiResults([]);
      }

      if (
        combiState.foundNamesThisOverallRun.length >= 10 &&
        !combiState.isFinishedCurrentPairSequence
      ) {
        combiState.foundNamesThisOverallRun = [];
      }

      // Start batch processing
      processCombiSearchBatch();
    } catch (error) {
      alert(
        "Terjadi kesalahan dalam memproses data Combi. Periksa input Anda.",
      );
      setIsCombiSearching(false);
    }
  };

  const processAdvancedSearchBatch = () => {
    const BATCH_PROCESSING_LIMIT_MS = 150;
    const MAX_RESULTS_PER_CLICK = 25;
    const startTime = Date.now();

    // Track how many new results we found in this batch
    const initialResultCount = advancedResults.length;
    let newResultsFound = 0;

    const processBatch = () => {
      while (
        newResultsFound < MAX_RESULTS_PER_CLICK &&
        !complexState.isFinishedCurrentSequence
      ) {
        if (Date.now() - startTime > BATCH_PROCESSING_LIMIT_MS) {
          setSearchProgress(
            `Memproses... Total variasi dicek: ${complexState.totalVariationsChecked}`,
          );
          searchTimeoutRef.current = setTimeout(processBatch, 0);
          return;
        }

        if (
          complexState.currentVariationIndex >=
          complexState.currentVariations.length
        ) {
          complexState.currentVariationIndex = 0;
          complexState.currentVariations = [];

          // Try all selected languages if multiple are selected
          let selectedDatabase = null;
          const currentDbKey =
            complexState.currentDatabaseList[
              complexState.currentDbIndexInSequence
            ];

          // If multiple languages are selected, try each one
          if (selectedLanguages.length > 1) {
            for (const langId of selectedLanguages) {
              const langKey =
                langId === "id" ? "id" : langId === "en" ? "en" : "id";
              if (
                languageDatabases[langKey] &&
                languageDatabases[langKey][currentDbKey]
              ) {
                selectedDatabase = languageDatabases[langKey][currentDbKey];
                break;
              }
            }
          } else {
            // Single language selection
            selectedDatabase =
              currentDbKey && languageDatabases[complexState.language]
                ? languageDatabases[complexState.language][currentDbKey]
                : null;
          }

          // Apply starting letter filter if specified (for advanced mode)
          if (selectedDatabase && startingLetter.trim()) {
            const filterLetter = startingLetter.trim().toUpperCase();
            selectedDatabase = selectedDatabase.filter((word: string) =>
              word.toUpperCase().startsWith(filterLetter),
            );
          }

          while (
            !selectedDatabase ||
            complexState.currentIndexInDb >= selectedDatabase.length
          ) {
            complexState.currentIndexInDb = 0;
            complexState.currentDbIndexInSequence++;
            if (
              complexState.currentDbIndexInSequence >=
              complexState.currentDatabaseList.length
            ) {
              complexState.isFinishedCurrentSequence = true;
              break;
            }
            const nextDbKey =
              complexState.currentDatabaseList[
                complexState.currentDbIndexInSequence
              ];

            // Try all selected languages for the next database
            selectedDatabase = null;
            if (selectedLanguages.length > 1) {
              for (const langId of selectedLanguages) {
                const langKey =
                  langId === "id" ? "id" : langId === "en" ? "en" : "id";
                if (
                  languageDatabases[langKey] &&
                  languageDatabases[langKey][nextDbKey]
                ) {
                  selectedDatabase = languageDatabases[langKey][nextDbKey];
                  break;
                }
              }
            } else {
              selectedDatabase =
                nextDbKey && languageDatabases[complexState.language]
                  ? languageDatabases[complexState.language][nextDbKey]
                  : null;
            }

            // Apply starting letter filter if specified
            if (selectedDatabase && startingLetter.trim()) {
              const filterLetter = startingLetter.trim().toUpperCase();
              selectedDatabase = selectedDatabase.filter((word: string) =>
                word.toUpperCase().startsWith(filterLetter),
              );
            }

            if (!selectedDatabase || selectedDatabase.length === 0) {
              continue;
            }
          }

          if (complexState.isFinishedCurrentSequence) break;

          const wordToAdd = selectedDatabase[complexState.currentIndexInDb];
          if (wordToAdd) {
            complexState.currentVariations = generateNameVariations(
              baseFirstName,
              [wordToAdd],
            );
          }
          complexState.currentIndexInDb++;
        }

        if (
          complexState.currentVariationIndex <
          complexState.currentVariations.length
        ) {
          const newName =
            complexState.currentVariations[complexState.currentVariationIndex];
          complexState.totalVariationsChecked++;
          const metrics = calculateMetricsForNameBasic(
            newName,
            userBirthdate,
            userGender,
          );

          if (metrics) {
            let match = true;

            // Check Hara filter
            if (targetHara !== "all") {
              const targetHaraNum = parseInt(targetHara);
              if (
                ![1, 2, 3, 4, 6].includes(targetHaraNum) ||
                metrics.hara !== targetHaraNum
              ) {
                match = false;
              }
            } else {
              if (![1, 2, 3, 4, 6].includes(metrics.hara)) {
                match = false;
              }
            }

            // Check Synchronize (locked at 100%)
            const syncNum = parseFloat(
              metrics.sync.toString().replace("%", ""),
            );
            if (syncNum < 100) match = false;

            // Check Coherence (convert percentage string to number)
            const targetCoherenceVal = parseFloat(targetCoherence);
            const coherenceNum = parseFloat(metrics.coherence.replace("%", ""));
            if (coherenceNum < targetCoherenceVal) match = false;

            // Check Momen Sukses (handle both percentage and decimal formats)
            const targetMomenSuksesVal = parseFloat(targetMomenSukses);
            let momenSuksesNum = 0;
            if (metrics.momenSukses === "1+") {
              momenSuksesNum = 100; // Treat "1+" as 100%
            } else {
              const momenSuksesFloat = parseFloat(metrics.momenSukses);
              // Convert decimal to percentage (multiply by 100)
              momenSuksesNum = momenSuksesFloat * 100;
            }
            if (momenSuksesNum < targetMomenSuksesVal) match = false;

            // Check Grafologi (locked at 100%)
            if (metrics.grafologiIndex !== "100%") match = false;

            // Check Target Deskripsi
            if (targetDeskripsi && metrics.saranAngka) {
              const targetAngkaSaran = parseInt(targetDeskripsi);
              if (!metrics.saranAngka.includes(targetAngkaSaran)) match = false;
            }

            if (match) {
              const newResult = {
                name: newName,
                hara: metrics.hara,
                sync: metrics.sync,
                coherence: metrics.coherence,
                synergize: metrics.synergize,
                productive: metrics.productive,
                momenSukses: metrics.momenSukses,
                grafologiIndex: metrics.grafologiIndex,
                saranAngka: metrics.saranAngka,
              };

              // Check if this result already exists to avoid duplicates
              const isDuplicate = advancedResults.some(
                (result) => result.name === newName,
              );
              if (!isDuplicate) {
                complexState.foundNamesThisOverallRun.push(newResult);
                newResultsFound++;
              }
            }
          }
          complexState.currentVariationIndex++;
        }
      }

      // Update results with all found names (previous + new)
      setAdvancedResults([...complexState.foundNamesThisOverallRun]);

      if (complexState.isFinishedCurrentSequence) {
        if (complexState.foundNamesThisOverallRun.length === 0) {
          setSearchProgress(
            `Pencarian selesai. Tidak ada nama yang cocok dari ${complexState.totalVariationsChecked} variasi.`,
          );
        } else {
          setSearchProgress(
            `Pencarian selesai. Total ditemukan ${complexState.foundNamesThisOverallRun.length} nama dari ${complexState.totalVariationsChecked} variasi.`,
          );
        }
        setIsAdvancedSearching(false);
      } else if (newResultsFound >= MAX_RESULTS_PER_CLICK) {
        setSearchProgress(
          `Menampilkan ${complexState.foundNamesThisOverallRun.length} hasil total. Klik lagi untuk hasil berikutnya.`,
        );
        setIsAdvancedSearching(false);
      } else {
        setSearchProgress(
          `Melanjutkan pencarian... Total ditemukan ${complexState.foundNamesThisOverallRun.length} dari ${complexState.totalVariationsChecked} variasi.`,
        );
        searchTimeoutRef.current = setTimeout(processBatch, 0);
      }
    };

    searchTimeoutRef.current = setTimeout(processBatch, 20);
  };

  const processCombiSearchBatch = () => {
    const BATCH_PROCESSING_LIMIT_MS = 150;
    const MAX_RESULTS_PER_CLICK = 50; // Generate 50 results per click
    const clickStartTime = Date.now();
    const startTime = Date.now();

    // Track combinations processed in this click
    let combinationsProcessedThisClick = 0;
    let newResultsFound = 0;

    const processBatch = () => {
      while (
        newResultsFound < MAX_RESULTS_PER_CLICK &&
        !combiState.isFinishedCurrentPairSequence
      ) {
        if (Date.now() - startTime > BATCH_PROCESSING_LIMIT_MS) {
          setCombiProgress(
            `Memproses... Hasil baru klik ini: ${newResultsFound}/${MAX_RESULTS_PER_CLICK}, Kombinasi klik ini: ${combinationsProcessedThisClick.toLocaleString()}, Total hasil: ${combiState.foundNamesThisOverallRun.length}, Total kombinasi: ${combiState.totalCombinationsChecked.toLocaleString()}`,
          );
          combiTimeoutRef.current = setTimeout(processBatch, 0);
          return;
        }

        if (
          combiState.currentVariationIndex >=
          combiState.currentVariations.length
        ) {
          combiState.currentVariationIndex = 0;
          combiState.currentVariations = [];

          const currentDbPair =
            combiState.currentDatabasePairList[
              combiState.currentDbPairIndexInSequence
            ];
          if (!currentDbPair) {
            combiState.isFinishedCurrentPairSequence = true;
            break;
          }

          // Try all selected languages if multiple are selected
          let db1 = null;
          let db2 = null;

          if (selectedLanguages.length > 1) {
            // Try each selected language until we find databases
            for (const langId of selectedLanguages) {
              const langKey =
                langId === "id" ? "id" : langId === "en" ? "en" : "id";
              if (languageDatabases[langKey]) {
                const tempDb1 =
                  languageDatabases[langKey][currentDbPair.db1Key];
                const tempDb2 =
                  languageDatabases[langKey][currentDbPair.db2Key];
                if (tempDb1 && tempDb2) {
                  db1 = tempDb1;
                  db2 = tempDb2;
                  break;
                }
              }
            }
          } else {
            // Single language selection
            db1 =
              languageDatabases[combiState.language]?.[currentDbPair.db1Key];
            db2 =
              languageDatabases[combiState.language]?.[currentDbPair.db2Key];
          }

          // Apply starting letter filters if specified (for combi mode)
          if (firstWordFilter.trim()) {
            const filterLetter = firstWordFilter.trim().toUpperCase();
            if (db1) {
              db1 = db1.filter((word: string) =>
                word.toUpperCase().startsWith(filterLetter),
              );
            }
          }
          if (secondWordFilter.trim()) {
            const filterLetter = secondWordFilter.trim().toUpperCase();
            if (db2) {
              db2 = db2.filter((word: string) =>
                word.toUpperCase().startsWith(filterLetter),
              );
            }
          }

          while (
            !db1 ||
            !db2 ||
            db1.length === 0 ||
            db2.length === 0 ||
            combiState.currentWord1IndexInDb >= db1.length
          ) {
            if (
              !db1 ||
              db1.length === 0 ||
              combiState.currentWord1IndexInDb >= db1.length
            ) {
              combiState.currentWord1IndexInDb = 0;
              combiState.currentWord2IndexInDb = 0;
              combiState.currentDbPairIndexInSequence++;
              if (
                combiState.currentDbPairIndexInSequence >=
                combiState.currentDatabasePairList.length
              ) {
                combiState.isFinishedCurrentPairSequence = true;
                break;
              }
              const nextDbPair =
                combiState.currentDatabasePairList[
                  combiState.currentDbPairIndexInSequence
                ];
              if (!nextDbPair) {
                combiState.isFinishedCurrentPairSequence = true;
                break;
              }

              // Try all selected languages for the next database pair
              db1 = null;
              db2 = null;
              if (selectedLanguages.length > 1) {
                for (const langId of selectedLanguages) {
                  const langKey =
                    langId === "id" ? "id" : langId === "en" ? "en" : "id";
                  if (languageDatabases[langKey]) {
                    const tempDb1 =
                      languageDatabases[langKey][nextDbPair.db1Key];
                    const tempDb2 =
                      languageDatabases[langKey][nextDbPair.db2Key];
                    if (tempDb1 && tempDb2) {
                      db1 = tempDb1;
                      db2 = tempDb2;
                      break;
                    }
                  }
                }
              } else {
                db1 =
                  languageDatabases[combiState.language]?.[nextDbPair.db1Key];
                db2 =
                  languageDatabases[combiState.language]?.[nextDbPair.db2Key];
              }

              // Apply starting letter filter if specified
              if (startingLetter.trim()) {
                const filterLetter = startingLetter.trim().toUpperCase();
                if (db1) {
                  db1 = db1.filter((word: string) =>
                    word.toUpperCase().startsWith(filterLetter),
                  );
                }
                if (db2) {
                  db2 = db2.filter((word: string) =>
                    word.toUpperCase().startsWith(filterLetter),
                  );
                }
              }
            } else {
              combiState.currentWord2IndexInDb = 0;
              combiState.currentWord1IndexInDb++;
              if (combiState.currentWord1IndexInDb >= db1.length) {
                continue;
              }
            }
            if (combiState.isFinishedCurrentPairSequence) break;
          }
          if (combiState.isFinishedCurrentPairSequence) break;

          const word1 = db1[combiState.currentWord1IndexInDb];
          const word2 = db2[combiState.currentWord2IndexInDb];

          if (word1 && word2) {
            combiState.currentVariations = generateNameVariations(
              baseFirstName,
              [word1, word2],
            );
          }

          combiState.currentWord2IndexInDb++;
          if (combiState.currentWord2IndexInDb >= db2.length) {
            combiState.currentWord2IndexInDb = 0;
            combiState.currentWord1IndexInDb++;
          }
        }

        if (
          combiState.currentVariationIndex < combiState.currentVariations.length
        ) {
          const newName =
            combiState.currentVariations[combiState.currentVariationIndex];
          combiState.totalCombinationsChecked++;
          combinationsProcessedThisClick++;
          const metrics = calculateMetricsForNameBasic(
            newName,
            userBirthdate,
            userGender,
          );

          if (metrics) {
            let match = true;

            // Apply filters
            const validHaraValues =
              targetHara === "all" ? [1, 2, 3, 4, 6] : [parseInt(targetHara)];
            if (!validHaraValues.includes(metrics.hara)) match = false;

            // Check Synchronize (locked at 100%)
            const syncNum = parseFloat(
              metrics.sync.toString().replace("%", ""),
            );
            if (syncNum < 100) match = false;

            // Check Coherence (convert percentage string to number)
            const targetCoherenceVal = parseFloat(targetCoherence);
            const coherenceNum = parseFloat(metrics.coherence.replace("%", ""));
            if (coherenceNum < targetCoherenceVal) match = false;

            // Check Momen Sukses (handle both percentage and decimal formats)
            const targetMomenSuksesVal = parseFloat(targetMomenSukses);
            let momenSuksesNum = 0;
            if (metrics.momenSukses === "1+") {
              momenSuksesNum = 100; // Treat "1+" as 100%
            } else {
              const momenSuksesFloat = parseFloat(metrics.momenSukses);
              // Convert decimal to percentage (multiply by 100)
              momenSuksesNum = momenSuksesFloat * 100;
            }
            if (momenSuksesNum < targetMomenSuksesVal) match = false;

            // Check Grafologi (locked at 100%)
            if (metrics.grafologiIndex !== "100%") match = false;

            if (targetDeskripsi && metrics.saranAngka) {
              const targetAngkaSaran = parseInt(targetDeskripsi);
              if (!metrics.saranAngka.includes(targetAngkaSaran)) match = false;
            }

            if (match) {
              const isDuplicate = combiState.foundNamesThisOverallRun.some(
                (result) => result.name === newName,
              );
              if (!isDuplicate) {
                const newResult = {
                  name: newName,
                  hara: metrics.hara,
                  sync: metrics.sync,
                  coherence: metrics.coherence,
                  synergize: metrics.synergize,
                  productive: metrics.productive,
                  momenSukses: metrics.momenSukses,
                  grafologiIndex: metrics.grafologiIndex,
                  saranAngka: metrics.saranAngka,
                };
                combiState.foundNamesThisOverallRun.push(newResult);
                newResultsFound++;
                // Update results immediately when found
                setCombiResults([...combiState.foundNamesThisOverallRun]);
              }
            }
          }
          combiState.currentVariationIndex++;
        }
      }

      // Results are updated immediately when found, no need to update here again

      if (combiState.isFinishedCurrentPairSequence) {
        if (combiState.foundNamesThisOverallRun.length === 0) {
          setCombiProgress(
            `Pencarian Combi selesai. Tidak ada nama yang cocok dari ${combiState.totalCombinationsChecked.toLocaleString()} kombinasi.`,
          );
        } else {
          setCombiProgress(
            `Pencarian Combi selesai. Total ditemukan ${combiState.foundNamesThisOverallRun.length} nama dari ${combiState.totalCombinationsChecked.toLocaleString()} kombinasi.`,
          );
        }
        setIsCombiSearching(false);
      } else if (newResultsFound >= MAX_RESULTS_PER_CLICK) {
        setCombiProgress(
          `Berhasil menemukan ${newResultsFound} hasil baru! Kombinasi dicek klik ini: ${combinationsProcessedThisClick.toLocaleString()}, Total hasil: ${combiState.foundNamesThisOverallRun.length} nama. Total kombinasi dicek: ${combiState.totalCombinationsChecked.toLocaleString()}. Klik lagi untuk 50 hasil berikutnya.`,
        );
        setIsCombiSearching(false);
      } else {
        setCombiProgress(
          `Melanjutkan pencarian Combi... Hasil baru: ${newResultsFound}/${MAX_RESULTS_PER_CLICK}, Kombinasi klik ini: ${combinationsProcessedThisClick.toLocaleString()}, Total hasil: ${combiState.foundNamesThisOverallRun.length}, Total kombinasi: ${combiState.totalCombinationsChecked.toLocaleString()}`,
        );
        combiTimeoutRef.current = setTimeout(processBatch, 0);
      }
    };

    combiTimeoutRef.current = setTimeout(processBatch, 20);
  };

  const stopAdvancedSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    if (combiTimeoutRef.current) {
      clearTimeout(combiTimeoutRef.current);
      combiTimeoutRef.current = null;
    }
    setIsAdvancedSearching(false);
    setIsCombiSearching(false);
    setSearchProgress("Pencarian dihentikan.");
    setCombiProgress("Pencarian Combi dihentikan.");
  };

  const clearAdvancedResults = () => {
    setAdvancedResults([]);
    resetComplexState();
    setSearchProgress("");
  };

  const clearCombiResults = () => {
    setCombiResults([]);
    resetCombiState();
    setCombiProgress("");
  };

  const handleNameClick = (name: string) => {
    if (!userBirthdate.trim()) {
      alert("Tanggal lahir diperlukan untuk analisis nama.");
      return;
    }

    try {
      const [day, month, year] = userBirthdate.split("/").map(Number);
      if (!day || !month || !year) {
        alert("Format tanggal lahir tidak valid. Gunakan DD/MM/YYYY");
        return;
      }

      const birthdateObj = new Date(year, month - 1, day);
      setSelectedNameForAnalysis(name);
      setSelectedNameBirthdate(birthdateObj);
      setSelectedNameGender(userGender);
    } catch (error) {
      alert("Terjadi kesalahan dalam memproses tanggal lahir.");
    }
  };

  const handleBackToResults = () => {
    setSelectedNameForAnalysis(null);
    setSelectedNameBirthdate(null);
  };

  const handleShowFullScreenResults = () => {
    setShowFullScreenResults(true);
  };

  const handleBackToModal = () => {
    setShowFullScreenResults(false);
  };

  const renderGenerationModeSelector = () => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1 font-medium">Generation Mode</Text>
      <View className="flex-row">
        <TouchableOpacity
          className={`flex-1 py-2 px-2 rounded-md items-center mr-1 ${generationMode === "advanced" ? "bg-purple-600" : "bg-gray-200"}`}
          onPress={() => setGenerationMode("advanced")}
          disabled={false}
        >
          <Text
            className={
              generationMode === "advanced" ? "text-white" : "text-gray-700"
            }
            style={{ fontSize: 10, textAlign: "center" }}
          >
            Add One Word
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 px-2 rounded-md items-center ${generationMode === "combi" ? "bg-purple-600" : "bg-gray-200"}`}
          onPress={() => setGenerationMode("combi")}
          disabled={false}
        >
          <Text
            className={
              generationMode === "combi" ? "text-white" : "text-gray-700"
            }
            style={{ fontSize: 10, textAlign: "center" }}
          >
            Add Some Word
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCombiModeInputs = () => {
    if (generationMode !== "combi") return null;

    return (
      <View className="mb-4 p-3 bg-purple-50 rounded-lg">
        <Text className="text-purple-800 font-medium mb-2">
          Advanced Combination Generator (Combi)
        </Text>
        <Text className="text-gray-600 text-xs mb-2">
          Menambahkan DUA kata tambahan ke nama asli dengan penempatan dinamis.
          Database sumber kata (Exp) dipilih otomatis berdasarkan Life Path &
          Expression Anda.
        </Text>
        <Text className="text-gray-600 text-xs">
          Klik tombol "Generate Names" untuk mencari kombinasi nama berikutnya.
          Sistem akan menganalisis berbagai posisi penempatan kata
          (bersebelahan, terpisah, dll.).
        </Text>
      </View>
    );
  };

  return (
    <ScrollView className="bg-white rounded-lg shadow-md">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center mb-6 text-purple-800">
          {nameType === "personal"
            ? "Personal Name Optimizer"
            : "Baby Name Generator"}
        </Text>

        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-md items-center ${nameType === "personal" ? "bg-purple-600" : "bg-gray-200"}`}
            onPress={() => setNameType("personal")}
          >
            <Text
              className={
                nameType === "personal" ? "text-white" : "text-gray-700"
              }
            >
              Personal Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-md items-center ml-2 ${nameType === "baby" ? "bg-purple-600" : "bg-gray-200"}`}
            onPress={() => setNameType("baby")}
          >
            <Text
              className={nameType === "baby" ? "text-white" : "text-gray-700"}
            >
              Baby Name
            </Text>
          </TouchableOpacity>
        </View>

        {renderGenerationModeSelector()}

        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">
            {nameType === "personal"
              ? "Your First Name"
              : "Family Name (Optional)"}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-gray-50"
            placeholder={
              nameType === "personal"
                ? "Enter your first name"
                : "Enter family name (optional)"
            }
            value={baseFirstName}
            onChangeText={setBaseFirstName}
          />
        </View>

        {renderCombiModeInputs()}
        {renderAdvancedModeInputs()}

        <View className="mb-6">
          <Text className="text-gray-700 mb-3 font-medium text-center text-lg">
            Name Origin Selection
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {LANGUAGE_OPTIONS.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                className={`m-2 px-4 py-3 rounded-full items-center justify-center flex-row ${selectedLanguages.includes(lang.id) ? "bg-purple-600 border-2 border-purple-700 shadow-lg" : "bg-white border-2 border-gray-300 shadow-md"} ${!isPremium && lang.id !== "id" ? "opacity-50" : ""}`}
                onPress={() => toggleLanguage(lang.id)}
                disabled={false}
                style={{
                  elevation: selectedLanguages.includes(lang.id) ? 6 : 3,
                  minWidth: 120,
                }}
              >
                <Text style={{ fontSize: 24, marginRight: 8 }}>
                  {lang.flag}
                </Text>
                <Text
                  className={`font-medium text-sm ${selectedLanguages.includes(lang.id) ? "text-white" : "text-gray-700"}`}
                  numberOfLines={1}
                >
                  {lang.countryName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-center text-xs text-gray-500 mt-2">
            Select one or more countries for name generation
          </Text>
        </View>

        {
          <TouchableOpacity
            className="bg-purple-600 py-3 px-4 rounded-md items-center mb-6"
            onPress={
              generationMode === "advanced" || generationMode === "combi"
                ? () => setShowAdvancedModal(true)
                : generateNames
            }
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium text-lg">
                {generationMode === "advanced" || generationMode === "combi"
                  ? generationMode === "combi"
                    ? "Jalankan/Lanjut Combi"
                    : "Advanced Search"
                  : "Generate Names"}
              </Text>
            )}
          </TouchableOpacity>
        }

        {/* Regular Generated Names for other modes */}
        {generatedNames.length > 0 && generationMode !== "advanced" && (
          <View>
            <Text className="text-xl font-semibold mb-2">Suggested Names</Text>
            <Text className="text-sm text-gray-600 mb-3">
              Generated from:{" "}
              {selectedLanguages
                .map(
                  (langId) =>
                    LANGUAGE_OPTIONS.find((opt) => opt.id === langId)?.name,
                )
                .filter(Boolean)
                .join(", ")}
            </Text>
            <FlatList
              data={generatedNames}
              keyExtractor={(item, index) => `name-${index}`}
              renderItem={({ item }) => (
                <View className="py-3 px-4 bg-purple-50 rounded-lg mb-2">
                  <Text className="text-lg text-purple-800 font-medium">
                    {item}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-gray-500 text-center py-4">
                  No matching names found. Try different parameters.
                </Text>
              }
            />
          </View>
        )}
      </View>

      {/* Advanced Search Modal */}
      <Modal
        visible={showAdvancedModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdvancedModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90%]">
            <ScrollView>
              <Text className="text-lg font-bold text-center mb-4 text-purple-800">
                {generationMode === "combi"
                  ? "Advanced Combination Generator (Combi)"
                  : "Advanced Name Search"}
              </Text>

              {generationMode === "combi" && (
                <View className="mb-4 p-3 bg-red-50 rounded-lg">
                  <Text className="text-red-800 font-bold text-sm mb-1">
                    ⚠️ PERINGATAN: Proses SANGAT INTENSIF!
                  </Text>
                  <Text className="text-red-700 text-xs">
                    Sistem akan menambahkan DUA kata dari database Exp yang
                    dipilih berdasarkan Life Path & Expression Anda, dengan
                    berbagai variasi posisi penempatan.
                  </Text>
                </View>
              )}

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Birth Date (DD/MM/YYYY)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 bg-gray-50"
                  placeholder="15/03/1990"
                  value={userBirthdate}
                  onChangeText={setUserBirthdate}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">Gender</Text>
                <View className="flex-row">
                  <TouchableOpacity
                    className={`flex-1 mr-2 p-3 rounded-md border ${
                      userGender === "Male"
                        ? "bg-purple-100 border-purple-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    onPress={() => setUserGender("Male")}
                  >
                    <Text
                      className={`text-center font-medium ${
                        userGender === "Male"
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 ml-2 p-3 rounded-md border ${
                      userGender === "Female"
                        ? "bg-purple-100 border-purple-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    onPress={() => setUserGender("Female")}
                  >
                    <Text
                      className={`text-center font-medium ${
                        userGender === "Female"
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Target Hara
                </Text>
                <View className="border border-gray-300 rounded-md bg-gray-50">
                  <Picker
                    selectedValue={targetHara}
                    onValueChange={setTargetHara}
                    style={{ height: 40 }}
                  >
                    <Picker.Item label="All Valid (1,2,3,4,6)" value="all" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="6" value="6" />
                  </Picker>
                </View>
              </View>

              <View className="mb-4 p-3 bg-blue-50 rounded-lg">
                <Text className="text-blue-800 font-medium mb-1">
                  Locked Targets:
                </Text>
                <Text className="text-blue-700 text-sm">
                  • Target Synchronize: 100% (Fixed)
                </Text>
                <Text className="text-blue-700 text-sm">
                  • Target Grafologi: 100% (Fixed)
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Target Coherence (Min %)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 bg-gray-50"
                  placeholder="70"
                  value={targetCoherence}
                  onChangeText={setTargetCoherence}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Target Momen Sukses (Min %)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-md p-3 bg-gray-50"
                  placeholder="80"
                  value={targetMomenSukses}
                  onChangeText={setTargetMomenSukses}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">
                  Target Deskripsi (Optional)
                </Text>
                <View className="border border-gray-300 rounded-md bg-gray-50">
                  <Picker
                    selectedValue={selectedTargetDescription}
                    onValueChange={(value) => {
                      setSelectedTargetDescription(value);
                      setTargetDeskripsi(value ? value.toString() : "");
                    }}
                    style={{ height: 40 }}
                  >
                    <Picker.Item label="Pilih Target Deskripsi" value={null} />
                    {getTargetDescriptionOptions().map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>
                {selectedTargetDescription && (
                  <View className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <Text className="text-blue-800 text-sm font-medium mb-1">
                      Deskripsi Lengkap:
                    </Text>
                    <Text className="text-blue-700 text-xs">
                      {getVlookupDescription(selectedTargetDescription)}
                    </Text>
                  </View>
                )}
              </View>

              {generationMode === "combi" ? (
                <View className="mb-4">
                  <Text className="text-gray-700 mb-2 font-medium">
                    Filter Awalan Huruf (Optional)
                  </Text>
                  <View className="flex-row space-x-2">
                    <View className="flex-1">
                      <Text className="text-gray-600 mb-1 text-sm">
                        Kata Pertama
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-gray-50"
                        placeholder="A"
                        value={firstWordFilter}
                        onChangeText={setFirstWordFilter}
                        maxLength={1}
                        autoCapitalize="characters"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 mb-1 text-sm">
                        Kata Kedua
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-gray-50"
                        placeholder="B"
                        value={secondWordFilter}
                        onChangeText={setSecondWordFilter}
                        maxLength={1}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    Filter kata berdasarkan huruf awal untuk setiap posisi kata
                  </Text>
                </View>
              ) : (
                <View className="mb-4">
                  <Text className="text-gray-700 mb-1 font-medium">
                    Filter Awalan Huruf (Optional)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-gray-50"
                    placeholder="Masukkan huruf awal kata (contoh: A)"
                    value={startingLetter}
                    onChangeText={setStartingLetter}
                    maxLength={1}
                    autoCapitalize="characters"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    Hanya kata yang dimulai dengan huruf ini yang akan digunakan
                    dari database exp1-exp9
                  </Text>
                </View>
              )}

              {searchProgress || combiProgress ? (
                <View className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <Text className="text-yellow-800 text-sm">
                    {generationMode === "combi"
                      ? combiProgress
                      : searchProgress}
                  </Text>
                </View>
              ) : null}

              {(advancedResults.length > 0 || combiResults.length > 0) && (
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text
                      className="text-xl font-bold flex-1 text-center"
                      style={{
                        fontFamily: "serif",
                        color: "#6B46C1",
                        textShadowColor: "rgba(0,0,0,0.1)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      {generationMode === "combi"
                        ? "✨ Hasil Pencarian Combi ✨"
                        : "🔍 Search Results 🔍"}
                    </Text>
                    <TouchableOpacity
                      className="bg-blue-100 px-3 py-1 rounded-md ml-2"
                      onPress={handleShowFullScreenResults}
                    >
                      <Text className="text-blue-700 text-xs font-medium">
                        Full Screen
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-100 px-3 py-1 rounded-md ml-2"
                      onPress={
                        generationMode === "combi"
                          ? clearCombiResults
                          : clearAdvancedResults
                      }
                    >
                      <Text className="text-red-700 text-xs font-medium">
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    style={{ maxHeight: 250 }}
                    className="bg-gradient-to-b from-purple-50 to-white rounded-lg p-2"
                  >
                    {(generationMode === "combi"
                      ? combiResults
                      : advancedResults
                    ).map((result, index) => (
                      <TouchableOpacity
                        key={index}
                        className="py-3 px-3 mb-2 bg-white rounded-lg shadow-sm border-l-4 border-purple-400"
                        style={{ elevation: 2 }}
                        onPress={() => handleNameClick(result.name)}
                      >
                        <View className="flex-row items-start mb-2">
                          <View className="w-8 h-8 bg-purple-600 rounded-full justify-center items-center mr-3">
                            <Text
                              className="text-sm font-bold text-white"
                              style={{ fontFamily: "monospace" }}
                            >
                              {index + 1}
                            </Text>
                          </View>
                          <Text
                            className="text-lg font-bold flex-1"
                            style={{
                              fontFamily: "serif",
                              color: "#4C1D95",
                              letterSpacing: 0.5,
                            }}
                          >
                            {result.name}
                          </Text>
                        </View>
                        <View className="flex-row justify-end items-center flex-wrap">
                          <View className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-1 mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              H{"\n"}
                              {result.hara}
                            </Text>
                          </View>
                          <View className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full mr-1 mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              S{"\n"}
                              {typeof result.sync === "string"
                                ? result.sync.replace("%", "") + "%"
                                : result.sync + "%"}
                            </Text>
                          </View>
                          <View className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-1 mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              C{"\n"}
                              {result.coherence.replace("%", "") + "%"}
                            </Text>
                          </View>
                          <View className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mr-1 mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              Y{"\n"}
                              {result.synergize.toString().replace("%", "") +
                                "%"}
                            </Text>
                          </View>
                          <View className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mr-1 mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              P{"\n"}
                              {result.productive.toString().replace("%", "") +
                                "%"}
                            </Text>
                          </View>
                          <View className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-1 justify-center items-center shadow-md">
                            <Text
                              className="text-white text-center font-bold"
                              style={{
                                fontFamily: "monospace",
                                fontSize: 10,
                                lineHeight: 11,
                              }}
                            >
                              M{"\n"}
                              {result.momenSukses === "1+"
                                ? "100%"
                                : Math.round(
                                    parseFloat(result.momenSukses) * 100,
                                  ) + "%"}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-300 py-2 px-4 rounded-md flex-1 mr-2"
                  onPress={() => setShowAdvancedModal(false)}
                >
                  <Text className="text-gray-700 text-center font-medium">
                    Close
                  </Text>
                </TouchableOpacity>
                {isAdvancedSearching || isCombiSearching ? (
                  <TouchableOpacity
                    className="bg-red-600 py-2 px-4 rounded-md flex-1 ml-2"
                    onPress={stopAdvancedSearch}
                  >
                    <Text className="text-white text-center font-medium">
                      Stop
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="bg-purple-600 py-2 px-4 rounded-md flex-1 ml-2"
                    onPress={runAdvancedSearch}
                  >
                    <Text className="text-white text-center font-medium">
                      {generationMode === "combi"
                        ? "Jalankan/Lanjut Combi"
                        : "Search"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full Screen Results Modal */}
      <Modal
        visible={showFullScreenResults}
        transparent={false}
        animationType="slide"
        onRequestClose={handleBackToModal}
      >
        <View className="flex-1 bg-white">
          {selectedNameForAnalysis ? (
            <View className="flex-1">
              <View className="flex-row items-center justify-between p-4 bg-purple-600">
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={handleBackToResults}
                >
                  <Text className="text-purple-600 font-medium">
                    ← Back to List
                  </Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold flex-1 text-center">
                  Name Analysis
                </Text>
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={handleBackToModal}
                >
                  <Text className="text-purple-600 font-medium">Close</Text>
                </TouchableOpacity>
              </View>
              <NumerologyResults
                name={selectedNameForAnalysis}
                birthdate={selectedNameBirthdate || new Date()}
                gender={selectedNameGender}
                isPremium={isPremium}
              />
            </View>
          ) : (
            <View className="flex-1">
              <View className="flex-row items-center justify-between p-4 bg-purple-600">
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={handleBackToModal}
                >
                  <Text className="text-purple-600 font-medium">← Back</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold flex-1 text-center">
                  {generationMode === "combi"
                    ? "✨ Hasil Pencarian Combi ✨"
                    : "🔍 Search Results 🔍"}
                </Text>
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded-md"
                  onPress={
                    generationMode === "combi"
                      ? clearCombiResults
                      : clearAdvancedResults
                  }
                >
                  <Text className="text-white font-medium">Clear All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView className="flex-1 p-4">
                <Text className="text-center text-gray-600 mb-4">
                  Tap any name to see detailed analysis
                </Text>
                {(generationMode === "combi"
                  ? combiResults
                  : advancedResults
                ).map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    className="py-4 px-4 mb-3 bg-white rounded-lg shadow-md border-l-4 border-purple-400"
                    style={{ elevation: 3 }}
                    onPress={() => handleNameClick(result.name)}
                  >
                    <View className="flex-row items-start mb-3">
                      <View className="w-10 h-10 bg-purple-600 rounded-full justify-center items-center mr-4">
                        <Text
                          className="text-lg font-bold text-white"
                          style={{ fontFamily: "monospace" }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        className="text-xl font-bold flex-1"
                        style={{
                          fontFamily: "serif",
                          color: "#4C1D95",
                          letterSpacing: 0.5,
                        }}
                      >
                        {result.name}
                      </Text>
                    </View>
                    <View className="flex-row justify-center items-center flex-wrap">
                      <View className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-2 mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Hara{"\n"}
                          {result.hara}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full mr-2 mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Sync{"\n"}
                          {typeof result.sync === "string"
                            ? result.sync.replace("%", "") + "%"
                            : result.sync + "%"}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-2 mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Coher{"\n"}
                          {result.coherence.replace("%", "") + "%"}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mr-2 mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Synrg{"\n"}
                          {result.synergize.toString().replace("%", "") + "%"}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mr-2 mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Prod{"\n"}
                          {result.productive.toString().replace("%", "") + "%"}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Momen{"\n"}
                          {result.momenSukses === "1+"
                            ? "100%"
                            : Math.round(parseFloat(result.momenSukses) * 100) +
                              "%"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );

  function renderAdvancedModeInputs() {
    if (generationMode !== "advanced") return null;

    return (
      <View className="mb-4 p-3 bg-purple-50 rounded-lg">
        <Text className="text-purple-800 font-medium mb-2">
          Advanced Search Mode
        </Text>
        <Text className="text-gray-600 text-xs mb-2">
          Systematic search based on your numerological profile with advanced
          filtering
        </Text>
        <Text className="text-gray-600 text-xs">
          Click "Advanced Search" to configure filters and start the intensive
          search process.
        </Text>
      </View>
    );
  }
}
