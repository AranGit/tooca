import type { Meta, StoryObj } from '@storybook/react-vite'

const colorGroups = {
  Primary: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  Gray: ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
}

function Foundations() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="mx-auto max-w-5xl space-y-12">
        <header>
          <p className="text-subheader-1 text-gray-turquoise-300">Tooca foundations</p>
          <h1 className="mt-2 text-h1">Design tokens</h1>
        </header>

        <section className="space-y-6">
          <h2 className="text-h3">Colors</h2>
          {Object.entries(colorGroups).map(([group, steps]) => (
            <div key={group}>
              <h3 className="mb-3 text-title-3">{group}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
                {steps.map((step) => {
                  const name = group.toLowerCase()
                  return (
                    <div key={step}>
                      <div
                        className="aspect-square rounded-sm border border-gray-200"
                        style={{ backgroundColor: `var(--color-${name}-${step})` }}
                      />
                      <p className="mt-2 text-body-5">{step}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-6 text-h3">Typography</h2>
          <div className="space-y-5 rounded-lg bg-gray-0 p-6 shadow-elevation-01">
            <p className="text-h1">H1 / Gotham Rounded</p>
            <p className="text-h2">H2 / Gotham Rounded</p>
            <p className="text-h3">H3 / Gotham Rounded</p>
            <p className="text-title-1">Title 1 / Gotham Rounded</p>
            <p className="text-body-1">Body 1 / Gotham Rounded</p>
            <p className="text-body-3">Body 3 / Gotham Rounded</p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-h3">Radius & elevation</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['01', '02', '03', '04', '05', '06', '07', '08'].map((level, index) => (
              <div
                key={level}
                className="flex h-36 items-end bg-gray-0 p-5 text-title-3"
                style={{
                  borderRadius: index % 2 === 0 ? 'var(--radius-sm)' : 'var(--radius-lg)',
                  boxShadow: `var(--shadow-elevation-${level})`,
                }}
              >
                Elevation {level}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

const meta = {
  title: 'Foundations/Overview',
  component: Foundations,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Foundations>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {}
