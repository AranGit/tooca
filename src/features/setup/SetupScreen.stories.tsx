import { useLayoutEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import App from '@/App'
import { useSessionStore } from '@/store/session'

interface ScenarioProps {
  items: string[]
}

function SetupScenario({ items }: ScenarioProps) {
  useLayoutEffect(() => {
    useSessionStore.setState({
      phase: 'setup',
      thoughts: items.map((text, index) => ({
        id: `story-${index}`,
        text,
        category: null,
      })),
      history: [],
    })
  }, [items])

  return <App />
}

const meta = {
  title: 'Flow/Step 1 · Add cards',
  component: SetupScenario,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SetupScenario>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { items: [] } }

export const TwoCards: Story = {
  args: {
    items: ['Job interview tomorrow.', 'What if they don’t like me?'],
  },
}

export const TenCards: Story = {
  args: {
    items: [
      'Job interview tomorrow.',
      'What if they don’t like me?',
      'They still haven’t replied to my message.',
      'What if things don’t go as planned?',
      'Saying ‘no’ to extra tasks today.',
      'Preparing for the next meeting.',
      'I might have disappointed my friend.',
      'There is so much to finish this week.',
      'I’m nervous about speaking up.',
      'Will I make the right decision?',
    ],
  },
}

export const LongText: Story = {
  args: {
    items: ['I am worried that there may not be enough time to finish everything I promised before tomorrow’s meeting.'],
  },
}
