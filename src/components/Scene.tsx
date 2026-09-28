import { TransformControls } from '@react-three/drei'
import { Lights } from './Lights'
import { RotatableCube } from './RotatableCube'

export function Scene() {
  const cube = <RotatableCube />

  return (
    <>
      <Lights />
      {import.meta.env.DEV ? (
        <TransformControls>{cube}</TransformControls>
      ) : (
        cube
      )}
    </>
  )
}
