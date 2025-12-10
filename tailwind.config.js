const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./components/**/*.{vue,tsx}', './layouts/**/*.{vue,tsx}', './src/pages/**/*.{vue,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--dx-primary-color)',
        mred: 'var(--dx-red-color)',
        mgray: 'var(--dx-gray-color)',
        myellow: 'var(--dx-yellow-color)',
        morange: 'var(--dx-orange-color)',
        mgreen: 'var(--dx-green-color)',
        title: 'var(--dx-title-color)',
        base1: 'var(--dx-base1-color)',
        base2: 'var(--dx-base2-color)',
        base3: 'var(--dx-base3-color)',
        base4: 'var(--dx-base4-color)',
        base5: 'var(--dx-base5-color)',
        base6: 'var(--dx-base6-color)',
        base7: 'var(--dx-base7-color)',
        base8: 'var(--dx-base8-color)',
        base9: 'var(--dx-base9-color)',
        base10: 'var(--dx-base10-color)'
      },
      spacing: {
        1.5: '0.32rem'
      },
      fontSize: {
        tiny: '0.26rem',
        mini: '0.3rem',
        sm: '0.32rem',
        base: '0.35rem',
        normal: '0.38rem',
        default: '0.4rem',
        xl: '0.42rem',
        '2xl': '0.48rem',
        '3xl': '0.54rem',
        '4xl': '0.61rem',
        '5xl': '0.66rem',
        '6xl': '0.8rem'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.flex-col-center': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.mcenter': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: ' translate(-50%, -50%)'
        },

        '.fit-content': {
          width: 'fit-content'
        },

        '.translate-50': {
          transform: ' translate(-50%, -50%)'
        }
      })
    }),
    require('@tailwindcss/aspect-ratio')
  ]
}
