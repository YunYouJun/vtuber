/**
 * 嘴型
 */
export enum Mouth {
  /**
   * 生气
   */
  Angry = 17,
  /**
   * 疑惑
   */
  Haze = 16,
  /**
   * 惊讶
   */
  Amazed = 14,
  /**
   * 小
   */
  Small = 11,
  /**
   * 半
   */
  Half = 12,
  /**
   * Big
   */
  Big = 13,
  /**
   * 大笑
   */
  Laugh = 9,
}

/**
 * 根据张开百分比 设置嘴形
 * mouth: 9 -> 13 -> 14 -> 12 -> 16 -> 17 -> 11
 * 生气：17
 * 疑惑：16
 * 惊讶：14
 * 小开：11
 * 半开：12
 * 大开：13
 * 大笑：9
 * @param mouth
 */
export function getMouthIndex(mouth: number) {
  let mouthIndex = 0;
  if (mouth > 0.4) {
    mouthIndex = Mouth.Laugh;
  } else if (mouth > 0.3) {
    mouthIndex = Mouth.Big;
  } else if (mouth > 0.2) {
    mouthIndex = Mouth.Half;
  } else if (mouth > 0.1) {
    mouthIndex = Mouth.Small;
  }
  return mouthIndex;
}
