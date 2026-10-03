export type MobileMascotState = 'neutral' | 'hands' | 'rest'

export function getMobileMascotState(offsetX: number): MobileMascotState {
  if (offsetX > 12) return 'hands'
  if (offsetX < -12) return 'rest'
  return 'neutral'
}
