/**
 * Tokens do VetEnsino: layout inspirado na Alura sobre a paleta PurpleVet.
 * O tema escuro é o padrão; o claro é alternado via atributo `data-theme` no html.
 */

export const palette = {
  brand: {
    primary: '#8854C0',
    dark: '#6B3FA0',
    light: '#A97FD9',
    subtle: 'rgba(136, 84, 192, 0.12)',
  },
  state: {
    success: '#3FB950',
    warning: '#D29922',
    danger: '#F85149',
    info: '#58A6FF',
  },
} as const;

export const darkTheme = {
  bg: {
    base: '#0F0D14',
    surface: '#1A1721',
    elevated: '#241F2E',
  },
  border: {
    subtle: '#2E2839',
    strong: '#413951',
  },
  text: {
    primary: '#F5F3F7',
    secondary: '#B8B2C4',
    muted: '#7C7589',
    onBrand: '#FFFFFF',
  },
} as const;

export const lightTheme = {
  bg: {
    base: '#FAF9FC',
    surface: '#FFFFFF',
    elevated: '#F3F0F8',
  },
  border: {
    subtle: '#E4E0EC',
    strong: '#CFC8DC',
  },
  text: {
    primary: '#1A1721',
    secondary: '#4A4459',
    muted: '#7C7589',
    onBrand: '#FFFFFF',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
} as const;

export const density = {
  pageGap: '16px',
  sectionGap: '12px',
  panelPadding: '16px',
  controlHeight: '34px',
  controlPadding: '6px 10px',
  tableHeaderPadding: '8px 12px',
  tableCellPadding: '10px 12px',
} as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '999px',
} as const;

export const typography = {
  fontFamily:
    "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  size: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '28px',
    xxl: '40px',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const mediaUp = (key: keyof typeof breakpoints): string =>
  `@media (min-width: ${breakpoints[key]}px)`;
