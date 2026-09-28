import { lazy, Suspense } from 'react'
import { Lights } from './Lights'
import { RotatableCube } from './RotatableCube'

const DevSceneEditor = import.meta.env.DEV
  ? lazy(() => import('./DevSceneEditor'))
  : null

export function Scene() {
  return (
    <>
      <Lights />
      {DevSceneEditor ? (
        <Suspense fallback={<RotatableCube />}>
          <DevSceneEditor />
        </Suspense>
      ) : (
        <RotatableCube />
      )}
    </>
  )
}
