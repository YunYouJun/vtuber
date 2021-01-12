import { PositionPoint } from "./types/index";

interface KeyPoints {
  eyeCenter: PositionPoint;
  noseCenter: PositionPoint;
  jawCenter: PositionPoint;
}

/**
 * 获取水平旋转量
 * @param keyPoints 关键点
 */
export function getHorizontalRotation(keyPoints: KeyPoints) {}
