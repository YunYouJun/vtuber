import { ElMain, ElHeader, ElContainer, ElProgress } from 'element-plus'
import { UserModule } from '~/types'

const components = [ElMain, ElHeader, ElContainer, ElProgress]

export const install: UserModule = ({ app }) => {
  components.forEach((component) => {
    app.use(component)
  })
}
