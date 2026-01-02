import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { I18nextProvider } from "react-i18next";
import global from "./translations/global.json";

i18next.use(I18nextBrowserLanguageDetector).init({
  resources: {
    en: { translation: global.en },
    de: { translation: global.de },
  },
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
