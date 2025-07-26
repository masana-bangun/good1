import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import {
  normalisasiNama,
  formatTanggal,
  checkCompatibility,
  calculateDestiny,
  pythagoreanValues,
  reduksiAngka,
  hitungNilaiNumerologi,
  calculateTimePhysicalMentalEmotionIntuition,
  generateNameVariations,
  languageDatabases,
  getPola,
  generateLifeReport,
} from "../utils/numerologyUtils";
import { useTranslation } from "./MainApp";
import NumerologyResults from "./NumerologyResults";
// Grafologi helper data and functions
const vlookupTable: Record<number, { id: string; en: string }> = {
  1: {
    id: "😎 Mengembangkan Hobi dan kegemaran, hobi yang menghasilkan (keuangan, pujian) serta kehormatan",
    en: "😎 Develop hobbies and interests, hobbies that generate (financial, praise) and honor",
  },
  2: {
    id: "😩 Rencanakan, ciptakan dan rawat lingkungan sistem keluarga/karir, bisnis atau keuangan, hindari kehidupan (bisnis) tidak tertata/kacau, binasa tidak wajar. Bina dengan sepenuh hati apa yang sudah didapat, tekun dan disiplinlah..kendalikan keinginan dan ego ke arah positif",
    en: "😩 Plan, create and maintain family/career system environment, business or finance, avoid disorganized/chaotic life (business), unnatural destruction. Cultivate wholeheartedly what has been obtained, be diligent and disciplined..control desires and ego in a positive direction",
  },
  3: {
    id: "😇 Senantiasalah ingat pada tuhan, Agamais, percaya pada kekuatan ruh, rohani dan spiritual",
    en: "😇 Always remember God, be religious, believe in the power of spirit, soul and spiritual",
  },
  4: {
    id: "👮 Mengembangkan keteguhan, tegas berpengaruh, tetap bijaksana dalam kekuasaan",
    en: "👮 Develop firmness, be decisively influential, remain wise in power",
  },
  5: {
    id: "💑 Menjaga kehormatan diri/keluarga agar meraih kebahagiaan, kehormatan dan pernikahan",
    en: "💑 Maintain self/family honor to achieve happiness, honor and marriage",
  },
  6: {
    id: "🤹 Tetap berusaha melakukan yang terbaik, sepenuh hati hingga mudah meraih kesempurnaan",
    en: "🤹 Keep trying to do your best, wholeheartedly until you easily achieve perfection",
  },
  7: {
    id: "😁 Teruslah mencari jalan kehidupan yang tentram, kebebasan, merdeka, bahagia dan kesempurnaan",
    en: "😁 Keep looking for a peaceful, free, independent, happy and perfect way of life",
  },
  8: {
    id: "⚖️ Upayakan bersikap adil keadilan, suka berbuat dan diperlakukan adil",
    en: "⚖️ Strive to be fair and just, like to act and be treated fairly",
  },
  9: {
    id: "😭 Hindari sikap kesedihan berkepanjangan, rasa kehilangan dalam hidup, sedih tak berujung, kekurangsempurnaan. Sadari segala sesuatunya tidak sempurna, itu yang membuat unik dan bersyukurlah atas nikmat yang masih diberi tuhan dan jadilah seseorang yang teguh jiwa",
    en: "😭 Avoid prolonged sadness, sense of loss in life, endless sadness, imperfection. Realize that everything is not perfect, that's what makes it unique and be grateful for the blessings that God still gives and be someone with a strong soul",
  },
  10: {
    id: "🙃 Berlatih tekun dan beribadah/puasa agar berhasil baik, pintar dan beruntung",
    en: "🙃 Practice diligently and worship/fast to be successful, smart and lucky",
  },
};

const AVAILABLE_ANGKA_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Language options for word database selection (same as Personal Name Optimizer)
const LANGUAGE_OPTIONS = [
  { id: "id", name: "Indonesian", flag: "🇮🇩", countryName: "Indonesia" },
  { id: "en", name: "English", flag: "🇺🇸", countryName: "United States" },
  { id: "ar", name: "Arabic", flag: "🇸🇦", countryName: "Saudi Arabia" },
  { id: "jp", name: "Japanese", flag: "🇯🇵", countryName: "Japan" },
  { id: "cn", name: "Chinese", flag: "🇨🇳", countryName: "China" },
];

const getVlookupDescription = (value: number, language: string): string => {
  const entry = vlookupTable[value];
  if (!entry) return `G${value}: ${value}`;
  const langKey = language as keyof typeof entry;
  return entry[langKey] || entry["en"] || `G${value}: ${value}`;
};

interface CompatibilityCheckerProps {
  isPremium?: boolean;
}

export default function CompatibilityChecker({
  isPremium = true,
}: CompatibilityCheckerProps) {
  const { t, language } = useTranslation();

  // Person 1 state
  const [name1, setName1] = useState("");
  const [normalizedName1, setNormalizedName1] = useState("");
  const [birthdate1, setBirthdate1] = useState(new Date());
  const [selectedDay1, setSelectedDay1] = useState(new Date().getDate());
  const [selectedMonth1, setSelectedMonth1] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedYear1, setSelectedYear1] = useState(new Date().getFullYear());
  const [showDatePicker1, setShowDatePicker1] = useState(false);

  // Person 2 state
  const [name2, setName2] = useState("");
  const [normalizedName2, setNormalizedName2] = useState("");
  const [birthdate2, setBirthdate2] = useState(new Date());
  const [selectedDay2, setSelectedDay2] = useState(new Date().getDate());
  const [selectedMonth2, setSelectedMonth2] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear());
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  // Results state
  const [results, setResults] = useState<ReturnType<
    typeof checkCompatibility
  > | null>(null);
  const [calculatedResults, setCalculatedResults] = useState<{
    person1: {
      expression: number;
      time: number;
      heart: number;
      personality: number;
      birth: number;
      ultimate: number;
      name: number;
      habit: number;
      planOfExpression: number;
      pointOfIntensification: number;
    };
    person2: {
      expression: number;
      time: number;
      heart: number;
      personality: number;
      birth: number;
      ultimate: number;
      name: number;
      habit: number;
      planOfExpression: number;
      pointOfIntensification: number;
    };
    match: {
      percentage: number;
      explanation: string;
    };
    harmony: number;
  } | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Name Fix Generator state
  const [personToFix, setPersonToFix] = useState<"person1" | "person2">(
    "person1",
  );
  const [fixMethod, setFixMethod] = useState<"addOneWord" | "addTwoWord">(
    "addOneWord",
  );
  const [selectedLanguages, setSelectedLanguages] = useState(["id"]); // Default ke Indonesia
  const [targetHarmony, setTargetHarmony] = useState<number>(70);
  const [targetHara, setTargetHara] = useState<string>("all"); // 'all' atau '1', '2', '3', '4', '6'
  const [targetCoherence, setTargetCoherence] = useState<number>(70);
  const [targetMomenSukses, setTargetMomenSukses] = useState<number>(80);
  const [selectedTargetDescription, setSelectedTargetDescription] = useState<
    number | null
  >(null);
  const [fixResults, setFixResults] = useState<
    {
      name: string;
      harmony: number;
      hara: number;
      coherence: string;
      grafologiIndex: string;
    }[]
  >([]);
  const [isFindingFix, setIsFindingFix] = useState<boolean>(false);
  const [showFixPersonFullScreen, setShowFixPersonFullScreen] = useState(false);

  // Detailed analysis states for Fix Person
  const [selectedNameForAnalysis, setSelectedNameForAnalysis] = useState<
    string | null
  >(null);
  const [selectedNameBirthdate, setSelectedNameBirthdate] =
    useState<Date | null>(null);
  const [selectedNameGender, setSelectedNameGender] = useState<
    "Male" | "Female"
  >("Male");

  // Life Report states
  const [showLifeReport, setShowLifeReport] = useState(false);
  const [combinedReport, setCombinedReport] = useState<any[]>([]);

  // 100-Year Life Report Modal states
  const [showLifeReportModal, setShowLifeReportModal] = useState(false);
  const [lifeReports, setLifeReports] = useState<{
    person1: any[];
    person2: any[];
  } | null>(null);
  const [processedReport, setProcessedReport] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{
    combined: { year: number; relationshipValue: number }[];
    p1_vs_p2: { year: number; relationshipValue: number }[];
    p2_vs_p1: { year: number; relationshipValue: number }[];
  }>({ combined: [], p1_vs_p2: [], p2_vs_p1: [] });

  // State for touch interaction on graph
  const [selectedYearPoint, setSelectedYearPoint] = useState<{
    year: number;
    x: number;
    y: number;
  } | null>(null);

  // Toggle language selection for Fix Person feature
  const toggleLanguage = (langId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langId)
        ? prev.filter((id) => id !== langId)
        : [...prev, langId],
    );
  };

  const handleNameChange1 = (text: string) => {
    setName1(text);
    setNormalizedName1(normalisasiNama(text));
  };

  const handleNameChange2 = (text: string) => {
    setName2(text);
    setNormalizedName2(normalisasiNama(text));
  };

  const handleDateChange1 = (day: number, month: number, year: number) => {
    setSelectedDay1(day);
    setSelectedMonth1(month);
    setSelectedYear1(year);
    const newDate = new Date(year, month - 1, day);
    setBirthdate1(newDate);
  };

  const handleDateChange2 = (day: number, month: number, year: number) => {
    setSelectedDay2(day);
    setSelectedMonth2(month);
    setSelectedYear2(year);
    const newDate = new Date(year, month - 1, day);
    setBirthdate2(newDate);
  };

  const generateYears = () => {
    const years = [];
    for (let year = 2100; year >= 1800; year--) {
      years.push(year);
    }
    return years;
  };

  const generateDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const months = [
    { value: 1, label: t("january") || "January" },
    { value: 2, label: t("february") || "February" },
    { value: 3, label: t("march") || "March" },
    { value: 4, label: t("april") || "April" },
    { value: 5, label: t("may") || "May" },
    { value: 6, label: t("june") || "June" },
    { value: 7, label: t("july") || "July" },
    { value: 8, label: t("august") || "August" },
    { value: 9, label: t("september") || "September" },
    { value: 10, label: t("october") || "October" },
    { value: 11, label: t("november") || "November" },
    { value: 12, label: t("december") || "December" },
  ];

  // Calculate Expression number using Pythagorean method
  const calculateExpression = (name: string): number => {
    return calculateDestiny(name);
  };

  // Calculate Time number from birthdate with special reduction for 11 and 22
  const calculateTime = (birthdate: Date): number => {
    const dd = birthdate.getDate();
    const mm = birthdate.getMonth() + 1;
    const yyyy = birthdate.getFullYear();
    let timeSum = dd + mm + yyyy;

    // Loop reduksi khusus untuk 'Time' yang akan terus menjumlahkan
    // digit dari sebuah angka hingga hasilnya menjadi satu digit (kurang dari 10).
    // Logika ini secara otomatis menangani 11 -> 2, 22 -> 4, dst.
    while (timeSum > 9) {
      timeSum = String(timeSum)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }

    return timeSum;
  };

  // Calculate Heart Desire (vowels only)
  const calculateHeart = (name: string): number => {
    const normalizedName = normalisasiNama(name);
    const vowels = normalizedName.replace(/[^AEIOU]/g, "");
    let total = 0;

    for (const char of vowels) {
      total += pythagoreanValues[char] || 0;
    }

    // Keep as is if 11 or 22, otherwise reduce to single digit
    if (total === 11 || total === 22) {
      return total;
    }
    return reduksiAngka(total);
  };

  // Calculate Personality (consonants only)
  const calculatePersonality = (name: string): number => {
    const normalizedName = normalisasiNama(name);
    const consonants = normalizedName.replace(/[AEIOU\s]/g, "");
    let total = 0;

    for (const char of consonants) {
      total += pythagoreanValues[char] || 0;
    }

    return reduksiAngka(total);
  };

  // Calculate Birth (single digit from input date dd)
  const calculateBirth = (birthdate: Date): number => {
    const dd = birthdate.getDate();
    return reduksiAngka(dd);
  };

  // Calculate Ultimate (single digit from sum of Time and Expression)
  const calculateUltimate = (time: number, expression: number): number => {
    return reduksiAngka(time + expression);
  };

  // Calculate Name (first word of name using Pythagorean values)
  const calculateName = (name: string): number => {
    const normalizedName = normalisasiNama(name);
    const firstWord = normalizedName.split(" ")[0] || "";
    let total = 0;

    for (const char of firstWord) {
      total += pythagoreanValues[char] || 0;
    }

    return reduksiAngka(total);
  };

  // Calculate Habit (single digit from sum of Pythagorean conversion for first word only)
  const calculateHabit = (name: string): number => {
    const normalizedName = normalisasiNama(name);
    const firstWord = normalizedName.split(" ")[0] || "";
    let total = 0;

    for (const char of firstWord) {
      total += pythagoreanValues[char] || 0;
    }

    return reduksiAngka(total);
  };

  // Calculate Plan of Expression (largest number from physical, mental, emotion, intuition)
  const calculatePlanOfExpression = (name: string, birthdate: Date): number => {
    const { physical, mental, emotion, intuition } =
      calculateTimePhysicalMentalEmotionIntuition(name, birthdate);
    return Math.max(physical, mental, emotion, intuition);
  };

  // Calculate Point of Intensification (single digit from most frequent number in intensity)
  const calculatePointOfIntensification = (name: string): number => {
    const normalizedName = normalisasiNama(name);
    const intensityCount: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    // Count frequency of each number
    for (const char of normalizedName) {
      if (char === " ") continue;
      const charCode = char.charCodeAt(0) - 65; // A is 65 in ASCII
      const value = (charCode % 9) + 1;
      intensityCount[value]++;
    }

    // Find the most frequent number
    let maxCount = 0;
    let mostFrequentNumber = 1;

    for (let i = 1; i <= 9; i++) {
      if (intensityCount[i] > maxCount) {
        maxCount = intensityCount[i];
        mostFrequentNumber = i;
      }
    }

    return reduksiAngka(mostFrequentNumber);
  };

  // Get match percentage and explanation based on Time values
  const getMatchData = (
    time1: number,
    time2: number,
  ): { percentage: number; explanation: string } => {
    const matchTable: Record<
      string,
      {
        percentage: number;
        harmonyPercentage: number;
        explanations: {
          id: string;
          en: string;
          fr: string;
          es: string;
          zh: string;
          hi: string;
          ar: string;
        };
      }
    > = {
      "1-1": {
        percentage: 50,
        harmonyPercentage: 5,
        explanations: {
          id: "Kedua orang memiliki sifat kepemimpinan dan kepercayaan diri. Masing-masing mungkin mencoba mengalahkan yang lain dalam permainan tanpa akhir dan itu adalah tebakan siapa yang akan menjadi pemenang. Solusinya dapat ditemukan dalam kompromi dan kerja sama dengan membagi tugas dan hak istimewa. Ini akan lebih mudah dalam kemitraan bisnis tetapi tidak begitu mudah dalam cinta.",
          en: "Both persons have the nature of leadership and self-concern. Each one may try out do the other in a never-ending game and it is anybody's guess who will be the winner. The solution can be found in compromise and co-operation by dividing the duties and privileges. This would be easier in a business partnership but not so easy in love and marriage where both have prestige of their jobs on the one hand and dealing in household chores on the other. The man cannot expect the woman to be waiting for him to serve when he returns home after work. They have to share everything on an equal basis, unless the woman recognises her femininity and calculatively keeps a slight margin for adjustment. The intimate side of their relationship should prove to be very good. Both of them are passionate and demonstrative and they should be inventive and enjoying each other's company. They may make an allowance for freedom to each other as far as seeking pleasure is concerned and won't be much worried about what the other one is doing and where.",
          Fr: "Les deux personnes possèdent des qualités de leadership et de confiance en soi. Chacun peut essayer de surpasser l'autre dans un jeu sans fin et on ne peut que deviner qui sera le vainqueur. La solution peut être trouvée dans le compromis et la coopération en partageant les tâches et les privilèges. Ce sera plus facile dans un partenariat commercial, mais pas si facile en amour.",
          es: "Ambas personas poseen cualidades de liderazgo y confianza en sí mismas. Cada una puede intentar superar a la otra en un juego interminable y solo se puede adivinar quién será el ganador. La solución se puede encontrar en el compromiso y la cooperación compartiendo tareas y privilegios. Esto será más fácil en una sociedad comercial, pero no tan fácil en el amor.",
          zh: "两个人都有领导才能和自信。每个人都可能在无休止的游戏中试图击败对方，谁会成为赢家只能猜测。解决方案可以在妥协和合作中找到，通过分担任务和特权。这在商业伙伴关系中会更容易，但在爱情中却不那么容易。",
          hi: "दोनों व्यक्तियों में नेतृत्व और आत्म-सम्मान की भावना होती है। हर कोई एक कभी न खत्म होने वाले खेल में दूसरे से आगे निकलने की कोशिश कर सकता है और यह किसी का भी अनुमान है कि विजेता कौन होगा। इसका समाधान कर्तव्यों और विशेषाधिकारों को बांटकर समझौते और सहयोग में पाया जा सकता है। यह एक व्यावसायिक साझेदारी में आसान होगा लेकिन प्यार और शादी में इतना आसान नहीं है जहाँ दोनों के पास एक तरफ अपनी नौकरी की प्रतिष्ठा होती है और दूसरी तरफ घरेलू कामों से निपटना होता है। पुरुष यह उम्मीद नहीं कर सकता कि महिला काम के बाद घर लौटने पर उसकी सेवा के लिए इंतजार कर रही होगी। उन्हें सब कुछ समान आधार पर साझा करना होगा, जब तक कि महिला अपनी स्त्रीत्व को नहीं पहचानती और समायोजन के लिए गणनात्मक रूप से थोड़ी सी गुंजाइश रखती है। उनके रिश्ते का अंतरंग पक्ष बहुत अच्छा साबित होना चाहिए। वे दोनों भावुक और प्रदर्शनकारी होते हैं और उन्हें एक-दूसरे की कंपनी का आविष्कारशील और आनंददायक होना चाहिए। वे एक-दूसरे को आनंद की तलाश के मामले में स्वतंत्रता दे सकते हैं और इस बात की ज्यादा चिंता नहीं करेंगे कि दूसरा क्या कर रहा है और कहाँ है।",
          ar: "يتمتع كلا الشخصين بصفات القيادة والثقة بالنفس. قد يحاول كل منهما التغلب على الآخر في لعبة لا نهاية لها، ويبقى التكهن بمن سيكون الفائز. يمكن إيجاد الحل في التسوية والتعاون من خلال تقسيم المهام والامتيازات. سيكون هذا أسهل في شراكة عمل، ولكنه ليس بهذه السهولة في الحب.",
        },
      },
      "1-2": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Kombinasi ideal, terutama jika 'pria 1' dan 'wanita 2' tertarik satu sama lain. Pria 1 mendominasi sementara wanita 2 tunduk dan melengkapi satu sama lain dengan sangat baik. Wanita 2 romantis, setia, nyonya rumah yang terlahir, pasif, dan selalu bersedia melakukan apa yang diinginkan pria 1. Dia akan menunggu pria pulang di malam hari dan memberinya kebahagiaan rumah tangga dan membantu semua urusan keluarga. Dia juga sangat puas karena dia memberikan segalanya kepada suaminya. Pria 1 memiliki minat di luar tetapi wanita 2 adalah untuk rumah dan ingin menghabiskan malam minggu bersamanya. Perawatan harus dilakukan agar tidak menyinggung pria 2 karena kecemburuan. Dan itu mudah membutuhkan keamanan yang dapat disediakan pria 1",
          en: "An ideal combination, especially if 'man is 1' and the 'woman is 2' drawn to each other as opposite attract. 1 Man is dominating while 2 woman is submissive and they complement each other very well. 2 woman is romantic, loyal, a born hostess, passive and always willing to do what 1 man wants. She will wait for him in the evening, look after him and give him conjugal bliss and assist him in all family dealings. She too is quite content because he gives her whatever she wants. 1 Man has outside interest but 2 woman is for the home and would like to spend the evening always with her man. Care should be taken not to offend her because 2's are jealous and easily provoked. Also 2 needs a security which 1 can provide.",
          Fr: "Une combinaison idéale, surtout si l'homme 1 et la femme 2 sont attirés l'un par l'autre. L'homme 1 est dominant tandis que la femme 2 est soumise et ils se complètent très bien. La femme 2 est romantique, loyale, une maîtresse de maison née, passive et toujours prête à faire ce que l'homme 1 désire. Elle attendra que l'homme rentre à la maison le soir et lui donnera le bonheur domestique et aidera dans toutes les affaires familiales. Elle est également très satisfaite car elle donne tout à son mari. L'homme 1 a des intérêts à l'extérieur mais la femme 2 est pour la maison et veut passer les soirées du week-end avec lui. Il faut veiller à ne pas offenser l'homme 2 par jalousie. Et c'est facile, cela nécessite la sécurité que l'homme 1 peut fournir.",
          es: "Una combinación ideal, especialmente si el 'hombre 1' y la 'mujer 2' se sienten atraídos el uno por el otro. El hombre 1 es dominante mientras que la mujer 2 es sumisa y se complementan muy bien. La mujer 2 es romántica, leal, una anfitriona nata, pasiva y siempre dispuesta a hacer lo que el hombre 1 desea. Esperará a que el hombre vuelva a casa por la noche y le dará felicidad doméstica y ayudará en todos los asuntos familiares. También está muy satisfecha porque le da todo a su marido. El hombre 1 tiene intereses fuera, pero la mujer 2 es para el hogar y quiere pasar las noches de fin de semana con él. Hay que tener cuidado de no ofender al hombre 2 por celos. Y es fácil, requiere la seguridad que el hombre 1 puede proporcionar.",
          zh: "一个理想的组合，特别是如果“男1”和“女2”彼此吸引。男1占主导地位，而女2则顺从，他们彼此很好地互补。女2浪漫、忠诚、是天生的女主人、被动，并且总是愿意做男1想做的事。她会等男人晚上回家，给他家庭的幸福，并帮助处理所有家庭事务。她也非常满意，因为她把一切都给了丈夫。男1在外面有兴趣，但女2是为了家庭，并希望和他一起度过周末的晚上。必须注意不要因为嫉妒而冒犯男2。这很容易，它需要男1可以提供的安全感。",
          hi: "दोनों व्यक्तियों में नेतृत्व और आत्म-सम्मान की भावना होती है। हर कोई एक कभी न खत्म होने वाले खेल में दूसरे से आगे निकलने की कोशिश कर सकता है और यह किसी का भी अनुमान है कि विजेता कौन होगा। इसका समाधान कर्तव्यों और विशेषाधिकारों को बांटकर समझौते और सहयोग में पाया जा सकता है। यह एक व्यावसायिक साझेदारी में आसान होगा लेकिन प्यार और शादी में इतना आसान नहीं है जहाँ दोनों के पास एक तरफ अपनी नौकरी की प्रतिष्ठा होती है और दूसरी तरफ घरेलू कामों से निपटना होता है। पुरुष यह उम्मीद नहीं कर सकता कि महिला काम के बाद घर लौटने पर उसकी सेवा के लिए इंतजार कर रही होगी। उन्हें सब कुछ समान आधार पर साझा करना होगा, जब तक कि महिला अपनी स्त्रीत्व को नहीं पहचानती और समायोजन के लिए गणनात्मक रूप से थोड़ी सी गुंजाइश रखती है। उनके रिश्ते का अंतरंग पक्ष बहुत अच्छा साबित होना चाहिए। वे दोनों भावुक और प्रदर्शनकारी होते हैं और उन्हें एक-दूसरे की कंपनी का आविष्कारशील और आनंददायक होना चाहिए। वे एक-दूसरे को आनंद की तलाश के मामले में स्वतंत्रता दे सकते हैं और इस बात की ज्यादा चिंता नहीं करेंगे कि दूसरा क्या कर रहा है और कहाँ है।",
          ar: "مزيج مثالي، خاصة إذا كان 'الرجل 1' و 'المرأة 2' منجذبين لبعضهما البعض. الرجل 1 يسيطر بينما المرأة 2 تخضع وتكملان بعضهما البعض بشكل جيد للغاية. المرأة 2 رومانسية، مخلصة، ربة منزل بالفطرة، سلبية، ومستعدة دائمًا لفعل ما يريده الرجل 1. ستنتظر عودة الرجل إلى المنزل في المساء وتمنحه السعادة المنزلية وتساعد في جميع شؤون الأسرة. هي أيضًا راضية جدًا لأنها تمنح كل شيء لزوجها. لدى الرجل 1 اهتمامات في الخارج ولكن المرأة 2 مخصصة للمنزل وتريد قضاء ليلة السبت معه. يجب توخي الحذر حتى لا تسيء إلى الرجل 2 بسبب الغيرة. وهذا يتطلب بسهولة الأمان الذي يمكن أن يوفره الرجل 1.",
        },
      },
      "1-11": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Kombinasi ideal, terutama jika 'pria 1' dan 'wanita 2' tertarik satu sama lain. Pria 1 mendominasi sementara wanita 2 tunduk dan melengkapi satu sama lain dengan sangat baik. Wanita 2 romantis, setia, nyonya rumah yang terlahir, pasif, dan selalu bersedia melakukan apa yang diinginkan pria 1. Dia akan menunggu pria pulang di malam hari dan memberinya kebahagiaan rumah tangga dan membantu semua urusan keluarga. Dia juga sangat puas karena dia memberikan segalanya kepada suaminya. Pria 1 memiliki minat di luar tetapi wanita 2 adalah untuk rumah dan ingin menghabiskan malam minggu bersamanya. Perawatan harus dilakukan agar tidak menyinggung pria 2 karena kecemburuan. Dan itu mudah membutuhkan keamanan yang dapat disediakan pria 1",
          en: "An ideal combination, especially if 'man is 1' and the 'woman is 2' drawn to each other as opposite attract. 1 Man is dominating while 2 woman is submissive and they complement each other very well. 2 woman is romantic, loyal, a born hostess, passive and always willing to do what 1 man wants. She will wait for him in the evening, look after him and give him conjugal bliss and assist him in all family dealings. She too is quite content because he gives her whatever she wants. 1 Man has outside interest but 2 woman is for the home and would like to spend the evening always with her man. Care should be taken not to offend her because 2's are jealous and easily provoked. Also 2 needs a security which 1 can provide.",
          Fr: "Une combinaison idéale, surtout si l'homme 1 et la femme 2 sont attirés l'un par l'autre. L'homme 1 est dominant tandis que la femme 2 est soumise et ils se complètent très bien. La femme 2 est romantique, loyale, une maîtresse de maison née, passive et toujours prête à faire ce que l'homme 1 désire. Elle attendra que l'homme rentre à la maison le soir et lui donnera le bonheur domestique et aidera dans toutes les affaires familiales. Elle est également très satisfaite car elle donne tout à son mari. L'homme 1 a des intérêts à l'extérieur mais la femme 2 est pour la maison et veut passer les soirées du week-end avec lui. Il faut veiller à ne pas offenser l'homme 2 par jalousie. Et c'est facile, cela nécessite la sécurité que l'homme 1 peut fournir.",
          es: "Una combinación ideal, especialmente si el 'hombre 1' y la 'mujer 2' se sienten atraídos el uno por el otro. El hombre 1 es dominante mientras que la mujer 2 es sumisa y se complementan muy bien. La mujer 2 es romántica, leal, una anfitriona nata, pasiva y siempre dispuesta a hacer lo que el hombre 1 desea. Esperará a que el hombre vuelva a casa por la noche y le dará felicidad doméstica y ayudará en todos los asuntos familiares. También está muy satisfecha porque le da todo a su marido. El hombre 1 tiene intereses fuera, pero la mujer 2 es para el hogar y quiere pasar las noches de fin de semana con él. Hay que tener cuidado de no ofender al hombre 2 por celos. Y es fácil, requiere la seguridad que el hombre 1 puede proporcionar.",
          zh: "一个理想的组合，特别是如果“男1”和“女2”彼此吸引。男1占主导地位，而女2则顺从，他们彼此很好地互补。女2浪漫、忠诚、是天生的女主人、被动，并且总是愿意做男1想做的事。她会等男人晚上回家，给他家庭的幸福，并帮助处理所有家庭事务。她也非常满意，因为她把一切都给了丈夫。男1在外面有兴趣，但女2是为了家庭，并希望和他一起度过周末的晚上。必须注意不要因为嫉妒而冒犯男2。这很容易，它需要男1可以提供的安全感。",
          hi: "दोनों व्यक्तियों में नेतृत्व और आत्म-सम्मान की भावना होती है। हर कोई एक कभी न खत्म होने वाले खेल में दूसरे से आगे निकलने की कोशिश कर सकता है और यह किसी का भी अनुमान है कि विजेता कौन होगा। इसका समाधान कर्तव्यों और विशेषाधिकारों को बांटकर समझौते और सहयोग में पाया जा सकता है। यह एक व्यावसायिक साझेदारी में आसान होगा लेकिन प्यार और शादी में इतना आसान नहीं है जहाँ दोनों के पास एक तरफ अपनी नौकरी की प्रतिष्ठा होती है और दूसरी तरफ घरेलू कामों से निपटना होता है। पुरुष यह उम्मीद नहीं कर सकता कि महिला काम के बाद घर लौटने पर उसकी सेवा के लिए इंतजार कर रही होगी। उन्हें सब कुछ समान आधार पर साझा करना होगा, जब तक कि महिला अपनी स्त्रीत्व को नहीं पहचानती और समायोजन के लिए गणनात्मक रूप से थोड़ी सी गुंजाइश रखती है। उनके रिश्ते का अंतरंग पक्ष बहुत अच्छा साबित होना चाहिए। वे दोनों भावुक और प्रदर्शनकारी होते हैं और उन्हें एक-दूसरे की कंपनी का आविष्कारशील और आनंददायक होना चाहिए। वे एक-दूसरे को आनंद की तलाश के मामले में स्वतंत्रता दे सकते हैं और इस बात की ज्यादा चिंता नहीं करेंगे कि दूसरा क्या कर रहा है और कहाँ है।",
          ar: "مزيج مثالي، خاصة إذا كان 'الرجل 1' و 'المرأة 2' منجذبين لبعضهما البعض. الرجل 1 يسيطر بينما المرأة 2 تخضع وتكملان بعضهما البعض بشكل جيد للغاية. المرأة 2 رومانسية، مخلصة، ربة منزل بالفطرة، سلبية، ومستعدة دائمًا لفعل ما يريده الرجل 1. ستنتظر عودة الرجل إلى المنزل في المساء وتمنحه السعادة المنزلية وتساعد في جميع شؤون الأسرة. هي أيضًا راضية جدًا لأنها تمنح كل شيء لزوجها. لدى الرجل 1 اهتمامات في الخارج ولكن المرأة 2 مخصصة للمنزل وتريد قضاء ليلة السبت معه. يجب توخي الحذر حتى لا تسيء إلى الرجل 2 بسبب الغيرة. وهذا يتطلب بسهولة الأمان الذي يمكن أن يوفره الرجل 1.",
        },
      },
      "1-3": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Angka 1 dan 3 cukup cocok satu sama lain dan mereka harus menjadi pasangan yang baik. Pria 1 berorientasi karier dan wanita 3 adalah orang yang dapat diandalkan dengan rasa tanggung jawab. Dia adalah nyonya rumah yang baik dan ibu rumah tangga yang harmonis yang dapat memaafkan calon suami 1. Jika wanita 1 dia memiliki misi dalam hidup dan mungkin berorientasi karier atau turun ke bumi. Tapi dia bertindak seperti nyonya rumah yang merupakan persyaratan pria 3. Dia dinamis dan dia adalah suami yang berbakti, membuat tim yang baik. Mungkin ada saatnya ketika egoisme 1 dapat bertentangan dengan kemurahan hati 3 dan kompromi diperlukan.",
          en: "Number 1 and 3 are quite suitable to each other and they should make a good couple. The 1 Man is career minded and a dependable person while the 3 woman is loving, homely and with a sense of responsibility. She is a born hostess and a harmonious home maker who can even forgive the outgoing life of 1 Man.",
          Fr: "Un couple bien équilibré et bien ajusté qui complète les besoins de l'autre. L'homme 1 est axé sur la carrière et la femme 3 est une personne fiable avec un sens des responsabilités. C'est une bonne maîtresse de maison et une femme au foyer harmonieuse qui peut pardonner au futur mari 1. Si la femme est 1, elle a une mission dans la vie et peut être axée sur la carrière ou terre-à-terre. Mais elle se comporte comme une maîtresse de maison, ce qui est l'exigence de l'homme 3. Elle est dynamique et il est un mari dévoué, formant une bonne équipe. Il peut y avoir un moment où l'égoïsme de 1 peut entrer en conflit avec la générosité de 3 et un compromis est nécessaire.",
          es: "Una pareja bien equilibrada y bien ajustada que complementa las necesidades del otro. El hombre 1 está orientado a la carrera y la mujer 3 es una persona confiable con sentido de la responsabilidad. Es una buena anfitriona y una ama de casa armoniosa que puede perdonar al futuro esposo 1. Si la mujer es 1, tiene una misión en la vida y puede estar orientada a la carrera o ser práctica. Pero actúa como una anfitriona, que es el requisito del hombre 3. Ella es dinámica y él es un esposo devoto, formando un buen equipo. Puede haber un momento en que el egoísmo de 1 pueda entrar en conflicto con la generosidad de 3 y se necesite un compromiso.",
          zh: "一个平衡良好、适应良好的伴侣，可以满足彼此的需求。男1是事业心强的，女3是可靠、有责任感的人。她是一个好女主人和一个和谐的家庭主妇，可以原谅男1的外向生活。如果女人是1，她一生中有一个使命，可能以事业为导向或脚踏实地。但她表现得像一个女主人，这是男3的要求。她充满活力，他是一个忠诚的丈夫，组成了一个很好的团队。可能有一段时间，1的自私会与3的慷慨发生冲突，需要妥协。",
          hi: "नंबर 1 और 3 एक-दूसरे के लिए काफी उपयुक्त हैं और उन्हें एक अच्छा जोड़ा बनाना चाहिए। पुरुष 1 में काम पर या घर पर नेतृत्व के गुण होते हैं। वह चाहेगा कि उसका साथी स्मार्ट, अच्छे कपड़े पहने और आकर्षक हो जो कि महिला 3 है। वह प्रतिभाशाली और बहुमुखी है और पुरुष 1 की मर्दानगी से बहुत संतुष्ट है। पुरुष 1 जिम्मेदार है और शायद ही कभी खर्चीला होता है जबकि महिला 3 फिजूलखर्ची और तुच्छ भी हो सकती है। इसलिए गृहस्थी में उन्हें समझौता और समायोजन करना होगा। अंतरंग पक्ष में, पुरुष 1 पहल करने वाला, प्रदर्शनकारी और भावुक होता है जबकि महिला 3 को विविधता और उत्तेजना से प्यार होता है। इसलिए वे दोनों एक-दूसरे के पूरक हैं और एक-दूसरे के लिए अनुकूल हैं।",
          ar: "ينتج عن هذا المزيج علاقة ناجحة لأن صفات كلا الشخصين تكمل بعضها البعض. الرقم 1 شخص قوي، مهيمن، وموجه نحو الحياة المهنية بينما الرقم 3 شخص محب، محب للبيت، وذو شعور بالمسؤولية. هي ربة منزل جيدة وربة بيت متناغمة يمكنها أن تسامح الزوج المحتمل رقم 1. إذا كانت المرأة 1، فلديها مهمة في الحياة وقد تكون موجهة نحو الحياة المهنية أو واقعية. لكنها تتصرف كربة منزل وهو مطلب الرجل 3. هي ديناميكية وهو زوج مخلص، مما يجعلهما فريقًا جيدًا. قد يكون هناك وقت تتعارض فيه أنانية الرقم 1 مع كرم الرقم 3 وتكون التسوية ضرورية.",
        },
      },
      "1-4": {
        percentage: 25,
        harmonyPercentage: 2.5,
        explanations: {
          id: "Hubungan tidak direkomendasikan karena mereka memiliki kepribadian yang bertentangan, mereka memiliki pandangan yang berbeda dan pendapat yang bertentangan. Ini akan menjadi tugas yang berat untuk menyatukan mereka. Mereka harmonis dalam urusan bisnis sejauh hubungan yang baik secara keseluruhan 1 dapat digabungkan dengan sistem dan urutan 4 dan menghasilkan hasil yang baik. Dalam kehidupan pribadi, No. 1 spontan dan impulsif sementara No. 4 diberikan pada rutinitas, ketertiban, dan lambat. Mereka umumnya acuh tak acuh terhadap seks. Wanita 1 menyukai banyak kegembiraan dan petualangan sementara pria 4 adalah yang sebaliknya.",
          en: "The relationship is not recommended because they have conflicting personalities, they have different views and opinions and the compatibility is not likely to be there. It will be an uphill task to bring them together. They are harmonious in business matters to a good extent since the originality of 1 can combine with the system and order of 4 and produce good results. In personal life No. 1 is spontaneous and impulsive while No. 4 is given to routine, orderliness and is slow. They are generally indifferent towards sex. The 1 woman likes a lot of excitement and adventure while the 4 man is the other way round.",
          Fr: "Une relation n'est pas recommandée car ils ont des personnalités contradictoires, ils ont des points de vue différents et des opinions contradictoires. Ce sera une tâche ardue de les réunir. Ils sont harmonieux dans les affaires commerciales dans la mesure où une bonne relation globale 1 peut être combinée avec le système et l'ordre de 4 et produire de bons résultats. Dans la vie privée, le n°1 est spontané et impulsif tandis que le n°4 est porté sur la routine, l'ordre et est lent. Ils sont généralement indifférents au sexe. La femme 1 aime beaucoup d'excitation et d'aventure tandis que l'homme 4 est tout le contraire.",
          es: "No se recomienda una relación porque tienen personalidades conflictivas, tienen puntos de vista diferentes y opiniones contradictorias. Será una tarea ardua unirlos. Son armoniosos en los asuntos comerciales en la medida en que una buena relación general 1 se puede combinar con el sistema y el orden de 4 y producir buenos resultados. En la vida privada, el Nº 1 es espontáneo e impulsivo mientras que el Nº 4 se dedica a la rutina, el orden y es lento. Generalmente son indiferentes al sexo. A la mujer 1 le gusta mucha emoción y aventura, mientras que el hombre 4 es todo lo contrario.",
          zh: "不推荐建立关系，因为他们性格冲突，观点不同，意见相左。将他们聚集在一起将是一项艰巨的任务。他们在商业事务中是和谐的，只要一个良好的整体关系1可以与4的系统和顺序相结合并产生良好的结果。在私人生活中，1号是自发和冲动的，而4号则倾向于常规、秩序和缓慢。他们通常对性冷淡。女1喜欢大量的兴奋和冒险，而男4则相反。",
          hi: "एक आदर्श संयोजन, खासकर अगर 'पुरुष 1' और 'महिला 2' एक-दूसरे के प्रति विपरीत आकर्षण के रूप में आकर्षित होते हैं। पुरुष 1 हावी होता है जबकि महिला 2 विनम्र होती है और वे एक-दूसरे के बहुत अच्छे पूरक होते हैं। महिला 2 रोमांटिक, वफादार, जन्मजात परिचारिका, निष्क्रिय और हमेशा वही करने को तैयार रहती है। वह शाम को उसका इंतजार करेगी, उसकी देखभाल करेगी और उसे वैवाहिक आनंद देगी और सभी पारिवारिक मामलों में उसकी सहायता करेगी। वह भी काफी संतुष्ट रहती है क्योंकि वह उसे वह सब कुछ देता है जो वह चाहती है। पुरुष 1 की बाहरी रुचियां होती हैं लेकिन महिला 2 घर के लिए होती है और शाम को हमेशा अपने पुरुष के साथ बिताना चाहेगी। उसका अपमान न करने का ध्यान रखा जाना चाहिए क्योंकि 2 ईर्ष्यालु और आसानी से उत्तेजित होने वाले होते हैं। साथ ही 2 को सुरक्षा की आवश्यकता होती है जो 1 प्रदान कर सकता है।",
          ar: "لا يوصى بالعلاقة لأن لديهما شخصيات متضاربة، ووجهات نظر مختلفة وآراء متعارضة. ستكون مهمة شاقة لجمعهما. هما متناغمان في شؤون العمل حيث يمكن دمج العلاقة الجيدة الشاملة للرقم 1 مع نظام وترتيب الرقم 4 وتحقيق نتائج جيدة. في الحياة الشخصية، الرقم 1 عفوي ومندفع بينما الرقم 4 يميل إلى الروتين والنظام والبطء. هما بشكل عام غير مبالين بالجنس. تحب المرأة 1 الكثير من الإثارة والمغامرة بينما الرجل 4 هو العكس تمامًا.",
        },
      },
      "1-22": {
        percentage: 25,
        harmonyPercentage: 2.5,
        explanations: {
          id: "Hubungan tidak direkomendasikan karena mereka memiliki kepribadian yang bertentangan, mereka memiliki pandangan yang berbeda dan pendapat yang bertentangan. Ini akan menjadi tugas yang berat untuk menyatukan mereka. Mereka harmonis dalam urusan bisnis sejauh hubungan yang baik secara keseluruhan 1 dapat digabungkan dengan sistem dan urutan 4 dan menghasilkan hasil yang baik. Dalam kehidupan pribadi, No. 1 spontan dan impulsif sementara No. 4 diberikan pada rutinitas, ketertiban, dan lambat. Mereka umumnya acuh tak acuh terhadap seks. Wanita 1 menyukai banyak kegembiraan dan petualangan sementara pria 4 adalah yang sebaliknya.",
          en: "The relationship is not recommended because they have conflicting personalities, they have different views and opinions and the compatibility is not likely to be there. It will be an uphill task to bring them together. They are harmonious in business matters to a good extent since the originality of 1 can combine with the system and order of 4 and produce good results. In personal life No. 1 is spontaneous and impulsive while No. 4 is given to routine, orderliness and is slow. They are generally indifferent towards sex. The 1 woman likes a lot of excitement and adventure while the 4 man is the other way round.",
          Fr: "Une relation n'est pas recommandée car ils ont des personnalités contradictoires, ils ont des points de vue différents et des opinions contradictoires. Ce sera une tâche ardue de les réunir. Ils sont harmonieux dans les affaires commerciales dans la mesure où une bonne relation globale 1 peut être combinée avec le système et l'ordre de 4 et produire de bons résultats. Dans la vie privée, le n°1 est spontané et impulsif tandis que le n°4 est porté sur la routine, l'ordre et est lent. Ils sont généralement indifférents au sexe. La femme 1 aime beaucoup d'excitation et d'aventure tandis que l'homme 4 est tout le contraire.",
          es: "No se recomienda una relación porque tienen personalidades conflictivas, tienen puntos de vista diferentes y opiniones contradictorias. Será una tarea ardua unirlos. Son armoniosos en los asuntos comerciales en la medida en que una buena relación general 1 se puede combinar con el sistema y el orden de 4 y producir buenos resultados. En la vida privada, el Nº 1 es espontáneo e impulsivo mientras que el Nº 4 se dedica a la rutina, el orden y es lento. Generalmente son indiferentes al sexo. A la mujer 1 le gusta mucha emoción y aventura, mientras que el hombre 4 es todo lo contrario.",
          zh: "不推荐建立关系，因为他们性格冲突，观点不同，意见相左。将他们聚集在一起将是一项艰巨的任务。他们在商业事务中是和谐的，只要一个良好的整体关系1可以与4的系统和顺序相结合并产生良好的结果。在私人生活中，1号是自发和冲动的，而4号则倾向于常规、秩序和缓慢。他们通常对性冷淡。女1喜欢大量的兴奋和冒险，而男4则相反。",
          hi: "एक आदर्श संयोजन, खासकर अगर 'पुरुष 1' और 'महिला 2' एक-दूसरे के प्रति विपरीत आकर्षण के रूप में आकर्षित होते हैं। पुरुष 1 हावी होता है जबकि महिला 2 विनम्र होती है और वे एक-दूसरे के बहुत अच्छे पूरक होते हैं। महिला 2 रोमांटिक, वफादार, जन्मजात परिचारिका, निष्क्रिय और हमेशा वही करने को तैयार रहती है। वह शाम को उसका इंतजार करेगी, उसकी देखभाल करेगी और उसे वैवाहिक आनंद देगी और सभी पारिवारिक मामलों में उसकी सहायता करेगी। वह भी काफी संतुष्ट रहती है क्योंकि वह उसे वह सब कुछ देता है जो वह चाहती है। पुरुष 1 की बाहरी रुचियां होती हैं लेकिन महिला 2 घर के लिए होती है और शाम को हमेशा अपने पुरुष के साथ बिताना चाहेगी। उसका अपमान न करने का ध्यान रखा जाना चाहिए क्योंकि 2 ईर्ष्यालु और आसानी से उत्तेजित होने वाले होते हैं। साथ ही 2 को सुरक्षा की आवश्यकता होती है जो 1 प्रदान कर सकता है।",
          ar: "لا يوصى بالعلاقة لأن لديهما شخصيات متضاربة، ووجهات نظر مختلفة وآراء متعارضة. ستكون مهمة شاقة لجمعهما. هما متناغمان في شؤون العمل حيث يمكن دمج العلاقة الجيدة الشاملة للرقم 1 مع نظام وترتيب الرقم 4 وتحقيق نتائج جيدة. في الحياة الشخصية، الرقم 1 عفوي ومندفع بينما الرقم 4 يميل إلى الروتين والنظام والبطء. هما بشكل عام غير مبالين بالجنس. تحب المرأة 1 الكثير من الإثارة والمغامرة بينما الرجل 4 هو العكس تمامًا.",
        },
      },
      "1-5": {
        percentage: 25,
        harmonyPercentage: 2.5,
        explanations: {
          id: "Keduanya tidak bisa bersama untuk waktu yang lama. No. 1 ditentukan, mantap, dan berorientasi karier sementara No. 5 serbaguna, berubah-ubah, dan seksi. Hubungan menjadi lebih buruk ketika pria adalah 1 dan wanita adalah 5. Wanita 5 tidak menikah pada awal kehidupan kecuali dia memiliki hubungan pranikah. Mereka berdua agresif dan situasinya cenderung sering memburuk. Sulit bagi mereka untuk berkompromi. Hanya kehidupan pribadi yang mungkin membuat mereka tetap bersama jika mereka bisa berkompromi dalam masalah lain. Pria 1 kuat, demonstratif, dan petualang sementara wanita 5 dapat menyesuaikan diri dalam masalah seks. Keduanya dapat cocok satu sama lain. Jika pria adalah 5 dia lebih cenderung memprovokasi seks tetapi wanita 1 juga bisa menyesuaikan diri dan keduanya bisa menjadi pasangan yang baik.",
          en: "The two cannot go together for a long time. No. 1 is determined, steady and career minded while No. 5 is versatile, changeable and sexy. The relation is still worse when the man is 1 and the woman is 5. The 5 woman does not marry early in life unless she has pre-marital relationship. They are both aggressive and the situation is likely to flare up quite often. It is difficult for them to come to a compromise. It is only the private life which may keep them together if they can compromise on other issues. The 1 Man is strong, demonstrative and adventurous while the 5 woman can adjust in matters of sex. So the two can be suited to one another. If the man is 5 he is more prone to sex but the 1 woman too can adjust and the two can make a good couple.",
          Fr: "Les deux ne peuvent pas être ensemble pendant longtemps. Le n°1 est déterminé, stable et axé sur la carrière tandis que le n°5 est polyvalent, changeant et sexy. La relation s'aggrave lorsque l'homme est 1 et la femme est 5. La femme 5 ne se marie pas au début de la vie à moins qu'elle n'ait des relations prénuptiales. Ils sont tous les deux agressifs et la situation a tendance à se détériorer souvent. Il leur est difficile de faire des compromis. Seule la vie privée peut les maintenir ensemble s'ils peuvent faire des compromis sur d'autres questions. L'homme 1 est fort, démonstratif et aventureux tandis que la femme 5 est adaptable en matière de sexe. Les deux peuvent être compatibles l'un avec l'autre. Si l'homme est 5, il est plus susceptible de provoquer le sexe mais la femme 1 peut aussi être adaptable et les deux peuvent former un bon couple.",
          es: "Los dos no pueden estar juntos por mucho tiempo. El Nº 1 es decidido, firme y orientado a la carrera, mientras que el Nº 5 es versátil, cambiante y sexy. La relación empeora cuando el hombre es 1 y la mujer es 5. La mujer 5 no se casa al principio de la vida a menos que tenga relaciones prematrimoniales. Ambos son agresivos y la situación tiende a deteriorarse con frecuencia. Les resulta difícil llegar a un compromiso. Solo la vida privada puede mantenerlos juntos si pueden comprometerse en otros asuntos. El hombre 1 es fuerte, demostrativo y aventurero, mientras que la mujer 5 es adaptable en cuestiones de sexo. Los dos pueden ser compatibles entre sí. Si el hombre es 5, es más propenso a provocar el sexo pero la mujer 1 también puede ser adaptable y los dos pueden formar una buena pareja.",
          zh: "两人不能长时间在一起。1号是坚定的、稳重的和事业心强的，而5号是多才多艺的、善变的和性感的。当男人是1，女人是5时，关系会变得更糟。女5除非有婚前关系，否则不会在生命的早期结婚。他们俩都很有攻击性，情况往往会经常恶化。他们很难妥协。如果他们能在其他问题上妥协，只有私人生活可能会让他们在一起。男1是强壮的、表现力的和冒险的，而女5在性问题上是适应性强的。因此，两人可以彼此相配。如果男人是5，他更倾向于挑起性，但女1也可以适应，两人可以成为一对好伴侣。",
          hi: "नंबर 1 और 5 एक-दूसरे के लिए काफी उपयुक्त हैं और उन्हें एक अच्छा जोड़ा बनाना चाहिए। पुरुष 1 में काम पर या घर पर नेतृत्व के गुण होते हैं। वह चाहेगा कि उसका साथी स्मार्ट, अच्छे कपड़े पहने और आकर्षक हो जो कि महिला 5 है। वह प्रतिभाशाली और बहुमुखी है और पुरुष 1 की मर्दानगी से बहुत संतुष्ट है। पुरुष 1 जिम्मेदार है और शायद ही कभी खर्चीला होता है जबकि महिला 5 फिजूलखर्ची और तुच्छ भी हो सकती है। इसलिए गृहस्थी में उन्हें समझौता और समायोजन करना होगा। अंतरंग पक्ष में, पुरुष 1 पहल करने वाला, प्रदर्शनकारी और भावुक होता है जबकि महिला 5 को विविधता और उत्तेजना से प्यार होता है। इसलिए वे दोनों एक-दूसरे के पूरक हैं और एक-दूसरे के लिए अनुकूल हैं।",
          ar: "ينتج عن هذا المزيج علاقة ناجحة لأن صفات كلا الشخصين تكمل بعضها البعض. الرقم 1 شخص قوي، مهيمن، وموجه نحو الحياة المهنية بينما الرقم 5 متعدد المواهب، متقلب، ومثير. الصداقة مثالية إذا كان الرجل هو 1 والمرأة هي 5 لأنه حتى في الخلافات تتنازل بدرجة معينة من اليقين. هي ليست أنانية وصديقة مخلصة وليس لديها ذكاء أعلى من شريكها. ستشجع دائمًا طموحات شريكها. ومع ذلك، يمكن أن تتعارض أنانية الرقم 1 مع حب الخير لدى الرقم 5 وستكون هناك حاجة إلى مزيد من الضوابط. عندما يكون الرجل 5، يكون مزاجه سريعًا واندفاعه يجعله سلبيًا، ويجب التحكم في ذلك. كلاهما ذكيان وقادران على حد سواء، ويريد الرجل 5 أن يبقى رئيس المنزل بينما قد تعتقد المرأة 1 أنها هي الرئيسة. ومع ذلك، فإن هذه الاختلافات ليست خطيرة جدًا لأن عطف وتسامح المرأة 1 والحس السليم يمكن أن يحلاها بسهولة. في العلاقة الزوجية، تتوافق العدوانية الحسية للمرأة 1 تمامًا مع شغف وخضوع المرأة 5. إذا كان الرجل هو 5، فهو عاطفي للغاية ومبدع واستعراضي، وستطابقه المرأة 1 تمامًا.",
        },
      },
      "1-6": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Pasangan yang seimbang dan berpenyesuaian baik yang melengkapi kebutuhan satu sama lain. Pria 1 berorientasi karier dan wanita 6 adalah orang yang dapat diandalkan dengan rasa tanggung jawab. Dia adalah nyonya rumah yang baik dan ibu rumah tangga yang harmonis yang dapat memaafkan calon suami 1. Jika wanita 1 dia memiliki misi dalam hidup dan mungkin berorientasi karier atau turun ke bumi. Tapi dia bertindak seperti nyonya rumah yang merupakan persyaratan pria 6. Dia dinamis dan dia adalah suami yang berbakti, membuat tim yang baik. Mungkin ada saatnya ketika egoisme 1 dapat bertentangan dengan kemurahan hati 6 dan kompromi diperlukan.",
          en: "A balanced and well-adjusted couple who complement the needs of each other. The 1 Man is career minded and a dependable person while the 6 woman is loving, homely and with a sense of responsibility. She is a born hostess and a harmonious home maker who can even forgive the outgoing life of 1 Man.",
          Fr: "Un couple bien équilibré et bien ajusté qui complète les besoins de l'autre. L'homme 1 est axé sur la carrière et la femme 6 est une personne fiable avec un sens des responsabilités. C'est une bonne maîtresse de maison et une femme au foyer harmonieuse qui peut pardonner au futur mari 1. Si la femme est 1, elle a une mission dans la vie et peut être axée sur la carrière ou terre-à-terre. Mais elle se comporte comme une maîtresse de maison, ce qui est l'exigence de l'homme 6. Elle est dynamique et il est un mari dévoué, formant une bonne équipe. Il peut y avoir un moment où l'égoïsme de 1 peut entrer en conflit avec la générosité de 6 et un compromis est nécessaire.",
          es: "Una pareja bien equilibrada y bien ajustada que complementa las necesidades del otro. El hombre 1 está orientado a la carrera y la mujer 6 es una persona confiable con sentido de la responsabilidad. Es una buena anfitriona y una ama de casa armoniosa que puede perdonar al futuro esposo 1. Si la mujer es 1, tiene una misión en la vida y puede estar orientada a la carrera o ser práctica. Pero actúa como una anfitriona, que es el requisito del hombre 6. Ella es dinámica y él es un esposo devoto, formando un buen equipo. Puede haber un momento en que el egoísmo de 1 pueda entrar en conflicto con la generosidad de 6 y se necesite un compromiso.",
          zh: "一个平衡良好、适应良好的伴侣，可以满足彼此的需求。男1是事业心强的，女6是可靠、有责任感的人。她是一个好女主人和一个和谐的家庭主妇，可以原谅男1的外向生活。如果女人是1，她一生中有一个使命，可能以事业为导向或脚踏实地。但她表现得像一个女主人，这是男6的要求。她充满活力，他是一个忠诚的丈夫，组成了一个很好的团队。可能有一段时间，1的自私会与6的慷慨发生冲突，需要妥协。",
          hi: "एक आदर्श संयोजन, खासकर अगर 'पुरुष 1' और 'महिला 2' एक-दूसरे के प्रति विपरीत आकर्षण के रूप में आकर्षित होते हैं। पुरुष 1 हावी होता है जबकि महिला 2 विनम्र होती है और वे एक-दूसरे के बहुत अच्छे पूरक होते हैं। महिला 2 रोमांटिक, वफादार, जन्मजात परिचारिका, निष्क्रिय और हमेशा वही करने को तैयार रहती है। वह शाम को उसका इंतजार करेगी, उसकी देखभाल करेगी और उसे वैवाहिक आनंद देगी और सभी पारिवारिक मामलों में उसकी सहायता करेगी। वह भी काफी संतुष्ट रहती है क्योंकि वह उसे वह सब कुछ देता है जो वह चाहती है। पुरुष 1 की बाहरी रुचियां होती हैं लेकिन महिला 2 घर के लिए होती है और शाम को हमेशा अपने पुरुष के साथ बिताना चाहेगी। उसका अपमान न करने का ध्यान रखा जाना चाहिए क्योंकि 2 ईर्ष्यालु और आसानी से उत्तेजित होने वाले होते हैं। साथ ही 2 को सुरक्षा की आवश्यकता होती है जो 1 प्रदान कर सकता है।",
          ar: "ينتج عن هذا المزيج علاقة ناجحة لأن صفات كلا الشخصين تكمل بعضها البعض. الرقم 1 شخص قوي، مهيمن، وموجه نحو الحياة المهنية بينما الرقم 6 شخص محب، محب للبيت، وذو شعور بالمسؤولية. هي ربة منزل جيدة وربة بيت متناغمة يمكنها أن تسامح الزوج المحتمل رقم 1. إذا كانت المرأة 1، فلديها مهمة في الحياة وقد تكون موجهة نحو الحياة المهنية أو واقعية. لكنها تتصرف كربة منزل وهو مطلب الرجل 6. هي ديناميكية وهو زوج مخلص، مما يجعلهما فريقًا جيدًا. قد يكون هناك وقت تتعارض فيه أنانية الرقم 1 مع كرم الرقم 6 وتكون التسوية ضرورية.",
        },
      },
      "1-7": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Keduanya menunjukkan hubungan yang harmonis dan kehidupan yang sangat baik. No. 1 adalah pelaku, berorientasi karier, mandiri, dan suportif secara intuitif terhadap 7 yang cerdas, misterius, dan intuitif – mendukung satu sama lain untuk pengembangan lebih lanjut. Karier 1 mendapat akselerasi sementara penelitian dan spesialisasi 7 dipromosikan. Keduanya cenderung melakukan perjalanan untuk spesialisasi baru. Terkadang pencapaian 1 mungkin bertentangan dengan introspeksi 7 tetapi pesona, ketulusan, dan sedikit pengampunan kemungkinan akan menyatukan mereka. Di sisi intim, Pria 1 bergairah dan demonstratif dan tahu bagaimana menyesuaikan diri dengan wanita 7. Dia tidak cemburu dan tahu bagaimana menggunakan imajinasinya dan intuisinya untuk menyesuaikan pasangannya. Di sisi lain, pria 7 menggunakan sifat demonstratif wanita 1. Keduanya mendapatkan kepuasan secara fisik maupun spiritual.",
          en: "The two of them live a harmonious life. No. 1 is a doer, career minded, independent and purposeful fitting very well with No. 7 who is intelligent, mysterious and intuitive—supporting each other for further development. Career of 1 gets acceleration while research and specialisation of 7 is promoted. Both of them like to travel for new experiences. Only at times the attainment of 1 may conflict with the introspections of 7 but the charm, sincerity and a bit of forgiveness is likely to keep them together. On the intimate side the 1 Man is passionate and demonstrative and knows how to adjust with the 7 woman. She is neither jealous nor possessive and can use her imagination and intuition to suit her partner.",
          Fr: "Les deux montrent une relation harmonieuse et une très bonne vie. Le n°1 est un battant, axé sur la carrière, indépendant et intuitif pour soutenir le 7 qui est intelligent, mystérieux et intuitif - se soutenant mutuellement pour un développement ultérieur. La carrière de 1 est accélérée tandis que la recherche et la spécialisation de 7 sont promues. Les deux sont susceptibles de voyager pour de nouvelles spécialisations. Parfois, les réalisations de 1 peuvent entrer en conflit avec l'introspection de 7, mais le charme, la sincérité et un peu de pardon sont susceptibles de les unir. Sur le plan intime, l'homme 1 est passionné et démonstratif et sait s'adapter à la femme 7. Il n'est pas jaloux et sait utiliser son imagination et son intuition pour s'adapter à sa partenaire. D'un autre côté, l'homme 7 utilise la nature démonstrative de la femme 1. Les deux obtiennent une satisfaction physique et spirituelle.",
          es: "Ambos muestran una relación armoniosa y una vida excelente. El Nº 1 es un hacedor, orientado a la carrera, independiente y apoya intuitivamente al 7 que es inteligente, misterioso e intuitivo, apoyándose mutuamente para un mayor desarrollo. La carrera de 1 se acelera mientras que la investigación y especialización de 7 se promueve. Es probable que ambos viajen para nuevas especializaciones. A veces, los logros de 1 pueden entrar en conflicto con la introspección de 7, pero es probable que el encanto, la sinceridad y un poco de perdón los unan. En el lado íntimo, el Hombre 1 es apasionado y demostrativo y sabe cómo adaptarse a la mujer 7. No es celoso y sabe cómo usar su imaginación y su intuición para adaptarse a su pareja. Por otro lado, el hombre 7 utiliza la naturaleza demostrativa de la mujer 1. Ambos obtienen satisfacción tanto física como espiritualmente.",
          zh: "两者都表现出和谐的关系和美好的生活。1号是实干家、事业心强、独立，并且直觉上支持聪明、神秘和直觉的7——互相支持以求进一步发展。1的事业得到加速，而7的研究和专业化得到促进。两人都倾向于为新的专业化而出差。有时1的成就可能与7的内省发生冲突，但魅力、真诚和一点点的宽恕很可能会将他们团结在一起。在亲密方面，男1热情、表现力强，知道如何适应女7。他不嫉妒，知道如何运用他的想象力和直觉来适应他的伴侣。另一方面，男7利用女1的表现力。两人在身体和精神上都得到满足。",
          hi: "एक आदर्श संयोजन, खासकर अगर 'पुरुष 1' और 'महिला 2' एक-दूसरे के प्रति विपरीत आकर्षण के रूप में आकर्षित होते हैं। पुरुष 1 हावी होता है जबकि महिला 2 विनम्र होती है और वे एक-दूसरे के बहुत अच्छे पूरक होते हैं। महिला 2 रोमांटिक, वफादार, जन्मजात परिचारिका, निष्क्रिय और हमेशा वही करने को तैयार रहती है। वह शाम को उसका इंतजार करेगी, उसकी देखभाल करेगी और उसे वैवाहिक आनंद देगी और सभी पारिवारिक मामलों में उसकी सहायता करेगी। वह भी काफी संतुष्ट रहती है क्योंकि वह उसे वह सब कुछ देता है जो वह चाहती है। पुरुष 1 की बाहरी रुचियां होती हैं लेकिन महिला 2 घर के लिए होती है और शाम को हमेशा अपने पुरुष के साथ बिताना चाहेगी। उसका अपमान न करने का ध्यान रखा जाना चाहिए क्योंकि 2 ईर्ष्यालु और आसानी से उत्तेजित होने वाले होते हैं। साथ ही 2 को सुरक्षा की आवश्यकता होती है जो 1 प्रदान कर सकता है।",
          ar: "ينتج عن هذا المزيج علاقة ناجحة لأن صفات كلا الشخصين تكمل بعضها البعض. الرقم 1 شخص قوي، مهيمن، وموجه نحو الحياة المهنية بينما الرقم 7 ذكي، غامض، وحدسي. الصداقة مثالية إذا كان الرجل هو 1 والمرأة هي 7 لأنه حتى في الخلافات تتنازل بدرجة معينة من اليقين. هي ليست أنانية وصديقة مخلصة وليس لديها ذكاء أعلى من شريكها. ستشجع دائمًا طموحات شريكها. ومع ذلك، يمكن أن تتعارض أنانية الرقم 1 مع حب الخير لدى الرقم 7 وستكون هناك حاجة إلى مزيد من الضوابط. عندما يكون الرجل 7، يكون مزاجه سريعًا واندفاعه يجعله سلبيًا، ويجب التحكم في ذلك. كلاهما ذكيان وقادران على حد سواء، ويريد الرجل 7 أن يبقى رئيس المنزل بينما قد تعتقد المرأة 1 أنها هي الرئيسة. ومع ذلك، فإن هذه الاختلافات ليست خطيرة جدًا لأن عطف وتسامح المرأة 1 والحس السليم يمكن أن يحلاها بسهولة. في العلاقة الزوجية، تتوافق العدوانية الحسية للمرأة 1 تمامًا مع شغف وخضوع المرأة 7. إذا كان الرجل هو 7، فهو عاطفي للغاية ومبدع واستعراضي، وستطابقه المرأة 1 تمامًا.",
        },
      },
      "1-8": {
        percentage: 50,
        harmonyPercentage: 5,
        explanations: {
          id: "Ini adalah hubungan cinta/benci di mana kedua pasangan adalah karakter yang kuat, tangguh, dan kaku. Mereka akan selalu berusaha saling mengalahkan kecuali mereka dapat mengendalikan sifat-sifat paksa mereka. Keduanya terlalu bangga untuk saling meminta maaf. Jika No. 1 memutuskan untuk menggunakan pesona dan pengampunan dan No. 8 memutuskan untuk mengekang kecemburuan dan meredakan emosi, mereka dapat bekerja sama secara kooperatif, hubungannya dapat menjadi bencana yang sehat. Jika tidak, kemungkinan akan berakhir dalam perpisahan atau perceraian yang tidak dapat dihindari. Pria 1 adalah kekasih yang bergairah dan jika wanita 8 tidak siap, pria 1 tidak dapat memaksanya. Di sisi lain jika pria 8 dan wanita 1 adalah dia akan menemukan waktu yang tepat untuk berhubungan. Wanita 8 harus ingat bahwa pria 1 dapat menemukan pasangan lain jika cinta ditolak.",
          en: "This is a love/hate relationship in which both the partners are strong, tough and rigid characters. They will always try to outdo each other unless they can control their forceful dispositions. Both are too proud to apologize to each other. If No. 1 decides to use charm and forgiveness and No. 8 decides to curb jealousy and temper the emotions they can work together co-operatively, the relationship can be a healthy disaster. Otherwise it is likely to end up in unavoidable separation or divorce. The 1 Man is a passionate lover and if the 8 woman is not ready, the 1 man cannot force her.",
          Fr: "C'est une relation d'amour/haine où les deux partenaires sont des personnages forts, durs et rigides. Ils essaieront toujours de se surpasser à moins qu'ils ne puissent contrôler leurs traits de caractère coercitifs. Les deux sont trop fiers pour s'excuser l'un auprès de l'autre. Si le n°1 décide d'utiliser le charme et le pardon et que le n°8 décide de freiner la jalousie et d'apaiser les émotions, ils peuvent travailler ensemble de manière coopérative, la relation peut devenir un désastre sain. Sinon, il est probable que cela se termine par une séparation ou un divorce inévitable. L'homme 1 est un amant passionné et si la femme 8 n'est pas prête, l'homme 1 ne peut pas la forcer. D'un autre côté, si l'homme est 8 et la femme 1, il trouvera le bon moment pour avoir des relations. La femme 8 doit se rappeler que l'homme 1 peut trouver un autre partenaire si l'amour est refusé.",
          es: "Esta es una relación de amor/odio en la que ambos miembros de la pareja son personajes fuertes, duros y rígidos. Siempre intentarán superarse el uno al otro a menos que puedan controlar sus rasgos coercitivos. Ambos son demasiado orgullosos para pedirse perdón. Si el Nº 1 decide usar el encanto y el perdón y el Nº 8 decide frenar los celos y aliviar las emociones, pueden trabajar juntos en cooperación, la relación puede convertirse en un desastre saludable. De lo contrario, es probable que termine en una separación o divorcio inevitable. El hombre 1 es un amante apasionado y si la mujer 8 no está lista, el hombre 1 no puede forzarla. Por otro lado, si el hombre es 8 y la mujer 1, encontrará el momento adecuado para tener relaciones. La mujer 8 debe recordar que el hombre 1 puede encontrar otra pareja si se le niega el amor.",
          zh: "这是一种爱恨交织的关系，双方都是坚强、强硬和僵硬的角色。除非他们能够控制自己强迫性的特质，否则他们总是会试图超越对方。两人都太骄傲，不肯互相道歉。如果1号决定使用魅力和宽恕，而8号决定抑制嫉妒和缓和情绪，他们可以合作，关系可能会成为一场健康的灾难。否则，很可能会以不可避免的分离或离婚告终。男1是一个热情的爱人，如果女8还没准备好，男1不能强迫她。另一方面，如果男人是8，女人是1，他会找到合适的时间发生关系。女8必须记住，如果爱情被拒绝，男1可以找到另一个伴侣。",
          hi: "वे दोनों लंबे समय तक साथ नहीं रह सकते। नंबर 1 दृढ़, स्थिर और करियर उन्मुख है जबकि नंबर 8 बहुमुखी, परिवर्तनशील और सेक्सी है। रिश्ता और भी बदतर हो जाता है जब पुरुष 1 होता है और महिला 8 होती है। महिला 8 जीवन में जल्दी शादी नहीं करती जब तक कि उसका विवाह पूर्व संबंध न हो। वे दोनों आक्रामक हैं और स्थिति अक्सर भड़कने की संभावना है। उनके लिए समझौता करना मुश्किल है। यह केवल निजी जीवन है जो उन्हें एक साथ रख सकता है यदि वे अन्य मुद्दों पर समझौता कर सकते हैं। पुरुष 1 मजबूत, प्रदर्शनकारी और साहसी है जबकि महिला 8 सेक्स के मामलों में समायोजन कर सकती है। इसलिए दोनों एक-दूसरे के अनुकूल हो सकते हैं। यदि पुरुष 8 है तो वह सेक्स के लिए अधिक प्रवृत्त होता है लेकिन महिला 1 भी समायोजन कर सकती है और दोनों एक अच्छा जोड़ा बना सकते हैं।",
          ar: "هذه علاقة حب/كره حيث يكون كلا الشريكين شخصيتين قويتين وصارمتين. سيحاولان دائمًا التغلب على بعضهما البعض ما لم يتمكنا من التحكم في صفاتهما القسرية. كلاهما فخوران جدًا بحيث لا يعتذران لبعضهما البعض. إذا قرر الرقم 1 استخدام السحر والتسامح وقرر الرقم 8 كبح الغيرة وتخفيف المشاعر، فيمكنهما العمل معًا بشكل تعاوني، ويمكن أن تكون العلاقة كارثة صحية. وإلا، فمن المرجح أن تنتهي بانفصال أو طلاق لا مفر منه. الرجل 1 حبيب عاطفي وإذا لم تكن المرأة 8 مستعدة، فلا يمكن للرجل 1 إجبارها. من ناحية أخرى إذا كان الرجل 8 والمرأة 1، فسيجد الوقت المناسب للتواصل. يجب أن تتذكر المرأة 8 أن الرجل 1 يمكن أن يجد شريكًا آخر إذا تم رفض الحب.",
        },
      },
      "1-9": {
        percentage: 75,
        harmonyPercentage: 7.5,
        explanations: {
          id: "Kombinasi tersebut menghasilkan hubungan yang sukses karena sifat-sifat kedua orang saling melengkapi. No. 1 adalah orang yang kuat, dominan, dan berorientasi karier sementara No. 9 simpatik, filantropis, dan penuh kasih sayang. Persahabatan itu ideal jika Pria adalah 1 dan Wanita adalah 9 karena bahkan dalam ketidaksepakatan dia berkompromi dengan tingkat kepastian tertentu. Dia tidak egois dan teman yang setia dengan tidak ada kecerdasan yang lebih tinggi dari pasangannya. Dia akan selalu mendorong ambisi pasangannya. Namun, keegoisan 1 dapat bertentangan dengan filantropi 9 dan cek lebih lanjut akan diperlukan. Ketika Pria 9 temperamennya cepat dan impulsifitasnya membuat dia negatif, dan ini harus dikendalikan. Keduanya sama-sama cerdas dan cakap, Pria 9 ingin tetap menjadi bos rumah sementara wanita 1 mungkin berpikir dia adalah kepala. Namun, perbedaan ini tidak begitu serius karena kasih sayang dan pengampunan dari wanita 1 dan akal sehat dapat dengan mudah menyelesaikannya. Dalam hubungan perkawinan, agresivitas sensual wanita 1 sangat cocok dengan gairah dan ketundukan wanita 9. Jika pria adalah 9, dia sangat bergairah dan inventif serta demonstratif, wanita 1 akan mencocokkannya dengan sempurna.",
          en: "The combination produce a successful relationship since the natures of the two persons complement each other. No 1 is forceful, dominant and career minded while No 9 is sympathetic, philanthropic and compassionate. The companionship is ideal if the Male is 1 and the Female is 9 because even in disagreement she compromises with a certain degree of humour. She is an unselfish and loyal companion with no less intelligence than his. She will always encourage the ambition of her partner. However, the selfishness of 1 can conflict with philanthropy of 9 and a check here would be necessary. When the Man is 9 his quick temperament and impulsiveness makes him negative, and this should be controlled. Although both are equally intelligent and capable, the 9 Man would like to remain the boss of the home while 1 woman may think that she is head. However, this difference is not so serious since the affection and forgiveness of 1 Woman and some faith and common sense can easily work it out. ",
          Fr: "La combinaison aboutit à une relation réussie car les traits des deux personnes se complètent. Le n°1 est une personne forte, dominante et axée sur la carrière tandis que le n°9 est sympathique, philanthrope et affectueux. L'amitié est idéale si l'homme est 1 et la femme est 9 car même en cas de désaccord, elle fait des compromis avec un certain degré de certitude. Elle est désintéressée et une amie fidèle sans intelligence supérieure à son partenaire. Elle encouragera toujours les ambitions de son partenaire. Cependant, l'égoïsme de 1 peut entrer en conflit avec la philanthropie de 9 et un contrôle supplémentaire sera nécessaire. Lorsque l'homme est 9, son tempérament vif et son impulsivité le rendent négatif, et cela doit être contrôlé. Les deux sont également intelligents et capables, l'homme 9 veut rester le patron de la maison tandis que la femme 1 peut penser qu'elle est le chef. Cependant, ces différences ne sont pas si graves car l'affection et le pardon de la femme 1 et le bon sens peuvent facilement les résoudre. Dans la relation conjugale, l'agressivité sensuelle de la femme 1 encaisse parfaitement avec la passion et la soumission de la femme 9. Si l'homme est 9, il est très passionné, inventif et démonstratif, la femme 1 lui correspondra parfaitement.",
          es: "La combinación da como resultado una relación exitosa porque los rasgos de ambas personas se complementan. El Nº 1 es una persona fuerte, dominante y orientada a la carrera, mientras que el Nº 9 es comprensivo, filantrópico y afectuoso. La amistad es ideal si el Hombre es 1 y la Mujer es 9 porque incluso en el desacuerdo, ella se compromete con un cierto grado de certeza. Es desinteresada y una amiga leal sin mayor inteligencia que su pareja. Siempre fomentará las ambiciones de su pareja. Sin embargo, el egoísmo de 1 puede entrar en conflicto con la filantropía de 9 y se necesitará un mayor control. Cuando el Hombre es 9, su temperamento rápido y su impulsividad lo vuelven negativo, y esto debe controlarse. Ambos son igualmente inteligentes y capaces, el Hombre 9 quiere seguir siendo el jefe de la casa mientras que la mujer 1 puede pensar que ella es la cabeza. Sin embargo, estas diferencias no son tan graves porque el afecto y el perdón de la mujer 1 y el sentido común pueden resolverlas fácilmente. En la relación matrimonial, la agresividad sensual de la mujer 1 encaja perfectamente con la pasión y la sumisión de la mujer 9. Si el hombre es 9, es muy apasionado, inventivo y demostrativo, la mujer 1 lo igualará perfectamente.",
          zh: "这种组合会产生成功的关系，因为两个人的特质是互补的。1号是一个坚强、占主导地位和事业心强的人，而9号是富有同情心、慈善和充满爱心的人。如果男人是1，女人是9，友谊是理想的，因为即使在分歧中，她也会在一定程度上妥协。她无私，是一个忠实的朋友，智力不高于她的伴侣。她总是会鼓励伴侣的雄心。然而，1的自私可能会与9的慈善事业发生冲突，需要进一步的检查。当男人是9时，他的脾气暴躁和冲动使他变得消极，这必须得到控制。两人同样聪明能干，男9希望继续当家作主，而女1可能认为自己是头。然而，这些差异并不那么严重，因为女1的爱和宽恕以及常识可以很容易地解决它们。在婚姻关系中，女1的感官攻击性与女9的热情和顺从完美匹配。如果男人是9，他非常热情、富有创造力和表现力，女1会与他完美匹配。",
          hi: "एक आदर्श संयोजन, खासकर अगर 'पुरुष 1' और 'महिला 2' एक-दूसरे के प्रति विपरीत आकर्षण के रूप में आकर्षित होते हैं। पुरुष 1 हावी होता है जबकि महिला 2 विनम्र होती है और वे एक-दूसरे के बहुत अच्छे पूरक होते हैं। महिला 2 रोमांटिक, वफादार, जन्मजात परिचारिका, निष्क्रिय और हमेशा वही करने को तैयार रहती है। वह शाम को उसका इंतजार करेगी, उसकी देखभाल करेगी और उसे वैवाहिक आनंद देगी और सभी पारिवारिक मामलों में उसकी सहायता करेगी। वह भी काफी संतुष्ट रहती है क्योंकि वह उसे वह सब कुछ देता है जो वह चाहती है। पुरुष 1 की बाहरी रुचियां होती हैं लेकिन महिला 2 घर के लिए होती है और शाम को हमेशा अपने पुरुष के साथ बिताना चाहेगी। उसका अपमान न करने का ध्यान रखा जाना चाहिए क्योंकि 2 ईर्ष्यालु और आसानी से उत्तेजित होने वाले होते हैं। साथ ही 2 को सुरक्षा की आवश्यकता होती है जो 1 प्रदान कर सकता है।",
          ar: "ينتج عن هذا المزيج علاقة ناجحة لأن صفات كلا الشخصين تكمل بعضها البعض. الرقم 1 شخص قوي، مهيمن، وموجه نحو الحياة المهنية بينما الرقم 9 متعاطف، محب للخير، وعطوف. الصداقة مثالية إذا كان الرجل هو 1 والمرأة هي 9 لأنه حتى في الخلافات تتنازل بدرجة معينة من اليقين. هي ليست أنانية وصديقة مخلصة وليس لديها ذكاء أعلى من شريكها. ستشجع دائمًا طموحات شريكها. ومع ذلك، يمكن أن تتعارض أنانية الرقم 1 مع حب الخير لدى الرقم 9 وستكون هناك حاجة إلى مزيد من الضوابط. عندما يكون الرجل 9، يكون مزاجه سريعًا واندفاعه يجعله سلبيًا، ويجب التحكم في ذلك. كلاهما ذكيان وقادران على حد سواء، ويريد الرجل 9 أن يبقى رئيس المنزل بينما قد تعتقد المرأة 1 أنها هي الرئيسة. ومع ذلك، فإن هذه الاختلافات ليست خطيرة جدًا لأن عطف وتسامح المرأة 1 والحس السليم يمكن أن يحلاها بسهولة. في العلاقة الزوجية، تتوافق العدوانية الحسية للمرأة 1 تمامًا مع شغف وخضوع المرأة 9. إذا كان الرجل هو 9، فهو عاطفي للغاية ومبدع واستعراضي، وستطابقه المرأة 1 تمامًا.",
        },
      },
    };

    // Create symmetric entries (2-1 same as 1-2, etc.)
    const key1 = `${time1}-${time2}`;
    const key2 = `${time2}-${time1}`;

    const matchData = matchTable[key1] || matchTable[key2];

    if (matchData) {
      const currentLanguage = language as keyof typeof matchData.explanations;
      const explanation =
        matchData.explanations[currentLanguage] || matchData.explanations.en;

      return {
        percentage: matchData.percentage,
        explanation: explanation,
      };
    }

    return {
      percentage: 50,
      explanation:
        language === "id"
          ? "Kombinasi ini memerlukan analisis lebih lanjut untuk menentukan tingkat kompatibilitas yang tepat."
          : "This combination requires further analysis to determine the exact compatibility level.",
    };
  };

  // Yearly Relationship Table for graph calculations
  const yearlyRelationshipTable: Record<string, number> = {
    "1-1": 0.5, "1-19": 0.5, "1-2": 0.75, "1-11": 0.75, "1-3": 0.75,
    "1-4": -1, "1-13": -1, "1-22": -1, "1-5": -1, "1-14": -1, "1-6": 0.75,
    "1-33": 0.75, "1-7": 0.75, "1-16": 0.75, "1-8": 0.5, "1-9": 0.75,
    "2-1": 0.75, "2-19": 0.75, "2-2": 1, "2-11": 1, "2-3": 0.5, "2-4": 0.75,
    "2-13": 0.75, "2-22": 0.75, "2-5": -1, "2-14": -1, "2-6": 1, "2-33": 1,
    "2-7": 0.75, "2-16": 0.75, "2-8": 0.5, "2-9": 1, "3-1": 0.75, "3-19": 0.75,
    "3-2": 0.5, "3-11": 0.5, "3-3": -1, "3-4": 0.5, "3-13": 0.5, "3-22": 0.5,
    "3-5": 0.75, "3-14": 0.75, "3-6": 1, "3-33": 1, "3-7": 0.5, "3-16": 0.5,
    "3-8": -1, "3-9": 1, "4-1": -1, "4-19": -1, "4-2": 0.75, "4-11": 0.75,
    "4-3": 0.5, "4-4": 1, "4-13": 1, "4-22": 1, "4-5": 0.5, "4-14": 0.5,
    "4-6": 1, "4-33": 1, "4-7": 0.75, "4-16": 0.75, "4-8": 0.75, "4-9": 0.75,
    "5-1": -1, "5-19": -1, "5-2": -1, "5-11": -1, "5-3": 0.75, "5-4": 0.5,
    "5-13": 0.5, "5-22": 0.5, "5-5": -1, "5-14": -1, "5-6": 0.5, "5-33": 0.5,
    "5-7": 0.5, "5-16": 0.5, "5-8": 0.5, "5-9": 0.5, "6-1": 0.75, "6-2": 1,
    "6-11": 1, "6-3": 1, "6-4": 1, "6-13": 1, "6-22": 1, "6-5": 0.5, "6-14": 0.5,
    "6-6": 1, "6-33": 1, "6-7": 0.5, "6-16": 0.5, "6-8": 0.5, "6-9": 1,
    "7-1": 0.75, "7-19": 0.75, "7-2": 0.75, "7-11": 0.75, "7-3": 0.5, "7-4": 0.75,
    "7-13": 0.75, "7-22": 0.75, "7-5": 0.5, "7-14": 0.5, "7-6": 0.5, "7-33": 0.5,
    "7-7": 1, "7-16": 1, "7-8": 0.5, "7-9": 1, "8-1": 0.5, "8-19": 0.5, "8-2": 0.5,
    "8-11": 0.5, "8-3": -1, "8-4": 0.75, "8-13": 0.75, "8-22": 0.75, "8-5": 0.5,
    "8-14": 0.5, "8-6": 0.75, "8-33": 0.75, "8-7": 0.5, "8-16": 0.5, "8-8": 0.5,
    "8-9": 0.75, "9-1": 0.75, "9-19": 0.75, "9-11": 0.75, "9-2": 1, "9-3": 1,
    "9-4": 0.75, "9-13": 0.75, "9-22": 0.75, "9-5": 0.5, "9-14": 0.5, "9-6": 1,
    "9-33": 1, "9-7": 1, "9-16": 1, "9-8": 0.75, "9-9": 1, "11-1": 0.75,
    "11-19": 0.75, "11-2": 1, "11-11": 1, "11-3": 0.5, "11-4": 0.75, "11-13": 0.75,
    "11-22": 0.75, "11-5": -1, "11-14": -1, "11-6": 1, "11-33": 1, "11-7": 0.75,
    "11-16": 0.75, "11-8": 0.5, "11-9": 1, "22-1": -1, "22-19": -1, "22-2": 0.75,
    "22-11": 0.75, "22-3": 0.5, "22-4": 1, "22-13": 1, "22-22": 1, "22-5": 0.5,
    "22-14": 0.5, "22-6": 1, "22-33": 1, "22-7": 0.75, "22-16": 0.75, "22-8": 0.75,
    "22-9": 0.75, "33-1": 0.75, "33-19": 0.75, "33-2": 0.75, "33-11": 0.75,
    "33-3": 1, "33-4": 1, "33-13": 1, "33-22": 1, "33-5": 0.5, "33-14": 0.5,
    "33-6": 1, "33-33": 1, "33-7": 0.5, "33-16": 0.5, "33-8": 0.5, "33-9": 1
  };

  // PY-Essence Relationship Table for new calculations
  const pyEssenceRelationshipTable: Record<string, number> = {
    "1-1": -0.25, "1-19": -0.25, "1-2": 0, "1-11": 0, "1-3": 0,
    "1-4": 0, "1-13": 0, "1-22": 0, "1-5": 0, "1-14": 0, "1-6": 0,
    "1-33": 0, "1-7": 0, "1-16": 0, "1-8": 0, "1-9": 0, "2-1": 0,
    "2-19": 0, "2-2": -0.25, "2-11": -0.25, "2-3": 0, "2-4": 0,
    "2-13": 0, "2-22": 0, "2-5": 0, "2-14": 0, "2-6": 0, "2-33": 0,
    "2-7": 0, "2-16": 0, "2-8": 0, "2-9": 0, "3-1": 0, "3-19": 0,
    "3-2": 0, "3-11": 0, "3-3": -0.25, "3-4": 0, "3-13": 0, "3-22": 0,
    "3-5": 0, "3-14": 0, "3-6": 0, "3-33": 0, "3-7": 0, "3-16": 0,
    "3-8": 0, "3-9": 0, "4-1": 0, "4-19": 0, "4-2": 0, "4-11": 0,
    "4-3": 0, "4-4": -0.25, "4-13": -0.25, "4-22": -0.25, "4-5": 0,
    "4-14": 0, "4-6": 0, "4-33": 0, "4-7": 0, "4-16": 0, "4-8": 0,
    "4-9": 0, "5-1": 0, "5-19": 0, "5-2": 0, "5-11": 0, "5-3": 0,
    "5-4": 0, "5-13": 0, "5-22": 0, "5-5": -0.25, "5-14": -0.25,
    "5-6": 0, "5-33": 0, "5-7": 0, "5-16": 0, "5-8": 0, "5-9": 0,
    "6-1": 0, "6-19": 0, "6-2": 0, "6-11": 0, "6-3": 0, "6-4": 0,
    "6-13": 0, "6-22": 0, "6-5": 0, "6-14": 0, "6-6": -0.25, "6-33": -0.25,
    "6-7": 0, "6-16": 0, "6-8": 0, "6-9": 0, "7-1": 0, "7-19": 0,
    "7-2": 0, "7-11": 0, "7-3": 0, "7-4": 0, "7-13": 0, "7-22": 0,
    "7-5": 0, "7-14": 0, "7-6": 0, "7-33": 0, "7-7": -0.25, "7-16": -0.25,
    "7-8": 0, "7-9": 0, "8-1": 0, "8-19": 0, "8-2": 0, "8-11": 0,
    "8-3": 0, "8-4": 0, "8-13": 0, "8-22": 0, "8-5": 0, "8-14": 0,
    "8-6": 0, "8-33": 0, "8-7": 0, "8-16": 0, "8-8": -0.25, "8-9": 0,
    "9-1": 0, "9-19": 0, "9-11": 0, "9-2": 0, "9-3": 0, "9-4": 0,
    "9-13": 0, "9-22": 0, "9-5": 0, "9-14": 0, "9-6": 0, "9-33": 0,
    "9-7": 0, "9-16": 0, "9-8": 0, "9-9": -0.25, "11-1": 0, "11-19": 0,
    "11-2": -0.25, "11-11": -0.25, "11-3": 0, "11-4": 0, "11-13": 0,
    "11-22": 0, "11-5": 0, "11-14": 0, "11-6": 0, "11-33": 0, "11-7": 0,
    "11-16": 0, "11-8": 0, "11-9": 0, "13-1": 0, "13-19": 0, "13-2": 0,
    "13-11": 0, "13-3": 0, "13-4": -0.25, "13-13": -0.25, "13-22": -0.25,
    "13-5": 0, "13-14": 0, "13-6": 0, "13-33": 0, "13-7": 0, "13-16": 0,
    "13-8": 0, "13-9": 0, "14-1": 0, "14-19": 0, "14-2": 0, "14-11": 0,
    "14-3": 0, "14-4": 0, "14-13": 0, "14-22": 0, "14-5": -0.25,
    "14-14": -0.25, "14-6": 0, "14-33": 0, "14-7": 0, "14-16": 0,
    "14-8": 0, "14-9": 0, "16-1": 0, "16-19": 0, "16-2": 0, "16-11": 0,
    "16-3": 0, "16-4": 0, "16-13": 0, "16-22": 0, "16-5": 0, "16-14": 0,
    "16-6": 0, "16-33": 0, "16-7": -0.25, "16-16": -0.25, "16-8": 0,
    "16-9": 0, "19-1": -0.25, "19-19": -0.25, "19-2": 0, "19-11": 0,
    "19-3": 0, "19-4": 0, "19-13": 0, "19-22": 0, "19-5": 0, "19-14": 0,
    "19-6": 0, "19-33": 0, "19-7": 0, "19-16": 0, "19-8": 0, "19-9": 0,
    "22-1": 0, "22-19": 0, "22-2": 0, "22-11": 0, "22-3": 0, "22-4": -0.25,
    "22-13": -0.25, "22-22": -0.25, "22-5": 0, "22-14": 0, "22-6": 0,
    "22-33": 0, "22-7": 0, "22-16": 0, "22-8": 0, "22-9": 0, "33-1": 0,
    "33-19": 0, "33-2": 0, "33-11": 0, "33-3": 0, "33-4": 0, "33-13": 0,
    "33-22": 0, "33-5": 0, "33-14": 0, "33-6": -0.25, "33-33": -0.25,
    "33-7": 0, "33-16": 0, "33-8": 0, "33-9": 0,
  };

  // Helper function to get PY-Essence value
  const getPyEssenceValue = (py: number, ess: number): number => {
    const pyValue = ensureNumber(py);
    const essValue = ensureNumber(ess);
    if (pyValue === 0 && essValue === 0) return 0;
    const key = `${pyValue}-${essValue}`;
    const result = pyEssenceRelationshipTable[key] || 0;
    return ensureNumber(result);
  };

  // Helper function for yearly relationship values (for graph calculations)
  const getYearlyRelationshipValue = (val1: number, val2: number): number => {
    const value1 = ensureNumber(val1);
    const value2 = ensureNumber(val2);
    if (value1 === 0 && value2 === 0) return 0;
    const key1 = `${value1}-${value2}`;
    const key2 = `${value2}-${value1}`;
    const result = yearlyRelationshipTable[key1] || yearlyRelationshipTable[key2] || 0;
    return ensureNumber(result);
  };

  // Get harmony percentage based on parameter combinations (for other calculations)
  const getHarmonyPercentage = (param1: number, param2: number): number => {
    const harmonyTable: Record<string, number> = {
  "1-1": 5,
  "1-2": 7.5,
  "1-3": 7.5,
  "1-4": 2.5,
  "1-5": 2.5,
  "1-6": 7.5,
  "1-33": 7.5,
  "1-7": 7.5,
  "1-8": 5,
  "1-9": 7.5,
  "1-11": 7.5,
  "1-22": 2.5,
  "2-1": 7.5,
  "2-2": 10,
  "2-3": 5,
  "2-4": 7.5,
  "2-5": 2.5,
  "2-6": 10,
  "2-33": 10,
  "2-7": 7.5,
  "2-8": 5,
  "2-9": 10,
  "2-11": 10,
  "2-22": 7.5,
  "3-1": 7.5,
  "3-2": 5,
  "3-3": 2.5,
  "3-4": 5,
  "3-5": 7.5,
  "3-6": 10,
  "3-33": 10,
  "3-7": 5,
  "3-8": 2.5,
  "3-9": 10,
  "3-11": 5,
  "3-22": 5,
  "4-1": 2.5,
  "4-2": 7.5,
  "4-3": 5,
  "4-4": 10,
  "4-5": 5,
  "4-6": 10,
  "4-33": 10,
  "4-7": 7.5,
  "4-8": 7.5,
  "4-9": 7.5,
  "4-11": 7.5,
  "4-22": 10,
  "5-1": 2.5,
  "5-2": 2.5,
  "5-3": 7.5,
  "5-4": 5,
  "5-5": 2.5,
  "5-6": 5,
  "5-33": 5,
  "5-7": 5,
  "5-8": 5,
  "5-9": 5,
  "5-11": 2.5,
  "5-22": 5,
  "6-1": 7.5,
  "6-2": 10,
  "6-3": 10,
  "6-4": 10,
  "6-5": 5,
  "6-6": 10,
  "6-33": 10,
  "6-7": 5,
  "6-8": 5,
  "6-9": 10,
  "6-11": 10,
  "6-22": 10,
  "7-1": 7.5,
  "7-2": 7.5,
  "7-3": 5,
  "7-4": 7.5,
  "7-5": 5,
  "7-6": 5,
  "7-33": 5,
  "7-7": 10,
  "7-8": 5,
  "7-9": 10,
  "7-11": 7.5,
  "7-22": 7.5,
  "8-1": 5,
  "8-2": 5,
  "8-3": 2.5,
  "8-4": 7.5,
  "8-5": 5,
  "8-6": 7.5,
  "8-33": 7.5,
  "8-7": 5,
  "8-8": 5,
  "8-9": 7.5,
  "8-11": 5,
  "8-22": 7.5,
  "9-1": 7.5,
  "9-2": 10,
  "9-3": 10,
  "9-4": 7.5,
  "9-5": 5,
  "9-6": 10,
  "9-33": 10,
  "9-7": 10,
  "9-8": 7.5,
  "9-9": 10,
  "9-11": 10,
  "9-22": 7.5,
  "11-1": 7.5,
  "11-2": 10,
  "11-3": 5,
  "11-4": 7.5,
  "11-5": 2.5,
  "11-6": 10,
  "11-33": 10,
  "11-7": 7.5,
  "11-8": 5,
  "11-9": 10,
  "11-11": 10,
  "11-22": 7.5,
  "22-1": 2.5,
  "22-2": 7.5,
  "22-3": 5,
  "22-4": 10,
  "22-5": 5,
  "22-6": 10,
  "22-33": 10,
  "22-7": 7.5,
  "22-8": 7.5,
  "22-9": 7.5,
  "22-11": 7.5,
  "22-22": 10,
  "33-1": 7.5,
  "33-2": 7.5,
  "33-3": 10,
  "33-4": 10,
  "33-5": 5,
  "33-6": 10,
  "33-33": 10,
  "33-7": 5,
  "33-8": 5,
  "33-9": 10,
  "33-11": 10,
  "33-22": 10,
};

    const key1 = `${param1}-${param2}`;
    const key2 = `${param2}-${param1}`;

    return harmonyTable[key1] || harmonyTable[key2] || 5.0;
  };

  // Get minor harmony percentage for specific parameters (Birth, Ultimate, Habit, Plan of Expression, Point of Intensification)
  const getMinorHarmonyPercentage = (
    param1: number,
    param2: number,
  ): number => {
    const minorHarmonyTable: Record<string, number> = {
    "1-1": 5,
  "1-2": 7.5,
  "1-3": 7.5,
  "1-4": 2.5,
  "1-5": 2.5,
  "1-6": 7.5,
  "1-33": 7.5,
  "1-7": 7.5,
  "1-8": 5,
  "1-9": 7.5,
  "1-11": 7.5,
  "1-22": 2.5,
  "2-1": 7.5,
  "2-2": 10,
  "2-3": 5,
  "2-4": 7.5,
  "2-5": 2.5,
  "2-6": 10,
  "2-33": 10,
  "2-7": 7.5,
  "2-8": 5,
  "2-9": 10,
  "2-11": 10,
  "2-22": 7.5,
  "3-1": 7.5,
  "3-2": 5,
  "3-3": 2.5,
  "3-4": 5,
  "3-5": 7.5,
  "3-6": 10,
  "3-33": 10,
  "3-7": 5,
  "3-8": 2.5,
  "3-9": 10,
  "3-11": 5,
  "3-22": 5,
  "4-1": 2.5,
  "4-2": 7.5,
  "4-3": 5,
  "4-4": 10,
  "4-5": 5,
  "4-6": 10,
  "4-33": 10,
  "4-7": 7.5,
  "4-8": 7.5,
  "4-9": 7.5,
  "4-11": 7.5,
  "4-22": 10,
  "5-1": 2.5,
  "5-2": 2.5,
  "5-3": 7.5,
  "5-4": 5,
  "5-5": 2.5,
  "5-6": 5,
  "5-33": 5,
  "5-7": 5,
  "5-8": 5,
  "5-9": 5,
  "5-11": 2.5,
  "5-22": 5,
  "6-1": 7.5,
  "6-2": 10,
  "6-3": 10,
  "6-4": 10,
  "6-5": 5,
  "6-6": 10,
  "6-33": 10,
  "6-7": 5,
  "6-8": 5,
  "6-9": 10,
  "6-11": 10,
  "6-22": 10,
  "7-1": 7.5,
  "7-2": 7.5,
  "7-3": 5,
  "7-4": 7.5,
  "7-5": 5,
  "7-6": 5,
  "7-33": 5,
  "7-7": 10,
  "7-8": 5,
  "7-9": 10,
  "7-11": 7.5,
  "7-22": 7.5,
  "8-1": 5,
  "8-2": 5,
  "8-3": 2.5,
  "8-4": 7.5,
  "8-5": 5,
  "8-6": 7.5,
  "8-33": 7.5,
  "8-7": 5,
  "8-8": 5,
  "8-9": 7.5,
  "8-11": 5,
  "8-22": 7.5,
  "9-1": 7.5,
  "9-2": 10,
  "9-3": 10,
  "9-4": 7.5,
  "9-5": 5,
  "9-6": 10,
  "9-33": 10,
  "9-7": 10,
  "9-8": 7.5,
  "9-9": 10,
  "9-11": 10,
  "9-22": 7.5,
  "11-1": 7.5,
  "11-2": 10,
  "11-3": 5,
  "11-4": 7.5,
  "11-5": 2.5,
  "11-6": 10,
  "11-33": 10,
  "11-7": 7.5,
  "11-8": 5,
  "11-9": 10,
  "11-11": 10,
  "11-22": 7.5,
  "22-1": 2.5,
  "22-2": 7.5,
  "22-3": 5,
  "22-4": 10,
  "22-5": 5,
  "22-6": 10,
  "22-33": 10,
  "22-7": 7.5,
  "22-8": 7.5,
  "22-9": 7.5,
  "22-11": 7.5,
  "22-22": 10,
  "33-1": 7.5,
  "33-2": 7.5,
  "33-3": 10,
  "33-4": 10,
  "33-5": 5,
  "33-6": 10,
  "33-33": 10,
  "33-7": 5,
  "33-8": 5,
  "33-9": 10,
  "33-11": 10,
  "33-22": 10,
};
    const key1 = `${param1}-${param2}`;
    const key2 = `${param2}-${param1}`;

    return minorHarmonyTable[key1] || minorHarmonyTable[key2] || 0.1;
  };

  // Calculate total harmony value
  const calculateHarmony = (
    person1: {
      expression: number;
      time: number;
      heart: number;
      personality: number;
      birth: number;
      ultimate: number;
      name: number;
      habit: number;
      planOfExpression: number;
      pointOfIntensification: number;
    },
    person2: {
      expression: number;
      time: number;
      heart: number;
      personality: number;
      birth: number;
      ultimate: number;
      name: number;
      habit: number;
      planOfExpression: number;
      pointOfIntensification: number;
    },
  ): number => {
    let totalHarmony = 0;

    // 14 parameter combinations with multiplication factors
    // Expression vs Expression : faktor pengali = 12.5/10
    totalHarmony +=
      getHarmonyPercentage(person1.expression, person2.expression) *
      (12.5 / 10);

    // Expression vs Time : faktor pengali = 12.5/10
    totalHarmony +=
      getHarmonyPercentage(person1.expression, person2.time) * (12.5 / 10);

    // Expression vs Heart : faktor pengali = 5/10
    totalHarmony +=
      getHarmonyPercentage(person1.expression, person2.heart) * (5 / 10);

    // Time vs Time : faktor pengali = 12.5/10
    totalHarmony +=
      getHarmonyPercentage(person1.time, person2.time) * (12.5 / 10);

    // Time vs Expression : faktor pengali = 12.5/10
    totalHarmony +=
      getHarmonyPercentage(person1.time, person2.expression) * (12.5 / 10);

    // Time vs Heart : faktor pengali = 5/10
    totalHarmony +=
      getHarmonyPercentage(person1.time, person2.heart) * (5 / 10);

    // Heart vs Time : faktor pengali = 5/10
    totalHarmony +=
      getHarmonyPercentage(person1.heart, person2.time) * (5 / 10);

    // Heart vs Expression : faktor pengali = 5/10
    totalHarmony +=
      getHarmonyPercentage(person1.heart, person2.expression) * (5 / 10);

    // Heart vs Heart : faktor pengali = 5/10
    totalHarmony +=
      getHarmonyPercentage(person1.heart, person2.heart) * (5 / 10);

    // Use minor values for specific parameters with multiplication factors
    // Birth vs Birth : faktor pengali = 5/10
    totalHarmony +=
      getMinorHarmonyPercentage(person1.birth, person2.birth) * (5 / 10);

    // Ultimate vs Ultimate : faktor pengali = 5/10
    totalHarmony +=
      getMinorHarmonyPercentage(person1.ultimate, person2.ultimate) * (5 / 10);

    // Habit vs Habit : faktor pengali = 5/10
    totalHarmony +=
      getMinorHarmonyPercentage(person1.habit, person2.habit) * (5 / 10);

    // Plan of Expression vs Plan of Expression : faktor pengali = 5/10
    totalHarmony +=
      getMinorHarmonyPercentage(
        person1.planOfExpression,
        person2.planOfExpression,
      ) *
      (5 / 10);

    // Point of Intensification vs Point of Intensification : faktor pengali = 5/10
    totalHarmony +=
      getMinorHarmonyPercentage(
        person1.pointOfIntensification,
        person2.pointOfIntensification,
      ) *
      (5 / 10);

    return Math.round(totalHarmony * 100) / 100; // Round to 2 decimal places
  };

  // Handle name click for detailed analysis in Fix Person
  const handleFixPersonNameClick = (name: string) => {
    const fixedPersonOriginal =
      personToFix === "person1"
        ? { name: name1, birthdate: birthdate1 }
        : { name: name2, birthdate: birthdate2 };

    const fixedPersonGender: "Male" | "Female" =
      personToFix === "person1" ? "Male" : "Female"; // Asumsi Person 1 Pria, Person 2 Wanita

    setSelectedNameForAnalysis(name);
    setSelectedNameBirthdate(fixedPersonOriginal.birthdate);
    setSelectedNameGender(fixedPersonGender);
  };

  const handleBackToFixResults = () => {
    setSelectedNameForAnalysis(null);
    setSelectedNameBirthdate(null);
  };

  // Generate combined life report for both persons
  const generateCombinedReport = () => {
    if (!name1 || !name2) return;

    // Generate reports for each person
    const report1 = generateLifeReport(name1, birthdate1, "Male").report;
    const report2 = generateLifeReport(name2, birthdate2, "Female").report;

    // Convert report2 to map with year as key for fast lookup
    const report2Map = new Map(report2.map((item) => [item.year, item]));

    // Combine data based on matching years
    const combined = report1
      .map((item1) => {
        const item2 = report2Map.get(item1.year);
        return {
          year: item1.year,
          person1: item1,
          person2: item2, // Will be undefined if Person 2 is not alive in that year
        };
      })
      .filter((item) => item.person2); // Only show rows where Person 2 exists in that year

    setCombinedReport(combined);
    setShowLifeReport(true);
  };

  // Helper function to calculate harmony color for dynamic coloring
  const getHarmonyColor = (basePerson: any, targetValue: number): string => {
    if (!basePerson || !targetValue) return "bg-white"; // Default color if data is missing

    const expHarmony = getHarmonyPercentage(basePerson.expression, targetValue);
    const timeHarmony = getHarmonyPercentage(basePerson.time, targetValue);
    const heartHarmony = getHarmonyPercentage(basePerson.heart, targetValue);

    const averageHarmony = (expHarmony + timeHarmony + heartHarmony) / 3;

    if (averageHarmony <= 5) {
      return "bg-red-200"; // Red
    } else if (averageHarmony > 5 && averageHarmony <= 7.5) {
      return "bg-green-200"; // Light Green
    } else {
      return "bg-green-400"; // Dark Green
    }
  };

  // Helper function to ensure values are valid numbers
  const ensureNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate cross-relationship value for each year using new yearly relationship table
  const calculateCrossRelationshipValue = (p1Core, p2Core, p1Yearly, p2Yearly) => {
  // Pastikan semua data yang dibutuhkan ada
  if (!p1Core || !p2Core || !p1Yearly || !p2Yearly) {
    return { avg_p1_vs_p2: 0, avg_p2_vs_p1: 0, py_ess_score_p1: 0, py_ess_score_p2: 0 };
  }

  // 1. Kalkulasi Skor P1 -> P2 (P1 Core vs P2 Yearly)
  // Hitung semua 9 kombinasi individual
  const p1_exp_vs_p2_cycle = getYearlyRelationshipValue(p1Core.expression, p2Yearly.cycle);
  const p1_exp_vs_p2_pinnacle = getYearlyRelationshipValue(p1Core.expression, p2Yearly.pinnacle);
  const p1_exp_vs_p2_essence = getYearlyRelationshipValue(p1Core.expression, p2Yearly.essence);
  const p1_time_vs_p2_cycle = getYearlyRelationshipValue(p1Core.time, p2Yearly.cycle);
  const p1_time_vs_p2_pinnacle = getYearlyRelationshipValue(p1Core.time, p2Yearly.pinnacle);
  const p1_time_vs_p2_essence = getYearlyRelationshipValue(p1Core.time, p2Yearly.essence);
  const p1_heart_vs_p2_cycle = getYearlyRelationshipValue(p1Core.heart, p2Yearly.cycle);
  const p1_heart_vs_p2_pinnacle = getYearlyRelationshipValue(p1Core.heart, p2Yearly.pinnacle);
  const p1_heart_vs_p2_essence = getYearlyRelationshipValue(p1Core.heart, p2Yearly.essence);
  
  // Rata-rata langsung dari 9 kombinasi
  const avg_p1_vs_p2 = (p1_exp_vs_p2_cycle + p1_exp_vs_p2_pinnacle + p1_exp_vs_p2_essence + 
                        p1_time_vs_p2_cycle + p1_time_vs_p2_pinnacle + p1_time_vs_p2_essence + 
                        p1_heart_vs_p2_cycle + p1_heart_vs_p2_pinnacle + p1_heart_vs_p2_essence) / 9;

  // 2. Kalkulasi Skor P2 -> P1 (P2 Core vs P1 Yearly)
  // Hitung semua 9 kombinasi individual
  const p2_exp_vs_p1_cycle = getYearlyRelationshipValue(p2Core.expression, p1Yearly.cycle);
  const p2_exp_vs_p1_pinnacle = getYearlyRelationshipValue(p2Core.expression, p1Yearly.pinnacle);
  const p2_exp_vs_p1_essence = getYearlyRelationshipValue(p2Core.expression, p1Yearly.essence);
  const p2_time_vs_p1_cycle = getYearlyRelationshipValue(p2Core.time, p1Yearly.cycle);
  const p2_time_vs_p1_pinnacle = getYearlyRelationshipValue(p2Core.time, p1Yearly.pinnacle);
  const p2_time_vs_p1_essence = getYearlyRelationshipValue(p2Core.time, p1Yearly.essence);
  const p2_heart_vs_p1_cycle = getYearlyRelationshipValue(p2Core.heart, p1Yearly.cycle);
  const p2_heart_vs_p1_pinnacle = getYearlyRelationshipValue(p2Core.heart, p1Yearly.pinnacle);
  const p2_heart_vs_p1_essence = getYearlyRelationshipValue(p2Core.heart, p1Yearly.essence);
  
  // Rata-rata langsung dari 9 kombinasi
  const avg_p2_vs_p1 = (p2_exp_vs_p1_cycle + p2_exp_vs_p1_pinnacle + p2_exp_vs_p1_essence + 
                        p2_time_vs_p1_cycle + p2_time_vs_p1_pinnacle + p2_time_vs_p1_essence + 
                        p2_heart_vs_p1_cycle + p2_heart_vs_p1_pinnacle + p2_heart_vs_p1_essence) / 9;

  // 3. Hitung skor internal PY vs Essence
  const py_ess_score_p1 = getPyEssenceValue(p1Yearly.personalYear, p1Yearly.essence);
  const py_ess_score_p2 = getPyEssenceValue(p2Yearly.personalYear, p2Yearly.essence);
  
  // 4. Kembalikan semua komponen nilai mentah
  return { 
    avg_p1_vs_p2,
    avg_p2_vs_p1,
    py_ess_score_p1,
    py_ess_score_p2,
  };
};


  // Calculate combined relationship value for each year
  const calculateYearlyRelationshipValue = (year: number) => {
  if (!lifeReports || !calculatedResults) {
    return { combined: 0, p1_vs_p2: 0, p2_vs_p1: 0, py_ess_score_p1: 0, py_ess_score_p2: 0 };
  }

  const person1Data = lifeReports.person1.find(r => r.year === year);
  const person2Data = lifeReports.person2.find(r => r.year === year);

  if (!person1Data || !person2Data) {
    return { combined: 0, p1_vs_p2: 0, p2_vs_p1: 0, py_ess_score_p1: 0, py_ess_score_p2: 0 };
  }

  // Ambil semua komponen skor mentah yang sudah dihitung dengan benar
  const { avg_p1_vs_p2, avg_p2_vs_p1, py_ess_score_p1, py_ess_score_p2 } = calculateCrossRelationshipValue(
    calculatedResults.person1,
    calculatedResults.person2,
    person1Data,
    person2Data
  );

  // Implementasi rumus akhir yang benar:
  // Skor akhir adalah rata-rata cross-relationship saja, tanpa menambahkan PY-Ess
  const final_p1_vs_p2 = avg_p1_vs_p2;
  const final_p2_vs_p1 = avg_p2_vs_p1;
  
  // Skor Akhir Gabungan = Rata-rata dari kedua skor cross-relationship + total skor PY-Ess
  const final_combined = ((avg_p1_vs_p2 + avg_p2_vs_p1) / 2) + py_ess_score_p1 + py_ess_score_p2;

  return {
    combined: final_combined,
    p1_vs_p2: final_p1_vs_p2,
    p2_vs_p1: final_p2_vs_p1,
    py_ess_score_p1,
    py_ess_score_p2,
  };
};

  // Generate line graph data
  const generateLineGraphData = () => {
    if (!lifeReports) return { combined: [], p1_vs_p2: [], p2_vs_p1: [] };

    const mergedYears = lifeReports.person1
      .filter(r1 => lifeReports.person2.some(r2 => r2.year === r1.year))
      .map(r1 => r1.year)
      .sort((a, b) => a - b);

    const combinedData: { year: number; relationshipValue: number }[] = [];
    const p1_vs_p2_data: { year: number; relationshipValue: number }[] = [];
    const p2_vs_p1_data: { year: number; relationshipValue: number }[] = [];

    mergedYears.forEach(year => {
      const scores = calculateYearlyRelationshipValue(year);
      combinedData.push({ year, relationshipValue: scores.combined });
      p1_vs_p2_data.push({ year, relationshipValue: scores.p1_vs_p2 });
      p2_vs_p1_data.push({ year, relationshipValue: scores.p2_vs_p1 });
    });

    return {
      combined: combinedData,
      p1_vs_p2: p1_vs_p2_data,
      p2_vs_p1: p2_vs_p1_data
    };
  };

  // Get harmony level color based on value
  const getHarmonyLevelColor = (value: number): string => {
    if (value >= 7.5) return "#22c55e"; // Green
    if (value >= 5) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  // Create smooth curve path using cubic bezier curves with intelligent straight line detection
  const createSmoothPath = (data: { year: number; relationshipValue: number }[], graphWidth: number, graphHeight: number, maxValue: number, range: number): string => {
    if (data.length < 2) return '';
    
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * (graphWidth - 48);
      const y = ((maxValue - point.relationshipValue) / range) * graphHeight;
      return { x, y, value: point.relationshipValue };
    });
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const nextPoint = points[i + 1];
      const prevPrevPoint = points[i - 2];
      
      // Check if current segment should be straight (same values)
      const isStraightSegment = Math.abs(currentPoint.value - prevPoint.value) < 0.01;
      
      if (isStraightSegment) {
        // Draw straight line for equal values
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
      } else {
        // Calculate control points for smoother cubic bezier curves
        const tension = 0.3; // Smoothness factor
        
        // Control point 1 (from previous point)
        let cp1x = prevPoint.x;
        let cp1y = prevPoint.y;
        
        if (prevPrevPoint && Math.abs(prevPrevPoint.value - prevPoint.value) > 0.01) {
          cp1x = prevPoint.x + (currentPoint.x - prevPrevPoint.x) * tension;
          cp1y = prevPoint.y + (currentPoint.y - prevPrevPoint.y) * tension;
        }
        
        // Control point 2 (to current point)
        let cp2x = currentPoint.x;
        let cp2y = currentPoint.y;
        
        if (nextPoint && Math.abs(nextPoint.value - currentPoint.value) > 0.01) {
          cp2x = currentPoint.x - (nextPoint.x - prevPoint.x) * tension;
          cp2y = currentPoint.y - (nextPoint.y - prevPoint.y) * tension;
        }
        
        // Use cubic bezier curve for smooth transitions
        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${currentPoint.x} ${currentPoint.y}`;
      }
    }
    
    return path;
  };

  // Find highest and lowest value years
  const findExtremeYears = (data: { year: number; relationshipValue: number }[]) => {
    if (data.length === 0) return { highest: [], lowest: [] };
    
    const maxValue = Math.max(...data.map(d => d.relationshipValue));
    const minValue = Math.min(...data.map(d => d.relationshipValue));
    
    const highest = data.filter(d => d.relationshipValue === maxValue).slice(0, 3); // Top 3
    const lowest = data.filter(d => d.relationshipValue === minValue).slice(0, 3); // Bottom 3
    
    return { highest, lowest };
  };

  // Render smooth curved line graph
  const renderLineGraph = (data: { year: number; relationshipValue: number }[]) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.relationshipValue));
    const minValue = Math.min(...data.map(d => d.relationshipValue));
    const range = maxValue - minValue || 1;
    const graphHeight = 200;
    const verticalPadding = 30; // Add vertical padding to ensure all points are visible
    const graphWidth = Math.max(600, data.length * 8);
    const { highest, lowest } = findExtremeYears(data);

    return (
      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="text-lg font-bold text-center mb-4 text-purple-800">
          Grafik Nilai Hubungan Gabungan (100 Tahun)
        </Text>
        
        {/* Extreme Values Display */}
        <View className="flex-row justify-between mb-4 px-2">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold text-green-700 mb-1">🔥 Tahun Terbaik:</Text>
            {highest.map((item, index) => (
              <Text key={index} className="text-xs text-green-600">
                {item.year}: {item.relationshipValue.toFixed(1)}
              </Text>
            ))}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold text-red-700 mb-1">⚠️ Tahun Menantang:</Text>
            {lowest.map((item, index) => (
              <Text key={index} className="text-xs text-red-600">
                {item.year}: {item.relationshipValue.toFixed(1)}
              </Text>
            ))}
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={{ width: graphWidth, height: graphHeight + 60 + (verticalPadding * 2) }}>
            {/* Y-axis labels */}
            <View className="absolute left-0" style={{ top: verticalPadding, height: graphHeight }}>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const value = maxValue - (ratio * range);
                return (
                  <View key={index} className="absolute flex-row items-center" style={{ top: ratio * graphHeight - 8 }}>
                    <Text className="text-xs text-gray-600 w-8 text-right mr-2">
                      {value.toFixed(1)}
                    </Text>
                    <View className="w-1 h-px bg-gray-300" />
                  </View>
                );
              })}
            </View>

            {/* Graph area */}
            <View className="ml-12" style={{ width: graphWidth - 48, height: graphHeight, marginTop: verticalPadding }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <View key={index} className="absolute w-full h-px bg-gray-200" style={{ top: ratio * graphHeight }} />
              ))}
              
              {/* Single smooth SVG curve */}
              <View className="relative w-full h-full">
                <Svg width={graphWidth - 48} height={graphHeight} style={{ position: 'absolute' }}>
                  {/* Main smooth curve with bold red color */}
                  <Path
                    d={createSmoothPath(data, graphWidth, graphHeight, maxValue, range)}
                    stroke="#dc2626"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                  />
                  
                  {/* Straight line segments with upward trend in bold blue */}
                  {data.map((point, index) => {
                    if (index === 0) return null; // Skip first point as it has no previous point
                    
                    const prevPoint = data[index - 1];
                    const currentPoint = point;
                    
                    // Calculate positions
                    const x1 = ((index - 1) / (data.length - 1)) * (graphWidth - 48);
                    const y1 = ((maxValue - prevPoint.relationshipValue) / range) * graphHeight;
                    const x2 = (index / (data.length - 1)) * (graphWidth - 48);
                    const y2 = ((maxValue - currentPoint.relationshipValue) / range) * graphHeight;
                    
                    // Determine if this is a straight upward trending segment
                    const isUpward = currentPoint.relationshipValue > prevPoint.relationshipValue;
                    const isFlat = Math.abs(currentPoint.relationshipValue - prevPoint.relationshipValue) < 0.01;
                    
                    // Only render bold blue lines for straight upward segments
                    if (isUpward && !isFlat) {
                      return (
                        <Path
                          key={index}
                          d={`M ${x1} ${y1} L ${x2} ${y2}`}
                          stroke="#1d4ed8"
                          strokeWidth="7"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={0.8}
                        />
                      );
                    }
                    return null;
                  })}
                  
                  {/* Data points as SVG circles with touch interaction */}
                  {data.map((point, index) => {
                    const x = (index / (data.length - 1)) * (graphWidth - 48);
                    const y = ((maxValue - point.relationshipValue) / range) * graphHeight;
                    
                    const isHighest = highest.some(h => h.year === point.year);
                    const isLowest = lowest.some(l => l.year === point.year);
                    const isSelected = selectedYearPoint?.year === point.year;
                    const pointColor = isHighest ? '#22c55e' : isLowest ? '#ef4444' : getHarmonyLevelColor(point.relationshipValue);
                    const pointRadius = isSelected ? 6 : isHighest || isLowest ? 4 : 2.5;
                    
                    return (
                      <Circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={pointRadius}
                        fill={pointColor}
                        stroke={isHighest || isLowest || isSelected ? '#ffffff' : 'none'}
                        strokeWidth={isSelected ? 2 : isHighest || isLowest ? 1.5 : 0}
                        onPress={() => {
                          setSelectedYearPoint({
                            year: point.year,
                            x: x,
                            y: y
                          });
                        }}
                      />
                    );
                  })}
                </Svg>
                
                {/* Year labels positioned in empty areas with connecting lines */}
                {data.map((point, index) => {
                  const x = (index / (data.length - 1)) * (graphWidth - 48);
                  const y = ((maxValue - point.relationshipValue) / range) * graphHeight;
                  
                  const isHighest = highest.some(h => h.year === point.year);
                  const isLowest = lowest.some(l => l.year === point.year);
                  const isSelected = selectedYearPoint?.year === point.year;
                  
                  if (!(isHighest || isLowest || isSelected)) return null;
                  
                  const labelColor = isSelected ? '#6366f1' : isHighest ? '#22c55e' : '#ef4444';
                  const labelText = isSelected ? `${point.year} (${point.relationshipValue.toFixed(1)})` : point.year.toString();
                  
                  // Position labels at the very top or bottom edge of the graph frame
                  const isInUpperHalf = y < graphHeight / 2;
                  const labelX = Math.max(10, Math.min(x - 15, graphWidth - 78)); // Smaller label boxes
                  const labelY = isInUpperHalf ? -verticalPadding + 5 : graphHeight + 5; // Position at edges
                  
                  // Ensure label stays within bounds
                  const finalLabelY = labelY;
                  
                  return (
                    <React.Fragment key={`label-${index}`}>
                      {/* Connecting line from data point to label */}
                      <Svg 
                        width={graphWidth - 48} 
                        height={graphHeight} 
                        style={{ position: 'absolute', pointerEvents: 'none' }}
                      >
                        <Line
                          x1={x}
                          y1={y}
                          x2={labelX + 30}
                          y2={finalLabelY + 12}
                          stroke={labelColor}
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          opacity={0.7}
                        />
                      </Svg>
                      
                      {/* Label positioned at graph edge - smaller size */}
                      <View
                        className="absolute bg-white px-1 py-0.5 rounded border shadow-sm"
                        style={{
                          left: labelX,
                          top: finalLabelY,
                          borderColor: labelColor,
                          zIndex: isSelected ? 10 : 5
                        }}
                      >
                        <Text className="text-xs font-bold" style={{ color: labelColor, fontSize: 10 }}>
                          {labelText}
                        </Text>
                        {isSelected && (
                          <TouchableOpacity
                            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full items-center justify-center"
                            onPress={() => setSelectedYearPoint(null)}
                          >
                            <Text className="text-white font-bold" style={{ fontSize: 8 }}>×</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* X-axis labels */}
            <View className="ml-12 mt-2" style={{ width: graphWidth - 48, marginTop: verticalPadding }}>
              <View className="flex-row justify-between">
                {data.filter((_, index) => index % Math.max(1, Math.floor(data.length / 10)) === 0).map((point, index) => (
                  <Text key={index} className="text-xs text-gray-600 transform -rotate-45">
                    {point.year}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced Legend */}
        <View className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Text className="text-sm font-semibold mb-2 text-center">
            Legenda Tingkat Harmoni
          </Text>
          <View className="flex-row justify-center items-center flex-wrap mb-3">
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#22c55e" }} />
              <Text className="text-xs text-gray-700">Tinggi (≥7.5)</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#eab308" }} />
              <Text className="text-xs text-gray-700">Sedang (5-7.4)</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#ef4444" }} />
              <Text className="text-xs text-gray-700">Rendah (&lt;5)</Text>
            </View>
          </View>
          
          <View className="border-t border-gray-300 pt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Penanda Khusus
            </Text>
            <View className="flex-row justify-center items-center flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{ backgroundColor: "#22c55e" }} />
                <Text className="text-xs text-gray-700">🔥 Tahun Terbaik</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{ backgroundColor: "#ef4444" }} />
                <Text className="text-xs text-gray-700">⚠️ Tahun Menantang</Text>
              </View>
            </View>
          </View>
          
          <View className="border-t border-gray-300 pt-2 mt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Warna Garis Kurva
            </Text>
            <View className="flex-row justify-center items-center flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-4 h-1 mr-2" style={{ backgroundColor: "#dc2626" }} />
                <Text className="text-xs text-gray-700">🔴 Kurva Utama (Merah Tebal)</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-4 h-1 mr-2" style={{ backgroundColor: "#1d4ed8" }} />
                <Text className="text-xs text-gray-700">🔵 Segmen Naik (Biru Tebal)</Text>
              </View>
            </View>
          </View>
          
          <View className="border-t border-gray-300 pt-2 mt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Interaksi Grafik
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Sentuh titik tahun mana saja pada grafik untuk melihat detail tahun dan nilai hubungan. Garis akan otomatis lurus untuk nilai yang sama dan melengkung untuk transisi yang berbeda.
            </Text>
          </View>
          
          <Text className="text-xs text-gray-600 text-center mt-2">
            Grafik menunjukkan nilai hubungan silang (cross-relationship) berdasarkan rata-rata dari 18 kombinasi harmoni antara parameter statis satu person dengan parameter dinamis person lainnya setiap tahunnya. Kurva utama berwarna merah tebal, dengan segmen garis lurus yang naik ditampilkan dalam biru tebal. Label tahun ditempatkan di area kosong dengan garis penghubung putus-putus.
          </Text>
        </View>
      </View>
    );
  };

  const handleFindFix = async () => {
    // 1. Validasi Input Awal
    if (!calculatedResults) return; // Pastikan hasil awal sudah ada
    setIsFindingFix(true);
    setFixResults([]);

    // 2. Tentukan "Fixed Person" dan "Stable Person"
    const fixedPersonOriginal =
      personToFix === "person1"
        ? { name: name1, birthdate: birthdate1 }
        : { name: name2, birthdate: birthdate2 };
    const stablePersonData =
      personToFix === "person1"
        ? calculatedResults.person2
        : calculatedResults.person1;

    // 3. Siapkan Daftar Kata dari Database
    // Menggunakan selectedLanguages untuk memilih database bahasa/etnis yang tepat
    let wordList: string[] = [];

    // Coba setiap bahasa yang dipilih sampai menemukan database yang valid
    for (const langId of selectedLanguages) {
      const getLanguageKey = (langId: string) => {
        switch (langId) {
          case "id":
            return "id";
          case "en":
            return "en";
          case "ar":
          case "jp":
          case "cn":
            return "id"; // Gunakan database Indonesia untuk bahasa lain
          default:
            return "id";
        }
      };

      const selectedDbKey = getLanguageKey(
        langId,
      ) as keyof typeof languageDatabases;
      const dbSource = languageDatabases[selectedDbKey];

      if (dbSource) {
        // Gabungkan semua sub-database (Exp1, Exp2, dst.) dari sumber yang dipilih
        const currentWordList = Object.values(dbSource).flat();
        wordList = [...wordList, ...currentWordList];
      }
    }

    // Hapus duplikat
    wordList = [...new Set(wordList)];

    if (wordList.length === 0) {
      alert(
        `Database kata untuk bahasa yang dipilih tidak ditemukan atau kosong.`,
      );
      setIsFindingFix(false);
      return;
    }

    const results: {
      name: string;
      harmony: number;
      hara: number;
      coherence: string;
      grafologiIndex: string;
    }[] = [];

    // Logika untuk Metode 'addOneWord'
    if (fixMethod === "addOneWord") {
      for (const word of wordList) {
        const nameVariations = generateNameVariations(
          fixedPersonOriginal.name,
          [word],
        );
        for (const newName of nameVariations) {
          // Hitung parameter untuk nama baru
          const newFixedPersonData = {
            expression: calculateExpression(newName),
            time: calculateTime(fixedPersonOriginal.birthdate),
            heart: calculateHeart(newName),
            personality: calculatePersonality(newName),
            birth: calculateBirth(fixedPersonOriginal.birthdate),
            ultimate: calculateUltimate(
              calculateTime(fixedPersonOriginal.birthdate),
              calculateExpression(newName),
            ),
            habit: calculateHabit(newName),
            planOfExpression: calculatePlanOfExpression(
              newName,
              fixedPersonOriginal.birthdate,
            ),
            pointOfIntensification: calculatePointOfIntensification(newName),
          };

          // Hitung harmony baru
          const newHarmony = calculateHarmony(
            personToFix === "person1" ? newFixedPersonData : stablePersonData,
            personToFix === "person1" ? stablePersonData : newFixedPersonData,
          );

          if (newHarmony >= targetHarmony) {
            // 3. Jika Harmony terpenuhi, hitung metrik individu
            // Tanggal lahir dan gender untuk 'Fixed Person' harus diketahui
            const fixedPersonGender: "Male" | "Female" =
              personToFix === "person1" ? "Male" : "Female"; // Asumsi Person 1 Pria, Person 2 Wanita. Sesuaikan jika ada input gender.
            const individualMetrics = getPola(
              newName,
              fixedPersonOriginal.birthdate,
              fixedPersonGender,
            );

            // 4. Lakukan validasi semua filter
            let allFiltersMatch = true;

            // Filter Synchronize (Terkunci 100%)
            const syncValue =
              typeof individualMetrics.synchronize === "string"
                ? parseFloat(individualMetrics.synchronize.replace("%", ""))
                : individualMetrics.synchronize;
            if (syncValue < 100) {
              allFiltersMatch = false;
            }

            // Filter Hara
            if (allFiltersMatch && targetHara !== "all") {
              if (individualMetrics.hara !== parseInt(targetHara)) {
                allFiltersMatch = false;
              }
            } else if (allFiltersMatch && targetHara === "all") {
              if (![1, 2, 3, 4, 6].includes(individualMetrics.hara)) {
                allFiltersMatch = false;
              }
            }

            // Filter Coherence
            if (allFiltersMatch) {
              const coherenceValue =
                typeof individualMetrics.coherence === "string"
                  ? parseFloat(individualMetrics.coherence.replace("%", ""))
                  : individualMetrics.coherence;
              if (coherenceValue < targetCoherence) {
                allFiltersMatch = false;
              }
            }

            // Filter Momen Sukses
            if (allFiltersMatch) {
              let momenSuksesNum = 0;
              if (individualMetrics.momenSukses === "1+") {
                momenSuksesNum = 100;
              } else {
                const momenValue =
                  typeof individualMetrics.momenSukses === "string"
                    ? parseFloat(individualMetrics.momenSukses)
                    : individualMetrics.momenSukses;
                momenSuksesNum = momenValue * 100;
              }
              if (momenSuksesNum < targetMomenSukses) {
                allFiltersMatch = false;
              }
            }

            // Filter Grafologi Index (Terkunci 100%)
            if (allFiltersMatch) {
              if (individualMetrics.grafologiIndex !== "100%") {
                allFiltersMatch = false;
              }
            }

            // Filter Target Deskripsi (Opsional)
            if (allFiltersMatch && selectedTargetDescription !== null) {
              if (
                !individualMetrics.saranAngka?.includes(
                  selectedTargetDescription,
                )
              ) {
                allFiltersMatch = false;
              }
            }

            // 5. Jika semua filter terpenuhi, tambahkan ke hasil
            if (allFiltersMatch) {
              // Hindari duplikat
              if (!results.some((res) => res.name === newName)) {
                results.push({
                  name: newName,
                  harmony: newHarmony,
                  hara: individualMetrics.hara,
                  coherence: individualMetrics.coherence,
                  grafologiIndex: individualMetrics.grafologiIndex,
                });
              }
              if (results.length >= 20) break;
            }
          }
        }
        if (results.length >= 20) break;
      }
    }

    // Logika untuk Metode 'addTwoWords'
    if (fixMethod === "addTwoWord") {
      for (let i = 0; i < wordList.length; i++) {
        for (let j = i; j < wordList.length; j++) {
          // Loop kedua
          const nameVariations = generateNameVariations(
            fixedPersonOriginal.name,
            [wordList[i], wordList[j]],
          );
          for (const newName of nameVariations) {
            const newFixedPersonData = {
              expression: calculateExpression(newName),
              time: calculateTime(fixedPersonOriginal.birthdate),
              heart: calculateHeart(newName),
              personality: calculatePersonality(newName),
              birth: calculateBirth(fixedPersonOriginal.birthdate),
              ultimate: calculateUltimate(
                calculateTime(fixedPersonOriginal.birthdate),
                calculateExpression(newName),
              ),
              habit: calculateHabit(newName),
              planOfExpression: calculatePlanOfExpression(
                newName,
                fixedPersonOriginal.birthdate,
              ),
              pointOfIntensification: calculatePointOfIntensification(newName),
            };

            const newHarmony = calculateHarmony(
              personToFix === "person1" ? newFixedPersonData : stablePersonData,
              personToFix === "person1" ? stablePersonData : newFixedPersonData,
            );

            if (newHarmony >= targetHarmony) {
              // 3. Jika Harmony terpenuhi, hitung metrik individu
              // Tanggal lahir dan gender untuk 'Fixed Person' harus diketahui
              const fixedPersonGender: "Male" | "Female" =
                personToFix === "person1" ? "Male" : "Female"; // Asumsi Person 1 Pria, Person 2 Wanita. Sesuaikan jika ada input gender.
              const individualMetrics = getPola(
                newName,
                fixedPersonOriginal.birthdate,
                fixedPersonGender,
              );

              // 4. Lakukan validasi semua filter
              let allFiltersMatch = true;

              // Filter Synchronize (Terkunci 100%)
              const syncValue =
                typeof individualMetrics.synchronize === "string"
                  ? parseFloat(individualMetrics.synchronize.replace("%", ""))
                  : individualMetrics.synchronize;
              if (syncValue < 100) {
                allFiltersMatch = false;
              }

              // Filter Hara
              if (allFiltersMatch && targetHara !== "all") {
                if (individualMetrics.hara !== parseInt(targetHara)) {
                  allFiltersMatch = false;
                }
              } else if (allFiltersMatch && targetHara === "all") {
                if (![1, 2, 3, 4, 6].includes(individualMetrics.hara)) {
                  allFiltersMatch = false;
                }
              }

              // Filter Coherence
              if (allFiltersMatch) {
                const coherenceValue =
                  typeof individualMetrics.coherence === "string"
                    ? parseFloat(individualMetrics.coherence.replace("%", ""))
                    : individualMetrics.coherence;
                if (coherenceValue < targetCoherence) {
                  allFiltersMatch = false;
                }
              }

              // Filter Momen Sukses
              if (allFiltersMatch) {
                let momenSuksesNum = 0;
                if (individualMetrics.momenSukses === "1+") {
                  momenSuksesNum = 100;
                } else {
                  const momenValue =
                    typeof individualMetrics.momenSukses === "string"
                      ? parseFloat(individualMetrics.momenSukses)
                      : individualMetrics.momenSukses;
                  momenSuksesNum = momenValue * 100;
                }
                if (momenSuksesNum < targetMomenSukses) {
                  allFiltersMatch = false;
                }
              }

              // Filter Grafologi Index (Terkunci 100%)
              if (allFiltersMatch) {
                if (individualMetrics.grafologiIndex !== "100%") {
                  allFiltersMatch = false;
                }
              }

              // Filter Target Deskripsi (Opsional)
              if (allFiltersMatch && selectedTargetDescription !== null) {
                if (
                  !individualMetrics.saranAngka?.includes(
                    selectedTargetDescription,
                  )
                ) {
                  allFiltersMatch = false;
                }
              }

              // 5. Jika semua filter terpenuhi, tambahkan ke hasil
              if (allFiltersMatch) {
                // Hindari duplikat
                if (!results.some((res) => res.name === newName)) {
                  results.push({
                    name: newName,
                    harmony: newHarmony,
                    hara: individualMetrics.hara,
                    coherence: individualMetrics.coherence,
                    grafologiIndex: individualMetrics.grafologiIndex,
                  });
                }
                if (results.length >= 20) break;
              }
            }
          }
          if (results.length >= 20) break;
        }
        if (results.length >= 20) break;
      }
    }

    // 4. Perbarui State Hasil
    setFixResults(results.sort((a, b) => b.harmony - a.harmony)); // Urutkan dari harmony tertinggi
    setIsFindingFix(false);
  };

  const handleCheck = () => {
    if (name1.trim() && name2.trim()) {
      const compatibility = checkCompatibility(
        name1,
        birthdate1,
        name2,
        birthdate2,
      );
      setResults(compatibility);

      // Calculate expression, time, heart, personality for both persons
      const person1Expression = calculateExpression(name1);
      const person1Time = calculateTime(birthdate1);
      const person1Heart = calculateHeart(name1);
      const person1Personality = calculatePersonality(name1);
      const person1Birth = calculateBirth(birthdate1);
      const person1Ultimate = calculateUltimate(person1Time, person1Expression);
      const person1Name = calculateName(name1);
      const person1Habit = calculateHabit(name1);
      const person1PlanOfExpression = calculatePlanOfExpression(
        name1,
        birthdate1,
      );
      const person1PointOfIntensification =
        calculatePointOfIntensification(name1);

      const person2Expression = calculateExpression(name2);
      const person2Time = calculateTime(birthdate2);
      const person2Heart = calculateHeart(name2);
      const person2Personality = calculatePersonality(name2);
      const person2Birth = calculateBirth(birthdate2);
      const person2Ultimate = calculateUltimate(person2Time, person2Expression);
      const person2Name = calculateName(name2);
      const person2Habit = calculateHabit(name2);
      const person2PlanOfExpression = calculatePlanOfExpression(
        name2,
        birthdate2,
      );
      const person2PointOfIntensification =
        calculatePointOfIntensification(name2);

      // Calculate match based on Time values
      const matchData = getMatchData(person1Time, person2Time);

      // Calculate harmony value
      const person1Data = {
        expression: person1Expression,
        time: person1Time,
        heart: person1Heart,
        personality: person1Personality,
        birth: person1Birth,
        ultimate: person1Ultimate,
        name: person1Name,
        habit: person1Habit,
        planOfExpression: person1PlanOfExpression,
        pointOfIntensification: person1PointOfIntensification,
      };

      const person2Data = {
        expression: person2Expression,
        time: person2Time,
        heart: person2Heart,
        personality: person2Personality,
        birth: person2Birth,
        ultimate: person2Ultimate,
        name: person2Name,
        habit: person2Habit,
        planOfExpression: person2PlanOfExpression,
        pointOfIntensification: person2PointOfIntensification,
      };

      const harmonyValue = calculateHarmony(person1Data, person2Data);

      setCalculatedResults({
        person1: person1Data,
        person2: person2Data,
        match: matchData,
        harmony: harmonyValue,
      });

      // Generate life reports for both persons
      const report1 = generateLifeReport(name1, birthdate1, "Male");
      const report2 = generateLifeReport(name2, birthdate2, "Female");

      setLifeReports({
        person1: report1.report,
        person2: report2.report,
      });

      // Process data for table and charts
      const mergedReportData = report1.report
        .map((row1) => {
          const row2 = report2.report.find((r2) => r2.year === row1.year);
          return {
            year: row1.year,
            p1: row1,
            p2: row2 || {},
          };
        })
        .filter((data) => data.p2.year);

      // Calculate scores for each year and store in reportWithScores
      const reportWithScores = mergedReportData.map(data => {
        const yearlyScores = calculateYearlyRelationshipValue(data.year);
        return { 
          ...data, 
          p1_vs_p2_score: yearlyScores.p1_vs_p2, 
          p2_vs_p1_score: yearlyScores.p2_vs_p1, 
          py_ess_score_p1: yearlyScores.py_ess_score_p1, 
          py_ess_score_p2: yearlyScores.py_ess_score_p2 
        };
      });

      setProcessedReport(reportWithScores);

      // Prepare data for THREE graphs using the calculated scores
      const combinedData = reportWithScores.map(item => ({
        year: item.year,
        relationshipValue: calculateYearlyRelationshipValue(item.year).combined,
      }));
      
      const p1_vs_p2_data = reportWithScores.map(item => ({
        year: item.year,
        relationshipValue: calculateYearlyRelationshipValue(item.year).p1_vs_p2,
      }));
      
      const p2_vs_p1_data = reportWithScores.map(item => ({
        year: item.year,
        relationshipValue: calculateYearlyRelationshipValue(item.year).p2_vs_p1,
      }));
      
      console.log('Chart Data Debug:', {
        combinedLength: combinedData.length,
        p1_vs_p2_length: p1_vs_p2_data.length,
        p2_vs_p1_length: p2_vs_p1_data.length,
        sampleCombined: combinedData.slice(0, 3),
        sampleP1vsP2: p1_vs_p2_data.slice(0, 3),
        sampleP2vsP1: p2_vs_p1_data.slice(0, 3)
      });
      
      setChartData({
        combined: combinedData,
        p1_vs_p2: p1_vs_p2_data,
        p2_vs_p1: p2_vs_p1_data,
      });
    }
  };

  const renderCompatibilityMeter = (score: number) => {
    return (
      <View className="items-center my-4">
        <View className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={`h-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500"}`}
            style={{ width: `${score}%` }}
          />
        </View>
        <Text className="text-3xl font-bold mt-2">{score}%</Text>
      </View>
    );
  };

  const renderAreaScore = (name: string, score: number) => {
    return (
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-700 capitalize">{name}</Text>
        <View className="flex-row items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <View
              key={i}
              className={`w-3 h-3 rounded-full mx-0.5 ${i <= score ? "bg-purple-600" : "bg-gray-200"}`}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderDatePickerModal = (personNumber: 1 | 2) => {
    const isVisible = personNumber === 1 ? showDatePicker1 : showDatePicker2;
    const selectedDay = personNumber === 1 ? selectedDay1 : selectedDay2;
    const selectedMonth = personNumber === 1 ? selectedMonth1 : selectedMonth2;
    const selectedYear = personNumber === 1 ? selectedYear1 : selectedYear2;
    const setVisible =
      personNumber === 1 ? setShowDatePicker1 : setShowDatePicker2;
    const handleDateChange =
      personNumber === 1 ? handleDateChange1 : handleDateChange2;
    const setSelectedDay =
      personNumber === 1 ? setSelectedDay1 : setSelectedDay2;
    const setSelectedMonth =
      personNumber === 1 ? setSelectedMonth1 : setSelectedMonth2;
    const setSelectedYear =
      personNumber === 1 ? setSelectedYear1 : setSelectedYear2;

    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90%]">
            <Text className="text-lg font-bold text-center mb-4 text-purple-800">
              {t("select_birth_date")}
            </Text>

            {/* Year and Month Dropdowns */}
            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1 font-medium">
                  {t("year")}
                </Text>
                <View className="border border-gray-300 rounded-md bg-gray-50">
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => {
                      setSelectedYear(itemValue);
                      handleDateChange(selectedDay, selectedMonth, itemValue);
                    }}
                    style={{ height: 40 }}
                  >
                    {generateYears().map((year) => (
                      <Picker.Item
                        key={year}
                        label={year.toString()}
                        value={year}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View className="flex-1 ml-2">
                <Text className="text-gray-700 mb-1 font-medium">
                  {t("month")}
                </Text>
                <View className="border border-gray-300 rounded-md bg-gray-50">
                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => {
                      setSelectedMonth(itemValue);
                      handleDateChange(selectedDay, itemValue, selectedYear);
                    }}
                    style={{ height: 40 }}
                  >
                    {months.map((month) => (
                      <Picker.Item
                        key={month.value}
                        label={month.label}
                        value={month.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Calendar Grid */}
            <ScrollView className="mb-4" style={{ maxHeight: 300 }}>
              <Text className="text-center font-semibold mb-3 text-purple-700">
                {months.find((m) => m.value === selectedMonth)?.label}{" "}
                {selectedYear}
              </Text>

              {/* Days of Week Header */}
              <View className="flex-row mb-2">
                {[
                  t("sun") || "Sun",
                  t("mon") || "Mon",
                  t("tue") || "Tue",
                  t("wed") || "Wed",
                  t("thu") || "Thu",
                  t("fri") || "Fri",
                  t("sat") || "Sat",
                ].map((day) => (
                  <View key={day} className="flex-1 p-2 bg-purple-100">
                    <Text className="text-purple-800 text-center font-semibold text-xs">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days Grid */}
              <View className="border border-gray-300">
                {(() => {
                  const firstDayOfMonth = new Date(
                    selectedYear,
                    selectedMonth - 1,
                    1,
                  ).getDay();
                  const daysInMonth = new Date(
                    selectedYear,
                    selectedMonth,
                    0,
                  ).getDate();
                  const totalCells =
                    Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
                  const calendarGrid = [];

                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < firstDayOfMonth; i++) {
                    calendarGrid.push(null);
                  }

                  // Add days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    calendarGrid.push(day);
                  }

                  // Add empty cells to complete the grid
                  while (calendarGrid.length < totalCells) {
                    calendarGrid.push(null);
                  }

                  return Array.from(
                    { length: Math.ceil(calendarGrid.length / 7) },
                    (_, weekIndex) => (
                      <View key={weekIndex} className="flex-row">
                        {calendarGrid
                          .slice(weekIndex * 7, (weekIndex + 1) * 7)
                          .map((day, dayIndex) => (
                            <TouchableOpacity
                              key={`${weekIndex}-${dayIndex}`}
                              className={`flex-1 border border-gray-200 min-h-[40px] justify-center items-center ${
                                day ? "bg-white" : "bg-gray-50"
                              } ${
                                day === selectedDay
                                  ? "bg-purple-700 shadow-lg border-purple-800"
                                  : ""
                              }`}
                              disabled={!day}
                              onPress={() => {
                                if (day) {
                                  setSelectedDay(day);
                                  handleDateChange(
                                    day,
                                    selectedMonth,
                                    selectedYear,
                                  );
                                }
                              }}
                            >
                              {day && (
                                <Text
                                  className={`text-sm font-bold ${
                                    day === selectedDay
                                      ? "text-white shadow-sm"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {day}
                                </Text>
                              )}
                            </TouchableOpacity>
                          ))}
                      </View>
                    ),
                  );
                })()}
              </View>
            </ScrollView>

            {/* Selected Date Display */}
            <View className="mb-4 p-3 bg-purple-50 rounded-lg">
              <Text className="text-center text-purple-800 font-semibold">
                {t("selected_date") || "Selected Date"}: {selectedDay}/
                {selectedMonth}/{selectedYear}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 py-2 px-4 rounded-md flex-1 mr-2"
                onPress={() => setVisible(false)}
              >
                <Text className="text-gray-700 text-center font-medium">
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-purple-600 py-2 px-4 rounded-md flex-1 ml-2"
                onPress={() => setVisible(false)}
              >
                <Text className="text-white text-center font-medium">
                  {t("done")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView className="bg-white p-4 rounded-lg shadow-md">
      <Text className="text-2xl font-bold text-center mb-6 text-purple-800">
        {t("compatibility_checker")}
      </Text>

      <View className="mb-6 p-4 bg-purple-50 rounded-lg">
        <Text className="text-lg font-semibold mb-2 text-purple-800">
          {t("person_1")}
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">
            {t("full_name")}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white"
            placeholder={t("enter_full_name")}
            value={name1}
            onChangeText={handleNameChange1}
          />
          {normalizedName1 ? (
            <Text className="text-xs text-gray-500 mt-1">
              {t("normalized")}: {normalizedName1}
            </Text>
          ) : null}
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 mb-1 font-medium">
            {t("birth_date")}
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center"
            onPress={() => setShowDatePicker1(true)}
          >
            <Text className="text-gray-700">
              {selectedDay1}/{selectedMonth1}/{selectedYear1}
            </Text>
            <Text className="text-gray-400">📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-6 p-4 bg-blue-50 rounded-lg">
        <Text className="text-lg font-semibold mb-2 text-blue-800">
          {t("person_2")}
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">
            {t("full_name")}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 bg-white"
            placeholder={t("enter_full_name")}
            value={name2}
            onChangeText={handleNameChange2}
          />
          {normalizedName2 ? (
            <Text className="text-xs text-gray-500 mt-1">
              {t("normalized")}: {normalizedName2}
            </Text>
          ) : null}
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 mb-1 font-medium">
            {t("birth_date")}
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center"
            onPress={() => setShowDatePicker2(true)}
          >
            <Text className="text-gray-700">
              {selectedDay2}/{selectedMonth2}/{selectedYear2}
            </Text>
            <Text className="text-gray-400">📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="bg-purple-600 py-3 px-4 rounded-md items-center mb-6"
        onPress={handleCheck}
      >
        <Text className="text-white font-medium text-lg">
          {t("check_compatibility")}
        </Text>
      </TouchableOpacity>

      {calculatedResults && (
        <View className="p-4 bg-gray-50 rounded-lg mb-6">
          <Text className="text-xl font-bold text-center mb-4 text-purple-800">
            Analisis Numerologi
          </Text>

          {/* Parameters Table */}
          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row border-b border-gray-200 pb-2 mb-2">
              <Text className="flex-1 font-bold text-center">Parameter</Text>
              <Text className="flex-1 font-bold text-center text-purple-600">
                Person 1 (Pria)
              </Text>
              <Text className="flex-1 font-bold text-center text-blue-600">
                Person 2 (Wanita)
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">Expression</Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.expression}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.expression}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">Time</Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.time}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.time}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">
                Heart Desire
              </Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.heart}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.heart}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">
                Personality
              </Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.personality}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.personality}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">Birth</Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.birth}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.birth}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">Ultimate</Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.ultimate}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.ultimate}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">Habit</Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.habit}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.habit}
              </Text>
            </View>

            <View className="flex-row py-2 border-b border-gray-100">
              <Text className="flex-1 text-center font-medium">
                Plan of Expression
              </Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.planOfExpression}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.planOfExpression}
              </Text>
            </View>

            <View className="flex-row py-2">
              <Text className="flex-1 text-center font-medium">
                Point of Intensification
              </Text>
              <Text className="flex-1 text-center text-purple-600 font-bold">
                {calculatedResults.person1.pointOfIntensification}
              </Text>
              <Text className="flex-1 text-center text-blue-600 font-bold">
                {calculatedResults.person2.pointOfIntensification}
              </Text>
            </View>
          </View>

          {/* Match Parameter */}
          <View className="p-4 bg-gray-50 rounded-lg mb-6">
            <Text className="text-xl font-bold text-center mb-2 text-green-800">
              Match
            </Text>

            {renderCompatibilityMeter(calculatedResults.match.percentage)}

            <Text className="text-lg text-center mb-4 text-gray-700">
              Berdasarkan nilai Time Person 1 ({calculatedResults.person1.time})
              dan Person 2 ({calculatedResults.person2.time})
            </Text>

            <View className="bg-white p-4 rounded-lg">
              <Text className="text-gray-800 leading-6">
                {calculatedResults.match.explanation}
              </Text>
            </View>
          </View>

          {/* Harmony Parameter */}
          <View className="p-4 bg-gray-50 rounded-lg">
            <Text className="text-xl font-bold text-center mb-2 text-blue-800">
              Harmony
            </Text>

            {renderCompatibilityMeter(calculatedResults.harmony)}

            <Text className="text-lg text-center mb-4 text-gray-700">
              Berdasarkan vlookup 14 kombinasi parameter antara Person 1 dan
              Person 2
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">
                14 Kombinasi Harmony:
              </Text>

              {renderAreaScore(
                "Expression vs Expression",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.expression,
                    calculatedResults.person2.expression,
                  ),
                ),
              )}
              {renderAreaScore(
                "Expression vs Time",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.expression,
                    calculatedResults.person2.time,
                  ),
                ),
              )}
              {renderAreaScore(
                "Expression vs Heart",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.expression,
                    calculatedResults.person2.heart,
                  ),
                ),
              )}
              {renderAreaScore(
                "Time vs Time",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.time,
                    calculatedResults.person2.time,
                  ),
                ),
              )}
              {renderAreaScore(
                "Time vs Expression",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.time,
                    calculatedResults.person2.expression,
                  ),
                ),
              )}
              {renderAreaScore(
                "Time vs Heart",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.time,
                    calculatedResults.person2.heart,
                  ),
                ),
              )}
              {renderAreaScore(
                "Heart vs Time",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.heart,
                    calculatedResults.person2.time,
                  ),
                ),
              )}
              {renderAreaScore(
                "Heart vs Expression",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.heart,
                    calculatedResults.person2.expression,
                  ),
                ),
              )}
              {renderAreaScore(
                "Heart vs Heart",
                Math.round(
                  getHarmonyPercentage(
                    calculatedResults.person1.heart,
                    calculatedResults.person2.heart,
                  ),
                ),
              )}
              {renderAreaScore(
                "Birth vs Birth",
                Math.round(
                  getMinorHarmonyPercentage(
                    calculatedResults.person1.birth,
                    calculatedResults.person2.birth,
                  ) * 100,
                ),
              )}
              {renderAreaScore(
                "Ultimate vs Ultimate",
                Math.round(
                  getMinorHarmonyPercentage(
                    calculatedResults.person1.ultimate,
                    calculatedResults.person2.ultimate,
                  ) * 100,
                ),
              )}
              {renderAreaScore(
                "Habit vs Habit",
                Math.round(
                  getMinorHarmonyPercentage(
                    calculatedResults.person1.habit,
                    calculatedResults.person2.habit,
                  ) * 100,
                ),
              )}
              {renderAreaScore(
                "Plan of Expression vs Plan of Expression",
                Math.round(
                  getMinorHarmonyPercentage(
                    calculatedResults.person1.planOfExpression,
                    calculatedResults.person2.planOfExpression,
                  ) * 100,
                ),
              )}
              {renderAreaScore(
                "Point of Intensification vs Point of Intensification",
                Math.round(
                  getMinorHarmonyPercentage(
                    calculatedResults.person1.pointOfIntensification,
                    calculatedResults.person2.pointOfIntensification,
                  ) * 100,
                ),
              )}
            </View>
          </View>

          {/* Relationship Graph Preview */}
          {lifeReports && chartData.combined && chartData.combined.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-center mb-2 text-purple-800">
                📊 Preview: Grafik Hubungan Gabungan
              </Text>
              <Text className="text-sm text-center mb-4 text-gray-600">
                Lihat analisis lengkap 3 grafik di "Laporan 100 Tahun Berdampingan"
              </Text>
              {renderLineGraph(chartData.combined)}
            </View>
          )}
          
          {/* Debug Info */}
          {__DEV__ && chartData && (
            <View className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <Text className="text-sm font-bold mb-2">Debug Chart Data:</Text>
              <Text className="text-xs text-gray-600">
                Combined: {chartData.combined?.length || 0} points
              </Text>
              <Text className="text-xs text-gray-600">
                P1→P2: {chartData.p1_vs_p2?.length || 0} points
              </Text>
              <Text className="text-xs text-gray-600">
                P2→P1: {chartData.p2_vs_p1?.length || 0} points
              </Text>
            </View>
          )}

          {/* 100-Year Life Report Button */}
          <TouchableOpacity
            className="bg-green-600 py-3 px-4 rounded-md items-center mt-6"
            onPress={() => setShowLifeReportModal(true)}
          >
            <Text className="text-white font-medium text-lg">
              Lihat Laporan 100 Tahun Berdampingan
            </Text>
          </TouchableOpacity>

          {/* Combined Life Report Button */}
          <TouchableOpacity
            className="bg-blue-600 py-3 px-4 rounded-md items-center mt-3"
            onPress={generateCombinedReport}
          >
            <Text className="text-white font-medium text-lg">
              Lihat Laporan Kehidupan Bersama (100 Tahun)
            </Text>
          </TouchableOpacity>

          {/* Name Fix Generator Section */}
          <View className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <Text className="text-xl font-bold text-center mb-4 text-yellow-800">
              Perbaikan Nama (Fix Person)
            </Text>

            {/* Pilihan Orang yang Akan Diperbaiki */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Pilih Person untuk Diperbaiki:
              </Text>
              <View className="border border-gray-300 rounded-md">
                <Picker
                  selectedValue={personToFix}
                  onValueChange={(itemValue) => setPersonToFix(itemValue)}
                >
                  <Picker.Item label="Perbaiki Nama Person 1" value="person1" />
                  <Picker.Item label="Perbaiki Nama Person 2" value="person2" />
                </Picker>
              </View>
            </View>

            {/* Pilihan Metode Perbaikan */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Metode Perbaikan:
              </Text>
              <View className="border border-gray-300 rounded-md">
                <Picker
                  selectedValue={fixMethod}
                  onValueChange={(itemValue) => setFixMethod(itemValue)}
                >
                  <Picker.Item label="Tambah Satu Kata" value="addOneWord" />
                  <Picker.Item label="Tambah Dua Kata" value="addTwoWord" />
                </Picker>
              </View>
            </View>

            {/* Pilihan Sumber Database Kata */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-3 font-medium text-center">
                Sumber Database Kata
              </Text>
              <View className="flex-row flex-wrap justify-center">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    className={`m-1 px-3 py-2 rounded-full items-center justify-center flex-row ${selectedLanguages.includes(lang.id) ? "bg-yellow-600 border-2 border-yellow-700 shadow-lg" : "bg-white border-2 border-gray-300 shadow-md"}`}
                    onPress={() => toggleLanguage(lang.id)}
                    style={{
                      elevation: selectedLanguages.includes(lang.id) ? 6 : 3,
                      minWidth: 100,
                    }}
                  >
                    <Text style={{ fontSize: 16, marginRight: 4 }}>
                      {lang.flag}
                    </Text>
                    <Text
                      className={`font-medium text-xs ${selectedLanguages.includes(lang.id) ? "text-white" : "text-gray-700"}`}
                      numberOfLines={1}
                    >
                      {lang.countryName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-center text-xs text-gray-500 mt-2">
                Pilih satu atau lebih sumber database kata untuk perbaikan nama
              </Text>
            </View>

            {/* Input Target Harmony */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Target Nilai Harmony (minimal 70):
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-white"
                placeholder="70"
                keyboardType="numeric"
                value={String(targetHarmony)}
                onChangeText={(text) => setTargetHarmony(Number(text) || 70)}
              />
            </View>

            {/* Target Hara */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Target Hara
              </Text>
              <View className="border border-gray-300 rounded-md">
                <Picker
                  selectedValue={targetHara}
                  onValueChange={(itemValue) => setTargetHara(itemValue)}
                >
                  <Picker.Item
                    label="Semua Hara Positif (1,2,3,4,6)"
                    value="all"
                  />
                  <Picker.Item label="Target Hara: 1" value="1" />
                  <Picker.Item label="Target Hara: 2" value="2" />
                  <Picker.Item label="Target Hara: 3" value="3" />
                  <Picker.Item label="Target Hara: 4" value="4" />
                  <Picker.Item label="Target Hara: 6" value="6" />
                </Picker>
              </View>
            </View>

            {/* Target Coherence */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Target Coherence (Min %)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-white"
                placeholder="70"
                keyboardType="numeric"
                value={String(targetCoherence)}
                onChangeText={(text) => setTargetCoherence(Number(text) || 0)}
              />
            </View>

            {/* Target Momen Sukses */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Target Momen Sukses (Min %)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-white"
                placeholder="80"
                keyboardType="numeric"
                value={String(targetMomenSukses)}
                onChangeText={(text) => setTargetMomenSukses(Number(text) || 0)}
              />
            </View>

            {/* Target Deskripsi (Opsional) */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">
                Target Deskripsi (Opsional)
              </Text>
              <View className="border border-gray-300 rounded-md">
                <Picker
                  selectedValue={selectedTargetDescription}
                  onValueChange={(itemValue) =>
                    setSelectedTargetDescription(itemValue)
                  }
                >
                  <Picker.Item label="Tidak ada target spesifik" value={null} />
                  {AVAILABLE_ANGKA_VALUES.map((value) => (
                    <Picker.Item
                      key={value}
                      label={`${value} - ${getVlookupDescription(value, language).substring(0, 40)}...`}
                      value={value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Tampilan Target yang Terkunci */}
            <View className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Text className="text-blue-800 font-bold mb-1">
                Target Terkunci (Otomatis):
              </Text>
              <Text className="text-blue-700 text-sm">• Synchronize: 100%</Text>
              <Text className="text-blue-700 text-sm">• Grafologi: 100%</Text>
            </View>

            {/* Tombol Aksi */}
            <TouchableOpacity
              className="bg-yellow-600 py-3 px-4 rounded-md items-center"
              onPress={handleFindFix}
              disabled={isFindingFix}
            >
              <Text className="text-white font-medium text-lg">
                {isFindingFix ? "Mencari..." : "Cari Nama Perbaikan"}
              </Text>
            </TouchableOpacity>

            {/* Area Hasil */}
            {isFindingFix && (
              <ActivityIndicator
                size="large"
                color="#ca8a04"
                className="mt-4"
              />
            )}
            {!isFindingFix && fixResults.length > 0 && (
              <View className="mt-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    className="text-xl font-bold flex-1 text-center"
                    style={{
                      fontFamily: "serif",
                      color: "#CA8A04",
                      textShadowColor: "rgba(0,0,0,0.1)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    ✨ Hasil Perbaikan Nama ✨
                  </Text>
                  <TouchableOpacity
                    className="bg-blue-100 px-3 py-1 rounded-md ml-2"
                    onPress={() => setShowFixPersonFullScreen(true)}
                  >
                    <Text className="text-blue-700 text-xs font-medium">
                      Full Screen
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-100 px-3 py-1 rounded-md ml-2"
                    onPress={() => setFixResults([])}
                  >
                    <Text className="text-red-700 text-xs font-medium">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={{ maxHeight: 300 }}
                  className="bg-gradient-to-b from-yellow-50 to-white rounded-lg p-2"
                >
                  {fixResults.map((result, index) => (
                    <View
                      key={index}
                      className="py-3 px-3 mb-2 bg-white rounded-lg shadow-sm border-l-4 border-yellow-400"
                      style={{ elevation: 2 }}
                    >
                      <View className="flex-row items-start mb-2">
                        <View className="w-8 h-8 bg-yellow-600 rounded-full justify-center items-center mr-3">
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
                            color: "#92400E",
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
                            Har{"\n"}
                            {result.harmony.toFixed(0)}
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
                            {typeof result.coherence === "string"
                              ? result.coherence.replace("%", "") + "%"
                              : result.coherence + "%"}
                          </Text>
                        </View>
                        <View className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-1 justify-center items-center shadow-md">
                          <Text
                            className="text-white text-center font-bold"
                            style={{
                              fontFamily: "monospace",
                              fontSize: 10,
                              lineHeight: 11,
                            }}
                          >
                            G{"\n"}
                            {typeof result.grafologiIndex === "string"
                              ? result.grafologiIndex.replace("%", "") + "%"
                              : result.grafologiIndex + "%"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            {!isFindingFix && fixResults.length === 0 && (
              <Text className="text-center mt-4 text-gray-600">
                Belum ada hasil. Silakan mulai pencarian.
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Date Picker Modals */}
      {renderDatePickerModal(1)}
      {renderDatePickerModal(2)}

      {/* Match Explanation Modal */}
      <Modal
        visible={showMatchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMatchModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12 max-h-4/5">
            <Text className="text-xl font-bold text-center mb-4 text-green-600">
              Match Analysis - {calculatedResults?.match.percentage}%
            </Text>

            <ScrollView className="mb-4">
              <Text className="text-base leading-6 text-gray-800">
                {calculatedResults?.match.explanation}
              </Text>
            </ScrollView>

            <TouchableOpacity
              className="bg-green-500 py-3 px-6 rounded-lg"
              onPress={() => setShowMatchModal(false)}
            >
              <Text className="text-white text-center font-medium text-lg">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Combined Life Report Modal */}
      <Modal
        visible={showLifeReport}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLifeReport(false)}
      >
        <View className="flex-1 p-2 pt-10 bg-gray-100">
          <View className="flex-row justify-between items-center p-2 mb-2">
            <Text className="text-xl font-bold text-purple-800">
              Laporan 100 Tahun Bersama
            </Text>
            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={() => setShowLifeReport(false)}
            >
              <Text className="font-semibold">Tutup</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 p-3 bg-white rounded-lg">
            <Text className="text-lg font-semibold mb-2">
              {name1} & {name2}
            </Text>
            <Text className="text-gray-600">
              Perbandingan laporan kehidupan untuk tahun-tahun dimana kedua
              orang masih hidup
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header Tabel */}
              <View className="flex-row bg-purple-100 sticky top-0">
                <Text className="w-16 p-2 font-bold text-center border border-gray-300 text-purple-800">
                  Tahun
                </Text>
                <Text className="w-12 p-2 font-bold text-center border border-gray-300 bg-purple-200 text-purple-800">
                  Usia P1
                </Text>
                <Text className="w-16 p-2 font-bold text-center border border-gray-300 bg-purple-200 text-purple-800">
                  Essence P1
                </Text>
                <Text className="w-12 p-2 font-bold text-center border border-gray-300 bg-blue-200 text-blue-800">
                  Usia P2
                </Text>
                <Text className="w-16 p-2 font-bold text-center border border-gray-300 bg-blue-200 text-blue-800">
                  Essence P2
                </Text>
              </View>

              {/* Isi Tabel */}
              <ScrollView style={{ maxHeight: 600 }}>
                {combinedReport.map((row, index) => (
                  <View key={index} className="flex-row items-center">
                    <Text className="w-16 p-2 text-center border border-gray-300 bg-white">
                      {row.year}
                    </Text>
                    {/* Data Person 1 */}
                    <Text className="w-12 p-2 text-center border border-gray-300 bg-purple-50">
                      {row.person1.age}
                    </Text>
                    <Text
                      className={`w-16 p-2 text-center font-bold border border-gray-300 ${
                        row.person1.personalEssenceDiff0
                          ? "bg-yellow-200"
                          : "bg-purple-50"
                      }`}
                    >
                      {row.person1.essence}
                    </Text>
                    {/* Data Person 2 */}
                    <Text className="w-12 p-2 text-center border border-gray-300 bg-blue-50">
                      {row.person2.age}
                    </Text>
                    <Text
                      className={`w-16 p-2 text-center font-bold border border-gray-300 ${
                        row.person2.personalEssenceDiff0
                          ? "bg-yellow-200"
                          : "bg-blue-50"
                      }`}
                    >
                      {row.person2.essence}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View className="mt-4 p-3 bg-white rounded-lg">
            <Text className="text-sm font-semibold mb-2">Keterangan:</Text>
            <View className="flex-row items-center mb-1">
              <View className="w-4 h-4 bg-yellow-200 mr-2 border"></View>
              <Text className="text-xs">
                Kuning: Tahun Personal & Essence sama (periode harmoni)
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <View className="w-4 h-4 bg-purple-50 mr-2 border"></View>
              <Text className="text-xs">Ungu: Data Person 1</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 bg-blue-50 mr-2 border"></View>
              <Text className="text-xs">Biru: Data Person 2</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* 100-Year Life Report Modal */}
      <Modal
        visible={showLifeReportModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLifeReportModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-purple-800">
              Laporan 100 Tahun Berdampingan
            </Text>
            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={() => setShowLifeReportModal(false)}
            >
              <Text className="font-semibold">Close</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 p-3 bg-gray-50">
            <Text className="text-lg font-semibold mb-2">
              {name1} & {name2}
            </Text>
            <Text className="text-gray-600">
              Perbandingan data numerologi tahunan untuk kedua individu
            </Text>
          </View>

          {lifeReports && (
            <ScrollView className="flex-1 p-2">
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                  {/* Header Tabel */}
                  <View className="flex-row bg-purple-100 border-b border-gray-300">
                    <Text className="w-16 p-2 font-bold text-center border-r border-gray-300 text-purple-800">
                      Tahun
                    </Text>

                    {/* Kolom Person 1 */}
                    <View className="flex-1 bg-purple-200 border-r border-gray-300">
                      <Text className="p-2 font-bold text-center text-purple-700">
                        Person 1 (Pria)
                      </Text>
                      <View className="flex-row border-t border-gray-300">
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Cha
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Cyc
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Pin
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          PY
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold">
                          Ess
                        </Text>
                      </View>
                    </View>

                    {/* Kolom Person 2 */}
                    <View className="flex-1 bg-blue-200 border-r border-gray-300">
                      <Text className="p-2 font-bold text-center text-blue-700">
                        Person 2 (Wanita)
                      </Text>
                      <View className="flex-row border-t border-gray-300">
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Cha
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Cyc
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          Pin
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          PY
                        </Text>
                        <Text className="w-1/5 p-1 text-xs text-center font-semibold">
                          Ess
                        </Text>
                      </View>
                    </View>

                    {/* Kolom Skor */}
                    <View className="bg-green-200">
                      <Text className="p-2 font-bold text-center text-green-700">
                        Skor Hubungan
                      </Text>
                      <View className="flex-row border-t border-gray-300">
                        <Text className="w-20 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          P1→P2
                        </Text>
                        <Text className="w-20 p-1 text-xs text-center font-semibold border-r border-gray-300">
                          P2→P1
                        </Text>
                        <Text className="w-20 p-1 text-xs text-center font-semibold border-r border-gray-300 bg-cyan-200">
                          PY-Ess P1
                        </Text>
                        <Text className="w-20 p-1 text-xs text-center font-semibold bg-cyan-200">
                          PY-Ess P2
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Baris Data */}
                  <ScrollView style={{ maxHeight: 500 }}>
                    {processedReport.map((data, index) => {
                      // Calculate harmony colors for Person 1 cells
                      const p1CycleColor = calculatedResults ? getHarmonyColor(calculatedResults.person2, data.p1.cycle) : "bg-purple-50";
                      const p1PinnacleColor = calculatedResults ? getHarmonyColor(calculatedResults.person2, data.p1.pinnacle) : "bg-purple-50";
                      const p1EssenceColor = calculatedResults ? getHarmonyColor(calculatedResults.person2, data.p1.essence) : "bg-purple-50";
                      
                      // Calculate harmony colors for Person 2 cells
                      const p2CycleColor = calculatedResults ? getHarmonyColor(calculatedResults.person1, data.p2.cycle) : "bg-blue-50";
                      const p2PinnacleColor = calculatedResults ? getHarmonyColor(calculatedResults.person1, data.p2.pinnacle) : "bg-blue-50";
                      const p2EssenceColor = calculatedResults ? getHarmonyColor(calculatedResults.person1, data.p2.essence) : "bg-blue-50";

                      return (
                        <View
                          key={index}
                          className="flex-row border-b border-gray-200 items-center"
                        >
                          {/* Kolom Tahun */}
                          <Text className="w-16 p-2 text-center text-sm font-bold border-r border-gray-300">
                            {data.year}
                          </Text>

                          {/* Data Person 1 (Kiri) */}
                          <View className="flex-1 flex-row border-r border-gray-300">
                            <Text className="w-1/5 p-1 text-xs text-center border-r border-gray-300 bg-purple-50">
                              {data.p1.challenge || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center border-r border-gray-300 ${p1CycleColor}`}>
                              {data.p1.cycle || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center border-r border-gray-300 ${p1PinnacleColor}`}>
                              {data.p1.pinnacle || "-"}
                            </Text>
                            <Text className="w-1/5 p-1 text-xs text-center border-r border-gray-300 bg-purple-50">
                              {data.p1.personalYear || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center ${p1EssenceColor}`}>
                              {data.p1.essence || "-"}
                            </Text>
                          </View>

                          {/* Data Person 2 (Tengah) */}
                          <View className="flex-1 flex-row border-r border-gray-300">
                            <Text className="w-1/5 p-1 text-xs text-center border-r border-gray-300 bg-blue-50">
                              {data.p2.challenge || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center border-r border-gray-300 ${p2CycleColor}`}>
                              {data.p2.cycle || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center border-r border-gray-300 ${p2PinnacleColor}`}>
                              {data.p2.pinnacle || "-"}
                            </Text>
                            <Text className="w-1/5 p-1 text-xs text-center border-r border-gray-300 bg-blue-50">
                              {data.p2.personalYear || "-"}
                            </Text>
                            <Text className={`w-1/5 p-1 text-xs text-center ${p2EssenceColor}`}>
                              {data.p2.essence || "-"}
                            </Text>
                          </View>

                          {/* Data Skor (Kanan) */}
                          <View className="flex-row">
                            <Text className="w-20 p-1 text-xs text-center font-bold border-r border-gray-300 bg-green-50">
                              {data.p1_vs_p2_score?.toFixed(1) || "0.0"}
                            </Text>
                            <Text className="w-20 p-1 text-xs text-center font-bold border-r border-gray-300 bg-green-50">
                              {data.p2_vs_p1_score?.toFixed(1) || "0.0"}
                            </Text>
                            <Text className="w-20 p-1 text-xs text-center font-bold border-r border-gray-300 bg-cyan-50">
                              {data.py_ess_score_p1?.toFixed(2) || "0.00"}
                            </Text>
                            <Text className="w-20 p-1 text-xs text-center font-bold bg-cyan-50">
                              {data.py_ess_score_p2?.toFixed(2) || "0.00"}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </ScrollView>

              <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text className="text-sm font-semibold mb-2">
                  Keterangan Kolom:
                </Text>
                <Text className="text-xs text-gray-600 mb-1">
                  • Cha: Challenge (Tantangan)
                </Text>
                <Text className="text-xs text-gray-600 mb-1">
                  • Cyc: Cycle (Siklus) - Berwarna berdasarkan harmoni
                </Text>
                <Text className="text-xs text-gray-600 mb-1">
                  • Pin: Pinnacle (Puncak) - Berwarna berdasarkan harmoni
                </Text>
                <Text className="text-xs text-gray-600 mb-1">
                  • PY: Personal Year (Tahun Personal)
                </Text>
                <Text className="text-xs text-gray-600 mb-1">
                  • Ess: Essence (Esensi) - Berwarna berdasarkan harmoni
                </Text>
                <Text className="text-xs text-gray-600 mb-2">
                  • P1→P2: Skor hubungan Person 1 ke Person 2
                </Text>
                <Text className="text-xs text-gray-600 mb-2">
                  • P2→P1: Skor hubungan Person 2 ke Person 1
                </Text>
                <Text className="text-xs text-gray-600 mb-2">
                  • PY-Ess P1: Skor PY-Essence internal Person 1
                </Text>
                <Text className="text-xs text-gray-600 mb-2">
                  • PY-Ess P2: Skor PY-Essence internal Person 2
                </Text>
                
                <Text className="text-sm font-semibold mb-2">
                  Legend Warna Harmoni:
                </Text>
                <View className="flex-row items-center mb-1">
                  <View className="w-4 h-4 bg-red-200 mr-2 border"></View>
                  <Text className="text-xs text-gray-600">
                    Merah: Harmoni rendah (≤5) - Periode menantang
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <View className="w-4 h-4 bg-green-200 mr-2 border"></View>
                  <Text className="text-xs text-gray-600">
                    Hijau Muda: Harmoni sedang (5-7.5) - Periode netral
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-green-400 mr-2 border"></View>
                  <Text className="text-xs text-gray-600">
                    Hijau Tua: Harmoni tinggi (>7.5) - Periode harmonis
                  </Text>
                </View>
              </View>

              {/* Three Separate Graphs */}
              <View className="mt-6 mb-6">
                <Text className="text-xl font-bold text-center mb-4 text-purple-800">
                  📊 Analisis Grafik Hubungan (3 Layer)
                </Text>
                
                {/* Graph 1: Combined */}
                <View className="mb-8">
                  <Text className="text-lg font-bold text-center mb-2 text-green-700">
                    🔥 Grafik Nilai Hubungan Gabungan (100 Tahun)
                  </Text>
                  <Text className="text-sm text-center mb-4 text-gray-600">
                    Kombinasi total skor P1→P2 + P2→P1
                  </Text>
                  {chartData.combined && chartData.combined.length > 0 ? (
                    renderLineGraph(chartData.combined)
                  ) : (
                    <View className="bg-gray-100 p-4 rounded-lg">
                      <Text className="text-center text-gray-500">Data grafik gabungan tidak tersedia</Text>
                    </View>
                  )}
                </View>

                {/* Graph 2: P1 vs P2 */}
                <View className="mb-8">
                  <Text className="text-lg font-bold text-center mb-2 text-purple-700">
                    👨 Grafik Hubungan Person 1 → Person 2
                  </Text>
                  <Text className="text-sm text-center mb-4 text-gray-600">
                    Pengaruh parameter statis P1 terhadap parameter dinamis P2
                  </Text>
                  {chartData.p1_vs_p2 && chartData.p1_vs_p2.length > 0 ? (
                    renderLineGraph(chartData.p1_vs_p2)
                  ) : (
                    <View className="bg-gray-100 p-4 rounded-lg">
                      <Text className="text-center text-gray-500">Data grafik P1→P2 tidak tersedia</Text>
                    </View>
                  )}
                </View>

                {/* Graph 3: P2 vs P1 */}
                <View className="mb-8">
                  <Text className="text-lg font-bold text-center mb-2 text-blue-700">
                    👩 Grafik Hubungan Person 2 → Person 1
                  </Text>
                  <Text className="text-sm text-center mb-4 text-gray-600">
                    Pengaruh parameter statis P2 terhadap parameter dinamis P1
                  </Text>
                  {chartData.p2_vs_p1 && chartData.p2_vs_p1.length > 0 ? (
                    renderLineGraph(chartData.p2_vs_p1)
                  ) : (
                    <View className="bg-gray-100 p-4 rounded-lg">
                      <Text className="text-center text-gray-500">Data grafik P2→P1 tidak tersedia</Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Fix Person Full Screen Modal */}
      <Modal
        visible={showFixPersonFullScreen}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowFixPersonFullScreen(false)}
      >
        <View className="flex-1 bg-white">
          {selectedNameForAnalysis ? (
            <View className="flex-1">
              <View className="flex-row items-center justify-between p-4 bg-yellow-600">
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={handleBackToFixResults}
                >
                  <Text className="text-yellow-600 font-medium">
                    ← Back to List
                  </Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold flex-1 text-center">
                  Name Analysis
                </Text>
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={() => setShowFixPersonFullScreen(false)}
                >
                  <Text className="text-yellow-600 font-medium">Close</Text>
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
              <View className="flex-row items-center justify-between p-4 bg-yellow-600">
                <TouchableOpacity
                  className="bg-white px-4 py-2 rounded-md"
                  onPress={() => setShowFixPersonFullScreen(false)}
                >
                  <Text className="text-yellow-600 font-medium">← Back</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold flex-1 text-center">
                  ✨ Hasil Perbaikan Nama ✨
                </Text>
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded-md"
                  onPress={() => {
                    setFixResults([]);
                    setShowFixPersonFullScreen(false);
                  }}
                >
                  <Text className="text-white font-medium">Clear All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView className="flex-1 p-4">
                <Text className="text-center text-gray-600 mb-4">
                  Tap any name to see detailed analysis
                </Text>
                {fixResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    className="py-4 px-4 mb-3 bg-white rounded-lg shadow-md border-l-4 border-yellow-400"
                    style={{ elevation: 3 }}
                    onPress={() => handleFixPersonNameClick(result.name)}
                  >
                    <View className="flex-row items-start mb-3">
                      <View className="w-10 h-10 bg-yellow-600 rounded-full justify-center items-center mr-4">
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
                          color: "#92400E",
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
                          Harmony{"\n"}
                          {result.harmony.toFixed(0)}
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
                          {typeof result.coherence === "string"
                            ? result.coherence.replace("%", "") + "%"
                            : result.coherence + "%"}
                        </Text>
                      </View>
                      <View className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-2 justify-center items-center shadow-md">
                        <Text
                          className="text-white text-center font-bold"
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 13,
                          }}
                        >
                          Grafologi{"\n"}
                          {typeof result.grafologiIndex === "string"
                            ? result.grafologiIndex.replace("%", "") + "%"
                            : result.grafologiIndex + "%"}
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
}
