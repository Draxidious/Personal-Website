import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import type { Mesh } from 'three'

const ROTATION_SPEED = Math.PI / 2 // radians per second

export function RotatableCube() {
  const meshRef = useRef<Mesh>(null!)
  const [isSpinning, setIsSpinning] = useState(false)
  const [hovered, setHovered] = useState(false)

  useCursor(hovered)

  useFrame((_state, delta) => {
    if (isSpinning) {
      meshRef.current.rotation.y += delta * ROTATION_SPEED
    }
  })

  return (
    <mesh
      ref={meshRef}
      name="rotatable-cube"
      onClick={(event) => {
        event.stopPropagation?.()
        setIsSpinning((spinning) => !spinning)
      }}
      onPointerOver={(event) => {
        event.stopPropagation?.()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isSpinning ? 'orange' : 'royalblue'} />
    </mesh>
  )
}
