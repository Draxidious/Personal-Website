import { Suspense, lazy } from 'react'

const Experience = lazy(() => import('./Experience'))

export function App() {
  return (
    <Suspense fallback={null}>
      <Experience />
    </Suspense>
  )
}
