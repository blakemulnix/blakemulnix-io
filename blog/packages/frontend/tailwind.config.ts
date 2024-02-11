import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const customColors = {
  stone800: '#292524',
  sstOrange: '#E27152'
};

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
    nextui({
      layout: {},
      themes: {
        light: {},
        dark: {
          colors: {
            background: customColors.stone800,
            primary: customColors.sstOrange
          },
        },
      },
    }),
  ],
}

export default config
