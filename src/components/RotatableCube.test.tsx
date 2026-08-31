import { describe, expect, it } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import type * as THREE from 'three'
import { RotatableCube } from './RotatableCube'

describe('RotatableCube', () => {
  it('renders a single box mesh named "rotatable-cube"', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RotatableCube />)

    const mesh = renderer.scene.children[0]
    expect(mesh.type).toBe('Mesh')
    expect(mesh.instance.name).toBe('rotatable-cube')
    expect((mesh.instance as THREE.Mesh).geometry.type).toBe('BoxGeometry')
  })

  it('does not rotate until it is clicked', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RotatableCube />)
    const mesh = renderer.scene.children[0]

    await renderer.advanceFrames(10, 1 / 60)

    expect((mesh.instance as THREE.Mesh).rotation.y).toBe(0)
  })

  it('starts rotating once clicked', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RotatableCube />)
    const mesh = renderer.scene.children[0]

    await renderer.fireEvent(mesh, 'click')
    await renderer.advanceFrames(10, 1 / 60)

    expect((mesh.instance as THREE.Mesh).rotation.y).toBeGreaterThan(0)
  })

  it('stops rotating when clicked a second time', async () => {
    const renderer = await ReactThreeTestRenderer.create(<RotatableCube />)
    const mesh = renderer.scene.children[0]

    await renderer.fireEvent(mesh, 'click')
    await renderer.advanceFrames(10, 1 / 60)
    const rotationWhileSpinning = (mesh.instance as THREE.Mesh).rotation.y

    await renderer.fireEvent(mesh, 'click')
    await renderer.advanceFrames(10, 1 / 60)

    expect((mesh.instance as THREE.Mesh).rotation.y).toBe(rotationWhileSpinning)
  })
})
