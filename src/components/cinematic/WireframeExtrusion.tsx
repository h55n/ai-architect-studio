'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function WireframeExtrusion() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = null  // transparent

    // Camera
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.set(6, 5, 8)
    camera.lookAt(0, 1.5, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Ground grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x1A56DB, 0x1A56DB)
    const gridMat = gridHelper.material as THREE.LineBasicMaterial
    gridMat.opacity = 0.2
    gridMat.transparent = true
    scene.add(gridHelper)

    // Building floors — extruding from ground
    const floors: THREE.Mesh[] = []
    const material = new THREE.MeshBasicMaterial({
      color: 0xC4C3E3,
      wireframe: true,
    })
    const baseHeight = 0.01
    const targetHeight = 3
    const baseGeo = new THREE.BoxGeometry(3, baseHeight, 2)

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(baseGeo, material)
      mesh.position.set(0, i * 3, 0)
      scene.add(mesh)
      floors.push(mesh)
    }

    let elapsed = 0
    let animFrame: number

    const animate = () => {
      animFrame = requestAnimationFrame(animate)
      elapsed += 0.016

      // Extrude each floor on a staggered timeline
      floors.forEach((floor, i) => {
        const delay = i * 0.8
        const t = Math.max(0, Math.min(1, (elapsed - delay) / 1.2))
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease in-out quad
        floor.scale.y = Math.max(0.001, eased * (targetHeight / baseHeight))
        floor.position.y = i * targetHeight + (eased * targetHeight) / 2
      })

      // Slow camera orbit
      camera.position.x = Math.sin(elapsed * 0.15) * 8
      camera.position.z = Math.cos(elapsed * 0.15) * 8
      camera.lookAt(0, 1.5, 0)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const W2 = mount.clientWidth
      const H2 = mount.clientHeight
      camera.aspect = W2 / H2
      camera.updateProjectionMatrix()
      renderer.setSize(W2, H2)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', handleResize)
      
      gridMat.dispose()
      gridHelper.geometry.dispose()
      material.dispose()
      baseGeo.dispose()
      
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={mountRef} className="w-full h-full" aria-hidden="true" />
  )
}
