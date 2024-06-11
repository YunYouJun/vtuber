/**
 * 获取脚本，并执行回调函数
 * @param url
 * @param callback
 */
export function getScript(url: string, callback: Function) {
  const script = document.createElement('script')
  script.onload = () => {
    setTimeout(callback)
  }
  script.src = url
  document.head.appendChild(script)
}

/**
 * 文本形式下载 JSON 对象
 * @param json
 * @param filename
 */
export function downloadObjectAsJson(json: object, filename: string) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', `${filename}.json`)
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
