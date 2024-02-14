import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const customColors = {
  stone500: '#78716C',
  stone800: '#292524',
  sstOrange: '#E27152',
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui(),
  ],
}

export default config

// themes: {
//   light: {},
//   dark: {
//     colors: {
//       default: {
//         50: '#ECEBE9',
//         100: '#D9D6D3',
//         200: '#B3ADA7',
//         300: '#90877E',
//         400: '#655E57',
//         500: '#3A3632',
//         600: '#2F2B28',
//         700: '#24211F',
//         800: '#161413',
//         900: '#0B0A09',
//       },
//       foreground: {
//         50: '#ECEBE9',
//         100: '#D9D6D3',
//         200: '#B3ADA7',
//         300: '#90877E',
//         400: '#655E57',
//         500: '#3A3632',
//         600: '#2F2B28',
//         700: '#24211F',
//         800: '#161413',
//         900: '#0B0A09',
//       },
//       background: {
//         50: '#ECEBE9',
//         100: '#D9D6D3',
//         200: '#B3ADA7',
//         300: '#90877E',
//         400: '#655E57',
//         500: '#3A3632',
//         600: '#2F2B28',
//         700: '#24211F',
//         800: '#161413',
//         900: '#0B0A09',
//       },
//       primary: customColors.sstOrange,
//     },
//   },