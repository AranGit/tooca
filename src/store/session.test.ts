import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from './session'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
})

describe('sorting session', () => {
  it('keeps decisions when returning to setup and sorts newly added cards next', () => {
    useSessionStore.setState({
      phase: 'setup',
      thoughts: [{ id: 'first', text: 'Job interview tomorrow.', category: null }],
      history: [],
    })

    useSessionStore.getState().startSorting()
    useSessionStore.getState().categorizeThought('first', 'in-my-hands')
    expect(useSessionStore.getState().phase).toBe('reflection')

    useSessionStore.getState().returnToSetup()
    useSessionStore.getState().addThought('A new worry')
    useSessionStore.getState().startSorting()

    const state = useSessionStore.getState()
    expect(state.phase).toBe('sort')
    expect(state.thoughts.map((thought) => thought.category)).toEqual(['in-my-hands', null])
    expect(state.history).toHaveLength(1)
  })

  it('returns to reflection when every card is already categorized', () => {
    useSessionStore.setState({
      phase: 'setup',
      thoughts: [{ id: 'first', text: 'Job interview tomorrow.', category: 'rest-it-here' }],
      history: [],
    })

    useSessionStore.getState().startSorting()
    expect(useSessionStore.getState().phase).toBe('reflection')
  })
})
