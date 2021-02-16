/**
 * 获取脚本，并执行回调函数
 * @param url
 * @param callback
 */
export function getScript(url: string, callback: Function) {
  const script = document.createElement("script");
  script.onload = () => {
    setTimeout(callback);
  };
  script.src = url;
  document.head.appendChild(script);
}

/**
 * 是否为开发模式
 */
export function isDev() {
  return import.meta.env.MODE === "development";
}
