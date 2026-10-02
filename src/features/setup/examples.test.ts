import { describe, expect, it } from 'vitest'
import { pickExamples, WORRY_EXAMPLES } from './examples'

describe('pickExamples', () => {
  it('draws distinct concerns and skips ones already on cards', () => {
    const first = pickExamples([], 2, () => 0)
    const second = pickExamples(first, 2, () => 0)

    expect(first).toHaveLength(2)
    expect(second).toHaveLength(2)
    expect(new Set([...first, ...second]).size).toBe(4)
    expect([...first, ...second].every((text) => WORRY_EXAMPLES.includes(text as typeof WORRY_EXAMPLES[number]))).toBe(true)
  })

  it('returns only remaining examples when the pool is nearly exhausted', () => {
    expect(pickExamples(WORRY_EXAMPLES.slice(0, -1), 2)).toEqual([WORRY_EXAMPLES.at(-1)])
    expect(pickExamples(WORRY_EXAMPLES, 2)).toEqual([])
  })
})
