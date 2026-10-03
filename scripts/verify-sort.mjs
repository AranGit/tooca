import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const output = process.env.TOOCA_QA_OUTPUT ?? 'qa/step2-full'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const thoughts = [
  { id: 'first', text: 'Job interview tomorrow.', category: null },
  { id: 'second', text: "What if they don't like me?", category: null },
]
const errors = []
async function open(width, height, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion })
  page.setDefaultTimeout(5000)
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(thoughts => {
    if (!sessionStorage.getItem('tooca-session')) sessionStorage.setItem('tooca-session', JSON.stringify({
      state: { phase: 'sort', thoughts, history: [] }, version: 1,
    }))
  }, thoughts)
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('group', { name: 'Card 1 of 2' }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  assert.equal(await page.locator('vite-error-overlay').count(), 0)
  return page
}
async function drag(page, offset) {
  const card = page.locator('.sort-deck__card')
  const rect = await card.boundingBox()
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.mouse.move(center.x + offset, center.y, { steps: 15 })
  await page.waitForTimeout(180)
  return card.evaluate(element => ({ color: getComputedStyle(element).color, transform: getComputedStyle(element).transform }))
}
async function history(page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('tooca-session')).state.history)
}
try {
  const page = await open(1440, 1024)
  await page.screenshot({ path: `${output}/01-idle.png` })
  assert.equal(await page.getByRole('button', { name: 'Bring it back' }).count(), 0)
  const right = await drag(page, 135)
  assert.equal(right.color, await page.locator('.sort-screen__button--hands').evaluate(el => getComputedStyle(el).backgroundColor))
  assert.notEqual(right.transform, 'none')
  await page.screenshot({ path: `${output}/02-drag-right.png` })
  await page.mouse.up()
  await page.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
  await page.waitForTimeout(250)
  assert.equal((await history(page)).length, 1)
  await page.screenshot({ path: `${output}/04-next-card.png` })
  await page.reload()
  await page.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
  await page.getByRole('button', { name: 'Bring it back' }).click()
  await page.getByRole('group', { name: 'Card 1 of 2' }).waitFor()
  await page.waitForTimeout(250)
  assert.equal((await history(page)).length, 0)
  const left = await drag(page, -135)
  assert.equal(left.color, await page.locator('.sort-screen__button--rest').evaluate(el => getComputedStyle(el).backgroundColor))
  await page.screenshot({ path: `${output}/03-drag-left.png` })
  await page.mouse.up()
  await page.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
  await page.getByRole('button', { name: 'Bring it back' }).click()
  await page.waitForTimeout(250)
  await drag(page, 25)
  await page.mouse.up()
  await page.waitForTimeout(650)
  assert.equal((await history(page)).length, 0)
  const neutralColor = await page.evaluate(() => {
    const sample = document.createElement('span')
    sample.style.color = 'var(--color-accent-blue-500)'
    document.body.appendChild(sample)
    const value = getComputedStyle(sample).color
    sample.remove()
    return value
  })
  assert.equal(await page.locator('.sort-deck__card').evaluate(el => getComputedStyle(el).color), neutralColor)
  await page.getByRole('button', { name: 'In My Hands' }).dblclick()
  await page.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
  assert.equal((await history(page)).length, 1)
  await page.getByRole('button', { name: 'Rest It Here' }).click()
  await page.getByRole('heading', { name: 'All sorted, for now.' }).waitFor()
  assert.equal((await history(page)).length, 2)
  await page.close()

  for (const [width, height] of [[402, 812], [320, 667], [780, 900]]) {
    const mobile = await open(width, height)
    await mobile.getByRole('button', { name: 'In My Hands' }).click()
    await mobile.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
    await mobile.waitForTimeout(250)
    const gap = await mobile.evaluate(() => document.querySelector('.sort-screen__undo').getBoundingClientRect().top - document.querySelector('.sort-deck__card').getBoundingClientRect().bottom)
    assert.ok(gap >= 12, `Undo overlaps card at ${width}px: ${gap}`)
    await mobile.screenshot({ path: `${output}/next-${width}x${height}.png`, fullPage: true })
    await drag(mobile, 135)
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await mobile.mouse.up()
    await mobile.getByRole('heading', { name: 'All sorted, for now.' }).waitFor()
    await mobile.close()
  }
  const reduced = await open(402, 812, 'reduce')
  await reduced.getByRole('button', { name: 'In My Hands' }).click()
  await reduced.getByRole('group', { name: 'Card 2 of 2' }).waitFor()
  await reduced.close()
  assert.deepEqual(errors, [])
  console.log('PASS: live drag colors, both swipes, cancelled drag, undo, refresh, double-click guard, completion, responsive layout, reduced motion, no runtime errors')
} finally {
  await browser.close()
}
