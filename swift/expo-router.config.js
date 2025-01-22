module.exports = {
    projectRoot: "./",
    plugins: [
      // Ensure linking is set up correctly
      "@expo/router",
    ],
    deepLinking: {
      prefixes: ["swift://", "https://api.swift-traders.co.ke"],
    },
  };
  