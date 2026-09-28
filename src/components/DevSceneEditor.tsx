import { useEffect, useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import { useControls } from 'leva'
import type { Group } from 'three'
import { RotatableCube } from './RotatableCube'

const STORAGE_KEY = 'scene-editor:cube-transform'

type Vec3 = [number, number, number]
type Transform = { position: Vec3; rotation: Vec3; scale: Vec3 }

const DEFAULT_TRANSFORM: Transform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
}

function loadTransform(): Transform {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_TRANSFORM, ...JSON.parse(raw) } : DEFAULT_TRANSFORM
  } catch {
    return DEFAULT_TRANSFORM
  }
}

function persistTransformFrom(group: Group) {
  const transform: Transform = {
    position: group.position.toArray() as Vec3,
    rotation: [group.rotation.x, group.rotation.y, group.rotation.z],
    scale: group.scale.toArray() as Vec3,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transform))
  return transform
}

export default function DevSceneEditor() {
  const groupRef = useRef<Group>(null!)
  const initial = useRef(loadTransform()).current

  const [, set] = useControls(() => ({
    position: {
      value: initial.position,
      step: 0.1,
      onChange: (value: Vec3) => {
        groupRef.current?.position.set(...value)
        if (groupRef.current) persistTransformFrom(groupRef.current)
      },
    },
    rotation: {
      value: initial.rotation,
      step: 0.1,
      onChange: (value: Vec3) => {
        groupRef.current?.rotation.set(...value)
        if (groupRef.current) persistTransformFrom(groupRef.current)
      },
    },
    scale: {
      value: initial.scale,
      step: 0.1,
      onChange: (value: Vec3) => {
        groupRef.current?.scale.set(...value)
        if (groupRef.current) persistTransformFrom(groupRef.current)
      },
    },
  }))

  useEffect(() => {
    const group = groupRef.current
    group.position.set(...initial.position)
    group.rotation.set(...initial.rotation)
    group.scale.set(...initial.scale)
  }, [initial])

  const handleObjectChange = () => {
    const group = groupRef.current
    if (!group) return
    set(persistTransformFrom(group))
  }

  return (
    <TransformControls onObjectChange={handleObjectChange}>
      <group ref={groupRef}>
        <RotatableCube />
      </group>
    </TransformControls>
  )
}
