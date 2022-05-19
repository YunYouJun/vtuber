import { ElContainer, ElHeader, ElMain, ElProgress } from 'element-plus'
import type { UserModule } from '~/types'

const components = [ElMain, ElHeader, ElContainer, ElProgress]

export const install: UserModule = ({ app }) => {
  components.forEach((component) => {
    app.use(component)
  })
}
