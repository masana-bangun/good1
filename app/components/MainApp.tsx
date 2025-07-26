import React, { useState, createContext, useContext } from "react";
import { View, SafeAreaView, Platform, StatusBar } from "react-native";
import TabBar from "./TabBar";
import HomeScreen from "./HomeScreen";
import NumerologyForm from "./NumerologyForm";
import NumerologyResults from "./NumerologyResults";
import NameGenerator from "./NameGenerator";
import CompatibilityChecker from "./CompatibilityChecker";
import MembershipPlans from "./MembershipPlans";
import AccountScreen from "./AccountScreen";
import LifeReport from "./LifeReport";

// Translation context
const TranslationContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
  t: (key: string) => key,
});

export const useTranslation = () => useContext(TranslationContext);

// Translation data
const translations = {
  en: {
    // Home Screen
    welcome_back: "Welcome back,",
    all_premium_features_unlocked: "All Premium Features Unlocked!",
    quick_actions: "Quick Actions",
    name_analysis: "Name Analysis",
    love_couple: "Love Couple",
    dictio_name: "DictioName",
    generator_name_optimizer: "Generator Name Optimizer",
    lifeplan_report: "LifePlan Report",
    successful_people: "Successful people's",
    synchronize: "Synchronize",
    coherence: "Coherence",
    momentum: "Momentum",
    discover_power_names:
      "Discover the power of names through our comprehensive analysis tools. Want to have values like them? >> Learn More",
    earn_free_credits: "Earn Free Credits",
    share_with_friends: "Share with friends to unlock premium features",
    share_now: "Share Now",
    // Tab Bar
    home: "Home",
    analyze: "Analyze",
    names: "Names",
    match: "Match",
    account: "Account",
    // Common
    language: "Language",
    hara_1_desc:
      "🤠Positive in independence and self-reliance, new (beginning) developments, usually initiated by a new thing/job/project, a relocation, career change, or similar major step. Independence and strength, likely to be an individualist. Potential to have authority/resistance to dominant figures. More profitable business opportunities for personal but less suitable/profitable if done in a cooperative manner. There will be a lot of potential for good fortune in finances and adventures. Tend to get support from several sources. In the long phase you will be financially stable, strong, and successful in business",
    hara_2_desc:
      "🤠Positive in independence and self-reliance, new (beginning) developments, usually initiated by a new thing/job/project, a relocation, career change, or similar major step. Independence and strength, likely to be an individualist. Potential to have authority/resistance to dominant figures. More profitable business opportunities for personal but less suitable/profitable if done in a cooperative manner. There will be a lot of potential for good fortune in finances and adventures. Tend to get support from several sources. In the long phase you will be financially stable, strong, and successful in business",
    hara_3_desc:
      "💡Potential for ideas and creativity, easygoing and enjoyment of all things that need to be controlled. In the short phase potential for ACTION of creativity and originality, increased self-expression. This is Capital. Full of inspiration and motivation and ideas of life. When socializing, you will bring comfort, Potential to experience a life full of travel and inspire others. Will increase other pleasures of the material world / Money",
    hara_4_desc:
      "✔️Potential for career and relationships to strengthen, moving forward, responsibilities completed practically. In the short phase, there is the potential for promising business opportunities, the disappearance of difficulties with authorities, especially institutions and their regulations. Finances that are on the rise. Strength and determination can help you realize your plans. In the long phase, you have the potential to experience improvements in career and finances. You can also expect a strengthening relationship, especially with someone close to you",
    hara_5_desc:
      "❌Potential bad tendencies, unlucky, tend to be easily fooled, betrayal, misfortune, illness, end badly. The name must be changed or added. Easily fooled by people, potentially often experiencing bad luck and bad things, on average negative things that happen in other ending code parameters also occur in this number. So you should be careful if your name contains Ending Code. In addition, it has the potential to be easily fooled by people, betrayed by friends, and others",
    hara_6_desc:
      "🏡Potential to develop in terms of family, social, helping young and old, improvement, healing, progress. In the short phase there is an opportunity to involve yourself in the family, please and help various generations. Potential to experience interest in environmental and political issues and also has the potential to make you a more responsible person. In the long phase has the potential to get prospects that seem very good. In all areas of your life there is the potential to experience improvement, healing and progress",
    hara_7_desc:
      "😠Potential financial problems, emotional conflicts (causing misfortune), fickleness, nervous disorders, abnormal cells. Short phase: in life will experience difficulties in allocating and, experiencing financial problems. Long phase: High potential for cancer and tumors and emotional conflicts (example love triangle)",
    hara_8_desc:
      "🤕Potential for unpleasant travel, must be careful not to get hurt, get sick (long recovery), misdiagnosis, end something badly (serious impact)",
    hara_9_desc:
      "🤧Potential financial disruption, drug disruption or drug insertion, unhealthy/experiencing illnesses such as viral outbreaks and ending badly (anything) because of what other parties do",
    hara_11_desc:
      "🤢Potential for business failure, being a scapegoat, psychological pressure or betrayal, complications, separation due to different principles, health problems",
    hara_13_desc:
      "😳Potential disappointment with household or business results (bankruptcy, loss), betrayal by close people, and the inability to get maximum and optimal results from all efforts undertaken",
    expression_1_desc:
      "You are destined to be a leader in your field of work. You should learn to rely on your own abilities, show courage and determination and avoid the negative aspects such as egotism and selfishness. People will look upon you for guidance and direction from time to time and you should be prepared for it. You were born to become an outstanding person in a line of work in this life",
    expression_2_desc:
      "Cooperation, diplomacy and peaceful coexistence are the goals of life. The development takes place in partnerships rather than independently. You may called upon for arbitration and peacemaking from time to time. Cooperation, sharing and association will bring you success. If negative aspects can be avoided you should be known as a peacemaker",
    expression_3_desc:
      "Popularity, happiness for the self and others, love, romance and material possessions are the salient features of life, provided a positive use of talent is made. You are joy giver to others and you were born to make others happy. Through imagination, sincerity and cheerfulness you are destined to show light to humanity on some line of creativity",
    expression_4_desc:
      "You are destined to take the responsibility and others will depend on you for help and support. Construction, organisation and management will keep you occupied for the rest of your life. Many a time the problems of relatives will come to you, and limitations in life may irritate you. Through patience, determination, order, sincerity, honesty and service you will provide security for others and yourself if negative aspects are overcome",
    expression_5_desc:
      "You were born to deal with people in general and to promote freedom and progress. Change, new circumstances, new apporaches, variety, versatility and unexpected happenings will be the salient features of your life. You may find it difficult to work on the same lines or with the same people for long. You will teach people to achieve liberty and live happily, if negative is controlled",
    expression_6_desc:
      "You came in this world to serve humanity with love, duty, responsibility and charitable deeds. You will be known as a dependable person. You should be generous to relatives but not to the pointof sacrifice. People will knock at your door for help throughout your life and the mor you do for others, the more love, comfort and money will surround you. For your own progress you need beauty, companionship, love and harmony. You are capable of exploring the philosophy of life and achieving spiritual heights",
    expression_7_desc:
      "You are destined to search for wisdom or hidden truths in the scientific, criminal, philosophical or religious field. You may find yourself lonely even when in the midst of people and you may be out of the common class. You may go deep into the philosophy of life; experiment, test and demonstrate the facts discovered by others. Popularity, love and respect should come to you for the knowledge attained and you should be known as an educator. Personal business, love and even marriage may be sacrificed on the hard path you are following, but you may get greater satisfaction in finding the truth (more often on the occult or spiritual lines) and educating the people",
    expression_8_desc:
      "Management, organisation and administration should lead you to a position of authority and recognition. You will have to make proper assessment of people and events from time to time, which is not an easy task. If the philosophical faculty is developed and an unprejudiced judgement is made, your reward will be its accomplishment. Money may not always be the lines of develupment in addition to business for which you might be famous",
    expression_9_desc:
      "You are destined to be popular on some line of philanthropic, humanitarian or charitable work. Love of brotherhood and service to mankind will be part of your personality, on the one hand while love, romance, music and art should deeply interest you on the other. Compassion, generosity and understanding the needs of others will make you very popular. Selfishness, personal love and lack of forgiveness can prove detrimental and bring disappointments. Being impersonal and developing universal love can make you a spiritual leader",
    expression_11_desc:
      "Inspiration, spiritual awareness (often latent), intuition and psychic ability can lead to inner happiness and illumination if the negative aspects of all are controlled. You are destined to achieve higher values of life; and family life, material gains, and social status may be easily lost if strictly adhered to. You should overcome sensitivity, nervousness and self-centredness and take material and social life only lightly. You are bestowed with the powers of achieving spiritual heights for yourself and showing light to others. Sometime suffer on account of material loss thereby undergoing repeated disappointments in relations and partnerships",
    expression_22_desc:
      "Capability of handling big projects efficiently is likely to place you in a position of authority on one line of work in the material world at some point of life. You are likely to get significant undertakings in life. But the accomplishment will depend on your checking the desire to take more work than you can handle and keeping the spiritual awareness from interference into practical approach. On the other hand if you are inclined to work on mystic and occult lines you may do a lot of good to others and become famous as a lightgiver",
    time_1_desc:
      "Full of creative ideas, strong-willed, independent, brave, and a fighter. The inherent flaws are stubbornness, dishonesty, a desire to dominate, and selfishness, which leads to a know-it-all attitude. Wisdom is the main focus. Has strong analytical skills. If used correctly, will become a learned person. Usually does not immediately answer YES or NO, will think first. Very detailed in many things. Very strong in creativity and very vigilant. These characteristics will lead to wealth. Good at entertaining and reliable in building relationships. Wealth is usually achieved around the age of 32 to 42. Has leadership skills. The opposite sex is often attracted. Will become better-looking or more beautiful with age - above the 30s and beyond, will look more handsome/beautiful. The negative side is often feeling lonely, feeling like a wanderer. Be careful when analyzing a person or a situation, a wrong analysis will lead to unnecessary problems",
    time_2_desc:
      "Full of peace, humble, friendly, and has a spiritual influence. The inherent flaws are being sensitive and easily hurt, paying too much attention to small things to the point of wasting a lot of time. Skilled and has a pleasant personality, and is talkative. Reliable in work that involves cooperation. Very calm, friendly, and soft-hearted. Always emphasizes neatness, cleanliness, and is very organized. Willing to work hard, very mature in thinking. Usually socializes with older people. Has the ability to direct and complete tasks. The negative side is being willing to listen to others' opinions, but perhaps not to follow them. Stubborn, often triggers bad gossip, and tends to be 'all talk'. Very jealous in matters of love",
    time_3_desc:
      "Full of artistic talent, fighting spirit, has the ability to see 3 timelines. The inherent flaws are wastefulness, loose talk, and difficulty in forgiving. Attractive and far-sighted, but very impatient. Clear and knows what they want and how and where to get it. Very quick to distinguish between good and bad. Can occupy a high position, be rich and prosperous. Has a good life in the eyes of society. Has abilities and talents and is good at taking advantage of a situation. Quick to anger, but also quick to cool down. A beautiful woman, or a handsome man in their youth. The negative side is a tendency to take things lightly and not be firm. Can sometimes be naughty. Sometimes rude when speaking. There are ups and downs in marriage, and if not handled well, it may bring disaster and violence. Usually thinks they are right in whatever they do and say, while others are wrong",
    time_4_desc:
      "Full of responsibility, scientific thinking, honest and loyal. The inherent flaws are stubbornness, a love for debating and a desire to dominate, and a workaholic nature. Intelligent, artistic, and excels in life's tests. Trustworthy and easy to get along with in society. Full of compassion and charismatic. Is naturally a planner and a thinker, thinks before acting. Likes to travel and live a free lifestyle. Has abilities at a very young age. Able to rise quickly after facing life's difficulties. If a woman, she pampers her partner. The negative side is a weakness in accumulating wealth. Must be careful in relationships or marriage, otherwise it will involve unnecessary bad incidents",
    time_5_desc:
      "Full of sexual energy, a love of freedom and change, full of wit and quick actions, able to entertain. The inherent flaws are disloyalty in 'love and marriage', and an inability to control restlessness and dissatisfaction. Has a very strong character. Born with a leadership soul, usually holds a position above many people in terms of work. Has strong instincts in many things. Realistic and a hard worker. Can adapt and adjust to the current situation or circumstances. Despite facing life's obstacles, when faced with financial problems, there is always a way to overcome them. The negative side is if from a poor family, has a stubborn nature. If on the wrong path, tends to go in circles for no good purpose, even tending to lie. Very picky and fussy about many things and issues. Learn not to be like that so people will appreciate you more",
    time_6_desc:
      "Full of balance, selfless, enjoys humanitarian activities, loyal and steadfast in thinking about the welfare of others. The inherent flaws are a love for praise and popularity, and an inability to control oneself in sacrifice. Tenacious, capable of managing wealth and well-being. Very polite and has high taste. Has a good career in the arts, religion, or education. Can become a quite popular figure. Does not easily listen to others, especially superiors, but thinks about and pays attention to subordinates. Takes care of family and close relatives. Family-oriented. The negative side is being arrogant and proud, unwilling to do simple jobs. In terms of relationships, is possessive and always wants to control everyone and everything, but usually will not admit it. Get rid of the desire to dominate so that loved ones will love you more",
    time_7_desc:
      "Full of intelligence, loneliness, mysticism, a personality full of charm. The inherent flaws are difficulty in self-expression, lack of trust in others, excessive self-attention leading to a lack of understanding of the 'partner's' needs. Detailed in handling various matters. Will never forget anyone who has helped. Able to change and turn a situation around. Enjoys pursuing fame and fortune. Reliable in managing the entertainment field. Can become a spiritual figure/religious leader, usually in their 50s and beyond. The negative side is a love for debating, indecisiveness/often changing opinions, and being slow to make decisions. Tends to have problems in marriage. Although good at being grateful, there is a tendency that they themselves may not show gratitude towards others",
    time_8_desc:
      "Full of idealism, materialistic, a trustworthy keeper of secrets. The inherent flaws are a desire to show off power, a lack of humanity, and stubbornness. Almost everyone with Time 8 obtains tragedy as the end result. Quiet, conservative, tends to be passive, but passionate among others. Very responsible, although sometimes feels pressured. Full of virtue and trustworthy. Will not play games with people. Appears tough on the outside, but is actually soft on the inside. The negative side is being short-tempered, a procrastinator, and tending to wait and see. This will often cause missed opportunities. Needs to be better at reading situations. Being too careful will get you nowhere. Be confident in your own views and do things your own way. Sometimes unclear about what they are doing. If on the wrong path, they will become a bully, wanting to dominate, selfish, cruel, and only thinking of their own advancement",
    time_9_desc:
      "Full of humanity, generous, compassionate, and has a spiritual soul. The inherent flaws are being too sensitive, hasty in decision-making, selfish, possessive, intolerant, and even dishonest. Very optimistic and open-minded. Likes to look beautiful/dapper and dress well. Unpretentious, looks tough but is soft on the inside. Very alert and sensitive. Knows when and how to attack and defend. Good at winning people's hearts. Does everything quickly but lacks detail. Quite emotional. Reliable at work. Has big goals and dreams. Whatever is done more often reaps success than not. The negative side is often feeling lonely in old age. There is a high level of greed within. Tends to forget to pay attention to subordinates. Doesn't have many true friends. Lifestyle tends to be materialistic",
    synchronize_desc:
      "The Synchronize value is a parameter that indicates the relationship between one's internal code and external codes, the ability to interact with the environment, and the speed in seizing opportunities. The Synchronize range is 0.05 to 1.0 or 5% to 100%. Successful and accomplished people in all their endeavors, on both small and large scales, have a Synchronize value of 0.8 to 1.0 or 80% to 100%. Synchronize Value: 0.1 / 10%. Your ability to master a field is extremely difficult and slow. In lessons, you need repeated explanations before you can understand even a LITTLE. Socially, you may need to adapt multiple times. If your Synchronize value is at 10%, you are likely a less intelligent person. Synchronize Value: 0.2 / 20% : The potential is nearly the same as the 10% parameter, but at a level that might be slightly easier than the 10% mark. Synchronize Value 0.3 / 30% : Your potential for mastering a field is not very good if your smart potential parameter is also at 30%. While you do socialize, there is a high probability of being ostracized by those you consider friends. For lessons you feel you have understood, it is likely there are errors in your comprehension. Synchronize Value 0.4 / 40% : There is a very high probability that you have the potential to become an errand-runner for your friends. To put it bluntly, you have the potential to willingly sacrifice your self-respect just to have company. In your studies, you still frequently make mistakes in how you understand the lessons. Synchronize Value 0.5 / 50% : In your social life, your friends do not care much about you, even though you have people who are willing to be your friends. Your presence is not particularly desired by them. In your studies, you likely do not care about the subjects you are learning, even those you are supposed to be studying. Synchronize Value 0.6 / 60% : This is your potential in mastering a field, especially in social interactions and friendships. A small portion of people look forward to your presence, but the majority do not seem to care whether you are there or not. In your studies, you are very average and can sometimes understand the material you are learning. Synchronize Value 0.7 / 70% : Your potential for mastering a field is at a safe level if the number is 70%. You have many friends, but you can be selective in choosing them. You have a very good understanding of what is good and what is not, although you sometimes disregard it. In your studies, slowly but surely, you are able to understand what you are learning. Synchronize Value: 0.8 / 80% : There is a very high probability that you will become popular among your friends; your presence is eagerly awaited, and you usually have an extraordinary vibe. However, you are less able to be selective in choosing friends, wanting to befriend everyone with the reasoning that “Friendship is for everyone.” In your studies, you are quite quick to understand the material you are learning. Synchronize Value 0.9 / 90% : Your potential lies in your social life; you are very likely to become famous for your achievements. Many friends rely on you to get things done. You are so intelligent that you can understand any lesson you study with great ease. Unfortunately, you sometimes feel that you are smarter than everyone else, leading you to consider many friends a burden. Synchronize value: 1.0 / 100% : The potential from your achievements and the sensation you create will cause many people around you to admire and wonder about you, giving rise to an aura of authority and charisma that radiates from you. You are incredibly smart and intelligent in understanding any lesson you study. Unfortunately, the potential for selfishness within you is very high, because you often feel you are better than the friends who consider you important, and you prefer to befriend people you consider important",
    coherence_desc:
      "Coherence is a parameter that indicates the structural strength of a person's interrelated internal codes, showing their level of ability and speed in mastering a field of knowledge or skill. The Coherence range is 0.1 – 1.0 or 10% to 100%. People who are successful and accomplished in life, in all their endeavors whether on a small or large scale, have a Coherence value between 0.7 to 1.0, or 70% to 100%",

    // Numerology Results
    hara: "Hara",
    expression: "Expression",
    time: "Time",
    dimensional_analysis: "Dimensional Analysis",
    synchronize_score: "Synchronize Score",
    coherence_value: "Coherence Value",
    synergize_value: "Synergize Value",
    productive_value: "Productive Value",
    momen_sukses_value: "Success Moment Value",
    grafologi_index: "Graphology Index",
    potential_suggestions: "Potential Suggestions",
    advanced_analysis: "Advanced Analysis",
    core_numbers: "Core Numbers",
    character_number: "Character Number",
    expression_number: "Expression Number",
    soul_number: "Soul Number",
    personality_number: "Personality Number",
    number_intensity: "Number Intensity",
    personal_development: "Personal Development",
    self_potential: "Self Potential",
    attitude_number: "Attitude Number",
    growth_number: "Growth Number",
    birth_date_analysis: "Birth Date Analysis",
    day: "Day",
    month: "Month",
    year: "Year",
    pythagorean_analysis: "Pythagorean Analysis",
    soul_urge: "Soul Urge",
    personality: "Personality",
    challenge_numbers: "Challenge Numbers",
    challenge: "Challenge",
    current_year_analysis: "Current Year Analysis",
    personal_year_number: "Personal Year Number",
    premium_analysis: "Premium Analysis",
    upgrade_to_premium: "Upgrade to Premium",
    parameter_detail: "Parameter Detail",
    close: "Close",
    // Numerology Form
    numerology_analysis: "Numerology Analysis",
    basic_analysis: "Basic Analysis",
    advanced_analysis: "Advanced Analysis",
    full_name: "Full Name",
    enter_full_name: "Enter your full name",
    normalized: "Normalized",
    gender: "Gender",
    male: "Male",
    female: "Female",
    birth_date: "Birth Date",
    select_birth_date: "Select Birth Date",
    cancel: "Cancel",
    done: "Done",
    advanced_analysis_features: "Advanced Analysis Features:",
    life_path_number: "• Life Path Number (Hara)",
    expression_number_feature: "• Expression Number",
    soul_urge_number: "• Soul Urge Number",
    personality_number_feature: "• Personality Number",
    maturity_number: "• Maturity Number",
    personal_year_number_feature: "• Personal Year Number",
    analyze: "Analyze",
    // Name Generator
    personal_name_optimizer: "Personal Name Optimizer",
    baby_name_generator: "Baby Name Generator",
    personal_name: "Personal Name",
    baby_name: "Baby Name",
    generation_mode: "Generation Mode",
    add_one_word: "Add One Word",
    add_some_word: "Add Some Word",
    your_first_name: "Your First Name",
    family_name_optional: "Family Name (Optional)",
    enter_first_name: "Enter your first name",
    enter_family_name: "Enter family name (optional)",
    name_origin: "Name Origin",
    generate_names: "Generate Names",
    advanced_search: "Advanced Search",
    jalankan_lanjut_combi: "Run/Continue Combi",
    suggested_names: "Suggested Names",
    generated_from: "Generated from:",
    no_matching_names: "No matching names found. Try different parameters.",
    // Compatibility Checker
    compatibility_checker: "Compatibility Checker",
    person_1: "Person 1",
    person_2: "Person 2",
    check_compatibility: "Check Compatibility",
    compatibility_results: "Compatibility Results",
    compatibility_areas: "Compatibility Areas",
    detailed_analysis_unlocked: "Detailed Analysis - Unlocked!",
    all_premium_features_available:
      "All premium features are now available for your compatibility analysis.",
    // Life Report
    life_report: "Life Report",
    life_path: "Life Path",
    year_life_report: "100 Year Life Report",
    daily_advice: "Daily Advice",
    daily_advice_calendar: "Daily Advice Calendar",
    select_date: "Select Date",
    monthly_advice_calendar: "Monthly Advice Calendar",
    legend: "Legend:",
    // G1-G9 Descriptions
    g1_desc:
      "Independent and leadership-oriented, with strong initiative and pioneering spirit. Natural born leader with creative abilities.",
    g2_desc:
      "Cooperative and diplomatic, excellent in partnerships and teamwork. Patient and detail-oriented with strong intuitive abilities.",
    g3_desc:
      "Creative and expressive, with strong communication skills. Artistic talents and optimistic outlook on life.",
    g4_desc:
      "Practical and organized, with strong work ethic and attention to detail. Reliable and systematic in approach.",
    g5_desc:
      "Freedom-loving and adventurous, with strong desire for variety and change. Dynamic and versatile personality.",
    g6_desc:
      "Nurturing and responsible, with strong family orientation. Caring and supportive with healing abilities.",
    g7_desc:
      "Analytical and introspective, with strong spiritual inclinations. Researcher and seeker of truth and wisdom.",
    g8_desc:
      "Ambitious and business-minded, with strong material focus. Natural organizer with executive abilities.",
    g9_desc:
      "Humanitarian and generous, with strong desire to serve others. Compassionate and understanding with universal outlook.",
  },
  fr: {
    // Home Screen
    welcome_back: "Bon retour,",
    all_premium_features_unlocked:
      "Toutes les fonctionnalités Premium débloquées !",
    quick_actions: "Actions rapides",
    name_analysis: "Analyse de nom",
    love_couple: "Couple amoureux",
    dictio_name: "DictioNom",
    generator_name_optimizer: "Optimiseur de générateur de noms",
    lifeplan_report: "Rapport de plan de vie",
    successful_people: "Personnes à succès",
    synchronize: "Synchroniser",
    coherence: "Cohérence",
    momentum: "Élan",
    discover_power_names:
      "Découvrez le pouvoir des noms grâce à nos outils d'analyse complets. Vous voulez avoir des valeurs comme eux ? >> En savoir plus",
    earn_free_credits: "Gagnez des crédits gratuits",
    share_with_friends:
      "Partagez avec des amis pour débloquer les fonctionnalités premium",
    share_now: "Partager maintenant",
    // Tab Bar
    home: "Accueil",
    analyze: "Analyser",
    names: "Noms",
    match: "Correspondance",
    account: "Compte",
    // Common
    language: "Langue",
    hara_1_desc:
      "🤝Des liens et une coopération renforcés, favorisés par une relation solide et durable. À court terme, on observe un potentiel de nouvelles relations professionnelles ou relationnelles, une plus grande reconnaissance pour la vie, une sensibilité accrue aux instincts de la vie et des affaires, une volonté de partenariat, une facilité de négociation et une sagesse accrues. À long terme, des relations harmonieuses sont également porteuses de succès, de finances et d'économies saines",
    hara_2_desc:
      "🤝Des liens et une coopération renforcés, favorisés par une relation solide et durable. À court terme, on observe un potentiel de nouvelles relations professionnelles ou relationnelles, une plus grande reconnaissance pour la vie, une sensibilité accrue aux instincts de la vie et des affaires, une volonté de partenariat, une facilité de négociation et une sagesse accrues. À long terme, des relations harmonieuses sont également porteuses de succès, de finances et d'économies saines",
    hara_3_desc:
      "💡Potentiel d'idées et de créativité, facilité et plaisir à maîtriser tout ce qui nécessite d'être maîtrisé. À court terme, potentiel d'ACTION, de créativité et d'originalité, expression personnelle accrue. C'est le Capital. Plein d'inspiration, de motivation et d'idées de vie. En socialisant, vous apporterez du réconfort, vous aurez le potentiel de vivre une vie riche en voyages et d'inspirer les autres. Vous augmenterez les autres plaisirs du monde matériel / Argent",
    hara_4_desc:
      "✔️Potentiel de renforcement professionnel et relationnel, d'avancement et de responsabilités pratiquement accomplies. À court terme, opportunités commerciales prometteuses, résolution des difficultés avec les autorités, notamment les institutions et leurs réglementations, et perspectives financières en hausse. Force et détermination peuvent vous aider à concrétiser vos projets. À long terme, vous avez le potentiel d'améliorer votre carrière et vos finances. Vous pouvez également vous attendre à un renforcement relationnel, notamment avec un proche",
    hara_5_desc:
      "❌ Tous les mauvais potentiels : malchance, facile à tromper, trahison, désastre, maladie, fin malheureuse. Toute la malchance et les mauvaises choses du harani précédent se retrouvent dans celui-ci. Soyez donc prudent si vous avez un harani 5, que cela vous plaise ou non. Les problèmes de confiance sont dangereux. On a tendance à envisager de tromper son amant par tentation. Tomber dans un piège peut entraîner la perte de tout ce qui compte vraiment pour nous. Le nom doit être modifié ou ajouté. Facilement dupé, mourir d'une maladie chronique, mourir d'un empoisonnement sans que l'empoisonneur ne soit jamais découvert, mourir d'un accident, être trahi par son propre ami, et le summum est le risque d'être tué par un ami et non par un adversaire (son propre petit ami, son propre frère ou sa propre sœur). Ce harani est le pire de tous les nombres de codes de fin. Il peut souvent être associé à la malchance et aux mauvaises choses. En moyenne, les effets négatifs des autres paramètres de codes de fin se produisent également dans ce nombre. Soyez donc prudent si votre nom contient un code de fin. De plus, vous risquez d'être facilement trompé, trahi par vos amis et d'autres personnes",
    hara_6_desc:
      "🏡Potentiel de développement familial et social, d'entraide entre jeunes et moins jeunes, d'amélioration, de guérison et de progrès. À court terme, possibilité de s'impliquer dans la famille, faire plaisir et aider les différentes générations. Intérêt pour les questions environnementales et politiques, et potentiel de devenir une personne plus responsable. À long terme, potentiel d'avenir prometteur. Amélioration, guérison et progrès dans tous les domaines de la vie",
    hara_7_desc:
      "😠Problèmes financiers potentiels, conflits émotionnels (causant des malheurs), inconstance, troubles nerveux, cellules anormales. Phase courte : difficultés à gérer ses dépenses et problèmes financiers. Phase longue : fort risque de cancer, de tumeurs et de conflits émotionnels (exemple : triangle amoureux)",
    hara_8_desc:
      "🤕Possibilité de voyage désagréable, il faut faire attention à ne pas se blesser, tomber malade (longue convalescence), mauvais diagnostic, mauvaise fin de quelque chose (impact grave)",
    hara_9_desc:
      "🤧Perturbation financière potentielle, ou perturbation de la consommation de médicaments ou insertion de médicaments, ou maladies malsaines/vivantes telles que des épidémies virales et fin mal (n'importe quoi) à cause de ce que font les autres parties",
    hara_11_desc:
      "🤢Potentiel d'échec commercial, ou bouc émissaire, ou pression psychologique ou trahison, ou complications, ou séparation due à des principes différents, ou problèmes de santé",
    hara_13_desc:
      "😳Potentiel de déception avec les résultats du ménage ou de l'entreprise (faillite, perte), trahison de la part de proches et incapacité à obtenir des résultats maximaux et optimaux de tous les efforts entrepris",
    expression_1_desc:
      "Vous êtes destiné à devenir un leader dans votre domaine professionnel. Apprenez à compter sur vos propres capacités, à faire preuve de courage et de détermination, et à éviter les aspects négatifs tels que l'égocentrisme. On vous demandera conseil de temps à autre, et vous devez vous y préparer. Vous êtes né pour devenir une personne exceptionnelle dans un domaine professionnel",
    expression_2_desc:
      "La coopération, la diplomatie et la coexistence pacifique sont les objectifs de la vie. Le développement se fait en partenariat plutôt qu'en autonomie. Vous pourrez être amené à arbitrer et à rétablir la paix de temps à autre. La coopération, le partage et l'association vous mèneront au succès. Si les aspects négatifs peuvent être évités, vous serez reconnu comme un artisan de paix",
    expression_3_desc:
      "La popularité, le bonheur personnel et celui des autres, l'amour, le romantisme et les biens matériels sont les traits saillants de la vie, à condition d'utiliser ses talents à bon escient. Vous êtes source de joie pour les autres et vous êtes né pour les rendre heureux. Par votre imagination, votre sincérité et votre bonne humeur, vous êtes destiné à éclairer l'humanité sur un plan créatif",
    expression_4_desc:
      "Vous êtes destiné à assumer des responsabilités, et les autres compteront sur vous pour leur aide et leur soutien. La construction, l'organisation et la gestion vous occuperont toute votre vie. Les problèmes familiaux vous reviendront souvent à l'esprit, et les contraintes de la vie pourraient vous irriter. Par la patience, la détermination, l'ordre, la sincérité, l'honnêteté et le sens du service, vous assurerez la sécurité des autres et la vôtre si vous surmontez les difficultés",
    expression_5_desc:
      "Vous êtes né pour interagir avec les autres et promouvoir la « liberté » et le « progrès ». Le changement, les nouvelles circonstances, les nouvelles approches, la diversité, la polyvalence et les imprévus seront les traits saillants de votre vie. Vous aurez peut-être du mal à travailler longtemps sur les mêmes bases ou avec les mêmes personnes. Vous apprendrez aux autres à atteindre la « liberté » et à vivre heureux, si le négatif est maîtrisé",
    expression_6_desc:
      "Vous êtes venu au monde pour servir l'humanité avec amour, sens du devoir, responsabilité et charité. Vous serez reconnu comme une personne fiable. Soyez généreux envers vos proches, sans toutefois aller jusqu'au sacrifice. On frappera à votre porte pour vous demander de l'aide tout au long de votre vie, et plus vous agirez pour les autres, plus vous serez entouré d'amour, de confort et d'argent. Pour votre propre progrès, vous avez besoin de beauté, de compagnie, d'amour et d'harmonie. Vous êtes capable d'explorer la philosophie de la vie et d'atteindre des sommets spirituels",
    expression_7_desc:
      "You are destined to search for wisdom or hidden truths in the scientific, criminal, philosophical or religious field. You may find yourself lonely even when in the midst of people and you may be out of the common class. You may go deep into the philosophy of life; experiment, test and demonstrate the facts discovered by others. Popularity, love and respect should come to you for the knowledge attained and you should be known as an educator. Personal business, love and even marriage may be sacrificed on the hard path you are following, but you may get greater satisfaction in finding the truth (more often on the occult or spiritual lines) and educating the people",
    expression_8_desc:
      "Management, organisation and administration should lead you to a position of authority and recognition. You will have to make proper assessment of people and events from time to time, which is not an easy task. If the philosophical faculty is developed and an unprejudiced judgement is made, your reward will be its accomplishment. Money may not always be the lines of develupment in addition to business for which you might be famous",
    expression_9_desc:
      "Vous êtes destiné à devenir populaire dans le domaine philanthropique, humanitaire ou caritatif. L'amour de la fraternité et le service à l'humanité feront partie intégrante de votre personnalité, tandis que l'amour, le romantisme, la musique et l'art devraient vous intéresser profondément. La compassion, la générosité et la compréhension des besoins d'autrui vous rendront très populaire. L'égoïsme, l'amour personnel et le manque de pardon peuvent s'avérer néfastes et engendrer des déceptions. Être impersonnel et développer un amour universel peut faire de vous un leader spirituel",
    expression_11_desc:
      "L'inspiration, la conscience spirituelle (souvent latente), l'intuition et les capacités psychiques peuvent conduire au bonheur intérieur et à l'illumination si les aspects négatifs sont maîtrisés. Vous êtes destiné à atteindre des valeurs plus élevées ; la vie de famille, les gains matériels et le statut social peuvent facilement être perdus si vous vous y conformez strictement. Vous devez surmonter la sensibilité, la nervosité et l'égocentrisme et prendre la vie matérielle et sociale à la légère. Vous êtes doté du pouvoir d'atteindre des sommets spirituels et d'éclairer les autres. Il vous arrive de souffrir de pertes matérielles, ce qui entraîne des déceptions répétées dans vos relations et vos partenariats",
    expression_22_desc:
      "La capacité à gérer efficacement de grands projets vous placera probablement en position d'autorité dans un domaine précis du monde matériel à un moment donné de votre vie. Vous aurez probablement des projets importants. Mais votre réussite dépendra de votre capacité à maîtriser votre désir de « prendre plus de travail que vous ne pouvez en gérer » et à empêcher votre conscience spirituelle d'interférer avec votre approche pratique. En revanche, si vous êtes enclin à travailler dans des domaines mystiques et occultes, vous pourriez faire beaucoup de bien aux autres et devenir un célèbre dispensateur de lumière",
    time_1_desc:
      "Plein d'idées créatives, volontaire, indépendant, courageux et combatif. Les défauts inhérents sont l'entêtement, la malhonnêteté, le désir de dominer et l'égoïsme, ce qui conduit à une attitude de je-sais-tout. La sagesse est l'objectif principal. Possède de solides compétences analytiques. S'il est utilisé correctement, il deviendra une personne instruite. Ne répond généralement pas immédiatement par OUI ou NON, il réfléchira d'abord. Très détaillé dans de nombreux domaines. Très fort en créativité et très vigilant. Ces caractéristiques mèneront à la richesse. Doué pour divertir et fiable pour nouer des relations. La richesse est généralement atteinte vers l'âge de 32 à 42 ans. Possède des compétences en leadership. Le sexe opposé est souvent attiré. Deviendra plus beau/belle avec l'âge - au-delà de la trentaine, il/elle paraîtra plus séduisant(e). Le côté négatif est le sentiment fréquent de solitude, le sentiment d'être un vagabond. Soyez prudent lors de l'analyse d'une personne ou d'une situation, une mauvaise analyse entraînera des problèmes inutiles",
    time_2_desc:
      "Plein de paix, humble, amical et doté d'une influence spirituelle. Les défauts inhérents sont la sensibilité et la facilité à être blessé, le fait d'accorder trop d'attention aux petites choses au point de perdre beaucoup de temps. Compétent et doté d'une personnalité agréable, et bavard. Fiable dans le travail qui implique la coopération. Très calme, amical et au cœur tendre. Met toujours l'accent sur la propreté, l'hygiène et est très organisé. Prêt à travailler dur, très mature dans sa pensée. Fréquente généralement des personnes plus âgées. A la capacité de diriger et d'accomplir des tâches. Le côté négatif est sa volonté d'écouter les opinions des autres, mais peut-être pas de les suivre. Têtu, déclenche souvent des commérages et a tendance à n'être 'que des paroles'. Très jaloux en amour",
    time_3_desc:
      "Plein de talent artistique, d'esprit combatif, a la capacité de voir 3 temporalités. Les défauts inhérents sont le gaspillage, les paroles en l'air et la difficulté à pardonner. Attrayant et prévoyant, mais très impatient. Clair et sait ce qu'il veut, et comment et où l'obtenir. Très rapide pour distinguer le bien du mal. Peut occuper une position élevée, être riche et prospère. A une bonne vie aux yeux de la société. A des capacités et des talents et sait tirer parti d'une situation. Prompt à la colère, mais se calme aussi rapidement. Une belle femme, ou un bel homme dans sa jeunesse. Le côté négatif est une tendance à prendre les choses à la légère et à ne pas être ferme. Peut parfois être espiègle. Parfois grossier en parlant. Il y a des hauts et des bas dans le mariage, et s'il n'est pas bien géré, cela peut entraîner un désastre et de la violence. Pense généralement avoir raison dans tout ce qu'il fait et dit, tandis que les autres ont tort",
    time_4_desc:
      "Plein de responsabilité, de pensée scientifique, honnête et loyal. Les défauts inhérents sont l'entêtement, l'amour du débat et le désir de dominer, ainsi qu'une nature de bourreau de travail. Intelligent, artistique et excelle dans les épreuves de la vie. Digne de confiance et facile à vivre en société. Plein de compassion et charismatique. Est naturellement un planificateur et un penseur, réfléchit avant d'agir. Aime voyager et vivre un style de vie libre. A des capacités dès son plus jeune âge. Capable de se relever rapidement après avoir affronté les difficultés de la vie. Si c'est une femme, elle gâte son partenaire. Le côté négatif est une faiblesse dans l'accumulation de richesse. Doit être prudent dans les relations ou le mariage, sinon cela impliquera des incidents fâcheux et inutiles",
    time_5_desc:
      "Plein d'énergie sexuelle, un amour de la liberté et du changement, plein d'esprit et d'actions rapides, capable de divertir. Les défauts inhérents sont l'infidélité en 'amour et mariage', et une incapacité à contrôler l'agitation et l'insatisfaction. A un caractère très fort. Né avec une âme de leader, occupe généralement une position au-dessus de nombreuses personnes au travail. A de forts instincts dans de nombreux domaines. Réaliste et travailleur acharné. Peut s'adapter et s'ajuster à la situation ou aux circonstances actuelles. Malgré les obstacles de la vie, face à des problèmes financiers, il y a toujours un moyen de les surmonter. Le côté négatif est que s'il vient d'une famille pauvre, il a une nature têtue. S'il est sur la mauvaise voie, il a tendance à tourner en rond sans but valable, allant même jusqu'à mentir. Très pointilleux et exigeant sur de nombreuses choses et questions. Apprenez à ne pas être comme ça pour que les gens vous apprécient davantage",
    time_6_desc:
      "Plein d'équilibre, altruiste, aime les activités humanitaires, loyal et constant dans la pensée du bien-être des autres. Les défauts inhérents sont l'amour des louanges et de la popularité, et une incapacité à se contrôler dans le sacrifice. Tenace, capable de gérer la richesse et le bien-être. Très poli et de bon goût. A une bonne carrière dans les arts, la religion ou l'éducation. Peut devenir une figure assez populaire. N'écoute pas facilement les autres, surtout les supérieurs, mais pense et fait attention aux subordonnés. Prend soin de sa famille et de ses proches. Orienté vers la famille. Le côté négatif est d'être arrogant et fier, ne voulant pas faire de travaux simples. En matière de relations, est possessif et veut toujours tout contrôler et tout le monde, mais ne l'admettra généralement pas. Débarrassez-vous du désir de dominer pour que vos proches vous aiment davantage",
    time_7_desc:
      "Plein d'intelligence, de solitude, de mysticisme, une personnalité pleine de charme. Les défauts inhérents sont la difficulté à s'exprimer, le manque de confiance en autrui, une attention excessive à soi-même menant à un manque de compréhension des besoins du 'partenaire'. Détaillé dans la gestion de diverses affaires. N'oubliera jamais quiconque l'a aidé. Capable de changer et de renverser une situation. Aime poursuivre la gloire et la fortune. Fiable dans la gestion du domaine du divertissement. Peut devenir une figure spirituelle/un chef religieux, généralement dans la cinquantaine et au-delà. Le côté négatif est l'amour du débat, l'indécision/le changement frequent d'avis, et la lenteur à prendre des décisions. A tendance à avoir des problèmes de mariage. Bien que doué pour la gratitude, il y a une tendance à ce qu'il ne montre pas lui-même sa gratitude envers les autres",
    time_8_desc:
      "Plein d'idéalisme, matérialiste, un gardien de secrets digne de confiance. Les défauts inhérents sont le désir d'étaler son pouvoir, un manque d'humanité et l'entêtement. Presque tout le monde avec le Temps 8 obtient la tragédie comme résultat final. Silencieux, conservateur, a tendance à être passif, mais passionné parmi les autres. Très responsable, bien que se sentant parfois sous pression. Plein de vertu et digne de confiance. Ne jouera pas avec les gens. Paraît dur à l'extérieur, mais est en réalité doux à l'intérieur. Le côté négatif est d'être colérique, un procrastinateur, et d'avoir tendance à attendre et voir. Cela entraînera souvent des occasions manquées. Doit être meilleur pour lire les situations. Être trop prudent ne vous mènera nulle part. Ayez confiance en vos propres opinions et faites les choses à votre manière. Parfois peu clair sur ce qu'il fait. S'il est sur la mauvaise voie, il deviendra un tyran, voulant dominer, égoïste, cruel, et ne pensant qu'à son propre avancement",
    time_9_desc:
      "Plein d'humanité, généreux, compatissant et doté d'une âme spirituelle. Les défauts inhérents sont d'être trop sensible, hâtif dans la prise de décision, égoïste, possessif, intolérant et même malhonnête. Très optimiste et ouvert d'esprit. Aime paraître beau/élégant et bien s'habiller. Sans prétention, a l'air dur mais est doux à l'intérieur. Très alerte et sensible. Sait quand et comment attaquer et se défendre. Doué pour gagner le cœur des gens. Fait tout rapidement mais manque de détails. Assez émotif. Fiable au travail. A de grands objectifs et de grands rêves. Quoi qu'il fasse, il récolte plus souvent le succès que l'échec. Le côté négatif est de se sentir souvent seul dans la vieillesse. Il y a un haut niveau d'avidité en lui. A tendance à oublier de prêter attention à ses subordonnés. N'a pas beaucoup de vrais amis. Le style de vie a tendance à être matérialiste",
    synchronize_desc:
      "La valeur de Synchronisation est un paramètre qui indique la relation entre le code interne d'une personne et les codes externes, la capacité d'interagir avec l'environnement et la vitesse à saisir les opportunités. La plage de Synchronisation va de 0,05 à 1,0 ou de 5 % à 100 %. Les personnes qui réussissent et accomplissent des choses dans toutes leurs entreprises, à petite et grande échelle, ont une valeur de Synchronisation de 0,8 à 1,0 ou de 80 % à 100 %. Valeur de Synchronisation 0,1 / 10 % : Votre capacité à maîtriser un domaine est extrêmement difficile et lente. Pendant les leçons, vous avez besoin d'explications répétées avant de pouvoir comprendre ne serait-ce qu'un PEU. Socialement, vous pourriez avoir besoin de vous adapter plusieurs fois. Si votre valeur de Synchronisation est de 10 %, vous êtes probablement une personne moins intelligente. Valeur de Synchronisation 0,2 / 20 % : Le potentiel est presque le même que celui du paramètre de 10 %, mais à un niveau qui pourrait être légèrement plus facile que celui de 10 %. Valeur de Synchronisation 0,3 / 30 % : Votre potentiel pour maîtriser un domaine n'est pas très bon si votre paramètre de potentiel intellectuel est également à 30 %. Bien que vous socialisiez, il y a une forte probabilité que vous soyez ostracisé(e) par ceux que vous considérez comme des amis. Pour les leçons que vous pensez avoir comprises, il est probable qu'il y ait des erreurs dans votre compréhension. Valeur de Synchronisation 0,4 / 40 % : Il y a une très forte probabilité que vous ayez le potentiel de devenir le commissionnaire de vos amis. Pour le dire crûment, vous avez le potentiel de sacrifier volontairement votre amour-propre juste pour avoir de la compagnie. Dans vos études, vous faites encore fréquemment des erreurs dans votre manière de comprendre les leçons. Valeur de Synchronisation 0,5 / 50 % : Dans votre vie sociale, vos amis ne se soucient pas beaucoup de vous, même si vous avez des gens qui veulent bien être vos amis. Votre présence n'est pas particulièrement désirée par eux. Dans vos études, il est probable que vous ne vous souciez pas des matières que vous apprenez, même celles que vous êtes censé(e) étudier. Valeur de Synchronisation 0,6 / 60 % : Ceci est votre potentiel pour maîtriser un domaine, en particulier dans les interactions sociales et les amitiés. Une petite partie des gens attend votre présence avec impatience, mais la majorité ne semble pas se soucier que vous soyez là ou non. Dans vos études, vous êtes très moyen(ne) et pouvez parfois comprendre la matière que vous apprenez. Valeur de Synchronisation 0,7 / 70 % : Votre potentiel pour maîtriser un domaine est à un niveau sûr si le chiffre est de 70 %. Vous avez beaucoup d'amis, mais vous pouvez être sélectif(ve) en les choisissant. Vous comprenez très bien ce qui est bon et ce qui ne l'est pas, bien que vous l'ignoriez parfois. Dans vos études, lentement mais sûrement, vous êtes capable de comprendre ce que vous apprenez. Valeur de Synchronisation 0,8 / 80 % : Il y a une très forte probabilité que vous deveniez populaire parmi vos amis ; votre présence est attendue avec impatience, et vous avez généralement une aura extraordinaire. Cependant, vous êtes moins capable d'être sélectif(ve) dans le choix de vos amis, voulant vous lier d'amitié avec tout le monde avec le raisonnement que « L'amitié, c'est pour tout le monde ». Dans vos études, vous êtes assez rapide pour comprendre la matière que vous apprenez.  Valeur de Synchronisation 0,9 / 90 % : Votre potentiel réside dans votre vie sociale ; il est très probable que vous deveniez célèbre pour vos réussites. Beaucoup d'amis comptent sur vous pour faire avancer les choses. Vous êtes si intelligent(e) que vous pouvez comprendre n'importe quelle leçon que vous étudiez avec une grande facilité. Malheureusement, vous avez parfois l'impression d'être plus intelligent(e) que tout le monde, ce qui vous amène à considérer de nombreux amis comme un fardeau. Valeur de Synchronisation 1,0 / 100 % : Le potentiel de vos réussites et la sensation que vous créez amèneront de nombreuses personnes autour de vous à vous admirer et à s'interroger sur vous, donnant naissance à une aura d'autorité et de charisme qui émane de vous. Vous êtes incroyablement intelligent(e) pour comprendre n'importe quelle leçon que vous étudiez. Malheureusement, le potentiel d'égoïsme en vous est très élevé, car vous avez souvent l'impression d'être meilleur(e) que les amis qui vous jugent important(e), et vous préférez vous lier d'amitié avec les personnes que vous jugez importantes",
    coherence_desc:
      "La Cohérence est un paramètre qui indique la force structurelle des codes internes interconnectés d'une personne, démontrant son niveau de capacité et de rapidité à maîtriser un domaine de connaissance ou une compétence. La plage de Cohérence va de 0,1 à 1,0, soit de 10 % à 100 %. Les personnes qui réussissent et s'accomplissent dans la vie, dans toutes leurs entreprises, qu'elles soient à petite ou grande échelle, ont une valeur de Cohérence comprise entre 0,7 et 1,0, soit de 70 % à 100 %",
    // Numerology Results
    hara: "Hara",
    expression: "Expression",
    time: "Temps",
    dimensional_analysis: "Analyse Dimensionnelle",
    synchronize_score: "Score de Synchronisation",
    coherence_value: "Valeur de Cohérence",
    synergize_value: "Valeur de Synergie",
    productive_value: "Valeur Productive",
    momen_sukses_value: "Valeur du Moment de Succès",
    grafologi_index: "Index Graphologique",
    potential_suggestions: "Suggestions Potentielles",
    advanced_analysis: "Analyse Avancée",
    core_numbers: "Nombres Fondamentaux",
    character_number: "Nombre de Caractère",
    expression_number: "Nombre d'Expression",
    soul_number: "Nombre d'Âme",
    personality_number: "Nombre de Personnalité",
    number_intensity: "Intensité des Nombres",
    personal_development: "Développement Personnel",
    self_potential: "Potentiel Personnel",
    attitude_number: "Nombre d'Attitude",
    growth_number: "Nombre de Croissance",
    birth_date_analysis: "Analyse de la Date de Naissance",
    day: "Jour",
    month: "Mois",
    year: "Année",
    pythagorean_analysis: "Analyse Pythagoricienne",
    soul_urge: "Élan de l'Âme",
    personality: "Personnalité",
    challenge_numbers: "Nombres de Défi",
    challenge: "Défi",
    current_year_analysis: "Analyse de l'Année Actuelle",
    personal_year_number: "Nombre d'Année Personnelle",
    premium_analysis: "Analyse Premium",
    upgrade_to_premium: "Passer au Premium",
    parameter_detail: "Détail du Paramètre",
    close: "Fermer",
    // Numerology Form
    numerology_analysis: "Analyse Numérologique",
    basic_analysis: "Analyse de Base",
    advanced_analysis: "Analyse Avancée",
    full_name: "Nom Complet",
    enter_full_name: "Entrez votre nom complet",
    normalized: "Normalisé",
    gender: "Genre",
    male: "Homme",
    female: "Femme",
    birth_date: "Date de Naissance",
    select_birth_date: "Sélectionner la Date de Naissance",
    cancel: "Annuler",
    done: "Terminé",
    advanced_analysis_features: "Fonctionnalités d'Analyse Avancée :",
    life_path_number: "• Nombre de Chemin de Vie (Hara)",
    expression_number_feature: "• Nombre d'Expression",
    soul_urge_number: "• Nombre d'Élan de l'Âme",
    personality_number_feature: "• Nombre de Personnalité",
    maturity_number: "• Nombre de Maturité",
    personal_year_number_feature: "• Nombre d'Année Personnelle",
    analyze: "Analyser",
    // Name Generator
    personal_name_optimizer: "Optimiseur de Nom Personnel",
    baby_name_generator: "Générateur de Nom de Bébé",
    personal_name: "Nom Personnel",
    baby_name: "Nom de Bébé",
    generation_mode: "Mode de Génération",
    add_one_word: "Ajouter Un Mot",
    add_some_word: "Ajouter Quelques Mots",
    your_first_name: "Votre Prénom",
    family_name_optional: "Nom de Famille (Optionnel)",
    enter_first_name: "Entrez votre prénom",
    enter_family_name: "Entrez le nom de famille (optionnel)",
    name_origin: "Origine du Nom",
    generate_names: "Générer des Noms",
    advanced_search: "Recherche Avancée",
    jalankan_lanjut_combi: "Exécuter/Continuer Combi",
    suggested_names: "Noms Suggérés",
    generated_from: "Généré à partir de :",
    no_matching_names:
      "Aucun nom correspondant trouvé. Essayez différents paramètres.",
    // Compatibility Checker
    compatibility_checker: "Vérificateur de Compatibilité",
    person_1: "Personne 1",
    person_2: "Personne 2",
    check_compatibility: "Vérifier la Compatibilité",
    compatibility_results: "Résultats de Compatibilité",
    compatibility_areas: "Domaines de Compatibilité",
    detailed_analysis_unlocked: "Analyse Détaillée - Débloquée !",
    all_premium_features_available:
      "Toutes les fonctionnalités premium sont maintenant disponibles pour votre analyse de compatibilité.",
    // Life Report
    life_report: "Rapport de Vie",
    life_path: "Chemin de Vie",
    year_life_report: "Rapport de Vie de 100 Ans",
    daily_advice: "Conseil Quotidien",
    daily_advice_calendar: "Calendrier de Conseils Quotidiens",
    select_date: "Sélectionner la Date",
    monthly_advice_calendar: "Calendrier de Conseils Mensuels",
    legend: "Légende :",
    // G1-G9 Descriptions
    g1_desc:
      "Indépendant et orienté leadership, avec une forte initiative et un esprit pionnier. Leader né avec des capacités créatives.",
    g2_desc:
      "Coopératif et diplomatique, excellent dans les partenariats et le travail d'équipe. Patient et attentif aux détails avec de fortes capacités intuitives.",
    g3_desc:
      "Créatif et expressif, avec de fortes compétences en communication. Talents artistiques et vision optimiste de la vie.",
    g4_desc:
      "Pratique et organisé, avec une forte éthique de travail et attention aux détails. Fiable et systématique dans l'approche.",
    g5_desc:
      "Épris de liberté et aventureux, avec un fort désir de variété et de changement. Personnalité dynamique et polyvalente.",
    g6_desc:
      "Nourricier et responsable, avec une forte orientation familiale. Cariñoso et solidaire avec des capacités de guérison.",
    g7_desc:
      "Analytique et introspectif, avec de fortes inclinations spirituelles. Chercheur et quêteur de vérité et de sagesse.",
    g8_desc:
      "Ambitieux et orienté business, avec un fort focus matériel. Organisateur naturel avec des capacités exécutives.",
    g9_desc:
      "Humanitaire et généreux, avec un fort désir de servir les autres. Compatissant et compréhensif avec une vision universelle.",
  },
  es: {
    // Home Screen
    welcome_back: "Bienvenido de vuelta,",
    all_premium_features_unlocked:
      "¡Todas las funciones Premium desbloqueadas!",
    quick_actions: "Acciones rápidas",
    name_analysis: "Análisis de nombres",
    love_couple: "Pareja amorosa",
    dictio_name: "DictioNombre",
    generator_name_optimizer: "Optimizador generador de nombres",
    lifeplan_report: "Informe del plan de vida",
    successful_people: "Personas exitosas",
    synchronize: "Sincronizar",
    coherence: "Coherencia",
    momentum: "Impulso",
    discover_power_names:
      "Descubre el poder de los nombres a través de nuestras herramientas de análisis integral. ¿Quieres tener valores como ellos? >> Aprende más",
    earn_free_credits: "Gana créditos gratis",
    share_with_friends:
      "Comparte con amigos para desbloquear funciones premium",
    share_now: "Compartir ahora",
    // Tab Bar
    home: "Inicio",
    analyze: "Analizar",
    names: "Nombres",
    match: "Coincidencia",
    account: "Cuenta",
    // Common
    language: "Idioma",
    hara_1_desc:
      "🤠Positivo en independencia y autosuficiencia, nuevos desarrollos (inicios), generalmente iniciados por una nueva cosa/trabajo/proyecto, una reubicación, un cambio de carrera o un paso importante similar. Independencia y fortaleza, con probabilidad de individualismo. Potencial para tener autoridad/resistencia a figuras dominantes. Oportunidades de negocio más rentables para el ámbito personal, pero menos adecuadas/rentables si se desarrollan de forma cooperativa. Habrá un gran potencial de buena fortuna en las finanzas y aventuras. Tendrá la posibilidad de recibir apoyo de diversas fuentes. En la fase larga, será financieramente estable, fuerte y exitoso en los negocios",
    hara_2_desc:
      "🤝Mayores conexiones y cooperación, gracias a una buena relación a largo plazo. En la fase corta, existe el potencial de nuevas conexiones en negocios o relaciones, mayor gratitud por la vida, mayor sensibilidad hacia la vida y los instintos empresariales, disposición para colaborar con otros, facilidad para negociar y sabiduría. En la fase larga, las relaciones fluidas también tienen el potencial de éxito, finanzas y economía estables",
    hara_3_desc:
      "💡Potencial para las ideas y la creatividad, tranquilidad y disfrute de todo aquello que requiere control. En la fase corta, potencial para la ACCIÓN, creatividad y originalidad, mayor autoexpresión. Esto es Capital. Lleno de inspiración, motivación e ideas para la vida. Al socializar, aportarás comodidad. Potencial para experimentar una vida llena de viajes e inspirarás a otros. Aumentarás otros placeres del mundo material/dinero",
    hara_4_desc:
      "✔️Potencial para fortalecer tu carrera y tus relaciones, avanzar y cumplir con tus responsabilidades de forma práctica. En la fase corta, existe la posibilidad de oportunidades de negocio prometedoras y la desaparición de dificultades con las autoridades, especialmente con las instituciones y sus regulaciones. Tus finanzas están en alza. La fuerza y la determinación pueden ayudarte a hacer realidad tus planes. En la fase larga, tienes el potencial de experimentar mejoras en tu carrera y tus finanzas. También puedes esperar un fortalecimiento de tus relaciones, especialmente con alguien cercano",
    hara_5_desc:
      "❌Todos los malos potenciales: mala suerte, fácil de engañar, traición, desastre, enfermedad, mal final. Toda la mala suerte y las cosas malas del harani anterior están en este harani, así que ten cuidado si hay un harani 5, te guste o no. Hay peligro en los problemas de confianza. Existe la tendencia a pensar en engañar a tu pareja por la tentación. Si caes en una trampa, tienes el potencial de perder todo lo que consideras muy importante. El nombre debe ser cambiado o añadido. Fácil de engañar, morir de una enfermedad crónica, morir por envenenamiento sin que el envenenador sea detectado, morir por un accidente, ser traicionado por tu propio amigo, y el punto culminante es el potencial de ser asesinado por un amigo, no por un oponente (tu propio novio, tu propio hermano). Este harani es un número que se puede decir que es el peor de todos los números del Código Final, tiene el potencial de experimentar a menudo mala suerte y cosas malas; en promedio, las cosas negativas que ocurren en otros parámetros del código final también ocurren en este número harani. Así que ten cuidado si tu nombre contiene el Código Final. Además, podrías ser fácilmente engañado, traicionado por tus propios amigos y otros",
    hara_6_desc:
      "🏡Potencial de desarrollo familiar y social, ayuda a jóvenes y mayores, mejora, sanación y progreso. En la fase corta, existe la oportunidad de involucrarse en la familia, complacer y ayudar a varias generaciones. Potencial de interés por temas ambientales y políticos, y también tiene el potencial de convertirse en una persona más responsable. En la fase larga, existe el potencial de obtener muy buenas perspectivas. En todas las áreas de la vida, existe el potencial de experimentar mejora, sanación y progreso",
    hara_7_desc:
      "Posibles problemas financieros, conflictos emocionales (que pueden causar desgracias), inconstancia, trastornos nerviosos, células anormales. Fase corta: En la vida, se experimentarán dificultades para distribuir recursos y problemas financieros. Fase larga: Alto potencial de cáncer, tumores y conflictos emocionales (por ejemplo, un triángulo amoroso)",
    hara_8_desc:
      "🤕Posibilidad de un viaje desagradable, hay que tener cuidado de no lastimarse, enfermarse (recuperación prolongada), diagnóstico erróneo, terminar algo mal (impacto grave)",
    hara_9_desc:
      "🤧Posible interrupción financiera, interrupción de medicamentos o inserción de medicamentos, enfermedades no saludables/experiencia de enfermedades como brotes virales y final mal (cualquier cosa) debido a lo que hacen otras partes",
    hara_11_desc:
      "🤢Potencial de fracaso empresarial, ser chivo expiatorio, presión psicológica o traición, complicaciones, separación por diferentes principios, problemas de salud",
    hara_13_desc:
      "😳Posible decepción con los resultados del hogar o del negocio (quiebra, pérdidas), traición por parte de personas cercanas e incapacidad de obtener resultados máximos y óptimos de todos los esfuerzos realizados",
    expression_1_desc:
      "Estás destinado a convertirte en un líder en tu campo profesional. Aprende a confiar en tus propias habilidades, a demostrar coraje y determinación, y a evitar los aspectos negativos como el egocentrismo. Se te pedirá consejo de vez en cuando, y debes prepararte para ello. Naciste para convertirte en una persona excepcional en un campo profesional",
    expression_2_desc:
      "La cooperación, la diplomacia y la coexistencia pacífica son los objetivos de la vida. El desarrollo se logra en asociación en lugar de en autonomía. Es posible que se te pida que arbitres y restablezcas la paz de vez en cuando. La cooperación, el compartir y la asociación te llevarán al éxito. Si se pueden evitar los aspectos negativos, serás reconocido como un artífice de la paz",
    expression_3_desc:
      "La popularidad, la felicidad personal y la de los demás, el amor, el romance y los bienes materiales son los rasgos sobresalientes de la vida, siempre que utilices tus talentos sabiamente. Eres una fuente de alegría para los demás y naciste para hacerlos felices. A través de tu imaginación, tu sinceridad y tu buen humor, estás destinado a iluminar a la humanidad en un plano creativo",
    expression_4_desc:
      "Estás destinado a asumir responsabilidades, y otros contarán contigo para su ayuda y apoyo. La construcción, la organización y la gestión te ocuparán toda la vida. Los problemas familiares a menudo volverán a tu mente, y las limitaciones de la vida podrían irritarte. A través de la paciencia, la determinación, el orden, la sinceridad, la honestidad y el sentido del servicio, asegurarás la seguridad de los demás y la tuya propia si superas las dificultades",
    expression_5_desc:
      "Naciste para interactuar con los demás y promover la «libertad» y el «progreso». El cambio, las nuevas circunstancias, los nuevos enfoques, la diversidad, la versatilidad y los imprevistos serán los rasgos sobresalientes de tu vida. Es posible que te resulte difícil trabajar durante mucho tiempo en las mismas bases o con las mismas personas. Enseñarás a otros a alcanzar la «libertad» y a vivir felices, si se controla lo negativo",
    expression_6_desc:
      "Viniste al mundo para servir a la humanidad con amor, sentido del deber, responsabilidad y caridad. Serás reconocido como una persona confiable. Sé generoso con tus seres queridos, sin llegar al sacrificio. Llamarán a tu puerta para pedirte ayuda a lo largo de tu vida, y cuanto más actúes por los demás, más estarás rodeado de amor, comodidad y dinero. Para tu propio progreso, necesitas belleza, compañía, amor y armonía. Eres capaz de explorar la filosofía de la vida y alcanzar cimas espirituales",
    expression_7_desc:
      "Estás destinado a buscar la sabiduría o las verdades ocultas en el campo científico, criminal, filosófico o religioso. Puedes encontrarte solo incluso en medio de la gente y puedes estar fuera de la clase común. Puedes profundizar en la filosofía de la vida; experimentar, probar y demostrar los hechos descubiertos por otros. La popularidad, el amor y el respeto deberían llegar a ti por el conocimiento alcanzado y deberías ser conocido como un educador. Los negocios personales, el amor e incluso el matrimonio pueden sacrificarse en el duro camino que sigues, pero puedes obtener una mayor satisfacción al encontrar la verdad (más a menudo en las líneas ocultas o espirituales) y educar a la gente",
    expression_8_desc:
      "La gestión, la organización y la administración deberían llevarte a una posición de autoridad y reconocimiento. Tendrás que hacer una evaluación adecuada de las personas y los acontecimientos de vez en cuando, lo que no es una tarea fácil. Si se desarrolla la facultad filosófica y se emite un juicio imparcial, tu recompensa será su logro. El dinero puede no ser siempre las líneas de desarrollo además de los negocios por los que podrías ser famoso",
    expression_9_desc:
      "Estás destinado a volverte popular en el campo filantrópico, humanitario o caritativo. El amor a la fraternidad y el servicio a la humanidad serán parte integral de tu personalidad, mientras que el amor, el romance, la música y el arte deberían interesarte profundamente. La compasión, la generosidad y la comprensión de las necesidades de los demás te harán muy popular. El egoísmo, el amor propio y la falta de perdón pueden resultar perjudiciales y generar decepciones. Ser impersonal y desarrollar un amor universal puede convertirte en un líder espiritual",
    expression_11_desc:
      "La inspiración, la conciencia espiritual (a menudo latente), la intuición y las capacidades psíquicas pueden conducir a la felicidad interior y a la iluminación si se controlan los aspectos negativos. Estás destinado a alcanzar valores más elevados; la vida familiar, las ganancias materiales y el estatus social pueden perderse fácilmente si te apegas estrictamente a ellos. Debes superar la sensibilidad, el nerviosismo y el egocentrismo y tomarte la vida material y social a la ligera. Estás dotado del poder de alcanzar cimas espirituales e iluminar a los demás. A veces sufres pérdidas materiales, lo que provoca decepciones repetidas en tus relaciones y asociaciones",
    expression_22_desc:
      "La capacidad para gestionar eficazmente grandes proyectos probablemente te colocará en una posición de autoridad en un campo específico del mundo material en algún momento de tu vida. Probablemente tendrás proyectos importantes. Pero tu éxito dependerá de tu capacidad para dominar tu deseo de «asumir más trabajo del que puedes manejar» y para evitar que tu conciencia espiritual interfiera con tu enfoque práctico. Por otro lado, si te inclinas a trabajar en campos místicos y ocultos, podrías hacer mucho bien a los demás y convertirte en un famoso dispensador de luz",
    time_1_desc:
      "Lleno de ideas creativas, de voluntad fuerte, independiente, valiente y luchador. Los defectos inherentes son la terquedad, la deshonestidad, el deseo de dominar y el egoísmo, lo que conduce a una actitud de sabelotodo. La sabiduría es el enfoque principal. Tiene fuertes habilidades analíticas. Si se usa correctamente, se convertirá en una persona culta. Generalmente no responde SÍ o NO de inmediato, primero pensará. Muy detallista en muchas cosas. Muy fuerte en creatividad y muy vigilante. Estas características conducirán a la riqueza. Bueno para entretener y fiable en la construcción de relaciones. La riqueza generalmente se alcanza alrededor de los 32 a 42 años. Tiene habilidades de liderazgo. El sexo opuesto a menudo se siente atraído. Se volverá más apuesto/a o más hermoso/a con la edad - por encima de los 30 años y más allá, se verá más guapo/a. El lado negativo es que a menudo se siente solo, sintiéndose como un vagabundo. Ten cuidado al analizar a una persona o una situación, un análisis incorrecto conducirá a problemas innecesarios",
    time_2_desc:
      "Lleno de paz, humilde, amigable y con una influencia espiritual. Los defectos inherentes son ser sensible y herirse fácilmente, prestando demasiada atención a las pequeñas cosas hasta el punto de perder mucho tiempo. Habilidoso y con una personalidad agradable, y hablador. Fiable en el trabajo que implica cooperación. Muy tranquilo, amigable y de buen corazón. Siempre enfatiza el orden, la limpieza y es muy organizado. Dispuesto a trabajar duro, muy maduro en su pensamiento. Generalmente socializa con personas mayores. Tiene la capacidad de dirigir y completar tareas. El lado negativo es estar dispuesto a escuchar las opiniones de los demás, pero quizás no a seguirlas. Terco, a menudo provoca malos chismes y tiende a ser 'pura habladuría'. Muy celoso en asuntos de amor",
    time_3_desc:
      "Lleno de talento artístico, espíritu de lucha, tiene la capacidad de ver 3 líneas de tiempo. Los defectos inherentes son el derroche, hablar sin pensar y la dificultad para perdonar. Atractivo y previsor, pero muy impaciente. Claro y sabe lo que quiere y cómo y dónde conseguirlo. Muy rápido para distinguir entre el bien y el mal. Puede ocupar una posición alta, ser rico y próspero. Tiene una buena vida a los ojos de la sociedad. Tiene habilidades y talentos y es bueno para aprovechar una situación. Se enoja rápidamente, pero también se calma rápidamente. Una mujer hermosa, o un hombre guapo en su juventud. El lado negativo es una tendencia a tomar las cosas a la ligera y no ser firme. A veces puede ser travieso. A veces grosero al hablar. Hay altibajos en el matrimonio, y si no se maneja bien, puede traer desastre y violencia. Generalmente piensa que tiene razón en todo lo que hace y dice, mientras que los demás están equivocados",
    time_4_desc:
      "Lleno de responsabilidad, pensamiento científico, honesto y leal. Los defectos inherentes son la terquedad, el amor por el debate y el deseo de dominar, y una naturaleza adicta al trabajo. Inteligente, artístico y sobresale en las pruebas de la vida. Digno de confianza y fácil de tratar en sociedad. Lleno de compasión y carismático. Es por naturaleza un planificador y un pensador, piensa antes de actuar. Le gusta viajar y vivir un estilo de vida libre. Tiene habilidades a una edad muy temprana. Capaz de levantarse rápidamente después de enfrentar las dificultades de la vida. Si es mujer, mima a su pareja. El lado negativo es una debilidad en la acumulación de riqueza. Debe tener cuidado en las relaciones o el matrimonio, de lo contrario implicará incidentes malos e innecesarios",
    time_5_desc:
      "Lleno de energía sexual, amor por la libertad y el cambio, lleno de ingenio y acciones rápidas, capaz de entretener. Los defectos inherentes son la deslealtad en 'el amor y el matrimonio', y una incapacidad para controlar la inquietud y la insatisfacción. Tiene un carácter muy fuerte. Nacido con un alma de liderazgo, generalmente ocupa una posición por encima de muchas personas en términos de trabajo. Tiene fuertes instintos en muchas cosas. Realista y trabajador. Puede adaptarse y ajustarse a la situación o circunstancias actuales. A pesar de enfrentar los obstáculos de la vida, cuando se enfrenta a problemas financieros, siempre hay una manera de superarlos. El lado negativo es que si proviene de una familia pobre, tiene una naturaleza terca. Si está en el camino equivocado, tiende a dar vueltas sin un buen propósito, incluso tendiendo a mentir. Muy exigente y quisquilloso con muchas cosas y asuntos. Aprende a no ser así para que la gente te aprecie más",
    time_6_desc:
      "Lleno de equilibrio, desinteresado, disfruta de las actividades humanitarias, leal y firme en pensar en el bienestar de los demás. Los defectos inherentes son el amor por los elogios y la popularidad, y una incapacidad para controlarse en el sacrificio. Tenaz, capaz de administrar la riqueza y el bienestar. Muy educado y de buen gusto. Tiene una buena carrera en las artes, la religión o la educación. Puede convertirse en una figura bastante popular. No escucha fácilmente a los demás, especialmente a los superiores, pero piensa y presta atención a los subordinados. Cuida de la familia y los parientes cercanos. Orientado a la familia. El lado negativo es ser arrogante y orgulloso, no dispuesto a hacer trabajos sencillos. En términos de relaciones, es posesivo y siempre quiere controlar a todos y todo, pero generalmente no lo admitirá. Deshazte del deseo de dominar para que tus seres queridos te quieran más",
    time_7_desc:
      "Lleno de inteligencia, soledad, misticismo, una personalidad llena de encanto. Los defectos inherentes son la dificultad para expresarse, la falta de confianza en los demás, la atención excesiva a sí mismo que conduce a una falta de comprensión de las necesidades de la 'pareja'. Detallista en el manejo de varios asuntos. Nunca olvidará a nadie que le haya ayudado. Capaz de cambiar y dar la vuelta a una situación. Disfruta persiguiendo la fama y la fortuna. Fiable en la gestión del campo del entretenimiento. Puede convertirse en una figura espiritual/líder religioso, generalmente a partir de los 50 años. El lado negativo es el amor por el debate, la indecisión/cambiar de opinión a menudo y la lentitud para tomar decisiones. Tiende a tener problemas en el matrimonio. Aunque es bueno para ser agradecido, hay una tendencia a que ellos mismos no muestren gratitud hacia los demás",
    time_8_desc:
      "Lleno de idealismo, materialista, un guardián de secretos de confianza. Los defectos inherentes son el deseo de mostrar poder, la falta de humanidad y la terquedad. Casi todos con el Tiempo 8 obtienen la tragedia como resultado final. Silencioso, conservador, tiende a ser pasivo, pero apasionado entre los demás. Muy responsable, aunque a veces se siente presionado. Lleno de virtud y digno de confianza. No jugará con la gente. Parece duro por fuera, pero en realidad es blando por dentro. El lado negativo es ser de mal genio, un procrastinador y tender a esperar y ver. Esto a menudo causará la pérdida de oportunidades. Necesita ser mejor para leer las situaciones. Ser demasiado cuidadoso no te llevará a ninguna parte. Confía en tus propias opiniones y haz las cosas a tu manera. A veces no está claro lo que están haciendo. Si están en el camino equivocado, se convertirán en un matón, queriendo dominar, egoístas, crueles y solo pensando en su propio avance",
    time_9_desc:
      "Lleno de humanidad, generoso, compasivo y con un alma espiritual. Los defectos inherentes son ser demasiado sensible, precipitado en la toma de decisiones, egoísta, posesivo, intolerante e incluso deshonesto. Muy optimista y de mente abierta. Le gusta verse hermoso/a y vestir bien. Sencillo, parece duro pero es blando por dentro. Muy alerta y sensible. Sabe cuándo y cómo atacar y defender. Bueno para ganarse el corazón de la gente. Hace todo rápidamente pero le falta detalle. Bastante emocional. Fiable en el trabajo. Tiene grandes metas y sueños. Lo que sea que haga, la mayoría de las veces cosecha éxito. El lado negativo es que a menudo se siente solo en la vejez. Hay un alto nivel de codicia en su interior. Tiende a olvidarse de prestar atención a los subordinados. No tiene muchos amigos verdaderos. El estilo de vida tiende a ser materialista",
    synchronize_desc:
      "El valor de Sincronización es un parámetro que indica la relación entre el código interno de una persona y los códigos externos, la capacidad de interactuar con el entorno y la velocidad para aprovechar las oportunidades. El rango de Sincronización es de 0,05 a 1,0 o del 5% al 100%. Las personas exitosas y consumadas en todos sus empeños, tanto a pequeña como a gran escala, tienen un valor de Sincronización de 0,8 a 1,0 o del 80% al 100%. Valor de Sincronización: 0,1 / 10%. Tu capacidad para dominar un campo es extremadamente difícil y lenta. En las lecciones, necesitas explicaciones repetidas antes de poder entender siquiera un POCO. Socialmente, puede que necesites adaptarte múltiples veces. Si tu valor de Sincronización es del 10%, es probable que seas una persona menos inteligente. Valor de Sincronización: 0,2 / 20%. El potencial es casi el mismo que el del parámetro del 10%, pero a un nivel que podría ser ligeramente más fácil que la marca del 10%. Valor de Sincronización: 0,3 / 30%. Tu potencial para dominar un campo no es muy bueno si tu parámetro de potencial inteligente también está en el 30%. Aunque socializas, hay una alta probabilidad de ser condenado al ostracismo por aquellos a quienes consideras amigos. En las lecciones que crees haber entendido, es probable que haya errores en tu comprensión. Valor de Sincronización: 0,4 / 40%. Existe una probabilidad muy alta de que tengas el potencial de convertirte en el recadero de tus amigos. Para decirlo sin rodeos, tienes el potencial de sacrificar voluntariamente tu amor propio solo por tener compañía. En tus estudios, todavía cometes errores frecuentes en tu forma de entender las lecciones. Valor de Sincronización: 0,5 / 50%. En tu vida social, a tus amigos no les importas mucho, aunque tengas gente dispuesta a ser tus amigos. Tu presencia no es particularmente deseada por ellos. En tus estudios, es probable que no te importen las materias que estás aprendiendo, ni siquiera las que se supone que debes estudiar. Valor de Sincronización: 0,6 / 60%. Este es tu potencial para dominar un campo, especialmente en las interacciones sociales y las amistades. Una pequeña parte de la gente espera tu presencia, pero a la mayoría no parece importarle si estás allí o no. En tus estudios, eres muy promedio y a veces puedes entender el material que estás aprendiendo. Valor de Sincronización: 0,7 / 70%. Tu potencial para dominar un campo está en un nivel seguro si el número es del 70%. Tienes muchos amigos, pero puedes ser selectivo al elegirlos. Entiendes muy bien lo que es bueno y lo que no, aunque a veces lo ignores. En tus estudios, lenta pero seguramente, eres capaz de entender lo que estás aprendiendo. Valor de Sincronización: 0,8 / 80%. Hay una probabilidad muy alta de que te vuelvas popular entre tus amigos; tu presencia es esperada con ansias, y usualmente tienes una vibra extraordinaria. Sin embargo, eres menos capaz de ser selectivo al elegir amigos, queriendo ser amigo de todos con el razonamiento de que «La amistad es para todos». En tus estudios, eres bastante rápido para entender el material que estás aprendiendo. Valor de Sincronización: 0,9 / 90%. Tu potencial reside en tu vida social; es muy probable que te hagas famoso por tus logros. Muchos amigos confían en ti para hacer las cosas. Eres tan inteligente que puedes entender cualquier lección que estudies con gran facilidad. Desafortunadamente, a veces sientes que eres más inteligente que los demás, lo que te lleva a considerar a muchos amigos como una carga. Valor de Sincronización: 1,0 / 100%. El potencial de tus logros y la sensación que creas hará que muchas personas a tu alrededor te admiren y se pregunten por ti, dando lugar a un aura de autoridad y carisma que irradia de ti. Eres increíblemente listo e inteligente para entender cualquier lección que estudies. Desafortunadamente, el potencial de egoísmo dentro de ti es muy alto, porque a menudo sientes que eres mejor que los amigos que te consideran importante, y prefieres hacerte amigo de la gente que consideras importante",
    coherence_desc:
      "La Coherencia es un parámetro que indica la fortaleza estructural de los códigos internos interrelacionados de una persona, demostrando su nivel de habilidad y velocidad para dominar un campo de conocimiento o una destreza. El rango de Coherencia es de 0,1 a 1,0 o del 10% al 100%. Las personas exitosas y realizadas en la vida, en todos sus empeños, ya sea a pequeña o gran escala, tienen un valor de Coherencia de entre 0,7 y 1,0, o del 70% al 100%",
    // Numerology Results
    hara: "Hara",
    expression: "Expresión",
    time: "Tiempo",
    dimensional_analysis: "Análisis Dimensional",
    synchronize_score: "Puntuación de Sincronización",
    coherence_value: "Valor de Coherencia",
    synergize_value: "Valor de Sinergia",
    productive_value: "Valor Productivo",
    momen_sukses_value: "Valor del Momento de Éxito",
    grafologi_index: "Índice Grafológico",
    potential_suggestions: "Sugerencias Potenciales",
    advanced_analysis: "Análisis Avanzado",
    core_numbers: "Números Centrales",
    character_number: "Número de Carácter",
    expression_number: "Número de Expresión",
    soul_number: "Número del Alma",
    personality_number: "Número de Personalidad",
    number_intensity: "Intensidad de Números",
    personal_development: "Desarrollo Personal",
    self_potential: "Potencial Personal",
    attitude_number: "Número de Actitud",
    growth_number: "Número de Crecimiento",
    birth_date_analysis: "Análisis de Fecha de Nacimiento",
    day: "Día",
    month: "Mes",
    year: "Año",
    pythagorean_analysis: "Análisis Pitagórico",
    soul_urge: "Impulso del Alma",
    personality: "Personalidad",
    challenge_numbers: "Números de Desafío",
    challenge: "Desafío",
    current_year_analysis: "Análisis del Año Actual",
    personal_year_number: "Número de Año Personal",
    premium_analysis: "Análisis Premium",
    upgrade_to_premium: "Actualizar a Premium",
    parameter_detail: "Detalle del Parámetro",
    close: "Cerrar",
    // Numerology Form
    numerology_analysis: "Análisis Numerológico",
    basic_analysis: "Análisis Básico",
    advanced_analysis: "Análisis Avanzado",
    full_name: "Nombre Completo",
    enter_full_name: "Ingrese su nombre completo",
    normalized: "Normalizado",
    gender: "Género",
    male: "Masculino",
    female: "Femenino",
    birth_date: "Fecha de Nacimiento",
    select_birth_date: "Seleccionar Fecha de Nacimiento",
    cancel: "Cancelar",
    done: "Hecho",
    advanced_analysis_features: "Características del Análisis Avanzado:",
    life_path_number: "• Número de Camino de Vida (Hara)",
    expression_number_feature: "• Número de Expresión",
    soul_urge_number: "• Número de Impulso del Alma",
    personality_number_feature: "• Número de Personalidad",
    maturity_number: "• Número de Madurez",
    personal_year_number_feature: "• Número de Año Personal",
    analyze: "Analizar",
    // Name Generator
    personal_name_optimizer: "Optimizador de Nombre Personal",
    baby_name_generator: "Generador de Nombres de Bebé",
    personal_name: "Nombre Personal",
    baby_name: "Nombre de Bebé",
    generation_mode: "Modo de Generación",
    add_one_word: "Agregar Una Palabra",
    add_some_word: "Agregar Algunas Palabras",
    your_first_name: "Su Primer Nombre",
    family_name_optional: "Apellido (Opcional)",
    enter_first_name: "Ingrese su primer nombre",
    enter_family_name: "Ingrese apellido (opcional)",
    name_origin: "Origen del Nombre",
    generate_names: "Generar Nombres",
    advanced_search: "Búsqueda Avanzada",
    jalankan_lanjut_combi: "Ejecutar/Continuar Combi",
    suggested_names: "Nombres Sugeridos",
    generated_from: "Generado desde:",
    no_matching_names:
      "No se encontraron nombres coincidentes. Pruebe diferentes parámetros.",
    // Compatibility Checker
    compatibility_checker: "Verificador de Compatibilidad",
    person_1: "Persona 1",
    person_2: "Persona 2",
    check_compatibility: "Verificar Compatibilidad",
    compatibility_results: "Resultados de Compatibilidad",
    compatibility_areas: "Áreas de Compatibilidad",
    detailed_analysis_unlocked: "Análisis Detallado - ¡Desbloqueado!",
    all_premium_features_available:
      "Todas las características premium están ahora disponibles para su análisis de compatibilidad.",
    // Life Report
    life_report: "Informe de Vida",
    life_path: "Camino de Vida",
    year_life_report: "Informe de Vida de 100 Años",
    daily_advice: "Consejo Diario",
    daily_advice_calendar: "Calendario de Consejos Diarios",
    select_date: "Seleccionar Fecha",
    monthly_advice_calendar: "Calendario de Consejos Mensuales",
    legend: "Leyenda:",
    // G1-G9 Descriptions
    g1_desc:
      "Independiente y orientado al liderazgo, con fuerte iniciativa y espíritu pionero. Líder nato con habilidades creativas.",
    g2_desc:
      "Cooperativo y diplomático, excelente en asociaciones y trabajo en equipo. Paciente y detallista con fuertes habilidades intuitivas.",
    g3_desc:
      "Creativo y expresivo, con fuertes habilidades de comunicación. Talentos artísticos y perspectiva optimista de la vida.",
    g4_desc:
      "Práctico y organizado, con fuerte ética de trabajo y atención al detalle. Confiable y sistemático en el enfoque.",
    g5_desc:
      "Amante de la libertad y aventurero, con fuerte deseo de variedad y cambio. Personalidad dinámica y versátil.",
    g6_desc:
      "Nutritivo y responsable, con fuerte orientación familiar. Cariñoso y solidario con habilidades curativas.",
    g7_desc:
      "Analítico e introspectivo, con fuertes inclinaciones espirituales. Investigador y buscador de verdad y sabiduría.",
    g8_desc:
      "Ambicioso y orientado a los negocios, con fuerte enfoque material. Organizador natural con habilidades ejecutivas.",
    g9_desc:
      "Humanitario y generoso, con fuerte deseo de servir a otros. Compasivo y comprensivo con perspectiva universal.",
  },
  ar: {
    // Home Screen
    welcome_back: "مرحباً بعودتك،",
    all_premium_features_unlocked: "تم إلغاء قفل جميع الميزات المميزة!",
    quick_actions: "إجراءات سريعة",
    name_analysis: "تحليل الأسماء",
    love_couple: "زوجان محبان",
    dictio_name: "قاموس الأسماء",
    generator_name_optimizer: "محسن مولد الأسماء",
    lifeplan_report: "تقرير خطة الحياة",
    successful_people: "الأشخاص الناجحون",
    synchronize: "مزامنة",
    coherence: "تماسك",
    momentum: "زخم",
    discover_power_names:
      "اكتشف قوة الأسماء من خلال أدوات التحليل الشاملة لدينا. تريد أن تحصل على قيم مثلهم؟ >> تعلم المزيد",
    earn_free_credits: "احصل على نقاط مجانية",
    share_with_friends: "شارك مع الأصدقاء لإلغاء قفل الميزات المميزة",
    share_now: "شارك الآن",
    // Tab Bar
    home: "الرئيسية",
    analyze: "تحليل",
    names: "أسماء",
    match: "مطابقة",
    account: "حساب",
    // Common
    language: "اللغة",
    // Parameter Details
    hara_1_desc:
      "🤠 إيجابي في الاستقلال والاعتماد على الذات، وتطورات جديدة (بداية)، عادةً ما يسبقها شيء/وظيفة/مشروع جديد، أو انتقال، أو تغيير مهني، أو خطوة رئيسية مماثلة. استقلالية وقوة، وإمكانية التفرد. إمكانية امتلاك السلطة/مقاومة الشخصيات المهيمنة. فرص عمل أكثر ربحية للأفراد، ولكنها أقل ملاءمة/ربحية إذا تم ذلك في شكل تعاون. ستكون هناك احتمالات كبيرة للتوفيق في الأمور المالية والمغامرات. تميل إلى الحصول على الدعم من مصادر متعددة. على المدى الطويل، ستكون مستقرًا ماليًا، وقويًا، وناجحًا في العمل",
    hara_2_desc:
      "🤝تعزيز الروابط والتعاون، مدعومًا بعلاقة جيدة وطويلة الأمد. في المرحلة القصيرة، هناك إمكانية لتكوين علاقات جديدة في مجال الأعمال أو العلاقات، وزيادة الوعي بالامتنان للحياة، وزيادة الحساسية لغرائز الحياة والأعمال، والاستعداد للشراكة مع الآخرين، وسهولة التفاوض والحكمة. في المرحلة الطويلة، تتمتع العلاقات الجيدة بإمكانية النجاح، وتحسن الوضع المالي والاقتصادي",
    hara_3_desc:
      "💡إمكانية الأفكار والإبداع، والهدوء والاستمتاع بكل ما يحتاج إلى ضبط. في المرحلة القصيرة، هناك إمكانية للإبداع والأصالة، وزيادة التعبير عن الذات. هذا هو رأس المال. مليء بالإلهام والتحفيز وأفكار الحياة. عند التواصل الاجتماعي، ستجلب الراحة، وإمكانية لتجربة حياة مليئة بالسفر وإلهام الآخرين. ستكون هناك ملذات متزايدة - ملذات أخرى من الجوانب المادية للعالم / المال",
    hara_4_desc:
      "✔️تتعزز فرصك المهنية والعاطفية، وتتقدم للأمام، وتُنجز مسؤولياتك عمليًا. في المرحلة القصيرة، هناك إمكانية للحصول على فرص عمل واعدة، واختفاء الصعوبات مع السلطات، وخاصة المؤسسات ولوائحها. ميزانيتك في ازدياد. القوة والعزيمة ستساعدك على تحقيق خططك. في المرحلة الطويلة، لديك القدرة على تحسين وضعك المهني والمالي. كما يمكنك توقع علاقات أقوى، خاصة مع شخص قريب منك",
    hara_5_desc:
      "❌قد يكون من السهل خداعك، أو خيانة، أو سوء حظ، أو مرض، أو نهاية سيئة. يجب تغيير الاسم أو إضافته. سهل الخداع، وقد يتعرض غالبًا لسوء الحظ وأمور سيئة، وفي المتوسط، قد تظهر أيضًا أمور سلبية تحدث في معلمات رمز النهاية الأخرى في هذا الرقم. لذا، كن حذرًا إذا كان اسمك يحتوي على رمز النهاية. بالإضافة إلى ذلك، قد يكون من السهل خداعه، أو خيانته من الأصدقاء، أو من الآخرين",
    hara_6_desc:
      "🏡 لديك القدرة على النمو في المجالات العائلية والاجتماعية، ومساعدة الصغار والكبار، والتحسن، والشفاء، والتقدم. في المرحلة القصيرة، لديك فرصة للانخراط في الأسرة، وإسعاد ومساعدة مختلف الأجيال. لديك القدرة على الاهتمام بالقضايا البيئية والسياسية، كما أن لديك القدرة على أن تصبح شخصًا أكثر مسؤولية. في المرحلة الطويلة، لديك القدرة على الحصول على آفاق تبدو واعدة جدًا. في جميع مجالات حياتك، لديك القدرة على التحسن، والشفاء، والتقدم",
    hara_7_desc:
      "😠مشاكل مالية محتملة، صراعات عاطفية (مما قد يؤدي إلى سوء الحظ)، تقلبات مزاجية، اضطرابات عصبية، خلايا غير طبيعية. مرحلة قصيرة: سيواجه في حياته صعوبات في تخصيص موارده، وسيواجه مشاكل مالية. مرحلة طويلة: احتمالية عالية للإصابة بالسرطان والأورام، وصراعات عاطفية (مثال على مثلثات الحب)",
    hara_8_desc:
      "🤕احتمالية السفر غير المريحة، يجب الحذر من التعرض للأذى، أو المرض (فترة نقاهة طويلة)، أو التشخيص الخاطئ، أو إنهاء أمر سيء (تأثير خطير)",
    hara_9_desc:
      "🤧احتمالية حدوث اضطرابات مالية، أو إدمان المخدرات، أو الإصابة بأمراض غير صحية، مثل تفشي الفيروسات، أو نهاية سيئة (أو أيًا كان) بسبب ما يفعله الآخرون",
    hara_11_desc:
      "🤢احتمالية فشل العمل، أن يصبح كبش فداء، ضغط نفسي أو خيانة، تعقيدات، انفصال بسبب اختلاف المبادئ، مشاكل صحية",
    hara_13_desc:
      "😳 خيبة أمل محتملة بسبب نتائج أعمال المنزل أو العمل (إفلاس، خسارة)، وخيانة المقربين، وعدم القدرة على تحقيق أقصى النتائج الممكنة من جميع الجهود المبذولة",
    expression_1_desc:
      "أنت مقدر لك أن تصبح قائدًا في مجالك المهني. تعلم أن تعتمد على قدراتك الخاصة، وأن تظهر الشجاعة والعزيمة، وأن تتجنب الجوانب السلبية مثل الأنانية. سيُطلب منك المشورة من وقت لآخر، ويجب أن تكون مستعدًا لذلك. لقد ولدت لتصبح شخصًا استثنائيًا في مجال مهني",
    expression_2_desc:
      "التعاون والدبلوماسية والتعايش السلمي هي أهداف الحياة. يتم التطور بالشراكة بدلاً من الاستقلالية. قد يُطلب منك التوسط وإعادة السلام من وقت لآخر. سيقودك التعاون والمشاركة والشراكة إلى النجاح. إذا أمكن تجنب الجوانب السلبية، فسيتم الاعتراف بك كصانع سلام",
    expression_3_desc:
      "الشعبية، السعادة الشخصية وسعادة الآخرين، الحب، الرومانسية والممتلكات المادية هي السمات البارزة في الحياة، بشرط أن تستخدم مواهبك بحكمة. أنت مصدر فرح للآخرين وقد ولدت لتجعلهم سعداء. من خلال خيالك وصدقك وروحك المرحة، أنت مقدر لك أن تنير البشرية على المستوى الإبداعي",
    expression_4_desc:
      "أنت مقدر لك أن تتحمل المسؤوليات، وسيعتمد عليك الآخرون لمساعدتهم ودعمهم. سيشغلك البناء والتنظيم والإدارة طوال حياتك. ستعود المشاكل العائلية إلى ذهنك كثيرًا، وقد تزعجك قيود الحياة. بالصبر والعزيمة والنظام والصدق والأمانة وحس الخدمة، ستضمن أمن الآخرين وأمنك إذا تغلبت على الصعوبات",
    expression_5_desc:
      "لقد ولدت للتفاعل مع الآخرين وتعزيز «الحرية» و «التقدم». سيكون التغيير والظروف الجديدة والأساليب الجديدة والتنوع والتعددية والغير متوقع من السمات البارزة في حياتك. قد تجد صعوبة في العمل لفترة طويلة على نفس الأسس أو مع نفس الأشخاص. ستعلم الآخرين كيفية تحقيق «الحرية» والعيش بسعادة، إذا تم السيطرة على الجانب السلبي",
    expression_6_desc:
      "لقد أتيت إلى العالم لخدمة البشرية بالحب، والشعور بالواجب، والمسؤولية، والإحسان. سيتم الاعتراف بك كشخص موثوق به. كن كريمًا مع أحبائك، ولكن ليس لدرجة التضحية. سيطرق بابك لطلب المساعدة طوال حياتك، وكلما عملت من أجل الآخرين، كلما كنت محاطًا بالحب والراحة والمال. من أجل تقدمك الخاص، تحتاج إلى الجمال والرفقة والحب والوئام. أنت قادر على استكشاف فلسفة الحياة والوصول إلى قمم روحية",
    expression_7_desc:
      "أنت مقدر لك البحث عن الحكمة أو الحقائق الخفية في المجال العلمي أو الجنائي أو الفلسفي أو الديني. قد تجد نفسك وحيدًا حتى عندما تكون وسط الناس وقد تكون خارج الطبقة العادية. قد تتعمق في فلسفة الحياة؛ تجرب وتختبر وتبرهن على الحقائق التي اكتشفها الآخرون. يجب أن تأتيك الشعبية والحب والاحترام للمعرفة التي حصلت عليها ويجب أن تُعرف كمعلم. قد يتم التضحية بالأعمال الشخصية والحب وحتى الزواج في الطريق الصعب الذي تتبعه، ولكن قد تحصل على رضا أكبر في إيجاد الحقيقة (غالبًا في الجوانب الغامضة أو الروحية) وتعليم الناس",
    expression_8_desc:
      "يجب أن تقودك الإدارة والتنظيم والإدارة إلى منصب سلطة وتقدير. سيتعين عليك إجراء تقييم مناسب للأشخاص والأحداث من وقت لآخر، وهي ليست مهمة سهلة. إذا تم تطوير الكلية الفلسفية وتم إصدار حكم غير متحيز، فستكون مكافأتك هي إنجازه. قد لا يكون المال دائمًا هو خطوط التطور بالإضافة إلى الأعمال التي قد تشتهر بها",
    expression_9_desc:
      "أنت مقدر لك أن تصبح مشهورًا في المجال الخيري أو الإنساني. سيكون حب الإخاء وخدمة الإنسانية جزءًا لا يتجزأ من شخصيتك، بينما يجب أن يثير اهتمامك الحب والرومانسية والموسيقى والفن بعمق. سيجعلك التعاطف والكرم وفهم احتياجات الآخرين مشهورًا جدًا. قد يكون الأنانية وحب الذات وعدم المغفرة ضارًا ويؤدي إلى خيبات الأمل. أن تكون غير شخصي وتطور حبًا عالميًا يمكن أن يجعلك قائدًا روحيًا",
    expression_11_desc:
      "الإلهام، الوعي الروحي (غالبًا ما يكون كامنًا)، الحدس والقدرات النفسية يمكن أن تؤدي إلى السعادة الداخلية والتنوير إذا تم السيطرة على الجوانب السلبية. أنت مقدر لك تحقيق قيم أعلى؛ يمكن بسهولة فقدان الحياة الأسرية والمكاسب المادية والمكانة الاجتماعية إذا التزمت بها بصرامة. يجب عليك التغلب على الحساسية والعصبية والأنانية وأخذ الحياة المادية والاجتماعية باستخفاف. أنت موهوب بالقدرة على الوصول إلى قمم روحية وتنوير الآخرين. في بعض الأحيان تعاني من خسائر مادية، مما يؤدي إلى خيبات أمل متكررة في علاقاتك وشراكاتك",
    expression_22_desc:
      "من المرجح أن تضعك القدرة على إدارة المشاريع الكبيرة بفعالية في منصب سلطة في مجال معين من العالم المادي في وقت ما من حياتك. من المحتمل أن يكون لديك مشاريع مهمة. لكن نجاحك سيعتمد على قدرتك على السيطرة على رغبتك في «تولي عمل أكثر مما يمكنك إدارته» ومنع وعيك الروحي من التدخل في نهجك العملي. من ناحية أخرى، إذا كنت تميل إلى العمل في المجالات الغامضة والخفية، فيمكنك أن تفعل الكثير من الخير للآخرين وتصبح موزعًا مشهورًا للنور",
    time_1_desc:
      "مليء بالأفكار الإبداعية، قوي الإرادة، مستقل، شجاع، ومقاتل. العيوب الكامنة هي العناد، وعدم الأمانة، والرغبة في السيطرة، والأنانية، مما يؤدي إلى موقف يدعي معرفة كل شيء. الحكمة هي التركيز الرئيسي. لديه مهارات تحليلية قوية. إذا استخدم بشكل صحيح، سيصبح شخصًا متعلمًا. عادة لا يجيب بنعم أو لا على الفور، سيفكر أولاً. مفصل للغاية في أشياء كثيرة. قوي جدًا في الإبداع ويقظ جدًا. هذه الخصائص ستؤدي إلى الثروة. جيد في الترفيه وموثوق في بناء العلاقات. عادة ما يتم تحقيق الثروة حوالي سن 32 إلى 42. لديه مهارات قيادية. غالبًا ما ينجذب الجنس الآخر. سيصبح أجمل أو أكثر جمالاً مع تقدم العمر - فوق الثلاثينيات وما بعدها، سيبدو أكثر وسامة/جمالاً. الجانب السلبي هو الشعور بالوحدة في كثير من الأحيان، والشعور وكأنه هائم. كن حذرًا عند تحليل شخص أو موقف، فالتحليل الخاطئ سيؤدي إلى مشاكل لا داعي لها",
    time_2_desc:
      "مليء بالسلام، متواضع، ودود، وله تأثير روحي. العيوب الكامنة هي الحساسية وسهولة التأذي، وإيلاء اهتمام كبير للأشياء الصغيرة إلى حد إضاعة الكثير من الوقت. ماهر وله شخصية لطيفة، وكثير الكلام. موثوق في العمل الذي يتضمن التعاون. هادئ جدًا، ودود، وطيب القلب. يؤكد دائمًا على الترتيب والنظافة ومنظم جدًا. على استعداد للعمل الجاد، ناضج جدًا في التفكير. عادة ما يختلط مع كبار السن. لديه القدرة على توجيه وإكمال المهام. الجانب السلبي هو الاستعداد للاستماع إلى آراء الآخرين، ولكن ربما ليس لاتباعها. عنيد، غالبًا ما يثير النميمة السيئة، ويميل إلى أن يكون 'مجرد كلام'. غيور جدًا في أمور الحب",
    time_3_desc:
      "مليء بالموهبة الفنية، روح قتالية، لديه القدرة على رؤية 3 خطوط زمنية. العيوب الكامنة هي الإسراف، الكلام الطائش، وصعوبة المسامحة. جذاب وبعيد النظر، ولكنه غير صبور للغاية. واضح ويعرف ما يريد وكيف وأين يحصل عليه. سريع جدًا في التمييز بين الخير والشر. يمكن أن يحتل منصبًا عاليًا، ويكون غنيًا ومزدهرًا. لديه حياة جيدة في نظر المجتمع. لديه قدرات ومواهب ويجيد الاستفادة من الموقف. سريع الغضب، ولكنه يهدأ بسرعة أيضًا. امرأة جميلة، أو رجل وسيم في شبابه. الجانب السلبي هو الميل إلى الاستخفاف بالأمور وعدم الحزم. يمكن أن يكون مؤذيًا في بعض الأحيان. أحيانًا يكون فظًا عند التحدث. هناك تقلبات في الزواج، وإذا لم يتم التعامل معها جيدًا، فقد تجلب كارثة وعنفًا. عادة ما يعتقد أنه على حق في كل ما يفعله ويقوله، بينما الآخرون على خطأ",
    time_4_desc:
      "مليء بالمسؤولية، التفكير العلمي، صادق ومخلص. العيوب الكامنة هي العناد، وحب الجدال والرغبة في السيطرة، وطبيعة مدمن العمل. ذكي، فني، ويتفوق في اختبارات الحياة. جدير بالثقة وسهل المعاشرة في المجتمع. مليء بالرحمة والكاريزما. هو بطبيعته مخطط ومفكر، يفكر قبل أن يتصرف. يحب السفر والعيش بأسلوب حياة حر. لديه قدرات في سن مبكرة جدًا. قادر على النهوض بسرعة بعد مواجهة صعوبات الحياة. إذا كانت امرأة، فهي تدلل شريكها. الجانب السلبي هو ضعف في تجميع الثروة. يجب أن يكون حذرًا في العلاقات أو الزواج، وإلا فإنه سينطوي على حوادث سيئة غير ضرورية",
    time_5_desc:
      "مليء بالطاقة الجنسية، حب الحرية والتغيير، مليء بالذكاء والأفعال السريعة، قادر على الترفيه. العيوب الكامنة هي الخيانة في 'الحب والزواج'، وعدم القدرة على السيطرة على القلق وعدم الرضا. له شخصية قوية جدًا. ولد بروح قيادية، وعادة ما يشغل منصبًا فوق كثير من الناس من حيث العمل. لديه غرائز قوية في أشياء كثيرة. واقعي ومجتهد. يمكنه التكيف والتأقلم مع الوضع أو الظروف الحالية. على الرغم من مواجهة عقبات الحياة، عند مواجهة مشاكل مالية، هناك دائمًا طريقة للتغلب عليها. الجانب السلبي هو أنه إذا كان من عائلة فقيرة، فله طبيعة عنيدة. إذا كان على الطريق الخطأ، فإنه يميل إلى الدوران في دوائر لغير غرض جيد، حتى أنه يميل إلى الكذب. صعب الإرضاء ومتطلب للغاية بشأن العديد من الأشياء والقضايا. تعلم ألا تكون كذلك حتى يقدرك الناس أكثر",
    time_6_desc:
      "مليء بالتوازن، نكران الذات، يستمتع بالأنشطة الإنسانية، مخلص وثابت في التفكير في رفاهية الآخرين. العيوب الكامنة هي حب المديح والشعبية، وعدم القدرة على السيطرة على النفس في التضحية. عنيد، قادر على إدارة الثروة والرفاهية. مهذب للغاية وذو ذوق رفيع. لديه حياة مهنية جيدة في الفنون أو الدين أو التعليم. يمكن أن يصبح شخصية مشهورة جدًا. لا يستمع بسهولة للآخرين، وخاصة الرؤساء، ولكنه يفكر ويهتم بالمرؤوسين. يعتني بالعائلة والأقارب المقربين. موجه نحو الأسرة. الجانب السلبي هو الغطرسة والفخر، وعدم الرغبة في القيام بأعمال بسيطة. من حيث العلاقات، هو متملك ويريد دائمًا السيطرة على كل شخص وكل شيء، لكنه عادة لن يعترف بذلك. تخلص من الرغبة في السيطرة حتى يحبك أحباؤك أكثر",
    time_7_desc:
      "مليء بالذكاء، الوحدة، الغموض، شخصية مليئة بالسحر. العيوب الكامنة هي صعوبة التعبير عن الذات، عدم الثقة في الآخرين، الاهتمام المفرط بالذات مما يؤدي إلى عدم فهم احتياجات 'الشريك'. مفصل في التعامل مع مختلف الأمور. لن ينسى أبدًا أي شخص ساعده. قادر على تغيير وتحويل الموقف. يستمتع بمطاردة الشهرة والثروة. موثوق في إدارة مجال الترفيه. يمكن أن يصبح شخصية روحية/زعيمًا دينيًا، عادة في الخمسينيات من العمر وما بعدها. الجانب السلبي هو حب الجدال، التردد/تغيير الآراء كثيرًا، والبطء في اتخاذ القرارات. يميل إلى أن يكون لديه مشاكل في الزواج. على الرغم من أنه جيد في الامتنان، إلا أن هناك ميلًا إلى أنه قد لا يظهر الامتنان تجاه الآخرين",
    time_8_desc:
      "مليء بالمثالية، مادي، حارس موثوق للأسرار. العيوب الكامنة هي الرغبة في التباهي بالقوة، ونقص الإنسانية، والعناد. كل شخص تقريبًا لديه الوقت 8 يحصل على مأساة كنتيجة نهائية. هادئ، محافظ، يميل إلى أن يكون سلبيًا، لكنه عاطفي بين الآخرين. مسؤول جدًا، على الرغم من أنه يشعر بالضغط في بعض الأحيان. مليء بالفضيلة وجدير بالثقة. لن يتلاعب بالناس. يبدو قاسيًا من الخارج، لكنه في الواقع لطيف من الداخل. الجانب السلبي هو أنه سريع الغضب، مماطل، ويميل إلى الانتظار والترقب. سيؤدي هذا غالبًا إلى ضياع الفرص. يحتاج إلى أن يكون أفضل في قراءة المواقف. الحذر الشديد لن يوصلك إلى أي مكان. كن واثقًا في وجهات نظرك وافعل الأشياء بطريقتك الخاصة. أحيانًا يكون غير واضح بشأن ما يفعله. إذا كان على الطريق الخطأ، فسيصبح متنمرًا، يريد السيطرة، أنانيًا، قاسيًا، ويفكر فقط في تقدمه",
    time_9_desc:
      "مليء بالإنسانية، كريم، رحيم، وله روح روحانية. العيوب الكامنة هي الحساسية المفرطة، التسرع في اتخاذ القرارات، الأنانية، التملك، عدم التسامح، وحتى عدم الأمانة. متفائل جدًا ومنفتح. يحب أن يبدو جميلًا/أنيقًا ويرتدي ملابس جيدة. متواضع، يبدو قاسيًا ولكنه لطيف من الداخل. يقظ وحساس للغاية. يعرف متى وكيف يهاجم ويدافع. جيد في كسب قلوب الناس. يفعل كل شيء بسرعة ولكن يفتقر إلى التفاصيل. عاطفي جدًا. موثوق في العمل. لديه أهداف وأحلام كبيرة. كل ما يفعله غالبًا ما يحصد النجاح أكثر من الفشل. الجانب السلبي هو الشعور بالوحدة غالبًا في سن الشيخوخة. هناك مستوى عال من الجشع بداخله. يميل إلى نسيان الاهتمام بالمرؤوسين. ليس لديه الكثير من الأصدقاء الحقيقيين. يميل نمط الحياة إلى أن يكون ماديًا",
    synchronize_desc:
      "قيمة التزامن هي معيار يشير إلى العلاقة بين الشفرة الداخلية للشخص والشفرات الخارجية، والقدرة على التفاعل مع البيئة، وسرعة اغتنام الفرص. يتراوح نطاق التزامن من ٠٫٠٥ إلى ١٫٠ أو من ٥٪ إلى ١٠٠٪. الأشخاص الناجحون والمنجزون في جميع مساعيهم، على النطاقين الصغير والكبير، لديهم قيمة تزامن تتراوح من ٠٫٨ إلى ١٫٠ أو من ٨٠٪ إلى ١٠٠٪. عند قيمة ٠٫١ / ١٠٪، تكون قدرتك على إتقان مجال ما صعبة وبطيئة للغاية، وتحتاج إلى شروحات متكررة في الدروس لتفهم القليل فقط، وقد تحتاج إلى التكيف عدة مرات اجتماعيًا، مما يجعلك على الأرجح شخصًا أقل ذكاءً. أما عند ٠٫٢ / ٢٠٪، فالإمكانات هي نفسها تقريبًا لمعيار ١٠٪، ولكن بمستوى قد يكون أسهل قليلاً. وعند ٠٫٣ / ٣٠٪، فإن إمكاناتك في إتقان مجال ما ليست جيدة، وهناك احتمال كبير بأن يتم نبذك من قبل من تعتبرهم أصدقاء، كما أن فهمك للدروس قد يكون خاطئًا. وبالنسبة لقيمة ٠٫٤ / ٤٠٪، هناك احتمال كبير أن تصبح ساعيًا لأصدقائك، وتضحي بكرامتك طواعية لمجرد الحصول على الرفقة، مع استمرار ارتكاب الأخطاء في فهمك للدراسة. عند ٠٫٥ / ٥٠٪، لا يهتم أصدقاؤك بك كثيرًا، ووجودك ليس مرغوبًا فيه، ومن المحتمل أنك لا تهتم بدراستك. وعند ٠٫٦ / ٦٠٪، تكون إمكاناتك متوسطة، حيث يتطلع جزء صغير من الناس لوجودك بينما لا تهتم الأغلبية، وفي دراستك تكون متوسطًا. أما عند ٠٫٧ / ٧٠٪، فإن إمكاناتك في مستوى آمن، ولديك العديد من الأصدقاء وتستطيع أن تكون انتقائيًا، وتفهم ما تتعلمه ببطء ولكن بثبات. وعند ٠٫٨ / ٨٠٪، من المحتمل جدًا أن تصبح مشهورًا بين أصدقائك ومرغوبًا فيه، لكنك أقل قدرة على اختيار الأصدقاء، وتفهم الدروس بسرعة. عند ٠٫٩ / ٩٠٪، تكمن إمكاناتك في حياتك الاجتماعية حيث يمكنك أن تشتهر بإنجازاتك، ويعتمد عليك الأصدقاء، وتفهم الدروس بسهولة كبيرة، لكنك أحيانًا تشعر أنك أذكى من الجميع وتعتبر بعض الأصدقاء عبئًا. وأخيرًا، عند قيمة ١٫٠ / ١٠٠٪، فإن إنجازاتك تخلق إعجابًا وهالة من السلطة والكاريزما، وأنت ذكي بشكل لا يصدق في فهم الدروس، ولكن لسوء الحظ، فإن احتمالية الأنانية بداخلك عالية جدًا، حيث تشعر أنك أفضل من أصدقائك وتفضل مصادقة من تعتبرهم مهمين",
    coherence_desc:
      "التماسك (Coherence) هو معيار يشير إلى القوة الهيكلية للشفرات الداخلية المترابطة للشخص، مما يوضح مستوى قدرته وسرعته في إتقان مجال من مجالات المعرفة أو المهارة. يتراوح نطاق التماسك من ٠٫١ إلى ١٫٠ أو من ١٠٪ إلى ١٠٠٪. الأشخاص الناجحون والمنجزون في حياتهم، في جميع مساعيهم سواء على نطاق صغير أو كبير، لديهم قيمة تماسك تتراوح بين ٠٫٧ و ١٫٠، أو من ٧٠٪ إلى ١٠٠٪.",

    // Numerology Results
    hara: "هارا",
    expression: "التعبير",
    time: "الوقت",
    dimensional_analysis: "التحليل الأبعاد",
    synchronize_score: "نقاط المزامنة",
    coherence_value: "قيمة التماسك",
    synergize_value: "قيمة التآزر",
    productive_value: "القيمة الإنتاجية",
    momen_sukses_value: "قيمة لحظة النجاح",
    grafologi_index: "مؤشر الخط",
    potential_suggestions: "اقتراحات محتملة",
    advanced_analysis: "تحليل متقدم",
    core_numbers: "الأرقام الأساسية",
    character_number: "رقم الشخصية",
    expression_number: "رقم التعبير",
    soul_number: "رقم الروح",
    personality_number: "رقم الشخصية",
    number_intensity: "كثافة الأرقام",
    personal_development: "التطوير الشخصي",
    self_potential: "الإمكانات الذاتية",
    attitude_number: "رقم الموقف",
    growth_number: "رقم النمو",
    birth_date_analysis: "تحليل تاريخ الميلاد",
    day: "يوم",
    month: "شهر",
    year: "سنة",
    pythagorean_analysis: "التحليل الفيثاغوري",
    soul_urge: "دافع الروح",
    personality: "الشخصية",
    challenge_numbers: "أرقام التحدي",
    challenge: "تحدي",
    current_year_analysis: "تحليل السنة الحالية",
    personal_year_number: "رقم السنة الشخصية",
    premium_analysis: "تحليل مميز",
    upgrade_to_premium: "الترقية إلى المميز",
    parameter_detail: "تفاصيل المعامل",
    close: "إغلاق",
    // Numerology Form
    numerology_analysis: "التحليل العددي",
    basic_analysis: "تحليل أساسي",
    advanced_analysis: "تحليل متقدم",
    full_name: "الاسم الكامل",
    enter_full_name: "أدخل اسمك الكامل",
    normalized: "مُطبع",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    birth_date: "تاريخ الميلاد",
    select_birth_date: "اختر تاريخ الميلاد",
    cancel: "إلغاء",
    done: "تم",
    advanced_analysis_features: "ميزات التحليل المتقدم:",
    life_path_number: "• رقم مسار الحياة (هارا)",
    expression_number_feature: "• رقم التعبير",
    soul_urge_number: "• رقم دافع الروح",
    personality_number_feature: "• رقم الشخصية",
    maturity_number: "• رقم النضج",
    personal_year_number_feature: "• رقم السنة الشخصية",
    analyze: "تحليل",
    // Name Generator
    personal_name_optimizer: "محسن الاسم الشخصي",
    baby_name_generator: "مولد أسماء الأطفال",
    personal_name: "اسم شخصي",
    baby_name: "اسم طفل",
    generation_mode: "وضع التوليد",
    add_one_word: "إضافة كلمة واحدة",
    add_some_word: "إضافة بعض الكلمات",
    your_first_name: "اسمك الأول",
    family_name_optional: "اسم العائلة (اختياري)",
    enter_first_name: "أدخل اسمك الأول",
    enter_family_name: "أدخل اسم العائلة (اختياري)",
    name_origin: "أصل الاسم",
    generate_names: "توليد الأسماء",
    advanced_search: "بحث متقدم",
    jalankan_lanjut_combi: "تشغيل/متابعة كومبي",
    suggested_names: "أسماء مقترحة",
    generated_from: "مُولد من:",
    no_matching_names: "لم يتم العثور على أسماء مطابقة. جرب معاملات مختلفة.",
    // Compatibility Checker
    compatibility_checker: "فاحص التوافق",
    person_1: "الشخص 1",
    person_2: "الشخص 2",
    check_compatibility: "فحص التوافق",
    compatibility_results: "نتائج التوافق",
    compatibility_areas: "مجالات التوافق",
    detailed_analysis_unlocked: "تحليل مفصل - مفتوح!",
    all_premium_features_available:
      "جميع الميزات المميزة متاحة الآن لتحليل التوافق الخاص بك.",
    // Life Report
    life_report: "تقرير الحياة",
    life_path: "مسار الحياة",
    year_life_report: "تقرير حياة 100 سنة",
    daily_advice: "نصيحة يومية",
    daily_advice_calendar: "تقويم النصائح اليومية",
    select_date: "اختر التاريخ",
    monthly_advice_calendar: "تقويم النصائح الشهرية",
    legend: "وسيلة الإيضاح:",
    // G1-G9 Descriptions
    g1_desc:
      "مستقل وموجه نحو القيادة، مع مبادرة قوية وروح رائد. قائد بالفطرة مع قدرات إبداعية.",
    g2_desc:
      "تعاوني ودبلوماسي، ممتاز في الشراكات والعمل الجماعي. صبور ومهتم بالتفاصيل مع قدرات حدسية قوية.",
    g3_desc:
      "مبدع ومعبر، مع مهارات تواصل قوية. مواهب فنية ونظرة متفائلة للحياة.",
    g4_desc:
      "عملي ومنظم، مع أخلاقيات عمل قوية واهتمام بالتفاصيل. موثوق ومنهجي في النهج.",
    g5_desc:
      "محب للحرية ومغامر، مع رغبة قوية في التنوع والتغيير. شخصية ديناميكية ومتعددة الاستخدامات.",
    g6_desc: "مغذي ومسؤول، مع توجه عائلي قوي. مهتم وداعم مع قدرات شفاء.",
    g7_desc: "تحليلي وتأملي، مع ميول روحية قوية. باحث وساعي للحقيقة والحكمة.",
    g8_desc:
      "طموح وموجه نحو الأعمال، مع تركيز مادي قوي. منظم طبيعي مع قدرات تنفيذية.",
    g9_desc:
      "إنساني وكريم، مع رغبة قوية في خدمة الآخرين. رحيم ومتفهم مع نظرة عالمية.",
  },
  zh: {
    // Home Screen
    welcome_back: "欢迎回来，",
    all_premium_features_unlocked: "所有高级功能已解锁！",
    quick_actions: "快速操作",
    name_analysis: "姓名分析",
    love_couple: "恋人情侣",
    dictio_name: "姓名词典",
    generator_name_optimizer: "姓名生成器优化器",
    lifeplan_report: "人生规划报告",
    successful_people: "成功人士",
    synchronize: "同步",
    coherence: "连贯性",
    momentum: "动力",
    discover_power_names:
      "通过我们全面的分析工具发现姓名的力量。想要拥有像他们一样的价值观吗？>> 了解更多",
    earn_free_credits: "赚取免费积分",
    share_with_friends: "与朋友分享以解锁高级功能",
    share_now: "立即分享",
    // Tab Bar
    home: "首页",
    analyze: "分析",
    names: "姓名",
    match: "匹配",
    account: "账户",
    // Common
    language: "语言",
    // Parameter Details
    hara_1_desc:
      "🤠 积极独立和自力更生，新（开始）发展，通常由新事物/工作/项目、搬迁、职业变动或类似的重大举措引发。独立性和力量，可能成为个人主义者。可能拥有权威/抵抗支配性人物的能力。个人拥有更多盈利的商业机会，但如果以合作的方式进行则不太合适/盈利较少。财务和冒险方面有很大的幸运潜力。倾向于从多个来源获得支持。长期来看，你将财务稳定、实力雄厚，并在商业上取得成功",
    hara_2_desc:
      "🤝良好的长期关系有助于增进人脉与合作。短期内，有可能在商业或人际关系中建立新的联系，增强对生活的感恩之心，对生活和商业直觉更加敏感，愿意与他人合作，易于谈判且睿智。长期来看，顺畅的人际关系也有可能带来成功，财务和经济状况也更加顺畅",
    hara_3_desc:
      "💡创意和想法的潜力，轻松的性格和对所有需要控制的事物的享受。在短期阶段，创造力和原创性的行动潜力，自我表达的增加。这是资本。充满灵感、动力和生活理念。在社交时，你会带来舒适，有可能体验充满旅行的生活并激励他人。将增加物质世界/金钱的其他乐趣",
    hara_4_desc:
      "✔️事业和人际关系有望增强，前进，责任切实完成。短期内，可能出现前景光明的商业机会，与当局（尤其是机构及其监管）的矛盾消失。财务状况正在好转。力量和决心可以帮助您实现计划。长期来看，您的事业和财务状况有望改善。您还可能期待人际关系的加强，尤其是与亲近之人",
    hara_5_desc:
      "❌潜在的不良倾向，不幸，容易被欺骗，背叛，不幸，疾病，结局不好。必须更改或添加姓名。容易被人欺骗，可能经常遭遇厄运和坏事，平均而言，其他结尾代码参数中发生的负面事情也会出现在这个数字中。因此，如果您的姓名包含结尾代码，则应谨慎处理。此外，它还可能容易被人欺骗，被朋友和其他人背叛",
    hara_6_desc:
      "🏡在家庭、社交、帮助老少、改善、疗愈和进步方面有发展潜力。短期内，您有机会融入家庭，取悦并帮助不同世代的人。您有可能对环境和政治议题产生兴趣，也有可能成为更有责任感的人。长期来看，您有可能获得看似美好的前景。在生活的各个方面，您都有可能获得改善、疗愈和进步",
    hara_7_desc:
      "😠潜在的财务问题、情感冲突（导致不幸）、反复无常、神经紊乱、细胞异常。短期：生活中会经历分配困难和财务问题。长期：患癌症、肿瘤和情感冲突（例如三角恋）的可能性较高",
    hara_8_desc:
      "🤕 旅途可能不愉快，必须小心，以免受伤、生病（恢复期较长）、误诊、结局不好（严重影响)",
    hara_9_desc:
      "🤧潜在的财务混乱、毒品混乱或毒品插入、不健康/经历疾病（如病毒爆发）以及由于其他方的行为而导致的悲惨结局（任何事情)",
    hara_11_desc:
      "🤢生意失败、成为替罪羊、心理压力或背叛、复杂情况、因原则不同而分离、健康问题",
    hara_13_desc:
      "😳对家庭或生意结果可能感到失望（破产、亏损）、被亲近的人背叛，以及无法从所做的所有努力中获得最大和最佳的结果",
    expression_1_desc:
      "你注定会成为你专业领域的领导者。学会依靠自己的能力，展现勇气和决心，并避免以自我为中心等消极方面。人们会不时向你寻求建议，你必须为此做好准备。你天生就是要在专业领域成为一个杰出的人",
    expression_2_desc:
      "合作、外交与和平共处是人生的目标。发展是通过伙伴关系而不是自主实现的。你可能需要不时地进行调解和恢复和平。合作、分享和联合将引导你走向成功。如果能避免消极方面，你将被公认为和平的缔造者",
    expression_3_desc:
      "只要善用才华，受欢迎、个人和他人的幸福、爱情、浪漫和物质财富将是人生的显著特征。你是他人的快乐之源，你生来就是为了让他们快乐。通过你的想象力、真诚和幽默感，你注定要在创造性层面上启迪人类",
    expression_4_desc:
      "你注定要承担责任，别人会依赖你的帮助和支持。建设、组织和管理将占据你的一生。家庭问题会经常萦绕在你心头，生活的束缚可能会让你烦躁。通过耐心、决心、秩序、真诚、诚实和服务意识，如果你克服了困难，你将确保他人和自己的安全",
    expression_5_desc:
      "你生来就与他人互动，并促进“自由”和“进步”。变化、新环境、新方法、多样性、多才多艺和意想不到的事情将是你生活的显著特征。你可能会发现在相同的基础上或与相同的人长时间工作很困难。如果能控制消极因素，你将教会他人实现“自由”并快乐地生活",
    expression_6_desc:
      "你来到这个世界是为了以爱、责任感、责任心和仁慈服务人类。你将被公认为一个可靠的人。对你所爱的人要慷慨，但不要ถึง牺牲的地步。在你的一生中，会有人敲你的门寻求帮助，你为他人做得越多，你就会被越多的爱、舒适和金钱所包围。为了你自己的进步，你需要美丽、陪伴、爱与和谐。你能够探索人生的哲理，并达到精神上的高峰",
    expression_Texpression_7_desc:
      "你注定要在科学、犯罪学、哲学或宗教领域寻找智慧或隐藏的真理。即使在人群中，你也可能发现自己是孤独的，你可能与众不同。你可能会深入研究人生的哲理；实验、检验和证明他人发现的事实。你应该因为所获得的知识而受到欢迎、爱戴和尊重，并被称为教育家。在你所走的艰难道路上，个人事业、爱情甚至婚姻都可能被牺牲，但你可能会在发现真理（更多是在神秘或精神方面）和教育人民中获得更大的满足感",
    expression_8_desc:
      "管理、组织和行政应能使你获得权威和认可。你将不得不不时对人和事做出正确的评估，这不是一项容易的任务。如果哲学能力得到发展并做出公正的判断，你的回报将是它的实现。金钱可能不总是发展的方向，你可能因商业而闻名",
    expression_9_desc:
      "你注定在慈善、人道主义或慈善领域变得受欢迎。兄弟之爱和为人类服务将是你个性的一个组成部分，而爱情、浪漫、音乐和艺术应该会让你深感兴趣。同情心、慷慨和对他人的需求理解将使你非常受欢迎。自私、自爱和缺乏宽恕可能被证明是有害的并导致失望。不带个人色彩，发展普世之爱，可以使你成为精神领袖",
    expression_11_desc:
      "如果能控制消极方面，灵感、精神意识（通常是潜在的）、直觉和心灵能力可以带来内心的幸福和启迪。你注定要达到更高的价值观；如果你严格遵守，家庭生活、物质收益和社会地位很容易失去。你必须克服敏感、紧张和以自我为中心，并轻松看待物质和社会生活。你被赋予了达到精神高峰和启迪他人的力量。你有时会遭受物质损失，这会导致你在人际关系和伙伴关系中反复失望",
    expression_22_desc:
      "有效管理大型项目的能力可能会让你在人生的某个时刻在物质世界的特定领域处于权威地位。你可能会有重要的项目。但你的成功将取决于你控制“承担超出你能力范围的工作”的欲望的能力，并防止你的精神意识干扰你的实际方法。另一方面，如果你倾向于在神秘和玄学领域工作，你可以为他人做很多好事，并成为著名的光明传播者",
    time_1_desc:
      "充满创意，意志坚强，独立，勇敢，是一名斗士。固有的缺点是固执、不诚实、渴望支配和自私，这导致了一种自以为是的态度。智慧是主要焦点。具有很强的分析能力。如果使用得当，将成为一个有学问的人。通常不会立即回答“是”或“否”，会先思考。在很多事情上都非常细致。在创造力方面非常强，并且非常警惕。这些特质将带来财富。擅长娱乐，在建立关系方面可靠。财富通常在32至42岁左右获得。具有领导才能。异性常常被吸引。随着年龄的增长会变得更好看或更美丽——30多岁以后，会显得更英俊/美丽。消极的一面是常常感到孤独，感觉自己像个流浪者。在分析一个人或一种情况时要小心，错误的分析会导致不必要的问题。",
    time_2_desc:
      "充满和平，谦逊，友好，并具有精神影响力。固有的缺点是敏感且容易受伤，过分关注小事以至于浪费大量时间。技术娴熟，性格开朗，健谈。在涉及合作的工作中可靠。非常冷静，友好，心地善良。总是强调整洁、干净，并且非常有条理。愿意努力工作，思想非常成熟。通常与年长的人交往。有能力指导和完成任务。消极的一面是愿意听取他人的意见，但可能不会采纳。固执，常常引发恶意的八卦，并倾向于“光说不练”。在爱情问题上非常嫉妒。",
    time_3_desc:
      "充满艺术才华，斗志昂扬，有能力看到3个时间线。固有的缺点是浪费、言语轻率和难以原谅。有吸引力且有远见，但非常不耐烦。思路清晰，知道自己想要什么，以及如何和在哪里得到它。能非常迅速地分辨好坏。可以占据高位，富有和繁荣。在社会眼中生活得很好。有能力和才华，并善于利用形势。脾气来得快，去得也快。年轻时是美女或俊男。消极的一面是倾向于轻视事物且不坚定。有时可能很淘气。说话时有时很粗鲁。婚姻中有起有落，如果处理不当，可能会带来灾难和暴力。通常认为自己所做所说的一切都是对的，而别人是错的。",
    time_4_desc:
      "充满责任感，科学思维，诚实和忠诚。固有的缺点是固执，喜欢辩论和渴望支配，以及工作狂的性质。聪明，有艺术气息，在人生的考验中表现出色。值得信赖，在社会上容易相处。充满同情心和魅力。天生是计划者和思考者，三思而后行。喜欢旅行和过自由的生活方式。在很小的时候就展现出能力。能够在经历生活困难后迅速崛起。如果是女性，她会溺爱她的伴侣。消极的一面是积累财富方面的弱点。在关系或婚姻中必须小心，否则会涉及不必要的糟糕事件。",
    time_5_desc:
      "充满性能量，热爱自由和变革，充满智慧和迅速的行动，能够娱乐他人。固有的缺点是在“爱情和婚姻”中不忠，以及无法控制不安和不满。性格非常坚强。天生具有领导者的灵魂，在工作上通常处于高于许多人的位置。在很多事情上都有很强的直觉。现实且努力工作。能够适应和调整当前的情况或环境。尽管面临生活中的障碍，但在面对财务问题时，总有办法克服。消极的一面是如果来自贫困家庭，性格固执。如果走上错误的道路，往往会为了不正当的目的而兜圈子，甚至倾向于说谎。对许多事情和问题都非常挑剔和吹毛求疵。学会不要这样，人们会更欣赏你。",
    time_6_desc:
      "充满平衡，无私，乐于从事人道主义活动，忠诚并坚定地为他人谋福利。固有的缺点是喜爱赞美和声望，以及在牺牲中无法自控。坚韧，能够管理财富和福祉。非常有礼貌，品味高雅。在艺术、宗教或教育领域有良好的职业生涯。可以成为一个颇受欢迎的人物。不容易听取他人，特别是上级的意见，但会思考并关注下属。照顾家人和近亲。以家庭为重。消极的一面是傲慢和自负，不愿做简单的工作。在关系方面，占有欲强，总是想控制每一个人和每一件事，但通常不会承认。戒掉支配欲，你所爱的人会更爱你。",
    time_7_desc:
      "充满智慧，孤独，神秘主义，一个充满魅力的个性。固有的缺点是难以自我表达，不信任他人，过分关注自我导致不理解“伴侣”的需求。处理各种事务都很细致。永远不会忘记任何帮助过他的人。能够改变和扭转局势。喜欢追求名声和财富。在管理娱乐领域方面可靠。可以成为精神人物/宗教领袖，通常在50多岁以后。消极的一面是喜欢辩论，优柔寡断/经常改变意见，以及决策缓慢。倾向于有婚姻问题。虽然善于感恩，但有一种倾向是他们自己可能不会对他人表示感激。",
    time_8_desc:
      "充满理想主义，物质主义，是值得信赖的秘密守护者。固有的缺点是渴望炫耀权力，缺乏人情味和固执。几乎所有时间8的人最终都会遭遇悲剧。安静，保守，倾向于被动，但在他人中充满激情。非常负责，尽管有时感到压力。充满美德，值得信赖。不会玩弄别人。外表看起来坚强，但内心其实很柔软。消极的一面是脾气暴躁，拖延，倾向于等待和观望。这常常会导致错失良机。需要更善于审时度势。过于小心将一事无成。相信自己的观点，按自己的方式做事。有时不清楚自己在做什么。如果走上错误的道路，他们会成为一个恶霸，想要支配，自私，残忍，只考虑自己的发展。",
    time_9_desc:
      "充满人性，慷慨，富有同情心，并具有精神灵魂。固有的缺点是过于敏感，决策草率，自私，占有欲强，不宽容，甚至不诚实。非常乐观和思想开放。喜欢看起来漂亮/时髦并穿着得体。不张扬，外表看起来坚强但内心柔软。非常警觉和敏感。知道何时以及如何进攻和防守。善于赢得人心。做事迅速但缺乏细节。相当情绪化。工作可靠。有远大的目标和梦想。所做之事多半成功。消极的一面是晚年常常感到孤独。内心有很高的贪婪程度。倾向于忘记关注下属。没有多少真正的朋友。生活方式倾向于物质主义。",
    synchronize_desc:
      "同步值 (Synchronize Value) 是一个参数，它表示一个人的内在准则与外部准则之间的关系、与环境互动的能力以及抓住机遇的速度。同步值的范围是0.05到1.0，即5%到100%。在所有大小事务上成功和有成就的人，其同步值在0.8到1.0之间，即80%到100%。同步值：0.1 / 10%. 你掌握一个领域的能力极度困难且缓慢。在学习中，你需要反复的解释才能理解一点点。在社交上，你可能需要多次适应。如果你的同步值在10%，你可能是一个不太聪明的人。同步值：0.2 / 20%. 潜力与10%的参数几乎相同，但水平可能比10%的水平稍容易一些。同步值：0.3 / 30% 如果你在智能潜力参数上也是30%，那么你掌握一个领域的潜力不是很好。虽然你进行社交，但很有可能会被你认为是朋友的人排斥。对于你觉得已经理解的课程，你的理解方式很可能存在错误。同步值：0.4 / 40% 你很有可能成为朋友们的“跑腿的”。说白了，你有可能为了有伴而愿意牺牲自尊。在学习中，你理解课程的方式仍然经常出错。同步值：0.5 / 50% 在你的社交生活中，你的朋友不太在乎你，尽管有人愿意成为你的朋友。他们并不是特别期望你的出现。在学习上，你可能不在乎你正在学习的科目，即使是那些你应该学习的科目.同步值：0.6 / 60%. 这是你掌握一个领域的潜力，尤其是在社交互动和友谊方面。一小部分人期待你的出现，但大多数人似乎不在乎你是否在他们中间。在学习上，你非常普通，有时能够理解你正在学习的内容。同步值：0.7 / 70%. 如果数字是70%，你掌握一个领域的潜力处于安全水平。你有很多朋友，但你能够有选择性地交友。你非常清楚什么是好的，什么是不好的，尽管有时你会忽略它。在学习上，缓慢但坚定地，你能够理解你所学的内容。同步值：0.8 / 80%. 你很有可能在朋友中变得受欢迎；你的出现备受期待，你通常有一种非凡的气场。然而，你在选择朋友方面能力较差，以“交友不分对象”为由想和所有人交朋友。在学习上，你理解所学内容的速度相当快。同步值：0.9 / 90%. 你的潜力在于你的社交生活；你很可能因为成就而闻名。许多朋友在做事时依赖你。你非常聪明，可以轻松理解任何你学习的课程。不幸的是，你有时会觉得自己比任何人都聪明，因此认为许多朋友是你的负担。同步值：1.0 / 100% 你的成就和你所创造的轰动效应会让你周围的许多人钦佩和好奇，从而散发出权威和魅力的光环。你在理解任何你学习的课程方面都非常聪明和智慧。不幸的是，你内心的自私潜力非常高，因为你常常觉得自己比那些认为你重要的朋友更优秀，并且你更喜欢与你认为重要的人交朋友",
    coherence_desc:
      "内聚性 (Coherence) 是一个参数，它表示一个人内在准则相互关联的结构强度，显示了其在掌握知识或技能领域的能力水平和速度。内聚性的范围是 0.1 – 1.0，即 10% 到 100%。在生活中成功且有成就的人，无论其事业规模大小，其内聚性值都在 0.7 到 1.0 之间，即 70% 到 100%",
    // Numerology Results
    hara: "哈拉",
    expression: "表达",
    time: "时间",
    dimensional_analysis: "维度分析",
    synchronize_score: "同步分数",
    coherence_value: "连贯性值",
    synergize_value: "协同值",
    productive_value: "生产力值",
    momen_sukses_value: "成功时刻值",
    grafologi_index: "笔迹学指数",
    potential_suggestions: "潜在建议",
    advanced_analysis: "高级分析",
    core_numbers: "核心数字",
    character_number: "性格数字",
    expression_number: "表达数字",
    soul_number: "灵魂数字",
    personality_number: "个性数字",
    number_intensity: "数字强度",
    personal_development: "个人发展",
    self_potential: "自我潜能",
    attitude_number: "态度数字",
    growth_number: "成长数字",
    birth_date_analysis: "出生日期分析",
    day: "日",
    month: "月",
    year: "年",
    pythagorean_analysis: "毕达哥拉斯分析",
    soul_urge: "灵魂冲动",
    personality: "个性",
    challenge_numbers: "挑战数字",
    challenge: "挑战",
    current_year_analysis: "当前年份分析",
    personal_year_number: "个人年数字",
    premium_analysis: "高级分析",
    upgrade_to_premium: "升级到高级版",
    parameter_detail: "参数详情",
    close: "关闭",
    // Numerology Form
    numerology_analysis: "数字学分析",
    basic_analysis: "基础分析",
    advanced_analysis: "高级分析",
    full_name: "全名",
    enter_full_name: "输入您的全名",
    normalized: "标准化",
    gender: "性别",
    male: "男性",
    female: "女性",
    birth_date: "出生日期",
    select_birth_date: "选择出生日期",
    cancel: "取消",
    done: "完成",
    advanced_analysis_features: "高级分析功能：",
    life_path_number: "• 生命路径数字（哈拉）",
    expression_number_feature: "• 表达数字",
    soul_urge_number: "• 灵魂冲动数字",
    personality_number_feature: "• 个性数字",
    maturity_number: "• 成熟数字",
    personal_year_number_feature: "• 个人年数字",
    analyze: "分析",
    // Name Generator
    personal_name_optimizer: "个人姓名优化器",
    baby_name_generator: "婴儿姓名生成器",
    personal_name: "个人姓名",
    baby_name: "婴儿姓名",
    generation_mode: "生成模式",
    add_one_word: "添加一个词",
    add_some_word: "添加一些词",
    your_first_name: "您的名字",
    family_name_optional: "姓氏（可选）",
    enter_first_name: "输入您的名字",
    enter_family_name: "输入姓氏（可选）",
    name_origin: "姓名来源",
    generate_names: "生成姓名",
    advanced_search: "高级搜索",
    jalankan_lanjut_combi: "运行/继续组合",
    suggested_names: "建议姓名",
    generated_from: "生成自：",
    no_matching_names: "未找到匹配的姓名。请尝试不同的参数。",
    // Compatibility Checker
    compatibility_checker: "兼容性检查器",
    person_1: "人员1",
    person_2: "人员2",
    check_compatibility: "检查兼容性",
    compatibility_results: "兼容性结果",
    compatibility_areas: "兼容性领域",
    detailed_analysis_unlocked: "详细分析 - 已解锁！",
    all_premium_features_available: "您的兼容性分析现在可以使用所有高级功能。",
    // Life Report
    life_report: "生活报告",
    life_path: "生命路径",
    year_life_report: "100年生活报告",
    daily_advice: "每日建议",
    daily_advice_calendar: "每日建议日历",
    select_date: "选择日期",
    monthly_advice_calendar: "每月建议日历",
    legend: "图例：",
    // G1-G9 Descriptions
    g1_desc:
      "独立且具有领导导向，具有强烈的主动性和开拓精神。天生的领导者，具有创造能力。",
    g2_desc:
      "合作且外交，在伙伴关系和团队合作方面表现出色。耐心且注重细节，具有强烈的直觉能力。",
    g3_desc:
      "富有创造力和表现力，具有强烈的沟通技巧。艺术天赋和对生活的乐观态度。",
    g4_desc:
      "实用且有组织，具有强烈的工作道德和对细节的关注。可靠且方法系统化。",
    g5_desc:
      "热爱自由且富有冒险精神，对多样性和变化有强烈渴望。动态且多才多艺的个性。",
    g6_desc: "养育且负责任，具有强烈的家庭导向。关怀且支持，具有治愈能力。",
    g7_desc: "分析且内省，具有强烈的精神倾向。研究者和真理与智慧的寻求者。",
    g8_desc:
      "雄心勃勃且以商业为导向，具有强烈的物质焦点。天生的组织者，具有执行能力。",
    g9_desc:
      "人道主义且慷慨，具有强烈的服务他人的愿望。富有同情心和理解力，具有普世观。",
  },
  hi: {
    // Home Screen
    welcome_back: "वापसी पर स्वागत है,",
    all_premium_features_unlocked: "सभी प्रीमियम सुविधाएं अनलॉक हो गईं!",
    quick_actions: "त्वरित कार्य",
    name_analysis: "नाम विश्लेषण",
    love_couple: "प्रेमी जोड़ा",
    dictio_name: "नाम शब्दकोश",
    generator_name_optimizer: "नाम जेनरेटर ऑप्टिमाइज़र",
    lifeplan_report: "जीवन योजना रिपोर्ट",
    successful_people: "सफल लोग",
    synchronize: "सिंक्रोनाइज़",
    coherence: "सुसंगति",
    momentum: "गति",
    discover_power_names:
      "हमारे व्यापक विश्लेषण उपकरणों के माध्यम से नामों की शक्ति की खोज करें। उनके जैसे मूल्य रखना चाहते हैं? >> और जानें",
    earn_free_credits: "मुफ्त क्रेडिट कमाएं",
    share_with_friends:
      "प्रीमियम सुविधाओं को अनलॉक करने के लिए दोस्तों के साथ साझा करें",
    share_now: "अभी साझा करें",
    // Tab Bar
    home: "होम",
    analyze: "विश्लेषण",
    names: "नाम",
    match: "मैच",
    account: "खाता",
    // Common
    language: "भाषा",
    // Parameter Details
    hara_1_desc:
      "🤠स्वतंत्रता और आत्मनिर्भरता में सकारात्मक, नए (शुरुआती) विकास, आमतौर पर एक नई चीज़/नौकरी/प्रोजेक्ट, स्थानांतरण, करियर में बदलाव या इसी तरह के बड़े कदम से शुरू होते हैं। स्वतंत्रता और ताकत, एक व्यक्तिवादी होने की संभावना। प्रमुख व्यक्तियों के लिए अधिकार/प्रतिरोध की संभावना। व्यक्तियों के लिए अधिक लाभदायक व्यवसाय के अवसर लेकिन सहकारी तरीके से किए जाने पर कम उपयुक्त/लाभदायक। वित्त और रोमांच में अच्छे भाग्य की बहुत संभावना होगी। कई स्रोतों से समर्थन मिलने की संभावना है। लंबे चरण में आप आर्थिक रूप से स्थिर, मजबूत और व्यवसाय में सफल रहेंगे।",
    hara_2_desc:
      "🤝बढ़े हुए संपर्क और सहयोग, अच्छे और दीर्घकालिक संबंधों से सहायता प्राप्त होती है। लघु चरण में, व्यापार या रिश्तों में नए कनेक्शन की संभावना होती है, जीवन के प्रति कृतज्ञता की जागरूकता बढ़ती है, जीवन और व्यावसायिक प्रवृत्तियों के प्रति संवेदनशीलता बढ़ती है, दूसरों के साथ साझेदारी करने की इच्छा होती है, बातचीत करने में आसानी होती है और समझदारी होती है। दीर्घ चरण में, सहज संबंध, सफलता, सुचारू वित्त और अर्थव्यवस्था की भी संभावना होती है",
    hara_3_desc:
      "💡रचनात्मकता और विचारों की क्षमता, सहज व्यक्तित्व, हर उस चीज़ का आनंद लें जिसे नियंत्रित करने की आवश्यकता है। अल्पावधि में, रचनात्मक और मूल कार्यों की क्षमता, आत्म-अभिव्यक्ति में वृद्धि। यह पूंजी है। प्रेरणा, प्रेरणा और जीवन दर्शन से भरपूर। सामाजिकता के दौरान, आप दूसरों को आराम पहुँचाएँगे, यात्रा से भरपूर जीवन का अनुभव करेंगे और दूसरों को प्रेरित करेंगे। यह भौतिक दुनिया/धन के अन्य सुखों को भी बढ़ाएगा",
    hara_4_desc:
      "✔️करियर और रिश्तों में मजबूती, आगे बढ़ने, व्यावहारिक रूप से जिम्मेदारियां पूरी होने की संभावना है। छोटे चरण में, आशाजनक व्यावसायिक अवसरों की संभावना है, अधिकारियों, विशेष रूप से संस्थानों और उनके नियमों के साथ कठिनाइयों का गायब होना। वित्तीय स्थिति में वृद्धि हो रही है। ताकत और दृढ़ संकल्प आपको अपनी योजनाओं को साकार करने में मदद कर सकते हैं। लंबे चरण में, आपके पास करियर और वित्त में सुधार का अनुभव करने की क्षमता है। आप एक मजबूत रिश्ते की भी उम्मीद कर सकते हैं, खासकर अपने किसी करीबी के साथ।",
    hara_5_desc:
      "❌संभावित बुरी प्रवृत्तियाँ, बदकिस्मत, आसानी से मूर्ख बनने की प्रवृत्ति, विश्वासघात, दुर्भाग्य, बीमारी, बुरी तरह से समाप्त होना। नाम को बदलना या जोड़ना होगा। लोगों द्वारा आसानी से मूर्ख बनाया जाना, संभावित रूप से अक्सर बुरी किस्मत और बुरी चीजों का अनुभव करना, औसतन नकारात्मक चीजें जो अन्य अंत कोड मापदंडों में होती हैं, वे भी इस संख्या में होती हैं। इसलिए यदि आपके नाम में एंडिंग कोड है तो आपको सावधान रहना चाहिए। इसके अलावा, इसमें लोगों द्वारा आसानी से मूर्ख बनाए जाने, दोस्तों द्वारा धोखा दिए जाने और अन्य लोगों द्वारा धोखा दिए जाने की संभावना है।",
    hara_6_desc:
      "🏡 पारिवारिक, सामाजिक, युवा और वृद्धों की मदद, सुधार, उपचार, प्रगति के मामले में विकास की संभावना। छोटे चरण में खुद को परिवार में शामिल करने, विभिन्न पीढ़ियों को खुश करने और उनकी मदद करने का अवसर है। पर्यावरण और राजनीतिक मुद्दों में रुचि का अनुभव करने की क्षमता और आपको अधिक जिम्मेदार व्यक्ति बनाने की क्षमता भी है। लंबे चरण में ऐसी संभावनाएँ मिलने की संभावना है जो बहुत अच्छी लगती हैं। आपके जीवन के सभी क्षेत्रों में सुधार, उपचार और प्रगति का अनुभव करने की क्षमता है।",
    hara_7_desc:
      "😠संभावित वित्तीय समस्याएँ, भावनात्मक संघर्ष (दुर्भाग्य का कारण), चंचलता, तंत्रिका विकार, असामान्य कोशिकाएँ। लघु चरण: जीवन में आवंटन में कठिनाइयों का अनुभव होगा और वित्तीय समस्याओं का अनुभव होगा। दीर्घ चरण: कैंसर और ट्यूमर और भावनात्मक संघर्षों की उच्च संभावना (उदाहरण प्रेम त्रिकोण)",
    hara_8_desc:
      "🤕 अप्रिय यात्रा की संभावना, चोट न लगने, बीमार न पड़ने (लंबी रिकवरी), गलत निदान, कुछ बुरी तरह से समाप्त होने (गंभीर प्रभाव) के प्रति सावधान रहना चाहिए",
    hara_9_desc:
      "🤧संभावित वित्तीय व्यवधान, दवा व्यवधान या दवा सम्मिलन, अस्वस्थ/वायरल प्रकोप जैसी बीमारियों का अनुभव करना और अन्य पक्षों द्वारा किए गए कार्यों के कारण बुरी तरह समाप्त होना (कुछ भी)",
    hara_11_desc:
      "🤢व्यापार में असफलता, बलि का बकरा बनने, मनोवैज्ञानिक दबाव या विश्वासघात, जटिलताएं, पिसाह बदा प्रिंसिपल, गंगुआ केस्ट रोग",
    hara_13_desc:
      "😳घरेलू या व्यावसायिक परिणामों (दिवालियापन, हानि) से संभावित निराशा, करीबी लोगों द्वारा विश्वासघात, और किए गए सभी प्रयासों से अधिकतम और इष्टतम परिणाम प्राप्त करने में असमर्थता।",
    expression_1_desc:
      "आप अपने पेशेवर क्षेत्र में एक नेता बनने के लिए नियत हैं। अपनी क्षमताओं पर भरोसा करना सीखें, साहस और दृढ़ संकल्प दिखाएं, और अहंकार जैसे नकारात्मक पहलुओं से बचें। आपसे समय-समय पर सलाह मांगी जाएगी, और आपको इसके लिए तैयार रहना चाहिए। आप एक पेशेवर क्षेत्र में एक असाधारण व्यक्ति बनने के लिए पैदा हुए हैं",
    expression_2_desc:
      "सहयोग, कूटनीति और शांतिपूर्ण सह-अस्तित्व जीवन के लक्ष्य हैं। विकास स्वायत्तता के बजाय साझेदारी में होता है। आपको समय-समय पर मध्यस्थता करने और शांति बहाल करने के लिए कहा जा सकता है। सहयोग, साझाकरण और साहचर्य आपको सफलता की ओर ले जाएगा। यदि नकारात्मक पहलुओं से बचा जा सकता है, तो आपको एक शांतिदूत के रूप में पहचाना जाएगा",
    expression_3_desc:
      "लोकप्रियता, व्यक्तिगत और दूसरों की खुशी, प्यार, रोमांस और भौतिक संपत्ति जीवन के मुख्य लक्षण हैं, बशर्ते आप अपनी प्रतिभा का बुद्धिमानी से उपयोग करें। आप दूसरों के लिए खुशी का स्रोत हैं और आप उन्हें खुश करने के लिए पैदा हुए हैं। अपनी कल्पना, ईमानदारी और अच्छे हास्य के माध्यम से, आप रचनात्मक स्तर पर मानवता को रोशन करने के लिए नियत हैं",
    expression_4_desc:
      "आप जिम्मेदारियों को संभालने के लिए नियत हैं, और दूसरे आपकी मदद और समर्थन के लिए आप पर भरोसा करेंगे। निर्माण, संगठन और प्रबंधन आपको जीवन भर व्यस्त रखेंगे। पारिवारिक समस्याएं अक्सर आपके दिमाग में वापस आएंगी, और जीवन की बाधाएं आपको परेशान कर सकती हैं। धैर्य, दृढ़ संकल्प, व्यवस्था, ईमानदारी, ईमानदारी और सेवा की भावना के माध्यम से, आप दूसरों की और अपनी सुरक्षा सुनिश्चित करेंगे यदि आप कठिनाइयों को दूर करते हैं",
    expression_5_desc:
      "आप दूसरों के साथ बातचीत करने और «स्वतंत्रता» और «प्रगति» को बढ़ावा देने के लिए पैदा हुए हैं। परिवर्तन, नई परिस्थितियां, नए दृष्टिकोण, विविधता, बहुमुखी प्रतिभा और अप्रत्याशित आपके जीवन की मुख्य विशेषताएं होंगी। आपको एक ही आधार पर या एक ही लोगों के साथ लंबे समय तक काम करना मुश्किल हो सकता है। आप दूसरों को «स्वतंत्रता» प्राप्त करना और खुशी से रहना सिखाएंगे, यदि नकारात्मक को नियंत्रित किया जाता है",
    expression_6_desc:
      "आप प्रेम, कर्तव्य की भावना, जिम्मेदारी और दान के साथ मानवता की सेवा करने के लिए दुनिया में आए हैं। आपको एक विश्वसनीय व्यक्ति के रूप में पहचाना जाएगा। अपने प्रियजनों के प्रति उदार रहें, लेकिन बलिदान की हद तक नहीं। आपके जीवन भर मदद मांगने के लिए आपके दरवाजे पर दस्तक दी जाएगी, और जितना अधिक आप दूसरों के लिए कार्य करेंगे, उतना ही आप प्यार, आराम और पैसे से घिरे रहेंगे। अपनी प्रगति के लिए, आपको सुंदरता, साहचर्य, प्रेम और सद्भाव की आवश्यकता है। आप जीवन के दर्शन का पता लगाने और आध्यात्मिक ऊंचाइयों तक पहुंचने में सक्षम हैं",
    expression_7_desc:
      "आप वैज्ञानिक, आपराधिक, दार्शनिक या धार्मिक क्षेत्र में ज्ञान या छिपे हुए सत्य की खोज के लिए नियत हैं। आप लोगों के बीच में भी खुद को अकेला पा सकते हैं और आप सामान्य वर्ग से बाहर हो सकते हैं। आप जीवन के दर्शन में गहराई तक जा सकते हैं; दूसरों द्वारा खोजे गए तथ्यों का प्रयोग, परीक्षण और प्रदर्शन करें। प्राप्त ज्ञान के लिए लोकप्रियता, प्रेम और सम्मान आपके पास आना चाहिए और आपको एक शिक्षक के रूप में जाना जाना चाहिए। आप जिस कठिन मार्ग पर चल रहे हैं, उस पर व्यक्तिगत व्यवसाय, प्रेम और यहां तक ​​कि विवाह का भी बलिदान किया जा सकता है, लेकिन आपको सत्य (अक्सर मनोगत या आध्यात्मिक पंक्तियों पर) खोजने और लोगों को शिक्षित करने में अधिक संतुष्टि मिल सकती है",
    expression_8_desc:
      "प्रबंधन, संगठन और प्रशासन आपको अधिकार और मान्यता की स्थिति में ले जाना चाहिए। आपको समय-समय पर लोगों और घटनाओं का उचित मूल्यांकन करना होगा, जो एक आसान काम नहीं है। यदि दार्शनिक संकाय विकसित किया जाता है और एक निष्पक्ष निर्णय किया जाता है, तो आपका इनाम इसकी उपलब्धि होगी। पैसा हमेशा विकास की रेखाएं नहीं हो सकता है, इसके अलावा व्यापार के लिए जिसके लिए आप प्रसिद्ध हो सकते हैं",
    expression_9_desc:
      "आप परोपकारी, मानवतावादी या धर्मार्थ क्षेत्र में लोकप्रिय होने के लिए नियत हैं। भाईचारे का प्यार और मानवता की सेवा आपके व्यक्तित्व का एक अभिन्न अंग होगी, जबकि प्यार, रोमांस, संगीत और कला में आपकी गहरी रुचि होनी चाहिए। करुणा, उदारता और दूसरों की जरूरतों की समझ आपको बहुत लोकप्रिय बनाएगी। स्वार्थ, आत्म-प्रेम और क्षमा की कमी हानिकारक साबित हो सकती है और निराशा पैदा कर सकती है। अवैयक्तिक होना और एक सार्वभौमिक प्रेम विकसित करना आपको एक आध्यात्मिक नेता बना सकता है",
    expression_11_desc:
      "प्रेरणा, आध्यात्मिक जागरूकता (अक्सर अव्यक्त), अंतर्ज्ञान और मानसिक क्षमताएं आंतरिक खुशी और आत्मज्ञान का कारण बन सकती हैं यदि नकारात्मक पहलुओं को नियंत्रित किया जाता है। आप उच्च मूल्यों को प्राप्त करने के लिए नियत हैं; यदि आप उनका सख्ती से पालन करते हैं तो पारिवारिक जीवन, भौतिक लाभ और सामाजिक स्थिति आसानी से खो सकती है। आपको संवेदनशीलता, घबराहट और अहंकार पर काबू पाना चाहिए और भौतिक और सामाजिक जीवन को हल्के में लेना चाहिए। आपको आध्यात्मिक ऊंचाइयों तक पहुंचने और दूसरों को प्रबुद्ध करने की शक्ति प्रदान की गई है। आप कभी-कभी भौतिक नुकसान से पीड़ित होते हैं, जिसके परिणामस्वरूप आपके रिश्तों और साझेदारियों में बार-बार निराशा होती है",
    expression_22_desc:
      "बड़ी परियोजनाओं को प्रभावी ढंग से प्रबंधित करने की क्षमता आपको संभवतः आपके जीवन में किसी समय भौतिक दुनिया के एक विशिष्ट क्षेत्र में अधिकार की स्थिति में रखेगी। आपके पास संभवतः महत्वपूर्ण परियोजनाएं होंगी। लेकिन आपकी सफलता आपकी इच्छा को नियंत्रित करने की आपकी क्षमता पर निर्भर करेगी «आप जितना संभाल सकते हैं उससे अधिक काम लेना» और अपनी आध्यात्मिक जागरूकता को अपने व्यावहारिक दृष्टिकोण में हस्तक्षेप करने से रोकना। दूसरी ओर, यदि आप रहस्यमय और मनोगत क्षेत्रों में काम करने के इच्छुक हैं, तो आप दूसरों के लिए बहुत अच्छा कर सकते हैं और प्रकाश के एक प्रसिद्ध दाता बन सकते हैं",
    time_1_desc:
      "रचनात्मक विचारों से भरपूर, दृढ़ इच्छाशक्ति वाला, स्वतंत्र, बहादुर और एक योद्धा। निहित दोष हैं जिद, बेईमानी, हावी होने की इच्छा और स्वार्थ, जो सब कुछ जानने वाले रवैये की ओर ले जाता है। ज्ञान मुख्य ध्यान केंद्रित है। मजबूत विश्लेषणात्मक कौशल हैं। यदि सही तरीके से उपयोग किया जाए, तो एक विद्वान व्यक्ति बन जाएगा। आमतौर पर तुरंत हाँ या ना में जवाब नहीं देता, पहले सोचेगा। कई चीजों में बहुत विस्तृत। रचनात्मकता में बहुत मजबूत और बहुत सतर्क। ये विशेषताएँ धन की ओर ले जाएँगी। मनोरंजन करने में अच्छा और रिश्ते बनाने में भरोसेमंद। धन आमतौर पर 32 से 42 वर्ष की आयु के आसपास प्राप्त होता है। नेतृत्व कौशल हैं। विपरीत लिंग अक्सर आकर्षित होता है। उम्र के साथ बेहतर दिखने वाला या अधिक सुंदर हो जाएगा - 30 के दशक से ऊपर और उसके बाद, अधिक सुंदर/सुंदर दिखेगा। नकारात्मक पक्ष यह है कि अक्सर अकेलापन महसूस होता है, एक घुमंतू की तरह महसूस होता है। किसी व्यक्ति या स्थिति का विश्लेषण करते समय सावधान रहें, एक गलत विश्लेषण अनावश्यक समस्याओं को जन्म देगा।",
    time_2_desc:
      "शांति, विनम्रता, मित्रता से भरपूर, और एक आध्यात्मिक प्रभाव है। निहित दोष हैं संवेदनशील होना और आसानी से आहत होना, छोटी-छोटी बातों पर इतना ध्यान देना कि बहुत समय बर्बाद हो जाए। कुशल और एक सुखद व्यक्तित्व है, और बातूनी है। सहयोग से जुड़े काम में भरोसेमंद। बहुत शांत, मिलनसार और नरम दिल। हमेशा साफ-सफाई, स्वच्छता पर जोर देता है, और बहुत व्यवस्थित है। कड़ी मेहनत करने को तैयार, सोच में बहुत परिपक्व। आमतौर पर बड़े लोगों के साथ मेलजोल रखता है। कार्यों को निर्देशित करने और पूरा करने की क्षमता है। नकारात्मक पक्ष यह है कि दूसरों की राय सुनने को तैयार है, लेकिन शायद उनका पालन करने के लिए नहीं। जिद्दी, अक्सर बुरी अफवाहों को जन्म देता है, और 'सिर्फ बात करने वाला' होता है। प्यार के मामलों में बहुत ईर्ष्यालु।",
    time_3_desc:
      "कलात्मक प्रतिभा, लड़ने की भावना से भरपूर, 3 समय-सीमाओं को देखने की क्षमता है। निहित दोष हैं फिजूलखर्ची, खुली बात, और माफ करने में कठिनाई। आकर्षक और दूरदर्शी, लेकिन बहुत अधीर। स्पष्ट और जानता है कि वे क्या चाहते हैं और इसे कैसे और कहाँ प्राप्त करें। अच्छे और बुरे में भेद करने में बहुत तेज। एक उच्च पद पर काबिज हो सकता है, अमीर और समृद्ध हो सकता है। समाज की नजर में एक अच्छा जीवन है। क्षमताएं और प्रतिभाएं हैं और स्थिति का लाभ उठाने में अच्छा है। जल्दी गुस्सा आता है, लेकिन जल्दी शांत भी हो जाता है। एक खूबसूरत महिला, या अपनी युवावस्था में एक सुंदर पुरुष। नकारात्मक पक्ष यह है कि चीजों को हल्के में लेने और दृढ़ न होने की प्रवृत्ति है। कभी-कभी शरारती हो सकता है। बोलते समय कभी-कभी असभ्य। शादी में उतार-चढ़ाव आते हैं, और अगर इसे ठीक से नहीं संभाला गया, तो यह आपदा और हिंसा ला सकता है। आमतौर पर सोचता है कि वे जो कुछ भी करते हैं और कहते हैं, उसमें वे सही हैं, जबकि दूसरे गलत हैं।",
    time_4_desc:
      "जिम्मेदारी, वैज्ञानिक सोच, ईमानदारी और वफादारी से भरपूर। निहित दोष हैं जिद, बहस करने का प्यार और हावी होने की इच्छा, और एक काम के प्रति जुनूनी स्वभाव। बुद्धिमान, कलात्मक, और जीवन की परीक्षाओं में उत्कृष्टता प्राप्त करता है। भरोसेमंद और समाज में आसानी से घुलमिल जाता है। करुणा और करिश्मा से भरपूर। स्वाभाविक रूप से एक योजनाकार और विचारक है, कार्य करने से पहले सोचता है। यात्रा करना और एक स्वतंत्र जीवन शैली जीना पसंद करता है। बहुत कम उम्र में क्षमताएं होती हैं। जीवन की कठिनाइयों का सामना करने के बाद जल्दी से उठने में सक्षम। यदि एक महिला है, तो वह अपने साथी को लाड़ प्यार करती है। नकारात्मक पक्ष धन संचय करने में एक कमजोरी है। रिश्तों या शादी में सावधान रहना चाहिए, अन्यथा इसमें अनावश्यक बुरी घटनाएं शामिल होंगी।",
    time_5_desc:
      "यौन ऊर्जा, स्वतंत्रता और परिवर्तन के प्रेम से भरपूर, बुद्धि और त्वरित कार्यों से भरपूर, मनोरंजन करने में सक्षम। निहित दोष हैं 'प्यार और शादी' में बेवफाई, और बेचैनी और असंतोष को नियंत्रित करने में असमर्थता। एक बहुत मजबूत चरित्र है। एक नेतृत्व की आत्मा के साथ पैदा हुआ, आमतौर पर काम के मामले में कई लोगों से ऊपर एक पद रखता है। कई चीजों में मजबूत प्रवृत्ति है। यथार्थवादी और एक मेहनती। वर्तमान स्थिति या परिस्थितियों के अनुकूल और समायोजित हो सकता है। जीवन की बाधाओं का सामना करने के बावजूद, जब वित्तीय समस्याओं का सामना करना पड़ता है, तो उन्हें दूर करने का हमेशा एक तरीका होता है। नकारात्मक पक्ष यह है कि यदि एक गरीब परिवार से है, तो एक जिद्दी स्वभाव है। यदि गलत रास्ते पर है, तो बिना किसी अच्छे उद्देश्य के चक्कर लगाता है, यहाँ तक कि झूठ बोलने की प्रवृत्ति भी होती है। कई चीजों और मुद्दों के बारे में बहुत picky औरจู้จี้จุกจิก। वैसा न बनना सीखें ताकि लोग आपकी अधिक सराहना करें।",
    time_6_desc:
      "संतुलन, निस्वार्थता से भरपूर, मानवीय गतिविधियों का आनंद लेता है, दूसरों के कल्याण के बारे में सोचने में वफादार और दृढ़। निहित दोष हैं प्रशंसा और लोकप्रियता का प्यार, और बलिदान में खुद को नियंत्रित करने में असमर्थता। दृढ़, धन और भलाई के प्रबंधन में सक्षम। बहुत विनम्र और उच्च स्वाद है। कला, धर्म या शिक्षा के क्षेत्र में एक अच्छा करियर है। एक काफी लोकप्रिय व्यक्ति बन सकता है। दूसरों की बात आसानी से नहीं सुनता, खासकर वरिष्ठों की, लेकिन अधीनस्थों के बारे में सोचता है और उन पर ध्यान देता है। परिवार और करीबी रिश्तेदारों की देखभाल करता है। परिवार-उन्मुख। नकारात्मक पक्ष अभिमानी और गर्वित होना, साधारण काम करने को तैयार न होना। रिश्तों के मामले में, अधिकारपूर्ण है और हमेशा हर किसी और हर चीज को नियंत्रित करना चाहता है, लेकिन आमतौर पर इसे स्वीकार नहीं करेगा। हावी होने की इच्छा से छुटकारा पाएं ताकि प्रियजन आपको और अधिक प्यार करें।",
    time_7_desc:
      "बुद्धिमत्ता, अकेलेपन, रहस्यवाद से भरपूर, आकर्षण से भरा व्यक्तित्व। निहित दोष हैं आत्म-अभिव्यक्ति में कठिनाई, दूसरों में विश्वास की कमी, अत्यधिक आत्म-ध्यान जो 'साथी' की जरूरतों की समझ की कमी की ओर ले जाता है। विभिन्न मामलों को संभालने में विस्तृत। किसी की भी मदद करने वाले को कभी नहीं भूलेगा। स्थिति को बदलने और पलटने में सक्षम। प्रसिद्धि और भाग्य का पीछा करने का आनंद लेता है। मनोरंजन क्षेत्र के प्रबंधन में भरोसेमंद। एक आध्यात्मिक व्यक्ति/धार्मिक नेता बन सकता है, आमतौर पर 50 के दशक और उसके बाद। नकारात्मक पक्ष बहस करने का प्यार, अनिर्णय/अक्सर राय बदलना, और निर्णय लेने में धीमा होना है। शादी में समस्याएं होने की प्रवृत्ति है। हालांकि आभारी होने में अच्छा है, एक प्रवृत्ति है कि वे खुद दूसरों के प्रति आभार नहीं दिखा सकते हैं।",
    time_8_desc:
      "आदर्शवाद, भौतिकवाद से भरपूर, रहस्यों का एक भरोसेमंद रक्षक। निहित दोष हैं शक्ति का प्रदर्शन करने की इच्छा, मानवता की कमी, और जिद। लगभग हर कोई जिसके पास समय 8 है, उसे अंतिम परिणाम के रूप में त्रासदी मिलती है। शांत, रूढ़िवादी, निष्क्रिय होने की प्रवृत्ति है, लेकिन दूसरों के बीच भावुक। बहुत जिम्मेदार, हालांकि कभी-कभी दबाव महसूस करता है। सद्गुण और भरोसेमंद से भरपूर। लोगों के साथ खेल नहीं खेलेगा। बाहर से सख्त दिखता है, लेकिन वास्तव में अंदर से नरम है। नकारात्मक पक्ष गुस्सैल होना, एक procrastinator, और इंतजार करने और देखने की प्रवृत्ति है। यह अक्सर छूटे हुए अवसरों का कारण बनेगा। स्थितियों को पढ़ने में बेहतर होने की जरूरत है। बहुत सावधान रहने से आपको कुछ नहीं मिलेगा। अपने विचारों पर विश्वास रखें और अपने तरीके से काम करें। कभी-कभी वे जो कर रहे हैं उसके बारे में अस्पष्ट। यदि गलत रास्ते पर हैं, तो वे एक धमकाने वाले बन जाएंगे, हावी होना चाहेंगे, स्वार्थी, क्रूर, और केवल अपनी उन्नति के बारे में सोचेंगे।",
    time_9_desc:
      "मानवता, उदारता, करुणा से भरपूर, और एक आध्यात्मिक आत्मा है। निहित दोष हैं बहुत संवेदनशील होना, निर्णय लेने में जल्दबाजी, स्वार्थी, अधिकारपूर्ण, असहिष्णु, और यहां तक ​​कि बेईमान। बहुत आशावादी और खुले विचारों वाला। सुंदर/साफ-सुथरा दिखना और अच्छे कपड़े पहनना पसंद करता है। सरल, सख्त दिखता है लेकिन अंदर से नरम है। बहुत सतर्क और संवेदनशील। जानता है कि कब और कैसे हमला करना और बचाव करना है। लोगों का दिल जीतने में अच्छा है। सब कुछ जल्दी करता है लेकिन विस्तार की कमी है। काफी भावुक। काम में भरोसेमंद। बड़े लक्ष्य और सपने हैं। जो कुछ भी किया जाता है वह अक्सर सफलता प्राप्त करता है। नकारात्मक पक्ष यह है कि बुढ़ापे में अक्सर अकेलापन महसूस होता है। भीतर लालच का एक उच्च स्तर है। अधीनस्थों पर ध्यान देना भूल जाता है। बहुत सारे सच्चे दोस्त नहीं हैं। जीवन शैली भौतिकवादी होती है।",
    synchronize_desc:
      "सिंक्रोनाइज़ वैल्यू एक पैरामीटर है जो किसी व्यक्ति के आंतरिक कोड और बाहरी कोड के बीच संबंध, पर्यावरण के साथ बातचीत करने की क्षमता, और अवसरों को पकड़ने की गति को इंगित करता है। सिंक्रोनाइज़ रेंज 0.05 से 1.0 या 5% से 100% तक है। छोटे और बड़े पैमाने पर अपने सभी प्रयासों में सफल और निपुण लोगों का सिंक्रोनाइज़ वैल्यू 0.8 से 1.0 या 80% से 100% होता है। 0.1 / 10% पर, किसी क्षेत्र में महारत हासिल करने की आपकी क्षमता अत्यंत कठिन और धीमी होती है; पाठों में, आपको थोड़ा समझने से पहले बार-बार स्पष्टीकरण की आवश्यकता होती है, और सामाजिक रूप से, आपको कई बार अनुकूलन करना पड़ सकता है, और यदि आपकी वैल्यू 10% है, तो संभावना है कि आप कम बुद्धिमान व्यक्ति हैं। 0.2 / 20% पर, क्षमता 10% पैरामीटर के लगभग समान होती है, लेकिन एक ऐसे स्तर पर जो 10% के निशान से थोड़ा आसान हो सकता है। 0.3 / 30% पर, किसी क्षेत्र में महारत हासिल करने की आपकी क्षमता बहुत अच्छी नहीं होती, और आपके मित्रों द्वारा आपको बहिष्कृत किए जाने की उच्च संभावना है, साथ ही आपके द्वारा समझे गए पाठों में आपकी समझ में त्रुटियां होने की संभावना है। 0.4 / 40% पर, इस बात की बहुत अधिक संभावना है कि आप अपने दोस्तों के लिए काम करने वाले बन सकते हैं, और आप केवल साथ पाने के लिए स्वेच्छा से अपने आत्म-सम्मान का त्याग कर सकते हैं, साथ ही आप अपनी पढ़ाई में समझने में अक्सर गलतियाँ करते हैं। 0.5 / 50% पर, आपके दोस्त आपकी ज्यादा परवाह नहीं करते, और आपकी उपस्थिति विशेष रूप से वांछित नहीं होती, और संभवतः आप अपनी पढ़ाई की परवाह नहीं करते हैं। 0.6 / 60% पर, किसी क्षेत्र में महारت हासिल करने की आपकी क्षमता, विशेष रूप से सामाजिक मेलजोल और दोस्ती में, औसत होती है, जहाँ कुछ लोग आपकी उपस्थिति की उम्मीद करते हैं लेकिन बहुमत को परवाह नहीं होती, और आपकी पढ़ाई औसत होती है। 0.7 / 70% पर, आपकी क्षमता एक सुरक्षित स्तर पर होती है, आपके कई दोस्त होते हैं लेकिन आप चयनशील हो सकते हैं, और आप धीरे-धीरे लेकिन निश्चित रूप से सीखते हैं। 0.8 / 80% पर, आपके दोस्तों के बीच लोकप्रिय होने की बहुत अधिक संभावना है और आपकी उपस्थिति का बेसब्री से इंतजार किया जाता है, लेकिन आप दोस्त चुनने में कम चयनशील होते हैं, और आप पढ़ाई में काफी तेज होते हैं। 0.9 / 90% पर, आपकी क्षमता आपके सामाजिक जीवन में है, जहाँ आप अपनी उपलब्धियों के लिए प्रसिद्ध हो सकते हैं और दोस्त आप पर निर्भर करते हैं, और आप पढ़ाई को आसानी से समझ लेते हैं, लेकिन दुर्भाग्य से, आप कभी-कभी खुद को सबसे चतुर समझते हैं और दोस्तों को बोझ मानते हैं। अंत में, 1.0 / 100% पर, आपकी उपलब्धियाँ और आपके द्वारा बनाए गए सेंसेशन से आपके आस-पास के लोग आपकी प्रशंसा करते हैं, जिससे अधिकार और करिश्मा का एक आभामंडल उत्पन्न होता है। आप पढ़ाई को समझने में अविश्वसनीय रूप से चतुर हैं, लेकिन दुर्भाग्य से, आपके भीतर स्वार्थ की संभावना बहुत अधिक है, क्योंकि आप अक्सर खुद को उन दोस्तों से बेहतर महसूस करते हैं जो आपको महत्वपूर्ण मानते हैं, और आप उन लोगों से दोस्ती करना पसंद करते हैं जिन्हें आप महत्वपूर्ण मानते हैं।",
    coherence_desc:
      "सुसंगतता (Coherence) एक पैरामीटर है जो किसी व्यक्ति के परस्पर जुड़े आंतरिक कोड की संरचनात्मक ताकत को इंगित करता है, और ज्ञान या कौशल के किसी क्षेत्र में महारत हासिल करने में उसकी क्षमता और गति के स्तर को दर्शाता है। सुसंगतता की सीमा 0.1 – 1.0 या 10% से 100% तक है। जो लोग जीवन में सफल और निपुण होते हैं, अपने सभी प्रयासों में, चाहे वे छोटे पैमाने पर हों या बड़े पैमाने पर, उनका सुसंगतता मान 0.7 से 1.0 के बीच, या 70% से 100% तक होता है।",
    // Numerology Results
    hara: "हारा",
    expression: "अभिव्यक्ति",
    time: "समय",
    dimensional_analysis: "आयामी विश्लेषण",
    synchronize_score: "सिंक्रोनाइज़ स्कोर",
    coherence_value: "सुसंगति मूल्य",
    synergize_value: "तालमेल मूल्य",
    productive_value: "उत्पादक मूल्य",
    momen_sukses_value: "सफलता क्षण मूल्य",
    grafologi_index: "लेखन विज्ञान सूचकांक",
    potential_suggestions: "संभावित सुझाव",
    advanced_analysis: "उन्नत विश्लेषण",
    core_numbers: "मुख्य संख्याएं",
    character_number: "चरित्र संख्या",
    expression_number: "अभिव्यक्ति संख्या",
    soul_number: "आत्मा संख्या",
    personality_number: "व्यक्तित्व संख्या",
    number_intensity: "संख्या तीव्रता",
    personal_development: "व्यक्तिगत विकास",
    self_potential: "स्व क्षमता",
    attitude_number: "दृष्टिकोण संख्या",
    growth_number: "विकास संख्या",
    birth_date_analysis: "जन्म तिथि विश्लेषण",
    day: "दिन",
    month: "महीना",
    year: "वर्ष",
    pythagorean_analysis: "पाइथागोरियन विश्लेषण",
    soul_urge: "आत्मा की इच्छा",
    personality: "व्यक्तित्व",
    challenge_numbers: "चुनौती संख्याएं",
    challenge: "चुनौती",
    current_year_analysis: "वर्तमान वर्ष विश्लेषण",
    personal_year_number: "व्यक्तिगत वर्ष संख्या",
    premium_analysis: "प्रीमियम विश्लेषण",
    upgrade_to_premium: "प्रीमियम में अपग्रेड करें",
    parameter_detail: "पैरामीटर विवरण",
    close: "बंद करें",
    // Numerology Form
    numerology_analysis: "अंकज्योतिष विश्लेषण",
    basic_analysis: "बुनियादी विश्लेषण",
    advanced_analysis: "उन्नत विश्लेषण",
    full_name: "पूरा नाम",
    enter_full_name: "अपना पूरा नाम दर्ज करें",
    normalized: "सामान्यीकृत",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    birth_date: "जन्म तिथि",
    select_birth_date: "जन्म तिथि चुनें",
    cancel: "रद्द करें",
    done: "हो गया",
    advanced_analysis_features: "उन्नत विश्लेषण सुविधाएं:",
    life_path_number: "• जीवन पथ संख्या (हारा)",
    expression_number_feature: "• अभिव्यक्ति संख्या",
    soul_urge_number: "• आत्मा इच्छा संख्या",
    personality_number_feature: "• व्यक्तित्व संख्या",
    maturity_number: "• परिपक्वता संख्या",
    personal_year_number_feature: "• व्यक्तिगत वर्ष संख्या",
    analyze: "विश्लेषण करें",
    // Name Generator
    personal_name_optimizer: "व्यक्तिगत नाम अनुकूलक",
    baby_name_generator: "बच्चे का नाम जेनरेटर",
    personal_name: "व्यक्तिगत नाम",
    baby_name: "बच्चे का नाम",
    generation_mode: "जेनरेशन मोड",
    add_one_word: "एक शब्द जोड़ें",
    add_some_word: "कुछ शब्द जोड़ें",
    your_first_name: "आपका पहला नाम",
    family_name_optional: "पारिवारिक नाम (वैकल्पिक)",
    enter_first_name: "अपना पहला नाम दर्ज करें",
    enter_family_name: "पारिवारिक नाम दर्ज करें (वैकल्पिक)",
    name_origin: "नाम की उत्पत्ति",
    generate_names: "नाम जेनरेट करें",
    advanced_search: "उन्नत खोज",
    jalankan_lanjut_combi: "चलाएं/जारी रखें कॉम्बी",
    suggested_names: "सुझाए गए नाम",
    generated_from: "से जेनरेट किया गया:",
    no_matching_names: "कोई मेल खाने वाले नाम नहीं मिले। अलग पैरामीटर आज़माएं।",
    // Compatibility Checker
    compatibility_checker: "संगतता जांचकर्ता",
    person_1: "व्यक्ति 1",
    person_2: "व्यक्ति 2",
    check_compatibility: "संगतता जांचें",
    compatibility_results: "संगतता परिणाम",
    compatibility_areas: "संगतता क्षेत्र",
    detailed_analysis_unlocked: "विस्तृत विश्लेषण - अनलॉक!",
    all_premium_features_available:
      "आपके संगतता विश्लेषण के लिए सभी प्रीमियम सुविधाएं अब उपलब्ध हैं।",
    // Life Report
    life_report: "जीवन रिपोर्ट",
    life_path: "जीवन पथ",
    year_life_report: "100 वर्ष जीवन रिपोर्ट",
    daily_advice: "दैनिक सलाह",
    daily_advice_calendar: "दैनिक सलाह कैलेंडर",
    select_date: "तारीख चुनें",
    monthly_advice_calendar: "मासिक सलाह कैलेंडर",
    legend: "किंवदंती:",
    // G1-G9 Descriptions
    g1_desc:
      "स्वतंत्र और नेतृत्व-उन्मुख, मजबूत पहल और अग्रणी भावना के साथ। रचनात्मक क्षमताओं के साथ प्राकृतिक जन्मे नेता।",
    g2_desc:
      "सहयोगी और कूटनीतिक, साझेदारी और टीम वर्क में उत्कृष्ट। धैर्यवान और विस्तार-उन्मुख मजबूत सहज क्षमताओं के साथ।",
    g3_desc:
      "रचनात्मक और अभिव्यंजक, मजबूत संचार कौशल के साथ। कलात्मक प्रतिभाएं और जीवन पर आशावादी दृष्टिकोण।",
    g4_desc:
      "व्यावहारिक और संगठित, मजबूत कार्य नैतिकता और विवरण पर ध्यान के साथ। दृष्टिकोण में विश्वसनीय और व्यवस्थित।",
    g5_desc:
      "स्वतंत्रता-प्रेमी और साहसी, विविधता और परिवर्तन की मजबूत इच्छा के साथ। गतिशील और बहुमुखी व्यक्तित्व।",
    g6_desc:
      "पोषण और जिम्मेदार, मजबूत पारिवारिक अभिविन्यास के साथ। देखभाल और सहायक चिकित्सा क्षमताओं के साथ।",
    g7_desc:
      "विश्लेषणात्मक और आत्मनिरीक्षण, मजबूत आध्यात्मिक झुकाव के साथ। शोधकर्ता और सत्य और ज्ञान के साधक।",
    g8_desc:
      "महत्वाकांक्षी और व्यापार-उन्मुख, मजबूत भौतिक फोकस के साथ। कार्यकारी क्षमताओं के साथ प्राकृतिक आयोजक।",
    g9_desc:
      "मानवतावादी और उदार, दूसरों की सेवा करने की मजबूत इच्छा के साथ। सार्वभौमिक दृष्टिकोण के साथ दयालु और समझदार।",
  },
  id: {
    // Home Screen
    welcome_back: "Selamat datang kembali,",
    all_premium_features_unlocked: "Semua Fitur Premium Terbuka!",
    quick_actions: "Aksi Cepat",
    name_analysis: "Analisis Nama",
    love_couple: "Pasangan Cinta",
    dictio_name: "KamusNama",
    generator_name_optimizer: "Pengoptimal Generator Nama",
    lifeplan_report: "Laporan Rencana Hidup",
    successful_people: "Orang-orang sukses",
    synchronize: "Sinkronisasi",
    coherence: "Koherensi",
    momentum: "Momentum",
    discover_power_names:
      "Temukan kekuatan nama melalui alat analisis komprehensif kami. Ingin memiliki nilai seperti mereka? >> Pelajari Lebih Lanjut",
    earn_free_credits: "Dapatkan Kredit Gratis",
    share_with_friends: "Bagikan dengan teman untuk membuka fitur premium",
    share_now: "Bagikan Sekarang",
    // Tab Bar
    home: "Beranda",
    analyze: "Analisis",
    names: "Nama",
    match: "Kecocokan",
    account: "Akun",
    // Common
    language: "Bahasa",
    // Parameter Details
    hara_1_desc:
      "🤠Positif dalam kemandirian dan independensi, perkembangan (awal) yang baru, biasanya diawali oleh suatu hal/pekerjaan/proyek baru, suatu relokasi, perubahan karir, atau langkah penting serupa. Kemandiran dan kekuatan, kemungkinan menjadi seorang yang cenderung individual. Berpotensi memiliki kewenangan / perlawanan terhadap figur yang mendominasi. Lebih banyak peluang - peluang bisnis menguntungkan untuk pribadi tetapi kurang cocok/menguntungkan jika dikerjakan dalam bentuk kerjasama. Akan banyak potensi keberuntungan dalam keuangan serta petualangan - petualangan. Cenderung mendapatkan dukungan dari beberapa sumber. Dalam fase panjang Anda akan mantap dalam  keuangan, kuat, dan sukses bisnis",
    hara_2_desc:
      "🤝Peningkatan koneksi dan kerjasama, dibantu oleh suatu hubungan yang berjalan baik dan lama. Dalam fase pendek berpotensi memiliki koneksi - koneksi baru dalam bisnis atau pergaulan, meningkatnya kesadaran akan rasa syukur terhadap kehidupan , meningkatnya kepekaan terhadap insting kehidupan dan bisnis, memiliki kemauan untuk bermitra dengan orang lain, mudah bernegosiasi dan bijaksana. Dalam fase panjang Dalam fase panjang  lancar dalam hubungan, juga berpotensi sukses, lancarnya keuangan dan perekonomian",
    hara_3_desc:
      "💡Potensi ide dan kreativitas, pembawaan santai dan kenikmatan atas segala hal yang perlu dikendalikan. Dalam fase pendek berpotensi memiliki AKSI kreativitas dan orisinalitas, meningkatnya ekpresi diri. Ini adalah Modal. Penuh inspirasi dan motivasi serta ide-ide kehidupan. Ketika bersosialisasi, anda akan membawa kenyamanan, Berpotensi mengalami hidup yang penuh dengan perjalanan dan menginspirasi orang lain. Akan meningkatnya  kesenangan - kesenangan lain dari aspek material dunia/ Uang",
    hara_4_desc:
      "✔️Potensi karir dan hubungan yang menguat, berpindah untuk bergerak maju, tanggung jawab terselesaikan dengan praktis. Dalam fase pendek berpotensi mendapatkan peluang - peluang bisnis yang menjanjikan, Hilangnya Kesulitan - kesulitan dengan pihak berwenang, Khususnya institusi - institusi serta peraturannya. Keuangan yang grafiknya naik. Kekuatan dan tekadlah  dapat membantu anda mewujudkan rencana - rencana anda. Dalam fase panjang anda berpotensi mengalami perbaikan - perbaikan dalam karir dan keuangan. Anda juga bisa berharap adanya hubungan yang menguat, khususnya terhadap seseorang yang dekat dengan anda",
    hara_5_desc:
      "❌Kecenderungan potensi buruk, apes, cenderung mudah dikelabui, pengkhianatan, celaka, sakit, berakhir buruk. Namanya harus di rubah atau di tambahkan. Mudah di tipu orang, berpotensi sering mengalami kesialan dan keburukan, rata - rata hal negatif yang terjadi dalam parameter ending code yang lain terjadi juga di angka ini. maka sebaiknya berhati - hatilah jika nama anda mengandung Ending Code. selain itu berpotensi mudah ditipu orang, dihianati oleh teman sendiri, dan lainnya",
    hara_6_desc:
      "🏡Potensi berkembang dalam hal kekeluargaan, sosial, membantu tua muda, perbaikan, kesembuhan, kemajuan. Dalam fase pendek ada peluang untuk melibatkan diri dalam keluarga, menyenangkan dan membantu berbagai macam generasi. Berpotensi mengalami ketertarikan dalam masalah - masalah lingkungan dan politik dan juga berpotensi membuat anda menjadi seseorang yang lebih bertanggung jawab. Dalam fase panjang berpotensi mendapatkan prospek - prospek yang kelihatannya amat baik. Di semua area kehidupan anda berpotensi mengalami perbaikan, kesembuhan dan kemajuan",
    hara_7_desc:
      "😠Potensi masalah finansial, konflik emosional (timbul celaka), plin-plan, gangguan syaraf, sel abnormal. Fase pendek : dalam kehidupan akan mengalami kesulitan dalam mengalokasikan dan, mengalami masalah keuangan. Fase panjang : Berpotensi besar menderita kanker dan tumor dan konflik Emosional (contoh cinta segitiga)",
    hara_8_desc:
      "🤕Potensi mengalami perjalanan tidak menyenangkan, harus berhati-hati agar tidak celaka, sakit (pemulihan lama), salah diagnosis, mengakhiri sesuatu secara buruk (berdampak serius)",
    hara_9_desc:
      "🤧Potensi gangguan finansial, gangguan obat atau memasukkan obat, kurang sehat/mengalami penyakit seperti wabah virus dan berakhir dengan buruk (apa saja) karena dilakukan pihak lain",
    hara_11_desc:
      "🤢Potensi gagal usaha, jadi kambing hitam, tekanan atau pengkhianatan psikologis, komplikasi, pisah karena beda prinsip, gangguan kesehatan",
    hara_13_desc:
      "😳Potensi kecewa atas hasil (bangkrut,rugi) rumah tangga maupun bisnis, dikhianati oleh orang dekat, dan ketidakmampuan mendapatkan hasil yang maksimal dan optimal dari segala Usaha yang dijalankan",
    expression_1_desc:
      "Anda ditakdirkan untuk menjadi seorang pemimpin di bidang profesional Anda. Belajarlah untuk mengandalkan kemampuan Anda sendiri, menunjukkan keberanian dan tekad, serta menghindari aspek-aspek negatif seperti egosentrisme. Anda akan dimintai nasihat dari waktu ke waktu, dan Anda harus bersiap untuk itu. Anda dilahirkan untuk menjadi orang yang luar biasa di bidang profesional",
    expression_2_desc:
      "Kerja sama, diplomasi, dan hidup berdampingan secara damai adalah tujuan hidup. Perkembangan terjadi melalui kemitraan daripada kemandirian. Anda mungkin diminta untuk menengahi dan memulihkan perdamaian dari waktu ke waktu. Kerja sama, berbagi, dan kemitraan akan membawa Anda menuju kesuksesan. Jika aspek-aspek negatif dapat dihindari, Anda akan diakui sebagai seorang pembawa damai",
    expression_3_desc:
      "Popularitas, kebahagiaan pribadi dan kebahagiaan orang lain, cinta, romansa, dan harta benda adalah ciri-ciri menonjol dalam hidup, asalkan Anda menggunakan bakat Anda dengan bijaksana. Anda adalah sumber kegembiraan bagi orang lain dan Anda dilahirkan untuk membuat mereka bahagia. Melalui imajinasi, ketulusan, dan keceriaan Anda, Anda ditakdirkan untuk mencerahkan umat manusia pada tingkat kreatif",
    expression_4_desc:
      "Anda ditakdirkan untuk memikul tanggung jawab, dan orang lain akan mengandalkan Anda untuk bantuan dan dukungan mereka. Pembangunan, pengorganisasian, dan manajemen akan menyibukkan Anda sepanjang hidup Anda. Masalah keluarga akan sering muncul kembali dalam pikiran Anda, dan batasan-batasan hidup dapat membuat Anda jengkel. Melalui kesabaran, tekad, ketertiban, ketulusan, kejujuran, dan rasa pengabdian, Anda akan menjamin keamanan orang lain dan keamanan Anda sendiri jika Anda mengatasi kesulitan",
    expression_5_desc:
      "Anda dilahirkan untuk berinteraksi dengan orang lain dan mempromosikan «kebebasan» dan «kemajuan». Perubahan, keadaan baru, pendekatan baru, keragaman, fleksibilitas, dan hal-hal tak terduga akan menjadi ciri-ciri menonjol dalam hidup Anda. Anda mungkin akan merasa sulit untuk bekerja lama dengan dasar yang sama atau dengan orang yang sama. Anda akan mengajarkan orang lain untuk mencapai «kebebasan» dan hidup bahagia, jika hal-hal negatif dapat dikendalikan",
    expression_6_desc:
      "Anda datang ke dunia untuk melayani umat manusia dengan cinta, rasa kewajiban, tanggung jawab, dan amal. Anda akan diakui sebagai orang yang dapat diandalkan. Bersikaplah murah hati kepada orang-orang terdekat Anda, namun jangan sampai berkorban. Pintu Anda akan diketuk untuk meminta bantuan sepanjang hidup Anda, dan semakin Anda bertindak untuk orang lain, semakin Anda akan dikelilingi oleh cinta, kenyamanan, dan uang. Untuk kemajuan Anda sendiri, Anda membutuhkan keindahan, persahabatan, cinta, dan harmoni. Anda mampu menjelajahi filosofi hidup dan mencapai puncak spiritual",
    expression_7_desc:
      "Anda ditakdirkan untuk mencari kebijaksanaan atau kebenaran tersembunyi di bidang ilmiah, kriminal, filosofis, atau agama. Anda mungkin merasa kesepian bahkan ketika berada di tengah-tengah orang banyak dan Anda mungkin berada di luar kelas biasa. Anda mungkin mendalami filosofi hidup; bereksperimen, menguji, dan mendemonstrasikan fakta-fakta yang ditemukan oleh orang lain. Popularitas, cinta, dan rasa hormat seharusnya datang kepada Anda karena pengetahuan yang dicapai dan Anda harus dikenal sebagai seorang pendidik. Bisnis pribadi, cinta, dan bahkan pernikahan mungkin dikorbankan di jalan sulit yang Anda lalui, tetapi Anda mungkin mendapatkan kepuasan yang lebih besar dalam menemukan kebenaran (lebih sering pada jalur gaib atau spiritual) dan mendidik orang-orang",
    expression_8_desc:
      "Manajemen, organisasi, dan administrasi seharusnya membawa Anda ke posisi otoritas dan pengakuan. Anda harus melakukan penilaian yang tepat terhadap orang-orang dan peristiwa dari waktu ke waktu, yang bukan merupakan tugas yang mudah. Jika fakultas filosofis dikembangkan dan penilaian yang tidak berprasangka dibuat, imbalan Anda adalah pencapaiannya. Uang mungkin tidak selalu menjadi jalur pengembangan selain dari bisnis yang mungkin membuat Anda terkenal",
    expression_9_desc:
      "Anda ditakdirkan untuk menjadi populer di bidang filantropi, kemanusiaan, atau amal. Cinta persaudaraan dan pelayanan kepada umat manusia akan menjadi bagian tak terpisahkan dari kepribadian Anda, sementara cinta, romansa, musik, dan seni seharusnya sangat menarik bagi Anda. Welas asih, kemurahan hati, dan pemahaman terhadap kebutuhan orang lain akan membuat Anda sangat populer. Keegoisan, cinta diri, dan kurangnya pengampunan dapat terbukti merugikan dan menimbulkan kekecewaan. Menjadi tidak personal dan mengembangkan cinta universal dapat membuat Anda menjadi seorang pemimpin spiritual",
    expression_11_desc:
      "Inspirasi, kesadaran spiritual (seringkali laten), intuisi, dan kemampuan psikis dapat membawa kebahagiaan batin dan pencerahan jika aspek-aspek negatif dapat dikendalikan. Anda ditakdirkan untuk mencapai nilai-nilai yang lebih tinggi; kehidupan keluarga, keuntungan materi, dan status sosial dapat dengan mudah hilang jika Anda mematuhinya dengan ketat. Anda harus mengatasi kepekaan, kegugupan, dan egosentrisme serta menganggap enteng kehidupan materi dan sosial. Anda diberkahi kekuatan untuk mencapai puncak spiritual dan mencerahkan orang lain. Terkadang Anda menderita kerugian materi, yang menyebabkan kekecewaan berulang dalam hubungan dan kemitraan Anda",
    expression_22_desc:
      "Kemampuan untuk mengelola proyek-proyek besar secara efektif kemungkinan akan menempatkan Anda pada posisi otoritas di bidang tertentu di dunia material pada suatu saat dalam hidup Anda. Anda kemungkinan akan memiliki proyek-proyek penting. Tetapi kesuksesan Anda akan bergantung pada kemampuan Anda untuk mengendalikan keinginan Anda untuk «mengambil lebih banyak pekerjaan daripada yang bisa Anda tangani» dan untuk mencegah kesadaran spiritual Anda mengganggu pendekatan praktis Anda. Di sisi lain, jika Anda cenderung bekerja di bidang mistis dan gaib, Anda bisa melakukan banyak kebaikan untuk orang lain dan menjadi pemberi cahaya yang terkenal",
    time_1_desc:
      "Penuh gagasan kreatif, berkemauan keras, mandiri, berani, dan seorang pejuang. Kekurangan yang melekat adalah sifat keras kepala, ketidakjujuran, hasrat untuk mendominasi, dan keegoisan, yang mengarah pada sikap sok tahu. Kebijaksanaan adalah fokus utama. Memiliki kemampuan analisis yang kuat. Jika digunakan dengan benar, akan menjadi orang yang terpelajar. Biasanya tidak langsung menjawab YA atau TIDAK, akan berpikir terlebih dahulu. Sangat detail dalam banyak hal. Sangat kuat dalam kreativitas dan sangat waspada. Karakteristik ini akan menuntun pada kekayaan. Pandai menghibur dan andal dalam membangun hubungan. Kekayaan biasanya dicapai sekitar usia 32 hingga 42 tahun. Memiliki keterampilan kepemimpinan. Lawan jenis sering tertarik. Akan menjadi lebih tampan atau lebih cantik seiring bertambahnya usia - di atas 30-an dan seterusnya. Sisi negatifnya adalah sering merasa kesepian, merasa seperti seorang pengembara. Berhati-hatilah saat menganalisis seseorang atau suatu situasi, analisis yang salah akan menimbulkan masalah yang tidak perlu",
    time_2_desc:
      "Penuh kedamaian, rendah hati, ramah, dan memiliki pengaruh spiritual. Kekurangan yang melekat adalah sifat sensitif dan mudah tersinggung, terlalu memperhatikan hal-hal kecil hingga membuang banyak waktu. Terampil dan memiliki kepribadian yang menyenangkan, serta banyak bicara. Andal dalam pekerjaan yang melibatkan kerja sama. Sangat tenang, ramah, dan berhati lembut. Selalu menekankan kerapian, kebersihan, dan sangat terorganisir. Bersedia bekerja keras, sangat dewasa dalam berpikir. Biasanya bersosialisasi dengan orang yang lebih tua. Memiliki kemampuan untuk mengarahkan dan menyelesaikan tugas. Sisi negatifnya adalah bersedia mendengarkan pendapat orang lain, tetapi mungkin tidak untuk mengikutinya. Keras kepala, sering memicu gosip buruk, dan cenderung 'hanya bicara'. Sangat pencemburu dalam urusan cinta",
    time_3_desc:
      "Penuh bakat artistik, semangat juang, memiliki kemampuan untuk melihat 3 lini masa. Kekurangan yang melekat adalah pemborosan, bicara sembarangan, dan sulit memaafkan. Menarik dan berwawasan jauh, tetapi sangat tidak sabar. Jelas dan tahu apa yang diinginkan serta bagaimana dan di mana mendapatkannya. Sangat cepat dalam membedakan yang baik dan yang buruk. Dapat menempati posisi tinggi, menjadi kaya dan makmur. Memiliki kehidupan yang baik di mata masyarakat. Memiliki kemampuan dan bakat serta pandai memanfaatkan situasi. Cepat marah, tetapi juga cepat reda. Seorang wanita cantik, atau pria tampan di masa mudanya. Sisi negatifnya adalah kecenderungan untuk menganggap remeh dan tidak tegas. Terkadang bisa nakal. Terkadang kasar saat berbicara. Ada pasang surut dalam pernikahan, dan jika tidak ditangani dengan baik, dapat mendatangkan bencana dan kekerasan. Biasanya berpikir bahwa diri mereka benar dalam apa pun yang mereka lakukan dan katakan, sementara orang lain salah",
    time_4_desc:
      "Penuh tanggung jawab, berpikir ilmiah, jujur, dan setia. Kekurangan yang melekat adalah sifat keras kepala, suka berdebat dan keinginan untuk mendominasi, serta gila kerja. Cerdas, artistik, dan unggul dalam ujian kehidupan. Dapat dipercaya dan mudah bergaul di masyarakat. Penuh kasih sayang dan karismatik. Secara alami adalah seorang perencana dan pemikir, berpikir sebelum bertindak. Suka bepergian dan menjalani gaya hidup bebas. Memiliki kemampuan di usia yang sangat muda. Mampu bangkit dengan cepat setelah menghadapi kesulitan hidup. Jika seorang wanita, dia memanjakan pasangannya. Sisi negatifnya adalah kelemahan dalam mengumpulkan kekayaan. Harus berhati-hati dalam hubungan atau pernikahan, jika tidak akan melibatkan insiden buruk yang tidak perlu",
    time_5_desc:
      "Penuh energi seksual, cinta kebebasan dan perubahan, penuh kecerdasan dan tindakan cepat, mampu menghibur. Kekurangan yang melekat adalah ketidaksetiaan dalam 'cinta dan pernikahan', dan ketidakmampuan mengendalikan kegelisahan dan ketidakpuasan. Memiliki karakter yang sangat kuat. Terlahir dengan jiwa kepemimpinan, biasanya memegang posisi di atas banyak orang dalam hal pekerjaan. Memiliki naluri yang kuat dalam banyak hal. Realistis dan pekerja keras. Dapat beradaptasi dan menyesuaikan diri dengan situasi atau keadaan saat ini. Meskipun menghadapi rintangan hidup, ketika dihadapkan pada masalah keuangan, selalu ada cara untuk mengatasinya. Sisi negatifnya adalah jika dari keluarga miskin, memiliki sifat keras kepala. Jika berada di jalan yang salah, cenderung berputar-putar tanpa tujuan yang baik, bahkan cenderung berbohong. Sangat pemilih dan cerewet tentang banyak hal dan masalah. Belajarlah untuk tidak seperti itu agar orang-orang akan lebih menghargai Anda",
    time_6_desc:
      "Penuh keseimbangan, tidak mementingkan diri sendiri, menikmati kegiatan kemanusiaan, setia dan teguh dalam memikirkan kesejahteraan orang lain. Kekurangan yang melekat adalah kecintaan pada pujian dan popularitas, serta ketidakmampuan mengendalikan diri dalam pengorbanan. Gigih, mampu mengelola kekayaan dan kesejahteraan. Sangat sopan dan berselera tinggi. Memiliki karir yang baik di bidang seni, agama, atau pendidikan. Bisa menjadi sosok yang cukup populer. Tidak mudah mendengarkan orang lain, terutama atasan, tetapi memikirkan dan memperhatikan bawahan. Merawat keluarga dan kerabat dekat. Berorientasi pada keluarga. Sisi negatifnya adalah sombong dan angkuh, tidak mau melakukan pekerjaan sederhana. Dalam hal hubungan, posesif dan selalu ingin mengendalikan semua orang dan segalanya, tetapi biasanya tidak akan mengakuinya. Buang keinginan untuk mendominasi agar orang yang dicintai akan lebih menyayangi Anda",
    time_7_desc:
      "Penuh kecerdasan, kesepian, mistisisme, kepribadian yang penuh pesona. Kekurangan yang melekat adalah kesulitan dalam mengekspresikan diri, kurangnya kepercayaan pada orang lain, perhatian berlebihan pada diri sendiri yang menyebabkan kurangnya pemahaman akan kebutuhan 'pasangan'. Detail dalam menangani berbagai hal. Tidak akan pernah melupakan siapa pun yang telah membantu. Mampu mengubah dan membalikkan keadaan. Senang mengejar ketenaran dan kekayaan. Andal dalam mengelola bidang hiburan. Bisa menjadi figur spiritual/pemimpin agama, biasanya di usia 50-an ke atas. Sisi negatifnya adalah suka berdebat, ragu-ragu/sering berubah pendapat, dan lambat dalam mengambil keputusan. Cenderung memiliki masalah dalam pernikahan. Meskipun pandai bersyukur, ada kecenderungan bahwa mereka sendiri mungkin tidak menunjukkan rasa terima kasih kepada orang lain",
    time_8_desc:
      "Penuh idealisme, materialistis, penjaga rahasia yang dapat dipercaya. Kekurangan yang melekat adalah keinginan untuk memamerkan kekuasaan, kurangnya rasa kemanusiaan, dan sifat keras kepala. Hampir semua orang dengan Waktu 8 mengalami tragedi sebagai hasil akhirnya. Pendiam, konservatif, cenderung pasif, tetapi bersemangat di antara yang lain. Sangat bertanggung jawab, meskipun terkadang merasa tertekan. Penuh kebajikan dan dapat dipercaya. Tidak akan mempermainkan orang. Terlihat tangguh di luar, tetapi sebenarnya lembut di dalam. Sisi negatifnya adalah cepat marah, suka menunda-nunda, dan cenderung menunggu dan melihat. Hal ini akan sering menyebabkan kehilangan kesempatan. Perlu lebih baik dalam membaca situasi. Terlalu berhati-hati tidak akan membawa hasil apa-apa. Yakinlah pada pandangan Anda sendiri dan lakukan segala sesuatunya dengan cara Anda sendiri. Terkadang tidak jelas dengan apa yang mereka kerjakan. Jika berada di jalan yang salah, mereka akan menjadi penindas, ingin mendominasi, egois, kejam, dan hanya memikirkan kemajuan diri sendiri",
    time_9_desc:
      "Penuh kemanusiaan, murah hati, welas asih, dan memiliki jiwa spiritual. Kekurangan yang melekat adalah terlalu sensitif, tergesa-gesa dalam pengambilan keputusan, egois, posesif, tidak toleran, dan bahkan tidak jujur. Sangat optimis dan berpikiran terbuka. Suka terlihat cantik/necis dan berpakaian bagus. Bersahaja, terlihat tangguh tetapi lembut di dalam. Sangat waspada dan sensitif. Tahu kapan dan bagaimana harus menyerang dan bertahan. Pandai memenangkan hati orang. Melakukan segalanya dengan cepat tetapi kurang detail. Cukup emosional. Andal dalam bekerja. Memiliki tujuan dan impian besar. Apa pun yang dilakukan lebih sering menuai sukses daripada tidak. Sisi negatifnya adalah sering merasa kesepian di usia tua. Ada tingkat keserakahan yang tinggi di dalam diri. Cenderung lupa memperhatikan bawahan. Tidak punya banyak teman sejati. Gaya hidup cenderung materialistis",
    synchronize_desc:
      "Nilai Sinkronisasi (Synchronize Value) adalah parameter yang menunjukkan relasi antara kode dalam diri seseorang dengan kode-kode di luar dirinya, kemampuan untuk berinteraksi dengan lingkungan, dan kecepatan dalam mengambil peluang. Rentang Sinkronisasi adalah 0,05 hingga 1,0 atau 5% hingga 100%. Orang-orang yang sukses dan berhasil dalam semua usahanya, baik dalam skala kecil maupun besar, memiliki Nilai Sinkronisasi dari 0,8 hingga 1,0 atau 80% hingga 100%. Nilai Sinkronisasi: 0,1 / 10%. Kemampuan Anda untuk menguasai suatu bidang sangat sulit dan lambat. Dalam pelajaran, Anda memerlukan penjelasan berulang kali sebelum bisa memahami walau HANYA SEDIKIT. Secara sosial, Anda mungkin perlu beradaptasi berkali-kali. Jika Nilai Sinkronisasi Anda 10%, kemungkinan Anda adalah orang yang kurang cerdas. Nilai Sinkronisasi: 0,2 / 20%. Potensinya hampir sama dengan parameter 10%, tetapi pada tingkat yang mungkin sedikit lebih mudah daripada level 10%. Nilai Sinkronisasi: 0,3 / 30%. Potensi Anda untuk menguasai suatu bidang tidak terlalu baik, apalagi jika parameter potensi cerdas Anda juga 30%. Meskipun Anda bersosialisasi, ada kemungkinan besar Anda akan dikucilkan oleh orang-orang yang Anda anggap teman. Untuk pelajaran yang Anda rasa sudah Anda pahami, kemungkinan besar ada kesalahan dalam cara Anda memahaminya. Nilai Sinkronisasi: 0,4 / 40%. Ada kemungkinan yang sangat tinggi bahwa Anda berpotensi menjadi pesuruh untuk teman-teman Anda. Terus terang, Anda berpotensi rela mengorbankan harga diri Anda hanya demi ditemani. Dalam studi Anda, Anda masih sering membuat kesalahan dalam cara Anda memahami pelajaran. Nilai Sinkronisasi: 0,5 / 50%. Dalam kehidupan sosial Anda, teman-teman tidak terlalu peduli pada Anda, meskipun Anda memiliki orang-orang yang bersedia menjadi teman Anda. Kehadiran Anda tidak terlalu diharapkan oleh mereka. Dalam studi Anda, kemungkinan besar Anda tidak peduli pada mata pelajaran yang sedang Anda pelajari, bahkan yang seharusnya Anda pelajari. Nilai Sinkronisasi: 0,6 / 60%. Ini adalah potensi Anda dalam menguasai suatu bidang, terutama dalam interaksi sosial dan pertemanan. Sebagian kecil orang menantikan kehadiran Anda, tetapi mayoritas tampaknya tidak peduli apakah Anda ada di sana atau tidak. Dalam studi Anda, Anda sangat rata-rata dan terkadang dapat memahami materi yang Anda pelajari. Nilai Sinkronisasi: 0,7 / 70%. Potensi Anda untuk menguasai suatu bidang berada pada tingkat yang aman jika angkanya 70%. Anda punya banyak teman, tetapi Anda bisa selektif dalam memilihnya. Anda memiliki pemahaman yang sangat baik tentang apa yang baik dan apa yang tidak, meskipun terkadang Anda mengabaikannya. Dalam studi Anda, perlahan tapi pasti, Anda mampu memahami apa yang Anda pelajari. Nilai Sinkronisasi: 0,8 / 80%. Sangat besar kemungkinannya Anda akan menjadi populer di antara teman-teman Anda; kehadiran Anda sangat ditunggu-tunggu, dan Anda biasanya memiliki aura yang luar biasa. Namun, Anda kurang bisa selektif dalam memilih teman, ingin berteman dengan semua orang dengan alasan “Pertemanan itu untuk siapa saja.” Dalam studi Anda, Anda cukup cepat dalam memahami materi yang Anda pelajari. Nilai Sinkronisasi: 0,9 / 90%. Potensi Anda terletak pada kehidupan sosial Anda; Anda sangat mungkin menjadi terkenal karena prestasi Anda. Banyak teman mengandalkan Anda untuk menyelesaikan sesuatu. Anda begitu cerdas sehingga dapat memahami pelajaran apa pun yang Anda pelajari dengan sangat mudah. Sayangnya, Anda terkadang merasa bahwa Anda lebih pintar dari orang lain, yang membuat Anda menganggap banyak teman sebagai beban. Nilai Sinkronisasi: 1,0 / 100%. Potensi dari prestasi dan sensasi yang Anda ciptakan akan membuat banyak orang di sekitar Anda mengagumi dan bertanya-tanya tentang Anda, sehingga memunculkan aura wibawa dan karisma yang terpancar dari diri Anda. Anda luar biasa pintar dan cerdas dalam memahami pelajaran apa pun yang Anda pelajari. Sayangnya, potensi sifat egois dalam diri Anda sangat tinggi, karena Anda sering merasa lebih baik daripada teman-teman yang menganggap Anda penting, dan Anda lebih suka berteman dengan orang-orang yang Anda anggap penting",
    coherence_desc:
      "Coherence value adalah parameter yang menunjukkan tingkat kekuatan struktur kode-kode dalam diri yang saling berkaitan, yang menunjukkan tingkat kemampuan dan kecepatan seseorang dalam menguasai suatu bidang pengetahuan atau keterampilan. Rentang Koherensi adalah 0,1 – 1,0 atau 10% s.d. 100%. Orang-orang yang sukses dan berhasil dalam hidupnya atas segala sesuatu yang mereka upayakan, baik dalam skala kecil maupun besar, memiliki nilai Koherensi di antara 0,7 sampai dengan 1,0, atau 70% s.d. 100%",
    // Numerology Results
    hara: "Hara",
    expression: "Ekspresi",
    time: "Waktu",
    dimensional_analysis: "Analisis Dimensional",
    synchronize_score: "Skor Sinkronisasi",
    coherence_value: "Nilai Koherensi",
    synergize_value: "Nilai Sinergi",
    productive_value: "Nilai Produktif",
    momen_sukses_value: "Nilai Momen Sukses",
    grafologi_index: "Indeks Grafologi",
    potential_suggestions: "Saran Potensial",
    advanced_analysis: "Analisis Lanjutan",
    core_numbers: "Angka Inti",
    character_number: "Angka Karakter",
    expression_number: "Angka Ekspresi",
    soul_number: "Angka Jiwa",
    personality_number: "Angka Kepribadian",
    number_intensity: "Intensitas Angka",
    personal_development: "Pengembangan Pribadi",
    self_potential: "Potensi Diri",
    attitude_number: "Angka Sikap",
    growth_number: "Angka Pertumbuhan",
    birth_date_analysis: "Analisis Tanggal Lahir",
    day: "Hari",
    month: "Bulan",
    year: "Tahun",
    pythagorean_analysis: "Analisis Pythagoras",
    soul_urge: "Dorongan Jiwa",
    personality: "Kepribadian",
    challenge_numbers: "Angka Tantangan",
    challenge: "Tantangan",
    current_year_analysis: "Analisis Tahun Saat Ini",
    personal_year_number: "Angka Tahun Pribadi",
    premium_analysis: "Analisis Premium",
    upgrade_to_premium: "Upgrade ke Premium",
    parameter_detail: "Detail Parameter",
    close: "Tutup",
    // Numerology Form
    numerology_analysis: "Analisis Numerologi",
    basic_analysis: "Analisis Dasar",
    advanced_analysis: "Analisis Lanjutan",
    full_name: "Nama Lengkap",
    enter_full_name: "Masukkan nama lengkap Anda",
    normalized: "Dinormalisasi",
    gender: "Jenis Kelamin",
    male: "Laki-laki",
    female: "Perempuan",
    birth_date: "Tanggal Lahir",
    select_birth_date: "Pilih Tanggal Lahir",
    cancel: "Batal",
    done: "Selesai",
    advanced_analysis_features: "Fitur Analisis Lanjutan:",
    life_path_number: "• Angka Jalur Hidup (Hara)",
    expression_number_feature: "• Angka Ekspresi",
    soul_urge_number: "• Angka Dorongan Jiwa",
    personality_number_feature: "• Angka Kepribadian",
    maturity_number: "• Angka Kedewasaan",
    personal_year_number_feature: "• Angka Tahun Pribadi",
    analyze: "Analisis",
    // Name Generator
    personal_name_optimizer: "Pengoptimal Nama Pribadi",
    baby_name_generator: "Generator Nama Bayi",
    personal_name: "Nama Pribadi",
    baby_name: "Nama Bayi",
    generation_mode: "Mode Generasi",
    add_one_word: "Tambah Satu Kata",
    add_some_word: "Tambah Beberapa Kata",
    your_first_name: "Nama Depan Anda",
    family_name_optional: "Nama Keluarga (Opsional)",
    enter_first_name: "Masukkan nama depan Anda",
    enter_family_name: "Masukkan nama keluarga (opsional)",
    name_origin: "Asal Nama",
    generate_names: "Generate Nama",
    advanced_search: "Pencarian Lanjutan",
    jalankan_lanjut_combi: "Jalankan/Lanjut Combi",
    suggested_names: "Nama yang Disarankan",
    generated_from: "Dihasilkan dari:",
    no_matching_names:
      "Tidak ada nama yang cocok ditemukan. Coba parameter yang berbeda.",
    // Compatibility Checker
    compatibility_checker: "Pemeriksa Kompatibilitas",
    person_1: "Orang 1",
    person_2: "Orang 2",
    check_compatibility: "Periksa Kompatibilitas",
    compatibility_results: "Hasil Kompatibilitas",
    compatibility_areas: "Area Kompatibilitas",
    detailed_analysis_unlocked: "Analisis Terperinci - Terbuka!",
    all_premium_features_available:
      "Semua fitur premium sekarang tersedia untuk analisis kompatibilitas Anda.",
    // Life Report
    life_report: "Laporan Hidup",
    life_path: "Jalur Hidup",
    year_life_report: "Laporan Hidup 100 Tahun",
    daily_advice: "Saran Harian",
    daily_advice_calendar: "Kalender Saran Harian",
    select_date: "Pilih Tanggal",
    monthly_advice_calendar: "Kalender Saran Bulanan",
    legend: "Legenda:",
    // G1-G9 Descriptions
    g1_desc:
      "Mandiri dan berorientasi kepemimpinan, dengan inisiatif kuat dan jiwa pelopor. Pemimpin alami dengan kemampuan kreatif.",
    g2_desc:
      "Kooperatif dan diplomatik, unggul dalam kemitraan dan kerja tim. Sabar dan berorientasi detail dengan kemampuan intuitif yang kuat.",
    g3_desc:
      "Kreatif dan ekspresif, dengan keterampilan komunikasi yang kuat. Bakat artistik dan pandangan hidup yang optimis.",
    g4_desc:
      "Praktis dan terorganisir, dengan etos kerja yang kuat dan perhatian pada detail. Dapat diandalkan dan sistematis dalam pendekatan.",
    g5_desc:
      "Pencinta kebebasan dan petualang, dengan keinginan kuat akan variasi dan perubahan. Kepribadian yang dinamis dan serbaguna.",
    g6_desc:
      "Memelihara dan bertanggung jawab, dengan orientasi keluarga yang kuat. Peduli dan mendukung dengan kemampuan penyembuhan.",
    g7_desc:
      "Analitis dan introspektif, dengan kecenderungan spiritual yang kuat. Peneliti dan pencari kebenaran dan kebijaksanaan.",
    g8_desc:
      "Ambisius dan berorientasi bisnis, dengan fokus material yang kuat. Organisator alami dengan kemampuan eksekutif.",
    g9_desc:
      "Humanis dan murah hati, dengan keinginan kuat untuk melayani orang lain. Penuh kasih dan pengertian dengan pandangan universal.",
  },
};

export default function MainApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [userName, setUserName] = useState("Guest");
  const [isPremium, setIsPremium] = useState(true);
  const [language, setLanguage] = useState("en");

  // Analysis state
  const [analysisName, setAnalysisName] = useState("");
  const [analysisBirthdate, setAnalysisBirthdate] = useState<Date | null>(null);
  const [analysisGender, setAnalysisGender] = useState<"Male" | "Female">(
    "Male",
  );
  const [showResults, setShowResults] = useState(false);
  const [showLifeReport, setShowLifeReport] = useState(false);

  // Translation function
  const t = (key: string) => {
    // Early return for invalid inputs
    if (!key || typeof key !== "string" || key.trim() === "") {
      return "";
    }

    try {
      // Ensure translations object exists and is valid
      if (
        !translations ||
        typeof translations !== "object" ||
        translations === null
      ) {
        return key;
      }

      // Safely get current language translations with explicit null checks
      const currentLangTranslations =
        translations[language as keyof typeof translations];

      // Try current language first with comprehensive safety checks
      if (
        currentLangTranslations &&
        typeof currentLangTranslations === "object" &&
        currentLangTranslations !== null &&
        !Array.isArray(currentLangTranslations)
      ) {
        const translation =
          currentLangTranslations[key as keyof typeof currentLangTranslations];
        if (
          translation &&
          typeof translation === "string" &&
          translation.trim() !== ""
        ) {
          return translation;
        }
      }

      // Fallback to English with explicit null checks
      const englishTranslations = translations.en;
      if (
        englishTranslations &&
        typeof englishTranslations === "object" &&
        englishTranslations !== null &&
        !Array.isArray(englishTranslations)
      ) {
        const translation =
          englishTranslations[key as keyof typeof englishTranslations];
        if (
          translation &&
          typeof translation === "string" &&
          translation.trim() !== ""
        ) {
          return translation;
        }
      }

      // Return the key itself if no translation found
      return key;
    } catch (error) {
      // Log error but don't throw - graceful degradation
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  const handleAnalysisSubmit = (
    name: string,
    birthdate: Date,
    gender: "Male" | "Female",
  ) => {
    setAnalysisName(name);
    setAnalysisBirthdate(birthdate);
    setAnalysisGender(gender);
    setShowResults(true);
  };

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "analyze":
        setActiveTab("analyze");
        setShowResults(false);
        setShowLifeReport(false);
        break;
      case "report":
        setActiveTab("analyze");
        setShowLifeReport(true);
        setShowResults(false);
        break;
      case "names":
        setActiveTab("names");
        break;
      case "compatibility":
        setActiveTab("compatibility");
        break;
      case "membership":
        setActiveTab("account");
        // Additional logic to show membership plans
        break;
      case "account":
        setActiveTab("account");
        break;
      default:
        setActiveTab(screen);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            userName={userName}
            isPremium={isPremium}
            onNavigate={handleNavigate}
          />
        );
      case "analyze":
        if (showLifeReport && analysisName && analysisBirthdate) {
          return (
            <LifeReport
              name={analysisName}
              birthdate={analysisBirthdate}
              gender={analysisGender}
              isPremium={isPremium}
            />
          );
        }
        return showResults && analysisName && analysisBirthdate ? (
          <NumerologyResults
            name={analysisName}
            birthdate={analysisBirthdate}
            gender={analysisGender}
            isPremium={isPremium}
          />
        ) : (
          <NumerologyForm onSubmit={handleAnalysisSubmit} />
        );
      case "names":
        return (
          <NameGenerator
            isPremium={isPremium}
            analysisName={analysisName}
            analysisBirthdate={analysisBirthdate}
            analysisGender={analysisGender}
          />
        );
      case "compatibility":
        return <CompatibilityChecker isPremium={isPremium} />;
      case "account":
        return (
          <AccountScreen
            userName={userName}
            isPremium={isPremium}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <HomeScreen
            userName={userName}
            isPremium={isPremium}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      <SafeAreaView className="flex-1 bg-white">
        <View
          className="flex-1"
          style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          {renderContent()}
        </View>
        <TabBar activeTab={activeTab} onChangeTab={setActiveTab} />
      </SafeAreaView>
    </TranslationContext.Provider>
  );
}
