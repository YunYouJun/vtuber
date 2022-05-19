export function checkModelFormat(file: File) {
  if (!file.name.endsWith('.vrm'))
    return false
  return true
}
