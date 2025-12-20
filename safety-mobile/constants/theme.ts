export const palette = {
  dark: {
    background: '#0B0C10',
    card: '#11141B',
    surface: '#151924',
    subtle: '#1E2431',
    primary: '#7AE2FF',
    secondary: '#9F7AEA',
    accent: '#F3C969',
    muted: '#B2B8C5',
    text: '#F8FBFF',
    success: '#7CE7B9',
    danger: '#FF7B95',
  },
  light: {
    background: '#F7F8FA',
    card: '#FFFFFF',
    surface: '#F1F3F7',
    subtle: '#E7EAF1',
    primary: '#0F60FF',
    secondary: '#8B5CF6',
    accent: '#FF9F1C',
    muted: '#5A6270',
    text: '#0F172A',
    success: '#34D399',
    danger: '#EF4444',
  },
} as const

export type ThemeMode = 'dark' | 'light'
