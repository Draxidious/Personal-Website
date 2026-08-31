import { expect, test } from '@playwright/test'

test.describe('rotatable cube scene', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()

    // The canvas starts at the browser's default 300x150 size and is resized
    // to fill the viewport once React Three Fiber's ResizeObserver fires.
    // Wait for that before interacting, otherwise clicks land on the wrapper
    // div instead of the canvas.
    await page.waitForFunction(() => {
      const canvasEl = document.querySelector('canvas')
      return (
        !!canvasEl &&
        canvasEl.width === window.innerWidth &&
        canvasEl.height === window.innerHeight
      )
    })
  })

  test('renders the cube at rest and matches the baseline screenshot', async ({ page }) => {
    // The cube is static until clicked, so this frame is deterministic and
    // safe to compare against a committed pixel baseline.
    await expect(page).toHaveScreenshot('rotatable-cube-initial.png')
  })

  test('starts rotating continuously once clicked', async ({ page }) => {
    // Once spinning, the cube never stops moving, so it can't be matched
    // against a fixed baseline image. Instead, prove the click has an
    // ongoing visual effect: the canvas keeps changing frame over frame.
    const canvas = page.locator('canvas')

    const beforeClick = await canvas.screenshot()
    await canvas.click()
    await page.waitForTimeout(300)
    const shortlyAfterClick = await canvas.screenshot()
    await page.waitForTimeout(300)
    const laterStill = await canvas.screenshot()

    expect(beforeClick.equals(shortlyAfterClick)).toBe(false)
    expect(shortlyAfterClick.equals(laterStill)).toBe(false)
  })

  test('stops rotating when clicked a second time', async ({ page }) => {
    const canvas = page.locator('canvas')

    await canvas.click() // start spinning
    await page.waitForTimeout(300)
    await canvas.click() // stop spinning

    const justStopped = await canvas.screenshot()
    await page.waitForTimeout(300)
    const stillStopped = await canvas.screenshot()

    expect(justStopped.equals(stillStopped)).toBe(true)
  })
})
