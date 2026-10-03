import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, waitFor } from 'storybook/test'
import App from '@/App'
import { useSessionStore } from '@/store/session'
import type { Thought } from '@/store/session'

const meta = {
  title: 'Flow/Step 2 · Sort cards',
  render: () => <App />,
  beforeEach: () => () => { fireEvent.pointerUp(window, { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }) },
  loaders: [({ args }) => {
    useSessionStore.setState({ phase: 'sort', thoughts: args.thoughts, history: args.thoughts.flatMap((thought) => thought.category ? [{ thoughtId: thought.id, previousCategory: null, nextCategory: thought.category }] : []) })
    return {}
  }],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<{ thoughts: Thought[] }>

export default meta
type Story = StoryObj<typeof meta>

export const FirstCard: Story = {
  args: {
    thoughts: [
      { id: 'first', text: 'Job interview tomorrow.', category: null },
      { id: 'second', text: 'What if they don’t like me?', category: null },
    ],
  },
}

export const InProgress: Story = {
  args: {
    thoughts: [
      { id: 'first', text: 'Job interview tomorrow.', category: 'in-my-hands' },
      { id: 'second', text: 'What if they don’t like me?', category: null },
      { id: 'third', text: 'I might miss a deadline.', category: null },
    ],
  },
}

export const LastCard: Story = {
  args: {
    thoughts: [
      { id: 'first', text: 'Job interview tomorrow.', category: 'in-my-hands' },
      { id: 'last', text: 'What if they don’t like me?', category: null },
    ],
  },
}

export const LongText: Story = {
  args: {
    thoughts: [
      { id: 'long', text: 'I am worried that I will not have enough time to finish everything I promised before tomorrow’s meeting.', category: null },
    ],
  },
}

async function holdDrag(canvasElement: HTMLElement, direction: number) {
  const card = canvasElement.querySelector('.sort-deck__card')!
  const rect = card.getBoundingClientRect()
  const start = { clientX: rect.x + rect.width / 2, clientY: rect.y + rect.height / 2 }
  const pointer = { ...start, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 }
  fireEvent.pointerDown(card, pointer)
  await new Promise(requestAnimationFrame)
  fireEvent.pointerMove(window, { ...pointer, clientX: start.clientX + direction * 10 })
  await new Promise(requestAnimationFrame)
  fireEvent.pointerMove(window, { ...pointer, clientX: start.clientX + direction * 150 })
  await waitFor(() => expect(getComputedStyle(card).color).toBe(direction > 0 ? 'rgb(0, 191, 179)' : 'rgb(245, 117, 117)'))
}

export const DragRight: Story = {
  args: FirstCard.args,
  play: async ({ canvasElement }) => holdDrag(canvasElement, 1),
}

export const DragLeft: Story = {
  args: FirstCard.args,
  play: async ({ canvasElement }) => holdDrag(canvasElement, -1),
}
