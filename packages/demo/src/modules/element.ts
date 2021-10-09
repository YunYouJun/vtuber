import { ElMain, ElHeader, ElMenu, ElContainer } from 'element-plus'
import 'element-plus/dist/index.css'
import { UserModule } from '~/types'

const components = [ElMain, ElHeader, ElMenu, ElContainer]

export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    components.forEach((component) => {
      app.use(component)
    })
  }
}
