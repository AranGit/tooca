import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import toocaLogo from '@/assets/brand/tooca-logo.svg'
import moocaWelcome from '@/assets/mascot/mooca-welcome.png'
import { Button } from '@/components/Button/Button'

const foundations = [
  { label: 'Color tokens', value: '60+' },
  { label: 'Type styles', value: '17' },
  { label: 'Elevation levels', value: '08' },
]

function App() {
  const [started, setStarted] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50 px-5 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-circle bg-primary-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 size-96 rounded-circle bg-accent-blue-100 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col rounded-lg bg-gray-0 p-6 shadow-elevation-04 sm:p-10 lg:p-14">
        <nav className="flex items-center justify-between" aria-label="Primary navigation">
          <a href="#top" aria-label="Tooca home">
            <img src={toocaLogo} width="93" height="32" alt="Tooca" />
          </a>
          <span className="rounded-circle bg-primary-50 px-4 py-2 text-body-4 text-gray-turquoise-300">Design system ready</span>
        </nav>

        <section id="top" className="my-auto grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-subheader-1 text-gray-turquoise-300">React + TypeScript starter</p>
            <h1 className="mt-4 max-w-2xl text-h1 text-gray-900 sm:text-[52px] sm:leading-[58px]">A calm foundation for thoughtful products.</h1>
            <p className="mt-6 max-w-xl text-body-1 text-gray-700 sm:text-title-3">Gotham Rounded, Tooca design tokens, Tailwind CSS, Motion, Vitest, and Storybook are wired together and ready to build on.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setStarted(true)}>{started ? 'Ready to build ✓' : 'Start building'}</Button>
              <Button variant="secondary" onClick={() => window.open('http://localhost:6006', '_blank')}>Open Storybook</Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.5 }}
            className="grid gap-4"
          >
            <div className="flex min-h-72 items-center justify-center rounded-lg bg-primary-50 p-5">
              <img
                className="max-h-72 w-auto drop-shadow-[0_16px_24px_rgb(0_196_179_/_16%)]"
                src={moocaWelcome}
                width="1254"
                height="1254"
                alt="Mooca mascot waving with a sunny friend"
              />
            </div>
            {foundations.map((item, index) => (
              <motion.article
                key={item.label}
                whileHover={reduceMotion ? undefined : { x: 6 }}
                className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-6"
              >
                <span className="text-body-2 text-gray-700">{item.label}</span>
                <span className={`text-h3 ${index === 1 ? 'text-accent-blue-700' : 'text-gray-turquoise-300'}`}>{item.value}</span>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5 text-body-5 text-gray-600">
          <span>Tooca UI foundation</span>
          <span>Accessible motion · Local fonts · Shared tokens</span>
        </footer>
      </div>
    </main>
  )
}

export default App
