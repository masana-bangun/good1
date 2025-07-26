import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = useCallback((error: Error) => {
    console.error("App Error:", error);
    setHasError(true);

    // Check if it's a network-related error
    if (
      error.message.includes("body") ||
      error.message.includes("network") ||
      error.message.includes("fetch") ||
      error.message.includes("Ngrok")
    ) {
      setErrorMessage(
        "Network connectivity issue detected. Please check your internet connection and try again.",
      );
    } else {
      setErrorMessage("An unexpected error occurred. Please restart the app.");
    }
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
    setErrorMessage("");
  }, []);

  // Global error handler
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorString = args.join(" ");
      if (
        errorString.includes(
          "TypeError: Cannot read properties of undefined (reading 'body')",
        ) ||
        errorString.includes("network") ||
        errorString.includes("Ngrok")
      ) {
        handleError(new Error(errorString));
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, [handleError]);

  if (hasError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
            color: "#dc2626",
          }}
        >
          Oops! Something went wrong
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginBottom: 20,
            textAlign: "center",
            color: "#666",
            lineHeight: 20,
          }}
        >
          {errorMessage}
        </Text>
        <TouchableOpacity
          onPress={resetError}
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      try {
        const { TempoDevtools } = require("tempo-devtools");
        TempoDevtools.init();
      } catch (error) {
        console.warn("Failed to initialize Tempo Devtools:", error);
        // Don't crash the app if devtools fail to initialize
      }
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Failed to hide splash screen:", error);
        // Continue anyway
      }
    }
  }, [loaded]);

  // Handle network errors during font loading
  useEffect(() => {
    const handleNetworkError = () => {
      setInitError(
        "Network connection issue. Please check your internet connection.",
      );
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: any) => {
      if (
        event.reason &&
        (event.reason.message?.includes("body") ||
          event.reason.message?.includes("network") ||
          event.reason.message?.includes("fetch"))
      ) {
        handleNetworkError();
      }
    };

    if (Platform.OS === "web") {
      window.addEventListener("unhandledrejection", handleUnhandledRejection);
      return () => {
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection,
        );
      };
    }
  }, []);

  if (initError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
            color: "#dc2626",
          }}
        >
          Connection Error
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginBottom: 20,
            textAlign: "center",
            color: "#666",
            lineHeight: 20,
          }}
        >
          {initError}
        </Text>
        <TouchableOpacity
          onPress={() => setInitError(null)}
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={({ route }) => ({
            headerShown: !route.name.startsWith("tempobook"),
          })}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
