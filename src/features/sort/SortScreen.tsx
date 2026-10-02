import { motion, useReducedMotion } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import moocaHappy from '@/assets/mascot/mooca-happy.svg'
import moocaHugging from '@/assets/mascot/mooca-hugging.svg'
import moocaUsingPhone from '@/assets/mascot/mooca-using-phone.svg'
import { useSessionStore } from '@/store/session'
import type { Category } from '@/store/session'
import './sort.css'

export function SortScreen() {
  const thoughts = useSessionStore((state) => state.thoughts)
  const categorizeThought = useSessionStore((state) => state.categorizeThought)
  const reduceMotion = useReducedMotion()
  const [exitDirection, setExitDirection] = useState<Category | null>(null)
  const exitingId = useRef<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const current = thoughts.find((thought) => thought.category === null)
  const remaining = thoughts.filter((thought) => thought.category === null).length

  function choose(category: Category) {
    if (!current || exitingId.current) return
    if (reduceMotion) {
      categorizeThought(current.id, category)
      return
    }
    exitingId.current = current.id
    setExitDirection(category)
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const threshold = Math.max(80, Math.min((cardRef.current?.offsetWidth ?? 400) * 0.25, 120))
    const distance = Math.abs(info.offset.x)
    if (distance >= threshold || (distance >= 40 && Math.abs(info.velocity.x) >= 600)) {
      choose(info.offset.x < 0 ? 'rest-it-here' : 'in-my-hands')
    }
  }

  function finishExit() {
    if (!current || !exitDirection || exitingId.current !== current.id) return
    categorizeThought(current.id, exitDirection)
    exitingId.current = null
    setExitDirection(null)
  }

  if (!current) return null

  return (
    <section className="sort-screen" aria-labelledby="sort-title">
      <div className="sort-screen__intro">
        <h1 id="sort-title">What’s in your hands right now?</h1>
        <p>There are no wrong answers. Just take it one card at a time.</p>
      </div>

      <div className="sort-screen__scene">
        <div className="sort-screen__mascot sort-screen__mascot--left" aria-hidden="true">
          <img src={moocaHugging} alt="" />
        </div>

        <div className="sort-screen__center">
          <img className="sort-screen__mobile-mascot" src={moocaUsingPhone} alt="" aria-hidden="true" />
          <div className="sort-deck" aria-label={`${remaining} ${remaining === 1 ? 'card' : 'cards'} left to sort`}>
            {remaining > 1 && <div className="sort-deck__underlay" aria-hidden="true" />}
            <motion.div
              ref={cardRef}
              key={current.id}
              className="sort-deck__card"
              role="group"
              aria-label={`Card ${thoughts.length - remaining + 1} of ${thoughts.length}`}
              aria-live="polite"
              drag={exitDirection ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              dragMomentum={false}
              dragSnapToOrigin
              onDragEnd={handleDragEnd}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
              animate={exitDirection ? {
                x: exitDirection === 'rest-it-here' ? -900 : 900,
                rotate: exitDirection === 'rest-it-here' ? -10 : 10,
                opacity: 0,
              } : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: exitDirection ? 0.25 : 0.2 }}
              onAnimationComplete={finishExit}
            >
              <span>{current.text}</span>
            </motion.div>
          </div>
        </div>

        <div className="sort-screen__mascot sort-screen__mascot--right" aria-hidden="true">
          <img src={moocaHappy} alt="" />
        </div>
      </div>

      <div className="sort-screen__actions">
        <p>Swipe the card or tap the buttons below.</p>
        <div className="sort-screen__buttons">
          <button type="button" className="sort-screen__button sort-screen__button--rest" onClick={() => choose('rest-it-here')} disabled={!!exitDirection}>
            <ArrowLeft size={21} strokeWidth={1.8} aria-hidden="true" />
            Rest It Here
          </button>
          <button type="button" className="sort-screen__button sort-screen__button--hands" onClick={() => choose('in-my-hands')} disabled={!!exitDirection}>
            In My Hands
            <ArrowRight size={21} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
