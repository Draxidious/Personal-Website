import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [3, 3, 3], fov: 50 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <Scene />
    </Canvas>
  )
}
