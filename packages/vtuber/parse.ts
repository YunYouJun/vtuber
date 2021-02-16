import { FaceMap } from "./face";

/**
 * 解析后的检测结果
 */
export interface DetectResult {
  /**
   * 嘴巴张开百分比
   */
  mouth: number;
}

/**
 * 生成解析后的结果
 */
export function generateResult(): DetectResult | undefined {
  if (!window.face) return;
  const points = window.face.points;

  const width = points[FaceMap.mouth.upperLip.left]
    .sub(points[FaceMap.mouth.upperLip.right])
    .magnitude();

  /**
   * 张开的高度
   */
  const height = points[FaceMap.mouth.upperLip.bottom[1]]
    .sub(points[FaceMap.mouth.lowerLip.top[1]])
    .magnitude();

  const percent = height / width;

  // debug
  console.log(width, height, percent);

  return {
    mouth: percent,
  };
}
