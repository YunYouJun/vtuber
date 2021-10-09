import { ElMain, ElHeader, ElMenu, ElContainer } from 'element-plus'
import 'element-plus/dist/index.css'
import { UserModule } from '~/types'

const components = [ElMain, ElHeader, ElContainer, ElMenu]

export const install: UserModule = ({ app }) => {
  components.forEach((component) => {
    app.use(component)
  })
}
