export const WORRY_EXAMPLES = [
  'Job interview tomorrow.',
  "What if they don't like me?",
  "They still haven't replied to my message.",
  "What if things don't go as planned?",
  "Saying 'no' to extra tasks today.",
  'Preparing for the next meeting.',
  'I might have disappointed my friend.',
  'There is so much to finish this week.',
  "I'm nervous about speaking up.",
  'Will I make the right decision?',
  'I keep comparing myself to others.',
  'My presentation is coming up.',
  "I'm worried about my family.",
  'What if I make a mistake at work?',
  'I need to have a difficult conversation.',
  'I have been putting off an important call.',
  'I feel behind on my goals.',
  "I'm waiting to hear back about my application.",
  'What if I cannot keep up?',
  'I need to ask for help.',
  'I am unsure where to start.',
  'I might miss a deadline.',
  "I'm worried about money this month.",
  'I wish I had said that differently.',
  'My plans for the weekend might change.',
  'I have not had enough time to rest.',
  'What will they think of my idea?',
  'I need to make time for myself.',
  "I am anxious about a doctor's appointment.",
  'There are too many things on my mind.',
] as const

export function pickExamples(
  existingTexts: readonly string[],
  count = 2,
  random: () => number = Math.random,
): string[] {
  const used = new Set(existingTexts.map((text) => text.trim().toLocaleLowerCase()))
  const available = WORRY_EXAMPLES.filter(
    (text) => !used.has(text.toLocaleLowerCase()),
  )

  for (let index = available.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[available[index], available[swapIndex]] = [available[swapIndex], available[index]]
  }

  return available.slice(0, count)
}
