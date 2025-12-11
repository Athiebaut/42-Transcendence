import {
  getCurrentLanguage,
  getSupportedLanguages,
  setLanguage,
  t,
  type LanguageCode,
} from "../../i18n";

let initialized = false;

export function mountLanguageSwitcher() {
  if (initialized) return;
  initialized = true;

  const container = document.createElement("div");
  container.id = "language-switcher";
  container.className =
    "fixed left-4 bottom-24 z-[100000] flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 shadow-lg backdrop-blur";
  container.style.bottom = "5rem";

  const label = document.createElement("span");
  label.textContent = t("language.label");
  label.className = "hidden sm:inline text-slate-300";
  container.appendChild(label);

  const select = document.createElement("select");
  select.className =
    "bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer";

  getSupportedLanguages().forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    select.appendChild(option);
  });

  select.value = getCurrentLanguage();
  select.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    setLanguage(target.value as LanguageCode);
  });

  container.appendChild(select);
  document.body.appendChild(container);

  window.addEventListener("languagechange", () => {
    select.value = getCurrentLanguage();
    label.textContent = t("language.label");
  });
}
