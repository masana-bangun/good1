import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Svg, { Path, Circle, Line } from "react-native-svg";
import {
  getPola,
  reduksiAngka,
  pythagoreanValues,
  generateLifeReport,
  calculateDestiny,
} from "../utils/numerologyUtils";

interface LifeReportProps {
  name: string;
  birthdate: Date;
  gender: "Male" | "Female";
  isPremium?: boolean;
}

export default function LifeReport({
  name = "",
  birthdate = new Date(),
  gender = "Male",
  isPremium = true,
}: LifeReportProps) {
  // Always show premium features
  const isPremiumEnabled = true;

  // State for modals and selections
  const [showLifeReport, setShowLifeReport] = useState(false);
  const [showDailyAdvice, setShowDailyAdvice] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthlyAdvice, setShowMonthlyAdvice] = useState(false);
  const [showParameterDetail, setShowParameterDetail] = useState(false);
  const [selectedParameterDetail, setSelectedParameterDetail] = useState<
    string | null
  >(null);
  const [internalChartData, setInternalChartData] = useState<
    { year: number; relationshipValue: number }[]
  >([]);

  // Yearly Relationship Table for internal analysis (updated values)
  const yearlyRelationshipTable: Record<string, number> = {
    "1-1": 0.5,
    "1-19": 0.5,
    "1-2": 0.75,
    "1-11": 0.75,
    "1-3": 0.75,
    "1-4": -1,
    "1-13": -1,
    "1-22": -1,
    "1-5": -1,
    "1-14": -1,
    "1-6": 0.75,
    "1-33": 0.75,
    "1-7": 0.75,
    "1-16": 0.75,
    "1-8": 0.5,
    "1-9": 0.75,
    "2-1": 0.75,
    "2-19": 0.75,
    "2-2": 1,
    "2-11": 1,
    "2-3": 0.5,
    "2-4": 0.75,
    "2-13": 0.75,
    "2-22": 0.75,
    "2-5": -1,
    "2-14": -1,
    "2-6": 1,
    "2-33": 1,
    "2-7": 0.75,
    "2-16": 0.75,
    "2-8": 0.5,
    "2-9": 1,
    "3-1": 0.75,
    "3-19": 0.75,
    "3-2": 0.5,
    "3-11": 0.5,
    "3-3": -1,
    "3-4": 0.5,
    "3-13": 0.5,
    "3-22": 0.5,
    "3-5": 0.75,
    "3-14": 0.75,
    "3-6": 1,
    "3-33": 1,
    "3-7": 0.5,
    "3-16": 0.5,
    "3-8": -1,
    "3-9": 1,
    "4-1": -1,
    "4-19": -1,
    "4-2": 0.75,
    "4-11": 0.75,
    "4-3": 0.5,
    "4-4": 1,
    "4-13": 1,
    "4-22": 1,
    "4-5": 0.5,
    "4-14": 0.5,
    "4-6": 1,
    "4-33": 1,
    "4-7": 0.75,
    "4-16": 0.75,
    "4-8": 0.75,
    "4-9": 0.75,
    "5-1": -1,
    "5-19": -1,
    "5-2": -1,
    "5-11": -1,
    "5-3": 0.75,
    "5-4": 0.5,
    "5-13": 0.5,
    "5-22": 0.5,
    "5-5": -1,
    "5-14": -1,
    "5-6": 0.5,
    "5-33": 0.5,
    "5-7": 0.5,
    "5-16": 0.5,
    "5-8": 0.5,
    "5-9": 0.5,
    "6-1": 0.75,
    "6-2": 1,
    "6-11": 1,
    "6-3": 1,
    "6-4": 1,
    "6-13": 1,
    "6-22": 1,
    "6-5": 0.5,
    "6-14": 0.5,
    "6-6": 1,
    "6-33": 1,
    "6-7": 0.5,
    "6-16": 0.5,
    "6-8": 0.5,
    "6-9": 1,
    "7-1": 0.75,
    "7-19": 0.75,
    "7-2": 0.75,
    "7-11": 0.75,
    "7-3": 0.5,
    "7-4": 0.75,
    "7-13": 0.75,
    "7-22": 0.75,
    "7-5": 0.5,
    "7-14": 0.5,
    "7-6": 0.5,
    "7-33": 0.5,
    "7-7": 1,
    "7-16": 1,
    "7-8": 0.5,
    "7-9": 1,
    "8-1": 0.5,
    "8-19": 0.5,
    "8-2": 0.5,
    "8-11": 0.5,
    "8-3": -1,
    "8-4": 0.75,
    "8-13": 0.75,
    "8-22": 0.75,
    "8-5": 0.5,
    "8-14": 0.5,
    "8-6": 0.75,
    "8-33": 0.75,
    "8-7": 0.5,
    "8-16": 0.5,
    "8-8": 0.5,
    "8-9": 0.75,
    "9-1": 0.75,
    "9-19": 0.75,
    "9-11": 0.75,
    "9-2": 1,
    "9-3": 1,
    "9-4": 0.75,
    "9-13": 0.75,
    "9-22": 0.75,
    "9-5": 0.5,
    "9-14": 0.5,
    "9-6": 1,
    "9-33": 1,
    "9-7": 1,
    "9-16": 1,
    "9-8": 0.75,
    "9-9": 1,
    "11-1": 0.75,
    "11-19": 0.75,
    "11-2": 1,
    "11-11": 1,
    "11-3": 0.5,
    "11-4": 0.75,
    "11-13": 0.75,
    "11-22": 0.75,
    "11-5": -1,
    "11-14": -1,
    "11-6": 1,
    "11-33": 1,
    "11-7": 0.75,
    "11-16": 0.75,
    "11-8": 0.5,
    "11-9": 1,
    "22-1": -1,
    "22-19": -1,
    "22-2": 0.75,
    "22-11": 0.75,
    "22-3": 0.5,
    "22-4": 1,
    "22-13": 1,
    "22-22": 1,
    "22-5": 0.5,
    "22-14": 0.5,
    "22-6": 1,
    "22-33": 1,
    "22-7": 0.75,
    "22-16": 0.75,
    "22-8": 0.75,
    "22-9": 0.75,
    "33-1": 0.75,
    "33-19": 0.75,
    "33-2": 0.75,
    "33-11": 0.75,
    "33-3": 1,
    "33-4": 1,
    "33-13": 1,
    "33-22": 1,
    "33-5": 0.5,
    "33-14": 0.5,
    "33-6": 1,
    "33-33": 1,
    "33-7": 0.5,
    "33-16": 0.5,
    "33-8": 0.5,
    "33-9": 1,
  };

  // PY-Essence Relationship Table for internal analysis (copied from CompatibilityChecker)
  const pyEssenceRelationshipTable: Record<string, number> = {
    "1-1": -0.25,
    "1-19": -0.25,
    "1-2": 0,
    "1-11": 0,
    "1-3": 0,
    "1-4": 0,
    "1-13": 0,
    "1-22": 0,
    "1-5": 0,
    "1-14": 0,
    "1-6": 0,
    "1-33": 0,
    "1-7": 0,
    "1-16": 0,
    "1-8": 0,
    "1-9": 0,
    "2-1": 0,
    "2-19": 0,
    "2-2": -0.25,
    "2-11": -0.25,
    "2-3": 0,
    "2-4": 0,
    "2-13": 0,
    "2-22": 0,
    "2-5": 0,
    "2-14": 0,
    "2-6": 0,
    "2-33": 0,
    "2-7": 0,
    "2-16": 0,
    "2-8": 0,
    "2-9": 0,
    "3-1": 0,
    "3-19": 0,
    "3-2": 0,
    "3-11": 0,
    "3-3": -0.25,
    "3-4": 0,
    "3-13": 0,
    "3-22": 0,
    "3-5": 0,
    "3-14": 0,
    "3-6": 0,
    "3-33": 0,
    "3-7": 0,
    "3-16": 0,
    "3-8": 0,
    "3-9": 0,
    "4-1": 0,
    "4-19": 0,
    "4-2": 0,
    "4-11": 0,
    "4-3": 0,
    "4-4": -0.25,
    "4-13": -0.25,
    "4-22": -0.25,
    "4-5": 0,
    "4-14": 0,
    "4-6": 0,
    "4-33": 0,
    "4-7": 0,
    "4-16": 0,
    "4-8": 0,
    "4-9": 0,
    "5-1": 0,
    "5-19": 0,
    "5-2": 0,
    "5-11": 0,
    "5-3": 0,
    "5-4": 0,
    "5-13": 0,
    "5-22": 0,
    "5-5": -0.25,
    "5-14": -0.25,
    "5-6": 0,
    "5-33": 0,
    "5-7": 0,
    "5-16": 0,
    "5-8": 0,
    "5-9": 0,
    "6-1": 0,
    "6-19": 0,
    "6-2": 0,
    "6-11": 0,
    "6-3": 0,
    "6-4": 0,
    "6-13": 0,
    "6-22": 0,
    "6-5": 0,
    "6-14": 0,
    "6-6": -0.25,
    "6-33": -0.25,
    "6-7": 0,
    "6-16": 0,
    "6-8": 0,
    "6-9": 0,
    "7-1": 0,
    "7-19": 0,
    "7-2": 0,
    "7-11": 0,
    "7-3": 0,
    "7-4": 0,
    "7-13": 0,
    "7-22": 0,
    "7-5": 0,
    "7-14": 0,
    "7-6": 0,
    "7-33": 0,
    "7-7": -0.25,
    "7-16": -0.25,
    "7-8": 0,
    "7-9": 0,
    "8-1": 0,
    "8-19": 0,
    "8-2": 0,
    "8-11": 0,
    "8-3": 0,
    "8-4": 0,
    "8-13": 0,
    "8-22": 0,
    "8-5": 0,
    "8-14": 0,
    "8-6": 0,
    "8-33": 0,
    "8-7": 0,
    "8-16": 0,
    "8-8": -0.25,
    "8-9": 0,
    "9-1": 0,
    "9-19": 0,
    "9-11": 0,
    "9-2": 0,
    "9-3": 0,
    "9-4": 0,
    "9-13": 0,
    "9-22": 0,
    "9-5": 0,
    "9-14": 0,
    "9-6": 0,
    "9-33": 0,
    "9-7": 0,
    "9-16": 0,
    "9-8": 0,
    "9-9": -0.25,
    "11-1": 0,
    "11-19": 0,
    "11-2": -0.25,
    "11-11": -0.25,
    "11-3": 0,
    "11-4": 0,
    "11-13": 0,
    "11-22": 0,
    "11-5": 0,
    "11-14": 0,
    "11-6": 0,
    "11-33": 0,
    "11-7": 0,
    "11-16": 0,
    "11-8": 0,
    "11-9": 0,
    "13-1": 0,
    "13-19": 0,
    "13-2": 0,
    "13-11": 0,
    "13-3": 0,
    "13-4": -0.25,
    "13-13": -0.25,
    "13-22": -0.25,
    "13-5": 0,
    "13-14": 0,
    "13-6": 0,
    "13-33": 0,
    "13-7": 0,
    "13-16": 0,
    "13-8": 0,
    "13-9": 0,
    "14-1": 0,
    "14-19": 0,
    "14-2": 0,
    "14-11": 0,
    "14-3": 0,
    "14-4": 0,
    "14-13": 0,
    "14-22": 0,
    "14-5": -0.25,
    "14-14": -0.25,
    "14-6": 0,
    "14-33": 0,
    "14-7": 0,
    "14-16": 0,
    "14-8": 0,
    "14-9": 0,
    "16-1": 0,
    "16-19": 0,
    "16-2": 0,
    "16-11": 0,
    "16-3": 0,
    "16-4": 0,
    "16-13": 0,
    "16-22": 0,
    "16-5": 0,
    "16-14": 0,
    "16-6": 0,
    "16-33": 0,
    "16-7": -0.25,
    "16-16": -0.25,
    "16-8": 0,
    "16-9": 0,
    "19-1": -0.25,
    "19-19": -0.25,
    "19-2": 0,
    "19-11": 0,
    "19-3": 0,
    "19-4": 0,
    "19-13": 0,
    "19-22": 0,
    "19-5": 0,
    "19-14": 0,
    "19-6": 0,
    "19-33": 0,
    "19-7": 0,
    "19-16": 0,
    "19-8": 0,
    "19-9": 0,
    "22-1": 0,
    "22-19": 0,
    "22-2": 0,
    "22-11": 0,
    "22-3": 0,
    "22-4": -0.25,
    "22-13": -0.25,
    "22-22": -0.25,
    "22-5": 0,
    "22-14": 0,
    "22-6": 0,
    "22-33": 0,
    "22-7": 0,
    "22-16": 0,
    "22-8": 0,
    "22-9": 0,
    "33-1": 0,
    "33-19": 0,
    "33-2": 0,
    "33-11": 0,
    "33-3": 0,
    "33-4": 0,
    "33-13": 0,
    "33-22": 0,
    "33-5": 0,
    "33-14": 0,
    "33-6": -0.25,
    "33-33": -0.25,
    "33-7": 0,
    "33-16": 0,
    "33-8": 0,
    "33-9": 0,
  };

  // Helper function to get yearly relationship value (copied from CompatibilityChecker)
  const getYearlyRelationshipValue = (val1: number, val2: number): number => {
    if (!val1 || !val2) return 0;
    const key1 = `${val1}-${val2}`;
    const key2 = `${val2}-${val1}`;
    return yearlyRelationshipTable[key1] || yearlyRelationshipTable[key2] || 0;
  };

  // Helper function to get PY-Essence value (copied from CompatibilityChecker)
  const getPyEssenceValue = (py: number, ess: number): number => {
    if (!py || !ess) return 0;
    const key = `${py}-${ess}`;
    return pyEssenceRelationshipTable[key] || 0;
  };

  // Calculate internal relationship score for each year
  const calculateInternalRelationshipScore = (
    staticParams: any,
    yearlyParams: any,
  ): number => {
    // 1. Hitung rata-rata hubungan statis vs dinamis
    const avg_vs_cycle =
      (getYearlyRelationshipValue(staticParams.expression, yearlyParams.cycle) +
        getYearlyRelationshipValue(staticParams.time, yearlyParams.cycle) +
        getYearlyRelationshipValue(
          staticParams.heartDesire,
          yearlyParams.cycle,
        )) /
      3;

    const avg_vs_pinnacle =
      (getYearlyRelationshipValue(
        staticParams.expression,
        yearlyParams.pinnacle,
      ) +
        getYearlyRelationshipValue(staticParams.time, yearlyParams.pinnacle) +
        getYearlyRelationshipValue(
          staticParams.heartDesire,
          yearlyParams.pinnacle,
        )) /
      3;

    const avg_vs_essence =
      (getYearlyRelationshipValue(
        staticParams.expression,
        yearlyParams.essence,
      ) +
        getYearlyRelationshipValue(staticParams.time, yearlyParams.essence) +
        getYearlyRelationshipValue(
          staticParams.heartDesire,
          yearlyParams.essence,
        )) /
      3;

    const overall_avg = (avg_vs_cycle + avg_vs_pinnacle + avg_vs_essence) / 3;

    // 2. Hitung skor PY vs Essence
    const py_ess_score = getPyEssenceValue(
      yearlyParams.personalYear,
      yearlyParams.essence,
    );

    // 3. Gabungkan skor untuk nilai akhir
    const finalScore = overall_avg + py_ess_score;

    return finalScore;
  };

  // Relationship value table for static vs dynamic parameter analysis
  const relationshipValueTable: Record<string, number> = {
    "1-1": 10,
    "1-2": 9,
    "1-3": 8,
    "1-4": 0.5,
    "1-5": 10,
    "1-6": 6,
    "1-33": 6,
    "1-7": 5,
    "1-8": 4,
    "1-9": 3,
    "1-11": 9,
    "1-22": 0.5,
    "2-1": 9,
    "2-2": 10,
    "2-3": 9,
    "2-4": 8,
    "2-5": 0.5,
    "2-6": 10,
    "2-33": 10,
    "2-7": 6,
    "2-8": 5,
    "2-9": 1,
    "2-11": 10,
    "2-22": 8,
    "3-1": 8,
    "3-2": 9,
    "3-3": 10,
    "3-4": 9,
    "3-5": 8,
    "3-6": 2,
    "3-33": 2,
    "3-7": 10,
    "3-8": 1,
    "3-9": 5,
    "3-11": 1,
    "3-22": 9,
    "4-1": 0.5,
    "4-2": 8,
    "4-3": 9,
    "4-4": 10,
    "4-5": 9,
    "4-6": 8,
    "4-33": 8,
    "4-7": 0.5,
    "4-8": 10,
    "4-9": 1,
    "4-11": 8,
    "4-22": 10,
    "5-1": 10,
    "5-2": 0.5,
    "5-3": 8,
    "5-4": 9,
    "5-5": 10,
    "5-6": 6,
    "5-33": 6,
    "5-7": 8,
    "5-8": 0.5,
    "5-9": 8,
    "5-11": 1,
    "5-22": 9,
    "6-1": 6,
    "6-2": 10,
    "6-3": 2,
    "6-4": 8,
    "6-5": 6,
    "6-6": 10,
    "6-33": 10,
    "6-7": 7,
    "6-8": 6,
    "6-9": 2,
    "6-11": 10,
    "6-22": 8,
    "7-1": 5,
    "7-2": 6,
    "7-3": 10,
    "7-4": 0.5,
    "7-5": 8,
    "7-6": 6,
    "7-33": 6,
    "7-7": 8,
    "7-8": 9,
    "7-9": 1,
    "7-11": 10,
    "7-22": 0.5,
    "8-1": 4,
    "8-2": 5,
    "8-3": 1,
    "8-4": 10,
    "8-5": 0.5,
    "8-6": 1,
    "8-33": 1,
    "8-7": 9,
    "8-8": 8,
    "8-9": 9,
    "8-11": 5,
    "8-22": 10,
    "9-1": 3,
    "9-2": 1,
    "9-3": 5,
    "9-4": 1,
    "9-5": 8,
    "9-6": 2,
    "9-33": 2,
    "9-7": 1,
    "9-8": 9,
    "9-9": 10,
    "9-11": 4,
    "9-22": 1,
    "11-1": 9,
    "11-2": 1,
    "11-3": 1,
    "11-4": 4,
    "11-5": 2,
    "11-6": 6,
    "11-33": 6,
    "11-7": 10,
    "11-8": 5,
    "11-9": 8,
    "11-11": 1,
    "11-22": 1,
    "22-1": 0.5,
    "22-2": 8,
    "22-3": 9,
    "22-4": 10,
    "22-5": 9,
    "22-6": 8,
    "22-33": 8,
    "22-7": 0.5,
    "22-8": 10,
    "22-9": 6,
    "22-11": 1,
    "22-22": 1,
    "33-1": 6,
    "33-2": 10,
    "33-3": 2,
    "33-4": 8,
    "33-5": 6,
    "33-6": 10,
    "33-33": 10,
    "33-7": 7,
    "33-8": 6,
    "33-9": 2,
    "33-11": 10,
    "33-22": 8,
  };

  // Harmony table from CompatibilityChecker for relationship2 calculation
  const harmonyTable: Record<string, number> = {
    "1-1": 5,
    "1-2": 7.5,
    "1-11": 7.5,
    "1-3": 7.5,
    "1-4": 2.5,
    "1-22": 2.5,
    "1-5": 2.5,
    "1-6": 7.5,
    "1-33": 7.5,
    "1-7": 7.5,
    "1-8": 5,
    "1-9": 7.5,
    "2-1": 7.5,
    "2-2": 10,
    "2-11": 10,
    "2-3": 5,
    "2-4": 7.5,
    "2-22": 7.5,
    "2-5": 2.5,
    "2-6": 10,
    "2-33": 10,
    "2-7": 7.5,
    "2-8": 5,
    "2-9": 10,
    "3-1": 7.5,
    "3-2": 5,
    "3-11": 5,
    "3-3": 2.5,
    "3-4": 5,
    "3-22": 5,
    "3-5": 7.5,
    "3-6": 10,
    "3-33": 10,
    "3-7": 5,
    "3-8": 2.5,
    "3-9": 10,
    "4-1": 2.5,
    "4-2": 7.5,
    "4-11": 7.5,
    "4-3": 5,
    "4-4": 10,
    "4-22": 10,
    "4-5": 5,
    "4-6": 10,
    "4-33": 10,
    "4-7": 7.5,
    "4-8": 7.5,
    "4-9": 7.5,
    "5-1": 2.5,
    "5-2": 2.5,
    "5-11": 2.5,
    "5-3": 7.5,
    "5-4": 5,
    "5-22": 5,
    "5-5": 2.5,
    "5-6": 5,
    "5-7": 5,
    "5-8": 5,
    "5-9": 5,
    "6-1": 7.5,
    "6-2": 10,
    "6-3": 10,
    "6-4": 10,
    "6-5": 5,
    "6-6": 10,
    "6-7": 5,
    "6-8": 5,
    "6-9": 10,
    "7-1": 7.5,
    "7-2": 7.5,
    "7-11": 7.5,
    "7-3": 5,
    "7-4": 7.5,
    "7-22": 7.5,
    "7-5": 5,
    "7-6": 5,
    "7-7": 10,
    "7-8": 5,
    "7-9": 10,
    "8-1": 5,
    "8-2": 5,
    "8-11": 5,
    "8-3": 2.5,
    "8-4": 7.5,
    "8-22": 7.5,
    "8-5": 5,
    "8-6": 7.5,
    "8-33": 7.5,
    "8-7": 5,
    "8-8": 5,
    "8-9": 7.5,
    "9-1": 7.5,
    "9-2": 10,
    "9-11": 10,
    "9-3": 10,
    "9-4": 7.5,
    "9-22": 7.5,
    "9-5": 5,
    "9-6": 10,
    "9-33": 10,
    "9-7": 10,
    "9-8": 7.5,
    "9-9": 10,
    "11-1": 7.5,
    "11-2": 10,
    "11-11": 10,
    "11-3": 5,
    "11-4": 7.5,
    "11-22": 7.5,
    "11-5": 2.5,
    "11-6": 10,
    "11-33": 10,
    "11-7": 7.5,
    "11-8": 5,
    "11-9": 10,
    "22-1": 2.5,
    "22-2": 7.5,
    "22-11": 7.5,
    "22-3": 5,
    "22-4": 10,
    "22-22": 10,
    "22-5": 5,
    "22-6": 10,
    "22-7": 7.5,
    "22-8": 7.5,
    "22-9": 7.5,
  };

  const [selectedYearPoint, setSelectedYearPoint] = useState<{
    year: number;
    x: number;
    y: number;
  } | null>(null);

  // Get harmony level color based on value
  const getHarmonyLevelColor = (value: number): string => {
    if (value >= 0.5) return "#22c55e"; // Green
    if (value >= 0) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  // Create smooth curve path using cubic bezier curves with intelligent straight line detection
  const createSmoothPath = (
    data: { year: number; relationshipValue: number }[],
    graphWidth: number,
    graphHeight: number,
    maxValue: number,
    range: number,
  ): string => {
    if (data.length < 2) return "";

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
      const isStraightSegment =
        Math.abs(currentPoint.value - prevPoint.value) < 0.01;

      if (isStraightSegment) {
        // Draw straight line for equal values
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
      } else {
        // Calculate control points for smoother cubic bezier curves
        const tension = 0.3; // Smoothness factor

        // Control point 1 (from previous point)
        let cp1x = prevPoint.x;
        let cp1y = prevPoint.y;

        if (
          prevPrevPoint &&
          Math.abs(prevPrevPoint.value - prevPoint.value) > 0.01
        ) {
          cp1x = prevPoint.x + (currentPoint.x - prevPrevPoint.x) * tension;
          cp1y = prevPoint.y + (currentPoint.y - prevPrevPoint.y) * tension;
        }

        // Control point 2 (to current point)
        let cp2x = currentPoint.x;
        let cp2y = currentPoint.y;

        if (
          nextPoint &&
          Math.abs(nextPoint.value - currentPoint.value) > 0.01
        ) {
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
  const findExtremeYears = (
    data: { year: number; relationshipValue: number }[],
  ) => {
    if (data.length === 0) return { highest: [], lowest: [] };

    const maxValue = Math.max(...data.map((d) => d.relationshipValue));
    const minValue = Math.min(...data.map((d) => d.relationshipValue));

    const highest = data
      .filter((d) => d.relationshipValue === maxValue)
      .slice(0, 3); // Top 3
    const lowest = data
      .filter((d) => d.relationshipValue === minValue)
      .slice(0, 3); // Bottom 3

    return { highest, lowest };
  };

  // Render smooth curved line graph
  const renderLineGraph = (
    data: { year: number; relationshipValue: number }[],
  ) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.relationshipValue));
    const minValue = Math.min(...data.map((d) => d.relationshipValue));
    const range = maxValue - minValue || 1;
    const graphHeight = 200;
    const verticalPadding = 30; // Add vertical padding to ensure all points are visible
    const graphWidth = Math.max(600, data.length * 8);
    const { highest, lowest } = findExtremeYears(data);

    return (
      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="text-lg font-bold text-center mb-4 text-orange-800">
          Grafik Hubungan Internal (100 Tahun)
        </Text>

        {/* Extreme Values Display */}
        <View className="flex-row justify-between mb-4 px-2">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-semibold text-green-700 mb-1">
              🔥 Tahun Terbaik:
            </Text>
            {highest.map((item, index) => (
              <Text key={index} className="text-xs text-green-600">
                {item.year}: {item.relationshipValue.toFixed(2)}
              </Text>
            ))}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold text-red-700 mb-1">
              ⚠️ Tahun Menantang:
            </Text>
            {lowest.map((item, index) => (
              <Text key={index} className="text-xs text-red-600">
                {item.year}: {item.relationshipValue.toFixed(2)}
              </Text>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View
            style={{
              width: graphWidth,
              height: graphHeight + 60 + verticalPadding * 2,
            }}
          >
            {/* Y-axis labels */}
            <View
              className="absolute left-0"
              style={{ top: verticalPadding, height: graphHeight }}
            >
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const value = maxValue - ratio * range;
                return (
                  <View
                    key={index}
                    className="absolute flex-row items-center"
                    style={{ top: ratio * graphHeight - 8 }}
                  >
                    <Text className="text-xs text-gray-600 w-8 text-right mr-2">
                      {value.toFixed(1)}
                    </Text>
                    <View className="w-1 h-px bg-gray-300" />
                  </View>
                );
              })}
            </View>

            {/* Graph area */}
            <View
              className="ml-12"
              style={{
                width: graphWidth - 48,
                height: graphHeight,
                marginTop: verticalPadding,
              }}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <View
                  key={index}
                  className="absolute w-full h-px bg-gray-200"
                  style={{ top: ratio * graphHeight }}
                />
              ))}

              {/* Single smooth SVG curve */}
              <View className="relative w-full h-full">
                <Svg
                  width={graphWidth - 48}
                  height={graphHeight}
                  style={{ position: "absolute" }}
                >
                  {/* Main smooth curve with bold orange color */}
                  <Path
                    d={createSmoothPath(
                      data,
                      graphWidth,
                      graphHeight,
                      maxValue,
                      range,
                    )}
                    stroke="#ea580c"
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
                    const x1 =
                      ((index - 1) / (data.length - 1)) * (graphWidth - 48);
                    const y1 =
                      ((maxValue - prevPoint.relationshipValue) / range) *
                      graphHeight;
                    const x2 = (index / (data.length - 1)) * (graphWidth - 48);
                    const y2 =
                      ((maxValue - currentPoint.relationshipValue) / range) *
                      graphHeight;

                    // Determine if this is a straight upward trending segment
                    const isUpward =
                      currentPoint.relationshipValue >
                      prevPoint.relationshipValue;
                    const isFlat =
                      Math.abs(
                        currentPoint.relationshipValue -
                          prevPoint.relationshipValue,
                      ) < 0.01;

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
                    const y =
                      ((maxValue - point.relationshipValue) / range) *
                      graphHeight;

                    const isHighest = highest.some(
                      (h) => h.year === point.year,
                    );
                    const isLowest = lowest.some((l) => l.year === point.year);
                    const isSelected = selectedYearPoint?.year === point.year;
                    const pointColor = isHighest
                      ? "#22c55e"
                      : isLowest
                        ? "#ef4444"
                        : getHarmonyLevelColor(point.relationshipValue);
                    const pointRadius = isSelected
                      ? 6
                      : isHighest || isLowest
                        ? 4
                        : 2.5;

                    return (
                      <Circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={pointRadius}
                        fill={pointColor}
                        stroke={
                          isHighest || isLowest || isSelected
                            ? "#ffffff"
                            : "none"
                        }
                        strokeWidth={
                          isSelected ? 2 : isHighest || isLowest ? 1.5 : 0
                        }
                        onPress={() => {
                          setSelectedYearPoint({
                            year: point.year,
                            x: x,
                            y: y,
                          });
                        }}
                      />
                    );
                  })}
                </Svg>

                {/* Year labels positioned in empty areas with connecting lines */}
                {data.map((point, index) => {
                  const x = (index / (data.length - 1)) * (graphWidth - 48);
                  const y =
                    ((maxValue - point.relationshipValue) / range) *
                    graphHeight;

                  const isHighest = highest.some((h) => h.year === point.year);
                  const isLowest = lowest.some((l) => l.year === point.year);
                  const isSelected = selectedYearPoint?.year === point.year;

                  if (!(isHighest || isLowest || isSelected)) return null;

                  const labelColor = isSelected
                    ? "#6366f1"
                    : isHighest
                      ? "#22c55e"
                      : "#ef4444";
                  const labelText = isSelected
                    ? `${point.year} (${point.relationshipValue.toFixed(2)})`
                    : point.year.toString();

                  // Position labels at the very top or bottom edge of the graph frame
                  const isInUpperHalf = y < graphHeight / 2;
                  const labelX = Math.max(
                    10,
                    Math.min(x - 15, graphWidth - 78),
                  ); // Smaller label boxes
                  const labelY = isInUpperHalf
                    ? -verticalPadding + 5
                    : graphHeight + 5; // Position at edges

                  // Ensure label stays within bounds
                  const finalLabelY = labelY;

                  return (
                    <React.Fragment key={`label-${index}`}>
                      {/* Connecting line from data point to label */}
                      <Svg
                        width={graphWidth - 48}
                        height={graphHeight}
                        style={{ position: "absolute", pointerEvents: "none" }}
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
                          zIndex: isSelected ? 10 : 5,
                        }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: labelColor, fontSize: 10 }}
                        >
                          {labelText}
                        </Text>
                        {isSelected && (
                          <TouchableOpacity
                            className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full items-center justify-center"
                            onPress={() => setSelectedYearPoint(null)}
                          >
                            <Text
                              className="text-white font-bold"
                              style={{ fontSize: 8 }}
                            >
                              ×
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* X-axis labels */}
            <View
              className="ml-12 mt-2"
              style={{ width: graphWidth - 48, marginTop: verticalPadding }}
            >
              <View className="flex-row justify-between">
                {data
                  .filter(
                    (_, index) =>
                      index % Math.max(1, Math.floor(data.length / 10)) === 0,
                  )
                  .map((point, index) => (
                    <Text
                      key={index}
                      className="text-xs text-gray-600 transform -rotate-45"
                    >
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
            Legenda Tingkat Hubungan Internal
          </Text>
          <View className="flex-row justify-center items-center flex-wrap mb-3">
            <View className="flex-row items-center mr-4 mb-2">
              <View
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "#22c55e" }}
              />
              <Text className="text-xs text-gray-700">Tinggi (≥0.5)</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "#eab308" }}
              />
              <Text className="text-xs text-gray-700">Sedang (0-0.49)</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "#ef4444" }}
              />
              <Text className="text-xs text-gray-700">Rendah (&lt;0)</Text>
            </View>
          </View>

          <View className="border-t border-gray-300 pt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Penanda Khusus
            </Text>
            <View className="flex-row justify-center items-center flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <View
                  className="w-4 h-4 rounded-full mr-2 border-2 border-white"
                  style={{ backgroundColor: "#22c55e" }}
                />
                <Text className="text-xs text-gray-700">🔥 Tahun Terbaik</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-4 h-4 rounded-full mr-2 border-2 border-white"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <Text className="text-xs text-gray-700">
                  ⚠️ Tahun Menantang
                </Text>
              </View>
            </View>
          </View>

          <View className="border-t border-gray-300 pt-2 mt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Warna Garis Kurva
            </Text>
            <View className="flex-row justify-center items-center flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <View
                  className="w-4 h-1 mr-2"
                  style={{ backgroundColor: "#ea580c" }}
                />
                <Text className="text-xs text-gray-700">
                  🟠 Kurva Utama (Orange Tebal)
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-4 h-1 mr-2"
                  style={{ backgroundColor: "#1d4ed8" }}
                />
                <Text className="text-xs text-gray-700">
                  🔵 Segmen Naik (Biru Tebal)
                </Text>
              </View>
            </View>
          </View>

          <View className="border-t border-gray-300 pt-2 mt-2">
            <Text className="text-sm font-semibold mb-2 text-center">
              Interaksi Grafik
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Sentuh titik tahun mana saja pada grafik untuk melihat detail
              tahun dan nilai hubungan. Garis akan otomatis lurus untuk nilai
              yang sama dan melengkung untuk transisi yang berbeda.
            </Text>
          </View>

          <Text className="text-xs text-gray-600 text-center mt-2">
            Grafik menunjukkan hubungan internal antara parameter statis
            (expression, time, heart desire) dengan parameter dinamis (cycle,
            pinnacle, essence) ditambah skor PY-Essence setiap tahunnya. Kurva
            utama berwarna orange tebal, dengan segmen garis lurus yang naik
            ditampilkan dalam biru tebal. Label tahun ditempatkan di area kosong
            dengan garis penghubung putus-putus.
          </Text>
        </View>
      </View>
    );
  };

  // Use the generateLifeReport utility function to get all the data
  const {
    report: lifeReportDataGenerated,
    patterns,
    lifePath,
    nameWords,
  } = generateLifeReport(name, birthdate, gender);

  // Calculate static parameters
  const staticParams = {
    expression: calculateDestiny(name),
    time: patterns.time,
    heartDesire: patterns.angka_vokal,
    personality: patterns.angka_konsonan,
    birth: patterns.angka_ultah,
    ultimate: patterns.angka_takdir,
    habit: patterns.angka_sikap,
    planOfExpression: Math.max(
      patterns.physical,
      patterns.mental,
      patterns.emotion,
      patterns.intuition,
    ),
    pointOfIntensification: patterns.pointOfIntensification,
  };

  // Calculate relationship values for each year
  const calculateRelationshipValue = (yearData: any) => {
    const dynamicParams = [
      yearData.challenge,
      yearData.cycle,
      yearData.pinnacle,
      yearData.calYear,
      yearData.personalYear,
      yearData.essence,
    ];

    const staticParamValues = Object.values(staticParams);
    let totalRelationshipValue = 0;
    let relationshipCount = 0;

    // Calculate relationship values between each static and dynamic parameter
    staticParamValues.forEach((staticValue) => {
      dynamicParams.forEach((dynamicValue) => {
        const key = `${staticValue}-${dynamicValue}`;
        const relationshipValue = relationshipValueTable[key];
        if (relationshipValue !== undefined) {
          totalRelationshipValue += relationshipValue;
          relationshipCount++;
        }
      });
    });

    return relationshipCount > 0
      ? Math.round((totalRelationshipValue / relationshipCount) * 100) / 100
      : 0;
  };

  // Calculate relationship2 values using harmony table
  const calculateRelationship2Value = (yearData: any) => {
    const dynamicParams = [
      yearData.challenge,
      yearData.cycle,
      yearData.pinnacle,
      yearData.calYear,
      yearData.personalYear,
      yearData.essence,
    ];

    const staticParamValues = Object.values(staticParams);
    let totalHarmonyValue = 0;
    let harmonyCount = 0;

    // Calculate harmony values between each static and dynamic parameter
    staticParamValues.forEach((staticValue) => {
      dynamicParams.forEach((dynamicValue) => {
        const key1 = `${staticValue}-${dynamicValue}`;
        const key2 = `${dynamicValue}-${staticValue}`;
        const harmonyValue = harmonyTable[key1] || harmonyTable[key2];
        if (harmonyValue !== undefined) {
          totalHarmonyValue += harmonyValue;
          harmonyCount++;
        }
      });
    });

    return harmonyCount > 0
      ? Math.round((totalHarmonyValue / harmonyCount) * 100) / 100
      : 0;
  };

  // Add relationship values to life report data
  const enhancedLifeReportData = lifeReportDataGenerated.map((yearData) => {
    const internalScore = calculateInternalRelationshipScore(
      staticParams,
      yearData,
    );

    return {
      ...yearData,
      relationshipValue: calculateRelationshipValue(yearData),
      relationship2Value: calculateRelationship2Value(yearData),
      internalRelationshipScore: internalScore,
    };
  });

  // Generate year options (from birth year to 100 years in the future)
  const birthYear = birthdate.getFullYear();
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = birthYear; i <= currentYear + 100; i++) {
    yearOptions.push(i);
  }

  // Month options
  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  // Column descriptions based on numerology
  const columnDescriptions = {
    year: "Tahun kalender yang sedang dianalisis",
    age: "Usia Anda pada tahun tersebut",
    challenge:
      "Tantangan numerologi yang harus dihadapi - pelajaran hidup yang perlu dipelajari untuk pertumbuhan spiritual",
    cycle:
      "Siklus hidup 9 tahun yang menunjukkan tema dan energi dominan dalam periode tersebut",
    pinnacle:
      "Puncak pencapaian - periode dimana potensi tertinggi dapat direalisasikan berdasarkan getaran numerologi",
    calYear:
      "Getaran numerologi dari tahun kalender yang mempengaruhi energi global",
    personYear:
      "Tahun personal Anda - siklus pribadi yang menentukan tema dan peluang dalam hidup Anda",
    essence:
      "Esensi nama - getaran inti dari huruf-huruf nama yang aktif pada tahun tersebut",
    doubleEss:
      "Esensi ganda - kombinasi getaran yang memperkuat pengaruh spiritual dan energi nama",
    phrase:
      "Frasa nama - getaran dari setiap kata dalam nama yang memberikan nuansa khusus pada kepribadian",
    relationshipValue:
      "Nilai hubungan - analisis numerologi antara parameter statis (expression, time, heart desire, dll.) dengan parameter dinamis (challenge, cycle, pinnacle, dll.) pada tahun tersebut",
    relationship2Value:
      "Nilai hubungan 2 - analisis harmoni berdasarkan tabel harmoni CompatibilityChecker antara parameter statis dan dinamis pada tahun tersebut",
    internalRelationshipScore:
      "Skor Hubungan Internal - analisis hubungan internal individu yang membandingkan parameter statis (expression, time, heart desire) dengan parameter dinamis (cycle, pinnacle, essence) ditambah skor PY-Essence pada tahun tersebut",
  };

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  } | null>(null);

  const getCellInfo = (rowIndex: number, columnKey: string, value: any) => {
    const cellInfoMap: Record<string, string> = {
      year: `Tahun ${value}: Periode waktu yang sedang dianalisis dalam siklus hidup Anda.`,
      age: `Usia ${value}: Fase kehidupan yang membawa pengalaman dan pembelajaran khusus.`,
      challenge: `Tantangan ${value}: Pelajaran numerologi yang perlu dikuasai untuk pertumbuhan spiritual.`,
      cycle: `Siklus ${value}: Energi dominan dalam periode 9 tahun yang mempengaruhi tema hidup.`,
      pinnacle: `Puncak ${value}: Periode pencapaian maksimal berdasarkan getaran numerologi.`,
      calYear: `Tahun Kalender ${value}: Pengaruh energi global yang mempengaruhi semua orang.`,
      personYear: `Tahun Personal ${value}: Siklus pribadi yang menentukan tema dan peluang hidup Anda.`,
      essence: `Esensi ${value}: Getaran inti dari huruf nama yang aktif pada periode ini.`,
      doubleEss: `Esensi Ganda ${value}: Kombinasi getaran yang memperkuat pengaruh spiritual.`,
      phrase: `Frasa ${value}: Getaran dari kata dalam nama yang memberikan nuansa kepribadian.`,
      relationshipValue: `Nilai Hubungan ${value}: Rata-rata nilai hubungan antara parameter statis dan dinamis pada tahun ini. Nilai tinggi menunjukkan harmoni yang baik antara karakter dasar dan kondisi tahunan.`,
      relationship2Value: `Nilai Hubungan 2 ${value}: Rata-rata nilai harmoni berdasarkan tabel CompatibilityChecker antara parameter statis dan dinamis pada tahun ini. Menggunakan sistem penilaian harmoni yang berbeda.`,
      internalRelationshipScore: `Skor Hubungan Internal ${value}: Analisis hubungan internal yang menghitung rata-rata hubungan antara parameter statis (expression, time, heart desire) dengan parameter dinamis (cycle, pinnacle, essence) ditambah skor PY-Essence. Nilai ini menunjukkan seberapa harmonis dinamika internal individu pada tahun tersebut.`,
    };

    return (
      cellInfoMap[columnKey] ||
      `Informasi untuk ${columnKey}: ${value} - Detail akan diupdate secara manual.`
    );
  };

  const renderColumnHeader = (title: string, width: string, key: string) => {
    return (
      <TouchableOpacity
        key={key}
        className={`${width} p-2 border-r border-gray-300 bg-purple-100`}
        onPress={() => setShowTooltip(showTooltip === key ? null : key)}
      >
        <Text className="font-bold text-xs text-center text-purple-800">
          {title}
        </Text>
        <Text className="text-xs text-center text-purple-600 mt-1">ⓘ</Text>
        {showTooltip === key && (
          <View className="absolute top-full left-0 right-0 bg-green-100 border border-green-300 p-2 rounded shadow-lg z-10 mt-1">
            <Text className="text-xs text-gray-700 leading-4">
              {columnDescriptions[key as keyof typeof columnDescriptions]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTableHeader = () => {
    return (
      <View className="flex-row bg-purple-100 border-b border-gray-300">
        {renderColumnHeader("Year", "w-16", "year")}
        {renderColumnHeader("Age", "w-12", "age")}
        {renderColumnHeader("Challenge", "w-16", "challenge")}
        {renderColumnHeader("Cycle", "w-12", "cycle")}
        {renderColumnHeader("Pinnacle", "w-16", "pinnacle")}
        {renderColumnHeader("Cal Year", "w-16", "calYear")}
        {renderColumnHeader("Person Year", "w-16", "personYear")}
        {renderColumnHeader("Essence", "w-16", "essence")}
        {renderColumnHeader("Double Ess", "w-16", "doubleEss")}
        {nameWords.map((word, index) =>
          renderColumnHeader(`Phrase ${index + 1}`, "w-16", `phrase_${index}`),
        )}
        {renderColumnHeader("Relationship", "w-20", "relationshipValue")}
        {renderColumnHeader("Relationship2", "w-20", "relationship2Value")}
        {renderColumnHeader(
          "Hub. Internal",
          "w-20",
          "internalRelationshipScore",
        )}
      </View>
    );
  };

  const renderTableRow = (data: any, index: number) => {
    return (
      <View key={index} className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className="w-16 p-2 border-r border-gray-200"
          onPress={() => {
            const info = getCellInfo(index, "year", data.year);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.year}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 p-2 border-r border-gray-200"
          onPress={() => {
            const info = getCellInfo(index, "age", data.age);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.age}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-16 p-2 border-r border-gray-200"
          onPress={() => {
            const info = getCellInfo(index, "challenge", data.challenge);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.challenge}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-12 p-2 border-r border-gray-200 ${data.cycleCalYearDiff3 ? "bg-orange-200" : ""}`}
          onPress={() => {
            const info = getCellInfo(index, "cycle", data.cycle);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.cycle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-16 p-2 border-r border-gray-200"
          onPress={() => {
            const info = getCellInfo(index, "pinnacle", data.pinnacle);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.pinnacle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-16 p-2 border-r border-gray-200 ${data.cycleCalYearDiff3 ? "bg-orange-200" : ""}`}
          onPress={() => {
            const info = getCellInfo(index, "calYear", data.calYear);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.calYear}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-16 p-2 border-r border-gray-200 ${data.personalEssenceDiff3 ? "bg-red-200" : data.personalEssenceDiff0 ? "bg-yellow-200" : ""}`}
          onPress={() => {
            const info = getCellInfo(index, "personYear", data.personalYear);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.personalYear}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-16 p-2 border-r border-gray-200 ${data.personalEssenceDiff3 ? "bg-red-200" : data.personalEssenceDiff0 ? "bg-yellow-200" : ""}`}
          onPress={() => {
            const info = getCellInfo(index, "essence", data.essence);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.essence}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-16 p-2 border-r border-gray-200"
          onPress={() => {
            const info = getCellInfo(index, "doubleEss", data.doubleEss);
            alert(info);
          }}
        >
          <Text className="text-xs text-center">{data.doubleEss}</Text>
        </TouchableOpacity>
        {data.wordLetters &&
          data.wordLetters.map((letter: string, wordIndex: number) => (
            <TouchableOpacity
              key={wordIndex}
              className="w-16 p-2 border-r border-gray-200"
              onPress={() => {
                const info = getCellInfo(index, "phrase", letter);
                alert(info);
              }}
            >
              <Text className="text-xs text-center">{letter}</Text>
            </TouchableOpacity>
          ))}
        <TouchableOpacity
          className="w-20 p-2 border-r border-gray-200 bg-green-50"
          onPress={() => {
            const info = getCellInfo(
              index,
              "relationshipValue",
              data.relationshipValue,
            );
            alert(info);
          }}
        >
          <Text className="text-xs text-center font-semibold text-green-800">
            {data.relationshipValue}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-20 p-2 border-r border-gray-200 bg-blue-50"
          onPress={() => {
            const info = getCellInfo(
              index,
              "relationship2Value",
              data.relationship2Value,
            );
            alert(info);
          }}
        >
          <Text className="text-xs text-center font-semibold text-blue-800">
            {data.relationship2Value}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-20 p-2 border-r border-gray-200 bg-orange-50"
          onPress={() => {
            const info = getCellInfo(
              index,
              "internalRelationshipScore",
              data.internalRelationshipScore,
            );
            alert(info);
          }}
        >
          <Text className="text-xs text-center font-semibold text-orange-800">
            {data.internalRelationshipScore.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Calculate personal day number
  const calculatePersonalDay = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const personalYear = reduksiAngka(
      patterns.angka_ultah + patterns.angka_bulan + reduksiAngka(year),
    );
    const personalMonth = reduksiAngka(personalYear + month);
    const personalDay = reduksiAngka(personalMonth + day);

    return { personalDay, personalMonth, personalYear };
  };

  // Get daily advice based on personal day number
  const getDailyAdvice = (personalDay: number) => {
    const adviceMap: Record<number, string> = {
      1: "Today is perfect for new beginnings and taking initiative. Start that project you've been thinking about. Your leadership qualities shine today.",
      2: "Focus on cooperation and partnerships today. Be patient and diplomatic in your interactions. This is a day for teamwork and harmony.",
      3: "Express your creativity and communicate openly today. Social activities and artistic pursuits are favored. Share your ideas with others.",
      4: "Focus on practical matters and building solid foundations. Hard work and attention to detail will pay off. Organize and plan for the future.",
      5: "Embrace change and seek new experiences today. Travel, adventure, and freedom are highlighted. Be flexible and adaptable.",
      6: "Focus on family, home, and relationships today. Nurturing and caring for others brings fulfillment. Take responsibility for those you love.",
      7: "Take time for reflection and spiritual growth today. Meditation, study, and introspection are favored. Trust your inner wisdom.",
      8: "Focus on material success and achievement today. Business matters and financial decisions are highlighted. Use your organizational skills.",
      9: "Complete projects and let go of what no longer serves you. This is a day for endings and humanitarian efforts. Be generous and compassionate.",
      11: "Trust your intuition and spiritual insights today. This is a master day for inspiration and enlightenment. Share your vision with others.",
      22: "Focus on building something significant and lasting today. Your practical idealism can manifest great achievements. Think big but stay grounded.",
    };

    return (
      adviceMap[personalDay] ||
      "Focus on balance and harmony in all aspects of your life today."
    );
  };

  // Get monthly advice based on personal month number
  const getMonthlyAdvice = (personalMonth: number) => {
    const monthlyAdviceMap: Record<number, string> = {
      1: "This month is about new beginnings and fresh starts. Take initiative in your personal and professional life. Leadership opportunities may arise. Focus on independence and self-reliance.",
      2: "A month for cooperation and building relationships. Patience and diplomacy will serve you well. Focus on partnerships, teamwork, and emotional connections. Avoid rushing decisions.",
      3: "Express your creativity and communicate your ideas this month. Social activities and artistic pursuits are highly favored. Share your talents and connect with others through creative expression.",
      4: "Focus on building solid foundations and practical matters. Hard work, organization, and attention to detail will pay off. This is a month for planning and establishing security.",
      5: "Embrace change and seek new experiences this month. Travel, adventure, and freedom are highlighted. Be flexible and open to unexpected opportunities that come your way.",
      6: "A month focused on family, home, and nurturing relationships. Take responsibility for those you care about. Domestic matters and community involvement are emphasized.",
      7: "Take time for reflection, study, and spiritual growth this month. Meditation and introspection will bring valuable insights. Trust your inner wisdom and intuition.",
      8: "Focus on material success and business achievements this month. Financial matters and career advancement are highlighted. Use your organizational and leadership skills effectively.",
      9: "A month for completion and letting go of what no longer serves you. Humanitarian efforts and helping others will bring fulfillment. Focus on generosity and compassion.",
      11: "Trust your intuition and spiritual insights this month. This is a master month for inspiration and enlightenment. Share your vision and help others see new possibilities.",
      22: "Focus on building something significant and lasting this month. Your practical idealism can manifest great achievements. Think big but stay grounded in reality.",
    };

    return (
      monthlyAdviceMap[personalMonth] ||
      "Focus on balance and harmony in all aspects of your life this month."
    );
  };

  // Generate calendar days for selected month and year
  const generateCalendarDays = () => {
    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const { personalDay } = calculatePersonalDay(date);

      days.push({
        date,
        dateString: `${monthNames[selectedMonth]} ${day}, ${selectedYear}`,
        personalDay,
        advice: getDailyAdvice(personalDay),
        dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get days of week for calendar header
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get first day of month to calculate calendar grid
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  // Create calendar grid
  const createCalendarGrid = () => {
    const grid = [];
    const totalCells =
      Math.ceil((firstDayOfMonth + calendarDays.length) / 7) * 7;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }

    // Add days of the month
    calendarDays.forEach((day) => {
      grid.push(day);
    });

    // Add empty cells to complete the grid
    while (grid.length < totalCells) {
      grid.push(null);
    }

    return grid;
  };

  const calendarGrid = createCalendarGrid();

  // Function to get parameter descriptions linking to name analysis results
  const getParameterDescription = (
    parameterType: string,
    value: number | string,
  ) => {
    let description = "";
    let title = "";

    switch (parameterType) {
      case "expression":
        title = `Expression Number ${value}`;
        description = `Expression Number represents your life's purpose and the talents you were born to develop and use. It is calculated from all the letters in your full birth name and shows your natural abilities, skills, and the path you're meant to follow in life. This number reveals what you're here to accomplish and the unique gifts you bring to the world.`;
        break;
      case "time":
        title = `Time Number ${value}`;
        description = `Time Number (also known as Life Path Number) is one of the most important numbers in numerology. It represents your life's journey, the lessons you're here to learn, and the experiences you'll encounter. Calculated from your birth date, it shows your natural tendencies, challenges, and the overall theme of your lifetime.`;
        break;
      case "heartDesire":
        title = `Heart Desire Number ${value}`;
        description = `Heart Desire Number (also called Soul Urge Number) reveals your inner motivations, deepest desires, and what truly drives you from within. Calculated from the vowels in your name, it shows what your soul yearns for, your innermost wishes, and what brings you the greatest satisfaction and fulfillment in life.`;
        break;
      case "personality":
        title = `Personality Number ${value}`;
        description = `Personality Number represents your outer self and how others perceive you when they first meet you. Calculated from the consonants in your name, it shows the image you project to the world, your social mask, and the first impression you make on others. It's the face you show before people get to know the real you.`;
        break;
      case "birth":
        title = `Birth Number ${value}`;
        description = `Birth Number (Birth Day Number) is derived from the day of the month you were born. It represents your natural talents, abilities, and the special gifts you brought into this world. This number influences your personality traits and shows the inherent strengths and characteristics you possess from birth.`;
        break;
      case "ultimate":
        title = `Ultimate Number ${value}`;
        description = `Ultimate Number (also known as Destiny Number) represents the ultimate goal of your life, your highest potential, and what you're working toward achieving. It combines various aspects of your numerological profile to show the culmination of your life's work and the legacy you're meant to leave behind.`;
        break;
      case "habit":
        title = `Habitual Action Number ${value}`;
        description = `Habitual Action Number represents your natural behavioral patterns, instinctive reactions, and the way you typically approach situations in life. It shows your automatic responses, preferred methods of handling challenges, and the consistent patterns in your actions and decisions.`;
        break;
      case "planOfExpression":
        title = `Plan of Expression ${value}`;
        description = `Plan of Expression represents the highest value among your dimensional analysis (Physical, Mental, Emotional, and Intuitive planes). It shows your strongest plane of expression and indicates where you naturally excel and express yourself most powerfully. This number reveals your dominant mode of operation and the area where you have the greatest potential for manifestation and success.`;
        break;
      case "pointOfIntensification":
        title = `Point of Intensification ${value}`;
        description = `Point of Intensification represents the number that appears most frequently in your name's numerical analysis. This number shows where your energy is most concentrated and indicates areas of both strength and potential challenge. It reveals the qualities you have in abundance and may need to balance or channel constructively.`;
        break;
      default:
        title = `Parameter ${value}`;
        description =
          "Detailed description for this parameter will be available soon.";
    }

    return { title, description };
  };

  const showParameterDescription = (
    parameterType: string,
    value: number | string,
  ) => {
    const { title, description } = getParameterDescription(
      parameterType,
      value,
    );
    setSelectedParameterDetail(`${title}\n\n${description}`);
    setShowParameterDetail(true);
  };

  // Prepare chart data for internal relationship graph
  useEffect(() => {
    const chartDataForInternal = enhancedLifeReportData.map((item) => ({
      year: item.year,
      relationshipValue: item.internalRelationshipScore,
    }));
    setInternalChartData(chartDataForInternal);
  }, [enhancedLifeReportData]);

  return (
    <ScrollView className="bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center mb-6 text-purple-800">
          Life Report
        </Text>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">
            {patterns.namaNormal}
          </Text>
          <Text className="text-gray-600">{patterns.tglLahirFormat}</Text>
          <Text className="text-gray-600">Life Path: {lifePath}</Text>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity
            className="bg-purple-600 py-3 px-6 rounded-lg mb-3"
            onPress={() => setShowLifeReport(true)}
          >
            <Text className="text-white text-center font-semibold text-lg">
              100 Year Life Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 py-3 px-6 rounded-lg"
            onPress={() => setShowDailyAdvice(true)}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Daily Advice
            </Text>
          </TouchableOpacity>
        </View>

        {/* 100 Year Life Report Modal */}
        <Modal
          visible={showLifeReport}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-purple-800">
                100-Year Life Report
              </Text>
              <TouchableOpacity
                onPress={() => setShowLifeReport(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="font-semibold">Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <View className="p-4">
                <View className="mb-4">
                  <Text className="text-lg font-semibold mb-2">
                    {patterns.namaNormal}
                  </Text>
                  <Text className="text-gray-600">
                    {patterns.tglLahirFormat}
                  </Text>
                  <Text className="text-gray-600">Life Path: {lifePath}</Text>
                </View>

                {/* Static Parameters Table */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold mb-3 text-center text-purple-800">
                    Static Parameters
                  </Text>
                  <View className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <View className="flex-row flex-wrap">
                      <View className="w-1/3 mb-3 pr-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Expression
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "expression",
                              staticParams.expression,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.expression}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 px-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Time
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription("time", staticParams.time)
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.time}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 pl-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Heart Desire
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "heartDesire",
                              staticParams.heartDesire,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.heartDesire}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 pr-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Personality
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "personality",
                              staticParams.personality,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.personality}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 px-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Birth
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "birth",
                              staticParams.birth,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.birth}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 pl-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Ultimate
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "ultimate",
                              staticParams.ultimate,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.ultimate}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 pr-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          habitual action number
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "habit",
                              staticParams.habit,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.habit}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 px-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Plan of Expression
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "planOfExpression",
                              staticParams.planOfExpression,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.planOfExpression}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="w-1/3 mb-3 pl-2">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                          Point of Intensification
                        </Text>
                        <TouchableOpacity
                          className="bg-white p-2 rounded border"
                          onPress={() =>
                            showParameterDescription(
                              "pointOfIntensification",
                              staticParams.pointOfIntensification,
                            )
                          }
                        >
                          <Text className="text-lg font-bold text-center text-purple-800">
                            {staticParams.pointOfIntensification}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setShowTooltip(null)}
                  activeOpacity={1}
                >
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    className="border border-gray-300"
                  >
                    <View>
                      {renderTableHeader()}
                      {enhancedLifeReportData.map((data, index) =>
                        renderTableRow(data, index),
                      )}
                    </View>
                  </ScrollView>
                </TouchableOpacity>

                {/* Internal Relationship Graph */}
                <View className="mt-8">
                  <Text className="text-lg font-bold text-center mb-2 text-orange-800">
                    Grafik Hubungan Internal
                  </Text>
                  {renderLineGraph(internalChartData)}
                </View>

                <View className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <Text className="text-sm font-semibold mb-2">
                    Petunjuk Penggunaan:
                  </Text>
                  <View className="mb-3">
                    <Text className="text-xs font-medium mb-1">
                      Cara Membaca Tabel:
                    </Text>
                    <Text className="text-xs text-gray-600 mb-1">
                      • Ketuk judul kolom (ⓘ) untuk melihat penjelasan
                      numerologi
                    </Text>
                    <Text className="text-xs text-gray-600">
                      • Warna menunjukkan hubungan energi antar periode
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold mb-2">
                    Legend Warna:
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <View className="w-4 h-4 bg-orange-200 mr-2"></View>
                    <Text className="text-xs">
                      Orange: Siklus & Tahun Kalender memiliki perbedaan 3
                      (energi transformasi)
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <View className="w-4 h-4 bg-red-200 mr-2"></View>
                    <Text className="text-xs">
                      Merah: Tahun Personal & Esensi memiliki perbedaan 3
                      (periode tantangan)
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <View className="w-4 h-4 bg-yellow-200 mr-2"></View>
                    <Text className="text-xs">
                      Kuning: Tahun Personal & Esensi sama (periode harmoni)
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <View className="w-4 h-4 bg-green-50 border border-green-200 mr-2"></View>
                    <Text className="text-xs">
                      Hijau: Kolom Nilai Hubungan - menunjukkan rata-rata
                      hubungan parameter statis dengan dinamis
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 bg-orange-50 border border-orange-200 mr-2"></View>
                    <Text className="text-xs">
                      Orange: Kolom Hub. Internal - menunjukkan skor hubungan
                      internal individu (statis vs dinamis + PY-Essence)
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Daily Advice Modal */}
        <Modal
          visible={showDailyAdvice}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-blue-800">
                Daily Advice Calendar
              </Text>
              <TouchableOpacity
                onPress={() => setShowDailyAdvice(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="font-semibold">Close</Text>
              </TouchableOpacity>
            </View>

            {/* Date Selector */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold mb-4 text-center">
                Select Date
              </Text>

              {/* Year and Month Dropdowns */}
              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-xs font-medium mb-1">Year:</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <Picker
                      selectedValue={selectedYear}
                      onValueChange={(itemValue) => setSelectedYear(itemValue)}
                      style={{ height: 35 }}
                    >
                      {yearOptions.map((year) => (
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
                  <Text className="text-xs font-medium mb-1">Month:</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <Picker
                      selectedValue={selectedMonth}
                      onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                      style={{ height: 35 }}
                    >
                      {monthOptions.map((month) => (
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

              {/* Monthly Advice Button */}
              <TouchableOpacity
                className="bg-blue-100 p-2 rounded-lg mb-4 self-center"
                style={{ width: "50%" }}
                onPress={() => setShowMonthlyAdvice(!showMonthlyAdvice)}
              >
                <Text className="text-center text-sm font-semibold text-blue-800">
                  Monthly Advice Calendar
                </Text>
              </TouchableOpacity>

              {/* Monthly Advice Calendar Display */}
              {showMonthlyAdvice && (
                <View className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Text className="text-lg font-semibold mb-4 text-center text-blue-800">
                    Monthly Advice Calendar
                  </Text>

                  {/* Year and Month Dropdowns for Monthly Advice */}
                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1 mr-2">
                      <Text className="text-xs font-medium mb-1">Year:</Text>
                      <View className="border border-gray-300 rounded-lg">
                        <Picker
                          selectedValue={selectedYear}
                          onValueChange={(itemValue) =>
                            setSelectedYear(itemValue)
                          }
                          style={{ height: 35 }}
                        >
                          {yearOptions.map((year) => (
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
                      <Text className="text-xs font-medium mb-1">Month:</Text>
                      <View className="border border-gray-300 rounded-lg">
                        <Picker
                          selectedValue={selectedMonth}
                          onValueChange={(itemValue) =>
                            setSelectedMonth(itemValue)
                          }
                          style={{ height: 35 }}
                        >
                          {monthOptions.map((month) => (
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

                  {/* Monthly Advice Content */}
                  <View className="bg-white p-4 rounded-lg">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-lg font-semibold text-blue-800">
                        {monthOptions[selectedMonth].label} {selectedYear}
                      </Text>
                      <View className="bg-blue-600 px-3 py-1 rounded-full">
                        <Text className="text-white font-bold text-sm">
                          Personal Month:{" "}
                          {(() => {
                            const testDate = new Date(
                              selectedYear,
                              selectedMonth,
                              15,
                            );
                            const { personalMonth } =
                              calculatePersonalDay(testDate);
                            return personalMonth;
                          })()}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-700 leading-5">
                      {(() => {
                        const testDate = new Date(
                          selectedYear,
                          selectedMonth,
                          15,
                        );
                        const { personalMonth } =
                          calculatePersonalDay(testDate);
                        return getMonthlyAdvice(personalMonth);
                      })()}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Personal Day Advice Section */}
            {selectedDate && (
              <View className="p-4 bg-blue-50 border-b border-gray-200">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-semibold text-blue-800">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <View className="bg-blue-600 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold">
                      Personal Day:{" "}
                      {calculatePersonalDay(selectedDate).personalDay}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-700 leading-5">
                  {getDailyAdvice(
                    calculatePersonalDay(selectedDate).personalDay,
                  )}
                </Text>
              </View>
            )}

            {/* Calendar Grid */}
            <ScrollView className="flex-1 p-4">
              <Text className="text-lg font-semibold mb-4 text-center">
                Daily Advice Calendar - {monthOptions[selectedMonth].label}{" "}
                {selectedYear}
              </Text>

              {/* Calendar Header */}
              <View className="flex-row mb-2">
                {daysOfWeek.map((day) => (
                  <View key={day} className="flex-1 p-2 bg-blue-600">
                    <Text className="text-white text-center font-semibold text-xs">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="border border-gray-300">
                {Array.from(
                  { length: Math.ceil(calendarGrid.length / 7) },
                  (_, weekIndex) => (
                    <View key={weekIndex} className="flex-row">
                      {calendarGrid
                        .slice(weekIndex * 7, (weekIndex + 1) * 7)
                        .map((dayData, dayIndex) => (
                          <TouchableOpacity
                            key={`${weekIndex}-${dayIndex}`}
                            className={`flex-1 border border-gray-200 min-h-[80px] p-1 ${
                              dayData ? "bg-white" : "bg-gray-50"
                            }`}
                            disabled={!dayData}
                            onPress={() => {
                              if (dayData) {
                                setSelectedDate(dayData.date);
                              }
                            }}
                          >
                            {dayData && (
                              <View className="flex-1">
                                <View className="flex-row justify-between items-start mb-1">
                                  <Text className="text-sm font-semibold">
                                    {dayData.date.getDate()}
                                  </Text>
                                  <View className="bg-blue-500 px-1 py-0.5 rounded">
                                    <Text className="text-white text-xs font-bold">
                                      {dayData.personalDay}
                                    </Text>
                                  </View>
                                </View>
                                <Text
                                  className="text-xs text-gray-600 leading-3"
                                  numberOfLines={3}
                                >
                                  {dayData.advice.substring(0, 50)}...
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                    </View>
                  ),
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Parameter Detail Modal */}
        <Modal
          visible={showParameterDetail}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-purple-800">
                Parameter Detail
              </Text>
              <TouchableOpacity
                onPress={() => setShowParameterDetail(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="font-semibold">Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              <Text className="text-base leading-6 text-gray-800">
                {selectedParameterDetail}
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
