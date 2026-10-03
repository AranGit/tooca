import type { Meta, StoryObj } from '@storybook/react-vite'
import App from '@/App'
import { useSessionStore } from '@/store/session'
import type { SortDecision, Thought } from '@/store/session'

const meta = {
  title: 'Flow/Step 3 · Reflection',
  render: () => <App />,
  loaders: [({ args }) => {
    useSessionStore.setState({ phase: 'reflection', thoughts: args.thoughts, history: args.history })
    return {}
  }],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<{ thoughts: Thought[]; history: SortDecision[] }>

export default meta
type Story = StoryObj<typeof meta>

const thoughts: Thought[] = [
  { id: 'interview', text: 'Job interview tomorrow.', category: 'in-my-hands' },
  { id: 'opinion', text: "What if they don't like me?", category: 'rest-it-here' },
  { id: 'deadline', text: 'I might miss a deadline.', category: 'rest-it-here' },
]

const history: SortDecision[] = thoughts.map((thought) => ({
  thoughtId: thought.id,
  previousCategory: null,
  nextCategory: thought.category!,
}))

export const Balanced: Story = {
  args: { thoughts, history },
}

export const EmptyCategory: Story = {
  args: {
    thoughts: thoughts.map((thought) => ({ ...thought, category: 'in-my-hands' })),
    history: thoughts.map((thought) => ({ thoughtId: thought.id, previousCategory: null, nextCategory: 'in-my-hands' })),
  },
}

export const LongText: Story = {
  args: {
    thoughts: [
      { id: 'long', text: "I am worried that I will not have enough time to finish everything I promised before tomorrow's meeting.", category: 'in-my-hands' },
      ...thoughts,
    ],
    history: [
      { thoughtId: 'long', previousCategory: null, nextCategory: 'in-my-hands' },
      ...history,
    ],
  },
}
