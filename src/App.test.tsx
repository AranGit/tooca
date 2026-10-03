import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useSessionStore } from './store/session'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
})

describe('App', () => {
  it('moves focus to the destination heading when the phase changes', async () => {
    render(<App />)

    await act(async () => {
      await Promise.resolve()
    })

    act(() => {
      useSessionStore.setState({
        phase: 'sort',
        thoughts: [{ id: 'first', text: 'Job interview tomorrow.', category: null }],
        history: [],
      })
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "What's in your hands right now?" })).toHaveFocus()
    })

    act(() => {
      useSessionStore.setState({
        phase: 'reflection',
        thoughts: [{ id: 'first', text: 'Job interview tomorrow.', category: 'in-my-hands' }],
        history: [{ thoughtId: 'first', previousCategory: null, nextCategory: 'in-my-hands' }],
      })
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'All sorted, for now.' })).toHaveFocus()
    })
  })
})
