import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useSessionStore } from './store/session'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
})

describe('App', () => {
  it('shows the splash once and records it in the current tab session', () => {
    render(<App />)

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
    expect(sessionStorage.getItem('tooca-splash-seen')).toBe('true')
  })

  it('does not show the splash again when the current tab has seen it', () => {
    sessionStorage.setItem('tooca-splash-seen', 'true')

    render(<App />)

    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
  })

  it('does not focus the setup heading on the initial load', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: "What's on your mind right now?" })).not.toHaveFocus()
  })

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

    act(() => {
      useSessionStore.setState({ phase: 'setup' })
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "What's on your mind right now?" })).toHaveFocus()
    })
  })
})
