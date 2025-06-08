function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
    52: "C++ (g++ 7.2.0)",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TypeScript: 74,
    "C++ (G++ 7.2.0)": 52,
    "C++": 52,
  };
  return languageMap[language.toUpperCase()];
}
