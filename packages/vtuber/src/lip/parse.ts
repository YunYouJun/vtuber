export interface LipData {
  mouthCues: {
    start: number
    end: number
    value: string
  }[]
}

/**
 * https://github.com/DanielSWolf/rhubarb-lip-sync#command-line-options
 * https://github.com/DanielSWolf/rhubarb-lip-sync#mouth-shapes
 */
export function getBlendShapeGroupByValue(value: string) {
  const shape = {
    A: 0,
    I: 0,
    O: 0,
    U: 0,
    E: 0,
  }
  switch (value) {
    case 'A':
      break
    case 'B':
      shape.A = 0.2
      shape.I = 0.2
      break
    case 'C':
      shape.A = 0.8
      shape.E = 0.1
      shape.U = 0.3
      break
    case 'D':
      shape.A = 1
      break
    case 'E':
      shape.A = 0.5
      shape.O = 0.5
      break
    case 'F':
      shape.U = 0.4
      shape.O = 0.4
      break
    case 'G':
      shape.A = 0.2
      shape.I = 0.1
      break
    case 'H':
      shape.I = 0.5
      shape.O = 0.3
      break
    case 'X':
      break
    default:
      break
  }
  return shape
}

export interface LipShapeTrack {
  A: number[]
  I: number[]
  E: number[]
  O: number[]
  U: number[]
}

export interface ParsedLipTracksData {
  times: number[]
  tracks: LipShapeTrack
}

/**
 * parse data from lip-sync
 * @param data
 * @returns
 */
export function parseLipData(data: LipData) {
  const tracks: LipShapeTrack = {
    A: [0],
    I: [0],
    E: [0],
    O: [0],
    U: [0],
  }
  const times = [0]

  data.mouthCues.forEach((item) => {
    times.push(item.end)

    const shape = getBlendShapeGroupByValue(item.value)
    tracks.A.push(shape.A)
    tracks.E.push(shape.E)
    tracks.I.push(shape.I)
    tracks.O.push(shape.O)
    tracks.U.push(shape.U)
  })

  const parsedData = {
    tracks,
    times,
  }
  return parsedData
}
