import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/store/session'
import { ReflectionScreen } from './ReflectionScreen'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
  useSessionStore.setState({
    phase: 'reflection',
    thoughts: [
      { id: 'first', text: 'Job interview tomorrow.', category: 'in-my-hands' },
      { id: 'second', text: "What if they don't like me?", category: 'rest-it-here' },
      { id: 'third', text: 'I might miss a deadline.', category: 'rest-it-here' },
    ],
    history: [
      { thoughtId: 'first', previousCategory: null, nextCategory: 'in-my-hands' },
      { thoughtId: 'second', previousCategory: null, nextCategory: 'rest-it-here' },
      { thoughtId: 'third', previousCategory: null, nextCategory: 'rest-it-here' },
    ],
  })
})

describe('ReflectionScreen', () => {
  it('shows category counts and lets each section open independently', async () => {
    const user = userEvent.setup()
    render(<ReflectionScreen />)

    const hands = screen.getByRole('button', { name: 'In My Hands, 1 card' })
    const rest = screen.getByRole('button', { name: 'Rest It Here, 2 cards' })
    expect(hands).toHaveAttribute('aria-expanded', 'true')
    expect(rest).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Job interview tomorrow.')).toBeVisible()

    await user.click(rest)
    expect(rest).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText("What if they don't like me?")).toBeVisible()
    expect(screen.getByText('I might miss a deadline.')).toBeVisible()
    expect(hands).toHaveAttribute('aria-expanded', 'true')
  })

  it('returns the last decision to sorting without losing earlier choices', async () => {
    const user = userEvent.setup()
    render(<ReflectionScreen />)

    await user.click(screen.getByRole('button', { name: 'Bring it back' }))

    const state = useSessionStore.getState()
    expect(state.phase).toBe('sort')
    expect(state.thoughts.map((thought) => thought.category)).toEqual([
      'in-my-hands', 'rest-it-here', null,
    ])
    expect(state.history).toHaveLength(2)
  })

  it('starts a new session when asked', async () => {
    const user = userEvent.setup()
    render(<ReflectionScreen />)

    await user.click(screen.getByRole('button', { name: 'Clear & Begin again' }))

    const state = useSessionStore.getState()
    expect(state.phase).toBe('setup')
    expect(state.thoughts).toEqual([])
    expect(state.history).toEqual([])
  })
})
