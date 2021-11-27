import { ElMain, ElHeader, ElContainer } from 'element-plus'
import { UserModule } from '~/types'

const components = [ElMain, ElHeader, ElContainer]

export const install: UserModule = ({ app }) => {
  components.forEach((component) => {
    app.use(component)
  })
}
