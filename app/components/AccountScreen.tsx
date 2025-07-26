import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";

interface AccountScreenProps {
  userName?: string;
  email?: string;
  isPremium?: boolean;
  onNavigate: (screen: string) => void;
}

export default function AccountScreen({
  userName = "User",
  email = "user@example.com",
  isPremium = true,
  onNavigate = () => {},
}: AccountScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const menuItems = [
    {
      id: "membership",
      title: "Membership",
      icon: <CreditCard size={20} color="#8b5cf6" />,
      rightElement: isPremium ? (
        <View className="bg-purple-100 px-2 py-1 rounded">
          <Text className="text-purple-800 text-xs font-medium">PREMIUM</Text>
        </View>
      ) : (
        <ChevronRight size={20} color="#9ca3af" />
      ),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell size={20} color="#8b5cf6" />,
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
          thumbColor={notificationsEnabled ? "#8b5cf6" : "#f4f3f4"}
        />
      ),
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <Shield size={20} color="#8b5cf6" />,
      rightElement: <ChevronRight size={20} color="#9ca3af" />,
    },
    {
      id: "help",
      title: "Help & Support",
      icon: <HelpCircle size={20} color="#8b5cf6" />,
      rightElement: <ChevronRight size={20} color="#9ca3af" />,
    },
    {
      id: "logout",
      title: "Log Out",
      icon: <LogOut size={20} color="#ef4444" />,
      danger: true,
    },
  ];

  return (
    <ScrollView className="bg-gray-100">
      {/* Profile Header */}
      <View className="bg-white p-6 items-center mb-4">
        <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-3">
          <User size={40} color="#8b5cf6" />
        </View>
        <Text className="text-xl font-bold">{userName}</Text>
        <Text className="text-gray-500">{email}</Text>

        <TouchableOpacity
          className="mt-4 border border-purple-500 rounded-lg py-2 px-4"
          onPress={() => onNavigate("editProfile")}
        >
          <Text className="text-purple-600 font-medium">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View className="bg-white rounded-lg mx-4 mb-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row items-center justify-between p-4 ${index < menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
            onPress={() => onNavigate(item.id)}
          >
            <View className="flex-row items-center">
              {item.icon}
              <Text
                className={`ml-3 font-medium ${item.danger ? "text-red-500" : "text-gray-800"}`}
              >
                {item.title}
              </Text>
            </View>
            {item.rightElement}
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View className="mx-4 mb-6">
        <Text className="text-center text-gray-500 text-sm">Version 1.0.0</Text>
      </View>

      <View className="bg-green-100 m-4 p-4 rounded-lg mb-6">
        <Text className="text-lg font-semibold text-green-800 mb-2">
          Premium Features Unlocked!
        </Text>
        <Text className="text-gray-700 mb-3">
          You now have unlimited access to all features and an ad-free
          experience.
        </Text>
        <View className="bg-green-600 py-2 px-4 rounded-md items-center">
          <Text className="text-white font-medium">All Features Active</Text>
        </View>
      </View>
    </ScrollView>
  );
}
