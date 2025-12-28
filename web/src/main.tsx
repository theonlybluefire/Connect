import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import global from "./translations/global.json";

i18next.init({
  resources: {
    en: { global: (global as any).en },
    de: { global: (global as any).de },
  },
  fallbackLng: "en",
  lng: "en",
  ns: ["global"],
  defaultNS: "global",
  interpolation: { escapeValue: false },
  detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
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
