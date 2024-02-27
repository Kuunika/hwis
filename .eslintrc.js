module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  "rules": {
    "react-hooks/exhaustive-deps": 0
    },
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
