import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/store/session'
import { SortScreen } from './SortScreen'
import { getMobileMascotState } from './mobileMascot'

beforeEach(() => {
  useSessionStore.getState().resetSession()
  sessionStorage.clear()
})

describe('SortScreen', () => {
  it('sorts cards one at a time and records both decisions', async () => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [
        { id: 'first', text: 'Job interview tomorrow.', category: null },
        { id: 'second', text: "What if they don't like me?", category: null },
      ],
      history: [],
    })
    const user = userEvent.setup()
    render(<SortScreen />)

    expect(screen.getByRole('group', { name: 'Card 1 of 2' })).toHaveTextContent('Job interview tomorrow.')
    await user.click(screen.getByRole('button', { name: 'Rest It Here' }))

    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'Card 2 of 2' })).toHaveTextContent("What if they don't like me?")
    })
    await waitFor(() => expect(screen.getByRole('button', { name: 'In My Hands' })).toBeEnabled(), { timeout: 2_000 })
    await user.click(screen.getByRole('button', { name: 'In My Hands' }))

    await waitFor(() => {
      expect(useSessionStore.getState().phase).toBe('reflection')
    }, { timeout: 2_000 })
    expect(useSessionStore.getState().thoughts.map((thought) => thought.category)).toEqual([
      'rest-it-here', 'in-my-hands',
    ])
    expect(useSessionStore.getState().history.map((decision) => decision.thoughtId)).toEqual([
      'first', 'second',
    ])
  })
  it('undoes decisions in reverse order and hides undo when history is empty', async () => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [
        { id: 'first', text: 'First worry', category: 'in-my-hands' },
        { id: 'second', text: 'Second worry', category: 'rest-it-here' },
        { id: 'third', text: 'Third worry', category: null },
      ],
      history: [
        { thoughtId: 'first', previousCategory: null, nextCategory: 'in-my-hands' },
        { thoughtId: 'second', previousCategory: null, nextCategory: 'rest-it-here' },
      ],
    })
    const user = userEvent.setup()
    render(<SortScreen />)
    await user.click(screen.getByRole('button', { name: 'Bring it back' }))
    expect(screen.getByRole('group', { name: 'Card 2 of 3' })).toHaveTextContent('Second worry')
    await user.click(screen.getByRole('button', { name: 'Bring it back' }))
    expect(screen.getByRole('group', { name: 'Card 1 of 3' })).toHaveTextContent('First worry')
    expect(screen.queryByRole('button', { name: 'Bring it back' })).not.toBeInTheDocument()
    expect(useSessionStore.getState().thoughts.every((thought) => thought.category === null)).toBe(true)
  })

  it('records one decision when a category button is clicked repeatedly', async () => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [
        { id: 'first', text: 'First worry', category: null },
        { id: 'second', text: 'Second worry', category: null },
      ],
      history: [],
    })
    const user = userEvent.setup()
    render(<SortScreen />)
    await user.dblClick(screen.getByRole('button', { name: 'In My Hands' }))
    await waitFor(() => expect(screen.getByRole('group', { name: 'Card 2 of 2' })).toBeVisible())
    expect(useSessionStore.getState().history).toHaveLength(1)
  })

  it('keeps the drag card out of the tab order', () => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [{ id: 'first', text: 'First worry', category: null }],
      history: [],
    })
    render(<SortScreen />)

    expect(screen.getByRole('group', { name: 'Card 1 of 1' })).not.toHaveAttribute('tabindex')
  })

  it('uses the compact card type for a 120-character concern', () => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [{ id: 'first', text: 'a'.repeat(120), category: null }],
      history: [],
    })
    render(<SortScreen />)

    expect(screen.getByRole('group', { name: 'Card 1 of 1' })).toHaveClass('sort-deck__card--compact')
  })

  it.each([
    ['In My Hands', 'mooca-happy'],
    ['Rest It Here', 'mooca-hugging'],
  ])('changes the mobile mascot when %s is chosen', async (buttonName, mascotAsset) => {
    useSessionStore.setState({
      phase: 'sort',
      thoughts: [
        { id: 'first', text: 'First worry', category: null },
        { id: 'second', text: 'Second worry', category: null },
      ],
      history: [],
    })
    const user = userEvent.setup()
    const { container } = render(<SortScreen />)
    const mascot = container.querySelector<HTMLImageElement>('.sort-screen__mobile-mascot img')

    expect(mascot).toHaveAttribute('src', expect.stringContaining('mooca-using-phone'))
    await user.click(screen.getByRole('button', { name: buttonName }))
    expect(container.querySelector(`.sort-screen__mobile-mascot img[src*="${mascotAsset}"]`)).toBeInTheDocument()

    await waitFor(() => expect(screen.getByRole('group', { name: 'Card 2 of 2' })).toBeVisible())
    expect(container.querySelector(`.sort-screen__mobile-mascot img[src*="${mascotAsset}"]`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: buttonName })).toBeDisabled()
    expect(screen.getByText('Second worry')).toHaveClass('sort-deck__card-text--waiting')
    await waitFor(() => expect(screen.getByRole('button', { name: buttonName })).toBeEnabled(), { timeout: 2_000 })
    expect(container.querySelector('.sort-screen__mobile-mascot img[src*="mooca-using-phone"]')).toBeInTheDocument()
    expect(screen.getByText('Second worry')).not.toHaveClass('sort-deck__card-text--waiting')
  })

  it('selects the mobile mascot from drag direction with a neutral dead zone', () => {
    expect(getMobileMascotState(-13)).toBe('rest')
    expect(getMobileMascotState(-12)).toBe('neutral')
    expect(getMobileMascotState(0)).toBe('neutral')
    expect(getMobileMascotState(12)).toBe('neutral')
    expect(getMobileMascotState(13)).toBe('hands')
  })

})
