const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle dynamic files properly
config.resolver.blockList = [
  // Block problematic dynamic files with double extensions
  /.*\.tsx\.tsx$/,
  /.*\.ts\.ts$/,
  // Block other potential problematic patterns
  /app\/tempobook\/dynamic\/.*\.tsx\.tsx$/,
];

// Ensure proper file extensions are resolved
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "tsx",
  "ts",
  "jsx",
  "js",
];

// Configure server settings for CORS and allowed hosts
config.server = {
  ...config.server,
  port: 8081,
  host: "0.0.0.0",
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Set CORS headers for all requests
      const origin = req.headers.origin;
      const allowedOrigins = [
        "https://app.tempo.new",
        "https://tempo.new",
        "https://recursing-varahamihira7-whus8.view-3.tempo-dev.app",
        "http://localhost:3000",
        "http://localhost:8081",
        "https://tempo-dev.app",
        "https://view-3.tempo-dev.app",
      ];

      if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }

      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, HEAD",
      );
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Handle preflight requests
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      return middleware(req, res, next);
    };
  },
};

// Disable CORS middleware entirely and allow all hosts
config.server.cors = false;
config.server.allowedHosts = "all";

// Override resolver to allow all hosts
config.resolver.platforms = ["ios", "android", "native", "web"];
config.resolver.allowedHosts = "*";

module.exports = withNativeWind(config, { input: "./global.css" });
