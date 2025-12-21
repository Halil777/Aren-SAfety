module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for file-based routing in expo-router
      "expo-router/babel",
      // Needed so Reanimated can compile worklets correctly in release builds
      "react-native-reanimated/plugin",
    ],
  };
};
