import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { getPola, calculateGrafologiIndex } from "../utils/numerologyUtils";
import { useTranslation } from "./MainApp";

interface NumerologyResultsProps {
  name: string;
  birthdate: Date;
  gender: "Male" | "Female";
  isPremium?: boolean;
}

export default function NumerologyResults({
  name = "",
  birthdate = new Date(),
  gender = "Male",
  isPremium = true,
}: NumerologyResultsProps) {
  const { t, language } = useTranslation();
  const patterns = getPola(name, birthdate, gender);
  const grafologiResult = calculateGrafologiIndex(name);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);

  // Vlookup table for G1-G9 descriptions
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
    2: {
      id: "😩 Rencanakan, ciptakan dan rawat lingkungan sistem keluarga/karir, bisnis atau keuangan, hindari kehidupan (bisnis) tidak tertata/kacau, binasa tidak wajar. Bina dengan sepenuh hati apa yang sudah didapat, tekun dan disiplinlah..kendalikan keinginan dan ego ke arah positif",
      en: "😩 Plan, create and maintain a family/career, business or financial system environment, avoid disorganized/chaotic life (business), perishing unnaturally. Build with all your heart what you have obtained, be persistent and disciplined... control your desires and ego in a positive direction",
      fr: "😩 Planifier, créer et entretenir un environnement familial/carrière, commercial ou financier, éviter une vie désorganisée/chaotique (entreprise), périr anormalement. Construisez de tout votre cœur ce que vous avez obtenu, soyez persévérant et discipliné... contrôlez vos désirs et votre égo dans le sens positif",
      es: "😩 Planificar, crear y mantener un entorno familiar/profesional, empresarial o de sistema financiero, evitar una vida (negocios) desorganizada/caótica, que perezca de forma antinatural. Construye con todo tu corazón lo que has obtenido, sé persistente y disciplinado... controla tus deseos y tu ego en dirección positiva.",
      ar: "😩 تخطيط وإنشاء والحفاظ على بيئة عائلية/وظيفية أو تجارية أو مالية، وتجنب الحياة غير المنظمة/الفوضوية (الأعمال)، والهلاك بشكل غير طبيعي. ابنِ بكل قلبك ما حصلت عليه، كن مثابراً ومنضبطاً.. سيطر على رغباتك وغرورك في الاتجاه الإيجابي",
      zh: "😩 规划、创造并维持家庭/事业、事业或财务系统环境，避免生命（事业）无组织/混乱，非自然灭亡。全心全意地建立你所获得的东西，坚持不懈并自律......控制你的欲望和自我朝积极的方向发展",
      hi: "😩 परिवार/कैरियर, व्यवसाय या वित्तीय प्रणाली के माहौल की योजना बनाएं, बनाएं और बनाए रखें, अव्यवस्थित/अराजक जीवन (व्यवसाय), अप्राकृतिक रूप से नष्ट होने से बचें। आपने जो हासिल किया है उसे पूरे दिल से बनाएं, दृढ़ रहें और अनुशासित रहें... अपनी इच्छाओं और अहंकार को सकारात्मक दिशा में नियंत्रित करें",
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
      ar: "👮 كن حازماً، حازماً في التأثير، حافظاً على الحكمة في السلطة",
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
    8: {
      id: "⚖️ Upayakan bersikap adil keadilan, suka berbuat dan diperlakukan adil",
      en: "⚖️ Strive to be fair and just, like to act and be treated fairly",
      fr: "⚖️ S'efforcer d'être juste et juste, aimer agir et être traité équitablement",
      es: "⚖️ Esfuércese por ser justo y equitativo, le guste actuar y ser tratado de manera justa",
      ar: "⚖️ احرص على أن تكون منصفًا وعادلاً، وأحب التصرف والمعاملة العادلة",
      zh: "⚖️力求公平公正，喜欢行事并受到公平对待",
      hi: "⚖️ निष्पक्ष और निष्पक्ष रहने का प्रयास करें, कार्य करना और उचित व्यवहार करना पसंद करें",
    },
    9: {
      id: "😭 Hindari sikap kesedihan berkepanjangan, rasa kehilangan dalam hidup, sedih tak berujung, kekurangsempurnaan. Sadari segala sesuatunya tidak sempurna, itu yang membuat unik dan bersyukurlah atas nikmat yang masih diberi tuhan dan jadilah seseorang yang teguh jiwa",
      en: "😭 Avoid prolonged sadness, a sense of loss in life, endless sadness, lack of perfection. Realize that everything is not perfect, that is what makes it unique and be grateful for the blessings that God still gives you and be someone who is strong in spirit",
      fr: "😭 Évitez la tristesse prolongée, le sentiment de perte de la vie, la tristesse sans fin, le manque de perfection. Réalisez que tout n'est pas parfait, c'est ce qui le rend unique et soyez reconnaissant pour les bénédictions que Dieu vous donne encore et soyez quelqu'un de fort en esprit.",
      es: "😭Evita la tristeza prolongada, la sensación de pérdida en la vida, la tristeza sin fin, la falta de perfección. Date cuenta que no todo es perfecto, eso es lo que lo hace único y agradece las bendiciones que Dios aún te da y sé alguien fuerte de espíritu.",
      ar: "😭تجنب الحزن الطويل، الشعور بالخسارة في الحياة، الحزن الذي لا ينتهي، عدم الكمال. أدرك أن كل شيء ليس مثاليًا، وهذا ما يجعله فريدًا وكن ممتنًا للنعم التي ما زال الله يمنحك إياها وكن شخصًا قويًا في الروح.",
      zh: "😭 避免长时间的悲伤、对生活的失落感、无尽的悲伤、不完美。认识到一切都不是完美的，这就是它的独特之处，并感谢上帝仍然给予你的祝福，成为一个精神坚强的人",
      hi: "😭 लंबे समय तक उदासी, जीवन में हानि की भावना, अंतहीन उदासी, पूर्णता की कमी से बचें। यह महसूस करें कि हर चीज़ सही नहीं है, यही चीज़ इसे अद्वितीय बनाती है और उन आशीर्वादों के लिए आभारी रहें जो भगवान अभी भी आपको देते हैं और ऐसे व्यक्ति बनें जो आत्मा में मजबूत हैं",
    },
    10: {
      id: "🙃 Berlatih tekun dan beribadah/puasa agar berhasil baik, pintar dan beruntung",
      en: "🙃 Practice diligently and worship/fast to be successful, smart and lucky",
      fr: "🙃 Pratiquez avec diligence et adorez/jeûnez pour réussir, être intelligent et chanceux",
      es: "🙃 Practica diligentemente y adora/ayuna para tener éxito, ser inteligente y tener suerte.",
      ar: "🙃 تدرب باجتهاد وعبادة/سريعًا لتكون ناجحًا وذكيًا ومحظوظًا",
      zh: "🙃 勤奋修行，膜拜/斋戒，获得成功、聪明和幸运",
      hi: "🙃 सफल, चतुर और भाग्यशाली बनने के लिए लगन से अभ्यास करें और पूजा/उपवास करें",
    },
    11: {
      id: "😵 Selalu upayakan langkah antisipatif terhadap cacat/keributan hukum dan tabiat lupa kewajiban, sakit dan pengharapan. Kerjakan apa yang seharusnya dikerjakan, jangan menunda. Perhatikan setiap langkah dan setiap keputusan, jangan merugikan orang lain",
      en: "😵 Always try to take anticipatory steps against legal defects/commotion and the habit of forgetting obligations, pain and hopes. Do what you have to do, don't delay. Pay attention to every step and every decision, don't harm other people",
      fr: "😵 Essayez toujours de prendre des mesures anticipatives contre les vices/agitations juridiques et l'habitude d'oublier les obligations, la douleur et les espoirs. Faites ce que vous avez à faire, ne tardez pas. Faites attention à chaque étape et à chaque décision, ne faites pas de mal aux autres",
      es: "😵 Procura siempre tomar medidas preventivas contra los defectos/conmociones legales y la costumbre de olvidar obligaciones, dolores y esperanzas. Haz lo que tengas que hacer, no te demores. Presta atención a cada paso y a cada decisión, no dañes a otras personas.",
      ar: "😵 حاول دائمًا اتخاذ خطوات استباقية ضد العيوب/الاضطراب القانوني وعادة نسيان الالتزامات والألم والآمال. افعل ما عليك فعله، لا تتأخر. انتبه لكل خطوة وكل قرار، ولا تؤذي الآخرين",
      zh: "😵 始终尝试采取预期措施来应对法律缺陷/骚乱以及忘记义务、痛苦和希望的习惯。做你该做的事，不要拖延。注意每一步、每一个决定，不要伤害他人",
      hi: "😵 कानूनी दोषों/हंगामाओं तथा दायित्वों, कष्टों एवं आशाओं को भूलने की आदत के विरुद्ध सदैव अग्रिम कदम उठाने का प्रयास करें। तुम्हें जो करना है करो, देर मत करो। हर कदम और हर फैसले पर ध्यान दें, दूसरे लोगों को नुकसान न पहुंचाएं",
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
    13: {
      id: "🤬 Perbaiki sikap berperilaku ekstrim, durjana dan kurang taat (kurang suka tata cara dan sistem). Bijaklah menghadapi perbedaan yang ada, hindari berdebat, tetap bersabar dan kendalikan ego pribadi",
      en: "🤬 Correct extreme, evil and disobedient behavior (don't like procedures and systems). Be wise in dealing with existing differences, avoid arguing, remain patient and control your personal ego",
      fr: "🤬 Corriger les comportements extrêmes, méchants et désobéissants (n'aime pas les procédures et les systèmes). Soyez sage dans la gestion des différences existantes, évitez de vous disputer, restez patient et contrôlez votre ego personnel.",
      es: "🤬 Corregir conductas extremas, malvadas y desobedientes (no me gustan los procedimientos y sistemas). Sea prudente al abordar las diferencias existentes, evite discutir, sea paciente y controle su ego personal.",
      ar: "🤬 تصحيح السلوك المتطرف والشرير والعاصي (لا أحب الإجراءات والأنظمة). كن حكيماً في التعامل مع الخلافات القائمة، وتجنب الجدال، واصبر وتحكم في غرورك الشخصي",
      zh: "🤬 纠正极端、邪恶、不听话的行为（不喜欢程序和制度）。明智地处理现有的分歧，避免争论，保持耐心并控制你的个人自我",
      hi: "🤬 अतिवादी, दुष्ट और अवज्ञाकारी व्यवहार (प्रक्रियाओं और प्रणालियों को पसंद न करना) को सुधारें। मौजूदा मतभेदों से निपटने में समझदारी बरतें, बहस करने से बचें, धैर्य रखें और अपने व्यक्तिगत अहंकार पर नियंत्रण रखें",
    },
    14: {
      id: "😌 Bersifat tulus, mau berkorban (atau menjadi korban) dalam hubungan karir, situasi, lingkungan, keuangan. Pertimbangkan apa yang bisa diberi, bijaksanalah! Diri pribadi dan keluarga juga diperhatikan",
      en: "😌 Be sincere, willing to make sacrifices (or be a victim) in career relationships, situations, environment, finances. Consider what you can give, be wise! Individuals and families are also considered",
      fr: "😌 Soyez sincère, prêt à faire des sacrifices (ou à être victime) dans les relations professionnelles, les situations, l'environnement, les finances. Réfléchissez à ce que vous pouvez donner, soyez sage ! Les individus et les familles sont également considérés",
      es: "😌 Sé sincero, dispuesto a hacer sacrificios (o ser víctima) en las relaciones profesionales, situaciones, entorno, finanzas. Considera lo que puedes dar, ¡sé sabio! También se consideran individuos y familias.",
      ar: "😌 كن صادقًا ومستعدًا لتقديم التضحيات (أو أن تكون ضحية) في العلاقات المهنية والمواقف والبيئة والشؤون المالية. فكر فيما يمكنك تقديمه، كن حكيما! يتم أيضًا أخذ الأفراد والعائلات بعين الاعتبار",
      zh: "😌 真诚，愿意在职业关系、处境、环境、财务方面做出牺牲（或成为受害者）。考虑一下你能给予什么，明智一点！个人和家庭也被考虑在内",
      hi: "😌 ईमानदार रहें, करियर संबंधों, स्थितियों, पर्यावरण, वित्त में बलिदान देने (या पीड़ित होने) के लिए तैयार रहें। विचार करें कि आप क्या दे सकते हैं, बुद्धिमान बनें! व्यक्तियों और परिवारों पर भी विचार किया जाता है",
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
    17: {
      id: "🤕 Periksa segala hal yang menimbulkan kurang menyenangkan dalam perjalanan, mungkin pelupa, sedikit lalai atau suka lupa. Mulailah melakukan sesuatu secara rutin dan letakkan sesuatu pada tempatnya. Perhatikan situasi ketika dalam perjalanan",
      en: "🤕 Check everything that makes your trip less enjoyable, maybe you are forgetful, a little inattentive or forgetful. Start doing things regularly and put things in their place. Pay attention to the situation while traveling",
      fr: "🤕 Cochez tout ce qui rend votre voyage moins agréable, peut-être êtes-vous oublieux, un peu inattentif ou oublieux. Commencez à faire les choses régulièrement et remettez les choses à leur place. Soyez attentif à la situation lorsque vous voyagez",
      es: "🤕 Revisa todo lo que hace que tu viaje sea menos placentero, quizás eres olvidadizo, un poco desatento u olvidadizo. Empiece a hacer las cosas con regularidad y póngalas en su lugar. Presta atención a la situación mientras viajas.",
      ar: "🤕 تحقق من كل ما يجعل رحلتك أقل متعة، ربما تكون كثير النسيان، قليل الانتباه أو كثير النسيان. ابدأ بفعل الأشياء بانتظام، ثم ضع الأشياء في مكانها الصحيح. انتبه إلى الموقف أثناء السفر",
      zh: "🤕 检查一切让你的旅行变得不那么愉快的事情，也许你是健忘的，有点不专心或者健忘的。开始有规律地做事，把事情放回原位。出行时注意情况",
      hi: "🤕 हर उस चीज की जांच करें जो आपकी यात्रा को कम आनंददायक बनाती है, हो सकता है कि आप भुलक्कड़ हों, थोड़े असावधान हों या भुलक्कड़ हों। चीजों को नियमित रूप से करना शुरू करें और चीजों को उनकी जगह पर रखें। यात्रा करते समय स्थिति पर ध्यान दें",
    },
    18: {
      id: "😫 Berhati-hati dalam bertindak jangan sampai menimbulkan kekejaman, bersifat kejam dan tega. Hindari lingkungan yang kurang bersahabat, tanamkan kasih sayang dalam diri",
      en: "😫 Be careful in your actions so as not to cause cruelty, be cruel and have heart. Avoid hostile environments, cultivate compassion within yourself",
      fr: "😫 Soyez prudent dans vos actes afin de ne pas provoquer de cruauté, soyez cruel et ayez du cœur. Évitez les environnements hostiles, cultivez la compassion en vous",
      es: "😫 Ten cuidado en tus acciones para no causar crueldad, sé cruel y ten corazón. Evita los ambientes hostiles, cultiva la compasión dentro de ti mismo.",
      ar: "😫 كن حذرا في تصرفاتك حتى لا تسبب القسوة، كن قاسيا وقلبك. تجنب البيئات المعادية، وازرع الرحمة داخل نفسك",
      zh: "😫 行动要小心，以免造成残忍，残忍并有良心。避免敌对的环境，培养内心的同情心",
      hi: "😫 अपने कार्यों में सावधान रहें ताकि क्रूरता न हो, क्रूर बनें और दिलदार बनें। शत्रुतापूर्ण वातावरण से बचें, अपने भीतर करुणा पैदा करें",
    },
    19: {
      id: "🤪 Selalu mengambil keputusan terbaik, rencana yang matang jangan ceroboh bertindak bodoh dan ketololan sendiri atau pihak lain, hingga ikut terkena akibatnya. Kendalikan tingkah laku dan emosi, jangan mudah terbawa suasana, ambil waktu berpikir jernih",
      en: "🤪 Always make the best decisions, plan carefully, don't be careless, act stupidly and foolishly yourself or others, until you suffer the consequences. Control your behavior and emotions, don't get carried away easily, take time to think clearly",
      fr: "🤪 Toujours prenez les meilleures décisions, planifiez soigneusement, ne soyez pas négligent, agissez de manière stupide et insensée vous-même ou les autres, jusqu'à ce que vous en subissiez les conséquences. Contrôlez votre comportement et vos émotions, ne vous laissez pas emporter facilement, prenez le temps de réfléchir clairement",
      es: "🤪 Siempre toma las mejores decisiones, planifica cuidadosamente, no seas descuidado, actúa estúpidamente y tontamente contigo mismo o con los demás, hasta que sufras las consecuencias. Controla tu comportamiento y emociones, no te dejes llevar fácilmente, tómate el tiempo para pensar con claridad",
      ar: "🤪 اتخذ دائمًا أفضل القرارات، وخطط جيدًا، ولا تتهور، وتتصرف بغباء وغباوة مع نفسك أو مع الآخرين، حتى تتحمل العواقب. تحكم في سلوكك وعواطفك، ولا تنجرف بسهولة، وخصص وقتًا للتفكير بوضوح",
      zh: "🤪 永远做出最好的决定，好好计划，不要粗心大意，做出自己或他人愚蠢的举动，直到你承担后果。控制自己的行为和情绪，不要轻易得意忘形，花时间清晰地思考",
      hi: "🤪हमेशा सर्वोत्तम निर्णय लें, अच्छी योजना बनाएं, लापरवाह न हों, स्वयं या अन्य पक्षों के लिए मूर्खतापूर्ण और मूर्खतापूर्ण कार्य न करें, जब तक कि आप परिणाम न भुगतें। अपने व्यवहार और भावनाओं पर नियंत्रण रखें, आसानी से बहकावे में न आएं, स्पष्ट रूप से सोचने के लिए समय निकालें",
    },
    20: {
      id: "😤 Kurangi perilaku bertabiat bengis, ketus atau diam, galak judes, hasrat menang (match one on one). Berkasih sayang lebih menenteramkan, tumbuhkan rasa peduli dan persahabatan meski pada lawan sekalipun. Meski dalam kadar yang sedikit",
      en: "😤 Reduce behavior that has a violent character, being curt or silent, being aggressively bitchy, wanting to win (match one on one). Affection is more reassuring, fosters a sense of caring and friendship even towards opponents. Even if it's in a small amount",
      fr: "😤 Réduire les comportements qui ont un caractère violent, être brusque ou silencieux, être agressif, vouloir gagner (match en tête-à-tête). L'affection est plus rassurante, favorise un sentiment d'attention et d'amitié même envers les adversaires. Même si c'est en petite quantité",
      es: "😤 Reducir conductas que tengan carácter violento, ser brusco o silencioso, ser agresivamente malicioso, querer ganar (partir uno a uno). El afecto es más tranquilizador, fomenta un sentido de cariño y amistad incluso hacia los oponentes. Aunque sea en poca cantidad",
      ar: "😤 قلل من السلوكيات التي تتسم بطابع عنيف، مثل الفظاظة أو الصمت، والتصرفات العدوانية، والرغبة في الفوز (مباراة واحدة لواحدة). المودة أكثر طمأنينة، وتعزز الشعور بالاهتمام والصداقة حتى تجاه المعارضين. حتى لو كان بكمية صغيرة",
      zh: "😤 减少具有暴力性质、生硬或沉默、咄咄逼人、想要获胜的行为（一对一比赛）。感情更令人安心，甚至可以培养对对手的关怀和友谊感。即使是少量",
      hi: "😤 ऐसे व्यवहार को कम करें जिसमें हिंसक चरित्र हो, रूखा या चुप रहना, आक्रामक रूप से कुटिल होना, जीतने की चाहत (एक पर एक मैच करना)। स्नेह अधिक आश्वस्त करने वाला होता है, विरोधियों के प्रति भी देखभाल और मित्रता की भावना को बढ़ावा देता है। भले ही वह कम मात्रा में हो",
    },
    21: {
      id: "🕵️ Tetap dalam sikap kebijaksanaan, upayakan pikiran jernih yang merangsang penciptaan dan kegaiban, karya fantastis diluar nalar tapi berfaedah",
      en: "🕵️ Stay in an attitude of wisdom, try to have a clear mind that stimulates creation and magic, fantastic works beyond reason but useful",
      fr: "🕵️ Restez dans une attitude de sagesse, essayez d'avoir un esprit clair qui stimule la création et la magie, des œuvres fantastiques au-delà de la raison mais utiles",
      es: "🕵️ Mantente en una actitud de sabiduría, trata de tener la mente clara que estimule la creación y la magia, obras fantásticas más allá de la razón pero útiles.",
      ar: "🕵️ ابق على موقف الحكمة، حاول أن يكون لديك عقل صافي يحفز الخلق والسحر، أعمال رائعة تفوق العقل ولكنها مفيدة",
      zh: "🕵️保持智慧的态度，尝试拥有清晰的头脑，激发创造和魔力，奇妙的作品超越理性但有用",
      hi: "🕵️ ज्ञान के दृष्टिकोण में रहें, एक स्पष्ट दिमाग रखने की कोशिश करें जो सृजन और जादू को उत्तेजित करता है, तर्क से परे शानदार काम करता है लेकिन उपयोगी है",
    },
    22: {
      id: "🛌 Atur pola hidup sehat dan pikiran seimbang agar terhindar sakit/ujian berkepanjangan. Dekatkan diri pada tuhan, jangan turuti hal-hal yang menjauhkan diri dari iman. Jaga perilaku sehat",
      en: "🛌 Set a healthy lifestyle and a balanced mind to avoid prolonged illness/exams. Get closer to God, don't follow things that distance you from faith. Maintain healthy behavior",
      fr: "🛌 Adoptez un mode de vie sain et un esprit équilibré pour éviter les maladies/examens prolongés. Rapprochez-vous de Dieu, ne suivez pas les choses qui vous éloignent de la foi. Maintenir un comportement sain",
      es: "🛌 Establezca un estilo de vida saludable y una mente equilibrada para evitar enfermedades/exámenes prolongados. Acércate a Dios, no sigas cosas que te alejen de la fe. Mantener un comportamiento saludable",
      ar: "🛌 حدد نمط حياة صحي وعقلًا متوازنًا لتجنب المرض / الامتحانات لفترات طويلة. تقرب إلى الله، ولا تتبع أشياء تبعدك عن الإيمان. الحفاظ على السلوك الصحي",
      zh: "🛌 建立健康的生活方式和平衡的心态，以避免长期生病/考试。亲近上帝，不要追随那些远离信仰的事物。保持健康的行为",
      hi: "🛌लंबी बीमारी/परीक्षा से बचने के लिए स्वस्थ जीवनशैली और संतुलित दिमाग स्थापित करें। ईश्वर के करीब आएं, उन चीजों का अनुसरण न करें जो आपको विश्वास से दूर करती हैं। स्वस्थ आचरण बनाए रखें",
    },
    23: {
      id: "🖖 Kurang memahami, kurang berpengetahuan tentang agama. Belajar memahami dan menerapkan ajaran agama perlahan, dengarkan dan ikuti saran pemuka agama",
      en: "🖖 Lack of understanding, lack of knowledge about religion. Learn to understand and apply religious teachings slowly, listen to and follow the advice of religious leaders",
      fr: "🖖 Manque de compréhension, manque de connaissances sur la religion. Apprenez à comprendre et à appliquer les enseignements religieux lentement, écoutez et suivez les conseils des chefs religieux",
      es: "🖖 Falta de comprensión, falta de conocimiento sobre religión. Aprenda a comprender y aplicar las enseñanzas religiosas lentamente, escuche y siga los consejos de los líderes religiosos.",
      ar: "🖖قلة الفهم، وقلة المعرفة بالدين. تعلم كيفية فهم التعاليم الدينية وتطبيقها ببطء، والاستماع إلى نصائح الزعماء الدينيين واتباعها",
      zh: "🖖 缺乏了解，缺乏对宗教的认识。慢慢学会理解和应用宗教教义，倾听并遵循宗教领袖的建议",
      hi: "🖖 समझ की कमी, धर्म के बारे में ज्ञान की कमी। धार्मिक शिक्षाओं को धीरे-धीरे समझना और लागू करना सीखें, धार्मिक नेताओं की सलाह सुनें और उनका पालन करें",
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
      id: "🤓 Terus asah diri dan nalar jenius, cerdas, pemikiran tajam, kelahiran dan penemuan",
      en: "🤓 Continue to hone yourself and your genius reasoning, intelligence, sharp thinking, birth and discovery",
      fr: "🤓 Continuez à vous perfectionner ainsi que votre génie du raisonnement, de votre intelligence, de votre pensée aiguisée, de votre naissance et de votre découverte.",
      es: "🤓 Continúe perfeccionándose a sí mismo y a su genio razonamiento, inteligencia, pensamiento agudo, nacimiento y descubrimiento.",
      ar: "🤓 استمر في صقل نفسك وعبقريتك في التفكير والذكاء والتفكير الحاد والولادة والاكتشاف",
      zh: "🤓 继续磨练自己和你的天才推理、智力、敏锐思维、诞生和发现",
      hi: "🤓 अपने आप को और अपनी प्रतिभाशाली तर्कशक्ति, बुद्धिमत्ता, तीक्ष्ण सोच, जन्म और खोज को निखारना जारी रखें",
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
      ar: "💞اجتهد في التحلي بموقف الحب واللطف والحكمة. لا تزال لا تبالغي في ذلك",
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
      id: "🤠 Termasyhur sedari kecil atau ketika dewasa atau setelah menikah",
      en: "🤠 Famous from childhood or as an adult or after marriage",
      fr: "🤠 Célèbre depuis l'enfance ou à l'âge adulte ou après le mariage",
      es: "🤠 Famoso desde la infancia o de adulto o después del matrimonio.",
      ar: "🤠 اشتهر منذ الطفولة أو عند البلوغ أو بعد الزواج",
      zh: "🤠 从小到大或婚后出名",
      hi: "🤠बचपन से या वयस्क होने पर या शादी के बाद मशहूर",
    },
    31: {
      id: "🤠 Bersemangatlah dalam gemar kemasyhuran dan kebajikan",
      en: "🤠 Be passionate about the passion for fame and virtue",
      fr: "🤠 Soyez passionné par la passion de la gloire et de la vertu",
      es: "🤠 Ser apasionado por la pasión por la fama y la virtud.",
      ar: "🤠كن شغوفًا بشغف الشهرة والفضيلة",
      zh: "🤠 热衷名利",
      hi: "🤠प्रसिद्धि और पुण्य के प्रति जुनूनी बनें",
    },
    32: {
      id: "👰Bergembiralah dan suka menjalin hubungan baik",
      en: "👰Be happy and like to have good relationships",
      fr: "👰Soyez heureux et aimez entretenir de bonnes relations",
      es: "👰Sé feliz y te gusta tener buenas relaciones.",
      ar: "👰كن سعيدًا وأحب أن تكون لديك علاقات جيدة",
      zh: "👰快乐并喜欢有良好的人际关系",
      hi: "👰खुश रहें और अच्छे रिश्ते रखना पसंद करें",
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
    34: {
      id: "🧟 Ariflah dalam setiap kesulitan yang ada, kendalikan dan cari solusi terbaik. Hindari pikiran terbeban yang bisa berdampak sakit, butuh olah mental. Perkuat kesadaran, mendekat pada tuhan dan atur dan seimbangkan beban diri. Upayakan lingkungan kondusif (keluarga). Kumpullah dan kompak bersama keluarga di akhir pekan, sangat menyenangkan",
      en: "🧟 Be wise in every difficulty that exists, control it and look for the best solution. Avoid burdened thoughts which can result in illness, you need mental exercise. Strengthen your awareness, get closer to God and organize and balance your burdens. Strive for a conducive environment (family). Gather and unite with your family on the weekend, it's really fun",
      fr: "🧟 Soyez sage face à chaque difficulté qui existe, contrôlez-la et cherchez la meilleure solution. Évitez les pensées lourdes qui peuvent entraîner des maladies, vous avez besoin d'exercice mental. Renforcez votre conscience, rapprochez-vous de Dieu et organisez et équilibrez vos fardeaux. Efforcez-vous d’avoir un environnement propice (famille). Rassemblez-vous et réunissez-vous en famille le week-end, c'est vraiment amusant",
      es: "🧟 Se sabio en cada dificultad que exista, contrólala y busca la mejor solución. Evite pensamientos agobiantes que puedan provocar enfermedades, necesita ejercicio mental. Fortalece tu conciencia, acércate a Dios y organiza y equilibra tus cargas. Esforzarse por lograr un entorno propicio (familia). Reúnete y únete con tu familia el fin de semana, es muy divertido.",
      ar: "🧟 كن حكيماً في كل صعوبة موجودة، وسيطر عليها وابحث عن الحل الأمثل. تجنب الأفكار المثقلة التي يمكن أن تؤدي إلى المرض، فأنت بحاجة إلى تمرين عقلي. قوي وعيك، وتقرب من الله، ونظم ووازن أعباءك. - السعي لتوفير بيئة مناسبة (عائلية). اجتمع واتحد مع عائلتك في عطلة نهاية الأسبوع، إنها ممتعة حقًا",
      zh: "🧟 明智地对待每一个存在的困难，控制它并寻找最好的解决方案。避免思想负担过重而导致疾病，需要进行心理锻炼。加强你的意识，更接近上帝，整理和平衡你的负担。努力营造有利的环境（家庭）。周末和家人团聚，真开心",
      hi: "🧟 मौजूद हर कठिनाई में बुद्धिमान बनें, उस पर नियंत्रण रखें और सर्वोत्तम समाधान की तलाश करें। बोझिल विचारों से बचें, जिसके परिणामस्वरूप बीमारी हो सकती है, आपको मानसिक व्यायाम की आवश्यकता है। अपनी जागरूकता को मजबूत करें, ईश्वर के करीब आएं और अपने बोझ को व्यवस्थित और संतुलित करें। अनुकूल वातावरण (परिवार) के लिए प्रयास करें। सप्ताहांत में अपने परिवार के साथ इकट्ठा हों और एकजुट हों, यह वास्तव में मजेदार है",
    },
    35: {
      id: "👪 Menjaga pola hidup dan kesehatan yang baik dan hidup dalam kerukunan",
      en: "👪 Maintain a good lifestyle and health and live in harmony",
      fr: "👪 Maintenir une bonne hygiène de vie et une bonne santé et vivre en harmonie",
      es: "👪 Mantener un buen estilo de vida y salud y vivir en armonía.",
      ar: "👪 الحفاظ على نمط حياة وصحة جيدة والعيش في وئام",
      zh: "👪保持良好的生活方式和健康和谐相处",
      hi: "👪 अच्छी जीवनशैली और स्वास्थ्य बनाए रखें और सद्भाव से रहें",
    },
    36: {
      id: "🕵️ Latih diri agar berperilaku jenius, pandai luar biasa, otak terang dan pengetahuan luas",
      en: "🕵️ Train yourself to behave like a genius, extraordinary cleverness, bright brain and broad knowledge",
      fr: "🕵️ Entraînez-vous à vous comporter comme un génie, une intelligence extraordinaire, un cerveau brillant et de vastes connaissances",
      es: "🕵️ Entrénate para comportarte como un genio, una inteligencia extraordinaria, un cerebro brillante y un amplio conocimiento.",
      ar: "🕵️ درب نفسك على التصرف كأنك عبقري وذكاء غير عادي وعقل مشرق ومعرفة واسعة",
      zh: "🕵️训练自己表现得像个天才，聪明过人，头脑聪明，知识广博",
      hi: "🕵️ एक प्रतिभाशाली, असाधारण चतुराई, उज्ज्वल मस्तिष्क और व्यापक ज्ञान की तरह व्यवहार करने के लिए खुद को प्रशिक्षित करें",
    },
    37: {
      id: "👨‍👩‍👧‍👦 Ciptakan jalan hidup manis, hidup rukun dalam berumahtangga. Komunikasi intens",
      en: "👨‍👩‍👧‍👦 Create a sweet way of life, live in harmony in a household. Intense communication",
      fr: "👨‍👩‍👧‍👦 Créer une douceur de vivre, vivre en harmonie dans un foyer. Communication intense",
      es: "👨‍👩‍👧‍👦 Crea una dulce forma de vida, vive en armonía en un hogar. comunicación intensa",
      ar: "👨‍👩‍👧‍👦 اصنع أسلوب حياة جميل، وعش في وئام في المنزل. التواصل المكثف",
      zh: "👨‍👩‍👧‍👦创造甜蜜生活方式，和睦相处。密切沟通",
      hi: "👨‍👩‍👧‍👦 मधुर जीवन शैली बनाएं, घर-परिवार में सद्भाव से रहें। गहन संचार",
    },
    38: {
      id: "🙈 Antisipasi segala hal cacat tidak sempurna, merasa kurang puas, bertabiat pelit dan pencemburu. Kerjakan segala sesuatu dengan sepenuh hati. Bersyukurlah atas apa yang ada. Rajinlah melakukan derma karena derma adalah jalan luhur keberkahan",
      en: "🙈 Anticipate all things that are not perfect, feel dissatisfied, have a stingy and jealous character. Do everything wholeheartedly. Be grateful for what you have. Be diligent in giving charity because charity is a noble way of blessing",
      fr: "🙈 Anticipe tout ce qui n'est pas parfait, se sent insatisfait, a un caractère avare et jaloux. Faites tout de tout votre cœur. Soyez reconnaissant pour ce que vous avez. Soyez diligent dans vos dons car la charité est une noble manière de bénir.",
      es: "🙈 Anticipar todo lo que no es perfecto, sentirse insatisfecho, tener un carácter tacaño y celoso. Haz todo de todo corazón. Agradece lo que tienes. Sea diligente en dar caridad porque la caridad es una manera noble de bendecir.",
      ar: "🙈 توقع كل الأشياء غير المثالية، وتشعر بعدم الرضا، وتتمتع بشخصية بخيل وغيرة. افعل كل شيء بكل إخلاص. كن ممتنا لما لديك. اجتهد في الصدقة فإن الصدقة من أسباب البركة الكريمة",
      zh: "🙈 凡事预感到不完美，感到不满足，有小气、嫉妒的性格。凡事尽心尽意做好。感谢你所拥有的。勤于布施，因为布施是高尚的祝福方式",
      hi: "🙈 उन सभी चीजों का अनुमान लगाएं जो सही नहीं हैं, असंतुष्ट महसूस करते हैं, कंजूस और ईर्ष्यालु चरित्र रखते हैं। हर काम पूरे मन से करो. आपके पास जो कुछ है उसके लिए आभारी रहें। दान देने में परिश्रमी बनो क्योंकि दान आशीर्वाद देने का एक नेक तरीका है",
    },
    39: {
      id: "🤭 Boleh gemar akan pujian, suka dipuji atau suka cari muka. Tetap ingat batasan, sewajarnya",
      en: "🤭 You may like praise, like being praised or like looking for face. Keep your limits in mind, appropriately",
      fr: "🤭 Vous aimerez peut-être les éloges, être félicité ou aimer chercher un visage. Gardez vos limites à l’esprit, de manière appropriée",
      es: "🤭 Puede que te gusten los elogios, que te elogien o que te guste buscar la cara. Tenga en cuenta sus límites, de forma adecuada",
      ar: "🤭 قد يعجبك الثناء، مثل الثناء أو مثل البحث عن الوجه. ضع حدودك في الاعتبار، بشكل مناسب",
      zh: "🤭 你可能喜欢夸奖，喜欢被夸奖，或者喜欢找面子。适当地记住你的限制",
      hi: "🤭आपको प्रशंसा पसंद आ सकती है, प्रशंसा पाना पसंद हो सकता है या चेहरा तलाशना पसंद हो सकता है। उचित रूप से अपनी सीमाओं का ध्यान रखें",
    },
    40: {
      id: "💝 Bersyukur pada tuhan atas hajatan dan pesta, keramaian, bersuka-suka dan pernikahan (diri,anak, keluarga dan lingkungan)",
      en: "💝 Thank God for celebrations and parties, crowds, fun and weddings (self, children, family and environment)",
      fr: "💝 Remerciez Dieu pour les célébrations et les fêtes, les foules, les divertissements et les mariages (moi, enfants, famille et environnement)",
      es: "💝 Gracias a Dios por las celebraciones y fiestas, las multitudes, la diversión y las bodas (uno mismo, los niños, la familia y el medio ambiente)",
      ar: "💝الحمد لله على الاحتفالات والحفلات والحشود والمرح والأعراس (النفس والأبناء والأسرة والبيئة)",
      zh: "💝 感谢上帝赐予庆祝活动、聚会、人群、欢乐和婚礼（自己、孩子、家庭和环境）",
      hi: "💝 उत्सवों और पार्टियों, भीड़, मौज-मस्ती और शादियों (स्वयं, बच्चे, परिवार और पर्यावरण) के लिए भगवान का शुक्र है",
    },
    41: {
      id: "💬 Jaga perilaku baik dan latih diri agar terhindar kenistaan umum, kurang kehati-hatian, gegabah, nista atau kesedihan (simpati) di hadapan banyak orang. Pikirkan dan perhitungkan dulu akibat atas setiap perbuatan yang akan dilakukan. Jangan mudah terbujuk atas segala hal yang masih samar",
      en: "💬 Maintain good behavior and train yourself to avoid public disgrace, lack of caution, recklessness, insults or sadness (sympathy) in front of many people. Think and calculate first the consequences of each action you will take. Don't be easily persuaded by anything that is still unclear",
      fr: "💬 Maintenez un bon comportement et entraînez-vous à éviter la disgrâce publique, le manque de prudence, l'insouciance, les insultes ou la tristesse (sympathie) devant de nombreuses personnes. Réfléchissez et calculez d’abord les conséquences de chaque action que vous entreprenez. Ne vous laissez pas facilement convaincre par quelque chose qui n'est pas encore clair",
      es: "💬 Mantén un buen comportamiento y entrénate para evitar la desgracia pública, la falta de precaución, la imprudencia, los insultos o la tristeza (simpatía) delante de muchas personas. Piensa y calcula primero las consecuencias de cada acción que realizarás. No se deje persuadir fácilmente por algo que aún no está claro.",
      ar: "💬 حافظ على حسن السلوك ودرب نفسك على تجنب الخزي العلني أو عدم الحذر أو الاستهتار أو الإهانة أو الحزن (التعاطف) أمام الكثير من الناس. فكر واحسب أولاً عواقب كل إجراء ستتخذه. لا تقتنع بسهولة بأي شيء لا يزال غير واضح",
      zh: "💬 保持良好的行为并训练自己避免在众人面前丢脸、缺乏谨慎、鲁莽、侮辱或悲伤（同情）。首先思考并计算您将采取的每项行动的后果。不要轻易被任何尚不清楚的事情说服",
      hi: "💬 अच्छा व्यवहार बनाए रखें और कई लोगों के सामने सार्वजनिक अपमान, सावधानी की कमी, लापरवाही, अपमान या दुःख (सहानुभूति) से बचने के लिए खुद को प्रशिक्षित करें। पहले सोचें और गणना करें कि आपके द्वारा किए जाने वाले प्रत्येक कार्य के परिणाम क्या होंगे। ऐसी किसी भी चीज़ से आसानी से सहमत न हों जो अभी भी अस्पष्ट है",
    },
    42: {
      id: "💣 Tingkatkan ibadah dan atur pola hidup sehat serta tekun dan konsisten agar terhindar dari hal/usaha berumur pendek, atau apapun itu yang dilakukan kurang langgeng, kesusahan, hidup kurang bahagia. Segala sesuatu memiliki masanya, lakukan sesuatu sepenuh hati dan hindari sifat ceroboh. Berhematlah",
      en: "💣 Increase your worship and set a healthy lifestyle and be diligent and consistent to avoid short-lived things/businesses, or whatever you do that is less lasting, difficult, and life is less happy. Everything has its season, do things wholeheartedly and avoid being careless. Save money",
      fr: "💣 Augmentez votre culte et adoptez un mode de vie sain et soyez diligent et cohérent pour éviter les choses/entreprises de courte durée, ou tout ce que vous faites qui est moins durable, difficile et dont la vie est moins heureuse. Tout a sa saison, faites les choses avec cœur et évitez d’être négligent. Économisez de l'argent",
      es: "💣 Incrementa tu adoración y establece un estilo de vida saludable y sé diligente y consistente para evitar cosas/negocios de corta duración, o cualquier cosa que hagas que sea menos duradera, difícil y la vida sea menos feliz. Todo tiene su momento, haz las cosas con todo el corazón y evita descuidarte. ahorrar dinero",
      ar: "💣 زد من عبادتك واتبع أسلوب حياة صحي وكن مجتهدًا ومتسقًا لتجنب الأشياء/الأعمال قصيرة العمر، أو أي شيء تفعله يكون أقل ديمومة وصعوبة وحياتك أقل سعادة. كل شيء له موسمه، افعل الأشياء بإخلاص وتجنب الإهمال. توفير المال",
      zh: "💣 增加你的敬拜，建立健康的生活方式，勤奋一致，避免短暂的事情/事业，或者你所做的任何不持久、困难和生活不那么快乐的事情。凡事都有它的季节，用心做事，切忌马虎。省钱",
      hi: "💣 अपनी पूजा बढ़ाएं और एक स्वस्थ जीवन शैली निर्धारित करें और अल्पकालिक चीजों/व्यवसायों से बचने के लिए मेहनती और सुसंगत रहें, या जो कुछ भी आप करते हैं वह कम स्थायी, कठिन है, और जीवन कम खुशहाल है। हर चीज़ का अपना मौसम होता है, काम पूरे मन से करें और लापरवाही करने से बचें। पैसे बचाएं",
    },
    43: {
      id: "🕌 Sepenuh hatilah dalam ritual keagamaan, agamais, dekat dengan tokoh agama rohani spiritual di lingkungan",
      en: "🕌 Be wholehearted in religious rituals, be religious, be close to spiritual religious figures in the environment",
      fr: "🕌 Soyez sans réserve dans les rituels religieux, soyez religieux, soyez proche des personnalités religieuses spirituelles de l'environnement",
      es: "🕌 Sea sincero en los rituales religiosos, sea religioso, esté cerca de figuras religiosas espirituales en el entorno.",
      ar: "🕌 كن مخلصًا في الشعائر الدينية، كن متدينًا، كن قريبًا من الشخصيات الدينية الروحانية في البيئة",
      zh: "🕌 全心投入宗教仪式，有宗教信仰，亲近环境中的精神宗教人物",
      hi: "🕌धार्मिक अनुष्ठानों में पूरे मन से लगें, धार्मिक बनें, वातावरण में आध्यात्मिक धार्मिक विभूतियों के करीब रहें",
    },
    44: {
      id: "😃 Berupaya adil dalam memiliki pengaruh, pemerintahan dan kekuasaan",
      en: "😃 Striving to be fair in having influence, government and power",
      fr: "😃 S'efforcer d'être juste en matière d'influence, de gouvernement et de pouvoir",
      es: "😃 Esforzarnos por ser justos al tener influencia, gobierno y poder.",
      ar: "😃السعي إلى العدالة في امتلاك النفوذ والحكومة والسلطة",
      zh: "😃 努力在影响力、政府和权力方面保持公平",
      hi: "😃 प्रभाव, सरकार और सत्ता में निष्पक्ष रहने का प्रयास करना",
    },
    45: {
      id: "🏝️ Bersyukur dimanapun ketika menjelajah seisi negeri",
      en: "🏝️ Be grateful wherever you are when exploring the country",
      fr: "🏝️ Soyez reconnaissant où que vous soyez lorsque vous explorez le pays",
      es: "🏝️ Agradece estés donde estés cuando explores el país",
      ar: "🏝️ كن ممتنًا أينما كنت عند استكشاف البلد",
      zh: "🏝️ 探索这个国家时，无论身在何处，都要心存感激",
      hi: "🏝️ देश की खोज करते समय आप जहां भी हों, आभारी रहें",
    },
    46: {
      id: "🏩 Atur pola hidup dan usaha secara cermat agar meraih Kemakmuran",
      en: "🏩 Arrange your lifestyle and business patterns carefully to achieve prosperity",
      fr: "🏩 Organisez soigneusement votre style de vie et vos habitudes commerciales pour atteindre la prospérité",
      es: "🏩 Organice cuidadosamente su estilo de vida y sus patrones comerciales para lograr la prosperidad",
      ar: "🏩 رتب نمط حياتك وأنماط عملك بعناية لتحقيق الرخاء",
      zh: "🏩 精心安排你的生活方式和商业模式，实现繁荣",
      hi: "🏩समृद्धि प्राप्त करने के लिए अपनी जीवनशैली और व्यवसाय पैटर्न को सावधानीपूर्वक व्यवस्थित करें",
    },
    47: {
      id: "🗽 Bersyukurlah atas hidup dan bahagialah, tetap usahakan lingkungan yang menyenangkan",
      en: "🗽 Be grateful for life and be happy, keep a pleasant environment",
      fr: "🗽 Soyez reconnaissant pour la vie et soyez heureux, gardez un environnement agréable",
      es: "🗽 Agradece la vida y sé feliz, mantén un ambiente agradable.",
      ar: "🗽 كن ممتنًا للحياة وكن سعيدًا، وحافظ على بيئة ممتعة",
      zh: "🗽 感恩生活快乐，保持愉快的环境",
      hi: "🗽जीवन के प्रति आभारी रहें और खुश रहें, सुखद वातावरण बनाये रखें",
    },
    48: {
      id: "🏛️ Berbuat adil terutama melakukan hal berhubungan dengan hakim, masuk pengadilan (jadi pengacara, korban, ataupun tersangka), berhubungan atau mengalami suatu kasus, hakim dan putusan pengadilan. Upayakan setiap langkah menuju hal positif dan hindari merugikan orang lain",
      en: "🏛️ Doing justice, especially in dealing with judges, going to court (as a lawyer, victim or suspect), dealing with or experiencing a case, judge and court decision. Strive for every step towards positive things and avoid harming other people",
      fr: "🏛️ Rendre la justice, notamment face aux juges, se rendre au tribunal (en tant qu'avocat, victime ou suspect), traiter ou vivre une affaire, un juge et une décision de justice. Efforcez-vous de faire chaque pas vers des choses positives et évitez de nuire aux autres",
      es: "🏛️ Hacer justicia, especialmente al tratar con jueces, acudir a los tribunales (como abogado, víctima o sospechoso), afrontar o vivir un caso, juez y decisión judicial. Esfuércese por dar cada paso hacia cosas positivas y evite dañar a otras personas.",
      ar: "🏛️ تحقيق العدالة، وخاصة في التعامل مع القضاة، والذهاب إلى المحكمة (كمحامي أو ضحية أو مشتبه به)، والتعامل مع قضية ما أو تجربتها، والقاضي وقرار المحكمة. نسعى جاهدين في كل خطوة نحو الأشياء الإيجابية وتجنب إيذاء الآخرين",
      zh: "🏛️ 伸张正义，尤其是在与法官打交道、出庭（作为律师、受害者或嫌疑人）、处理或经历案件、法官和法院判决时。努力迈出积极的一步，避免伤害他人",
      hi: "🏛️ न्याय करना, विशेष रूप से न्यायाधीशों के साथ व्यवहार में, अदालत में जाना (वकील, पीड़ित या संदिग्ध के रूप में), किसी मामले, न्यायाधीश और अदालत के फैसले से निपटना या उसका अनुभव करना। सकारात्मक चीज़ों की ओर हर कदम बढ़ाने का प्रयास करें और अन्य लोगों को नुकसान पहुँचाने से बचें",
    },
    49: {
      id: "🤑 Kendalikan sifat materialistik, rakus, suka pamer (posisi, uang, harta, kesuksesan). Bersyukur atas apa yang diberi tuhan, hindarkan diri dari perilaku sombong. Bukankah segala sesuatu materi akan tetap tinggal di dunia",
      en: "🤑 Control your materialistic, greedy, ostentatious nature (position, money, possessions, success). Be grateful for what God has given you, avoid arrogant behavior. Wouldn't all material things remain in the world?",
      fr: "🤑 Contrôlez votre nature matérialiste, cupide et ostentatoire (position, argent, possessions, succès). Soyez reconnaissant pour ce que Dieu vous a donné, évitez les comportements arrogants. Toutes les choses matérielles ne resteraient-elles pas dans le monde ?",
      es: "🤑 Controla tu naturaleza materialista, codiciosa y ostentosa (posición, dinero, posesiones, éxito). Agradece lo que Dios te ha dado, evita comportamientos arrogantes. ¿No permanecerían todas las cosas materiales en el mundo?",
      ar: "🤑 تحكم في طبيعتك المادية، الجشعة، المتفاخرة (المنصب، المال، الممتلكات، النجاح). كن ممتنًا لما أعطاك الله، وتجنب التكبر. ألن تبقى كل الأشياء المادية في العالم؟",
      zh: "🤑 控制你的物质、贪婪、炫耀的本性（地位、金钱、财产、成功）。感恩上帝赐予你的一切，避免傲慢的行为。难道所有物质的东西都不会留在世上吗？",
      hi: "🤑 अपने भौतिकवादी, लालची, आडंबरपूर्ण स्वभाव (पद, धन, संपत्ति, सफलता) पर नियंत्रण रखें। भगवान ने आपको जो दिया है उसके लिए आभारी रहें, अहंकारी व्यवहार से बचें। क्या सभी भौतिक वस्तुएँ संसार में नहीं रहेंगी?",
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
    60: {
      id: "👥 Bijaklah terhadap adanya jarak dengan keluarga maupun sahabat, bisa pada hal fisik bisa dalam hal batin/berseberangan pemikiran, atau merasa ada jarak pemisah pada ruang waktu atau alam/lingkungan. Hargai setiap kebersamaan yang ada, tetaplah bina dan bijaklah karena ada waktu bersama dan ada masanya berpisah, sekali lagi hargai setiap kebersamaan",
      en: "👥 Be wise about distance from family or friends, it could be physical, it could be mental/opposing thoughts, or you feel there is a distance between space, time or nature/the environment. Appreciate every moment of togetherness, continue to be nurturing and wise because there is time to be together and there is time to be apart, once again appreciate every moment of togetherness",
      fr: "👥 Soyez prudent quant à la distance entre la famille et les amis, cela peut être physique, cela peut être en termes de pensées mentales/opposées, ou de sentiment qu'il y a une distance entre l'espace, le temps ou la nature/l'environnement. Appréciez chaque moment de convivialité, continuez à construire et soyez sage car il y a du temps pour être ensemble et il y a du temps pour être séparé, appréciez encore une fois chaque moment de convivialité.",
      es: "👥 Sea prudente con la distancia entre familiares y amigos, puede ser física, puede ser en términos de pensamientos mentales/contrapuestos, o sentir que hay una distancia entre el espacio, el tiempo o la naturaleza/el medio ambiente. Aprecia cada momento de unión, sigue construyendo y sé sabio porque hay tiempo para estar juntos y hay tiempo para estar separados, una vez más aprecia cada momento de unión.",
      ar: "👥 كن حكيماً فيما يتعلق بالبعد عن العائلة أو الأصدقاء، يمكن أن يكون جسديًا، أو عقليًا/أفكارًا متعارضة، أو تشعر أن هناك مسافة بين المكان أو الزمان أو الطبيعة/البيئة. قدّر كل لحظة من العمل الجماعي، واستمر في الرعاية والحكمة لأنه يوجد وقت لنكون معًا وهناك وقت للانفصال، ومرة أخرى نقدر كل لحظة من العمل الجماعي",
      zh: "👥 明智地对待家人和朋友之间的距离，它可能是身体上的，也可能是精神上/对立的想法，或者感觉空间、时间或自然/环境之间存在距离。珍惜每一个在一起的时刻，不断建设并保持明智，因为有在一起的时间，也有分开的时间，再次珍惜在一起的每一个时刻",
      hi: "👥 परिवार और दोस्तों के बीच की दूरी के बारे में समझदारी से काम लें, यह शारीरिक हो सकता है, यह मानसिक/विरोधी विचारों के संदर्भ में हो सकता है, या ऐसा महसूस हो सकता है कि स्थान, समय या प्रकृति/पर्यावरण के बीच दूरी है। साथ के हर पल की सराहना करें, निर्माण करते रहें और बुद्धिमान बनें क्योंकि साथ रहने का समय है और अलग होने का भी समय है, एक बार फिर साथ के हर पल की सराहना करें",
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
      id: "🏇 Berada dalam dunia sendiri, menata dunianya sendiri (nyata)/ maya (meditasi, kontemplasi, spiritual)",
      en: "🏇 Being in your own world, organizing your own world (real)/virtual (meditation, contemplation, spiritual)",
      fr: "🏇 Être dans son propre monde, organiser son propre monde (réel)/virtuel (méditation, contemplation, spirituel)",
      es: "🏇 Estar en tu propio mundo, organizar tu propio mundo (real)/virtual (meditación, contemplación, espiritual)",
      ar: "🏇 أن تكون في عالمك الخاص، تنظم عالمك الخاص (الحقيقي)/الافتراضي (التأمل، التأمل، الروحي)",
      zh: "🏇 活在自己的世界里，组织自己的世界（真实）/虚拟（冥想、沉思、精神）",
      hi: "🏇 अपनी दुनिया में रहना, अपनी दुनिया को व्यवस्थित करना (वास्तविक)/आभासी (ध्यान, चिंतन, आध्यात्मिक)",
    },
    77: {
      id: "🙏 Terus meminta ampun pada tuhan, pengampunan, penyesalan dan bertobat",
      en: "🙏 Continue to ask God for forgiveness, forgiveness, regret and repentance",
      fr: "🙏 Continuez à demander à Dieu pardon, pardon, regret et repentir",
      es: "🙏 Continuar pidiendo a Dios perdón, perdón, arrepentimiento y arrepentimiento.",
      ar: "🙏 استمر في سؤال الله العفو والمغفرة والندم والتوبة",
      zh: "🙏 继续祈求上帝的宽恕、宽恕、悔改和忏悔",
      hi: "🙏 ईश्वर से क्षमा, क्षमा, पश्चाताप और पश्चाताप मांगते रहें",
    },
    80: {
      id: "🧖 Atur pola hidup yang baik agar tetap dalam kesehatan prima, kesembuhan, cepat pulih dari sakit",
      en: "🧖 Set a good lifestyle to stay in good health, recover quickly and recover quickly from illness",
      fr: "🧖 Adopter un bon mode de vie pour rester en bonne santé, récupérer rapidement et se remettre rapidement d'une maladie",
      es: "🧖 Establezca un buen estilo de vida para mantener una buena salud, recuperarse rápidamente y recuperarse rápidamente de una enfermedad.",
      ar: "🧖 اتبع أسلوب حياة جيدًا للبقاء بصحة جيدة والتعافي بسرعة والتعافي سريعًا من المرض",
      zh: "🧖 树立良好的生活方式，保持身体健康，早日康复，早日康复",
      hi: "🧖 अच्छे स्वास्थ्य में रहने, जल्दी ठीक होने और बीमारी से जल्दी ठीक होने के लिए एक अच्छी जीवनशैली निर्धारित करें",
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
    90: {
      id: "🤩 Jangan mudah diperdaya, mudah percaya, kesilauan (harta,tahta, wanita/pria), kesesatan yang berujung duka. Perkuat intuisi dan pertimbangkan baik buruknya suatu tawaran. Pahamilah bahwa hal yang menarik belum tentu baik, bijaksana dan jangan berlebihan dalam menginginkan sesuatu",
      en: "🤩 Don't be easily deceived, easily believed, blinded (treasures, thrones, women/men), misguidance that ends in sorrow. Strengthen your intuition and consider the pros and cons of an offer. Understand that what is attractive is not necessarily good, be wise and don't be excessive in wanting something",
      fr: "🤩 Ne vous laissez pas tromper facilement, facilement croire, aveuglé (trésors, trônes, femmes/hommes), égarement qui se termine par du chagrin. Renforcez votre intuition et réfléchissez aux avantages et aux inconvénients d’une offre. Comprenez que ce qui est attrayant n'est pas nécessairement bon, soyez sage et ne voulez pas excessivement quelque chose",
      es: "🤩 No os dejéis engañar fácilmente, creer fácilmente, cegar (tesoros, tronos, mujeres/hombres), extravío que termina en dolor. Fortalece tu intuición y considera los pros y los contras de una oferta. Entiende que lo atractivo no necesariamente es bueno, sé prudente y no seas excesivo en querer algo.",
      ar: "🤩 لا تنخدع بسهولة، وتصدق بسهولة، وتعمي (الكنوز، والعروش، والنساء/الرجال)، والضلال الذي ينتهي بالحزن. عزز حدسك وفكر في إيجابيات وسلبيات العرض. افهم أن ما هو جذاب ليس بالضرورة جيدًا، وكن حكيمًا ولا تبالغ في الرغبة في شيء ما",
      zh: "🤩 不要轻易被欺骗、轻易相信、盲目（宝藏、王位、女人/男人）、误导而导致悲伤。增强你的直觉并考虑报价的利弊。要明白有吸引力的东西不一定是好的，要明智，不要过度想要某样东西",
      hi: "🤩 आसानी से धोखा न खाएं, आसानी से विश्वास न करें, अंधे (खजाना, सिंहासन, महिला/पुरुष) न बनें, ऐसा गुमराह न हों जिसका अंत दुःख हो। अपने अंतर्ज्ञान को मजबूत करें और किसी प्रस्ताव के फायदे और नुकसान पर विचार करें। समझें कि जो आकर्षक है वह जरूरी नहीं कि अच्छा हो, बुद्धिमान बनें और किसी चीज की चाहत में अति न करें",
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
    200: {
      id: "😮 Hindari Sifat ragu-ragu, bingung dalam menentukan sikap, suka plin-plan. Fokus lah pada tujuan, gunakan waktu sebaik mungkin",
      en: "😮 Avoid being doubtful, confused in determining your attitude, being wishy-washy. Focus on the goal, use your time as best as possible",
      fr: "😮 Évitez d'être dubitatif, confus dans la détermination de votre attitude, d'être insipide. Concentrez-vous sur l'objectif, utilisez votre temps au mieux",
      es: "😮 Evite dudar, confundirse a la hora de determinar su actitud, ser indeciso. Concéntrate en el objetivo, utiliza tu tiempo lo mejor posible",
      ar: "😮 تجنب أن تكون متشككًا، ومرتبكًا في تحديد موقفك، وأن تكون متمنيًا. ركز على الهدف، واستغل وقتك قدر الإمكان",
      zh: "😮 避免在确定态度时产生怀疑、困惑、优柔寡断。专注于目标，尽可能充分利用时间",
      hi: "😮 अपना दृष्टिकोण निर्धारित करने में संशयपूर्ण, भ्रमित होने वाले, ढुलमुल होने से बचें। लक्ष्य पर ध्यान केंद्रित करें, अपने समय का यथासंभव सर्वोत्तम उपयोग करें",
    },
    215: {
      id: "😫 Berhematlah di segala kesempatan, giatlah di waktu muda agar tak menyesal di masa tua. Hindari Potensi mengalami kesengsaraan dan kesusahan hidup",
      en: "😫 Save money at all times, be active when you are young so you don't regret it when you are old. Avoid the potential to experience misery and hardship in life",
      fr: "😫 Économisez de l'argent à tout moment, soyez actif quand vous êtes jeune pour ne pas le regretter quand vous serez vieux. Évitez le risque de vivre la misère et les difficultés dans la vie",
      es: "😫 Ahorra dinero en todo momento, mantente activo cuando seas joven para no arrepentirte cuando seas mayor. Evite la posibilidad de experimentar miseria y dificultades en la vida.",
      ar: "😫 ادخر المال في كل الأوقات، وكن نشيطًا عندما تكون صغيرًا حتى لا تندم عليه عندما تكبر. تجنب احتمال تجربة البؤس والمصاعب في الحياة",
      zh: "😫 时刻存钱，年轻的时候积极一点，老了才不会后悔。避免在生活中经历痛苦和困难的可能性",
      hi: "😫 हर समय पैसे बचाएं, जब आप जवान हों तो सक्रिय रहें ताकि बूढ़े होने पर आपको पछताना न पड़े। जीवन में दुख और कठिनाई का अनुभव करने की संभावना से बचें",
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
      ar: "😇أمر الرسول تعالى بحراسة الأمانة",
      zh: "😇 全能使者的命令，守护信任",
      hi: "😇 सर्वशक्तिमान दूत का आदेश, अमानत की रखवाली",
    },
    350: {
      id: "⚖️ Potensi mengalami ketidakadilan, berharap adil, atau suka diperlakukan adil. Tetap berbuat adil lah kepada orang lain",
      en: "⚖️ Potential to experience injustice, hope to be fair, or like to be treated fairly. Always be fair to others",
      fr: "⚖️ Possibilité de subir une injustice, d'espérer être juste ou d'aimer être traité équitablement. Soyez toujours juste envers les autres",
      es: "⚖️ Potencial de experimentar injusticia, esperar ser justo o gustar que lo traten de manera justa. Sea siempre justo con los demás",
      ar: "⚖️ احتمال التعرض للظلم أو الأمل في العدالة أو الرغبة في المعاملة العادلة. كن عادلاً مع الآخرين دائماً",
      zh: "⚖️ 有可能经历不公正，希望公平，或喜欢受到公平对待。永远公平地对待别人",
      hi: "⚖️ अन्याय का अनुभव करने की क्षमता, निष्पक्ष होने की आशा, या उचित व्यवहार किया जाना पसंद है। हमेशा दूसरों के प्रति निष्पक्ष रहें",
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
    400: {
      id: "👣 Potensi mengalami perjalanan panjang, penuh cobaan, letih dan lelah. Fokuslah pada tujuan, gunakan waktu sebaik mungkin",
      en: "👣 Potential to experience a long journey, full of trials, fatigue and exhaustion. Focus on the goal, use your time as best as possible",
      fr: "👣 Potentiel de vivre un long voyage, plein d'épreuves, de fatigue et d'épuisement. Concentrez-vous sur l'objectif, utilisez votre temps au mieux",
      es: "👣 Potencial para vivir un largo viaje, lleno de pruebas, fatiga y agotamiento. Concéntrate en el objetivo, utiliza tu tiempo lo mejor posible",
      ar: "👣إمكانية خوض رحلة طويلة مليئة بالتجارب والتعب والإرهاق. ركز على الهدف، واستغل وقتك قدر الإمكان",
      zh: "👣 可能经历长途旅行，充满考验、疲劳和疲惫。专注于目标，尽可能充分利用时间",
      hi: "👣 परीक्षाओं, थकान और थकावट से भरी लंबी यात्रा का अनुभव होने की संभावना। लक्ष्य पर ध्यान केंद्रित करें, अपने समय का यथासंभव सर्वोत्तम उपयोग करें",
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
    666: {
      id: "👺 Sifat jahat, persekutuan dan permusuhan. Kembangkanlah kebaikan, pilih jalan kebaikan dan bermanfaatlah untuk orang banyak. Jangan memperturutkan hawa nafsu",
      en: "👺 Evil nature, alliance and enmity. Develop kindness, choose the path of goodness and be useful to many people. Don't follow your desires",
      fr: "👺Mauvaise nature, alliance et inimitié. Développez la bienveillance, choisissez le chemin du bien et soyez utile à de nombreuses personnes. Ne suivez pas vos désirs",
      es: "👺 Naturaleza maligna, alianza y enemistad. Desarrolla la bondad, elige el camino del bien y sé útil a muchas personas. No sigas tus deseos",
      ar: "👺 شر الطبع والتحالف والعداوة. طور اللطف واختر طريق الخير وكن مفيدًا لكثير من الناس. لا تتبع رغباتك",
      zh: "👺本性邪恶，结盟与仇恨。培养善良，选择善良的道路，对许多人有用。不要跟随你的欲望",
      hi: "👺 दुष्ट स्वभाव, संधि और शत्रुता। दयालुता का विकास करें, अच्छाई का मार्ग चुनें और कई लोगों के लिए उपयोगी बनें। अपनी इच्छाओं का पालन न करें",
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
    900: {
      id: "🤼 Atasi dan kurangi peperangan (fight), pertempuran, (situasi) konflik, perdebatan dan pergulatan (tinju, gulat). Hindari konflik dan permusuhan sebisa mungkin agar hidup menjadi tenteram",
      en: "🤼 Overcome and reduce war (fight), fighting, conflict (situation), debate and struggle (boxing, wrestling). Avoid conflict and hostility as much as possible so that life can be peaceful",
      fr: "🤼 Surmonter et réduire la guerre (combat), les combats, les conflits (situation), les débats et les luttes (boxe, lutte). Évitez autant que possible les conflits et l’hostilité afin que la vie puisse être paisible",
      es: "🤼 Superar y reducir la guerra (lucha), la lucha, el conflicto (situación), el debate y la lucha (boxeo, lucha libre). Evite el conflicto y la hostilidad tanto como sea posible para que la vida pueda ser pacífica.",
      ar: "🤼 التغلب والتقليل من الحرب (القتال)، القتال، الصراع (الموقف)، النقاش والصراع (الملاكمة، المصارعة). تجنب الصراع والعداء قدر الإمكان حتى تكون الحياة سلمية",
      zh: "🤼 克服和减少战争（打架）、战斗、冲突（局势）、辩论和斗争（拳击、摔跤）。尽量避免冲突和敌意，这样生活才能平静",
      hi: "🤼 युद्ध (लड़ाई), लड़ाई, संघर्ष (स्थिति), बहस और संघर्ष (मुक्केबाजी, कुश्ती) पर काबू पाएं और कम करें। जितना हो सके संघर्ष और शत्रुता से बचें ताकि जीवन शांतिपूर्ण हो सके",
    },
    1000: {
      id: "☺️ Berkasih sayang, sangat pengasih, pengampunan",
      en: "☺️ Compassionate, very loving, forgiving",
      fr: "☺️ Compatissant, très aimant, indulgent",
      es: "☺️ Compasivo, muy cariñoso, perdonador.",
      ar: "☺️ رحيم، محب للغاية، متسامح",
      zh: "☺️富有同情心，非常有爱心，宽容",
      hi: "☺️ दयालु, अत्यंत प्रेममय, क्षमाशील",
    },
    1095: {
      id: "🤐 Bersifat diam (tidak suka banyak bicara). Bersahabatlah dengan tulus dan lebih terbuka, teman akan menghiasi hidup dengan kebahagiaan",
      en: "🤐 Quiet (doesn't like to talk a lot). Be friends sincerely and be more open, friends will decorate your life with happiness",
      fr: "🤐 Calme (n'aime pas beaucoup parler). Soyez amis sincèrement et soyez plus ouverts, les amis décoreront votre vie avec bonheur",
      es: "🤐 Tranquilo (no le gusta hablar mucho). Sean amigos sinceramente y sean más abiertos, los amigos decorarán su vida con felicidad.",
      ar: "🤐 هادئ (لا يحب التحدث كثيرًا). كن صديقًا صادقًا وكن أكثر انفتاحًا، فالأصدقاء سيزينون حياتك بالسعادة",
      zh: "🤐 安静（不喜欢多说话）。真诚做朋友，敞开心扉，朋友会用幸福装点你的生活",
      hi: "🤐 शांत (ज्यादा बातें करना पसंद नहीं)। ईमानदारी से दोस्त बनें और अधिक खुले रहें, दोस्त आपके जीवन को खुशियों से सजा देंगे",
    },
    1260: {
      id: "😳 Atasi dan kurangi segala gangguan, gelisah, sering terganggu atau suka mengganggu orang lain. Atur waktu dengan baik, seimbang antara bekerja dan istirahat. Hiduplah hari ini dengan optimis, hari esok ada masanya",
      en: "😳 Overcome and reduce all disturbances, restlessness, frequent distractions or likes to disturb other people. Manage your time well, balance between work and rest. Live today optimistically, there will be tomorrow",
      fr: "😳 Surmonter et réduire toutes perturbations, agitations, distractions fréquentes ou aime déranger les autres. Gérez bien votre temps, équilibrez travail et repos. Vivez aujourd'hui avec optimisme, il y aura demain",
      es: "😳 Supera y reduce todas las perturbaciones, inquietudes, distracciones frecuentes o gustos por molestar a otras personas. Gestiona bien tu tiempo, equilibrio entre trabajo y descanso. Vive el hoy con optimismo, habrá un mañana.",
      ar: "😳 التغلب على جميع الاضطرابات أو الأرق أو الانحرافات المتكررة أو يحب إزعاج الآخرين والحد منها. إدارة وقتك بشكل جيد، والموازنة بين العمل والراحة. عش اليوم متفائلاً، سيكون هناك غداً",
      zh: "😳 克服并减少所有干扰、不安、频繁分心或喜欢打扰他人。管理好时间，平衡工作与休息。乐观地度过今天，就会有明天",
      hi: "😳 सभी गड़बड़ी, बेचैनी, बार-बार ध्यान भटकाने या अन्य लोगों को परेशान करने की पसंद पर काबू पाएं और कम करें। अपने समय का अच्छे से प्रबंधन करें, काम और आराम के बीच संतुलन बनाएं। आज को आशावादी ढंग से जियो, कल होगा",
    },
    1390: {
      id: "🤺 Potensi pengejaran, pencarian dan pendakwaan. Berusaha berbuat baik, hindari konflik",
      en: "🤺 Potential pursuit, search and condemnation. Try to do good, avoid conflict",
      fr: "🤺Possibilité de poursuite, de fouille et de condamnation. Essayez de faire le bien, évitez les conflits",
      es: "🤺 Potencial persecución, búsqueda y condena. Intenta hacer el bien, evita los conflictos.",
      ar: "🤺 الملاحقة المحتملة والبحث والإدانة. حاول أن تفعل الخير، وتجنب الصراع",
      zh: "🤺 潜在的追求、寻找和谴责。努力做好事，避免冲突",
      hi: "🤺 संभावित खोज, खोज और निंदा। अच्छा करने का प्रयास करें, विवाद से बचें",
    },
  };

  // Function to get description based on value and language
  const getVlookupDescription = (value: number): string => {
    const entry = vlookupTable[value];
    if (!entry) return `G${value}: ${value}`;

    const langKey = language === "id" ? "id" : language;
    return entry[langKey] || entry["en"] || `G${value}: ${value}`;
  };

  const getHaraDescription = (hara: number) => {
    const key = `hara_${hara}_desc`;
    return t(key) || "Description not available";
  };

  const getExpressionDescription = (expression: number) => {
    const key = `expression_${expression}_desc`;
    return t(key) || "Description not available";
  };

  const getTimeDescription = (time: number) => {
    const key = `time_${time}_desc`;
    return t(key) || "Description not available";
  };

  const showParameterDescription = (
    parameterType: string,
    value: number | string,
  ) => {
    let description = "";
    let title = "";

    switch (parameterType) {
      case "hara":
        title = `${t("hara")} ${value}`;
        description = getHaraDescription(Number(value));
        break;
      case "expression":
        title = `${t("expression")} ${value}`;
        description = getExpressionDescription(Number(value));
        break;
      case "time":
        title = `${t("time")} ${value}`;
        description = getTimeDescription(Number(value));
        break;
      case "personality":
        title = `Personality ${value}`;
        description = `Personality number represents your outer self and how others perceive you. It is calculated from the consonants in your name and shows the traits you display to the world.`;
        break;
      case "dimensional":
        title = t("dimensional_analysis");
        description = `${t("physical")}: ${patterns.physical}\n${t("mental")}: ${patterns.mental}\n${t("emotion")}: ${patterns.emotion}\n${t("intuition")}: ${patterns.intuition}\n\n${t("dimensional_analysis_desc")}`;
        break;
      case "synchronize":
        title = t("synchronize_score");
        description = `${t("synchronize_value")}: ${patterns.synchronize}\n\n${t("synchronize_desc")}`;
        break;
      case "coherence":
        title = t("coherence_value");
        description = `${t("coherence_value")}: ${patterns.coherence}\n\n${t("coherence_desc")}`;
        break;
      case "synergize":
        title = t("synergize_value");
        description = `${t("synergize_value")}: ${patterns.synergize}\n\n${t("synergize_desc")}`;
        break;
      case "productive":
        title = t("productive_value");
        description = `${t("productive_value")}: ${patterns.productive}\n\n${t("productive_desc")}`;
        break;
      case "momentum":
        title = t("momen_sukses_value");
        description = `${t("momen_sukses_value")}: ${patterns.momenSukses}\n\n${t("momentum_desc")}`;
        break;
    }

    setSelectedParameter(`${title}\n\n${description}`);
    setModalVisible(true);
  };

  const renderIntensityChart = () => {
    return (
      <View className="flex-row justify-between mt-4 mb-2">
        {Object.entries(patterns.angka_intensitas).map(([number, count]) => (
          <View key={number} className="items-center">
            <Text className="text-lg font-bold">{number}</Text>
            <View
              className="bg-purple-500 w-6 rounded-t-md"
              style={{ height: Math.max(count * 10, 5) }}
            />
            <Text className="text-xs">{count}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView className="bg-white p-4 rounded-lg">
      <View className="border-b border-gray-200 pb-4 mb-4">
        <Text className="text-2xl font-bold text-purple-800">
          {patterns.namaNormal}
        </Text>
        <Text className="text-gray-600">{patterns.tglLahirFormat}</Text>
        <Text className="text-gray-600">
          {t("gender")}: {gender === "Male" ? t("male") : t("female")}
        </Text>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-orange-50 p-3 rounded-lg"
          onPress={() => showParameterDescription("hara", patterns.hara)}
        >
          <View className="bg-orange-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-orange-800 text-center">
              {t("hara")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              [1, 2, 3, 4, 6].includes(patterns.hara)
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {patterns.hara}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-indigo-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("expression", patterns.destiny)
          }
        >
          <View className="bg-indigo-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-indigo-800 text-center">
              {t("expression")}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-indigo-800 text-center">
            {patterns.destiny}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-blue-50 p-3 rounded-lg"
          onPress={() => showParameterDescription("time", patterns.time)}
        >
          <View className="bg-blue-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-blue-800 text-center">
              {t("time")}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-blue-800 text-center">
            {patterns.time}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-blue-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("heart_desire", patterns.angka_vokal)
          }
        >
          <View className="bg-blue-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-blue-800 text-center">
              Heart Desire
            </Text>
          </View>
          <Text className="text-2xl font-bold text-blue-800 text-center">
            {patterns.angka_vokal}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-blue-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("personality", patterns.angka_konsonan)
          }
        >
          <View className="bg-blue-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-blue-800 text-center">
              Personality
            </Text>
          </View>
          <Text className="text-2xl font-bold text-blue-800 text-center">
            {patterns.angka_konsonan}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-blue-50 p-3 rounded-lg"
          onPress={() => showParameterDescription("dimensional", "")}
        >
          <View className="bg-blue-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-blue-800 text-center">
              {t("dimensional_analysis")}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 text-sm">
              {t("physical")}:{" "}
              <Text
                className={`font-bold ${patterns.physical < 60 ? "text-red-600" : "text-gray-800"}`}
              >
                {patterns.physical}
              </Text>
            </Text>
            <Text className="text-gray-600 text-sm">
              {t("mental")}:{" "}
              <Text
                className={`font-bold ${patterns.mental < 60 ? "text-red-600" : "text-gray-800"}`}
              >
                {patterns.mental}
              </Text>
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 text-sm">
              {t("emotion")}:{" "}
              <Text
                className={`font-bold ${patterns.emotion < 60 ? "text-red-600" : "text-gray-800"}`}
              >
                {patterns.emotion}
              </Text>
            </Text>
            <Text className="text-gray-600 text-sm">
              {t("intuition")}:{" "}
              <Text
                className={`font-bold ${patterns.intuition < 60 ? "text-red-600" : "text-gray-800"}`}
              >
                {patterns.intuition}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-purple-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("synchronize", patterns.synchronize)
          }
        >
          <View className="bg-purple-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-purple-800 text-center">
              {t("synchronize_score")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              patterns.synchronize < 0.6 ? "text-red-600" : "text-purple-800"
            }`}
          >
            {patterns.synchronize}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-green-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("coherence", patterns.coherence)
          }
        >
          <View className="bg-green-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-green-800 text-center">
              {t("coherence_value")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              patterns.coherence < 0.6 ? "text-red-600" : "text-green-800"
            }`}
          >
            {patterns.coherence}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-teal-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("synergize", patterns.synergize)
          }
        >
          <View className="bg-teal-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-teal-800 text-center">
              {t("synergize_value")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              parseFloat(patterns.synergize.replace("%", "")) < 60
                ? "text-red-600"
                : "text-teal-800"
            }`}
          >
            {patterns.synergize}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-cyan-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("productive", patterns.productive)
          }
        >
          <View className="bg-cyan-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-cyan-800 text-center">
              {t("productive_value")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              parseFloat(patterns.productive.replace("%", "")) < 60
                ? "text-red-600"
                : "text-cyan-800"
            }`}
          >
            {patterns.productive}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-emerald-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription("momentum", patterns.momenSukses)
          }
        >
          <View className="bg-emerald-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-emerald-800 text-center">
              {t("momen_sukses_value")}
            </Text>
          </View>
          <Text
            className={`text-2xl font-bold text-center ${
              parseFloat(patterns.momenSukses) < 0.6
                ? "text-red-600"
                : "text-emerald-800"
            }`}
          >
            {patterns.momenSukses}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="bg-yellow-50 p-3 rounded-lg"
          onPress={() =>
            showParameterDescription(
              "point_of_intensification",
              patterns.pointOfIntensification,
            )
          }
        >
          <View className="bg-yellow-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-yellow-800 text-center">
              Point of Intensification
            </Text>
          </View>
          <Text className="text-2xl font-bold text-center text-yellow-800">
            {patterns.pointOfIntensification}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <View className="bg-purple-50 p-3 rounded-lg">
          <View className="bg-purple-200 px-2 py-1 rounded mb-2">
            <Text className="text-sm font-medium text-purple-800 text-center">
              {t("grafologi_index")}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-center text-purple-800">
            {grafologiResult.persValue}
          </Text>
          <Text className="text-gray-600 text-center mt-1 text-sm">
            {t("value")}: {grafologiResult.indexValue}
          </Text>

          <View className="mt-4">
            <Text className="text-lg font-semibold mb-2">
              {t("potential_suggestions")}
            </Text>
            <View className="flex-row flex-wrap">
              {grafologiResult.suggestions.map((suggestion, index) => (
                <View
                  key={index}
                  className="mr-2 mb-2 px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: suggestion.isPositive
                      ? "#d1fae5"
                      : "#fee2e2",
                  }}
                >
                  <Text
                    style={{
                      color: suggestion.isPositive ? "#047857" : "#b91c1c",
                    }}
                  >
                    G{index + 1}: {suggestion.value}
                  </Text>
                </View>
              ))}
            </View>
            <View className="mt-2">
              {grafologiResult.suggestions.map((suggestion, index) => (
                <View
                  key={index}
                  className="mb-3 p-3 rounded-md"
                  style={{
                    backgroundColor: suggestion.isPositive
                      ? "#d1fae5"
                      : "#fee2e2",
                  }}
                >
                  <Text
                    style={{
                      color: suggestion.isPositive ? "#047857" : "#b91c1c",
                    }}
                  >
                    G{index + 1}: {getVlookupDescription(suggestion.value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {isPremium ? (
        <>
          <View className="mb-6">
            <Text className="text-xl font-semibold mb-2">
              {t("advanced_analysis")}
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">
                {t("core_numbers")}
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("character_number")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_karakter}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">
                    {t("expression_number")}
                  </Text>
                  <Text className="text-2xl font-bold">{patterns.destiny}</Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">Heart Desire</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_vokal}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">
                    {t("personality_number")}
                  </Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_konsonan}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">
                {t("number_intensity")}
              </Text>
              {renderIntensityChart()}
            </View>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">
                {t("personal_development")}
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("self_potential")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_potensi_diri}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("attitude_number")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_sikap}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("growth_number")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_pertumbuhan}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">
                {t("birth_date_analysis")}
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/3 mb-3">
                  <Text className="text-gray-600">{t("day")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_ultah}
                  </Text>
                </View>
                <View className="w-1/3 mb-3">
                  <Text className="text-gray-600">{t("month")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_bulan}
                  </Text>
                </View>
                <View className="w-1/3 mb-3">
                  <Text className="text-gray-600">{t("year")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.angka_tahun_lahir}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">
                {t("pythagorean_analysis")}
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("expression")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.expression}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("soul_urge")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.soulUrge}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("personality")}</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.personality}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">
                {t("challenge_numbers")}
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("challenge")} 1</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.challenge1}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("challenge")} 2</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.challenge2}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("challenge")} 3</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.challenge3}
                  </Text>
                </View>
                <View className="w-1/2 mb-3">
                  <Text className="text-gray-600">{t("challenge")} 4</Text>
                  <Text className="text-2xl font-bold">
                    {patterns.challenge4}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">
                {t("current_year_analysis")}
              </Text>
              <View className="bg-purple-50 p-4 rounded-lg">
                <Text className="text-gray-600">
                  {t("personal_year_number")}
                </Text>
                <Text className="text-3xl font-bold text-purple-800">
                  {patterns.personalYear}
                </Text>
                <Text className="text-gray-600 mt-2">
                  {t(`personal_year_${patterns.personalYear}_desc`)}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View className="bg-purple-100 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold text-purple-800 mb-2">
            {t("premium_analysis")}
          </Text>
          <Text className="text-gray-700 mb-3">
            {t("premium_analysis_desc")}
          </Text>
          <TouchableOpacity className="bg-purple-600 py-2 px-4 rounded-md items-center">
            <Text className="text-white font-medium">
              {t("upgrade_to_premium")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-purple-800">
              {t("parameter_detail")}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-purple-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">{t("close")}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <Text className="text-base leading-6 text-gray-800">
              {selectedParameter}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
