import { isClient } from '@vueuse/core'

export const fullscreen = useFullscreen(isClient ? document.body : null)
