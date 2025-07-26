import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  searchNameDictionary,
  getAvailableLanguages,
} from "../utils/numerologyUtils";
import { X } from "lucide-react-native";

interface NameDictionaryProps {
  visible: boolean;
  onClose: () => void;
}

export default function NameDictionary({
  visible,
  onClose,
}: NameDictionaryProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("Indonesian");
  const [nameSearchTerm, setNameSearchTerm] = useState<string>("");
  const [meaningSearchTerm, setMeaningSearchTerm] = useState<string>("");
  const [dictionaryResults, setDictionaryResults] = useState<
    Array<{ name: string; meaning: string }>
  >([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // Initialize available languages on component mount
  useEffect(() => {
    const languages = getAvailableLanguages();
    setAvailableLanguages(languages);
    if (languages.length > 0) {
      setSelectedLanguage(languages[0]);
    }
  }, []);

  // Search dictionary when search terms or language changes
  useEffect(() => {
    const results = searchNameDictionary(
      selectedLanguage,
      nameSearchTerm,
      meaningSearchTerm,
    );
    setDictionaryResults(results);
  }, [selectedLanguage, nameSearchTerm, meaningSearchTerm]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-purple-800">
              Name Dictionary
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">Language</Text>
              <View className="border border-gray-300 rounded-md bg-gray-50">
                <Picker
                  selectedValue={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  style={{ height: 40 }}
                >
                  {availableLanguages.map((lang) => (
                    <Picker.Item key={lang} label={lang} value={lang} />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">
                Search by Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-gray-50"
                placeholder="Enter name to search"
                value={nameSearchTerm}
                onChangeText={setNameSearchTerm}
              />
            </View>

            <View className="mb-3">
              <Text className="text-gray-700 mb-1 font-medium">
                Search by Meaning
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 bg-gray-50"
                placeholder="Enter meaning to search"
                value={meaningSearchTerm}
                onChangeText={setMeaningSearchTerm}
              />
            </View>

            {dictionaryResults.length > 0 && (
              <View className="mb-4">
                <Text className="text-md font-semibold mb-2 text-purple-700">
                  Dictionary Results ({dictionaryResults.length} found)
                </Text>
                <ScrollView
                  style={{ maxHeight: 300 }}
                  className="border border-gray-200 rounded-lg bg-white"
                >
                  {dictionaryResults.map((entry, index) => (
                    <View key={index} className="p-3 border-b border-gray-100">
                      <Text className="text-lg font-medium text-purple-800">
                        {entry.name}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {entry.meaning}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {dictionaryResults.length === 0 &&
              (nameSearchTerm || meaningSearchTerm) && (
                <View className="p-3 bg-gray-100 rounded-lg">
                  <Text className="text-gray-600 text-center">
                    No results found for your search.
                  </Text>
                </View>
              )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
