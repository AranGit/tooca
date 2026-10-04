import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/store/session'
import { SetupScreen } from './SetupScreen'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
})

describe('SetupScreen', () => {
  it('adds a trimmed card with Enter and keeps the field ready for another', async () => {
    const user = userEvent.setup()
    render(<SetupScreen />)
    const input = screen.getByRole('textbox', { name: 'Things on your mind' })

    expect(screen.getByRole('button', { name: 'Add another' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Let's sort these 0 things/ })).toBeDisabled()

    await user.type(input, "  Tomorrow's meeting  {Enter}")

    expect(within(screen.getByRole('list', { name: 'Things on your mind' })).getByText("Tomorrow's meeting")).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
    expect(screen.getByRole('button', { name: /Let's sort these 1 thing/ })).toBeEnabled()
  })

  it('limits a concern to 150 characters and shows the remaining count', async () => {
    const user = userEvent.setup()
    render(<SetupScreen />)
    const input = screen.getByRole('textbox', { name: 'Things on your mind' })

    await user.type(input, 'a'.repeat(151))

    expect(input).toHaveValue('a'.repeat(150))
    expect(screen.getByText('150 / 150 characters')).toBeVisible()
  })

  it('keeps user cards, appends unique examples, removes a chosen card, and continues', async () => {
    const user = userEvent.setup()
    render(<SetupScreen />)
    const input = screen.getByRole('textbox', { name: 'Things on your mind' })

    await user.type(input, 'My own concern')
    await user.click(screen.getByRole('button', { name: 'Add another' }))
    await user.click(screen.getByRole('button', { name: 'Try with examples' }))
    await user.click(screen.getByRole('button', { name: 'Try with examples' }))

    const cards = useSessionStore.getState().thoughts
    expect(cards).toHaveLength(3)
    expect(cards[0].text).toBe('My own concern')
    expect(new Set(cards.map((card) => card.text)).size).toBe(3)

    await user.click(screen.getByRole('button', { name: 'Remove: My own concern' }))
    expect(useSessionStore.getState().thoughts).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: /Let's sort these 2 things/ }))
    expect(useSessionStore.getState().phase).toBe('sort')
    expect(JSON.parse(sessionStorage.getItem('tooca-session') ?? '{}').state.phase).toBe('sort')
  })
})
