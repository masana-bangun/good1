import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Check } from "lucide-react-native";

interface MembershipPlansProps {
  onSelectPlan?: (planId: string) => void;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const MEMBERSHIP_PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "",
    features: [
      "Basic name analysis",
      "Character reading",
      "Limited database access",
      "Indonesian names only",
      "3 free analyses per day",
    ],
  },
  {
    id: "monthly",
    name: "Premium Monthly",
    price: "9.99",
    period: "month",
    features: [
      "Full numerology analysis",
      "Compatibility checker",
      "Name generator",
      "Multiple language databases",
      "Ad-free experience",
      "Unlimited analyses",
    ],
    popular: true,
  },
  {
    id: "yearly",
    name: "Premium Yearly",
    price: "79.99",
    period: "year",
    features: [
      "All Premium Monthly features",
      "Lifetime vibration reports",
      "Personal planner & advice",
      "Priority support",
      "Save 33% compared to monthly",
      "Exclusive premium content",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    price: "199.99",
    period: "one-time",
    features: [
      "All Premium Yearly features",
      "One-time payment",
      "Lifetime access to all features",
      "All future updates included",
      "VIP support",
      "Early access to new features",
    ],
  },
];

export default function MembershipPlans({
  onSelectPlan = () => {},
}: MembershipPlansProps) {
  return (
    <ScrollView className="bg-white p-4 rounded-lg shadow-md">
      <Text className="text-2xl font-bold text-center mb-2 text-purple-800">
        Membership Plans
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Choose the plan that works best for you
      </Text>

      {MEMBERSHIP_PLANS.map((plan) => (
        <View
          key={plan.id}
          className={`mb-4 border rounded-lg p-4 ${plan.popular ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}
        >
          {plan.popular && (
            <View className="absolute top-0 right-0 bg-purple-500 px-2 py-1 rounded-bl-lg rounded-tr-lg">
              <Text className="text-white text-xs font-medium">POPULAR</Text>
            </View>
          )}

          <Text className="text-xl font-bold mb-1">{plan.name}</Text>

          <View className="flex-row items-baseline mb-3">
            <Text className="text-3xl font-bold">${plan.price}</Text>
            {plan.period && (
              <Text className="text-gray-600 ml-1">/{plan.period}</Text>
            )}
          </View>

          <View className="mb-4">
            {plan.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Check size={16} color="#8b5cf6" />
                <Text className="text-gray-700 ml-2">{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className={`py-3 px-4 rounded-md items-center ${plan.id === "free" ? "bg-gray-200" : "bg-purple-600"}`}
            onPress={() => onSelectPlan(plan.id)}
          >
            <Text
              className={`font-medium ${plan.id === "free" ? "text-gray-700" : "text-white"}`}
            >
              {plan.id === "free" ? "Current Plan" : `Get ${plan.name}`}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <View className="mt-4 p-4 bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-500 text-center">
          All plans include a 7-day money-back guarantee. Subscriptions
          automatically renew unless canceled before the renewal date.
        </Text>
      </View>
    </ScrollView>
  );
}
