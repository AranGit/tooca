import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useIsPresent } from 'motion/react'
import { useLayoutEffect, useState } from 'react'

export type Phase = 'setup' | 'sort' | 'reflection'
export type Category = 'in-my-hands' | 'rest-it-here'

export interface Thought {
  id: string
  text: string
  category: Category | null
}

export interface SortDecision {
  thoughtId: string
  previousCategory: Category | null
  nextCategory: Category
}

export interface SessionState {
  phase: Phase
  thoughts: Thought[]
  history: SortDecision[]
  addThought: (text: string) => void
  addThoughts: (texts: string[]) => void
  removeThought: (id: string) => void
  startSorting: () => void
  returnToSetup: () => void
  categorizeThought: (id: string, category: Category) => void
  undoLastDecision: () => void
  restartSorting: () => void
  resetSession: () => void
}

const initialData = {
  phase: 'setup' as Phase,
  thoughts: [] as Thought[],
  history: [] as SortDecision[],
}

function makeThought(text: string): Thought {
  return { id: crypto.randomUUID(), text: text.trim(), category: null }
}

function validThought(value: unknown): value is Thought {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Thought>
  return (
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    item.text.trim().length > 0 &&
    (item.category === null ||
      item.category === 'in-my-hands' ||
      item.category === 'rest-it-here')
  )
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      ...initialData,
      addThought: (text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        set((state) => ({ thoughts: [...state.thoughts, makeThought(trimmed)] }))
      },
      addThoughts: (texts) => {
        const additions = texts.map((text) => text.trim()).filter(Boolean)
        if (additions.length === 0) return
        set((state) => ({
          thoughts: [...state.thoughts, ...additions.map(makeThought)],
        }))
      },
      removeThought: (id) =>
        set((state) => ({
          thoughts: state.thoughts.filter((thought) => thought.id !== id),
          history: state.history.filter((decision) => decision.thoughtId !== id),
        })),
      startSorting: () => {
        const thoughts = get().thoughts
        if (thoughts.length === 0) return
        set({ phase: thoughts.some((thought) => thought.category === null) ? 'sort' : 'reflection' })
      },
      returnToSetup: () => set({ phase: 'setup' }),
      categorizeThought: (id, category) =>
        set((state) => {
          const thought = state.thoughts.find((item) => item.id === id)
          if (state.phase !== 'sort' || !thought || thought.category !== null) return state
          const thoughts = state.thoughts.map((item) =>
            item.id === id ? { ...item, category } : item,
          )
          return {
            thoughts,
            history: [
              ...state.history,
              { thoughtId: id, previousCategory: null, nextCategory: category },
            ],
            phase: thoughts.every((item) => item.category !== null) ? 'reflection' : 'sort',
          }
        }),
      undoLastDecision: () =>
        set((state) => {
          const previous = state.history.at(-1)
          if (!previous) return state
          return {
            phase: 'sort',
            thoughts: state.thoughts.map((item) =>
              item.id === previous.thoughtId
                ? { ...item, category: previous.previousCategory }
                : item,
            ),
            history: state.history.slice(0, -1),
          }
        }),
      restartSorting: () =>
        set((state) => ({
          phase: state.thoughts.length > 0 ? 'sort' : 'setup',
          thoughts: state.thoughts.map((item) => ({ ...item, category: null })),
          history: [],
        })),
      resetSession: () => set(initialData),
    }),
    {
      name: 'tooca-session',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ phase, thoughts, history }) => ({ phase, thoughts, history }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<SessionState> | undefined
        const thoughts = Array.isArray(saved?.thoughts)
          ? saved.thoughts.filter(validThought)
          : []
        const ids = new Set(thoughts.map((thought) => thought.id))
        const history = Array.isArray(saved?.history)
          ? saved.history.filter(
              (item): item is SortDecision =>
                !!item &&
                typeof item.thoughtId === 'string' &&
                ids.has(item.thoughtId) &&
                (item.nextCategory === 'in-my-hands' ||
                  item.nextCategory === 'rest-it-here') &&
                (item.previousCategory === null ||
                  item.previousCategory === 'in-my-hands' ||
                  item.previousCategory === 'rest-it-here'),
            )
          : []
        const requestedPhase =
          saved?.phase === 'sort' || saved?.phase === 'reflection'
            ? saved.phase
            : 'setup'
        const phase =
          thoughts.length === 0
            ? 'setup'
            : requestedPhase === 'reflection' &&
                thoughts.some((thought) => thought.category === null)
              ? 'sort'
              : requestedPhase === 'sort' &&
                  thoughts.every((thought) => thought.category !== null)
                ? 'reflection'
              : requestedPhase
        return { ...current, thoughts, history, phase }
      },
    },
  ),
)

export function useFrozenSessionValue<T>(selector: (state: SessionState) => T): T {
  const value = useSessionStore(selector)
  const isPresent = useIsPresent()
  const [frozenValue, setFrozenValue] = useState(value)

  useLayoutEffect(() => {
    // oxlint-disable-next-line -- retain the last committed session value while this screen exits.
    if (isPresent) setFrozenValue(value)
  }, [isPresent, value])

  return isPresent ? value : frozenValue
}
