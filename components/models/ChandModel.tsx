'use client'

import dynamic from 'next/dynamic'
import { Spinner } from '../ui/Spinner'

const Model3DWrapper = dynamic(
  () => import('./Model3DWrapper').then((mod) => mod.Model3DWrapper),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[280px] flex items-center justify-center bg-primary/5 rounded-2xl">
        <Spinner size="lg" />
      </div>
    ),
  }
)

const GLTFModel = dynamic(
  () => import('./Model3DWrapper').then((mod) => mod.GLTFModel),
  { ssr: false }
)

interface ChandModelProps {
  className?: string
  scale?: number
  autoRotate?: boolean
  onClick?: () => void
}

export function ChandModel({ 
  className = '', 
  scale = 1.2,
  autoRotate = true,
  onClick,
}: ChandModelProps) {
  return (
    <div onClick={onClick} className={`cursor-pointer ${className}`}>
      <Model3DWrapper
        className={className}
        autoRotate={autoRotate}
        cameraPosition={[0, 0, 5]}
        cameraFov={45}
        ambientIntensity={2}
        height="100%"
      >
        <GLTFModel
          path="/models/chand.glb"
          scale={scale}
          position={[0, 0, 0]}
          floatSpeed={0.8}
          floatIntensity={0.15}
        />
      </Model3DWrapper>
    </div>
  )
}

export default ChandModel
