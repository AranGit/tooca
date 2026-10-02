import type { Meta, StoryObj } from '@storybook/react-vite'
import App from '@/App'
import { useSessionStore } from '@/store/session'
import type { Thought } from '@/store/session'

const meta = {
  title: 'Flow/Step 2 · Sort cards',
  render: () => <App />,
  loaders: [({ args }) => {
    useSessionStore.setState({ phase: 'sort', thoughts: args.thoughts, history: [] })
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
