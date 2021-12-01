import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
// use windicss is more stead?
import { presetUno, presetAttributify } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  plugins: [
    Unocss({
      presets: [
        presetAttributify({
        /* preset options */
        }),
        presetUno(),
        presetIcons({
        /* options */
        }),
      ],
    }),
  ],

  optimizeDeps: {
    include: ['dayjs'],
  },
})
