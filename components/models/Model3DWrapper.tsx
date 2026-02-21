'use client'

import { Suspense, ReactNode, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, useGLTF, useProgress, Html, Center, RoundedBox, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { Spinner } from '../ui/Spinner'

interface Model3DWrapperProps {
  children: ReactNode
  className?: string
  enableZoom?: boolean
  enablePan?: boolean
  autoRotate?: boolean
  cameraPosition?: [number, number, number]
  cameraFov?: number
  ambientIntensity?: number
  showEnvironment?: boolean
  backgroundColor?: string
  height?: string
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <p className="text-primary text-sm">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

export function Model3DWrapper({
  children,
  className = '',
  enableZoom = false,
  enablePan = false,
  autoRotate = true,
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  ambientIntensity = 1.5,
  showEnvironment = true,
  backgroundColor = 'transparent',
  height = '100%',
}: Model3DWrapperProps) {
  const [dpr, setDpr] = useState(1.5)
  return (
    <div className={`w-full ${className}`} style={{ height, minHeight: '280px' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        style={{ width: '100%', height: '100%', background: backgroundColor }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={dpr}
      >
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
        <Suspense fallback={<Loader />}>
          {/* Ambient light for base visibility */}
          <ambientLight intensity={ambientIntensity} color="#ffffff" />

          {/* Main directional lights */}
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />
          <directionalLight position={[0, -5, 5]} intensity={0.8} color="#ffffff" />

          {/* Hemisphere light for natural look */}
          <hemisphereLight args={['#ffffff', '#444444', 0.8]} />

          {/* Environment for reflections */}
          {showEnvironment && <Environment preset="studio" />}

          {/* Center the model */}
          <Center>
            {children}
          </Center>

          <OrbitControls
            enableZoom={enableZoom}
            enablePan={enablePan}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

interface GLTFModelProps {
  path: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  floatSpeed?: number
  floatIntensity?: number
  enableFloat?: boolean
}

function FallbackModel({ color = '#0e7a6e' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <RoundedBox ref={meshRef} args={[1.5, 2, 0.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.15]}>
        <torusGeometry args={[0.4, 0.04, 16, 32]} />
        <meshStandardMaterial color="#C8A951" metalness={0.6} roughness={0.3} />
      </mesh>
    </Float>
  )
}

export function GLTFModel({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  floatSpeed = 2,
  floatIntensity = 0.2,
  enableFloat = true,
}: GLTFModelProps) {
  let scene: THREE.Group | null = null
  let loadError = false

  try {
    const result = useGLTF(path)
    scene = result.scene
  } catch (error) {
    console.warn(`Failed to load model: ${path}`, error)
    loadError = true
  }

  if (loadError || !scene) {
    return <FallbackModel />
  }

  // Clone scene to avoid mutation issues
  const clonedScene = scene.clone()

  const model = (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )

  if (enableFloat) {
    return (
      <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={floatIntensity}>
        {model}
      </Float>
    )
  }

  return model
}

// Preload helper
export function preloadModel(path: string) {
  useGLTF.preload(path)
}
