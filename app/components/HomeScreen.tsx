import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  ArrowRight,
  Star,
  Gift,
  Share2,
  User,
  Check,
  Globe,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import NameDictionary from "./NameDictionary";
import { useTranslation } from "./MainApp";

interface HomeScreenProps {
  userName?: string;
  isPremium?: boolean;
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({
  userName = "User",
  isPremium = true,
  onNavigate = () => {},
}: HomeScreenProps) {
  const { language, setLanguage, t } = useTranslation();
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [showNameDictionary, setShowNameDictionary] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "id", name: "Indonesia", flag: "🇮🇩" },
  ];

  const successfulPeople = [
    {
      name: "Warren Buffett",
      synchronize: 8.9,
      coherence: 9.2,
      momentum: 8.7,
      icon: "💼",
    },
    {
      name: "Jeff Bezos",
      synchronize: 9.1,
      coherence: 8.8,
      momentum: 9.5,
      icon: "🚀",
    },
    {
      name: "Elon Musk",
      synchronize: 9.3,
      coherence: 8.5,
      momentum: 9.8,
      icon: "⚡",
    },
    {
      name: "Bill Gates",
      synchronize: 8.7,
      coherence: 9.4,
      momentum: 8.9,
      icon: "💻",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersonIndex(
        (prevIndex) => (prevIndex + 1) % successfulPeople.length,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPerson = successfulPeople[currentPersonIndex];

  return (
    <ScrollView className="bg-gray-100">
      {/* Header */}
      <View className="bg-purple-700 p-6 rounded-b-3xl">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-white text-lg mb-1">{t("welcome_back")}</Text>
            <Text className="text-white text-2xl font-bold">{userName}</Text>
          </View>

          {/* Language Selector */}
          <TouchableOpacity
            className="bg-white bg-opacity-20 p-2 rounded-lg flex-row items-center"
            onPress={() => setShowLanguageSelector(!showLanguageSelector)}
          >
            <Globe size={16} color="white" />
            <Text className="text-white text-xs ml-1 font-medium">
              {languageOptions.find((lang) => lang.code === language)?.flag}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Dropdown */}
        {showLanguageSelector && (
          <View className="bg-white rounded-lg p-2 mb-4">
            <Text className="text-gray-700 font-medium mb-2 text-center">
              {t("language")}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {languageOptions.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    className={`mx-1 px-3 py-2 rounded-lg flex-row items-center ${
                      language === lang.code ? "bg-purple-100" : "bg-gray-100"
                    }`}
                    onPress={() => {
                      setLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                  >
                    <Text className="mr-1">{lang.flag}</Text>
                    <Text
                      className={`text-xs font-medium ${
                        language === lang.code
                          ? "text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View className="bg-green-400 mt-4 p-3 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Star size={20} color="#047857" />
            <Text className="text-green-800 font-medium ml-2">
              {t("all_premium_features_unlocked")}
            </Text>
          </View>
          <Check size={20} color="#047857" />
        </View>
      </View>

      {/* Quick Actions - Single Row Layout */}
      <View className="p-4">
        <Text className="text-lg font-bold mb-3">{t("quick_actions")}</Text>
        <View className="flex-row justify-between items-center px-2">
          {/* Name Analysis */}
          <TouchableOpacity
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl items-center justify-center shadow-lg"
            onPress={() => onNavigate("analyze")}
          >
            <View className="items-center">
              <Text className="text-xl mb-1">🔬</Text>
              <Text className="text-white text-xs font-bold text-center">
                {t("name_analysis")}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Compatibility */}
          <TouchableOpacity
            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl items-center justify-center shadow-lg"
            onPress={() => onNavigate("compatibility")}
          >
            <View className="items-center">
              <Text className="text-xl mb-1">💕</Text>
              <Text className="text-white text-xs font-bold text-center">
                {t("love_couple")}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Name Dictionary */}
          <TouchableOpacity
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl items-center justify-center shadow-xl"
            onPress={() => setShowNameDictionary(true)}
          >
            <View className="items-center">
              <Text className="text-lg mb-1">📚</Text>
              <Text className="text-white text-xs font-bold">
                {t("dictio_name")}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Name Generator */}
          <TouchableOpacity
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-xl items-center justify-center shadow-lg"
            onPress={() => onNavigate("names")}
          >
            <View className="items-center">
              <Text className="text-xl mb-0">⭐⭐</Text>
              <Text className="text-white text-xs font-bold text-center">
                {t("generator_name_optimizer")}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Life Report */}
          <TouchableOpacity
            className={`w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl items-center justify-center shadow-lg`}
            onPress={() => onNavigate("report")}
            disabled={false}
          >
            <View className="items-center">
              <Text className="text-xl mb-0">📈</Text>
              <Text className="text-white text-xs font-bold text-center">
                {t("lifeplan_report")}
              </Text>
              <View className="absolute -top-1 -right-1 bg-green-300 rounded-full p-1">
                <Check size={6} color="#047857" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Successful People's Names Value */}
      <View className="p-4 mb-4">
        <View className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white font-bold text-sm mb-1">
                {t("successful_people")} : {currentPerson.name}
              </Text>
              <Text className="text-white opacity-90 text-xs mb-2">
                {t("synchronize")}: {Math.round(currentPerson.synchronize * 10)}
                % | {t("coherence")}: {Math.round(currentPerson.coherence * 10)}
                % | {t("momentum")}: {currentPerson.momentum}/10
              </Text>
              <TouchableOpacity className="bg-white py-1.5 px-3 rounded-lg flex-row items-center self-start">
                <Text className="text-green-600 font-medium text-xs">
                  {t("discover_power_names")}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center">
              <Text className="text-2xl">{currentPerson.icon}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Earn Free Credits */}
      <View className="p-4 mb-4">
        <View className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white font-bold text-lg mb-2">
                {t("earn_free_credits")}
              </Text>
              <Text className="text-white opacity-90 mb-3">
                {t("share_with_friends")}
              </Text>
              <TouchableOpacity className="bg-white py-2 px-4 rounded-lg flex-row items-center self-start">
                <Share2 size={16} color="#8b5cf6" />
                <Text className="text-purple-600 font-medium ml-1">
                  {t("share_now")}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-16 h-16 bg-white rounded-full items-center justify-center">
              <Gift size={32} color="#8b5cf6" />
            </View>
          </View>
        </View>
      </View>

      <NameDictionary
        visible={showNameDictionary}
        onClose={() => setShowNameDictionary(false)}
      />
    </ScrollView>
  );
}
