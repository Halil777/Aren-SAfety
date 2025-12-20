export type Period = "ALL" | "OPEN" | "CLOSED";
export type FilterOption = { value: string; label: string };

export type HomeTexts = {
  headerTitle: string;
  headerSubtitle: string;
  searchPlaceholder: string;
  empty: string;
  languageLabel: string;
  languagePlaceholder: string;
  filtersTitle: string;
  periodLabel: string;
  periodAll: string;
  periodClosed: string;
  periodOpen: string;
  riskLabel: string;
  deptLabel: string;
  deptPlaceholder: string;
  catLabel: string;
  catPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  reset: string;
  apply: string;
  clear: string;
  unknownWorker: string;
  unknownCategory: string;
  unknownSupervisor: string;
  riskLevels: readonly string[];
  status: {
    new: string;
    inProgress: string;
    fixed: string;
    rejected: string;
    closed: string;
    unknown: string;
  };
};

export type ThemeTokens = {
  isDark: boolean;
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  chipBg: string;
  pillBg: string;
  iconTint: string;
  placeholder: string;
  headerAccent: string;
  primary: string;
};
